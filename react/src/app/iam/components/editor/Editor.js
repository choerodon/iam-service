import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { axios, Content } from '@choerodon/boot';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import { Modal, Input, Button, Form, Tabs, Upload, Icon } from 'choerodon-ui';
import { FormattedMessage, injectIntl } from 'react-intl';

const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const limitSize = 5120;
const Align = Quill.import('attributors/style/align');
Align.whitelist = ['right', 'center', 'justify'];
Quill.register(Align, true);

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px'];
Quill.register(Size, true);

const Font = Quill.import('attributors/style/font');
Font.whitelist = ['STSong', 'STKaiti', 'STHeiti', 'STFangsong', 'SimSun', 'KaiTi', 'SimHei', 'FangSong', 'Microsoft-YaHei'];
Quill.register(Font, true);

const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
    </span>
    <span className="ql-formats">
      <select className="ql-header">
        <option selected />
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
      </select>
      {
        navigator.platform.indexOf('Mac') > -1 ? (
          <select className="ql-font">
            <option selected />
            <option value="STSong">华文宋体</option>
            <option value="STKaiti">华文楷体</option>
            <option value="STHeiti">华文黑体</option>
            <option value="STFangsong">华文仿宋</option>
          </select>
        ) : (
          <select className="ql-font">
            <option selected />
            <option value="SimSun">宋体</option>
            <option value="KaiTi">楷体</option>
            <option value="SimHei">黑体</option>
            <option value="FangSong">仿宋</option>
            <option value="Microsoft-YaHei">微软雅黑</option>
          </select>
        )
      }
      <select className="ql-size">
        <option value="10px" />
        <option value="12px" />
        <option value="14px" />
        <option value="16px" />
        <option value="18px" />
        <option value="20px" />
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-code-block" />
    </span>
  </div>
);

@Form.create()
@injectIntl
export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.urlFocusInput = React.createRef();
    this.onQuillChange = this.onQuillChange.bind(this);
    this.state = {
      editor: null,
      delta: null,
      originalHtml: null,
      htmlString: null,
      isShowHtmlContainer: false,
      isShowModal: false,
      previewUrl: null, // 网络上传预览图片url
      changedHtml: null,
      range: null,
      file: null,
      localSrc: null, // 本地图片上传前的blob
      submitting: false,
      type: 'online',
    };
  }

  componentWillMount() {
    this.props.onRef(this);
  }

  // 点击code按钮
  changeToHtml = () => {
    const { delta, originalHtml } = this.state;
    if (delta) {
      this.setState({
        htmlString: originalHtml,
        isShowHtmlContainer: true,
      });
    } else {
      this.setState({
        htmlString: null,
        isShowHtmlContainer: true,
      });
    }
  }

  initEditor = () => {
    const { isShowHtmlContainer } = this.state;
    if (isShowHtmlContainer) {
      this.setState({
        isShowHtmlContainer: false,
      });
    }
    if (this.state.htmlString) {
      this.props.onChange(this.state.htmlString);
    }
  }

  // 返回可视化编辑
  backEdit = () => {
    this.setState({
      isShowHtmlContainer: false,
    });
    this.props.onChange(this.state.htmlString);
  }


  handleChangedHTML = (e) => {
    this.setState({
      htmlString: e.target.value,
    }, () => {
      this.props.onChange(this.state.htmlString);
    });
  }

  // 开启上传图片模态框
  handleOpenModal = () => {
    const range = this.quillRef.getEditor().getSelection();
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      isShowModal: true,
      previewUrl: null,
      file: null,
      localSrc: null,
      type: 'online',
      range,
    });
  }

  // 关闭图片模态框
  handleCloseModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 预览图片
  previewPic = () => {
    const { getFieldValue } = this.props.form;
    this.setState({
      previewUrl: getFieldValue('imgUrl'),
    });
  }

  loadImage(src) {
    this.setState({ localSrc: src });
  }

  getUploadProps() {
    const { intl } = this.props;
    return {
      multiple: false,
      name: 'file',
      accept: 'image/jpeg, image/png, image/jpg, image/gif',
      action: `${Choerodon.API_HOST}/file/v1/file?/bucket_name=file&file_name=file`,
      headers: {
        Authorization: `bearer ${Choerodon.getCookie('access_token')}`,
      },
      showUploadList: false,
      beforeUpload: (file) => {
        const { size } = file;
        if (size > limitSize * 1024) {
          Choerodon.prompt(intl.formatMessage({ id: 'editor.file.size.limit' }, { size: `${limitSize / 1024}M` }));
          return false;
        }
        this.setState({ file });
        const windowURL = window.URL || window.webkitURL;
        if (windowURL && windowURL.createObjectURL) {
          this.loadImage(windowURL.createObjectURL(file));
          return false;
        }
      },
      onChange: ({ file }) => {
        const { status, response } = file;
        if (status === 'done') {
          this.loadImage(response);
        } else if (status === 'error') {
          Choerodon.prompt(`${response.message}`);
        }
      },
    };
  }

  insertToEditor = (url = null) => {
    const { type, range } = this.state;
    if (type === 'online') {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // Quill.sources.USER
          this.quillRef.getEditor().insertEmbed(range.index, 'image', values.imgUrl); // 在当前光标位置插入图片
        }
      });
    } else {
      this.quillRef.getEditor().insertEmbed(range.index, 'image', url); // 在当前光标位置插入图片
    }
    this.quillRef.getEditor().setSelection(range.index + 1); // 移动光标位置至图片后
    this.setState({
      isShowModal: false,
    });
  }

  handleOk = () => {
    const { type } = this.state;
    if (type === 'online') {
      this.insertToEditor();
    } else {
      const { file } = this.state;
      const data = new FormData();
      data.append('file', file);
      this.setState({ submitting: true });
      axios.post(`${Choerodon.API_HOST}/file/v1/files?bucket_name=file&file_name=file`, data)
        .then((res) => {
          if (res.failed) {
            Choerodon.prompt(res.message);
          } else {
            this.insertToEditor(res);
          }
          this.setState({ submitting: false });
        })
        .catch((error) => {
          Choerodon.handleResponseError(error);
          this.setState({ submitting: false });
        });
    }
  };

  changeUploadType = (type) => {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      file: null,
      localSrc: null,
      previewUrl: null,
      type,
    });
  }


  /**
   *
   * @param content HTML格式的内容
   * @param delta delta格式的内容
   * @param source change的触发者 user/silent/api
   * @param editor 文本框对象
   */
  onQuillChange = (content, delta, source, editor) => {
    if (this.props.onChange) this.props.onChange(content);
    const currentDelta = editor.getContents();
    const originalHtml = editor.getHTML();
    this.setState({
      delta: currentDelta,
      originalHtml,
      editor,
    });
  }

  renderLocal = () => {
    const props = this.getUploadProps();
    const { localSrc } = this.state;
    return (
      <React.Fragment>
        <Dragger className="c7n-iam-editor-dragger" {...props}>
          {
            localSrc ? (<React.Fragment>
              <div style={{ backgroundImage: `url(${localSrc})` }} className="c7n-iam-editor-dragger-preview-pic" />
            </React.Fragment>) : (
              <React.Fragment>
                <Icon type="inbox" />
                <h3 className="c7n-iam-editor-dragger-text">
                  <FormattedMessage id="editor.dragger.text" />
                </h3>
                <h4 className="c7n-iam-editor-dragger-hint">
                  <FormattedMessage
                    id="editor.dragger.hint"
                    values={{ size: `${limitSize / 1024}M`, access: 'PNG、JPG、JPEG、GIF' }}
                  />
                </h4>
              </React.Fragment>
            )
          }
        </Dragger>
      </React.Fragment>
    );
  }

  renderOnline = () => {
    const { previewUrl } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <React.Fragment>
        <div className="c7n-iam-editor-modal-preview-top">
          <Form
            style={{ display: 'inline-block' }}
          >
            <FormItem>
              {
                getFieldDecorator('imgUrl', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: 'editor.pic.url.required' }),
                  }],
                })(
                  <Input
                    ref={(e) => {
                      this.urlFocusInput = e;
                    }}
                    style={{ width: '438px', verticalAlign: 'middle' }}
                    label={<FormattedMessage id="editor.pic.url" />}
                    id="c7n-iam-editor-input"
                    autoComplete="off"
                  />,
                )
              }
            </FormItem>
          </Form>
          <Button
            className="c7n-iam-editor-modal-preview-top-btn"
            funcType="raised"
            onClick={this.previewPic}
          >
            <FormattedMessage id="editor.view" />
          </Button>
        </div>
        <div className="c7n-iam-editor-modal-preview-content">
          <div className="c7n-iam-editor-modal-preview-sentence">
            <FormattedMessage id="editor.preview" />
          </div>
          <div style={{ backgroundImage: `url(${previewUrl})` }} className="c7n-iam-editor-modal-preview-pic" />
        </div>
      </React.Fragment>
    );
  }

  modules = {
    toolbar: {
      container: '#toolbar',
      handlers: {
        image: this.handleOpenModal,
        'code-block': this.changeToHtml,
      },
    },
  }

  formats = [
    'bold',
    'italic',
    'underline',
    'header',
    'list',
    'bullet',
    'link',
    'image',
    'color',
    'font',
    'size',
    'align',
    'code-block',
  ];

  defaultStyle = {
    width: '100%',
    height: 320,
  };

  render() {
    const { value } = this.props;
    const { isShowHtmlContainer, isShowModal, htmlString, submitting, localSrc, type } = this.state;
    const style = { ...this.defaultStyle, ...this.props.style };
    const editHeight = style.height - 42;
    const modalFooter = [
      <Button disabled={submitting} key="cancel" onClick={this.handleCloseModal}>
        <FormattedMessage id="cancel" />
      </Button>,
      <Button key="save" type="primary" disabled={!localSrc && type === 'local'} loading={submitting} onClick={this.handleOk}>
        <FormattedMessage id="save" />
      </Button>,
    ];
    return (
      <div style={style} className="c7n-iam-react-quill-editor">
        <CustomToolbar />
        <ReactQuill
          id="c7n-iam-editor"
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          style={{ height: editHeight }}
          value={value}
          onChange={this.onQuillChange}
          bounds="#c7n-iam-editor"
          ref={(el) => { this.quillRef = el; }}
        />
        <div className="c7n-editor-changedHTML-container" style={{ display: isShowHtmlContainer ? 'block' : 'none' }}>
          <div className="c7n-editor-changedHTML-container-toolbar">
            <span onClick={this.backEdit}>
              {'<< '}
              <FormattedMessage id="editor.back.gui" />
            </span>
          </div>
          <textarea className="c7n-editor-changedHTML-container-content" onChange={this.handleChangedHTML} value={htmlString} />
        </div>
        <Modal
          width={560}
          visible={isShowModal}
          maskClosable={false}
          closable={false}
          title={<FormattedMessage id="editor.add.pic" />}
          okText={<FormattedMessage id="add" />}
          onCancel={this.handleCloseModal}
          onOk={this.savePic}
          footer={modalFooter}
        >
          <Tabs onChange={this.changeUploadType} activeKey={type} style={{ marginTop: '10px' }}>
            <TabPane tab={<FormattedMessage id="editor.online.pic" />} key="online">
              {this.renderOnline()}
            </TabPane>
            <TabPane tab={<FormattedMessage id="editor.local.upload" />} key="local">
              {this.renderLocal()}
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

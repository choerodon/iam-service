'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _upload = require('choerodon-ui/lib/upload');

var _upload2 = _interopRequireDefault(_upload);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _dec, _class, _class2, _temp, _initialiseProps;

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/upload/style');

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactQuill = require('react-quill');

var _reactQuill2 = _interopRequireDefault(_reactQuill);

var _choerodonBootCombine = require('choerodon-boot-combine');

require('react-quill/dist/quill.snow.css');

require('./Editor.scss');

var _reactIntl = require('react-intl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabPane = _tabs2['default'].TabPane;
var Dragger = _upload2['default'].Dragger;
var FormItem = _form2['default'].Item;
var limitSize = 5120;
var Align = _reactQuill.Quill['import']('attributors/style/align');
Align.whitelist = ['right', 'center', 'justify'];
_reactQuill.Quill.register(Align, true);

var Size = _reactQuill.Quill['import']('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px'];
_reactQuill.Quill.register(Size, true);

var Font = _reactQuill.Quill['import']('attributors/style/font');
Font.whitelist = ['STSong', 'STKaiti', 'STHeiti', 'STFangsong', 'SimSun', 'KaiTi', 'SimHei', 'FangSong', 'Microsoft-YaHei'];
_reactQuill.Quill.register(Font, true);

var CustomToolbar = function CustomToolbar() {
  return _react2['default'].createElement(
    'div',
    { id: 'toolbar' },
    _react2['default'].createElement(
      'span',
      { className: 'ql-formats' },
      _react2['default'].createElement('button', { className: 'ql-bold' }),
      _react2['default'].createElement('button', { className: 'ql-italic' }),
      _react2['default'].createElement('button', { className: 'ql-underline' })
    ),
    _react2['default'].createElement(
      'span',
      { className: 'ql-formats' },
      _react2['default'].createElement('button', { className: 'ql-list', value: 'ordered' }),
      _react2['default'].createElement('button', { className: 'ql-list', value: 'bullet' })
    ),
    _react2['default'].createElement(
      'span',
      { className: 'ql-formats' },
      _react2['default'].createElement('select', { className: 'ql-align' }),
      _react2['default'].createElement('select', { className: 'ql-color' })
    ),
    _react2['default'].createElement(
      'span',
      { className: 'ql-formats' },
      _react2['default'].createElement(
        'select',
        { className: 'ql-header' },
        _react2['default'].createElement('option', { selected: true }),
        _react2['default'].createElement(
          'option',
          { value: '1' },
          'H1'
        ),
        _react2['default'].createElement(
          'option',
          { value: '2' },
          'H2'
        ),
        _react2['default'].createElement(
          'option',
          { value: '3' },
          'H3'
        ),
        _react2['default'].createElement(
          'option',
          { value: '4' },
          'H4'
        ),
        _react2['default'].createElement(
          'option',
          { value: '5' },
          'H5'
        ),
        _react2['default'].createElement(
          'option',
          { value: '6' },
          'H6'
        )
      ),
      navigator.platform.indexOf('Mac') > -1 ? _react2['default'].createElement(
        'select',
        { className: 'ql-font' },
        _react2['default'].createElement('option', { selected: true }),
        _react2['default'].createElement(
          'option',
          { value: 'STSong' },
          '\u534E\u6587\u5B8B\u4F53'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'STKaiti' },
          '\u534E\u6587\u6977\u4F53'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'STHeiti' },
          '\u534E\u6587\u9ED1\u4F53'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'STFangsong' },
          '\u534E\u6587\u4EFF\u5B8B'
        )
      ) : _react2['default'].createElement(
        'select',
        { className: 'ql-font' },
        _react2['default'].createElement('option', { selected: true }),
        _react2['default'].createElement(
          'option',
          { value: 'SimSun' },
          '\u5B8B\u4F53'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'KaiTi' },
          '\u6977\u4F53'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'SimHei' },
          '\u9ED1\u4F53'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'FangSong' },
          '\u4EFF\u5B8B'
        ),
        _react2['default'].createElement(
          'option',
          { value: 'Microsoft-YaHei' },
          '\u5FAE\u8F6F\u96C5\u9ED1'
        )
      ),
      _react2['default'].createElement(
        'select',
        { className: 'ql-size' },
        _react2['default'].createElement('option', { value: '10px' }),
        _react2['default'].createElement('option', { value: '12px' }),
        _react2['default'].createElement('option', { value: '14px' }),
        _react2['default'].createElement('option', { value: '16px' }),
        _react2['default'].createElement('option', { value: '18px' }),
        _react2['default'].createElement('option', { value: '20px' })
      )
    ),
    _react2['default'].createElement(
      'span',
      { className: 'ql-formats' },
      _react2['default'].createElement('button', { className: 'ql-link' }),
      _react2['default'].createElement('button', { className: 'ql-image' }),
      _react2['default'].createElement('button', { className: 'ql-code-block' })
    )
  );
};

var Editor = (_dec = _form2['default'].create(), _dec(_class = (0, _reactIntl.injectIntl)(_class = (_temp = _class2 = function (_Component) {
  (0, _inherits3['default'])(Editor, _Component);

  function Editor(props) {
    (0, _classCallCheck3['default'])(this, Editor);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

    _initialiseProps.call(_this);

    _this.urlFocusInput = _react2['default'].createRef();
    _this.onQuillChange = _this.onQuillChange.bind(_this);
    _this.state = {
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
      type: 'online'
    };
    return _this;
  }

  (0, _createClass3['default'])(Editor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.onRef(this);
    }

    // 点击code按钮


    // 返回可视化编辑


    // 开启上传图片模态框


    // 关闭图片模态框


    // 预览图片

  }, {
    key: 'loadImage',
    value: function loadImage(src) {
      this.setState({ localSrc: src });
    }
  }, {
    key: 'getUploadProps',
    value: function getUploadProps() {
      var _this2 = this;

      var intl = this.props.intl;

      return {
        multiple: false,
        name: 'file',
        accept: 'image/jpeg, image/png, image/jpg, image/gif',
        action: Choerodon.API_HOST + '/file/v1/file?/bucket_name=file&file_name=file',
        headers: {
          Authorization: 'bearer ' + Choerodon.getCookie('access_token')
        },
        showUploadList: false,
        beforeUpload: function beforeUpload(file) {
          var size = file.size;

          if (size > limitSize * 1024) {
            Choerodon.prompt(intl.formatMessage({ id: 'editor.file.size.limit' }, { size: limitSize / 1024 + 'M' }));
            return false;
          }
          _this2.setState({ file: file });
          var windowURL = window.URL || window.webkitURL;
          if (windowURL && windowURL.createObjectURL) {
            _this2.loadImage(windowURL.createObjectURL(file));
            return false;
          }
        },
        onChange: function onChange(_ref) {
          var file = _ref.file;
          var status = file.status,
              response = file.response;

          if (status === 'done') {
            _this2.loadImage(response);
          } else if (status === 'error') {
            Choerodon.prompt('' + response.message);
          }
        }
      };
    }

    /**
     *
     * @param content HTML格式的内容
     * @param delta delta格式的内容
     * @param source change的触发者 user/silent/api
     * @param editor 文本框对象
     */

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var value = this.props.value;
      var _state = this.state,
          isShowHtmlContainer = _state.isShowHtmlContainer,
          isShowModal = _state.isShowModal,
          htmlString = _state.htmlString,
          submitting = _state.submitting,
          localSrc = _state.localSrc,
          type = _state.type;

      var style = (0, _extends3['default'])({}, this.defaultStyle, this.props.style);
      var editHeight = style.height - 42;
      var modalFooter = [_react2['default'].createElement(
        _button2['default'],
        { disabled: submitting, key: 'cancel', onClick: this.handleCloseModal },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
      ), _react2['default'].createElement(
        _button2['default'],
        { key: 'save', type: 'primary', disabled: !localSrc && type === 'local', loading: submitting, onClick: this.handleOk },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
      )];
      return _react2['default'].createElement(
        'div',
        { style: style, className: 'c7n-iam-react-quill-editor' },
        _react2['default'].createElement(CustomToolbar, null),
        _react2['default'].createElement(_reactQuill2['default'], {
          id: 'c7n-iam-editor',
          theme: 'snow',
          modules: this.modules,
          formats: this.formats,
          style: { height: editHeight },
          value: value,
          onChange: this.onQuillChange,
          bounds: '#c7n-iam-editor',
          ref: function ref(el) {
            _this3.quillRef = el;
          }
        }),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-editor-changedHTML-container', style: { display: isShowHtmlContainer ? 'block' : 'none' } },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-editor-changedHTML-container-toolbar' },
            _react2['default'].createElement(
              'span',
              { onClick: this.backEdit },
              '<< ',
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.back.gui' })
            )
          ),
          _react2['default'].createElement('textarea', { className: 'c7n-editor-changedHTML-container-content', onChange: this.handleChangedHTML, value: htmlString })
        ),
        _react2['default'].createElement(
          _modal2['default'],
          {
            width: 560,
            visible: isShowModal,
            maskClosable: false,
            closable: false,
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.add.pic' }),
            okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' }),
            onCancel: this.handleCloseModal,
            onOk: this.savePic,
            footer: modalFooter
          },
          _react2['default'].createElement(
            _tabs2['default'],
            { onChange: this.changeUploadType, activeKey: type, style: { marginTop: '10px' } },
            _react2['default'].createElement(
              TabPane,
              { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.online.pic' }), key: 'online' },
              this.renderOnline()
            ),
            _react2['default'].createElement(
              TabPane,
              { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.local.upload' }), key: 'local' },
              this.renderLocal()
            )
          )
        )
      );
    }
  }]);
  return Editor;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.changeToHtml = function () {
    var _state2 = _this4.state,
        delta = _state2.delta,
        originalHtml = _state2.originalHtml;

    if (delta) {
      _this4.setState({
        htmlString: originalHtml,
        isShowHtmlContainer: true
      });
    } else {
      _this4.setState({
        htmlString: null,
        isShowHtmlContainer: true
      });
    }
  };

  this.initEditor = function () {
    var isShowHtmlContainer = _this4.state.isShowHtmlContainer;

    if (isShowHtmlContainer) {
      _this4.setState({
        isShowHtmlContainer: false
      });
    }
    if (_this4.state.htmlString) {
      _this4.props.onChange(_this4.state.htmlString);
    }
  };

  this.backEdit = function () {
    _this4.setState({
      isShowHtmlContainer: false
    });
    _this4.props.onChange(_this4.state.htmlString);
  };

  this.handleChangedHTML = function (e) {
    _this4.setState({
      htmlString: e.target.value
    }, function () {
      _this4.props.onChange(_this4.state.htmlString);
    });
  };

  this.handleOpenModal = function () {
    var range = _this4.quillRef.getEditor().getSelection();
    var resetFields = _this4.props.form.resetFields;

    resetFields();
    _this4.setState({
      isShowModal: true,
      previewUrl: null,
      file: null,
      localSrc: null,
      type: 'online',
      range: range
    });
  };

  this.handleCloseModal = function () {
    _this4.setState({
      isShowModal: false
    });
  };

  this.previewPic = function () {
    var getFieldValue = _this4.props.form.getFieldValue;

    _this4.setState({
      previewUrl: getFieldValue('imgUrl')
    });
  };

  this.insertToEditor = function () {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var _state3 = _this4.state,
        type = _state3.type,
        range = _state3.range;

    if (type === 'online') {
      _this4.props.form.validateFieldsAndScroll(function (err, values) {
        if (!err) {
          // Quill.sources.USER
          _this4.quillRef.getEditor().insertEmbed(range.index, 'image', values.imgUrl); // 在当前光标位置插入图片
        }
      });
    } else {
      _this4.quillRef.getEditor().insertEmbed(range.index, 'image', url); // 在当前光标位置插入图片
    }
    _this4.quillRef.getEditor().setSelection(range.index + 1); // 移动光标位置至图片后
    _this4.setState({
      isShowModal: false
    });
  };

  this.handleOk = function () {
    var type = _this4.state.type;

    if (type === 'online') {
      _this4.insertToEditor();
    } else {
      var file = _this4.state.file;

      var data = new FormData();
      data.append('file', file);
      _this4.setState({ submitting: true });
      _choerodonBootCombine.axios.post(Choerodon.API_HOST + '/file/v1/files?bucket_name=file&file_name=file', data).then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
        } else {
          _this4.insertToEditor(res);
        }
        _this4.setState({ submitting: false });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this4.setState({ submitting: false });
      });
    }
  };

  this.changeUploadType = function (type) {
    var resetFields = _this4.props.form.resetFields;

    resetFields();
    _this4.setState({
      file: null,
      localSrc: null,
      previewUrl: null,
      type: type
    });
  };

  this.onQuillChange = function (content, delta, source, editor) {
    if (_this4.props.onChange) _this4.props.onChange(content);
    var currentDelta = editor.getContents();
    var originalHtml = editor.getHTML();
    _this4.setState({
      delta: currentDelta,
      originalHtml: originalHtml,
      editor: editor
    });
  };

  this.renderLocal = function () {
    var props = _this4.getUploadProps();
    var localSrc = _this4.state.localSrc;

    return _react2['default'].createElement(
      _react2['default'].Fragment,
      null,
      _react2['default'].createElement(
        Dragger,
        (0, _extends3['default'])({ className: 'c7n-iam-editor-dragger' }, props),
        localSrc ? _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          _react2['default'].createElement('div', { style: { backgroundImage: 'url(' + localSrc + ')' }, className: 'c7n-iam-editor-dragger-preview-pic' })
        ) : _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          _react2['default'].createElement(_icon2['default'], { type: 'inbox' }),
          _react2['default'].createElement(
            'h3',
            { className: 'c7n-iam-editor-dragger-text' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.dragger.text' })
          ),
          _react2['default'].createElement(
            'h4',
            { className: 'c7n-iam-editor-dragger-hint' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, {
              id: 'editor.dragger.hint',
              values: { size: limitSize / 1024 + 'M', access: 'PNG、JPG、JPEG、GIF' }
            })
          )
        )
      )
    );
  };

  this.renderOnline = function () {
    var previewUrl = _this4.state.previewUrl;
    var getFieldDecorator = _this4.props.form.getFieldDecorator;
    var intl = _this4.props.intl;

    return _react2['default'].createElement(
      _react2['default'].Fragment,
      null,
      _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-editor-modal-preview-top' },
        _react2['default'].createElement(
          _form2['default'],
          {
            style: { display: 'inline-block' }
          },
          _react2['default'].createElement(
            FormItem,
            null,
            getFieldDecorator('imgUrl', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: 'editor.pic.url.required' })
              }]
            })(_react2['default'].createElement(_input2['default'], {
              ref: function ref(e) {
                _this4.urlFocusInput = e;
              },
              style: { width: '438px', verticalAlign: 'middle' },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.pic.url' }),
              id: 'c7n-iam-editor-input',
              autoComplete: 'off'
            }))
          )
        ),
        _react2['default'].createElement(
          _button2['default'],
          {
            className: 'c7n-iam-editor-modal-preview-top-btn',
            funcType: 'raised',
            onClick: _this4.previewPic
          },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.view' })
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-editor-modal-preview-content' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-editor-modal-preview-sentence' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'editor.preview' })
        ),
        _react2['default'].createElement('div', { style: { backgroundImage: 'url(' + previewUrl + ')' }, className: 'c7n-iam-editor-modal-preview-pic' })
      )
    );
  };

  this.modules = {
    toolbar: {
      container: '#toolbar',
      handlers: {
        image: this.handleOpenModal,
        'code-block': this.changeToHtml
      }
    }
  };
  this.formats = ['bold', 'italic', 'underline', 'header', 'list', 'bullet', 'link', 'image', 'color', 'font', 'size', 'align', 'code-block'];
  this.defaultStyle = {
    width: '100%',
    height: 320
  };
}, _temp)) || _class) || _class);
exports['default'] = Editor;
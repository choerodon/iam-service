/* eslint-disable func-names */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { axios as defaultAxios, Content, Header, Page, Permission } from '@choerodon/boot';
import { Form, Table, Input, Button, Select, Tabs, Spin, Tooltip, Icon, Modal } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import querystring from 'query-string';
import classnames from 'classnames';
import Hjson from 'hjson';
import './APITest.scss';
import jsonFormat from '../../../common/json-format';
import APITestStore from '../../../stores/global/api-test';
import AuthorizeModal from './AuthorizeModal';

let statusCode;
let responseHeader;
let response;
let rcResponseHeader;
let rcResponse;
let authorization;
const intlPrefix = 'global.apitest';
const urlPrefix = process.env.API_HOST;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const instance = defaultAxios.create();

// Hjson编译配置
const options = {
  bracesSameLine: true,
  quotes: 'all', // 全部加上引号
  keepWsc: true,
};

instance.interceptors.request.use(
  (config) => {
    const newConfig = config;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
    let accessToken;
    if (!APITestStore.getApiToken) {
      accessToken = Choerodon.getAccessToken();
      if (accessToken) {
        newConfig.headers.Authorization = accessToken;
      }
    } else {
      accessToken = APITestStore.getApiToken;
      newConfig.headers.Authorization = accessToken;
    }
    authorization = accessToken;
    return newConfig;
  },
  (err) => {
    const error = err;
    return Promise.reject(error);
  },
);

instance.interceptors.response.use((res) => {
  statusCode = res.status; // 响应码
  responseHeader = jsonFormat(res.headers);
  rcResponseHeader = JSON.stringify(res.headers);
  response = res.data instanceof Object ? jsonFormat(res.data) : `${res.data}`; // 响应主体
  rcResponse = JSON.stringify(res.data);
}, (error) => {
  statusCode = error.response.status; // 响应码
  responseHeader = jsonFormat(error.response.headers);
  rcResponseHeader = JSON.stringify(error.response.headers);
  response = error.response.data instanceof Object ? jsonFormat(error.response.data) : `${error.response.data}`; // 响应主体
  rcResponse = JSON.stringify(error.response.data);
});

@Form.create()
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class APIDetail extends Component {
  state = this.getInitState();

  getInitState() {
    const { controller, version, service, operationId } = this.props.match.params;
    return {
      loading: true,
      controller,
      version,
      service,
      operationId,
      requestUrl: null,
      urlPrefix: '',
      isSending: false,
      urlPathValues: {},
      bData: {},
      queryArr: {},
      query: '',
      taArr: {},
      loadFile: null,
      isShowModal: false,
    };
  }


  componentWillMount() {
    if (APITestStore.getApiDetail.description === '[]') {
      const { controller, version, service, operationId } = this.state;
      const queryObj = {
        version,
        operation_id: operationId,
      };
      defaultAxios.get(`${urlPrefix}/manager/v1/swaggers/${service}/controllers/${controller}/paths?${querystring.stringify(queryObj)}`).then((data) => {
        data.paths.some((item) => {
          if (item.operationId === operationId) {
            const { basePath, url } = item;
            APITestStore.setApiDetail(item);
            this.setState({
              loading: false,
              requestUrl: `${urlPrefix}${basePath}${url}`,
            });
            return true;
          }
          return false;
        });
      });
    } else {
      const { basePath, url } = APITestStore.getApiDetail;
      this.setState({
        loading: false,
        requestUrl: `${urlPrefix}${basePath}${url}`,
      });
    }
  }

  componentWillUnmount() {
    APITestStore.setIsShowResult(null);
  }

  getDetail() {
    const { intl } = this.props;
    const { code, method, url, remark, consumes, produces } = APITestStore.getApiDetail;
    const desc = APITestStore.getApiDetail.description || '[]';
    const responseDataExample = APITestStore.getApiDetail
    && APITestStore.getApiDetail.responses.length ? APITestStore.getApiDetail.responses[0].body || 'false' : '{}';
    let handledDescWithComment = Hjson.parse(responseDataExample, { keepWsc: true });
    handledDescWithComment = jsonFormat(handledDescWithComment);
    const handledDesc = Hjson.parse(desc);
    const { permission = { roles: [] } } = handledDesc;
    const roles = permission.roles.length && permission.roles.map(item => ({
      name: intl.formatMessage({ id: `${intlPrefix}.default.role` }),
      value: item,
    }));

    const tableValue = [{
      name: intl.formatMessage({ id: `${intlPrefix}.code` }),
      value: code,
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.method` }),
      value: method,
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.url` }),
      value: url,
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.remark` }),
      value: remark,
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.action` }),
      value: permission && permission.action,
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.level` }),
      value: permission && permission.permissionLevel,
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.login.accessible` }),
      value: permission && permission.permissionLogin ? '是' : '否',
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.public.permission` }),
      value: permission && permission.permissionPublic ? '是' : '否',
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.request.format` }),
      value: consumes[0],
    }, {
      name: intl.formatMessage({ id: `${intlPrefix}.response.format` }),
      value: produces[0],
    }];

    if (roles) {
      tableValue.splice(5, 0, ...roles);
    }

    const infoColumns = [{
      title: <FormattedMessage id={`${intlPrefix}.property`} />,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.value`} />,
      dataIndex: 'value',
      key: 'value',
    }];

    const paramsColumns = [{
      title: <FormattedMessage id={`${intlPrefix}.param.name`} />,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (record.required) {
          return (
            <div>
              <span>{text}</span>
              <span style={{ color: '#d50000' }}>*</span>
            </div>
          );
        } else {
          return text;
        }
      },
    }, {
      title: <FormattedMessage id={`${intlPrefix}.param.desc`} />,
      dataIndex: 'description',
      key: 'description',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.param.type`} />,
      dataIndex: 'in',
      key: 'in',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.request.data.type`} />,
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        if (text === 'integer' && record.format === 'int64') {
          return 'long';
        } else if (text === 'array') {
          return 'Array[string]';
        } else if (!text) {
          if (record.schema && record.schema.type) {
            return record.schema.type;
          } else {
            let value;
            if (record.body) {
              value = Hjson.parse(record.body, { keepWsc: true });
              value = jsonFormat(value);
            } else {
              value = null;
            }
            return (
              <div>
                Example Value
                <div className="body-container">
                  <pre>
                    <code>
                      {value}
                    </code>
                  </pre>
                </div>
              </div>
            );
          }
        } else {
          return text;
        }
      },
    }];

    return (
      <div className="c7n-interface-detail">
        <div className="c7n-interface-info">
          <h5><FormattedMessage id={`${intlPrefix}.interface.info`} /></h5>
          <Table
            columns={infoColumns}
            dataSource={tableValue}
            pagination={false}
            filterBar={false}
            rowKey={record => `${record.name}-${record.value}`}
          />
        </div>
        <div className="c7n-request-params">
          <h5><FormattedMessage id={`${intlPrefix}.request.parameter`} /></h5>
          <Table
            columns={paramsColumns}
            dataSource={APITestStore && APITestStore.apiDetail.parameters}
            pagination={false}
            filterBar={false}
            rowKey="name"
          />
        </div>
        <div className="c7n-response-data" style={{ display: responseDataExample === 'false' ? 'none' : 'block' }}>
          <h5><FormattedMessage id={`${intlPrefix}.response.data`} /></h5>
          <div className="response-data-container">
            <pre>
              <code>
                {handledDescWithComment}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  handleSelectChange = (name, select) => {
    const a = { target: { value: select } };
    this.changeNormalValue(name, 'query', a);
  };


  changeTextareaValue = (name, type, e) => {
    if (type !== 'array') {
      this.setState({
        bData: e.target.value,
      });
    } else {
      this.changeNormalValue(name, 'array', e);
    }
  };

  uploadRef = (node) => {
    if (node) {
      this.fileInput = node;
    }
  };

  responseNode = (node) => {
    if (node) {
      this.responseNode = node;
    }
  }

  curlNode = (node) => {
    if (node) {
      this.curlNode = node;
    }
  }


  relateChoose = () => {
    this.fileInput.click();
  }

  handleCopyCURL(culContent) {
    const { intl: { formatMessage } } = this.props;
    const curlRootEle = document.getElementById('curlContent');
    curlRootEle.value = culContent;
    curlRootEle.select();
    document.execCommand('Copy');
    Choerodon.prompt(formatMessage({ id: 'copy.success' }));
  }

  handleCopyHeader() {
    const { intl: { formatMessage } } = this.props;
    const headerRootEle = document.getElementById('responseHeader');
    headerRootEle.value = rcResponseHeader;
    headerRootEle.select();
    document.execCommand('Copy');
    Choerodon.prompt(formatMessage({ id: 'copy.success' }));
  }

  handleCopyBody() {
    const { intl: { formatMessage } } = this.props;
    const headerRootEle = document.getElementById('responseContent');
    headerRootEle.value = rcResponse;
    headerRootEle.select();
    document.execCommand('Copy');
    Choerodon.prompt(formatMessage({ id: 'copy.success' }));
  }


  getTest = () => {
    let curlContent;
    const upperMethod = {
      get: 'GET',
      post: 'POST',
      options: 'OPTIONS',
      put: 'PUT',
      delete: 'DELETE',
      patch: 'PATCH',
    };
    const { intl, form: { getFieldValue } } = this.props;
    const handleUrl = encodeURI(this.state.requestUrl);
    const handleMethod = upperMethod[APITestStore.getApiDetail.method];
    const currentToken = APITestStore.getApiToken || authorization;
    const token = currentToken ? currentToken.split(' ')[1] : null;
    const bodyStr = (getFieldValue('bodyData') || '').replace(/\n/g, '\\\n');
    let body = '';
    if (bodyStr) {
      body = `-d '${bodyStr}' `;
    }
    if (handleMethod === 'GET') {
      curlContent = `curl -X ${handleMethod} --header 'Accept: application/json' --header 'Authorization: Bearer ${token}' '${handleUrl}'`;
    } else {
      curlContent = `curl -X ${handleMethod} --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'Authorization: Bearer ${token}' ${body}'${handleUrl}'`;
    }
    const method = APITestStore && APITestStore.apiDetail.method;
    const { getFieldDecorator, getFieldError } = this.props.form;
    const requestColumns = [{
      title: <FormattedMessage id={`${intlPrefix}.param.name`} />,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text, record) => {
        if (record.required) {
          return (
            <div>
              <span>{text}</span>
              <span style={{ color: '#d50000' }}>*</span>
            </div>
          );
        } else {
          return text;
        }
      },
    }, {
      title: <FormattedMessage id={`${intlPrefix}.request.data`} />,
      dataIndex: 'in',
      key: 'in',
      width: '40%',
      render: (text, record) => {
        let editableNode;
        if (!record.type) {
          editableNode = (
            <div style={{ width: '100%' }} className="c7n-iam-TextEditToggle-text">
              <FormItem>
                {getFieldDecorator('bodyData', {
                  rules: [{
                    required: !record.type,
                    message: intl.formatMessage({ id: `${intlPrefix}.required.msg` }, { name: `${record.name}` }),
                  }],
                })(
                  <TextArea className="errorTextarea" rows={6} placeholder={getFieldError('bodyData')} />,
                )}
              </FormItem>
              <Icon type="mode_edit" className="c7n-iam-TextEditToggle-text-icon" />
            </div>);
        } else if (record.type === 'boolean') {
          editableNode = (
            <FormItem>
              {getFieldDecorator(`${record.name}`, {
                rules: [],
              })(
                <div style={{ width: '55px' }}>
                  <Select
                    dropdownStyle={{ width: '55px' }}
                    defaultValue=""
                    getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                    onChange={this.handleSelectChange.bind(this, record.name)}
                  >
                    <Option value="" style={{ height: '22px' }} />
                    <Option value="true">true</Option>
                    <Option value="false">false</Option>
                  </Select>
                </div>,
              )}
            </FormItem>
          );
        } else if (record.type === 'array') {
          editableNode = (
            <div style={{ width: '50%' }}>
              <FormItem>
                {getFieldDecorator(`${record.name}`, {
                  rules: [{
                    required: !record.type,
                    message: intl.formatMessage({ id: `${intlPrefix}.required.msg` }, { name: `${record.name}` }),
                  }],
                })(
                  <div className="c7n-iam-TextEditToggle-text">
                    <TextArea className={classnames({ errorTextarea: getFieldError(`${record.name}`) })} rows={6} placeholder={getFieldError(`${record.name}`) || '请以换行的形式输入多个值'} onChange={this.changeTextareaValue.bind(this, record.name, record.type)} />
                    <Icon type="mode_edit" className="c7n-iam-TextEditToggle-text-icon" />
                  </div>)}
              </FormItem>

            </div>);
        } else if (record.type === 'file') {
          editableNode = (
            <div className="uploadContainer">
              <input type="file" name="file" ref={this.uploadRef} />
              <Button onClick={this.relateChoose}>
                <Icon type="file_upload" /> {intl.formatMessage({ id: `${intlPrefix}.choose.file` })}
              </Button>
              <div className="emptyMask" />
            </div>
          );
        } else {
          editableNode = (
            <FormItem>
              {getFieldDecorator(`${record.name}`, {
                rules: [{
                  required: record.required,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.required.msg` }, { name: `${record.name}` }),
                }],
              })(
                <div style={{ width: '50%' }} className="c7n-iam-TextEditToggle-text">
                  <Input onFocus={this.inputOnFocus} autoComplete="off" onChange={this.changeNormalValue.bind(this, record.name, record.in)} placeholder={getFieldError(`${record.name}`)} />
                  <Icon type="mode_edit" className="c7n-iam-TextEditToggle-text-icon" />
                </div>,
              )}
            </FormItem>
          );
        }
        return editableNode;
      },
    }, {
      title: <FormattedMessage id={`${intlPrefix}.request.data.type`} />,
      dataIndex: 'type',
      key: 'type',
      width: '40%',
      render: (text, record) => {
        if (text === 'integer' && record.format === 'int64') {
          return 'long';
        } else if (text === 'array') {
          return 'Array[string]';
        } else if (!text) {
          if (record.schema && record.schema.type) {
            return record.schema.type;
          } else {
            let normalBody;
            let value;
            if (record.body) {
              value = Hjson.parse(record.body, { keepWsc: true });
              normalBody = Hjson.stringify(value, { bracesSameLine: true, quotes: 'all', separator: true });
              value = jsonFormat(value);
            } else {
              value = null;
              normalBody = null;
            }
            return (
              <div>
                Example Value
                <Tooltip placement="left" title={intl.formatMessage({ id: `${intlPrefix}.copyleft` })}>
                  <div className="body-container" onClick={this.copyToLeft.bind(this, normalBody, record.name)}>
                    <pre>
                      <code>
                        {value}
                      </code>
                    </pre>
                  </div>
                </Tooltip>
              </div>
            );
          }
        } else {
          return text;
        }
      },
    }];

    return (
      <div className="c7n-interface-test">
        <div className="c7n-interface-test-response-params">
          <h5><FormattedMessage id={`${intlPrefix}.request.parameter`} /></h5>
          <Form>
            <Table
              pagination={false}
              filterBar={false}
              columns={requestColumns}
              dataSource={APITestStore && APITestStore.apiDetail.parameters}
              rowKey="name"
            />
          </Form>
        </div>
        <div className="c7n-url-container">
          <div className="c7n-authorize-info">
            <span className="info">{intl.formatMessage({ id: `${intlPrefix}.authorize.account` })}：</span>
            <span className="info">{APITestStore.getUserInfo || this.props.AppState.getUserInfo.loginName}</span>
            <Button
              funcType="flat"
              type="primary"
              htmlType="submit"
              onClick={this.openAuthorizeModal}
              icon="mode_edit"
            >
              {intl.formatMessage({ id: `${intlPrefix}.authorize.change` })}
            </Button>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <span className={classnames('method', `c7n-apitest-${method}`)}>{method}</span>
            <input type="text" value={this.state.requestUrl} readOnly />
            {!this.state.isSending ? (
              <Button
                funcType="raised"
                type="primary"
                htmlType="submit"
                onClick={this.handleSubmit}
              >
                {intl.formatMessage({ id: `${intlPrefix}.send` })}
              </Button>
            ) : (
              <Button
                funcType="raised"
                type="primary"
                loading
              >
                {intl.formatMessage({ id: `${intlPrefix}.sending` })}
              </Button>
            )
            }
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '100px', display: APITestStore.isShowResult === false ? 'block' : 'none' }}><Spin size="large" /></div>
        <div className="c7n-response-container" style={{ display: APITestStore.isShowResult === true ? 'block' : 'none' }}>
          <div className="c7n-response-code">
            <h5><FormattedMessage id={`${intlPrefix}.response.code`} /></h5>
            <div className="response-code-container">
              {statusCode}
            </div>
          </div>
          <div className="c7n-response-body">
            <h5><FormattedMessage id={`${intlPrefix}.response.body`} /></h5>
            <div className="response-body-container" ref={this.responseNode}>
              <pre>
                <code>
                  {response}
                </code>
              </pre>
              <Icon
                type="library_books"
                onClick={this.handleCopyBody.bind(this)}
              />
              <textarea style={{ position: 'absolute', zIndex: -10 }} id="responseContent" />
            </div>
          </div>
          <div className="c7n-response-body">
            <h5><FormattedMessage id={`${intlPrefix}.response.headers`} /></h5>
            <div className="response-body-container">
              <pre>
                <code>
                  {responseHeader}
                </code>
              </pre>
              <Icon
                type="library_books"
                onClick={this.handleCopyHeader.bind(this)}
              />
              <textarea style={{ position: 'absolute', zIndex: -10 }} id="responseHeader" />
            </div>
          </div>
          <div className="c7n-curl">
            <h5>CURL</h5>
            <div className="curl-container" ref={this.curlNode}>
              <pre>
                <code>
                  { curlContent }
                </code>
              </pre>
              <Icon
                type="library_books"
                onClick={this.handleCopyCURL.bind(this, curlContent)}
              />
              <textarea style={{ position: 'absolute', zIndex: -10 }} id="curlContent" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isSending: true });
        APITestStore.setIsShowResult(false);
        this.responseNode.scrollTop = 0;
        this.curlNode.scrollLeft = 0;
        if (this.fileInput) {
          const formData = new FormData();
          formData.append('file', this.fileInput.files[0]);
          instance[APITestStore.getApiDetail.method](this.state.requestUrl, formData)
            .then(function (res) {
              this.setState({
                isSending: false,
              });
              APITestStore.setIsShowResult(true);
            }).catch((error) => {
              this.setState({
                isSending: false,
              });
              APITestStore.setIsShowResult(true);
            });
        } else if ('bodyData' in values) {
          instance[APITestStore.getApiDetail.method](this.state.requestUrl,
            Hjson.parse(values.bodyData || '')).then(function (res) {
            this.setState({
              isSending: false,
            });
            APITestStore.setIsShowResult(true);
          }).catch((error) => {
            this.setState({
              isSending: false,
            });
            APITestStore.setIsShowResult(true);
          });
        } else {
          instance[APITestStore.getApiDetail.method](this.state.requestUrl).then(function (res) {
            this.setState({
              isSending: false,
            });
            APITestStore.setIsShowResult(true);
          }).catch((error) => {
            this.setState({
              isSending: false,
            });
            APITestStore.setIsShowResult(true);
          });
        }
      }
    });
  }

  // 开启授权模态框
  openAuthorizeModal = () => {
    if (this.AuthorizeModal) {
      const { resetFields } = this.AuthorizeModal.props.form;
      resetFields();
    }
    APITestStore.setIsShowModal(true);
  }


  // 关闭授权模态框
  handleCancel = () => {
    APITestStore.setIsShowModal(false);
  };

  copyToLeft(value, name) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ bodyData: value });
  }

  changeNormalValue = (name, valIn, e) => {
    const { urlPathValues } = this.state;
    let query = '';
    let requestUrl = `${urlPrefix}${APITestStore.getApiDetail.basePath}${APITestStore.getApiDetail.url}`;
    urlPathValues[`{${name}}`] = e.target.value;
    Object.entries(urlPathValues).forEach((items) => {
      requestUrl = items[1] ? requestUrl.replace(items[0], items[1]) : requestUrl;
    });
    if (valIn === 'query' || valIn === 'array') {
      const arr = e.target.value.split('\n');
      this.state.taArr[name] = arr;
      this.setState({
        taArr: this.state.taArr,
      });
    }
    Object.entries(this.state.taArr).forEach((a) => {
      const entrieName = a[0];
      if (Array.isArray(a[1])) {
        a[1].forEach((v) => { query = `${query}&${entrieName}=${v}`; });
      } else {
        query = `${query}&${entrieName}=${a[1]}`;
      }
    });
    this.setState({
      query,
    });
    query = query.replace('&', '?');
    this.setState({ requestUrl: `${requestUrl}${query}`, urlPathValues });
  };

  renderModalContent() {
    const { isShowModal } = this.state;
    return (
      <AuthorizeModal
        isShow={isShowModal}
        onRef={(node) => {
          this.AuthorizeModal = node;
        }}
      />
    );
  }

  render() {
    const url = APITestStore && APITestStore.apiDetail.url;
    return (
      <Page>
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
          backPath="/iam/api-test"
        />
        {this.state.loading ? <div style={{ textAlign: 'center', paddingTop: '250px' }}><Spin size="large" /></div>
          : (
            <div>
              <Content
                className="c7n-api-test"
                code={`${intlPrefix}.detail`}
                values={{ name: url }}
              >
                <Tabs>
                  <TabPane tab={<FormattedMessage id={`${intlPrefix}.interface.detail`} />} key="detail">
                    {this.getDetail()}
                  </TabPane>
                  <TabPane tab={<FormattedMessage id={`${intlPrefix}.interface.test`} />} key="test" disabled={APITestStore.getApiDetail.innerInterface}>
                    {this.getTest()}
                  </TabPane>
                </Tabs>
              </Content>
            </div>
          )
        }

        <Modal
          bodyStyle={{ height: '356px' }}
          visible={APITestStore.getIsShowModal}
          closable={false}
          footer={null}
          width={454}
          maskClosable={!APITestStore.modalSaving}
          onCancel={this.handleCancel}
          onOk={e => this.AuthorizeModal.handleSubmit(e)}
        >
          {this.renderModalContent()}
        </Modal>
      </Page>
    );
  }
}

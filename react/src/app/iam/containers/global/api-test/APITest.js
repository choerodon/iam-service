/**
 * Created by hulingfangzi on 2018/7/3.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Tooltip, Tree, Input, Icon, Form, Row, Col, Select, Table, Spin, Modal } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios as defaultAxios, Content, Header, Page, Permission } from '@choerodon/boot';
import querystring from 'query-string';
import _ from 'lodash';
import classnames from 'classnames';
import Hjson from 'hjson';
import APITestStore from '../../../stores/global/api-test';
import './APITest.scss';
import ApiTree from './apiTree';
import emptyApi from '../../../assets/images/noright.svg';
import jsonFormat from '../../../common/json-format';
import AuthorizeModal from './AuthorizeModal';

const intlPrefix = 'global.apitest';
const FormItem = Form.Item;
const { TextArea } = Input;
const instance = defaultAxios.create();
const { Option } = Select;
const urlPrefix = process.env.API_HOST;
let statusCode;
let responseHeader;
let response;
let rcResponseHeader;
let rcResponse;
let authorization;

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
export default class APITest extends Component {
  state = this.getInitState();

  componentWillUnmount() {
    APITestStore.setPageLoading(true);
    APITestStore.setDetailFlag('empty');
    APITestStore.setIsShowResult(null);
    APITestStore.setExpandedKeys([]);
    APITestStore.setUserInfo(null);
    APITestStore.setCurrentNode(null);
    APITestStore.setEventKey(null);
  }

  getInitState() {
    return {
      params: [],
      urlPrefix: '',
      requestUrl: null,
      isSending: false,
      urlPathValues: {},
      bData: {},
      query: '',
      taArr: {},
      loadFile: null,
      isShowModal: false,
      pageLoading: true,
    };
  }


  handleRefresh = () => {
    const currentNode = APITestStore.getCurrentNode;
    const detailFlag = APITestStore.getDetailFlag;
    if (detailFlag !== 'empty') {
      this.setState(this.getInitState(), () => {
        this.loadDetail(currentNode);
      });
    }
  };

  /**
   * 加载API详情数据
   * @param node 左侧树结构选中的节点
   */
  loadDetail = (node) => {
    const { form: { resetFields } } = this.props;
    APITestStore.setIsShowResult(null);
    APITestStore.setDetailFlag('loading');
    this.setState({
      isSending: false,
      urlPathValues: {},
      bData: {},
      query: '',
      taArr: {},
    });
    const { version, operationId, refController, servicePrefix } = node[0].props;
    const queryObj = {
      version,
      operation_id: operationId,
    };
    defaultAxios.get(`${urlPrefix}/manager/v1/swaggers/${servicePrefix}/controllers/${refController}/paths?${querystring.stringify(queryObj)}`).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
        APITestStore.setDetailFlag('empty');
      } else {
        data.paths.some((item) => {
          if (item.operationId === operationId) {
            const { basePath, url } = item;
            APITestStore.setApiDetail(item);
            APITestStore.setDetailFlag('done');
            resetFields();
            this.setState({
              requestUrl: `${urlPrefix}${basePath}${url}`,
            });
            return true;
          }
          return false;
        });
      }
    });
  };

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

  copyToLeft(value, name) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ bodyData: value });
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isSending: true });
        APITestStore.setIsShowResult(false);
        this.responseNode.scrollTop = 0;
        this.curlNode.scrollLeft = 0;
        this.curlNode.scrollTop = 0;
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

  getApiDetail() {
    const { intl } = this.props;
    const { url, innerInterface, code, method, remark, consumes, produces } = APITestStore.getApiDetail;
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

    return (
      <div className="c7n-iam-apitest-content-right-container">
        <div className="c7n-iam-apitest-content-right-container-title">
          <span
            className={classnames('c7n-iam-apitest-content-right-container-title-methodTag', `c7n-iam-apitest-content-right-container-title-methodTag-${method}`)}
          ><span>{method}</span></span>
          <span className="c7n-iam-apitest-content-right-container-title-url">{url}</span>
          <span className={classnames('c7n-iam-apitest-content-right-container-title-rangeTag', {
            'c7n-iam-apitest-content-right-container-title-rangeTag-inner': innerInterface,
            'c7n-iam-apitest-content-right-container-title-rangeTag-outer': !innerInterface,
          })}
          >{innerInterface ? '内部' : '公开'}</span>
        </div>
        <div className="c7n-iam-apitest-content-right-container-info">
          <div className="c7n-iam-apitest-content-right-container-info-title">
            <span>接口信息</span>
            <span>响应数据</span>
          </div>
          <div className="c7n-iam-apitest-content-right-container-info-content">
            <div className="c7n-iam-apitest-content-right-container-info-interfaceinfo">
              {
                tableValue.map(({ name, value }, index) =>
                  <Row key={`${name}-${index}`} className="c7n-iam-apitest-content-right-container-info-interfaceinfo-row">
                    <Col span={7}>{name}:</Col>
                    <Col span={17}>{value}</Col>
                  </Row>,
                )
              }
            </div>
            <div className="c7n-iam-apitest-content-right-container-info-responsedata">
              <pre>
                <code>
                  {handledDescWithComment}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getTest() {
    let curlContent;
    const upperMethod = {
      get: 'GET',
      post: 'POST',
      options: 'OPTIONS',
      put: 'PUT',
      delete: 'DELETE',
      patch: 'PATCH',
    };

    let handledStatusCode;
    let codeClass;
    if (statusCode) {
      handledStatusCode = String(statusCode).split('')[0];
      switch (handledStatusCode) {
        case '1':
          codeClass = 'c7n-iam-apitest-code-1';
          break;
        case '2':
          codeClass = 'c7n-iam-apitest-code-2';
          break;
        case '3':
          codeClass = 'c7n-iam-apitest-code-3';
          break;
        case '4':
          codeClass = 'c7n-iam-apitest-code-4';
          break;
        case '5':
          codeClass = 'c7n-iam-apitest-code-5';
          break;
        default:
          break;
      }
    }

    const { intl, form: { getFieldValue, getFieldDecorator, getFieldError } } = this.props;
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
      curlContent = `curl -X ${handleMethod} \\
'${handleUrl}' \\
--header 'Accept: application/json' \\
--header 'Authorization: Bearer ${token}'`;
    } else {
      curlContent = `curl -X ${handleMethod} \\
'${handleUrl}' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json' \\
--header 'Authorization: Bearer ${token}' \\
${body}`;
    }

    const method = APITestStore && APITestStore.apiDetail.method;
    const requestColumns = [{
      title: <FormattedMessage id={`${intlPrefix}.param.name`} />,
      dataIndex: 'name',
      key: 'name',
      width: '15%',
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
      width: '25%',
      render: (text, record) => {
        let editableNode;
        if (!record.type) {
          editableNode = (
            <div style={{ width: '100%' }} className="c7n-iam-TextEditToggle-text">
              <FormItem>
                {getFieldDecorator('bodyData', {
                  initialValue: undefined,
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
                initialValue: '',
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
            <div style={{ width: '100%' }}>
              <FormItem>
                {getFieldDecorator(`${record.name}`, {
                  rules: [{
                    required: !record.type,
                    message: intl.formatMessage({ id: `${intlPrefix}.required.msg` }, { name: `${record.name}` }),
                  }],
                  initialValue: undefined,
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
                initialValue: undefined,
              })(
                <div style={{ width: '100%' }} className="c7n-iam-TextEditToggle-text">
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
      width: '25%',
      render: (text, record) => {
        if (text === 'integer' && record.format === 'int64') {
          return 'long';
        } else if (text === 'array') {
          return 'Array[string]';
        } else if (!text) {
          if (record.schema && record.schema.type && !record.body) {
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
    }, {
      title: <FormattedMessage id={`${intlPrefix}.param.desc`} />,
      dataIndex: 'description',
      key: 'description',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.param.type`} />,
      dataIndex: 'in',
      key: 'inDefault',
    }];

    return (
      <div className="c7n-iam-apitest-content-right-container-interface-test">
        <div className="c7n-interface-test-response-params">
          <h5><FormattedMessage id={`${intlPrefix}.request.parameter`} /></h5>
          <Form>
            <Table
              pagination={false}
              filterBar={false}
              columns={requestColumns}
              dataSource={APITestStore && APITestStore.apiDetail.parameters}
              rowKey="name"
              style={{ width: '100%' }}
            />
          </Form>
        </div>
        <div className="c7n-url-container">
          <div style={{ marginBottom: '30px' }}>
            <span className={classnames('method', `c7n-iam-apitest-content-right-container-title-methodTag-${method}`)}>{method}</span>
            <Tooltip
              title={this.state.requestUrl}
              placement="top"
              overlayStyle={{ wordBreak: 'break-all' }}
              arrowPointAtCenter
            >
              <input type="text" value={this.state.requestUrl} readOnly />
            </Tooltip>
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
            <span className={classnames('c7n-iam-apitest-statusCode', `${codeClass}`)}>{statusCode}</span>
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

  getRightContent() {
    const { apiDetail, pageLoading } = APITestStore;
    const detailFlag = APITestStore.getDetailFlag;
    const { intl } = this.props;
    let rightContent;
    if (detailFlag === 'done') {
      rightContent = (
        <React.Fragment>
          {this.getApiDetail()}
          {this.getTest()}
        </React.Fragment>
      );
    } else if (detailFlag === 'loading') {
      rightContent = <Spin spinning={detailFlag === 'loading'} style={{ flex: 1, marginTop: '30%' }} />;
    } else {
      rightContent = (
        <div style={{
          display: 'flex', alignItems: 'center', height: 250, margin: '88px auto', padding: '50px 75px',
        }}
        >
          <img src={emptyApi} alt="" />
          <div style={{ marginLeft: 40 }}>
            <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.65)' }}>{intl.formatMessage({ id: `${intlPrefix}.empty.find.not` })}</div>
            <div style={{ fontSize: '20px', marginTop: 10 }}>{intl.formatMessage({ id: `${intlPrefix}.empty.try.choose` })}</div>
          </div>
        </div>
      );
    }

    return rightContent;
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
    const { isShowTree, apiDetail, pageLoading } = APITestStore;
    const { loginName, realName } = this.props.AppState.getUserInfo;

    const detailFlag = APITestStore.getDetailFlag;
    const { intl } = this.props;
    const hCursor = this.state.isHResize ? 'row-resize' : 'default';
    const hColor = this.state.isHResize ? '#ddd' : '#fff';
    const vCursor = this.state.isVResize ? 'col-resize' : 'default';
    const vColor = this.state.isVResize ? 'red' : 'black';
    return (
      <Page
        service={[
          'manager-service.api.queryTreeMenu',
          'manager-service.api.queryPathDetail',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Button
            onClick={this.openAuthorizeModal}
            icon="person"
            style={{ textTransform: 'initial' }}
          >
            {
              APITestStore.getUserInfo ? (<span>{APITestStore.getUserInfo}</span>) : (
                <span>{loginName}{realName}</span>
              )
            }
          </Button>
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          className="c7n-iam-apitest"
          style={{ padding: 0, display: 'flex' }}
        >
          <Spin spinning={pageLoading}>
            <div className="c7n-iam-apitest-content">
              {!isShowTree && (
              <div className="c7n-iam-apitest-bar">
                <div
                  role="none"
                  className="c7n-iam-apitest-bar-button"
                  onClick={() => { APITestStore.setIsShowTree(true); }}
                >
                  <Icon type="navigate_next" />
                </div>
                <p
                  role="none"
                  onClick={() => { APITestStore.setIsShowTree(true); }}
                >
                  {intl.formatMessage({ id: `${intlPrefix}.apis.repository` })}
                </p>
              </div>
              )}
              <div className={classnames({ 'c7n-iam-apitest-content-tree-container': isShowTree, 'c7n-iam-apitest-content-tree-container-hidden': !isShowTree })}>
                <ApiTree
                  ref={(tree) => { this.apiTree = tree; }}
                  onClose={() => { APITestStore.setIsShowTree(false); }}
                  getDetail={this.loadDetail}
                />
              </div>
              <div className="c7n-iam-apitest-content-right">
                {this.getRightContent()}
              </div>
            </div>
          </Spin>
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
        </Content>
      </Page>
    );
  }
}

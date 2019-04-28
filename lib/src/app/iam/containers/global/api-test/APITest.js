'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class; /**
                          * Created by hulingfangzi on 2018/7/3.
                          */

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _apiTest = require('../../../stores/global/api-test');

var _apiTest2 = _interopRequireDefault(_apiTest);

require('./APITest.scss');

var _apiTree = require('./apiTree');

var _apiTree2 = _interopRequireDefault(_apiTree);

var _noright = require('../../../assets/images/noright.svg');

var _noright2 = _interopRequireDefault(_noright);

var _jsonFormat = require('../../../common/json-format');

var _jsonFormat2 = _interopRequireDefault(_jsonFormat);

var _AuthorizeModal = require('./AuthorizeModal');

var _AuthorizeModal2 = _interopRequireDefault(_AuthorizeModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlPrefix = 'global.apitest';
var FormItem = _form2['default'].Item;
var TextArea = _input2['default'].TextArea;

var instance = _choerodonBootCombine.axios.create();
var Option = _select2['default'].Option;

var urlPrefix = process.env.API_HOST;
var statusCode = void 0;
var responseHeader = void 0;
var response = void 0;
var rcResponseHeader = void 0;
var rcResponse = void 0;
var authorization = void 0;

instance.interceptors.request.use(function (config) {
  var newConfig = config;
  newConfig.headers['Content-Type'] = 'application/json';
  newConfig.headers.Accept = 'application/json';
  var accessToken = void 0;
  if (!_apiTest2['default'].getApiToken) {
    accessToken = Choerodon.getAccessToken();
    if (accessToken) {
      newConfig.headers.Authorization = accessToken;
    }
  } else {
    accessToken = _apiTest2['default'].getApiToken;
    newConfig.headers.Authorization = accessToken;
  }
  authorization = accessToken;
  return newConfig;
}, function (err) {
  var error = err;
  return Promise.reject(error);
});

instance.interceptors.response.use(function (res) {
  statusCode = res.status; // 响应码
  responseHeader = (0, _jsonFormat2['default'])(res.headers);
  rcResponseHeader = JSON.stringify(res.headers);
  response = res.data instanceof Object ? (0, _jsonFormat2['default'])(res.data) : '' + res.data; // 响应主体
  rcResponse = JSON.stringify(res.data);
}, function (error) {
  statusCode = error.response.status; // 响应码
  responseHeader = (0, _jsonFormat2['default'])(error.response.headers);
  rcResponseHeader = JSON.stringify(error.response.headers);
  response = error.response.data instanceof Object ? (0, _jsonFormat2['default'])(error.response.data) : '' + error.response.data; // 响应主体
  rcResponse = JSON.stringify(error.response.data);
});

var APITest = (_dec = _form2['default'].create(), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(APITest, _Component);

  function APITest() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, APITest);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = APITest.__proto__ || Object.getPrototypeOf(APITest)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handleRefresh = function () {
      var currentNode = _apiTest2['default'].getCurrentNode;
      var detailFlag = _apiTest2['default'].getDetailFlag;
      if (detailFlag !== 'empty') {
        _this.setState(_this.getInitState(), function () {
          _this.loadDetail(currentNode);
        });
      }
    }, _this.loadDetail = function (node) {
      var resetFields = _this.props.form.resetFields;

      _apiTest2['default'].setIsShowResult(null);
      _apiTest2['default'].setDetailFlag('loading');
      _this.setState({
        isSending: false,
        urlPathValues: {},
        bData: {},
        query: '',
        taArr: {}
      });
      var _node$0$props = node[0].props,
          version = _node$0$props.version,
          operationId = _node$0$props.operationId,
          refController = _node$0$props.refController,
          servicePrefix = _node$0$props.servicePrefix;

      var queryObj = {
        version: version,
        operation_id: operationId
      };
      _choerodonBootCombine.axios.get(urlPrefix + '/manager/v1/swaggers/' + servicePrefix + '/controllers/' + refController + '/paths?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
          _apiTest2['default'].setDetailFlag('empty');
        } else {
          data.paths.some(function (item) {
            if (item.operationId === operationId) {
              var basePath = item.basePath,
                  url = item.url;

              _apiTest2['default'].setApiDetail(item);
              _apiTest2['default'].setDetailFlag('done');
              resetFields();
              _this.setState({
                requestUrl: '' + urlPrefix + basePath + url
              });
              return true;
            }
            return false;
          });
        }
      });
    }, _this.handleSelectChange = function (name, select) {
      var a = { target: { value: select } };
      _this.changeNormalValue(name, 'query', a);
    }, _this.changeTextareaValue = function (name, type, e) {
      if (type !== 'array') {
        _this.setState({
          bData: e.target.value
        });
      } else {
        _this.changeNormalValue(name, 'array', e);
      }
    }, _this.uploadRef = function (node) {
      if (node) {
        _this.fileInput = node;
      }
    }, _this.responseNode = function (node) {
      if (node) {
        _this.responseNode = node;
      }
    }, _this.curlNode = function (node) {
      if (node) {
        _this.curlNode = node;
      }
    }, _this.relateChoose = function () {
      _this.fileInput.click();
    }, _this.changeNormalValue = function (name, valIn, e) {
      var urlPathValues = _this.state.urlPathValues;

      var query = '';
      var requestUrl = '' + urlPrefix + _apiTest2['default'].getApiDetail.basePath + _apiTest2['default'].getApiDetail.url;
      urlPathValues['{' + name + '}'] = e.target.value;
      Object.entries(urlPathValues).forEach(function (items) {
        requestUrl = items[1] ? requestUrl.replace(items[0], items[1]) : requestUrl;
      });
      if (valIn === 'query' || valIn === 'array') {
        var arr = e.target.value.split('\n');
        _this.state.taArr[name] = arr;
        _this.setState({
          taArr: _this.state.taArr
        });
      }
      Object.entries(_this.state.taArr).forEach(function (a) {
        var entrieName = a[0];
        if (Array.isArray(a[1])) {
          a[1].forEach(function (v) {
            query = query + '&' + entrieName + '=' + v;
          });
        } else {
          query = query + '&' + entrieName + '=' + a[1];
        }
      });
      _this.setState({
        query: query
      });
      query = query.replace('&', '?');
      _this.setState({ requestUrl: '' + requestUrl + query, urlPathValues: urlPathValues });
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.props.form.validateFields(function (err, values) {
        if (!err) {
          _this.setState({ isSending: true });
          _apiTest2['default'].setIsShowResult(false);
          _this.responseNode.scrollTop = 0;
          _this.curlNode.scrollLeft = 0;
          _this.curlNode.scrollTop = 0;
          if (_this.fileInput) {
            var formData = new FormData();
            formData.append('file', _this.fileInput.files[0]);
            instance[_apiTest2['default'].getApiDetail.method](_this.state.requestUrl, formData).then(function (res) {
              this.setState({
                isSending: false
              });
              _apiTest2['default'].setIsShowResult(true);
            })['catch'](function (error) {
              _this.setState({
                isSending: false
              });
              _apiTest2['default'].setIsShowResult(true);
            });
          } else if ('bodyData' in values) {
            instance[_apiTest2['default'].getApiDetail.method](_this.state.requestUrl, _hjson2['default'].parse(values.bodyData || '')).then(function (res) {
              this.setState({
                isSending: false
              });
              _apiTest2['default'].setIsShowResult(true);
            })['catch'](function (error) {
              _this.setState({
                isSending: false
              });
              _apiTest2['default'].setIsShowResult(true);
            });
          } else {
            instance[_apiTest2['default'].getApiDetail.method](_this.state.requestUrl).then(function (res) {
              this.setState({
                isSending: false
              });
              _apiTest2['default'].setIsShowResult(true);
            })['catch'](function (error) {
              _this.setState({
                isSending: false
              });
              _apiTest2['default'].setIsShowResult(true);
            });
          }
        }
      });
    }, _this.openAuthorizeModal = function () {
      if (_this.AuthorizeModal) {
        var resetFields = _this.AuthorizeModal.props.form.resetFields;

        resetFields();
      }
      _apiTest2['default'].setIsShowModal(true);
    }, _this.handleCancel = function () {
      _apiTest2['default'].setIsShowModal(false);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(APITest, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _apiTest2['default'].setPageLoading(true);
      _apiTest2['default'].setDetailFlag('empty');
      _apiTest2['default'].setIsShowResult(null);
      _apiTest2['default'].setExpandedKeys([]);
      _apiTest2['default'].setUserInfo(null);
      _apiTest2['default'].setCurrentNode(null);
      _apiTest2['default'].setEventKey(null);
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
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
        pageLoading: true
      };
    }

    /**
     * 加载API详情数据
     * @param node 左侧树结构选中的节点
     */

  }, {
    key: 'copyToLeft',
    value: function copyToLeft(value, name) {
      var setFieldsValue = this.props.form.setFieldsValue;

      setFieldsValue({ bodyData: value });
    }
  }, {
    key: 'handleCopyCURL',
    value: function handleCopyCURL(culContent) {
      var formatMessage = this.props.intl.formatMessage;

      var curlRootEle = document.getElementById('curlContent');
      curlRootEle.value = culContent;
      curlRootEle.select();
      document.execCommand('Copy');
      Choerodon.prompt(formatMessage({ id: 'copy.success' }));
    }
  }, {
    key: 'handleCopyHeader',
    value: function handleCopyHeader() {
      var formatMessage = this.props.intl.formatMessage;

      var headerRootEle = document.getElementById('responseHeader');
      headerRootEle.value = rcResponseHeader;
      headerRootEle.select();
      document.execCommand('Copy');
      Choerodon.prompt(formatMessage({ id: 'copy.success' }));
    }
  }, {
    key: 'handleCopyBody',
    value: function handleCopyBody() {
      var formatMessage = this.props.intl.formatMessage;

      var headerRootEle = document.getElementById('responseContent');
      headerRootEle.value = rcResponse;
      headerRootEle.select();
      document.execCommand('Copy');
      Choerodon.prompt(formatMessage({ id: 'copy.success' }));
    }
  }, {
    key: 'getApiDetail',
    value: function getApiDetail() {
      var intl = this.props.intl;
      var _APITestStore$getApiD = _apiTest2['default'].getApiDetail,
          url = _APITestStore$getApiD.url,
          innerInterface = _APITestStore$getApiD.innerInterface,
          code = _APITestStore$getApiD.code,
          method = _APITestStore$getApiD.method,
          remark = _APITestStore$getApiD.remark,
          consumes = _APITestStore$getApiD.consumes,
          produces = _APITestStore$getApiD.produces;

      var desc = _apiTest2['default'].getApiDetail.description || '[]';
      var responseDataExample = _apiTest2['default'].getApiDetail && _apiTest2['default'].getApiDetail.responses.length ? _apiTest2['default'].getApiDetail.responses[0].body || 'false' : '{}';
      var handledDescWithComment = _hjson2['default'].parse(responseDataExample, { keepWsc: true });
      handledDescWithComment = (0, _jsonFormat2['default'])(handledDescWithComment);
      var handledDesc = _hjson2['default'].parse(desc);
      var _handledDesc$permissi = handledDesc.permission,
          permission = _handledDesc$permissi === undefined ? { roles: [] } : _handledDesc$permissi;

      var roles = permission.roles.length && permission.roles.map(function (item) {
        return {
          name: intl.formatMessage({ id: intlPrefix + '.default.role' }),
          value: item
        };
      });

      var tableValue = [{
        name: intl.formatMessage({ id: intlPrefix + '.code' }),
        value: code
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.method' }),
        value: method
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.url' }),
        value: url
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.remark' }),
        value: remark
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.action' }),
        value: permission && permission.action
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.level' }),
        value: permission && permission.permissionLevel
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.login.accessible' }),
        value: permission && permission.permissionLogin ? '是' : '否'
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.public.permission' }),
        value: permission && permission.permissionPublic ? '是' : '否'
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.request.format' }),
        value: consumes[0]
      }, {
        name: intl.formatMessage({ id: intlPrefix + '.response.format' }),
        value: produces[0]
      }];

      if (roles) {
        tableValue.splice.apply(tableValue, [5, 0].concat((0, _toConsumableArray3['default'])(roles)));
      }

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-apitest-content-right-container' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-apitest-content-right-container-title' },
          _react2['default'].createElement(
            'span',
            {
              className: (0, _classnames2['default'])('c7n-iam-apitest-content-right-container-title-methodTag', 'c7n-iam-apitest-content-right-container-title-methodTag-' + method)
            },
            _react2['default'].createElement(
              'span',
              null,
              method
            )
          ),
          _react2['default'].createElement(
            'span',
            { className: 'c7n-iam-apitest-content-right-container-title-url' },
            url
          ),
          _react2['default'].createElement(
            'span',
            { className: (0, _classnames2['default'])('c7n-iam-apitest-content-right-container-title-rangeTag', {
                'c7n-iam-apitest-content-right-container-title-rangeTag-inner': innerInterface,
                'c7n-iam-apitest-content-right-container-title-rangeTag-outer': !innerInterface
              })
            },
            innerInterface ? '内部' : '公开'
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-apitest-content-right-container-info' },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-apitest-content-right-container-info-title' },
            _react2['default'].createElement(
              'span',
              null,
              '\u63A5\u53E3\u4FE1\u606F'
            ),
            _react2['default'].createElement(
              'span',
              null,
              '\u54CD\u5E94\u6570\u636E'
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-apitest-content-right-container-info-content' },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-apitest-content-right-container-info-interfaceinfo' },
              tableValue.map(function (_ref2, index) {
                var name = _ref2.name,
                    value = _ref2.value;
                return _react2['default'].createElement(
                  _row2['default'],
                  { key: name + '-' + index, className: 'c7n-iam-apitest-content-right-container-info-interfaceinfo-row' },
                  _react2['default'].createElement(
                    _col2['default'],
                    { span: 7 },
                    name,
                    ':'
                  ),
                  _react2['default'].createElement(
                    _col2['default'],
                    { span: 17 },
                    value
                  )
                );
              })
            ),
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-apitest-content-right-container-info-responsedata' },
              _react2['default'].createElement(
                'pre',
                null,
                _react2['default'].createElement(
                  'code',
                  null,
                  handledDescWithComment
                )
              )
            )
          )
        )
      );
    }
  }, {
    key: 'getTest',
    value: function getTest() {
      var _this2 = this;

      var curlContent = void 0;
      var upperMethod = {
        get: 'GET',
        post: 'POST',
        options: 'OPTIONS',
        put: 'PUT',
        'delete': 'DELETE',
        patch: 'PATCH'
      };

      var handledStatusCode = void 0;
      var codeClass = void 0;
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

      var _props = this.props,
          intl = _props.intl,
          _props$form = _props.form,
          getFieldValue = _props$form.getFieldValue,
          getFieldDecorator = _props$form.getFieldDecorator,
          getFieldError = _props$form.getFieldError;

      var handleUrl = encodeURI(this.state.requestUrl);
      var handleMethod = upperMethod[_apiTest2['default'].getApiDetail.method];
      var currentToken = _apiTest2['default'].getApiToken || authorization;
      var token = currentToken ? currentToken.split(' ')[1] : null;
      var bodyStr = (getFieldValue('bodyData') || '').replace(/\n/g, '\\\n');
      var body = '';
      if (bodyStr) {
        body = '-d \'' + bodyStr + '\' ';
      }

      if (handleMethod === 'GET') {
        curlContent = 'curl -X ' + handleMethod + ' \\\n\'' + handleUrl + '\' \\\n--header \'Accept: application/json\' \\\n--header \'Authorization: Bearer ' + token + '\'';
      } else {
        curlContent = 'curl -X ' + handleMethod + ' \\\n\'' + handleUrl + '\' \\\n--header \'Content-Type: application/json\' \\\n--header \'Accept: application/json\' \\\n--header \'Authorization: Bearer ' + token + '\' \\\n' + body;
      }

      var method = _apiTest2['default'] && _apiTest2['default'].apiDetail.method;
      var requestColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        render: function render(text, record) {
          if (record.required) {
            return _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                'span',
                null,
                text
              ),
              _react2['default'].createElement(
                'span',
                { style: { color: '#d50000' } },
                '*'
              )
            );
          } else {
            return text;
          }
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.request.data' }),
        dataIndex: 'in',
        key: 'in',
        width: '25%',
        render: function render(text, record) {
          var editableNode = void 0;
          if (!record.type) {
            editableNode = _react2['default'].createElement(
              'div',
              { style: { width: '100%' }, className: 'c7n-iam-TextEditToggle-text' },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('bodyData', {
                  initialValue: undefined,
                  rules: [{
                    required: !record.type,
                    message: intl.formatMessage({ id: intlPrefix + '.required.msg' }, { name: '' + record.name })
                  }]
                })(_react2['default'].createElement(TextArea, { className: 'errorTextarea', rows: 6, placeholder: getFieldError('bodyData') }))
              ),
              _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-iam-TextEditToggle-text-icon' })
            );
          } else if (record.type === 'boolean') {
            editableNode = _react2['default'].createElement(
              FormItem,
              null,
              getFieldDecorator('' + record.name, {
                rules: [],
                initialValue: ''
              })(_react2['default'].createElement(
                'div',
                { style: { width: '55px' } },
                _react2['default'].createElement(
                  _select2['default'],
                  {
                    dropdownStyle: { width: '55px' },
                    defaultValue: '',
                    getPopupContainer: function getPopupContainer() {
                      return document.getElementsByClassName('page-content')[0];
                    },
                    onChange: _this2.handleSelectChange.bind(_this2, record.name)
                  },
                  _react2['default'].createElement(Option, { value: '', style: { height: '22px' } }),
                  _react2['default'].createElement(
                    Option,
                    { value: 'true' },
                    'true'
                  ),
                  _react2['default'].createElement(
                    Option,
                    { value: 'false' },
                    'false'
                  )
                )
              ))
            );
          } else if (record.type === 'array') {
            editableNode = _react2['default'].createElement(
              'div',
              { style: { width: '100%' } },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('' + record.name, {
                  rules: [{
                    required: !record.type,
                    message: intl.formatMessage({ id: intlPrefix + '.required.msg' }, { name: '' + record.name })
                  }],
                  initialValue: undefined
                })(_react2['default'].createElement(
                  'div',
                  { className: 'c7n-iam-TextEditToggle-text' },
                  _react2['default'].createElement(TextArea, { className: (0, _classnames2['default'])({ errorTextarea: getFieldError('' + record.name) }), rows: 6, placeholder: getFieldError('' + record.name) || '请以换行的形式输入多个值', onChange: _this2.changeTextareaValue.bind(_this2, record.name, record.type) }),
                  _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-iam-TextEditToggle-text-icon' })
                ))
              )
            );
          } else if (record.type === 'file') {
            editableNode = _react2['default'].createElement(
              'div',
              { className: 'uploadContainer' },
              _react2['default'].createElement('input', { type: 'file', name: 'file', ref: _this2.uploadRef }),
              _react2['default'].createElement(
                _button2['default'],
                { onClick: _this2.relateChoose },
                _react2['default'].createElement(_icon2['default'], { type: 'file_upload' }),
                ' ',
                intl.formatMessage({ id: intlPrefix + '.choose.file' })
              ),
              _react2['default'].createElement('div', { className: 'emptyMask' })
            );
          } else {
            editableNode = _react2['default'].createElement(
              FormItem,
              null,
              getFieldDecorator('' + record.name, {
                rules: [{
                  required: record.required,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.required.msg' }, { name: '' + record.name })
                }],
                initialValue: undefined
              })(_react2['default'].createElement(
                'div',
                { style: { width: '100%' }, className: 'c7n-iam-TextEditToggle-text' },
                _react2['default'].createElement(_input2['default'], { onFocus: _this2.inputOnFocus, autoComplete: 'off', onChange: _this2.changeNormalValue.bind(_this2, record.name, record['in']), placeholder: getFieldError('' + record.name) }),
                _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-iam-TextEditToggle-text-icon' })
              ))
            );
          }
          return editableNode;
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.request.data.type' }),
        dataIndex: 'type',
        key: 'type',
        width: '25%',
        render: function render(text, record) {
          if (text === 'integer' && record.format === 'int64') {
            return 'long';
          } else if (text === 'array') {
            return 'Array[string]';
          } else if (!text) {
            if (record.schema && record.schema.type && !record.body) {
              return record.schema.type;
            } else {
              var normalBody = void 0;
              var value = void 0;
              if (record.body) {
                value = _hjson2['default'].parse(record.body, { keepWsc: true });
                normalBody = _hjson2['default'].stringify(value, { bracesSameLine: true, quotes: 'all', separator: true });
                value = (0, _jsonFormat2['default'])(value);
              } else {
                value = null;
                normalBody = null;
              }
              return _react2['default'].createElement(
                'div',
                null,
                'Example Value',
                _react2['default'].createElement(
                  _tooltip2['default'],
                  { placement: 'left', title: intl.formatMessage({ id: intlPrefix + '.copyleft' }) },
                  _react2['default'].createElement(
                    'div',
                    { className: 'body-container', onClick: _this2.copyToLeft.bind(_this2, normalBody, record.name) },
                    _react2['default'].createElement(
                      'pre',
                      null,
                      _react2['default'].createElement(
                        'code',
                        null,
                        value
                      )
                    )
                  )
                )
              );
            }
          } else {
            return text;
          }
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.desc' }),
        dataIndex: 'description',
        key: 'description'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.type' }),
        dataIndex: 'in',
        key: 'inDefault'
      }];

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-apitest-content-right-container-interface-test' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-interface-test-response-params' },
          _react2['default'].createElement(
            'h5',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.request.parameter' })
          ),
          _react2['default'].createElement(
            _form2['default'],
            null,
            _react2['default'].createElement(_table2['default'], {
              pagination: false,
              filterBar: false,
              columns: requestColumns,
              dataSource: _apiTest2['default'] && _apiTest2['default'].apiDetail.parameters,
              rowKey: 'name',
              style: { width: '100%' }
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-url-container' },
          _react2['default'].createElement(
            'div',
            { style: { marginBottom: '30px' } },
            _react2['default'].createElement(
              'span',
              { className: (0, _classnames2['default'])('method', 'c7n-iam-apitest-content-right-container-title-methodTag-' + method) },
              method
            ),
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: this.state.requestUrl,
                placement: 'top',
                overlayStyle: { wordBreak: 'break-all' },
                arrowPointAtCenter: true
              },
              _react2['default'].createElement('input', { type: 'text', value: this.state.requestUrl, readOnly: true })
            ),
            !this.state.isSending ? _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                type: 'primary',
                htmlType: 'submit',
                onClick: this.handleSubmit
              },
              intl.formatMessage({ id: intlPrefix + '.send' })
            ) : _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                type: 'primary',
                loading: true
              },
              intl.formatMessage({ id: intlPrefix + '.sending' })
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { style: { textAlign: 'center', paddingTop: '100px', display: _apiTest2['default'].isShowResult === false ? 'block' : 'none' } },
          _react2['default'].createElement(_spin2['default'], { size: 'large' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-response-container', style: { display: _apiTest2['default'].isShowResult === true ? 'block' : 'none' } },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-response-code' },
            _react2['default'].createElement(
              'h5',
              null,
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.response.code' })
            ),
            _react2['default'].createElement(
              'span',
              { className: (0, _classnames2['default'])('c7n-iam-apitest-statusCode', '' + codeClass) },
              statusCode
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-response-body' },
            _react2['default'].createElement(
              'h5',
              null,
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.response.body' })
            ),
            _react2['default'].createElement(
              'div',
              { className: 'response-body-container', ref: this.responseNode },
              _react2['default'].createElement(
                'pre',
                null,
                _react2['default'].createElement(
                  'code',
                  null,
                  response
                )
              ),
              _react2['default'].createElement(_icon2['default'], {
                type: 'library_books',
                onClick: this.handleCopyBody.bind(this)
              }),
              _react2['default'].createElement('textarea', { style: { position: 'absolute', zIndex: -10 }, id: 'responseContent' })
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-response-body' },
            _react2['default'].createElement(
              'h5',
              null,
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.response.headers' })
            ),
            _react2['default'].createElement(
              'div',
              { className: 'response-body-container' },
              _react2['default'].createElement(
                'pre',
                null,
                _react2['default'].createElement(
                  'code',
                  null,
                  responseHeader
                )
              ),
              _react2['default'].createElement(_icon2['default'], {
                type: 'library_books',
                onClick: this.handleCopyHeader.bind(this)
              }),
              _react2['default'].createElement('textarea', { style: { position: 'absolute', zIndex: -10 }, id: 'responseHeader' })
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-curl' },
            _react2['default'].createElement(
              'h5',
              null,
              'CURL'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'curl-container', ref: this.curlNode },
              _react2['default'].createElement(
                'pre',
                null,
                _react2['default'].createElement(
                  'code',
                  null,
                  curlContent
                )
              ),
              _react2['default'].createElement(_icon2['default'], {
                type: 'library_books',
                onClick: this.handleCopyCURL.bind(this, curlContent)
              }),
              _react2['default'].createElement('textarea', { style: { position: 'absolute', zIndex: -10 }, id: 'curlContent' })
            )
          )
        )
      );
    }
  }, {
    key: 'getRightContent',
    value: function getRightContent() {
      var apiDetail = _apiTest2['default'].apiDetail,
          pageLoading = _apiTest2['default'].pageLoading;

      var detailFlag = _apiTest2['default'].getDetailFlag;
      var intl = this.props.intl;

      var rightContent = void 0;
      if (detailFlag === 'done') {
        rightContent = _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          this.getApiDetail(),
          this.getTest()
        );
      } else if (detailFlag === 'loading') {
        rightContent = _react2['default'].createElement(_spin2['default'], { spinning: detailFlag === 'loading', style: { flex: 1, marginTop: '30%' } });
      } else {
        rightContent = _react2['default'].createElement(
          'div',
          { style: {
              display: 'flex', alignItems: 'center', height: 250, margin: '88px auto', padding: '50px 75px'
            }
          },
          _react2['default'].createElement('img', { src: _noright2['default'], alt: '' }),
          _react2['default'].createElement(
            'div',
            { style: { marginLeft: 40 } },
            _react2['default'].createElement(
              'div',
              { style: { fontSize: '14px', color: 'rgba(0,0,0,0.65)' } },
              intl.formatMessage({ id: intlPrefix + '.empty.find.not' })
            ),
            _react2['default'].createElement(
              'div',
              { style: { fontSize: '20px', marginTop: 10 } },
              intl.formatMessage({ id: intlPrefix + '.empty.try.choose' })
            )
          )
        );
      }

      return rightContent;
    }

    // 开启授权模态框


    // 关闭授权模态框

  }, {
    key: 'renderModalContent',
    value: function renderModalContent() {
      var _this3 = this;

      var isShowModal = this.state.isShowModal;

      return _react2['default'].createElement(_AuthorizeModal2['default'], {
        isShow: isShowModal,
        onRef: function onRef(node) {
          _this3.AuthorizeModal = node;
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var isShowTree = _apiTest2['default'].isShowTree,
          apiDetail = _apiTest2['default'].apiDetail,
          pageLoading = _apiTest2['default'].pageLoading;
      var _props$AppState$getUs = this.props.AppState.getUserInfo,
          loginName = _props$AppState$getUs.loginName,
          realName = _props$AppState$getUs.realName;


      var detailFlag = _apiTest2['default'].getDetailFlag;
      var intl = this.props.intl;

      var hCursor = this.state.isHResize ? 'row-resize' : 'default';
      var hColor = this.state.isHResize ? '#ddd' : '#fff';
      var vCursor = this.state.isVResize ? 'col-resize' : 'default';
      var vColor = this.state.isVResize ? 'red' : 'black';
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['manager-service.api.queryTreeMenu', 'manager-service.api.queryPathDetail']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.openAuthorizeModal,
              icon: 'person',
              style: { textTransform: 'initial' }
            },
            _apiTest2['default'].getUserInfo ? _react2['default'].createElement(
              'span',
              null,
              _apiTest2['default'].getUserInfo
            ) : _react2['default'].createElement(
              'span',
              null,
              loginName,
              realName
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.handleRefresh,
              icon: 'refresh'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            className: 'c7n-iam-apitest',
            style: { padding: 0, display: 'flex' }
          },
          _react2['default'].createElement(
            _spin2['default'],
            { spinning: pageLoading },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-apitest-content' },
              !isShowTree && _react2['default'].createElement(
                'div',
                { className: 'c7n-iam-apitest-bar' },
                _react2['default'].createElement(
                  'div',
                  {
                    role: 'none',
                    className: 'c7n-iam-apitest-bar-button',
                    onClick: function onClick() {
                      _apiTest2['default'].setIsShowTree(true);
                    }
                  },
                  _react2['default'].createElement(_icon2['default'], { type: 'navigate_next' })
                ),
                _react2['default'].createElement(
                  'p',
                  {
                    role: 'none',
                    onClick: function onClick() {
                      _apiTest2['default'].setIsShowTree(true);
                    }
                  },
                  intl.formatMessage({ id: intlPrefix + '.apis.repository' })
                )
              ),
              _react2['default'].createElement(
                'div',
                { className: (0, _classnames2['default'])({ 'c7n-iam-apitest-content-tree-container': isShowTree, 'c7n-iam-apitest-content-tree-container-hidden': !isShowTree }) },
                _react2['default'].createElement(_apiTree2['default'], {
                  ref: function ref(tree) {
                    _this4.apiTree = tree;
                  },
                  onClose: function onClose() {
                    _apiTest2['default'].setIsShowTree(false);
                  },
                  getDetail: this.loadDetail
                })
              ),
              _react2['default'].createElement(
                'div',
                { className: 'c7n-iam-apitest-content-right' },
                this.getRightContent()
              )
            )
          ),
          _react2['default'].createElement(
            _modal2['default'],
            {
              bodyStyle: { height: '356px' },
              visible: _apiTest2['default'].getIsShowModal,
              closable: false,
              footer: null,
              width: 454,
              maskClosable: !_apiTest2['default'].modalSaving,
              onCancel: this.handleCancel,
              onOk: function onOk(e) {
                return _this4.AuthorizeModal.handleSubmit(e);
              }
            },
            this.renderModalContent()
          )
        )
      );
    }
  }]);
  return APITest;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = APITest;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _dec, _dec2, _class; /* eslint-disable func-names */


require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

require('./APITest.scss');

var _jsonFormat = require('../../../common/json-format');

var _jsonFormat2 = _interopRequireDefault(_jsonFormat);

var _apiTest = require('../../../stores/global/api-test');

var _apiTest2 = _interopRequireDefault(_apiTest);

var _AuthorizeModal = require('./AuthorizeModal');

var _AuthorizeModal2 = _interopRequireDefault(_AuthorizeModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var statusCode = void 0;
var responseHeader = void 0;
var response = void 0;
var rcResponseHeader = void 0;
var rcResponse = void 0;
var authorization = void 0;
var intlPrefix = 'global.apitest';
var urlPrefix = process.env.API_HOST;
var TabPane = _tabs2['default'].TabPane;
var Option = _select2['default'].Option;
var TextArea = _input2['default'].TextArea;

var FormItem = _form2['default'].Item;
var instance = _choerodonBootCombine.axios.create();

// Hjson编译配置
var options = {
  bracesSameLine: true,
  quotes: 'all', // 全部加上引号
  keepWsc: true
};

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

var APIDetail = (_dec = _form2['default'].create(), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(APIDetail, _Component);

  function APIDetail() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, APIDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = APIDetail.__proto__ || Object.getPrototypeOf(APIDetail)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handleSelectChange = function (name, select) {
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
    }, _this.getTest = function () {
      var curlContent = void 0;
      var upperMethod = {
        get: 'GET',
        post: 'POST',
        options: 'OPTIONS',
        put: 'PUT',
        'delete': 'DELETE',
        patch: 'PATCH'
      };
      var _this$props = _this.props,
          intl = _this$props.intl,
          getFieldValue = _this$props.form.getFieldValue;

      var handleUrl = encodeURI(_this.state.requestUrl);
      var handleMethod = upperMethod[_apiTest2['default'].getApiDetail.method];
      var currentToken = _apiTest2['default'].getApiToken || authorization;
      var token = currentToken ? currentToken.split(' ')[1] : null;
      var bodyStr = (getFieldValue('bodyData') || '').replace(/\n/g, '\\\n');
      var body = '';
      if (bodyStr) {
        body = '-d \'' + bodyStr + '\' ';
      }
      if (handleMethod === 'GET') {
        curlContent = 'curl -X ' + handleMethod + ' --header \'Accept: application/json\' --header \'Authorization: Bearer ' + token + '\' \'' + handleUrl + '\'';
      } else {
        curlContent = 'curl -X ' + handleMethod + ' --header \'Content-Type: application/json\' --header \'Accept: application/json\' --header \'Authorization: Bearer ' + token + '\' ' + body + '\'' + handleUrl + '\'';
      }
      var method = _apiTest2['default'] && _apiTest2['default'].apiDetail.method;
      var _this$props$form = _this.props.form,
          getFieldDecorator = _this$props$form.getFieldDecorator,
          getFieldError = _this$props$form.getFieldError;

      var requestColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '30%',
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
        width: '40%',
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
                rules: []
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
                    onChange: _this.handleSelectChange.bind(_this, record.name)
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
              { style: { width: '50%' } },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('' + record.name, {
                  rules: [{
                    required: !record.type,
                    message: intl.formatMessage({ id: intlPrefix + '.required.msg' }, { name: '' + record.name })
                  }]
                })(_react2['default'].createElement(
                  'div',
                  { className: 'c7n-iam-TextEditToggle-text' },
                  _react2['default'].createElement(TextArea, { className: (0, _classnames2['default'])({ errorTextarea: getFieldError('' + record.name) }), rows: 6, placeholder: getFieldError('' + record.name) || '请以换行的形式输入多个值', onChange: _this.changeTextareaValue.bind(_this, record.name, record.type) }),
                  _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-iam-TextEditToggle-text-icon' })
                ))
              )
            );
          } else if (record.type === 'file') {
            editableNode = _react2['default'].createElement(
              'div',
              { className: 'uploadContainer' },
              _react2['default'].createElement('input', { type: 'file', name: 'file', ref: _this.uploadRef }),
              _react2['default'].createElement(
                _button2['default'],
                { onClick: _this.relateChoose },
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
                }]
              })(_react2['default'].createElement(
                'div',
                { style: { width: '50%' }, className: 'c7n-iam-TextEditToggle-text' },
                _react2['default'].createElement(_input2['default'], { onFocus: _this.inputOnFocus, autoComplete: 'off', onChange: _this.changeNormalValue.bind(_this, record.name, record['in']), placeholder: getFieldError('' + record.name) }),
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
        width: '40%',
        render: function render(text, record) {
          if (text === 'integer' && record.format === 'int64') {
            return 'long';
          } else if (text === 'array') {
            return 'Array[string]';
          } else if (!text) {
            if (record.schema && record.schema.type) {
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
                    { className: 'body-container', onClick: _this.copyToLeft.bind(_this, normalBody, record.name) },
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
      }];

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-interface-test' },
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
              rowKey: 'name'
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-url-container' },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-authorize-info' },
            _react2['default'].createElement(
              'span',
              { className: 'info' },
              intl.formatMessage({ id: intlPrefix + '.authorize.account' }),
              '\uFF1A'
            ),
            _react2['default'].createElement(
              'span',
              { className: 'info' },
              _apiTest2['default'].getUserInfo || _this.props.AppState.getUserInfo.loginName
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'flat',
                type: 'primary',
                htmlType: 'submit',
                onClick: _this.openAuthorizeModal,
                icon: 'mode_edit'
              },
              intl.formatMessage({ id: intlPrefix + '.authorize.change' })
            )
          ),
          _react2['default'].createElement(
            'div',
            { style: { marginBottom: '30px' } },
            _react2['default'].createElement(
              'span',
              { className: (0, _classnames2['default'])('method', 'c7n-apitest-' + method) },
              method
            ),
            _react2['default'].createElement('input', { type: 'text', value: _this.state.requestUrl, readOnly: true }),
            !_this.state.isSending ? _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                type: 'primary',
                htmlType: 'submit',
                onClick: _this.handleSubmit
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
              'div',
              { className: 'response-code-container' },
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
              { className: 'response-body-container', ref: _this.responseNode },
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
                onClick: _this.handleCopyBody.bind(_this)
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
                onClick: _this.handleCopyHeader.bind(_this)
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
              { className: 'curl-container', ref: _this.curlNode },
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
                onClick: _this.handleCopyCURL.bind(_this, curlContent)
              }),
              _react2['default'].createElement('textarea', { style: { position: 'absolute', zIndex: -10 }, id: 'curlContent' })
            )
          )
        )
      );
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.props.form.validateFields(function (err, values) {
        if (!err) {
          _this.setState({ isSending: true });
          _apiTest2['default'].setIsShowResult(false);
          _this.responseNode.scrollTop = 0;
          _this.curlNode.scrollLeft = 0;
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
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(APIDetail, [{
    key: 'getInitState',
    value: function getInitState() {
      var _props$match$params = this.props.match.params,
          controller = _props$match$params.controller,
          version = _props$match$params.version,
          service = _props$match$params.service,
          operationId = _props$match$params.operationId;

      return {
        loading: true,
        controller: controller,
        version: version,
        service: service,
        operationId: operationId,
        requestUrl: null,
        urlPrefix: '',
        isSending: false,
        urlPathValues: {},
        bData: {},
        queryArr: {},
        query: '',
        taArr: {},
        loadFile: null,
        isShowModal: false
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      if (_apiTest2['default'].getApiDetail.description === '[]') {
        var _state = this.state,
            controller = _state.controller,
            version = _state.version,
            service = _state.service,
            operationId = _state.operationId;

        var queryObj = {
          version: version,
          operation_id: operationId
        };
        _choerodonBootCombine.axios.get(urlPrefix + '/manager/v1/swaggers/' + service + '/controllers/' + controller + '/paths?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
          data.paths.some(function (item) {
            if (item.operationId === operationId) {
              var basePath = item.basePath,
                  url = item.url;

              _apiTest2['default'].setApiDetail(item);
              _this2.setState({
                loading: false,
                requestUrl: '' + urlPrefix + basePath + url
              });
              return true;
            }
            return false;
          });
        });
      } else {
        var _APITestStore$getApiD = _apiTest2['default'].getApiDetail,
            basePath = _APITestStore$getApiD.basePath,
            url = _APITestStore$getApiD.url;

        this.setState({
          loading: false,
          requestUrl: '' + urlPrefix + basePath + url
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _apiTest2['default'].setIsShowResult(null);
    }
  }, {
    key: 'getDetail',
    value: function getDetail() {
      var intl = this.props.intl;
      var _APITestStore$getApiD2 = _apiTest2['default'].getApiDetail,
          code = _APITestStore$getApiD2.code,
          method = _APITestStore$getApiD2.method,
          url = _APITestStore$getApiD2.url,
          remark = _APITestStore$getApiD2.remark,
          consumes = _APITestStore$getApiD2.consumes,
          produces = _APITestStore$getApiD2.produces;

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

      var infoColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.property' }),
        dataIndex: 'name',
        key: 'name',
        width: '30%'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.value' }),
        dataIndex: 'value',
        key: 'value'
      }];

      var paramsColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.name' }),
        dataIndex: 'name',
        key: 'name',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.desc' }),
        dataIndex: 'description',
        key: 'description'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.param.type' }),
        dataIndex: 'in',
        key: 'in'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.request.data.type' }),
        dataIndex: 'type',
        key: 'type',
        render: function render(text, record) {
          if (text === 'integer' && record.format === 'int64') {
            return 'long';
          } else if (text === 'array') {
            return 'Array[string]';
          } else if (!text) {
            if (record.schema && record.schema.type) {
              return record.schema.type;
            } else {
              var value = void 0;
              if (record.body) {
                value = _hjson2['default'].parse(record.body, { keepWsc: true });
                value = (0, _jsonFormat2['default'])(value);
              } else {
                value = null;
              }
              return _react2['default'].createElement(
                'div',
                null,
                'Example Value',
                _react2['default'].createElement(
                  'div',
                  { className: 'body-container' },
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
              );
            }
          } else {
            return text;
          }
        }
      }];

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-interface-detail' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-interface-info' },
          _react2['default'].createElement(
            'h5',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.interface.info' })
          ),
          _react2['default'].createElement(_table2['default'], {
            columns: infoColumns,
            dataSource: tableValue,
            pagination: false,
            filterBar: false,
            rowKey: function rowKey(record) {
              return record.name + '-' + record.value;
            }
          })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-request-params' },
          _react2['default'].createElement(
            'h5',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.request.parameter' })
          ),
          _react2['default'].createElement(_table2['default'], {
            columns: paramsColumns,
            dataSource: _apiTest2['default'] && _apiTest2['default'].apiDetail.parameters,
            pagination: false,
            filterBar: false,
            rowKey: 'name'
          })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-response-data', style: { display: responseDataExample === 'false' ? 'none' : 'block' } },
          _react2['default'].createElement(
            'h5',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.response.data' })
          ),
          _react2['default'].createElement(
            'div',
            { className: 'response-data-container' },
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
      );
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

    // 开启授权模态框


    // 关闭授权模态框

  }, {
    key: 'copyToLeft',
    value: function copyToLeft(value, name) {
      var setFieldsValue = this.props.form.setFieldsValue;

      setFieldsValue({ bodyData: value });
    }
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

      var url = _apiTest2['default'] && _apiTest2['default'].apiDetail.url;
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        null,
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }),
          backPath: '/iam/api-test'
        }),
        this.state.loading ? _react2['default'].createElement(
          'div',
          { style: { textAlign: 'center', paddingTop: '250px' } },
          _react2['default'].createElement(_spin2['default'], { size: 'large' })
        ) : _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _choerodonBootCombine.Content,
            {
              className: 'c7n-api-test',
              code: intlPrefix + '.detail',
              values: { name: url }
            },
            _react2['default'].createElement(
              _tabs2['default'],
              null,
              _react2['default'].createElement(
                TabPane,
                { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.interface.detail' }), key: 'detail' },
                this.getDetail()
              ),
              _react2['default'].createElement(
                TabPane,
                { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.interface.test' }), key: 'test', disabled: _apiTest2['default'].getApiDetail.innerInterface },
                this.getTest()
              )
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
      );
    }
  }]);
  return APIDetail;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = APIDetail;
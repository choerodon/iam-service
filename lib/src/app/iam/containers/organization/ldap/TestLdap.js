'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

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

var _dec, _dec2, _class;

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./TestLdap.scss');

var _LDAPStore = require('../../../stores/organization/ldap/LDAPStore');

var _LDAPStore2 = _interopRequireDefault(_LDAPStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormItem = _form2['default'].Item;
var inputWidth = 512; // input框的长度
var intlPrefix = 'organization.ldap';
var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};
var timer = null;

var TestConnect = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(TestConnect, _Component);

  function TestConnect() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, TestConnect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = TestConnect.__proto__ || Object.getPrototypeOf(TestConnect)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.getSyncInfoOnce = function () {
      var ldapData = _LDAPStore2['default'].getLDAPData;
      var organizationId = _this.state.organizationId;

      _LDAPStore2['default'].getSyncInfo(organizationId, ldapData.id).then(function (data) {
        if (data.syncEndTime) {
          window.clearInterval(timer);
          _LDAPStore2['default'].setSyncData(data);
          _LDAPStore2['default'].setIsSyncLoading(false);
          _LDAPStore2['default'].setIsConfirmLoading(!data.syncEndTime);
        }
      });
    }, _this.getSpentTime = function (startTime, endTime) {
      var intl = _this.props.intl;

      var timeUnit = {
        day: intl.formatMessage({ id: 'day' }),
        hour: intl.formatMessage({ id: 'hour' }),
        minute: intl.formatMessage({ id: 'minute' }),
        second: intl.formatMessage({ id: 'second' })
      };
      var spentTime = new Date(endTime).getTime() - new Date(startTime).getTime(); // 时间差的毫秒数
      // 天数
      var days = Math.floor(spentTime / (24 * 3600 * 1000));
      // 小时
      var leave1 = spentTime % (24 * 3600 * 1000); //  计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      // 分钟
      var leave2 = leave1 % (3600 * 1000); //  计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      // 秒数
      var leave3 = leave2 % (60 * 1000); //  计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      var resultDays = days ? days + timeUnit.day : '';
      var resultHours = hours ? hours + timeUnit.hour : '';
      var resultMinutes = minutes ? minutes + timeUnit.minute : '';
      var resultSeconds = seconds ? seconds + timeUnit.second : '';
      return resultDays + resultHours + resultMinutes + resultSeconds;
    }, _this.closeSyncSidebar = function () {
      window.clearInterval(timer);
      _LDAPStore2['default'].setIsSyncLoading(false);
    }, _this.handleSubmit = function (e) {
      var _this$props = _this.props,
          showWhich = _this$props.showWhich,
          intl = _this$props.intl;
      var organizationId = _this.state.organizationId;

      e.preventDefault();
      if (showWhich === 'connect') {
        _this.props.form.validateFieldsAndScroll(function (err, value) {
          if (!err) {
            _LDAPStore2['default'].setIsShowResult(true);
            _LDAPStore2['default'].setIsConnectLoading(true);
            var ldapData = (0, _extends3['default'])({}, _LDAPStore2['default'].getLDAPData);
            ldapData.account = value.ldapname;
            ldapData.password = value.ldappwd;
            _LDAPStore2['default'].setIsConfirmLoading(true);
            _LDAPStore2['default'].testConnect(organizationId, _LDAPStore2['default'].getLDAPData.id, ldapData).then(function (res) {
              if (res) {
                _LDAPStore2['default'].setTestData(res);
              }
              _LDAPStore2['default'].setIsConnectLoading(false);
              _LDAPStore2['default'].setIsConfirmLoading(false);
            });
          }
        });
      } else if (showWhich === 'adminConnect') {
        _LDAPStore2['default'].setIsConnectLoading(true);
        _LDAPStore2['default'].setIsConfirmLoading(true);
        var ldapData = _LDAPStore2['default'].getLDAPData;
        _LDAPStore2['default'].testConnect(organizationId, _LDAPStore2['default'].getLDAPData.id, ldapData).then(function (res) {
          if (res) {
            _LDAPStore2['default'].setTestData(res);
          }
          _LDAPStore2['default'].setIsConnectLoading(false);
          _LDAPStore2['default'].setIsConfirmLoading(false);
        });
      } else if (showWhich === 'sync') {
        _LDAPStore2['default'].setIsConfirmLoading(true);
        _LDAPStore2['default'].SyncUsers(organizationId, _LDAPStore2['default'].getLDAPData.id).then(function (data) {
          if (data.failed) {
            _LDAPStore2['default'].setIsConfirmLoading(false);
            Choerodon.prompt(data.message);
          } else {
            _LDAPStore2['default'].setIsSyncLoading(true);
          }
        });
      }
    }, _this.handleAbort = function () {
      var _this$props2 = _this.props,
          intl = _this$props2.intl,
          onAbort = _this$props2.onAbort;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.abort.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.abort.content' }),
        onOk: function onOk() {
          return _choerodonBootCombine.axios.put('iam/v1/organizations/' + _LDAPStore2['default'].ldapData.organizationId + '/ldaps/' + _LDAPStore2['default'].ldapData.id + '/stop').then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
              _this.closeSyncSidebar();
            } else {
              Choerodon.prompt('终止成功');
              _this.closeSyncSidebar();
            }
            if (onAbort) {
              onAbort();
            }
          });
        }
      });
    }, _this.renderAobrtButton = function () {
      var passTime = new Date() - new Date(_LDAPStore2['default'].getSyncData && _LDAPStore2['default'].getSyncData.syncBeginTime);
      if (_LDAPStore2['default'].getSyncData && _LDAPStore2['default'].getSyncData.syncEndTime === null && passTime / 1000 > 3600) {
        return _react2['default'].createElement(
          _button2['default'],
          {
            funcType: 'raised',
            type: 'primary',
            style: { backgroundColor: '#f44336', margin: '0 auto', display: 'inherit' },
            onClick: _this.handleAbort
          },
          '\u5F3A\u5236\u7EC8\u6B62'
        );
      }
      return null;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(TestConnect, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        organizationId: this.props.AppState.currentMenuType.id
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.onRef(this);
    }
  }, {
    key: 'loading',
    value: function loading() {
      var intl = this.props.intl;

      window.clearInterval(timer);
      timer = window.setInterval(this.getSyncInfoOnce, 9000);
      var tip = intl.formatMessage({ id: intlPrefix + '.sync.loading' });
      var syncTip = intl.formatMessage({ id: intlPrefix + '.sync.loading.tip' });
      return this.renderLoading(tip, syncTip);
    }
  }, {
    key: 'getTestResult',
    value: function getTestResult() {
      var testData = _LDAPStore2['default'].getTestData;
      var ldapData = _LDAPStore2['default'].getLDAPData;
      var adminAccount = _LDAPStore2['default'].getLDAPData.account;
      var adminPassword = _LDAPStore2['default'].getLDAPData.password;
      var adminStatus = adminAccount && adminPassword;
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'p',
          { className: 'testTitle' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.test.result' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'resultContainer' },
          _react2['default'].createElement(
            'div',
            { className: 'resultInfo' },
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(_icon2['default'], { type: testData.canLogin ? 'check_circle' : 'cancel', className: testData.canLogin ? 'successIcon' : 'failedIcon' }),
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.test.login' }),
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: testData.canLogin ? 'success' : 'error' })
            ),
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(_icon2['default'], { type: testData.canConnectServer ? 'check_circle' : 'cancel', className: testData.canConnectServer ? 'successIcon' : 'failedIcon' }),
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.test.connect' }),
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: testData.canConnectServer ? 'success' : 'error' })
            ),
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(_icon2['default'], { type: testData.matchAttribute ? 'check_circle' : 'cancel', className: testData.matchAttribute ? 'successIcon' : 'failedIcon' }),
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.test.user' }),
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: testData.matchAttribute ? 'success' : 'error' })
            ),
            _react2['default'].createElement(
              'ul',
              { className: 'info' },
              _react2['default'].createElement(
                'li',
                {
                  style: { display: ldapData.loginNameField ? 'inline' : 'none' },
                  className: ldapData.loginNameField === testData.loginNameField ? 'toRed' : ''
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.loginname' }),
                _react2['default'].createElement(
                  'span',
                  null,
                  ldapData.loginNameField
                )
              ),
              _react2['default'].createElement(
                'li',
                {
                  style: { display: ldapData.realNameField && adminStatus ? 'inline' : 'none' },
                  className: ldapData.realNameField === testData.realNameField ? 'toRed' : ''
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.realname' }),
                _react2['default'].createElement(
                  'span',
                  null,
                  ldapData.realNameField
                )
              ),
              _react2['default'].createElement(
                'li',
                {
                  style: { display: ldapData.phoneField && adminStatus ? 'inline' : 'none' },
                  className: ldapData.phoneField === testData.phoneField ? 'toRed' : ''
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.phone' }),
                _react2['default'].createElement(
                  'span',
                  null,
                  ldapData.phoneField
                )
              ),
              _react2['default'].createElement(
                'li',
                {
                  style: { display: ldapData.emailField ? 'inline' : 'none' },
                  className: ldapData.emailField === testData.emailField ? 'toRed' : ''
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.email' }),
                _react2['default'].createElement(
                  'span',
                  null,
                  ldapData.emailField
                )
              ),
              _react2['default'].createElement(
                'li',
                {
                  style: { display: ldapData.uuidField ? 'inline' : 'none' },
                  className: ldapData.uuidField === testData.uuidField ? 'toRed' : ''
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.uuid' }),
                _react2['default'].createElement(
                  'span',
                  null,
                  ldapData.uuidField
                )
              )
            )
          )
        )
      );
    }
  }, {
    key: 'getSyncInfo',
    value: function getSyncInfo() {
      var syncData = _LDAPStore2['default'].getSyncData || {};
      if (timer) {
        window.clearInterval(timer);
      }
      if (!Object.getOwnPropertyNames(syncData).length) {
        return _react2['default'].createElement(
          'div',
          { className: 'syncContainer' },
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sync.norecord' })
          )
        );
      } else if (syncData && syncData.syncEndTime) {
        return _react2['default'].createElement(
          'div',
          { className: 'syncContainer' },
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sync.lasttime' }),
            ' ',
            syncData.syncEndTime
          ),
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, {
              id: intlPrefix + '.sync.time',
              values: {
                time: this.getSpentTime(syncData.syncBeginTime, syncData.syncEndTime),
                count: syncData.updateUserCount + syncData.newUserCount
              }
            })
          )
        );
      } else if (!syncData.syncEndTime) {
        return _LDAPStore2['default'].setIsSyncLoading(true);
      }
    }
  }, {
    key: 'getSidebarContent',
    value: function getSidebarContent() {
      var _props = this.props,
          showWhich = _props.showWhich,
          intl = _props.intl;
      var getFieldDecorator = this.props.form.getFieldDecorator;

      var testData = _LDAPStore2['default'].getTestData;
      var ldapData = _LDAPStore2['default'].getLDAPData;
      var isSyncLoading = _LDAPStore2['default'].getIsSyncLoading;
      if (showWhich === 'connect') {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _form2['default'],
            { onSubmit: this.handleSubmit.bind(this) },
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('ldapname', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
                }]
              })(_react2['default'].createElement(_input2['default'], {
                autoComplete: 'off',
                label: intl.formatMessage({ id: intlPrefix + '.name' }),
                style: { width: inputWidth }
              }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('ldappwd', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.password.require.msg' })
                }]
              })(_react2['default'].createElement(_input2['default'], {
                autoComplete: 'off',
                type: 'password',
                label: intl.formatMessage({ id: intlPrefix + '.password' }),
                style: { width: inputWidth }
              }))
            )
          ),
          _react2['default'].createElement(
            'div',
            { style: { width: '512px', display: _LDAPStore2['default'].getIsShowResult ? 'block' : 'none' } },
            _LDAPStore2['default'].getIsConnectLoading ? this.renderLoading(intl.formatMessage({ id: intlPrefix + '.test.loading' })) : this.getTestResult()
          )
        );
      } else if (showWhich === 'adminConnect') {
        return _react2['default'].createElement(
          'div',
          { style: { width: '512px' } },
          _LDAPStore2['default'].getIsConnectLoading ? this.renderLoading(intl.formatMessage({ id: intlPrefix + '.test.loading' })) : this.getTestResult()
        );
      } else {
        return _react2['default'].createElement(
          'div',
          { style: { width: '512px' } },
          isSyncLoading ? this.loading() : this.getSyncInfo()
        );
      }
    }
  }, {
    key: 'renderLoading',
    value: function renderLoading(tip) {
      var syncTip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return _react2['default'].createElement(
        'div',
        { className: 'loadingContainer' },
        _react2['default'].createElement(
          'div',
          { className: 'connectLoader' },
          _react2['default'].createElement(_spin2['default'], { size: 'large' })
        ),
        _react2['default'].createElement(
          'p',
          { className: 'loadingText' },
          tip
        ),
        _react2['default'].createElement(
          'p',
          { className: 'tipText' },
          syncTip
        ),
        this.renderAobrtButton()
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var showWhich = this.props.showWhich;

      var code = void 0;
      if (showWhich === 'connect') {
        code = intlPrefix + '.connect';
      } else if (showWhich === 'adminConnect') {
        code = intlPrefix + '.adminconnect';
      } else if (showWhich === 'sync') {
        code = intlPrefix + '.sync';
      }
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          style: { padding: 0 },
          code: code
        },
        this.getSidebarContent()
      );
    }
  }]);
  return TestConnect;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = TestConnect;
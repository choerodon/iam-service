'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// global 对应目录
var announcement = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/announcement');
});
var apiTest = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/api-test');
});
var apiOverview = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/api-overview');
});
var configuration = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/configuration');
});
var instance = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/instance');
});
var inmailTemplate = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/inmail-template');
});
var mailTemplate = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/mail-template');
});
var mailSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/mail-setting');
});
var systemSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/system-setting');
});
var memberRole = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/member-role');
});
var menuSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/menu-setting');
});
var msgRecord = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/msg-record');
});
var microService = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/microservice');
});
var organization = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/organization');
});
var role = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/role');
});
var roleLabel = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/role-label');
});
var rootUser = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/root-user');
});
var route = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/route');
});
var saga = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/saga');
});
var sagaInstance = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/saga-instance');
});
var siteStatistics = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/site-statistics');
});
// const smsTemplate = asyncRouter(() => import('./global/sms-template'));
// const smsSetting = asyncRouter(() => import('./global/sms-setting'));
var dashboardSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/dashboard-setting');
});
var sendSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/send-setting');
});
var taskDetail = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/task-detail');
});
var executionRecord = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/execution-record');
});
var executableProgram = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/executable-program');
});
var projectType = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./global/project-type');
});

// organization
var client = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/client');
});
var ldap = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/ldap');
});
var passwordPolicy = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/password-policy');
});
var project = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/project');
});
var user = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/user');
});
var organizationSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/organization-setting');
});
var application = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./organization/application');
});

// project
var projectSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./project/project-setting');
});

// user
var password = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/password');
});
var organizationInfo = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/organization-info');
});
var projectInfo = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/project-info');
});
var tokenManager = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/token-manager');
});
var receiveSetting = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/receive-setting');
});
var userInfo = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/user-info');
});
var userMsg = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/user-msg');
});
var permissionInfo = (0, _choerodonBootCombine.asyncRouter)(function () {
  return import('./user/permission-info');
});

var IAMIndex = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = function (_React$Component) {
  (0, _inherits3['default'])(IAMIndex, _React$Component);

  function IAMIndex() {
    (0, _classCallCheck3['default'])(this, IAMIndex);
    return (0, _possibleConstructorReturn3['default'])(this, (IAMIndex.__proto__ || Object.getPrototypeOf(IAMIndex)).apply(this, arguments));
  }

  (0, _createClass3['default'])(IAMIndex, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          match = _props.match,
          AppState = _props.AppState;

      var langauge = AppState.currentLanguage;
      var IntlProviderAsync = (0, _choerodonBootCombine.asyncLocaleProvider)(langauge, function () {
        return import('../locale/' + langauge);
      });
      return _react2['default'].createElement(
        IntlProviderAsync,
        null,
        _react2['default'].createElement(
          _reactRouterDom.Switch,
          null,
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/announcement', component: announcement }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/api-test', component: apiTest }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/api-overview', component: apiOverview }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/configuration', component: configuration }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/inmail-template', component: inmailTemplate }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/instance', component: instance }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/member-role', component: memberRole }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/menu-setting', component: menuSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/msg-record', component: msgRecord }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/mail-template', component: mailTemplate }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/mail-setting', component: mailSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/system-setting', component: systemSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/send-setting', component: sendSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/microservice', component: microService }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/organization', component: organization }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/role', component: role }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/role-label', component: roleLabel }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/root-user', component: rootUser }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/route', component: route }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/saga', component: saga }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/saga-instance', component: sagaInstance }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/task-detail', component: taskDetail }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/execution-record', component: executionRecord }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/executable-program', component: executableProgram }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/dashboard-setting', component: dashboardSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/client', component: client }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/ldap', component: ldap }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/password-policy', component: passwordPolicy }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/project', component: project }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/user', component: user }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/project-setting', component: projectSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/password', component: password }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/organization-info', component: organizationInfo }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/project-info', component: projectInfo }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/token-manager', component: tokenManager }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/receive-setting', component: receiveSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/user-info', component: userInfo }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/user-msg', component: userMsg }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/permission-info', component: permissionInfo }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/site-statistics', component: siteStatistics }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/organization-setting', component: organizationSetting }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/project-type', component: projectType }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: match.url + '/application', component: application }),
          _react2['default'].createElement(_reactRouterDom.Route, { path: '*', component: _choerodonBootCombine.nomatch })
        )
      );
    }
  }]);
  return IAMIndex;
}(_react2['default'].Component)) || _class);
exports['default'] = IAMIndex;
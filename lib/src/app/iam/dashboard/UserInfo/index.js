'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

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

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _UserInfoStore = require('../../stores/user/user-info/UserInfoStore');

var _UserInfoStore2 = _interopRequireDefault(_UserInfoStore);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.userinfo';

var UserInfo = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(UserInfo, _Component);

  function UserInfo() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, UserInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = UserInfo.__proto__ || Object.getPrototypeOf(UserInfo)).call.apply(_ref, [this].concat(args))), _this), _this.loadUserInfo = function () {
      var getUserInfo = _this.props.AppState.getUserInfo;

      _UserInfoStore2['default'].setUserInfo(getUserInfo);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(UserInfo, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadUserInfo();
    }
  }, {
    key: 'render',
    value: function render() {
      var HeaderStore = this.props.HeaderStore;
      var _UserInfoStore$getUse = _UserInfoStore2['default'].getUserInfo,
          loginName = _UserInfoStore$getUse.loginName,
          realName = _UserInfoStore$getUse.realName,
          email = _UserInfoStore$getUse.email,
          ldap = _UserInfoStore$getUse.ldap,
          organizationName = _UserInfoStore$getUse.organizationName;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-user-info' },
        _react2['default'].createElement(
          'dl',
          null,
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.realname' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            realName
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.loginname' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            loginName
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.email' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            email
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.ldap' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.ldap.' + !!ldap })
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.organization' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            organizationName
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            _reactRouterDom.Link,
            { to: '/iam/user-info?type=site' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect' })
          )
        )
      );
    }
  }]);
  return UserInfo;
}(_react.Component)) || _class) || _class);
exports['default'] = UserInfo;
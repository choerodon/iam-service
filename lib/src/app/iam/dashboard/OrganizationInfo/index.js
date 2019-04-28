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

var _OrganizationStore = require('../../stores/global/organization/OrganizationStore');

var _OrganizationStore2 = _interopRequireDefault(_OrganizationStore);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.organizationinfo';

var OrganizationInfo = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(OrganizationInfo, _Component);

  function OrganizationInfo() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, OrganizationInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = OrganizationInfo.__proto__ || Object.getPrototypeOf(OrganizationInfo)).call.apply(_ref, [this].concat(args))), _this), _this.loadOrganizationInfo = function () {
      var _this$props$AppState = _this.props.AppState,
          id = _this$props$AppState.currentMenuType.id,
          userId = _this$props$AppState.getUserInfo.id;

      _OrganizationStore2['default'].loadMyData(id, userId);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(OrganizationInfo, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadOrganizationInfo();
    }
  }, {
    key: 'render',
    value: function render() {
      var _OrganizationStore$my = _OrganizationStore2['default'].myOrg,
          name = _OrganizationStore$my.name,
          code = _OrganizationStore$my.code,
          projectCount = _OrganizationStore$my.projectCount,
          myRoles = _OrganizationStore2['default'].myRoles;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-organization-info' },
        _react2['default'].createElement(
          'dl',
          null,
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            name
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            code
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.role' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            myRoles.length ? myRoles.map(function (_ref2) {
              var name = _ref2.name;
              return name;
            }).join(', ') : '无'
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.projects' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            projectCount
          )
        )
      );
    }
  }]);
  return OrganizationInfo;
}(_react.Component)) || _class) || _class);
exports['default'] = OrganizationInfo;
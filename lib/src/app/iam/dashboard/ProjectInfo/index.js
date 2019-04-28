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

var _ProjectStore = require('../../stores/organization/project/ProjectStore');

var _ProjectStore2 = _interopRequireDefault(_ProjectStore);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.projectinfo';

var ProjectInfo = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(ProjectInfo, _Component);

  function ProjectInfo() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ProjectInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ProjectInfo.__proto__ || Object.getPrototypeOf(ProjectInfo)).call.apply(_ref, [this].concat(args))), _this), _this.loadProjectInfo = function () {
      var _this$props$AppState = _this.props.AppState,
          id = _this$props$AppState.currentMenuType.id,
          userId = _this$props$AppState.getUserInfo.id;

      _ProjectStore2['default'].loadMyData(id, userId);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ProjectInfo, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadProjectInfo();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          HeaderStore = _props.HeaderStore,
          AppState = _props.AppState,
          intl = _props.intl;
      var myRoles = _ProjectStore2['default'].myRoles;
      var _AppState$currentMenu = AppState.currentMenuType,
          projectId = _AppState$currentMenu.id,
          organizationId = _AppState$currentMenu.organizationId,
          type = _AppState$currentMenu.type;

      var projectData = HeaderStore.getProData || [];
      var orgData = HeaderStore.getOrgData || [];

      var _ref2 = projectData.find(function (_ref3) {
        var id = _ref3.id;
        return String(id) === String(projectId);
      }) || {},
          name = _ref2.name,
          code = _ref2.code,
          typeName = _ref2.typeName;

      var _ref4 = orgData.find(function (_ref5) {
        var id = _ref5.id;
        return String(id) === String(organizationId);
      }) || {},
          organizeName = _ref4.name;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-project' },
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
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            typeName || intl.formatMessage({ id: 'dashboard.empty' })
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.organization' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            organizeName
          ),
          _react2['default'].createElement(
            'dt',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.role' })
          ),
          _react2['default'].createElement(
            'dd',
            null,
            myRoles.length ? myRoles.map(function (_ref6) {
              var roleName = _ref6.name;
              return roleName;
            }).join(', ') : intl.formatMessage({ id: 'dashboard.empty' })
          )
        )
      );
    }
  }]);
  return ProjectInfo;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = ProjectInfo;
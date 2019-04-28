'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/table/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _projectInfo = require('../../stores/user/project-info');

var _projectInfo2 = _interopRequireDefault(_projectInfo);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.myproject';

var MyProject = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MyProject, _Component);

  function MyProject() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, MyProject);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = MyProject.__proto__ || Object.getPrototypeOf(MyProject)).call.apply(_ref, [this].concat(args))), _this), _this.orgId = null, _this.loadData = function () {
      var orgId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.getOrgId();

      _this.orgId = orgId;
      _projectInfo2['default'].loadMyProjects(orgId);
    }, _this.handleRow = function (record) {
      return {
        onClick: _this.handleRowClick.bind(_this, record)
      };
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(MyProject, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadData();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setShowSize();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextOrgId = this.getOrgId(nextProps);
      if (nextOrgId !== this.orgId) {
        this.loadData(nextOrgId);
      }
      this.setShowSize();
    }
  }, {
    key: 'setShowSize',
    value: function setShowSize() {
      var showSize = _projectInfo2['default'].showSize;

      var newSize = parseInt((this.tableRef.parentElement.clientHeight - 51) / (100 / 3) - 1, 10);
      if (newSize !== showSize) {
        _projectInfo2['default'].setShowSize(newSize);
      }
    }
  }, {
    key: 'getOrgId',
    value: function getOrgId() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var _props$AppState$curre = props.AppState.currentMenuType,
          orgId = _props$AppState$curre.id,
          organizationId = _props$AppState$curre.organizationId;

      return organizationId || orgId;
    }
  }, {
    key: 'handleRowClick',
    value: function handleRowClick(_ref2) {
      var id = _ref2.id,
          organizationId = _ref2.organizationId,
          name = _ref2.name;
      var history = this.props.history;

      history.push('/?type=project&id=' + id + '&name=' + encodeURIComponent(name) + '&organizationId=' + organizationId);
    }
  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        key: 'name'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'code',
        key: 'code'
      }];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var myProjectData = _projectInfo2['default'].myProjectData,
          loading = _projectInfo2['default'].loading,
          showSize = _projectInfo2['default'].showSize;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-my-project', ref: function ref(e) {
            _this2.tableRef = e;
          } },
        _react2['default'].createElement(
          'section',
          null,
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            columns: this.getTableColumns(),
            dataSource: myProjectData.slice().slice(0, showSize > 0 ? showSize : 1),
            filterBar: false,
            pagination: false,
            rowKey: 'code',
            onRow: this.handleRow,
            empty: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.no-project' })
          })
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            _reactRouterDom.Link,
            { to: '/iam/project-info?type=site' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect' })
          )
        )
      );
    }
  }]);
  return MyProject;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = MyProject;
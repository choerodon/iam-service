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

var _organizationInfo = require('../../stores/user/organization-info');

var _organizationInfo2 = _interopRequireDefault(_organizationInfo);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.myorganization';

var MyOrganization = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MyOrganization, _Component);

  function MyOrganization() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, MyOrganization);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = MyOrganization.__proto__ || Object.getPrototypeOf(MyOrganization)).call.apply(_ref, [this].concat(args))), _this), _this.loadData = function () {
      _organizationInfo2['default'].loadMyOrganizations();
    }, _this.handleRow = function (record) {
      return {
        onClick: _this.handleRowClick.bind(_this, record)
      };
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(MyOrganization, [{
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
    value: function componentWillReceiveProps() {
      this.setShowSize();
    }
  }, {
    key: 'setShowSize',
    value: function setShowSize() {
      var showSize = _organizationInfo2['default'].showSize;

      var newSize = parseInt((this.tableRef.parentElement.clientHeight - 51) / (100 / 3) - 1, 10);
      if (newSize !== showSize) {
        _organizationInfo2['default'].setShowSize(newSize);
      }
    }
  }, {
    key: 'handleRowClick',
    value: function handleRowClick(_ref2) {
      var id = _ref2.id,
          name = _ref2.name;
      var history = this.props.history;

      history.push('/?type=organization&id=' + id + '&name=' + encodeURIComponent(name));
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

      var myOrganizationData = _organizationInfo2['default'].myOrganizationData,
          loading = _organizationInfo2['default'].loading,
          showSize = _organizationInfo2['default'].showSize;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-my-organization', ref: function ref(e) {
            _this2.tableRef = e;
          } },
        _react2['default'].createElement(
          'section',
          null,
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            columns: this.getTableColumns(),
            dataSource: myOrganizationData.slice().slice(0, showSize > 0 ? showSize : 1),
            filterBar: false,
            pagination: false,
            rowKey: 'code',
            onRow: this.handleRow
          })
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            _reactRouterDom.Link,
            { to: '/iam/organization-info?type=site' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect' })
          )
        )
      );
    }
  }]);
  return MyOrganization;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = MyOrganization;
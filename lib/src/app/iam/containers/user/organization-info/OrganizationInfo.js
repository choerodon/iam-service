'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

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

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class; /**
                   * Created by hulingfangzi on 2018/7/2.
                   */


require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./OrganizationInfo.scss');

var _permissionInfo = require('../permission-info');

var _permissionInfo2 = _interopRequireDefault(_permissionInfo);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlPrefix = 'user.orginfo';
var Sidebar = _modal2['default'].Sidebar;
var ProjectInfo = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(ProjectInfo, _Component);

  function ProjectInfo() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ProjectInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ProjectInfo.__proto__ || Object.getPrototypeOf(ProjectInfo)).call.apply(_ref, [this].concat(args))), _this), _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadInitData(pagination, params);
    }, _this.getRowKey = function (record, id) {
      if ('roles' in record) {
        return record.id;
      } else {
        return id + '-' + record.id;
      }
    }, _this.openSidebar = function (record) {
      var _this$props = _this.props,
          OrganizationInfoStore = _this$props.OrganizationInfoStore,
          PermissionInfoStore = _this$props.PermissionInfoStore;

      (0, _mobx.runInAction)(function () {
        if (record.id !== PermissionInfoStore.role.id) {
          PermissionInfoStore.clear();
          PermissionInfoStore.setRole(record);
          PermissionInfoStore.loadData();
        }
        OrganizationInfoStore.showSideBar();
      });
    }, _this.closeSidebar = function () {
      var OrganizationInfoStore = _this.props.OrganizationInfoStore;

      OrganizationInfoStore.hideSideBar();
    }, _this.handleRefresh = function () {
      var _this$props2 = _this.props,
          OrganizationInfoStore = _this$props2.OrganizationInfoStore,
          id = _this$props2.AppState.getUserInfo.id;

      OrganizationInfoStore.refresh(id);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ProjectInfo, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadInitData();
    }
  }, {
    key: 'loadInitData',
    value: function loadInitData(pagination, params) {
      var _props = this.props,
          OrganizationInfoStore = _props.OrganizationInfoStore,
          id = _props.AppState.getUserInfo.id;

      OrganizationInfoStore.loadData(id, pagination, params);
    }

    /* 打开sidebar */


    // 关闭sidebar

  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      var _this2 = this;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        render: function render(text, record) {
          var icon = '';
          if ('roles' in record) {
            icon = 'domain';
          } else {
            icon = 'person';
          }
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.25, className: 'c7n-org-info-orgname' },
            _react2['default'].createElement(_icon2['default'], { type: icon, style: { verticalAlign: 'text-bottom' } }),
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'code' }),
        dataIndex: 'code',
        key: 'code',
        className: 'c7n-org-info-code',
        width: '35%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.3 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'type' }),
        dataIndex: 'type',
        key: 'type',
        width: '15%',
        render: function render(text, record) {
          return 'projects' in record ? '组织' : '角色';
        }
      }, {
        title: '',
        width: '15%',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          if (!('projects' in record)) {
            return _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.role.listPermissionById'] },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  icon: 'find_in_page',
                  size: 'small',
                  onClick: _this2.openSidebar.bind(_this2, record)
                })
              )
            );
          } else {
            var id = record.id,
                name = record.name;

            return _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.organization.redirect', values: { name: name } }),
                placement: 'bottomRight'
              },
              _react2['default'].createElement(
                _reactRouterDom.Link,
                { to: '/?type=organization&id=' + id + '&name=' + encodeURIComponent(name) },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  icon: 'exit_to_app',
                  size: 'small'
                })
              )
            );
          }
        }
      }];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          name = _props2.AppState.getUserInfo.realName,
          intl = _props2.intl,
          PermissionInfoStore = _props2.PermissionInfoStore,
          _props2$OrganizationI = _props2.OrganizationInfoStore,
          organizationRolesData = _props2$OrganizationI.organizationRolesData,
          sidebarVisible = _props2$OrganizationI.sidebarVisible,
          pagination = _props2$OrganizationI.pagination,
          loading = _props2$OrganizationI.loading,
          params = _props2$OrganizationI.params;

      var proId = void 0;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.user.listOrganizationAndRoleById', 'iam-service.role.listPermissionById']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
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
          null,
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            dataSource: organizationRolesData,
            pagination: pagination,
            columns: this.getTableColumns(),
            filters: params,
            childrenColumnName: 'roles',
            rowKey: function rowKey(record) {
              proId = _this3.getRowKey(record, proId);
              return proId;
            },
            onChange: this.handlePageChange,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail.header.title' }),
              visible: sidebarVisible,
              onOk: this.closeSidebar,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' }),
              okCancel: false
            },
            _react2['default'].createElement(_permissionInfo2['default'], { store: PermissionInfoStore, type: intlPrefix })
          )
        )
      );
    }
  }]);
  return ProjectInfo;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = ProjectInfo;
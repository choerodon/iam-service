'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _RoleStore = require('../../../stores/global/role/RoleStore');

var _RoleStore2 = _interopRequireDefault(_RoleStore);

require('./Role.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.role';
var Role = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Role, _Component);

  function Role() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Role);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Role.__proto__ || Object.getPrototypeOf(Role)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.goCreate = function () {
      _RoleStore2['default'].setChosenLevel('');
      _RoleStore2['default'].setLabel([]);
      _RoleStore2['default'].setSelectedRolesPermission([]);
      _this.props.history.push('role/create');
    }, _this.linkToChange = function (url) {
      _this.props.history.push('' + url);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadRole();
      });
    }, _this.handleEnable = function (record) {
      var intl = _this.props.intl;

      if (record.enabled) {
        _RoleStore2['default'].disableRole(record.id).then(function () {
          Choerodon.prompt(intl.formatMessage({ id: 'disable.success' }));
          _this.loadRole();
        });
      } else {
        _RoleStore2['default'].enableRole(record.id).then(function () {
          Choerodon.prompt(intl.formatMessage({ id: 'enable.success' }));
          _this.loadRole();
        });
      }
    }, _this.changeSelects = function (selectedRowKeys, selectedRows) {
      var selectedRoleIds = _this.state.selectedRoleIds;

      Object.keys(selectedRoleIds).forEach(function (id) {
        if (selectedRowKeys.indexOf(Number(id)) === -1) {
          delete selectedRoleIds[id];
        }
      });
      selectedRows.forEach(function (_ref2) {
        var id = _ref2.id,
            level = _ref2.level;

        selectedRoleIds[id] = level;
      });
      _this.setState({
        selectedRoleIds: selectedRoleIds
      });
    }, _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadRole(pagination, sort, filters, params);
    }, _this.createByMultiple = function () {
      var intl = _this.props.intl;

      var levels = Object.values(_this.state.selectedRoleIds);
      if (levels.some(function (level, index) {
        return levels[index + 1] && levels[index + 1] !== level;
      })) {
        Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.create.byselect.level' }));
      } else {
        _this.createBased();
      }
    }, _this.createBased = function () {
      var ids = _this.getSelectedRowKeys();
      _RoleStore2['default'].getSelectedRolePermissions(ids).then(function (datas) {
        _RoleStore2['default'].setChosenLevel(datas[0].level);
        _RoleStore2['default'].setSelectedRolesPermission(datas);
        _RoleStore2['default'].setInitSelectedPermission(datas);
        _RoleStore2['default'].loadRoleLabel(datas[0].level);
        _this.linkToChange('role/create');
      })['catch'](function (error) {
        Choerodon.prompt(error);
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Role, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadRole();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        id: '',
        selectedRoleIds: {},
        params: [],
        filters: {},
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        selectedData: ''
      };
    }
  }, {
    key: 'getSelectedRowKeys',
    value: function getSelectedRowKeys() {
      return Object.keys(this.state.selectedRoleIds).map(function (id) {
        return Number(id);
      });
    }
  }, {
    key: 'showModal',
    value: function showModal(ids) {
      this.props.history.push('role/edit/' + ids);
    }
  }, {
    key: 'loadRole',
    value: function loadRole(paginationIn, sortIn, filtersIn, paramsIn) {
      var _this2 = this;

      var _state = this.state,
          paginationState = _state.pagination,
          sortState = _state.sort,
          filtersState = _state.filters,
          paramsState = _state.params;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      this.setState({ filters: filters });
      _RoleStore2['default'].loadRole(pagination, sort, filters, params).then(function (data) {
        _RoleStore2['default'].setIsLoading(false);
        _RoleStore2['default'].setRoles(data.content);
        _this2.setState({
          sort: sort,
          filters: filters,
          params: params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          }
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'createByThis',
    value: function createByThis(record) {
      var _this3 = this;

      _RoleStore2['default'].getRoleById(record.id).then(function (data) {
        _RoleStore2['default'].setChosenLevel(data.level);
        _RoleStore2['default'].setSelectedRolesPermission(data.permissions);
        _RoleStore2['default'].loadRoleLabel(data.level);
        _this3.linkToChange('role/create');
      })['catch'](function (err) {
        Choerodon.handleResponseError(err);
      });
    }
  }, {
    key: 'renderLevel',
    value: function renderLevel(text) {
      if (text === 'organization') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'organization' });
      } else if (text === 'project') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'project' });
      } else {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var _state2 = this.state,
          _state2$sort = _state2.sort,
          columnKey = _state2$sort.columnKey,
          order = _state2$sort.order,
          pagination = _state2.pagination,
          filters = _state2.filters,
          params = _state2.params;

      var selectedRowKeys = this.getSelectedRowKeys();
      var columns = [{
        dataIndex: 'id',
        key: 'id',
        hidden: true,
        sortOrder: columnKey === 'id' && order
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        filters: [],
        sorter: true,
        sortOrder: columnKey === 'name' && order,
        filteredValue: filters.name || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'code' }),
        dataIndex: 'code',
        key: 'code',
        width: '25%',
        filters: [],
        sorter: true,
        sortOrder: columnKey === 'code' && order,
        filteredValue: filters.code || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'level' }),
        dataIndex: 'level',
        key: 'level',
        filters: [{
          text: intl.formatMessage({ id: 'global' }),
          value: 'site'
        }, {
          text: intl.formatMessage({ id: 'organization' }),
          value: 'organization'
        }, {
          text: intl.formatMessage({ id: 'project' }),
          value: 'project'
        }],
        render: function render(text) {
          return _this4.renderLevel(text);
        },
        sorter: true,
        sortOrder: columnKey === 'level' && order,
        filteredValue: filters.level || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'source' }),
        dataIndex: 'builtIn',
        key: 'builtIn',
        filters: [{
          text: intl.formatMessage({ id: intlPrefix + '.builtin.predefined' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.builtin.custom' }),
          value: 'false'
        }],
        render: function render(text, record) {
          return _react2['default'].createElement(_statusTag2['default'], {
            mode: 'icon',
            name: intl.formatMessage({ id: record.builtIn ? 'predefined' : 'custom' }),
            colorCode: record.builtIn ? 'PREDEFINE' : 'CUSTOM'
          });
        },
        sorter: true,
        sortOrder: columnKey === 'builtIn' && order,
        filteredValue: filters.builtIn || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'enabled',
        key: 'enabled',
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false'
        }],
        render: function render(enabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: enabled ? 'enable' : 'disable' }), colorCode: enabled ? 'COMPLETED' : 'DISABLE' });
        },
        sorter: true,
        sortOrder: columnKey === 'enabled' && order,
        filteredValue: filters.enabled || []
      }, {
        title: '',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          var actionDatas = [{
            service: ['iam-service.role.createBaseOnRoles'],
            type: 'site',
            icon: '',
            text: intl.formatMessage({ id: intlPrefix + '.create.byone' }),
            action: _this4.createByThis.bind(_this4, record)
          }, {
            service: ['iam-service.role.update'],
            icon: '',
            type: 'site',
            text: intl.formatMessage({ id: 'modify' }),
            action: _this4.showModal.bind(_this4, record.id)
          }];
          if (record.enabled) {
            actionDatas.push({
              service: ['iam-service.role.disableRole'],
              icon: '',
              type: 'site',
              text: intl.formatMessage({ id: 'disable' }),
              action: _this4.handleEnable.bind(_this4, record)
            });
          } else {
            actionDatas.push({
              service: ['iam-service.role.enableRole'],
              icon: '',
              type: 'site',
              text: intl.formatMessage({ id: 'enable' }),
              action: _this4.handleEnable.bind(_this4, record)
            });
          }
          return _react2['default'].createElement(_choerodonBootCombine.Action, { data: actionDatas, getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('page-content')[0];
            } });
        }
      }];
      var rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: this.changeSelects
      };
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.role.createBaseOnRoles', 'iam-service.role.update', 'iam-service.role.disableRole', 'iam-service.role.enableRole', 'iam-service.role.create', 'iam-service.role.check', 'iam-service.role.listRolesWithUserCountOnOrganizationLevel', 'iam-service.role.listRolesWithUserCountOnProjectLevel', 'iam-service.role.list', 'iam-service.role.listRolesWithUserCountOnSiteLevel', 'iam-service.role.queryWithPermissionsAndLabels', 'iam-service.role.pagingQueryUsersByRoleIdOnOrganizationLevel', 'iam-service.role.pagingQueryUsersByRoleIdOnProjectLevel', 'iam-service.role.pagingQueryUsersByRoleIdOnSiteLevel'],
          className: 'choerodon-role'
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.role.create']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'playlist_add',
                onClick: this.goCreate
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.role.createBaseOnRoles']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'content_copy',
                onClick: this.createByMultiple,
                disabled: !selectedRowKeys.length
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create.byselect' })
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
            code: intlPrefix,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(_table2['default'], {
            columns: columns,
            dataSource: _RoleStore2['default'].getRoles,
            pagination: pagination,
            rowSelection: rowSelection,
            rowKey: function rowKey(record) {
              return record.id;
            },
            filters: params,
            onChange: this.handlePageChange,
            loading: _RoleStore2['default'].getIsLoading,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return Role;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Role;
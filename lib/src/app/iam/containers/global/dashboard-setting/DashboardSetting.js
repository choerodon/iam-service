'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _iconSelect = require('choerodon-ui/lib/icon-select');

var _iconSelect2 = _interopRequireDefault(_iconSelect);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

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

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/icon-select/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/radio/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

require('./DashboardSetting.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _RoleStore = require('../../../stores/global/role/RoleStore');

var _RoleStore2 = _interopRequireDefault(_RoleStore);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RadioGroup = _radio2['default'].Group;
var Sidebar = _modal2['default'].Sidebar;
var Option = _select2['default'].Option;


var intlPrefix = 'global.dashboard-setting';
var FormItem = _form2['default'].Item;
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
var inputWidth = 512;

var DashboardSetting = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(DashboardSetting, _Component);

  function DashboardSetting(props) {
    (0, _classCallCheck3['default'])(this, DashboardSetting);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (DashboardSetting.__proto__ || Object.getPrototypeOf(DashboardSetting)).call(this, props));

    _this.handleDisable = function (record) {
      var _this$props = _this.props,
          intl = _this$props.intl,
          DashboardSettingStore = _this$props.DashboardSettingStore;

      DashboardSettingStore.dashboardDisable(record).then(function () {
        Choerodon.prompt(intl.formatMessage({ id: record.enabled ? 'disable.success' : 'enable.success' }));
      })['catch'](Choerodon.handleResponseError);
    };

    _this.handleRoleClick = function () {
      var DashboardSettingStore = _this.props.DashboardSettingStore;

      DashboardSettingStore.setNeedUpdateRoles(true);
      DashboardSettingStore.setNeedRoles(!DashboardSettingStore.needRoles);
    };

    _this.handleRefresh = function () {
      _this.props.DashboardSettingStore.refresh();
    };

    _this.handleOk = function () {
      var _this$props2 = _this.props,
          form = _this$props2.form,
          intl = _this$props2.intl,
          DashboardStore = _this$props2.DashboardStore,
          DashboardSettingStore = _this$props2.DashboardSettingStore;

      form.validateFields(function (error, values, modify) {
        Object.keys(values).forEach(function (key) {
          // 去除form提交的数据中的全部前后空格
          if (typeof values[key] === 'string') values[key] = values[key].trim();
        });
        if (!error) {
          if (modify || DashboardSettingStore.needUpdateRoles) {
            DashboardSettingStore.updateData(values).then(function (data) {
              if (DashboardStore) {
                DashboardStore.updateCachedData(data);
              }
              Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            });
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          }
        }
      });
    };

    _this.handleCancel = function () {
      _this.props.DashboardSettingStore.hideSideBar();
    };

    _this.handleTableChange = function (pagination, filters, sort, params) {
      _this.fetchData(pagination, filters, sort, params);
    };

    _this.renderRoleSelect = function () {
      var roles = _RoleStore2['default'].getRoles;
      return roles.map(function (item) {
        return _react2['default'].createElement(
          Option,
          { key: item.id, value: item.id },
          item.name
        );
      });
    };

    _this.editFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(DashboardSetting, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.fetchData();
    }
  }, {
    key: 'fetchData',
    value: function fetchData(pagination, filters, sort, params) {
      this.props.DashboardSettingStore.loadData(pagination, filters, sort, params);
    }
  }, {
    key: 'editCard',
    value: function editCard(record) {
      var _this2 = this;

      var _props = this.props,
          DashboardSettingStore = _props.DashboardSettingStore,
          form = _props.form;

      DashboardSettingStore.setNeedRoles(record.needRoles);
      _RoleStore2['default'].loadRole({ pageSize: 999 }, {}, { level: record.level }).then(function (data) {
        _RoleStore2['default'].setRoles(data.content);
      });
      DashboardSettingStore.setEditData(record);
      DashboardSettingStore.showSideBar();
      form.resetFields();
      setTimeout(function () {
        _this2.editFocusInput.input.focus();
      }, 10);
    }
  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      var _this3 = this;

      var _props2 = this.props,
          intl = _props2.intl,
          _props2$DashboardSett = _props2.DashboardSettingStore,
          _props2$DashboardSett2 = _props2$DashboardSett.sort,
          columnKey = _props2$DashboardSett2.columnKey,
          order = _props2$DashboardSett2.order,
          filters = _props2$DashboardSett.filters;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        filteredValue: filters.name || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.namespace' }),
        dataIndex: 'namespace',
        key: 'namespace',
        width: '13%',
        filters: [],
        filteredValue: filters.namespace || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '13%',
        filters: [],
        filteredValue: filters.code || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.card.title' }),
        dataIndex: 'title',
        key: 'title',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(_icon2['default'], { type: record.icon, style: { fontSize: 20, marginRight: '6px' } }),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.1, style: { display: 'inline' } },
              text
            )
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.level' }),
        dataIndex: 'level',
        key: 'level',
        filters: [{
          text: intl.formatMessage({ id: intlPrefix + '.level.site' }),
          value: 'site'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.level.organization' }),
          value: 'organization'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.level.project' }),
          value: 'project'
        }],
        filteredValue: filters.level || [],
        render: function render(text) {
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.level.' + text });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.needRoles' }),
        dataIndex: 'needRoles',
        key: 'needRoles',
        width: '9%',
        filters: [{
          text: intl.formatMessage({ id: 'global.dashboard-setting.needRoles.enable' }),
          value: true
        }, {
          text: intl.formatMessage({ id: 'global.dashboard-setting.needRoles.disable' }),
          value: false
        }],
        filteredValue: filters.needRoles || [],
        render: function render(needRoles) {
          return intl.formatMessage({ id: 'global.dashboard-setting.needRoles.' + (needRoles ? 'enable' : 'disable') });
        }
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
        filteredValue: filters.enabled || [],
        render: function render(enabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: enabled ? 'enable' : 'disable' }), colorCode: enabled ? 'COMPLETED' : 'DISABLE' });
        }
      }, {
        title: '',
        width: 100,
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.dashboard.update'] },
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'edit' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                shape: 'circle',
                icon: 'mode_edit',
                size: 'small',
                onClick: function onClick() {
                  return _this3.editCard(record);
                }
              })
            ),
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: record.enabled ? 'disable' : 'enable' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                size: 'small',
                icon: record.enabled ? 'remove_circle_outline' : 'finished',
                shape: 'circle',
                onClick: function onClick() {
                  return _this3.handleDisable(record);
                }
              })
            )
          );
        }
      }];
    }
  }, {
    key: 'renderForm',
    value: function renderForm() {
      var _this4 = this;

      var roles = _RoleStore2['default'].getRoles;
      var _props3 = this.props,
          getFieldDecorator = _props3.form.getFieldDecorator,
          intl = _props3.intl,
          _props3$DashboardSett = _props3.DashboardSettingStore,
          _props3$DashboardSett2 = _props3$DashboardSett.editData,
          code = _props3$DashboardSett2.code,
          name = _props3$DashboardSett2.name,
          level = _props3$DashboardSett2.level,
          icon = _props3$DashboardSett2.icon,
          title = _props3$DashboardSett2.title,
          namespace = _props3$DashboardSett2.namespace,
          roleIds = _props3$DashboardSett2.roleIds,
          needRoles = _props3$DashboardSett.needRoles;

      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'dashboard-setting-siderbar-content',
          code: intlPrefix + '.modify',
          values: { name: name }
        },
        _react2['default'].createElement(
          _form2['default'],
          null,
          getFieldDecorator('code', {
            rules: [{
              required: true
            }],
            initialValue: code
          })(_react2['default'].createElement('input', { type: 'hidden' })),
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, { className: 'is-required' }),
            _react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
              style: { width: inputWidth },
              value: namespace + '-' + code,
              disabled: true
            })
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.name.required' })
              }],
              initialValue: name
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this4.editFocusInput = e;
              },
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('title', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.card.title.required' })
              }],
              initialValue: title
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.card.title' }),
              style: { width: inputWidth },
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('icon', {
              initialValue: icon
            })(_react2['default'].createElement(_iconSelect2['default'], {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.icon' }),
              getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('ant-modal-body')[document.getElementsByClassName('ant-modal-body').length - 1];
              },
              style: { width: inputWidth },
              showArrow: true
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            _react2['default'].createElement(
              RadioGroup,
              { onChange: this.handleRoleClick, value: needRoles },
              _react2['default'].createElement(
                _radio2['default'],
                { value: true },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.open-role' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: false },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.close-role' })
              )
            )
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('roleIds', {
              valuePropName: 'value',
              initialValue: roleIds && roleIds.slice()
            })(_react2['default'].createElement(
              _select2['default'],
              {
                mode: 'multiple',
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.role' }),
                size: 'default',
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('ant-modal-body')[document.getElementsByClassName('ant-modal-body').length - 1];
                },
                style: {
                  width: '512px',
                  display: needRoles ? 'inline-block' : 'none'
                }
              },
              this.renderRoleSelect()
            ))
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          AppState = _props4.AppState,
          DashboardSettingStore = _props4.DashboardSettingStore,
          intl = _props4.intl;
      var pagination = DashboardSettingStore.pagination,
          params = DashboardSettingStore.params,
          loading = DashboardSettingStore.loading,
          dashboardData = DashboardSettingStore.dashboardData,
          sidebarVisible = DashboardSettingStore.sidebarVisible;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.dashboard.list', 'iam-service.dashboard.query', 'iam-service.dashboard.update']
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
          {
            code: intlPrefix,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            className: 'dashboard-table',
            columns: this.getTableColumns(),
            dataSource: dashboardData.slice(),
            pagination: pagination,
            filters: params,
            onChange: this.handleTableChange,
            rowKey: function rowKey(_ref) {
              var code = _ref.code,
                  namespace = _ref.namespace;
              return namespace + '-' + code;
            },
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sidebar.title' }),
              onOk: this.handleOk,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' }),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              onCancel: this.handleCancel,
              visible: sidebarVisible
            },
            this.renderForm()
          )
        )
      );
    }
  }]);
  return DashboardSetting;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = Choerodon.dashboard ? (0, _mobxReact.inject)('DashboardStore')(DashboardSetting) : DashboardSetting;
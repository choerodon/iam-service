'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

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

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _uniqBy2 = require('lodash/uniqBy');

var _uniqBy3 = _interopRequireDefault(_uniqBy2);

var _dec, _dec2, _class, _class2, _temp, _initialiseProps;

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/select/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _rxjs = require('rxjs');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _RoleStore = require('../../../stores/global/role/RoleStore');

var _RoleStore2 = _interopRequireDefault(_RoleStore);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _util = require('../../../common/util');

require('./Role.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Option = _select2['default'].Option;
var confirm = _modal2['default'].confirm,
    Sidebar = _modal2['default'].Sidebar;

var FormItem = _form2['default'].Item;
var intlPrefix = 'global.role';

var CreateRole = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = (_temp = _class2 = function (_Component) {
  (0, _inherits3['default'])(CreateRole, _Component);

  function CreateRole(props) {
    (0, _classCallCheck3['default'])(this, CreateRole);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (CreateRole.__proto__ || Object.getPrototypeOf(CreateRole)).call(this, props));

    _initialiseProps.call(_this);

    var level = _RoleStore2['default'].getChosenLevel !== '';
    _this.state = {
      visible: false,
      selectedLevel: 'site',
      code: '',
      description: '',
      page: 1,
      pageSize: 10,
      alreadyPage: 1,
      errorName: '',
      errorDescription: '',
      submitting: false,
      selectedRowKeys: [],
      selectedSideBar: [],
      currentPermission: [],
      firstLoad: true,
      initLevel: level,
      permissionParams: []
    };
    return _this;
  }

  (0, _createClass3['default'])(CreateRole, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setCanPermissionCanSee();
      var permissions = _RoleStore2['default'].getSelectedRolesPermission || [];
      this.setState({
        currentPermission: permissions.map(function (item) {
          return item.id;
        })
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _RoleStore2['default'].setCanChosePermission('site', []);
      _RoleStore2['default'].setCanChosePermission('organization', []);
      _RoleStore2['default'].setCanChosePermission('project', []);
      _RoleStore2['default'].setChosenLevel('');
      _RoleStore2['default'].setSelectedRolesPermission([]);
    }

    // 获取权限管理数据

  }, {
    key: 'setCanPermissionCanSee',
    value: function setCanPermissionCanSee() {
      var levels = ['organization', 'project', 'site'];

      var _loop = function _loop(c) {
        _rxjs.Observable.fromPromise(_choerodonBootCombine.axios.get('iam/v1/permissions?level=' + levels[c])).subscribe(function (data) {
          _RoleStore2['default'].handleCanChosePermission(levels[c], data);
        });
      };

      for (var c = 0; c < levels.length; c += 1) {
        _loop(c);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          currentPermission = _state.currentPermission,
          firstLoad = _state.firstLoad,
          submitting = _state.submitting,
          initLevel = _state.initLevel;
      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var getFieldDecorator = this.props.form.getFieldDecorator;

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
      var origin = _RoleStore2['default'].getCanChosePermission;
      var data = _RoleStore2['default'].getChosenLevel !== '' ? origin[_RoleStore2['default'].getChosenLevel].slice() : [];
      var pagination = _RoleStore2['default'].getPermissionPage[_RoleStore2['default'].getChosenLevel];
      var selectedPermission = _RoleStore2['default'].getSelectedRolesPermission || [];
      var changePermission = _RoleStore2['default'].getInitSelectedPermission || [];
      var level = _RoleStore2['default'].getChosenLevel;
      var codePrefix = 'role/' + (level || 'level') + '/custom/';
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        { className: 'choerodon-roleCreate' },
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' }),
          backPath: '/iam/role'
        }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix + '.create',
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _form2['default'],
              { layout: 'vertical' },
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('level', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: intlPrefix + '.level.require.msg' })
                  }],
                  initialValue: level !== '' ? level : undefined
                })(_react2['default'].createElement(
                  _select2['default'],
                  {
                    label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.level' }),
                    ref: this.saveSelectRef,
                    size: 'default',
                    style: {
                      width: '512px'
                    },
                    getPopupContainer: function getPopupContainer() {
                      return document.getElementsByClassName('page-content')[0];
                    },
                    onChange: this.handleModal,
                    disabled: initLevel
                  },
                  _react2['default'].createElement(
                    Option,
                    { value: 'site' },
                    intl.formatMessage({ id: 'global' })
                  ),
                  _react2['default'].createElement(
                    Option,
                    { value: 'organization' },
                    intl.formatMessage({ id: 'organization' })
                  ),
                  _react2['default'].createElement(
                    Option,
                    { value: 'project' },
                    intl.formatMessage({ id: 'project' })
                  )
                ))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: intlPrefix + '.code.require.msg' })
                  }, {
                    pattern: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
                    message: intl.formatMessage({ id: intlPrefix + '.code.pattern.msg' })
                  }, {
                    validator: this.checkCode
                  }],
                  validateFirst: true,
                  initialValue: this.state.roleName
                })(_react2['default'].createElement(_input2['default'], {
                  autoComplete: 'off',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
                  prefix: codePrefix,
                  size: 'default',
                  style: {
                    width: '512px'
                  },
                  disabled: level === '',
                  maxLength: 64,
                  showLengthInfo: false
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
                  }],
                  initialValue: this.state.name
                })(_react2['default'].createElement(_input2['default'], {
                  autoComplete: 'off',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
                  type: 'textarea',
                  rows: 1,
                  style: {
                    width: '512px'
                  },
                  maxLength: 64,
                  showLengthInfo: false
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('label')(_react2['default'].createElement(
                  _select2['default'],
                  {
                    mode: 'multiple',
                    label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.label' }),
                    size: 'default',
                    getPopupContainer: function getPopupContainer() {
                      return document.getElementsByClassName('page-content')[0];
                    },
                    style: {
                      width: '512px'
                    },
                    disabled: _RoleStore2['default'].getChosenLevel === ''
                  },
                  this.renderRoleLabel()
                ))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                _react2['default'].createElement(
                  _tooltip2['default'],
                  {
                    placement: 'top',
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: _RoleStore2['default'].getChosenLevel ? intlPrefix + '.add.permission' : intlPrefix + '.level.nothing.msg' })
                  },
                  _react2['default'].createElement(
                    _button2['default'],
                    {
                      funcType: 'raised',
                      onClick: this.showModal.bind(this),
                      disabled: _RoleStore2['default'].getChosenLevel === '',
                      className: 'addPermission',
                      icon: 'add'
                    },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.add.permission' })
                  )
                )
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                currentPermission.length > 0 ? _react2['default'].createElement(
                  'span',
                  { className: 'alreadyDes' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.count.msg', values: { count: currentPermission.length } })
                ) : _react2['default'].createElement(
                  'span',
                  { className: 'alreadyDes' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.nothing.msg' })
                )
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                _react2['default'].createElement(_table2['default'], {
                  className: 'c7n-role-permission-table',
                  columns: [{
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.code' }),
                    width: '50%',
                    dataIndex: 'code',
                    key: 'code',
                    render: function render(text) {
                      return _react2['default'].createElement(
                        _mouseOverWrapper2['default'],
                        { text: text, width: 0.5 },
                        text
                      );
                    }
                  }, {
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.desc' }),
                    width: '50%',
                    dataIndex: 'description',
                    key: 'description',
                    render: function render(text) {
                      return _react2['default'].createElement(
                        _mouseOverWrapper2['default'],
                        { text: text, width: 0.5 },
                        text
                      );
                    }
                  }],
                  dataSource: selectedPermission || [],
                  filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' }),
                  rowSelection: {
                    selectedRowKeys: currentPermission,
                    onChange: function onChange(selectedRowKeys, selectedRows) {
                      _this2.setState({
                        currentPermission: selectedRowKeys
                      });
                    }
                  },
                  rowKey: 'id'
                }),
                !firstLoad && !currentPermission.length ? _react2['default'].createElement(
                  'div',
                  { style: { color: '#d50000' }, className: 'ant-form-explain' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.require.msg' })
                ) : null
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                _react2['default'].createElement(
                  _row2['default'],
                  { className: 'mt-md' },
                  _react2['default'].createElement(
                    _col2['default'],
                    { className: 'choerodon-btn-create' },
                    _react2['default'].createElement(
                      _button2['default'],
                      {
                        funcType: 'raised',
                        type: 'primary',
                        onClick: this.handleCreate,
                        loading: submitting
                      },
                      _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' })
                    )
                  ),
                  _react2['default'].createElement(
                    _col2['default'],
                    { span: 5 },
                    _react2['default'].createElement(
                      _button2['default'],
                      {
                        funcType: 'raised',
                        onClick: this.handleReset,
                        disabled: submitting,
                        style: { color: '#3F51B5' }
                      },
                      _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
                    )
                  )
                )
              )
            ),
            _react2['default'].createElement(
              Sidebar,
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.add.permission' }),
                visible: this.state.visible,
                onOk: this.handleOk.bind(this),
                onCancel: this.handleCancel.bind(this),
                okText: intl.formatMessage({ id: 'ok' }),
                cancelText: intl.formatMessage({ id: 'cancel' })
              },
              _react2['default'].createElement(
                _choerodonBootCombine.Content,
                {
                  className: 'sidebar-content',
                  code: intlPrefix + '.create.addpermission'
                },
                _react2['default'].createElement(_table2['default'], {
                  className: 'c7n-role-permission-table',
                  columns: [{
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.code' }),
                    width: '50%',
                    dataIndex: 'code',
                    key: 'code',
                    render: function render(text) {
                      return _react2['default'].createElement(
                        _mouseOverWrapper2['default'],
                        { text: text, width: 0.4 },
                        text
                      );
                    }
                  }, {
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.desc' }),
                    width: '50%',
                    dataIndex: 'description',
                    key: 'description',
                    render: function render(text) {
                      return _react2['default'].createElement(
                        _mouseOverWrapper2['default'],
                        { text: text, width: 0.4 },
                        text
                      );
                    }
                  }],
                  rowKey: 'id',
                  dataSource: data,
                  pagination: pagination,
                  onChange: this.handlePageChange,
                  filters: this.state.permissionParams,
                  filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' }),
                  rowSelection: {
                    selectedRowKeys: changePermission && changePermission.map(function (item) {
                      return item.id;
                    }) || [],
                    onSelect: function onSelect(record, selected, selectedRows) {
                      _this2.handleChangePermission(selected, [record.id], selectedRows);
                    },
                    onSelectAll: function onSelectAll(selected, selectedRows, changeRows) {
                      var ids = (0, _map3['default'])(changeRows, function (item) {
                        return item.id;
                      });
                      _this2.handleChangePermission(selected, ids, selectedRows);
                    }
                  }
                })
              )
            )
          )
        )
      );
    }
  }]);
  return CreateRole;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.checkCode = function (rule, value, callback) {
    var validValue = 'role/' + _RoleStore2['default'].getChosenLevel + '/custom/' + value;
    var params = { code: validValue };
    _choerodonBootCombine.axios.post('/iam/v1/roles/check', JSON.stringify(params)).then(function (mes) {
      if (mes.failed) {
        var intl = _this3.props.intl;

        callback(intl.formatMessage({ id: intlPrefix + '.code.exist.msg' }));
      } else {
        callback();
      }
    });
  };

  this.showModal = function () {
    var currentPermission = _this3.state.currentPermission;

    _RoleStore2['default'].setPermissionPage(_RoleStore2['default'].getChosenLevel, {
      current: 1,
      pageSize: 10,
      total: ''
    });
    _this3.setState({
      permissionParams: []
    }, function () {
      _this3.setCanPermissionCanSee(_RoleStore2['default'].getChosenLevel);
      var selected = _RoleStore2['default'].getSelectedRolesPermission.filter(function (item) {
        return currentPermission.indexOf(item.id) !== -1;
      });
      _RoleStore2['default'].setInitSelectedPermission(selected);
      _this3.setState({
        visible: true
      });
    });
  };

  this.linkToChange = function (url) {
    var history = _this3.props.history;

    history.push(url);
  };

  this.handleChangePermission = function (selected, ids, permissions) {
    var initPermission = _RoleStore2['default'].getInitSelectedPermission;
    if (selected) {
      var newPermission = initPermission.concat(permissions);
      _RoleStore2['default'].setInitSelectedPermission((0, _uniqBy3['default'])(newPermission, 'code'));
    } else {
      var centerPermission = initPermission.slice();
      (0, _remove3['default'])(centerPermission, function (item) {
        return ids.indexOf(item.id) !== -1;
      });
      _RoleStore2['default'].setInitSelectedPermission(centerPermission);
    }
  };

  this.handleOk = function () {
    var selected = _RoleStore2['default'].getInitSelectedPermission;
    var selectedIds = selected.map(function (item) {
      return item.id;
    });
    _RoleStore2['default'].setSelectedRolesPermission((0, _uniqBy3['default'])(selected));
    _this3.setState({
      currentPermission: selectedIds,
      visible: false,
      alreadyPage: 1
    });
  };

  this.handleCancel = function () {
    _this3.setState({
      visible: false,
      firstLoad: false
    });
  };

  this.handleCreate = function (e) {
    e.preventDefault();
    _this3.setState({
      firstLoad: false
    });
    _this3.props.form.validateFieldsAndScroll(function (err) {
      if (!err) {
        var intl = _this3.props.intl;
        var currentPermission = _this3.state.currentPermission;

        var rolePermissionss = [];
        currentPermission.forEach(function (id) {
          return rolePermissionss.push({ id: id });
        });
        if (rolePermissionss.length > 0) {
          var labelValues = _this3.props.form.getFieldValue('label');
          var labelIds = labelValues && labelValues.map(function (labelId) {
            return { id: labelId };
          });
          var role = {
            name: _this3.props.form.getFieldValue('name').trim(),
            modified: _this3.props.form.getFieldValue('modified'),
            enabled: _this3.props.form.getFieldValue('enabled'),
            code: 'role/' + _RoleStore2['default'].getChosenLevel + '/custom/' + _this3.props.form.getFieldValue('code').trim(),
            level: _RoleStore2['default'].getChosenLevel,
            permissions: rolePermissionss,
            labels: labelIds
          };
          _this3.setState({ submitting: true });
          _RoleStore2['default'].createRole(role).then(function (data) {
            _this3.setState({ submitting: false });
            if (data && !data.failed) {
              Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
              _this3.linkToChange('/iam/role');
            } else {
              Choerodon.prompt(data.message);
            }
          })['catch'](function (errors) {
            _this3.setState({ submitting: false });
            if (errors.response.data.message === 'error.role.roleNameExist') {
              Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.name.exist.msg' }));
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'create.error' }));
            }
          });
        }
      }
    });
  };

  this.handleReset = function () {
    _this3.linkToChange('/iam/role');
  };

  this.handleModal = function (value) {
    var _props2 = _this3.props,
        form = _props2.form,
        intl = _props2.intl;

    var that = _this3;
    var getFieldValue = form.getFieldValue,
        setFieldsValue = form.setFieldsValue;
    var currentPermission = _this3.state.currentPermission;

    var level = getFieldValue('level');
    var code = getFieldValue('code');
    var label = getFieldValue('label');

    if (level && (currentPermission.length || code || label.length)) {
      confirm({
        title: intl.formatMessage({ id: intlPrefix + '.modify.level.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.modify.level.content' }),
        onOk: function onOk() {
          _RoleStore2['default'].setChosenLevel(value);
          _RoleStore2['default'].setSelectedRolesPermission([]);
          _RoleStore2['default'].loadRoleLabel(value);
          setFieldsValue({ code: '', label: [] });
          that.setState({
            currentPermission: []
          });
        },
        onCancel: function onCancel() {
          setFieldsValue({ level: level });
        }
      });
    } else {
      _RoleStore2['default'].setChosenLevel(value);
      _RoleStore2['default'].setSelectedRolesPermission([]);
      _RoleStore2['default'].loadRoleLabel(value);
      setFieldsValue({ code: '', label: [] });
      _this3.setState({
        currentPermission: []
      });
    }
  };

  this.handlePageChange = function (pagination, filters, sorter, params) {
    var level = _RoleStore2['default'].getChosenLevel;
    _this3.setState({
      permissionParams: params
    });
    // 若params或filters含特殊字符表格数据置空
    var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
    if (isIncludeSpecialCode) {
      _RoleStore2['default'].setCanChosePermission(level, []);
      _RoleStore2['default'].setPermissionPage(level, {
        current: 1,
        total: 0,
        size: 10
      });
      return;
    }

    var newFilters = {
      params: params && params.join(',') || ''
    };
    _RoleStore2['default'].getWholePermission(level, pagination, newFilters).subscribe(function (data) {
      _RoleStore2['default'].handleCanChosePermission(level, data);
    });
  };

  this.renderRoleLabel = function () {
    var labels = _RoleStore2['default'].getLabel;
    return labels.map(function (item) {
      return _react2['default'].createElement(
        Option,
        { key: item.id, value: '' + item.id },
        item.name
      );
    });
  };
}, _temp)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = CreateRole;
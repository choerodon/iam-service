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

var _dec, _dec2, _class;

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/select/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _RoleStore = require('../../../stores/global/role/RoleStore');

var _RoleStore2 = _interopRequireDefault(_RoleStore);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

require('./Role.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Option = _select2['default'].Option;
var Sidebar = _modal2['default'].Sidebar;

var FormItem = _form2['default'].Item;
var intlPrefix = 'global.role';

var EditRole = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(EditRole, _Component);

  function EditRole(props) {
    (0, _classCallCheck3['default'])(this, EditRole);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (EditRole.__proto__ || Object.getPrototypeOf(EditRole)).call(this, props));

    _this.linkToChange = function (url) {
      var history = _this.props.history;

      history.push(url);
    };

    _this.handleOk = function () {
      var selected = _RoleStore2['default'].getInitSelectedPermission;
      var selectedIds = selected.map(function (item) {
        return item.id;
      });
      _RoleStore2['default'].setSelectedRolesPermission((0, _uniqBy3['default'])(selected));
      _this.setState({
        visible: false,
        currentPermission: selectedIds
      });
    };

    _this.handleCancel = function () {
      _this.setState({
        visible: false
      });
    };

    _this.showModal = function () {
      var _this$state = _this.state,
          currentPermission = _this$state.currentPermission,
          roleData = _this$state.roleData;

      _RoleStore2['default'].setPermissionPage(_RoleStore2['default'].getChosenLevel, {
        current: 1,
        pageSize: 10,
        total: ''
      });
      _this.setState({
        permissionParams: []
      }, function () {
        _this.setCanPermissionCanSee(roleData.level);
        var selected = _RoleStore2['default'].getSelectedRolesPermission.filter(function (item) {
          return currentPermission.indexOf(item.id) !== -1;
        });
        _RoleStore2['default'].setInitSelectedPermission(selected);
        _this.setState({
          visible: true
        });
      });
    };

    _this.isModify = function () {
      var _this$state2 = _this.state,
          currentPermission = _this$state2.currentPermission,
          roleData = _this$state2.roleData;

      var permissions = roleData.permissions.map(function (item) {
        return item.id;
      });
      var currents = currentPermission.map(function (item) {
        return item.id;
      });
      if (currents.length !== permissions.length) {
        return true;
      }
      for (var i = 0; i < permissions.length; i += 1) {
        if (!currents.includes(permissions[i].id)) {
          return true;
        }
      }
      return false;
    };

    _this.handleEdit = function () {
      var intl = _this.props.intl;

      _this.props.form.validateFieldsAndScroll(function (err, values, modify) {
        if (!err) {
          if (!modify && !_this.isModify()) {
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            _this.linkToChange('/iam/role');
            return;
          }
          var currentPermission = _this.state.currentPermission;

          var rolePermissionss = [];
          currentPermission.forEach(function (id) {
            return rolePermissionss.push({ id: id });
          });
          if (rolePermissionss.length) {
            var labelValues = _this.props.form.getFieldValue('label');
            var labelIds = labelValues && labelValues.map(function (labelId) {
              return { id: labelId };
            });
            var role = {
              name: _this.props.form.getFieldValue('name').trim(),
              editable: _this.props.form.getFieldValue('isEdit'),
              enabled: _this.props.form.getFieldValue('isEnable'),
              code: _this.props.form.getFieldValue('code'),
              level: _this.state.roleData.level,
              permissions: rolePermissionss,
              labels: labelIds,
              objectVersionNumber: _this.state.roleData.objectVersionNumber
            };
            _this.setState({ submitting: true });
            _RoleStore2['default'].editRoleByid(_this.state.id, role).then(function (data) {
              _this.setState({ submitting: false });
              if (data) {
                Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                _this.linkToChange('/iam/role');
              }
            })['catch'](function (errors) {
              _this.setState({ submitting: false });
              Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
            });
          }
        }
      });
    };

    _this.handlePageChange = function (pagination, filters, sorter, params) {
      var roleData = _this.state.roleData;

      var newFilters = {
        params: params && params.join(',') || ''
      };
      _this.setState({
        permissionParams: params
      });
      _RoleStore2['default'].getWholePermission(roleData.level, pagination, newFilters).subscribe(function (data) {
        _RoleStore2['default'].handleCanChosePermission(roleData.level, data);
      });
    };

    _this.handleReset = function () {
      _this.props.history.goBack();
    };

    _this.handleChangePermission = function (selected, ids, permissions) {
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

    _this.renderRoleLabel = function () {
      var labels = _RoleStore2['default'].getLabel;
      var result = labels.map(function (item) {
        return _react2['default'].createElement(
          Option,
          { key: item.id, value: '' + item.id },
          item.name
        );
      });
      return result;
    };

    _this.state = {
      roleData: {},
      visible: false,
      selectedLevel: 'site',
      submitting: false,
      id: _this.props.match.params.id,
      currentPermission: [],
      selectPermission: [],
      permissionParams: []
    };
    return _this;
  }

  (0, _createClass3['default'])(EditRole, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      _RoleStore2['default'].getRoleById(this.state.id).then(function (data) {
        _this2.setState({
          roleData: data,
          currentPermission: data.permissions.map(function (item) {
            return item.id;
          })
        });
        _RoleStore2['default'].setSelectedRolesPermission(data.permissions);
        _this2.setCanPermissionCanSee(data.level);
        _RoleStore2['default'].setChosenLevel(data.level);
        _RoleStore2['default'].loadRoleLabel(data.level);
      })['catch'](function (error) {
        var message = _this2.props.intl.formatMessage({ id: intlPrefix + '.getinfo.error.msg' });
        Choerodon.prompt(message + ': ' + error);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _RoleStore2['default'].setCanChosePermission('site', []);
      _RoleStore2['default'].setCanChosePermission('organization', []);
      _RoleStore2['default'].setCanChosePermission('project', []);
      _RoleStore2['default'].setSelectedRolesPermission([]);
    }

    // 获取权限管理数据

  }, {
    key: 'setCanPermissionCanSee',
    value: function setCanPermissionCanSee(level) {
      _RoleStore2['default'].getWholePermission(level, _RoleStore2['default'].getPermissionPage[level]).subscribe(function (data) {
        _RoleStore2['default'].handleCanChosePermission(level, data);
      });
    }
  }, {
    key: 'getCurrentLabelValue',
    value: function getCurrentLabelValue() {
      var roleData = this.state.roleData;

      return roleData.labels.map(function (value) {
        return '' + value.id;
      });
    }
  }, {
    key: 'renderLevel',
    value: function renderLevel() {
      var intl = this.props.intl;

      if (this.state.roleData.level === 'site') {
        return intl.formatMessage({ id: 'global' });
      } else if (this.state.roleData.level === 'organization') {
        return intl.formatMessage({ id: 'organization' });
      } else {
        return intl.formatMessage({ id: 'project' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          _state$roleData = _state.roleData,
          roleData = _state$roleData === undefined ? {} : _state$roleData,
          chosenLevel = _state.chosenLevel,
          visible = _state.visible,
          currentPermission = _state.currentPermission,
          submitting = _state.submitting;
      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var level = roleData.level,
          name = roleData.name,
          code = roleData.code,
          labels = roleData.labels,
          builtIn = roleData.builtIn;

      var origin = _RoleStore2['default'].getCanChosePermission;
      var data = level ? origin[level].slice() : [];
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
      var pagination = _RoleStore2['default'].getPermissionPage[level];
      var selectedPermission = (0, _uniqBy3['default'])(_RoleStore2['default'].getSelectedRolesPermission, 'code') || [];
      var changePermission = _RoleStore2['default'].getInitSelectedPermission || [];
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _choerodonBootCombine.Page,
          null,
          _react2['default'].createElement(_choerodonBootCombine.Header, {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify' }),
            backPath: '/iam/role'
          }),
          _react2['default'].createElement(
            _choerodonBootCombine.Content,
            {
              code: intlPrefix + '.modify',
              values: { name: name }
            },
            _react2['default'].createElement(
              _form2['default'],
              { layout: 'vertical' },
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('level', {
                  initialValue: this.renderLevel()
                })(_react2['default'].createElement(_input2['default'], {
                  size: 'default',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.level' }),
                  autoComplete: 'off',
                  style: {
                    width: '512px'
                  },
                  disabled: true
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    whitespace: true
                  }],
                  initialValue: code
                })(_react2['default'].createElement(_input2['default'], {
                  size: 'default',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
                  autoComplete: 'off',
                  style: {
                    width: '512px'
                  },
                  disabled: true
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' }),
                    whitespace: true
                  }],
                  initialValue: name
                })(_react2['default'].createElement(_input2['default'], {
                  rows: 1,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
                  autoComplete: 'off',
                  style: {
                    width: '512px'
                  },
                  disabled: builtIn
                }))
              ),
              labels ? _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('label', {
                  valuePropName: 'value',
                  initialValue: this.getCurrentLabelValue()
                })(_react2['default'].createElement(
                  _select2['default'],
                  {
                    mode: 'multiple',
                    size: 'default'
                    // disabled={!RoleStore.getLabel.length}
                    , label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.label' }),
                    getPopupContainer: function getPopupContainer() {
                      return document.getElementsByClassName('page-content')[0];
                    },
                    style: {
                      width: '512px'
                    }
                  },
                  this.renderRoleLabel()
                ))
              ) : null,
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                _react2['default'].createElement(
                  _button2['default'],
                  {
                    funcType: 'raised',
                    onClick: this.showModal.bind(this),
                    disabled: chosenLevel === '' || builtIn,
                    className: 'addPermission',
                    icon: 'add'
                  },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.add.permission' })
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
                  rowKey: 'id',
                  dataSource: selectedPermission || [],
                  filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' }),
                  rowSelection: {
                    selectedRowKeys: currentPermission,
                    onChange: function onChange(selectedRowKeys, selectedRows) {
                      _this3.setState({
                        currentPermission: selectedRowKeys
                      });
                    },
                    getCheckboxProps: function getCheckboxProps() {
                      return { disabled: builtIn };
                    }
                  }
                }),
                currentPermission.length === 0 ? _react2['default'].createElement(
                  'div',
                  { style: { color: '#d50000' }, className: 'ant-form-explain' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.permission.require.msg' })
                ) : ''
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                _react2['default'].createElement(
                  _row2['default'],
                  { style: { marginTop: '2rem' } },
                  _react2['default'].createElement(
                    _col2['default'],
                    { style: { float: 'left', marginRight: '10px' } },
                    _react2['default'].createElement(
                      _button2['default'],
                      {
                        funcType: 'raised',
                        type: 'primary',
                        onClick: this.handleEdit,
                        loading: submitting
                      },
                      _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
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
            )
          )
        ),
        _react2['default'].createElement(
          Sidebar,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.add.permission' }),
            visible: visible,
            onOk: this.handleOk.bind(this),
            onCancel: this.handleCancel.bind(this),
            okText: intl.formatMessage({ id: 'ok' }),
            cancelText: intl.formatMessage({ id: 'cancel' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Content,
            {
              className: 'sidebar-content',
              code: intlPrefix + '.modify.addpermission',
              values: { name: name }
            },
            _react2['default'].createElement(_table2['default'], {
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
                  _this3.handleChangePermission(selected, [record.id], selectedRows);
                },
                onSelectAll: function onSelectAll(selected, selectedRows, changeRows) {
                  var ids = (0, _map3['default'])(changeRows, function (item) {
                    return item.id;
                  });
                  _this3.handleChangePermission(selected, ids, selectedRows);
                }
              }
            })
          )
        )
      );
    }
  }]);
  return EditRole;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = EditRole;
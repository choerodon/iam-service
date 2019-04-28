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

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

require('./ProjectType.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.project-type';

var Sidebar = _modal2['default'].Sidebar;


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

var ProjectType = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(ProjectType, _Component);

  function ProjectType() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ProjectType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ProjectType.__proto__ || Object.getPrototypeOf(ProjectType)).call.apply(_ref, [this].concat(args))), _this), _this.handleRefresh = function () {
      var ProjectTypeStore = _this.props.ProjectTypeStore;

      ProjectTypeStore.loadData();
    }, _this.handleTableChange = function (pagination, filters, sort, params) {
      _this.fetchData(pagination, filters, sort, params);
    }, _this.handleCancel = function () {
      _this.props.ProjectTypeStore.hideSideBar();
    }, _this.handleOk = function () {
      var _this$props = _this.props,
          form = _this$props.form,
          intl = _this$props.intl,
          sidebarType = _this$props.ProjectTypeStore.sidebarType,
          ProjectTypeStore = _this$props.ProjectTypeStore;

      form.validateFields(function (error, values, modify) {
        Object.keys(values).forEach(function (key) {
          // 去除form提交的数据中的全部前后空格
          if (typeof values[key] === 'string') values[key] = values[key].trim();
        });
        if (!error) {
          if (modify && sidebarType === 'edit') {
            ProjectTypeStore.updateData(values).then(function (data) {
              _this.handleRefresh();
              Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            });
          } else if (sidebarType === 'create') {
            ProjectTypeStore.createType(values).then(function (data) {
              _this.handleRefresh();
              Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
            });
          }
          ProjectTypeStore.hideSideBar();
        }
      });
    }, _this.checkCode = function (rule, value, callback) {
      var editData = _this.props.ProjectTypeStore.editData;

      var validValue = _this.props.form.getFieldValue('code');
      var params = { code: validValue };
      if (validValue === editData.code) callback();
      _choerodonBootCombine.axios.post('/iam/v1/projects/types/check', JSON.stringify(params)).then(function (mes) {
        if (mes.failed) {
          var intl = _this.props.intl;

          callback(intl.formatMessage({ id: intlPrefix + '.code.exist.msg' }));
        } else {
          callback();
        }
      });
    }, _this.handleCreateType = function () {
      var _this$props2 = _this.props,
          ProjectTypeStore = _this$props2.ProjectTypeStore,
          form = _this$props2.form;

      form.resetFields();
      ProjectTypeStore.setSidebarType('create');
      ProjectTypeStore.showSideBar();
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ProjectType, [{
    key: 'editCard',
    value: function editCard(record) {
      var _this2 = this;

      var _props = this.props,
          ProjectTypeStore = _props.ProjectTypeStore,
          form = _props.form;

      ProjectTypeStore.setEditData(record);
      ProjectTypeStore.setSidebarType('edit');
      ProjectTypeStore.showSideBar();
      form.resetFields();
      setTimeout(function () {
        _this2.editFocusInput.input.focus();
      }, 10);
    }
  }, {
    key: 'fetchData',
    value: function fetchData(pagination, filters, sort, params) {
      this.props.ProjectTypeStore.loadData(pagination, filters, sort, params);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var ProjectTypeStore = this.props.ProjectTypeStore;

      ProjectTypeStore.loadData();
    }
  }, {
    key: 'renderForm',
    value: function renderForm() {
      var _this3 = this;

      var _props2 = this.props,
          getFieldDecorator = _props2.form.getFieldDecorator,
          intl = _props2.intl,
          _props2$ProjectTypeSt = _props2.ProjectTypeStore,
          _props2$ProjectTypeSt2 = _props2$ProjectTypeSt.editData,
          code = _props2$ProjectTypeSt2.code,
          name = _props2$ProjectTypeSt2.name,
          description = _props2$ProjectTypeSt2.description,
          sidebarType = _props2$ProjectTypeSt.sidebarType;

      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'project-type-siderbar-content',
          code: intlPrefix + '.' + sidebarType,
          values: { name: name }
        },
        _react2['default'].createElement(
          _form2['default'],
          null,
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('code', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.code.required' })
              }, {
                pattern: /^[a-zA-Z]([-_/a-zA-Z0-9.])*$/,
                message: intl.formatMessage({ id: intlPrefix + '.code.pattern.msg' })
              }, {
                validator: this.checkCode
              }],
              validateTrigger: 'onBlur',
              initialValue: sidebarType === 'edit' ? code : null
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.code' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this3.editFocusInput = e;
              },
              disabled: sidebarType === 'edit',
              maxLength: 30,
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
                message: intl.formatMessage({ id: intlPrefix + '.name.required' })
              }],
              initialValue: sidebarType === 'edit' ? name : null
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.name' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this3.editFocusInput = e;
              },
              maxLength: 30,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('description', {
              initialValue: sidebarType === 'edit' ? description : null
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.description' }),
              style: { width: inputWidth },
              maxLength: 30,
              showLengthInfo: false
            }))
          )
        )
      );
    }
  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      var _this4 = this;

      var _props3 = this.props,
          intl = _props3.intl,
          filters = _props3.ProjectTypeStore.filters;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        filteredValue: filters.name || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.18 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '20%',
        filters: [],
        filteredValue: filters.code || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.18 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.description' }),
        dataIndex: 'description',
        key: 'description',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.45 },
            text
          );
        }
      }, {
        title: '',
        width: 100,
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.project-type.update'] },
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
                  return _this4.editCard(record);
                }
              })
            )
          );
        }
      }];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          AppState = _props4.AppState,
          ProjectTypeStore = _props4.ProjectTypeStore,
          intl = _props4.intl;
      var pagination = ProjectTypeStore.pagination,
          params = ProjectTypeStore.params,
          loading = ProjectTypeStore.loading,
          projectTypeData = ProjectTypeStore.projectTypeData,
          sidebarVisible = ProjectTypeStore.sidebarVisible,
          sidebarType = ProjectTypeStore.sidebarType;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.project-type.update', 'iam-service.project-type.create', 'iam-service.project-type.pagingQuery']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.project-type.create'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.handleCreateType,
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.project-type.create' })
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
            loading: loading,
            columns: this.getTableColumns(),
            dataSource: projectTypeData,
            pagination: pagination,
            filters: params,
            onChange: this.handleTableChange,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sidebar.' + sidebarType + '.title' }),
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
  return ProjectType;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = ProjectType;
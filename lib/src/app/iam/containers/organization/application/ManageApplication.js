'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _dec, _dec2, _class;

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/tabs/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/radio/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

require('./Application.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RadioGroup = _radio2['default'].Group;
var Option = _select2['default'].Option;
var TabPane = _tabs2['default'].TabPane;
var FormItem = _form2['default'].Item;
var Sidebar = _modal2['default'].Sidebar;

var intlPrefix = 'organization.application';
var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
var isNum = /^\d+$/;

var Application = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Application, _Component);

  function Application() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Application);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Application.__proto__ || Object.getPrototypeOf(Application)).call.apply(_ref, [this].concat(args))), _this), _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props = _this.props,
          _this$props$Applicati = _this$props.ApplicationStore,
          operation = _this$props$Applicati.operation,
          editData = _this$props$Applicati.editData,
          ApplicationStore = _this$props.ApplicationStore;
      var AppState = _this.props.AppState;

      var menuType = AppState.currentMenuType;
      var orgId = menuType.id;
      var orgName = menuType.name;
      var data = void 0;
      if (operation === 'create') {
        var validateFields = _this.props.form.validateFields;

        validateFields(function (err, _ref2) {
          var applicationCategory = _ref2.applicationCategory,
              applicationType = _ref2.applicationType,
              code = _ref2.code,
              name = _ref2.name,
              projectId = _ref2.projectId;

          if (!err) {
            data = {
              applicationCategory: applicationCategory,
              applicationType: applicationType,
              code: code,
              name: name.trim(),
              projectId: projectId
              // enabled: true,
            };
            ApplicationStore.setSubmitting(true);
            ApplicationStore.createApplication(data).then(function (value) {
              ApplicationStore.setSubmitting(false);
              if (!value.failed) {
                _this.props.history.push('/iam/application?type=organization&id=' + orgId + '&name=' + encodeURIComponent(orgName));
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'create.success' }));
                ApplicationStore.loadData();
              } else {
                Choerodon.prompt(value.message);
              }
            })['catch'](function (error) {
              ApplicationStore.setSubmitting(false);
              Choerodon.handleResponseError(error);
            });
          }
        });
      } else if (operation === 'edit') {
        var _validateFields = _this.props.form.validateFields;

        _validateFields(function (err, validated) {
          if (!err) {
            if (_this.shouldShowProjectsSelect()) {
              data = (0, _extends3['default'])({}, editData, {
                name: validated.name.trim(),
                projectId: validated.projectId || null
              });
            } else {
              data = (0, _extends3['default'])({}, editData, {
                name: validated.name.trim()
              });
            }
            ApplicationStore.updateApplication(data, editData.id).then(function (value) {
              ApplicationStore.setSubmitting(false);
              if (!value.failed) {
                _this.props.history.push('/iam/application?type=organization&id=' + orgId + '&name=' + encodeURIComponent(orgName));
                Choerodon.prompt(_this.props.intl.formatMessage({ id: 'save.success' }));
                _this.handleTabClose();
                ApplicationStore.loadData();
              } else {
                Choerodon.prompt(value.message);
              }
            })['catch'](function (error) {
              _this.handleTabClose();
              Choerodon.handleResponseError(error);
            });
          }
        });
      }
    }, _this.handleAddApplication = function () {
      var ApplicationStore = _this.props.ApplicationStore;
      var editData = ApplicationStore.editData;

      ApplicationStore.showSidebar();
      ApplicationStore.loadAddListData(editData.id);
    }, _this.refresh = function () {
      var _this$props2 = _this.props,
          operation = _this$props2.ApplicationStore.operation,
          ApplicationStore = _this$props2.ApplicationStore,
          history = _this$props2.history;

      var editId = history.location.pathname.split('/').pop();
      if (editId === '0') {
        ApplicationStore.setOperation('create');
      } else {
        ApplicationStore.getDetailById(history.location.pathname.split('/').pop()).then(function (data) {
          if (!data.failed) {
            ApplicationStore.setEditData(data);
            ApplicationStore.setOperation('edit');
            ApplicationStore.loadTreeData(editId);
            ApplicationStore.loadListData(editId);
          } else {
            Choerodon.prompt(data.message);
          }
        });
      }
    }, _this.checkCode = function (rule, value, callback) {
      var _this$props3 = _this.props,
          ApplicationStore = _this$props3.ApplicationStore,
          intl = _this$props3.intl,
          editData = _this$props3.ApplicationStore.editData;

      var params = { code: value };
      if (editData && editData.code === value) callback();
      if (ApplicationStore.operation === 'edit') callback();
      ApplicationStore.checkApplicationCode(params).then(function (mes) {
        if (mes.failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.code.exist.msg' }));
        } else {
          callback();
        }
      })['catch'](function (err) {
        callback('校验超时');
        Choerodon.handleResponseError(err);
      });
    }, _this.checkName = function (rule, value, callback) {
      var _this$props4 = _this.props,
          ApplicationStore = _this$props4.ApplicationStore,
          intl = _this$props4.intl,
          editData = _this$props4.ApplicationStore.editData;

      var params = { name: value };
      if (editData && editData.name === value) callback();
      ApplicationStore.checkApplicationCode(params).then(function (mes) {
        if (mes.failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.name.exist.msg' }));
        } else {
          callback();
        }
      })['catch'](function (err) {
        callback('校验超时');
        Choerodon.handleResponseError(err);
      });
    }, _this.getTreeTableColumns = function () {
      var intl = _this.props.intl;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'applicationName',
        width: '30%',
        render: function render(text, record) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: text, iconType: record.applicationCategory === 'application' ? 'application_-general' : 'grain' });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'applicationCode',
        key: 'applicationCode',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.application-type' }),
        dataIndex: 'applicationType',
        // filters: [],
        // filteredValue: filters.name || [],
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            intl.formatMessage({ id: intlPrefix + '.type.' + text })
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.project-name' }),
        dataIndex: 'projectName',
        // width: '15%',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            text && _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-application-name-avatar' },
              record.projectImageUrl ? _react2['default'].createElement('img', { src: record.projectImageUrl, alt: 'avatar', style: { width: '100%' } }) : _react2['default'].createElement(
                _react2['default'].Fragment,
                null,
                text.split('')[0]
              )
            ),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.2 },
              text
            )
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'applicationEnabled',
        width: '15%',
        key: 'applicationEnabled',
        render: function render(applicationEnabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: applicationEnabled ? 'enable' : 'disable' }), colorCode: applicationEnabled ? 'COMPLETED' : 'DISABLE' });
        }
      }];
    }, _this.getListTableColumns = function () {
      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'code',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.count' }),
        dataIndex: 'appCount',
        width: '15%'
      }];
    }, _this.getAddTableColumns = function () {
      var intl = _this.props.intl;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.15 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'code',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.application-type' }),
        dataIndex: 'applicationType',
        // filters: [],
        // filteredValue: filters.name || [],
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            intl.formatMessage({ id: intlPrefix + '.type.' + text })
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.project-name' }),
        dataIndex: 'projectName',
        // width: '15%',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            text && _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-application-name-avatar' },
              record.imageUrl ? _react2['default'].createElement('img', { src: record.imageUrl, alt: 'avatar', style: { width: '100%' } }) : _react2['default'].createElement(
                _react2['default'].Fragment,
                null,
                text.split('')[0]
              )
            ),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.2 },
              text
            )
          );
        }
      }];
    }, _this.handleListPageChange = function (pagination, filters, sorter, params) {
      _this.props.ApplicationStore.loadListData(pagination, filters, sorter, params);
    }, _this.renderApplicationTreeTable = function () {
      var columns = _this.getTreeTableColumns();
      var _this$props5 = _this.props,
          ApplicationStore = _this$props5.ApplicationStore,
          intl = _this$props5.intl;
      var listParams = ApplicationStore.listParams,
          listLoading = ApplicationStore.listLoading,
          applicationTreeData = ApplicationStore.applicationTreeData;

      return _react2['default'].createElement(_table2['default'], {
        pagination: false,
        columns: columns,
        dataSource: applicationTreeData,
        rowKey: 'path',
        className: 'c7n-iam-application-tree-table',
        filters: false,
        filterBar: false,
        loading: listLoading,
        filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
      });
    }, _this.renderApplicationListTable = function () {
      var columns = _this.getListTableColumns();
      var _this$props6 = _this.props,
          ApplicationStore = _this$props6.ApplicationStore,
          intl = _this$props6.intl;
      var listPagination = ApplicationStore.listPagination,
          listParams = ApplicationStore.listParams,
          listLoading = ApplicationStore.listLoading,
          applicationListData = ApplicationStore.applicationListData;

      return _react2['default'].createElement(_table2['default'], {
        pagination: listPagination,
        columns: columns,
        dataSource: applicationListData,
        rowKey: 'id',
        filters: listParams,
        onChange: _this.handleListPageChange,
        loading: listLoading,
        filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
      });
    }, _this.renderTableTab = function () {
      var _this$props$Applicati2 = _this.props.ApplicationStore,
          operation = _this$props$Applicati2.operation,
          editData = _this$props$Applicati2.editData;

      if (operation === 'edit' && editData.applicationCategory === 'combination-application') {
        return _react2['default'].createElement(
          _tabs2['default'],
          { defaultActiveKey: '1', animated: false, style: { marginBottom: 24 } },
          _react2['default'].createElement(
            TabPane,
            { tab: '\u5E94\u7528\u6811', key: '1' },
            _this.renderApplicationTreeTable()
          ),
          _react2['default'].createElement(
            TabPane,
            { tab: '\u5E94\u7528\u6E05\u5355', key: '2' },
            _this.renderApplicationListTable()
          )
        );
      }
      return null;
    }, _this.handleSidebarClose = function () {
      var ApplicationStore = _this.props.ApplicationStore;

      ApplicationStore.closeSidebar();
    }, _this.handleAddSubmit = function () {
      var _this$props7 = _this.props,
          _this$props7$Applicat = _this$props7.ApplicationStore,
          selectedRowKeys = _this$props7$Applicat.selectedRowKeys,
          editData = _this$props7$Applicat.editData,
          ApplicationStore = _this$props7.ApplicationStore;

      ApplicationStore.setSubmitting(true);
      ApplicationStore.addToCombination(editData.id, selectedRowKeys).then(function (data) {
        ApplicationStore.setSubmitting(false);
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.refresh();
          ApplicationStore.closeSidebar();
          Choerodon.prompt('添加成功');
        }
      })['catch'](function (err) {
        ApplicationStore.setSubmitting(false);
        Choerodon.handleResponseError(err);
      });
    }, _this.renderSidebar = function () {
      var ApplicationStore = _this.props.ApplicationStore;
      var sidebarVisible = ApplicationStore.sidebarVisible,
          submitting = ApplicationStore.submitting;

      return _react2['default'].createElement(
        Sidebar,
        {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sidebar.title' }),
          visible: sidebarVisible,
          onCancel: _this.handleSidebarClose,
          onOk: _this.handleAddSubmit,
          okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' }),
          className: 'c7n-iam-project-sidebar',
          confirmLoading: submitting
        },
        _this.renderSidebarContent()
      );
    }, _this.changeSelects = function (selectedRowKeys) {
      var ApplicationStore = _this.props.ApplicationStore;

      ApplicationStore.setSelectedRowKeys(selectedRowKeys);
    }, _this.handleAddListPageChange = function (id, pagination) {
      _this.props.ApplicationStore.loadAddListData(id, pagination);
    }, _this.renderSidebarContent = function () {
      var _this$props8 = _this.props,
          _this$props8$Applicat = _this$props8.ApplicationStore,
          selectedRowKeys = _this$props8$Applicat.selectedRowKeys,
          editData = _this$props8$Applicat.editData,
          addListLoading = _this$props8$Applicat.addListLoading,
          addListPagination = _this$props8$Applicat.addListPagination,
          getAddListDataSource = _this$props8$Applicat.getAddListDataSource,
          intl = _this$props8.intl;

      var columns = _this.getAddTableColumns();
      var rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: _this.changeSelects
      };
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          code: intlPrefix + '.add',
          className: 'sidebar-content',
          values: {
            name: editData && editData.name
          }
        },
        _react2['default'].createElement(_table2['default'], {
          pagination: false,
          columns: columns,
          dataSource: getAddListDataSource,
          rowKey: function rowKey(record) {
            return record.id;
          }
          // filters={listParams}
          , rowSelection: rowSelection
          // onChange={this.handleAddListPageChange}
          , loading: addListLoading,
          filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
        })
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Application, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refresh();
    }
  }, {
    key: 'renderSideTitle',
    value: function renderSideTitle() {
      switch (this.props.ApplicationStore.operation) {
        case 'create':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' });
        case 'edit':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify' });
        default:
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' });
      }
    }

    /**
     * 校验应用编码唯一性
     * @param value 应用编码
     * @param callback 回调函数
     */


    /**
     * 校验应用名称唯一性
     * @param value 应用编码
     * @param callback 回调函数
     */

  }, {
    key: 'getSidebarContentInfo',
    value: function getSidebarContentInfo(operation) {
      var _props = this.props,
          AppState = _props.AppState,
          ApplicationStore = _props.ApplicationStore,
          intl = _props.intl;
      var editData = ApplicationStore.editData;

      var menuType = AppState.currentMenuType;
      var orgname = menuType.name;
      switch (operation) {
        case 'create':
          return {
            code: intlPrefix + '.create',
            values: {
              name: orgname
            }
          };
        case 'edit':
          return {
            code: intlPrefix + '.edit',
            values: {
              name: ApplicationStore.editData && ApplicationStore.editData.name,
              app: intl.formatMessage({ id: intlPrefix + '.category.' + editData.applicationCategory.toLowerCase() })
            }
          };
        default:
          return {
            code: intlPrefix + '.create'
          };
      }
    }

    /**
     * 返回是否显示选择分配项目的选择框
     * @returns {boolean}
     */

  }, {
    key: 'shouldShowProjectsSelect',
    value: function shouldShowProjectsSelect() {
      // 历史遗留问题，从前这里是有处理逻辑的，现在无论何时都显示
      return true;
    }
  }, {
    key: 'renderContent',
    value: function renderContent() {
      var _this2 = this;

      var _props2 = this.props,
          intl = _props2.intl,
          ApplicationStore = _props2.ApplicationStore,
          form = _props2.form;
      var getFieldDecorator = form.getFieldDecorator;
      var operation = ApplicationStore.operation,
          projectData = ApplicationStore.projectData,
          editData = ApplicationStore.editData,
          submitting = ApplicationStore.submitting;

      var inputWidth = 512;
      return _react2['default'].createElement(
        _react2['default'].Fragment,
        null,
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical', className: 'rightForm', style: { width: 512 } },
          operation === 'create' && !editData && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('applicationCategory', {
              initialValue: 'application'
            })(_react2['default'].createElement(
              RadioGroup,
              { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.category' }), className: 'c7n-iam-application-radiogroup' },
              ['application', 'combination-application'].map(function (value) {
                return _react2['default'].createElement(
                  _radio2['default'],
                  { value: value, key: value },
                  intl.formatMessage({ id: intlPrefix + '.category.' + value.toLowerCase() })
                );
              })
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('applicationType', {
              initialValue: editData ? editData.applicationType : 'normal'
            })(_react2['default'].createElement(
              _select2['default'],
              { disabled: operation === 'edit', getPopupContainer: function getPopupContainer(that) {
                  return that;
                }, label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type' }), className: 'c7n-iam-application-radiogroup' },
              ['normal', 'test'].map(function (value) {
                return _react2['default'].createElement(
                  Option,
                  { value: value, key: value },
                  intl.formatMessage({ id: intlPrefix + '.type.' + value.toLowerCase() })
                );
              })
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('code', {
              initialValue: editData ? editData.code : null,
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.code.require.msg' })
              }, {
                pattern: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
                message: intl.formatMessage({ id: intlPrefix + '.code.format.msg' })
              }, {
                validator: this.checkCode
              }],
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              disabled: operation === 'edit',
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this2.createFocusInput = e;
              },
              maxLength: 14,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              initialValue: editData ? editData.name : null,
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
              }, {
                pattern: /^[^\s]*$/,
                message: intl.formatMessage({ id: intlPrefix + '.whitespace.msg' })
              }, {
                validator: this.checkName
              }],
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
              style: { width: inputWidth },
              ref: function ref(e) {
                _this2.editFocusInput = e;
              },
              maxLength: 14,
              showLengthInfo: false
            }))
          ),
          this.shouldShowProjectsSelect() && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('projectId', {
              initialValue: editData && editData.projectId !== 0 && editData.projectId
            })(_react2['default'].createElement(
              _select2['default'],
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.assignment' }),
                className: 'c7n-iam-application-radiogroup',
                getPopupContainer: function getPopupContainer(that) {
                  return that;
                },
                filterOption: function filterOption(input, option) {
                  var childNode = option.props.children;
                  if (childNode && _react2['default'].isValidElement(childNode)) {
                    return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }
                  return false;
                },
                disabled: editData && !!editData.projectId,
                allowClear: true,
                filter: true
              },
              projectData.map(function (_ref3) {
                var id = _ref3.id,
                    name = _ref3.name,
                    code = _ref3.code;
                return _react2['default'].createElement(
                  Option,
                  { value: id, key: id, title: name },
                  _react2['default'].createElement(
                    _tooltip2['default'],
                    { title: code, placement: 'right', align: { offset: [20, 0] } },
                    _react2['default'].createElement(
                      'span',
                      { style: { display: 'inline-block', width: '100%' } },
                      name
                    )
                  )
                );
              })
            ))
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          AppState = _props3.AppState,
          _props3$ApplicationSt = _props3.ApplicationStore,
          operation = _props3$ApplicationSt.operation,
          submitting = _props3$ApplicationSt.submitting,
          editData = _props3$ApplicationSt.editData;

      var menuType = AppState.currentMenuType;
      var orgId = menuType.id;
      var contentInfo = this.getSidebarContentInfo(operation);
      var type = menuType.type;
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.application.pagingQuery', 'iam-service.application.create', 'iam-service.application.types', 'iam-service.application.update', 'iam-service.application.disable', 'iam-service.application.enabled']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: operation === 'create' ? '创建应用' : '修改应用',
            backPath: '/iam/application?type=organization&id=' + orgId + '&name=' + encodeURIComponent(menuType.name) + '&organizationId=' + orgId
          },
          editData && editData.applicationCategory === 'combination-application' && _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.application.update'],
              type: type,
              organizationId: orgId
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.handleAddApplication,
                icon: 'playlist_add'
              },
              '\u6DFB\u52A0\u5E94\u7528'
            )
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          (0, _extends3['default'])({}, contentInfo, {
            className: 'c7n-iam-application'
          }),
          this.renderContent(),
          this.renderTableTab(),
          _react2['default'].createElement(
            _button2['default'],
            { style: { marginRight: 10 }, loading: submitting, onClick: this.handleSubmit, type: 'primary', funcType: 'raised' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: operation === 'create' ? 'create' : 'save' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            { onClick: function onClick() {
                return _this3.props.history.push('/iam/application?type=organization&id=' + orgId + '&name=' + encodeURIComponent(menuType.name) + '&organizationId=' + orgId);
              }, funcType: 'raised' },
            '\u53D6\u6D88'
          ),
          this.renderSidebar()
        )
      );
    }
  }]);
  return Application;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Application;
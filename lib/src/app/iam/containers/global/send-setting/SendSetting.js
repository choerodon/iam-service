'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _inputNumber = require('choerodon-ui/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class; /**
                          * Created by hulingfangzi on 2018/8/20.
                          */

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input-number/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _sendSetting = require('../../../stores/global/send-setting');

var _sendSetting2 = _interopRequireDefault(_sendSetting);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

require('./SendSetting.scss');

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sidebar = _modal2['default'].Sidebar;
var Option = _select2['default'].Option;

var FormItem = _form2['default'].Item;
var RadioGroup = _radio2['default'].Group;
var intlPrefix = 'global.sendsetting';

// 公用方法类

var SendSettingType = function SendSettingType(context) {
  (0, _classCallCheck3['default'])(this, SendSettingType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = type === 'organization' ? 'organization' : 'global';
  this.code = codePrefix + '.sendsetting';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.type = type;
  this.orgId = id;
};

var SendSetting = (_dec = _form2['default'].create(), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(SendSetting, _Component);

  function SendSetting() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, SendSetting);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = SendSetting.__proto__ || Object.getPrototypeOf(SendSetting)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadSettingList(pagination, sorter, filters, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadSettingList();
      });
    }, _this.handleModify = function (record) {
      var _this$setting = _this.setting,
          type = _this$setting.type,
          orgId = _this$setting.orgId;

      _this.props.form.resetFields();
      _sendSetting2['default'].loadTemplate(type, orgId, record.code);
      _sendSetting2['default'].loadPmTemplate(type, orgId, record.code);
      _sendSetting2['default'].loadCurrentRecord(record.id, type, orgId).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _sendSetting2['default'].setCurrentRecord(data);
          _this.setState({
            visible: true
          });
        }
      });
    }, _this.handleDelete = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.delete.content' + (!record.pmTemplateCode && !record.emailTemplateCode && !record.smsTemplateCode ? '' : '.has-template') }, { name: record.name }),
        onOk: function onOk() {
          return _sendSetting2['default'].deleteSettingById(record.id).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.handleRefresh();
            }
          });
        }
      });
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      var intl = _this.props.intl;
      var _this$setting2 = _this.setting,
          type = _this$setting2.type,
          orgId = _this$setting2.orgId;

      _this.props.form.validateFieldsAndScroll(function (err, values, modify) {
        if (!err) {
          if (!modify) {
            _this.setState({
              visible: false
            });
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            return;
          }

          _this.setState({
            submitting: true
          });
          var body = {
            objectVersionNumber: _sendSetting2['default'].getCurrentRecord.objectVersionNumber,
            id: _sendSetting2['default'].getCurrentRecord.id,
            emailTemplateId: values.emailTemplateId === 'empty' ? null : values.emailTemplateId,
            retryCount: Number(values.retryCount),
            isSendInstantly: values.sendnow === 'instant',
            isManualRetry: values.manual === 'allow',
            pmTemplateId: values.pmTemplateId === 'empty' ? null : values.pmTemplateId,
            pmType: values.pmType,
            allowConfig: values.allowConfig === 'allow'
          };
          _sendSetting2['default'].modifySetting(_sendSetting2['default'].getCurrentRecord.id, body, type, orgId).then(function (data) {
            if (data.failed) {
              Choerodon.prompt(data.message);
              _this.setState({
                submitting: false
              });
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
              _this.setState({
                submitting: false,
                visible: false
              });
              _this.loadSettingList();
            }
          })['catch'](function (error) {
            Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
            _this.setState({
              submitting: false
            });
          });
        }
      });
    }, _this.handleCancelFun = function () {
      _this.setState({
        visible: false
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(SendSetting, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initSendSetting();
      this.loadSettingList();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _sendSetting2['default'].setTemplate([]);
      _sendSetting2['default'].setPmTemplate([]);
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        loading: true,
        visible: false, // 侧边栏是否可见
        submitting: false, // 侧边栏提交按钮状态
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        filters: {},
        params: []
      };
    }
  }, {
    key: 'initSendSetting',
    value: function initSendSetting() {
      this.setting = new SendSettingType(this);
    }
  }, {
    key: 'loadSettingList',
    value: function loadSettingList(paginationIn, sortIn, filtersIn, paramsIn) {
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
      // 防止标签闪烁
      this.setState({ filters: filters, loading: true });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _sendSetting2['default'].setData([]);
        this.setState({
          pagination: {
            total: 0
          },
          loading: false,
          sort: sort,
          params: params
        });
        return;
      }

      _sendSetting2['default'].loadData(pagination, filters, sort, params, this.setting.type, this.setting.orgId).then(function (data) {
        _sendSetting2['default'].setData(data.content);
        _this2.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          loading: false,
          sort: sort,
          params: params
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this2.setState({
          loading: false
        });
      });
    }

    // 刷新


    // 打开侧边栏


    // 关闭侧边栏

  }, {
    key: 'getHeader',


    // 侧边栏
    value: function getHeader() {
      var code = this.setting.code;

      var selectCode = code + '.modify';
      var modifyValues = {
        name: _sendSetting2['default'].getCurrentRecord.name
      };
      return {
        code: selectCode,
        values: modifyValues
      };
    }
  }, {
    key: 'getPermission',
    value: function getPermission() {
      var AppState = this.props.AppState;
      var type = AppState.currentMenuType.type;

      var modifyService = ['notify-service.send-setting-site.update'];
      var deleteService = ['notify-service.send-setting-site.delSendSetting'];
      if (type === 'organization') {
        modifyService = ['notify-service.send-setting-org.update'];
      }
      return { modifyService: modifyService, deleteService: deleteService };
    }
  }, {
    key: 'renderSidebarContent',
    value: function renderSidebarContent() {
      var intl = this.props.intl;
      var getFieldDecorator = this.props.form.getFieldDecorator;

      var header = this.getHeader();
      var getCurrentRecord = _sendSetting2['default'].getCurrentRecord;

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
      var inputWidth = 512;
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        (0, _extends3['default'])({
          className: 'sidebar-content'
        }, header),
        _react2['default'].createElement(
          _form2['default'],
          { className: 'c7n-sendsetting-form' },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('emailTemplateId', {
              rules: [],
              initialValue: !getCurrentRecord.emailTemplateId ? 'empty' : getCurrentRecord.emailTemplateId
            })(_react2['default'].createElement(
              _select2['default'],
              {
                className: 'c7n-email-template-select',
                style: { width: inputWidth },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.template' }),
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                }
              },
              _sendSetting2['default'].getTemplate.length > 0 ? [_react2['default'].createElement(
                Option,
                { key: 'empty', value: 'empty' },
                '\u65E0'
              )].concat(_sendSetting2['default'].getTemplate.map(function (_ref3) {
                var name = _ref3.name,
                    id = _ref3.id,
                    code = _ref3.code;
                return _react2['default'].createElement(
                  Option,
                  { key: id, value: id, title: name },
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
              })) : _react2['default'].createElement(
                Option,
                { key: 'empty', value: 'empty' },
                '\u65E0'
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('retryCount', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: 'sendsetting.retrycount.required' })
              }, {
                pattern: /^\d$|^10$/,
                message: intl.formatMessage({ id: 'sendsetting.retrycount.pattern' })
              }],
              initialValue: String(getCurrentRecord.retryCount)
            })(_react2['default'].createElement(_inputNumber2['default'], {
              autoComplete: 'off',
              min: 0,
              max: 10,
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.retrycount' }),
              style: { width: inputWidth }
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('sendnow', {
              rules: [],
              initialValue: getCurrentRecord.isSendInstantly ? 'instant' : 'notinstant'
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.sendinstantly' }),
                className: 'radioGroup'
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'instant' },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'notinstant' },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('manual', {
              rules: [],
              initialValue: getCurrentRecord.isManualRetry ? 'allow' : 'notallow'
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.alllow.manual' }),
                className: 'radioGroup'
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'allow' },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'notallow' },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('pmTemplateId', {
              rules: [],
              initialValue: !getCurrentRecord.pmTemplateId ? 'empty' : getCurrentRecord.pmTemplateId
            })(_react2['default'].createElement(
              _select2['default'],
              {
                className: 'c7n-email-template-select',
                style: { width: inputWidth },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.pmtemplate' }),
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                }
              },
              _sendSetting2['default'].getPmTemplate.length > 0 ? [_react2['default'].createElement(
                Option,
                { key: 'empty', value: 'empty' },
                '\u65E0'
              )].concat(_sendSetting2['default'].getPmTemplate.map(function (_ref4) {
                var name = _ref4.name,
                    id = _ref4.id,
                    code = _ref4.code;
                return _react2['default'].createElement(
                  Option,
                  { key: id, value: id, title: name },
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
              })) : _react2['default'].createElement(
                Option,
                { key: 'empty', value: 'empty' },
                '\u65E0'
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('pmType', {
              rules: [],
              initialValue: getCurrentRecord.pmType
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.pmtemplate.type' }),
                className: 'radioGroup'
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'msg' },
                intl.formatMessage({ id: 'sendsetting.pmtemplate.msg' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'notice' },
                intl.formatMessage({ id: 'sendsetting.pmtemplate.notice' })
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('allowConfig', {
              rules: [],
              initialValue: getCurrentRecord.allowConfig ? 'allow' : 'notallow'
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.pmtemplate.receive' }),
                className: 'radioGroup'
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'allow' },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'notallow' },
                intl.formatMessage({ id: 'no' })
              )
            ))
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;

      var _getPermission = this.getPermission(),
          modifyService = _getPermission.modifyService,
          deleteService = _getPermission.deleteService;

      var _state2 = this.state,
          _state2$sort = _state2.sort,
          columnKey = _state2$sort.columnKey,
          order = _state2$sort.order,
          filters = _state2.filters,
          params = _state2.params,
          pagination = _state2.pagination,
          loading = _state2.loading,
          visible = _state2.visible,
          submitting = _state2.submitting;

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.trigger.type' }),
        dataIndex: 'name',
        key: 'name',
        width: '15%',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '15%',
        filters: [],
        filteredValue: filters.code || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.description' }),
        dataIndex: 'description',
        key: 'description',
        width: '25%',
        filters: [],
        filteredValue: filters.description || [],
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
        width: '5%',
        filters: [{
          text: intl.formatMessage({ id: 'site' }),
          value: 'site'
        }, {
          text: intl.formatMessage({ id: 'organization' }),
          value: 'organization'
        }, {
          text: intl.formatMessage({ id: 'project' }),
          value: 'project'
        }],
        filteredValue: filters.level || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.05 },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: text })
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.template' }),
        dataIndex: 'emailTemplateCode',
        key: 'emailTemplateCode',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.pmtemplate' }),
        dataIndex: 'pmTemplateCode',
        key: 'pmTemplateCode',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: '',
        width: 150,
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _react2['default'].Fragment,
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: modifyService },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  icon: 'mode_edit',
                  shape: 'circle',
                  onClick: _this3.handleModify.bind(_this3, record)
                })
              )
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: deleteService },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  icon: 'delete_forever',
                  shape: 'circle',
                  onClick: function onClick() {
                    return _this3.handleDelete(record);
                  }
                })
              )
            )
          );
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['notify-service.send-setting-site.pageSite', 'notify-service.send-setting-org.pageOrganization', 'notify-service.send-setting-site.query', 'notify-service.send-setting-org.query', 'notify-service.send-setting-site.update', 'notify-service.send-setting-org.update', 'notify-service.email-template-site.listNames', 'notify-service.email-template-org.listNames', 'notify-service.send-setting-site.delSendSetting']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.header.title' }) },
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
            code: this.setting.code,
            values: { name: '' + (this.setting.values.name || 'Choerodon') }
          },
          _react2['default'].createElement(_table2['default'], {
            columns: columns,
            dataSource: _sendSetting2['default'].getData,
            pagination: pagination,
            onChange: this.handlePageChange,
            filters: params,
            loading: loading,
            rowKey: 'id',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'sendsetting.modify' }),
              visible: visible,
              onOk: this.handleSubmit,
              onCancel: this.handleCancelFun,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' }),
              confirmLoading: submitting
            },
            this.renderSidebarContent()
          )
        )
      );
    }
  }]);
  return SendSetting;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = SendSetting;
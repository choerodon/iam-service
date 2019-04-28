'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class; /**
                   * Created by chenbinjie on 2018/8/6.
                   */

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _util = require('../../../common/util');

var _inmailTemplate = require('../../../stores/global/inmail-template');

var _inmailTemplate2 = _interopRequireDefault(_inmailTemplate);

require('./InMailTemplate.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

require('../../../common/ConfirmModal.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 公用方法类
var MailTemplateType = function MailTemplateType(context) {
  (0, _classCallCheck3['default'])(this, MailTemplateType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = type === 'organization' ? 'organization' : 'global';
  this.code = codePrefix + '.inmailtemplate';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.type = type;
  this.orgId = id;
  this.orgName = name;
};

var InMailTemplate = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(InMailTemplate, _Component);

  function InMailTemplate() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, InMailTemplate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = InMailTemplate.__proto__ || Object.getPrototypeOf(InMailTemplate)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.loadTemplateType = function (type, orgId) {
      _inmailTemplate2['default'].loadTemplateType(type, orgId).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _inmailTemplate2['default'].setTemplateType(data);
        }
      });
    }, _this.handleRefresh = function () {
      _this.loadTemplate();
    }, _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadTemplate(pagination, filters, sort, params);
    }, _this.reload = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadTemplate();
      });
    }, _this.handleOpen = function (selectType) {
      var record = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _inmailTemplate2['default'].setSelectType(selectType);
      if (selectType !== 'create') {
        _inmailTemplate2['default'].getTemplateDetail(record.id, _this.mail.type, _this.mail.orgId).then(function (data) {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else {
            _inmailTemplate2['default'].setCurrentDetail(data);
            _inmailTemplate2['default'].setSelectType(selectType);
            if (selectType === 'baseon') {
              _this.createMailTemplate();
            } else {
              _this.modifyMailTemplate(record.id);
            }
          }
        });
      }
    }, _this.renderBuiltIn = function (isPredefined) {
      if (isPredefined) {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(_icon2['default'], { type: 'settings', style: { verticalAlign: 'text-bottom' } }),
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.predefined' })
        );
      } else {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(_icon2['default'], { type: 'av_timer', style: { verticalAlign: 'text-bottom' } }),
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.selfdefined' })
        );
      }
    }, _this.modifyMailTemplate = function (id) {
      var _this$mail = _this.mail,
          type = _this$mail.type,
          orgId = _this$mail.orgId,
          orgName = _this$mail.orgName;

      var createUrl = void 0;
      if (type === 'organization') {
        createUrl = '/iam/inmail-template/modify/' + id + '?type=' + type + '&id=' + orgId + '&name=' + orgName + '&organizationId=' + orgId;
      } else {
        createUrl = '/iam/inmail-template/modify/' + id;
      }
      _this.props.history.push(createUrl);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(InMailTemplate, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        selectType: 'create',
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
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initMailTemplate();
      this.loadTemplate();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _inmailTemplate2['default'].setTemplateType([]);
    }
  }, {
    key: 'initMailTemplate',
    value: function initMailTemplate() {
      this.mail = new MailTemplateType(this);
    }

    // 邮件类型

  }, {
    key: 'loadTemplate',
    value: function loadTemplate(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this2 = this;

      _inmailTemplate2['default'].setLoading(true);
      this.loadTemplateType(this.mail.type, this.mail.orgId);
      var _state = this.state,
          paginationState = _state.pagination,
          sortState = _state.sort,
          filtersState = _state.filters,
          paramsState = _state.params;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var params = paramsIn || paramsState;
      var filters = filtersIn || filtersState;
      // 防止标签闪烁
      this.setState({ filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _inmailTemplate2['default'].setMailTemplate([]);
        _inmailTemplate2['default'].setLoading(false);
        this.setState({
          sort: sort,
          params: params,
          pagination: {
            total: 0
          }
        });
        return;
      }

      _inmailTemplate2['default'].loadMailTemplate(pagination, filters, sort, params, this.mail.type, this.mail.orgId).then(function (data) {
        _inmailTemplate2['default'].setLoading(false);
        _inmailTemplate2['default'].setMailTemplate(data.content);
        _this2.setState({
          sort: sort,
          params: params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          }
        });
        _inmailTemplate2['default'].setLoading(false);
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _inmailTemplate2['default'].setLoading(false);
      });
    }

    /**
     * 创建/基于此创建/修改
     * @param selectType selectType create/modify/baseon
     * @param record 当前行记录
     */

  }, {
    key: 'handleDelete',


    // 删除
    value: function handleDelete(record) {
      var _this3 = this;

      var intl = this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: 'inmailtemplate.delete.owntitle' }),
        content: intl.formatMessage({ id: 'inmailtemplate.delete.owncontent' }, {
          name: record.name
        }),
        onOk: function onOk() {
          _inmailTemplate2['default'].deleteMailTemplate(record.id, _this3.mail.type, _this3.mail.orgId).then(function (data) {
            if (data.failed) {
              Choerodon.prompt(data.message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this3.reload();
            }
          })['catch'](function (error) {
            if (error) {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
            }
          });
        }
      });
    }

    /**
     * 模板编码校验
     * @param rule 表单校验规则
     * @param value 模板编码
     * @param callback 回调函数
     */
    // checkCode = (rule, value, callback) => {
    //   const { intl } = this.props;
    //   const path = this.mail.type === 'site' ? '' : `/organizations/${this.mail.orgId}`;
    //   axios.get(`notify/v1/notices/letters/templates/check${path}?code=${value}`).then((mes) => {
    //     if (mes.failed) {
    //       callback(intl.formatMessage({ id: 'inmailtemplate.code.exist' }));
    //     } else {
    //       callback();
    //     }
    //   });
    // };


  }, {
    key: 'createMailTemplate',


    // 跳转至创建页
    value: function createMailTemplate() {
      var _mail = this.mail,
          type = _mail.type,
          orgId = _mail.orgId,
          orgName = _mail.orgName;

      var createUrl = void 0;
      if (type === 'organization') {
        createUrl = '/iam/inmail-template/create?type=' + type + '&id=' + orgId + '&name=' + orgName + '&organizationId=' + orgId;
      } else {
        createUrl = '/iam/inmail-template/create';
      }
      this.props.history.push(createUrl);
    }

    // 跳转至修改页

  }, {
    key: 'getPermission',
    value: function getPermission() {
      var AppState = this.props.AppState;
      var type = AppState.currentMenuType.type;

      var createService = ['notify-service.pm-template-site.create'];
      var modifyService = ['notify-service.pm-template-site.update'];
      var deleteService = ['notify-service.pm-template-site.delete'];
      if (type === 'organization') {
        createService = ['notify-service.pm-template-org.create'];
        modifyService = ['notify-service.pm-template-org.update'];
        deleteService = ['notify-service.pm-template-org.delete'];
      }
      return {
        createService: createService,
        modifyService: modifyService,
        deleteService: deleteService
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var intl = this.props.intl;
      var AppState = this.props.AppState;
      var type = AppState.currentMenuType.type;

      var _getPermission = this.getPermission(),
          createService = _getPermission.createService,
          modifyService = _getPermission.modifyService,
          deleteService = _getPermission.deleteService;

      var _state2 = this.state,
          filters = _state2.filters,
          pagination = _state2.pagination,
          params = _state2.params;

      var mailTemplateData = _inmailTemplate2['default'].getMailTemplate();
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.table.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '25%',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.table.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '25%',
        filters: [],
        filteredValue: filters.code || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.table.mailtype' }),
        dataIndex: 'type',
        key: 'type',
        width: '30%',
        filters: _inmailTemplate2['default'].getTemplateType.map(function (_ref2) {
          var name = _ref2.name;
          return { text: name, value: name };
        }),
        filteredValue: filters.type || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.table.fromtype' }),
        dataIndex: 'isPredefined',
        key: 'isPredefined',
        width: '30%',
        filters: [{
          text: intl.formatMessage({ id: 'inmailtemplate.predefined' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'inmailtemplate.selfdefined' }),
          value: 'false'
        }],
        filteredValue: filters.isPredefined || [],
        render: function render(isPredefined) {
          return _this4.renderBuiltIn(isPredefined);
        }
      }, {
        title: '',
        width: '100px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          var actionsDatas = [{
            service: createService,
            type: type,
            icon: '',
            text: intl.formatMessage({ id: 'baseon' }),
            action: _this4.handleOpen.bind(_this4, 'baseon', record)
          }, {
            service: modifyService,
            type: type,
            icon: '',
            text: intl.formatMessage({ id: 'modify' }),
            action: _this4.handleOpen.bind(_this4, 'modify', record)
          }];
          // 根据来源类型判断
          if (!record.isPredefined) {
            actionsDatas.push({
              service: deleteService,
              type: type,
              icon: '',
              text: intl.formatMessage({ id: 'delete' }),
              action: _this4.handleDelete.bind(_this4, record)
            });
          }
          return _react2['default'].createElement(_choerodonBootCombine.Action, { data: actionsDatas, getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('page-content')[0];
            } });
        }
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['notify-service.pm-template-site.pageSite', 'notify-service.pm-template-site.create', 'notify-service.pm-template-site.update', 'notify-service.pm-template-site.delete']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.header.title' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: createService },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'playlist_add',
                onClick: this.createMailTemplate.bind(this)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.create' })
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
            code: this.mail.code,
            values: { name: '' + (this.mail.values.name || 'Choerodon') }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: _inmailTemplate2['default'].loading,
            columns: columns,
            dataSource: mailTemplateData,
            pagination: pagination,
            filters: params,
            onChange: this.handlePageChange,
            rowKey: 'id',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return InMailTemplate;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = InMailTemplate;
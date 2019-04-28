'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/tabs/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRouterDom = require('react-router-dom');

var _taskDetail = require('../../../stores/global/task-detail');

var _taskDetail2 = _interopRequireDefault(_taskDetail);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

require('./TaskDetail.scss');

require('../../../common/ConfirmModal.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'taskdetail';
var Sidebar = _modal2['default'].Sidebar;
var TabPane = _tabs2['default'].TabPane;

// 公用方法类

var TaskDetailType = function TaskDetailType(context) {
  (0, _classCallCheck3['default'])(this, TaskDetailType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = void 0;
  switch (type) {
    case 'organization':
      codePrefix = 'organization';
      break;
    case 'project':
      codePrefix = 'project';
      break;
    case 'site':
      codePrefix = 'global';
      break;
    default:
      break;
  }
  this.code = codePrefix + '.taskdetail';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.type = type;
  this.id = id; // 项目或组织id
  this.name = name; // 项目或组织名称
};

var TaskDetail = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(TaskDetail, _Component);

  function TaskDetail() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, TaskDetail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = TaskDetail.__proto__ || Object.getPrototypeOf(TaskDetail)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadTaskDetail(pagination, filters, sort, params);
    }, _this.loadInfo = function (taskId) {
      var _this$taskdetail = _this.taskdetail,
          type = _this$taskdetail.type,
          id = _this$taskdetail.id;

      _taskDetail2['default'].loadInfo(taskId, type, id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _taskDetail2['default'].setInfo(data);
          _this.setState({
            isShowSidebar: true
          });
        }
      });
    }, _this.handleLogPageChange = function (pagination, filters, sort, params) {
      _this.loadLog(pagination, filters, sort, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadTaskDetail();
      });
    }, _this.handleAble = function (record) {
      var id = record.id,
          objectVersionNumber = record.objectVersionNumber;
      var intl = _this.props.intl;

      var status = record.status === 'ENABLE' ? 'disable' : 'enable';
      _taskDetail2['default'].ableTask(id, objectVersionNumber, status, _this.taskdetail.type, _this.taskdetail.id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: status + '.success' }));
          _this.loadTaskDetail();
        }
      })['catch'](function () {
        Choerodon.prompt(intl.formatMessage({ id: status + '.error' }));
      });
    }, _this.handleDelete = function (record) {
      var intl = _this.props.intl;
      var _this$taskdetail2 = _this.taskdetail,
          type = _this$taskdetail2.type,
          id = _this$taskdetail2.id;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.delete.content' }, { name: record.name }),
        onOk: function onOk() {
          return _taskDetail2['default'].deleteTask(record.id, type, id).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.loadTaskDetail();
            }
          })['catch'](function () {
            Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
          });
        }
      });
    }, _this.handleOpen = function (selectType) {
      var record = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (selectType === 'detail') {
        _this.setState({
          selectType: selectType,
          showLog: false,
          logPagination: {
            current: 1,
            pageSize: 10,
            total: 0
          },
          logSort: {
            columnKey: 'id',
            order: 'descend'
          },
          logFilters: {},
          logParams: []
        });
        _this.loadInfo(record.id);
        _taskDetail2['default'].setCurrentTask(record);
      }
    }, _this.handleCancel = function () {
      _this.setState({
        isShowSidebar: false
      });
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.setState({
        isShowSidebar: false,
        tempTaskId: null
      }, function () {
        _taskDetail2['default'].setLog([]);
      });
    }, _this.handleTabChange = function (showLog) {
      if (showLog === 'log') {
        if (!_this.state.tempTaskId) {
          _this.loadLog();
        }
      }
      _this.setState({
        showLog: showLog === 'log'
      });
    }, _this.getLevelName = function () {
      var intl = _this.props.intl;

      var level = void 0;
      switch (_this.taskdetail.type) {
        case 'site':
          level = intl.formatMessage({ id: intlPrefix + '.site' });
          break;
        case 'organization':
          level = intl.formatMessage({ id: intlPrefix + '.organization' });
          break;
        case 'project':
          level = intl.formatMessage({ id: intlPrefix + '.project' });
          break;
        default:
          break;
      }
      return level;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(TaskDetail, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        tempTaskId: null,
        isShowSidebar: false,
        isSubmitting: false,
        selectType: 'detail',
        loading: true,
        logLoading: true,
        showLog: false,
        currentRecord: {},
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
        params: [],
        logPagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        logSort: {
          columnKey: 'id',
          order: 'descend'
        },
        logFilters: {},
        logParams: [],
        paramsData: [], // 参数列表的数据
        paramsLoading: false // 创建任务参数列表Loading
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initTaskDetail();
      this.loadTaskDetail();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _taskDetail2['default'].setData([]);
    }
  }, {
    key: 'initTaskDetail',
    value: function initTaskDetail() {
      this.taskdetail = new TaskDetailType(this);
    }
  }, {
    key: 'loadTaskDetail',
    value: function loadTaskDetail(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this2 = this;

      var _taskdetail = this.taskdetail,
          type = _taskdetail.type,
          id = _taskdetail.id;
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
        _taskDetail2['default'].setData([]);
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

      _taskDetail2['default'].loadData(pagination, filters, sort, params, type, id).then(function (data) {
        _taskDetail2['default'].setData(data.content);
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

    /**
     * 任务信息
     * @param id 任务ID
     */

  }, {
    key: 'loadLog',


    // 任务日志列表
    value: function loadLog(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this3 = this;

      var _taskdetail2 = this.taskdetail,
          type = _taskdetail2.type,
          id = _taskdetail2.id;
      var _state2 = this.state,
          paginationState = _state2.logPagination,
          sortState = _state2.logSort,
          filtersState = _state2.logFilters,
          paramsState = _state2.logParams;

      var logPagination = paginationIn || paginationState;
      var logSort = sortIn || sortState;
      var logFilters = filtersIn || filtersState;
      var logParams = paramsIn || paramsState;
      // 防止标签闪烁
      this.setState({ logFilters: logFilters, logLoading: true });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(logParams, logFilters);
      if (isIncludeSpecialCode) {
        _taskDetail2['default'].setLog([]);
        this.setState({
          logPagination: {
            total: 0
          },
          logLoading: false,
          logSort: logSort,
          logParams: logParams,
          tempTaskId: _taskDetail2['default'].currentTask.id
        });
        return;
      }

      _taskDetail2['default'].loadLogData(logPagination, logFilters, logSort, logParams, _taskDetail2['default'].currentTask.id, type, id).then(function (data) {
        _taskDetail2['default'].setLog(data.content);
        _this3.setState({
          logPagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          logLoading: false,
          logSort: logSort,
          logParams: logParams,
          tempTaskId: _taskDetail2['default'].currentTask.id
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this3.setState({
          logLoading: false
        });
      });
    }
  }, {
    key: 'showActionButton',


    /**
     * 渲染任务明细列表启停用按钮
     * @param record 表格行数据
     * @returns {*}
     */
    value: function showActionButton(record) {
      var _getPermission = this.getPermission(),
          enableService = _getPermission.enableService,
          disableService = _getPermission.disableService;

      if (record.status === 'ENABLE') {
        return _react2['default'].createElement(
          _choerodonBootCombine.Permission,
          { service: disableService },
          _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'disable' }),
              placement: 'bottom'
            },
            _react2['default'].createElement(_button2['default'], {
              size: 'small',
              icon: 'remove_circle_outline',
              shape: 'circle',
              onClick: this.handleAble.bind(this, record)
            })
          )
        );
      } else if (record.status === 'DISABLE') {
        return _react2['default'].createElement(
          _choerodonBootCombine.Permission,
          { service: enableService },
          _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'enable' }),
              placement: 'bottom'
            },
            _react2['default'].createElement(_button2['default'], {
              size: 'small',
              icon: 'finished',
              shape: 'circle',
              onClick: this.handleAble.bind(this, record)
            })
          )
        );
      } else {
        return _react2['default'].createElement(_button2['default'], {
          disabled: true,
          size: 'small',
          icon: 'finished',
          shape: 'circle'
        });
      }
    }

    /**
     * 启停用任务
     * @param record 表格行数据
     */


    /**
     * 删除任务
     * @param record 表格行数据
     */

  }, {
    key: 'createTask',
    value: function createTask() {
      var _taskdetail3 = this.taskdetail,
          type = _taskdetail3.type,
          id = _taskdetail3.id,
          name = _taskdetail3.name;
      var currentMenuType = this.props.AppState.currentMenuType;

      var organizationId = void 0;
      if (currentMenuType.type === 'project') {
        organizationId = currentMenuType.organizationId;
      }
      var createUrl = void 0;
      switch (type) {
        case 'organization':
          createUrl = '/iam/task-detail/create?type=' + type + '&id=' + id + '&name=' + name + '&organizationId=' + id;
          break;
        case 'project':
          createUrl = '/iam/task-detail/create?type=' + type + '&id=' + id + '&name=' + name + '&organizationId=' + organizationId;
          break;
        case 'site':
          createUrl = '/iam/task-detail/create';
          break;
        default:
          break;
      }
      this.props.history.push(createUrl);
    }

    /**
     * 开启侧边栏
     * @param selectType create/detail
     * @param record 列表行数据
     */


    // 关闭侧边栏


    // 任务详情提交


    /**
     * 侧边栏tab切换
     * @param showLog
     */

  }, {
    key: 'renderSidebarOkText',


    // 渲染侧边栏成功按钮文字
    value: function renderSidebarOkText() {
      var selectType = this.state.selectType;

      if (selectType === 'create') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' });
      } else {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' });
      }
    }

    /**
     * 获取当前层级名称
     * @returns {*}
     */

  }, {
    key: 'renderDetailContent',


    // 渲染任务详情
    value: function renderDetailContent() {
      var formatMessage = this.props.intl.formatMessage;

      var level = this.getLevelName();
      var _state3 = this.state,
          showLog = _state3.showLog,
          logFilters = _state3.logFilters,
          logParams = _state3.logParams,
          logPagination = _state3.logPagination,
          logLoading = _state3.logLoading;

      var info = _taskDetail2['default'].info;
      var unit = void 0;
      switch (info.simpleRepeatIntervalUnit) {
        case 'SECONDS':
          unit = '秒';
          break;
        case 'MINUTES':
          unit = '分钟';
          break;
        case 'HOURS':
          unit = '小时';
          break;
        case 'DAYS':
          unit = '天';
          break;
        default:
          break;
      }
      var infoList = [{
        key: formatMessage({ id: intlPrefix + '.task.name' }),
        value: info.name
      }, {
        key: formatMessage({ id: intlPrefix + '.task.description' }),
        value: info.description
      }, {
        key: formatMessage({ id: intlPrefix + '.task.start.time' }),
        value: info.startTime
      }, {
        key: formatMessage({ id: intlPrefix + '.task.end.time' }),
        value: info.endTime
      }, {
        key: formatMessage({ id: intlPrefix + '.trigger.type' }),
        value: info.triggerType === 'simple-trigger' ? formatMessage({ id: intlPrefix + '.easy.task' }) : formatMessage({ id: intlPrefix + '.cron.task' })
      }, {
        key: formatMessage({ id: intlPrefix + '.cron.expression' }),
        value: info.cronExpression
      }, {
        key: formatMessage({ id: intlPrefix + '.repeat.interval' }),
        value: info.triggerType === 'simple-trigger' ? '' + info.simpleRepeatInterval + unit : null
      }, {
        key: formatMessage({ id: intlPrefix + '.repeat.time' }),
        value: info.simpleRepeatCount
      }, {
        key: formatMessage({ id: intlPrefix + '.last.execution.time' }),
        value: info.lastExecTime
      }, {
        key: formatMessage({ id: intlPrefix + '.next.execution.time' }),
        value: info.nextExecTime
      }, {
        key: formatMessage({ id: intlPrefix + '.service.name' }),
        value: info.serviceName
      }, {
        key: formatMessage({ id: intlPrefix + '.execute-strategy' }),
        value: info.executeStrategy && formatMessage({ id: intlPrefix + '.' + info.executeStrategy.toLowerCase() })
      }, {
        key: formatMessage({ id: intlPrefix + '.task.class.name' }),
        value: info.methodDescription
      }, {
        key: formatMessage({ id: intlPrefix + '.params.data' }),
        value: ''
      }];

      var paramColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.4 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.value' }),
        dataIndex: 'value',
        key: 'value',
        width: '50%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.4 },
            text
          );
        }
      }];

      var logColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'status',
        key: 'status',
        filters: [{
          value: 'RUNNING',
          text: '进行中'
        }, {
          value: 'FAILED',
          text: '失败'
        }, {
          value: 'COMPLETED',
          text: '完成'
        }],
        filteredValue: logFilters.status || [],
        render: function render(text) {
          return _react2['default'].createElement(_statusTag2['default'], { name: formatMessage({ id: text.toLowerCase() }), colorCode: text });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.instance.id' }),
        dataIndex: 'serviceInstanceId',
        key: 'serviceInstanceId',
        filters: [],
        filteredValue: logFilters.serviceInstanceId || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.plan.execution.time' }),
        dataIndex: 'plannedStartTime',
        key: 'plannedStartTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.actual.execution.time' }),
        dataIndex: 'actualStartTime',
        key: 'actualStartTime'
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'sidebar-content',
          code: this.taskdetail.code + '.detail',
          values: { name: info.name }
        },
        _react2['default'].createElement(
          _tabs2['default'],
          { activeKey: showLog ? 'log' : 'info', onChange: this.handleTabChange },
          _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.info' }), key: 'info' }),
          _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.log' }), key: 'log' })
        ),
        !showLog ? _react2['default'].createElement(
          'div',
          null,
          infoList.map(function (_ref3) {
            var key = _ref3.key,
                value = _ref3.value;
            return _react2['default'].createElement(
              _row2['default'],
              { key: key, className: (0, _classnames2['default'])('c7n-task-detail-row', { 'c7n-task-detail-row-hide': value === null }) },
              _react2['default'].createElement(
                _col2['default'],
                { span: 3 },
                key,
                ':'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 21 },
                value
              )
            );
          }),
          _react2['default'].createElement(_table2['default'], {
            columns: paramColumns,
            style: { width: '512px', marginBottom: '12px' },
            pagination: false,
            filterBar: false,
            dataSource: info.params,
            rowKey: 'name'
          }),
          _react2['default'].createElement(
            _row2['default'],
            { className: (0, _classnames2['default'])({ 'c7n-task-detail-row': !info.notifyUser }) },
            _react2['default'].createElement(
              _col2['default'],
              { span: 3 },
              formatMessage({ id: intlPrefix + '.inform.person' }),
              ':'
            ),
            _react2['default'].createElement(
              _col2['default'],
              { span: 21 },
              info.notifyUser ? _react2['default'].createElement(
                'ul',
                { style: { paddingLeft: '0' } },
                _react2['default'].createElement(
                  'li',
                  { className: (0, _classnames2['default'])('c7n-task-detail-row-inform-person', { 'c7n-task-detail-row-hide': !info.notifyUser.creator }) },
                  formatMessage({ id: intlPrefix + '.creator' }),
                  ':',
                  _react2['default'].createElement(
                    'span',
                    { style: { marginLeft: '10px' } },
                    info.notifyUser.creator ? info.notifyUser.creator.loginName : null,
                    info.notifyUser.creator ? info.notifyUser.creator.realName : null
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: (0, _classnames2['default'])('c7n-task-detail-row-inform-person', { 'c7n-task-detail-row-hide': !info.notifyUser.administrator }) },
                  level,
                  formatMessage({ id: intlPrefix + '.manager' })
                ),
                _react2['default'].createElement(
                  'li',
                  { className: (0, _classnames2['default'])('c7n-task-detail-row-inform-person', { 'c7n-task-detail-row-hide': !info.notifyUser.assigner.length }) },
                  formatMessage({ id: intlPrefix + '.user' }),
                  ':',
                  info.notifyUser.assigner.length ? _react2['default'].createElement(
                    'div',
                    { className: 'c7n-task-detail-row-inform-person-informlist-name-container' },
                    info.notifyUser.assigner.map(function (item) {
                      return _react2['default'].createElement(
                        'div',
                        { key: item.loginName },
                        _react2['default'].createElement(
                          'span',
                          null,
                          item.loginName,
                          item.realName
                        ),
                        _react2['default'].createElement(
                          'span',
                          null,
                          '\u3001'
                        )
                      );
                    })
                  ) : _react2['default'].createElement(
                    'div',
                    null,
                    formatMessage({ id: intlPrefix + '.empty' })
                  )
                )
              ) : _react2['default'].createElement(
                _col2['default'],
                { span: 21, className: 'c7n-task-detail-row-inform-person-empty' },
                formatMessage({ id: intlPrefix + '.empty' })
              )
            )
          )
        ) : _react2['default'].createElement(_table2['default'], {
          loading: logLoading,
          columns: logColumns,
          filters: logParams,
          pagination: logPagination,
          dataSource: _taskDetail2['default'].getLog.slice(),
          onChange: this.handleLogPageChange,
          rowKey: 'id',
          filterBarPlaceholder: formatMessage({ id: 'filtertable' })
        })
      );
    }

    // 页面权限

  }, {
    key: 'getPermission',
    value: function getPermission() {
      var AppState = this.props.AppState;
      var type = AppState.currentMenuType.type;

      var createService = ['asgard-service.schedule-task-site.create'];
      var enableService = ['asgard-service.schedule-task-site.enable'];
      var disableService = ['asgard-service.schedule-task-site.disable'];
      var deleteService = ['asgard-service.schedule-task-site.delete'];
      var detailService = ['asgard-service.schedule-task-site.getTaskDetail'];
      if (type === 'organization') {
        createService = ['asgard-service.schedule-task-org.create'];
        enableService = ['asgard-service.schedule-task-org.enable'];
        disableService = ['asgard-service.schedule-task-org.disable'];
        deleteService = ['asgard-service.schedule-task-org.delete'];
        detailService = ['asgard-service.schedule-task-org.getTaskDetail'];
      } else if (type === 'project') {
        createService = ['asgard-service.schedule-task-project.create'];
        enableService = ['asgard-service.schedule-task-project.enable'];
        disableService = ['asgard-service.schedule-task-project.disable'];
        deleteService = ['asgard-service.schedule-task-project.delete'];
        detailService = ['asgard-service.schedule-task-project.getTaskDetail'];
      }
      return {
        createService: createService,
        enableService: enableService,
        disableService: disableService,
        deleteService: deleteService,
        detailService: detailService
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;

      var _getPermission2 = this.getPermission(),
          deleteService = _getPermission2.deleteService,
          detailService = _getPermission2.detailService;

      var _state4 = this.state,
          filters = _state4.filters,
          params = _state4.params,
          pagination = _state4.pagination,
          loading = _state4.loading,
          isShowSidebar = _state4.isShowSidebar,
          selectType = _state4.selectType,
          isSubmitting = _state4.isSubmitting;

      var _getPermission3 = this.getPermission(),
          createService = _getPermission3.createService;

      var TaskData = _taskDetail2['default'].getData.slice();
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        filteredValue: filters.name || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'description' }),
        width: '20%',
        dataIndex: 'description',
        key: 'description',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.last.execution.time' }),
        dataIndex: 'lastExecTime',
        key: 'lastExecTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.next.execution.time' }),
        dataIndex: 'nextExecTime',
        key: 'nextExecTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'status',
        key: 'status',
        filters: [{
          value: 'ENABLE',
          text: intl.formatMessage({ id: 'enable' })
        }, {
          value: 'DISABLE',
          text: intl.formatMessage({ id: 'disable' })
        }, {
          value: 'FINISHED',
          text: intl.formatMessage({ id: 'finished' })
        }],
        filteredValue: filters.status || [],
        render: function render(status) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: status.toLowerCase() }), colorCode: status });
        }
      }, {
        title: '',
        key: 'action',
        align: 'right',
        width: '130px',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: detailService },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  icon: 'find_in_page',
                  shape: 'circle',
                  onClick: _this4.handleOpen.bind(_this4, 'detail', record)
                })
              )
            ),
            _this4.showActionButton(record),
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
                  onClick: _this4.handleDelete.bind(_this4, record)
                })
              )
            )
          );
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['asgard-service.schedule-task-site.pagingQuery', 'asgard-service.schedule-task-org.pagingQuery', 'asgard-service.schedule-task-project.pagingQuery', 'asgard-service.schedule-task-site.create', 'asgard-service.schedule-task-org.create', 'asgard-service.schedule-task-project.create', 'asgard-service.schedule-task-site.enable', 'asgard-service.schedule-task-org.enable', 'asgard-service.schedule-task-project.enable', 'asgard-service.schedule-task-site.disable', 'asgard-service.schedule-task-org.disable', 'asgard-service.schedule-task-project.disable', 'asgard-service.schedule-task-site.delete', 'asgard-service.schedule-task-org.delete', 'asgard-service.schedule-task-project.delete', 'asgard-service.schedule-task-site.getTaskDetail', 'asgard-service.schedule-task-org.getTaskDetail', 'asgard-service.schedule-task-project.getTaskDetail', 'asgard-service.schedule-task-instance-site.pagingQueryByTaskId', 'asgard-service.schedule-task-instance-org.pagingQueryByTaskId', 'asgard-service.schedule-task-instance-project.pagingQueryByTaskId']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: createService },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'playlist_add',
                onClick: this.createTask.bind(this)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: this.handleRefresh
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: this.taskdetail.code,
            values: { name: '' + (this.taskdetail.values.name || 'Choerodon') }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            columns: columns,
            dataSource: TaskData,
            pagination: pagination,
            filters: params,
            onChange: this.handlePageChange,
            rowKey: 'id',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.' + selectType + '.header.title' }),
              visible: isShowSidebar,
              onOk: this.handleSubmit,
              onCancel: this.handleCancel,
              okText: this.renderSidebarOkText(),
              okCancel: selectType !== 'detail',
              confirmLoading: isSubmitting,
              className: 'c7n-task-detail-sidebar'
            },
            this.renderDetailContent()
          )
        )
      );
    }
  }]);
  return TaskDetail;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = TaskDetail;
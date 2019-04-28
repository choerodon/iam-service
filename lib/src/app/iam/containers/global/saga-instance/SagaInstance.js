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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _SagaImg = require('../saga/SagaImg');

var _SagaImg2 = _interopRequireDefault(_SagaImg);

var _SagaInstanceStore = require('../../../stores/global/saga-instance/SagaInstanceStore');

var _SagaInstanceStore2 = _interopRequireDefault(_SagaInstanceStore);

require('./style/saga-instance.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _InstanceExpandRow = require('./InstanceExpandRow');

var _InstanceExpandRow2 = _interopRequireDefault(_InstanceExpandRow);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.saga-instance';
var Sidebar = _modal2['default'].Sidebar;

var SagaInstanceType = function SagaInstanceType(context) {
  (0, _classCallCheck3['default'])(this, SagaInstanceType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var apiGetway = '/asgard/v1/sagas/' + type + 's/' + id + '/';
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
      apiGetway = '/asgard/v1/sagas/';
      break;
    default:
      break;
  }
  this.code = codePrefix + '.saga-instance';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.roleId = id || 0;
  this.apiGetway = apiGetway;
};

var SagaInstance = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(SagaInstance, _Component);

  function SagaInstance() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, SagaInstance);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = SagaInstance.__proto__ || Object.getPrototypeOf(SagaInstance)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handleStatusClick = function (status) {
      var _this$state = _this.state,
          pagination = _this$state.pagination,
          filters = _this$state.filters,
          sort = _this$state.sort,
          params = _this$state.params,
          activeTab = _this$state.activeTab;

      var newFilters = filters;
      newFilters.status = [status];
      _this.reload(pagination, newFilters, sort, params, activeTab);
    }, _this.reload = function (paginationIn, filtersIn, sortIn, paramsIn, type) {
      var _this$state2 = _this.state,
          paginationState = _this$state2.pagination,
          sortState = _this$state2.sort,
          filtersState = _this$state2.filters,
          paramsState = _this$state2.params;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      _this.setState({
        loading: true,
        filters: filters
      });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _SagaInstanceStore2['default'].setData([]);
        _this.setState({
          pagination: {
            total: 0
          },
          loading: false,
          sort: sort,
          params: params
        });
        return;
      }
      _SagaInstanceStore2['default'].loadData(pagination, filters, sort, params, _this.sagaInstanceType, type).then(function (data) {
        if (type === 'task') {
          _SagaInstanceStore2['default'].setTaskData(data.content);
        } else {
          _SagaInstanceStore2['default'].setData(data.content);
        }
        _SagaInstanceStore2['default'].loadStatistics();
        _this.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          loading: false,
          sort: sort,
          params: params
        });
      });
    }, _this.tableChange = function (pagination, filters, sort, params, type) {
      _this.reload(pagination, filters, sort, params, type);
    }, _this.loadTaskData = function () {
      var activeTab = _this.state.activeTab;

      if (activeTab === 'task') {
        return;
      }
      _this.setState((0, _extends3['default'])({}, _this.getInitState(), {
        activeTab: 'task'
      }), function () {
        _this.reload(null, null, null, null, 'task');
      });
    }, _this.loadAllData = function () {
      var activeTab = _this.state.activeTab;

      if (activeTab === 'instance') {
        return;
      }
      _this.refresh();
    }, _this.openSidebar = function (id) {
      _SagaInstanceStore2['default'].loadDetailData(id).then(function (data) {
        _this.setState({
          data: data
        }, function () {
          _this.setState({
            visible: true
          });
        });
      });
    }, _this.handleOk = function () {
      _this.setState({
        visible: false
      });
    }, _this.refresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.reload();
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(SagaInstance, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.sagaInstanceType = new SagaInstanceType(this);
      this.reload();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        data: '',
        visible: false,
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
        activeTab: 'instance'
      };
    }
  }, {
    key: 'renderTaskTable',
    value: function renderTaskTable() {
      var _this2 = this;

      var intl = this.props.intl;
      var _state = this.state,
          filters = _state.filters,
          activeTab = _state.activeTab;

      var dataSource = _SagaInstanceStore2['default'].getTaskData;
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.status' }),
        key: 'status',
        dataIndex: 'status',
        width: '130px',
        render: function render(status) {
          return _react2['default'].createElement(_statusTag2['default'], {
            mode: 'icon',
            name: intl.formatMessage({ id: status.toLowerCase() }),
            colorCode: status === 'WAIT_TO_BE_PULLED' ? 'QUEUE' : status
          });
        },
        filters: [{
          value: 'RUNNING',
          text: '运行中'
        }, {
          value: 'FAILED',
          text: '失败'
        }, {
          value: 'COMPLETED' || 'NON_CONSUMER',
          text: '完成'
        }, {
          value: 'WAIT_TO_BE_PULLED',
          text: '等待被拉取'
        }],
        filteredValue: filters.status || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.saga.task.code' }),
        key: 'taskInstanceCode',
        dataIndex: 'taskInstanceCode',
        filters: [],
        filteredValue: filters.taskInstanceCode || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.saga-instance.saga' }),
        key: 'sagaInstanceCode',
        dataIndex: 'sagaInstanceCode',
        filters: [],
        filteredValue: filters.sagaInstanceCode || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'description' }),
        key: 'description',
        dataIndex: 'description',
        // filters: [],
        // filteredValue: filters.description || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.saga.task.actualstarttime' }),
        key: 'plannedStartTime',
        dataIndex: 'plannedStartTime',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.saga.task.actualendtime' }),
        key: 'actualEndTime',
        dataIndex: 'actualEndTime',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'saga-instance.task.retry-count' }),
        width: '85px',
        render: function render(record) {
          return record.retriedCount + '/' + record.maxRetryCount;
        }
      }, {
        title: '',
        width: '50px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                icon: 'find_in_page',
                size: 'small',
                shape: 'circle',
                onClick: _this2.openSidebar.bind(_this2, record.sagaInstanceId)
              })
            )
          );
        }
      }];
      return _react2['default'].createElement(_table2['default'], {
        className: 'c7n-saga-instance-table',
        loading: this.state.loading,
        pagination: this.state.pagination,
        columns: columns,
        dataSource: dataSource,
        filters: this.state.params,
        onChange: function onChange(pagination, filter, sort, params) {
          return _this2.tableChange(pagination, filter, sort, params, 'task');
        },
        filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
      });
    }
  }, {
    key: 'renderTable',
    value: function renderTable() {
      var _this3 = this;

      var intl = this.props.intl;
      var filters = this.state.filters;

      var dataSource = _SagaInstanceStore2['default'].getData;
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.status' }),
        key: 'status',
        dataIndex: 'status',
        render: function render(status) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: status.toLowerCase() }), colorCode: status });
        },
        filters: [{
          value: 'RUNNING',
          text: '运行中'
        }, {
          value: 'FAILED',
          text: '失败'
        }, {
          value: 'COMPLETED' || 'NON_CONSUMER',
          text: '完成'
        }],
        filteredValue: filters.status || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'saga-instance.saga.instance' }),
        key: 'sagaCode',
        width: '25%',
        dataIndex: 'sagaCode',
        filters: [],
        filteredValue: filters.sagaCode || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.start.time' }),
        key: 'startTime',
        dataIndex: 'startTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.reftype' }),
        key: 'refType',
        dataIndex: 'refType',
        filters: [],
        filteredValue: filters.refType || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.refid' }),
        key: 'refId',
        width: 150,
        dataIndex: 'refId',
        className: 'c7n-saga-instance-refid',
        filters: [],
        filteredValue: filters.refId || []
      }, {
        title: '',
        width: '50px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                icon: 'find_in_page',
                size: 'small',
                shape: 'circle',
                onClick: _this3.openSidebar.bind(_this3, record.id)
              })
            )
          );
        }
      }];
      return _react2['default'].createElement(_table2['default'], {
        className: 'c7n-saga-instance-table',
        loading: this.state.loading,
        pagination: this.state.pagination,
        columns: columns,
        indentSize: 0,
        dataSource: dataSource,
        filters: this.state.params,
        expandedRowRender: function expandedRowRender(record) {
          return _react2['default'].createElement(_InstanceExpandRow2['default'], { apiGateWay: _this3.sagaInstanceType.apiGetway, record: record, expand: _this3.openSidebar.bind(_this3, record.id) });
        },
        rowKey: 'id',
        onChange: this.tableChange,
        filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state2 = this.state,
          data = _state2.data,
          activeTab = _state2.activeTab;
      var _props = this.props,
          AppState = _props.AppState,
          formatMessage = _props.intl.formatMessage;

      var istStatusType = ['COMPLETED', 'RUNNING', 'FAILED'];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'c7n-saga-instance',
          service: ['asgard-service.saga-instance.pagingQuery', 'asgard-service.saga-instance.query', 'asgard-service.saga-instance.statistics', 'asgard-service.saga-instance.queryDetails', 'asgard-service.saga-instance-org.pagingQuery', 'asgard-service.saga-instance-org.statistics', 'asgard-service.saga-instance-org.query', 'asgard-service.saga-instance-org.queryDetails', 'asgard-service.saga-instance-project.pagingQuery', 'asgard-service.saga-instance-project.statistics', 'asgard-service.saga-instance-project.query', 'asgard-service.saga-instance-project.queryDetails']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: this.sagaInstanceType.code + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: this.refresh
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          null,
          _react2['default'].createElement(
            'div',
            { className: 'c7n-saga-status-wrap' },
            _react2['default'].createElement(
              'div',
              { style: { width: 512 } },
              _react2['default'].createElement(
                'h2',
                { className: 'c7n-space-first' },
                _react2['default'].createElement(_reactIntl.FormattedMessage, {
                  id: this.sagaInstanceType.code + '.title',
                  values: this.sagaInstanceType.values
                })
              ),
              _react2['default'].createElement(
                'p',
                null,
                _react2['default'].createElement(_reactIntl.FormattedMessage, {
                  id: this.sagaInstanceType.code + '.description'
                }),
                _react2['default'].createElement(
                  'a',
                  { href: formatMessage({ id: this.sagaInstanceType.code + '.link' }), rel: 'nofollow me noopener noreferrer', target: '_blank', className: 'c7n-external-link' },
                  _react2['default'].createElement(
                    'span',
                    { className: 'c7n-external-link-content' },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'learnmore' })
                  ),
                  _react2['default'].createElement('i', { className: 'icon icon-open_in_new c7n-iam-link-icon' })
                )
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'c7n-saga-status-content' },
              null,
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                  'div',
                  { className: 'c7n-saga-status-text' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'saga-instance.overview' })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'c7n-saga-status-wrap' },
                  istStatusType.map(function (item) {
                    return _react2['default'].createElement(
                      'div',
                      { onClick: function onClick() {
                          return _this4.handleStatusClick(item);
                        }, key: item.toLowerCase(), className: 'c7n-saga-status-num c7n-saga-status-' + item.toLowerCase() },
                      _react2['default'].createElement(
                        'div',
                        null,
                        _SagaInstanceStore2['default'].getStatistics[item] || 0
                      ),
                      _react2['default'].createElement(
                        'div',
                        null,
                        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: item.toLowerCase() })
                      )
                    );
                  })
                )
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-saga-instance-btns' },
            _react2['default'].createElement(
              'span',
              { className: 'text' },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.view' }),
              '\uFF1A'
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.loadAllData,
                className: activeTab === 'instance' && 'active',
                type: 'primary'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.instance' })
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                className: activeTab === 'task' && 'active',
                onClick: this.loadTaskData,
                type: 'primary'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task' })
            )
          ),
          activeTab === 'instance' ? this.renderTable() : this.renderTaskTable(),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail' }),
              onOk: this.handleOk,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' }),
              okCancel: false,
              className: 'c7n-saga-instance-sidebar',
              visible: this.state.visible,
              destroyOnClose: true
            },
            _react2['default'].createElement(
              _choerodonBootCombine.Content,
              {
                className: 'sidebar-content',
                code: intlPrefix + '.detail',
                values: { name: data.id }
              },
              _react2['default'].createElement(_SagaImg2['default'], { data: data, instance: true })
            )
          )
        )
      );
    }
  }]);
  return SagaInstance;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = SagaInstance;
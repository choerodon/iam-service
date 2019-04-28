'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

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

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _executionRecord3 = require('../../../stores/global/execution-record');

var _executionRecord4 = _interopRequireDefault(_executionRecord3);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlPrefix = 'execution';
var tablePrefix = 'taskdetail';

// 公用方法类

var ExecutionRecordType = function ExecutionRecordType(context) {
  (0, _classCallCheck3['default'])(this, ExecutionRecordType);

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
  this.code = codePrefix + '.execution';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.type = type;
  this.id = id; // 项目或组织id
  this.name = name; // 项目或组织名称
};

var ExecutionRecord = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = function (_Component) {
  (0, _inherits3['default'])(ExecutionRecord, _Component);

  function ExecutionRecord() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ExecutionRecord);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ExecutionRecord.__proto__ || Object.getPrototypeOf(ExecutionRecord)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadExecutionRecord(pagination, filters, sort, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadExecutionRecord();
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ExecutionRecord, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        loading: true,
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
      this.initExecutionRecord();
      this.loadExecutionRecord();
    }
  }, {
    key: 'initExecutionRecord',
    value: function initExecutionRecord() {
      this.executionRecord = new ExecutionRecordType(this);
    }
  }, {
    key: 'loadExecutionRecord',
    value: function loadExecutionRecord(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this2 = this;

      var _executionRecord = this.executionRecord,
          type = _executionRecord.type,
          id = _executionRecord.id;
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
        _executionRecord4['default'].setData([]);
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
      _executionRecord4['default'].loadData(pagination, filters, sort, params, type, id).then(function (data) {
        _executionRecord4['default'].setData(data.content);
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
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var _state2 = this.state,
          filters = _state2.filters,
          params = _state2.params,
          pagination = _state2.pagination,
          loading = _state2.loading;
      var _executionRecord2 = this.executionRecord,
          code = _executionRecord2.code,
          values = _executionRecord2.values;

      var recordData = _executionRecord4['default'].getData.slice();
      var columns = [{
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
        filteredValue: filters.status || [],
        render: function render(text) {
          return _react2['default'].createElement(_statusTag2['default'], { name: intl.formatMessage({ id: text.toLowerCase() }), colorCode: text });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'name' }),
        dataIndex: 'taskName',
        key: 'taskName',
        width: '11%',
        filters: [],
        filteredValue: filters.taskName || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.reason' }),
        dataIndex: 'exceptionMessage',
        key: 'exceptionMessage',
        width: '11%',
        filters: [],
        filteredValue: filters.exceptionMessage || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: tablePrefix + '.last.execution.time' }),
        dataIndex: 'actualLastTime',
        key: 'actualLastTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: tablePrefix + '.plan.execution.time' }),
        dataIndex: 'plannedStartTime',
        key: 'plannedStartTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: tablePrefix + '.next.execution.time' }),
        dataIndex: 'plannedNextTime',
        key: 'plannedNextTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: tablePrefix + '.actual.execution.time' }),
        dataIndex: 'actualStartTime',
        key: 'actualStartTime'
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['asgard-service.schedule-task-instance-site.pagingQuery', 'asgard-service.schedule-task-instance-org.pagingQuery', 'asgard-service.schedule-task-instance-project.pagingQuery']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
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
            code: code,
            values: { name: '' + (values.name || 'Choerodon') }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            columns: columns,
            dataSource: recordData,
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
  return ExecutionRecord;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = ExecutionRecord;
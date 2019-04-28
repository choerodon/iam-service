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

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class; /**
                   * Created by hulingfangzi on 2018/8/24.
                   */

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _msgRecord = require('../../../stores/global/msg-record');

var _msgRecord2 = _interopRequireDefault(_msgRecord);

require('./MsgRecord.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 公用方法类
var MsgRecordType = function MsgRecordType(context) {
  (0, _classCallCheck3['default'])(this, MsgRecordType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = type === 'organization' ? 'organization' : 'global';
  this.code = codePrefix + '.msgrecord';
  this.values = { name: name || 'Choerodon' };
  this.type = type;
  this.orgId = id;
};

var APITest = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(APITest, _Component);

  function APITest() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, APITest);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = APITest.__proto__ || Object.getPrototypeOf(APITest)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadMsgRecord(pagination, sorter, filters, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadMsgRecord();
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(APITest, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initMsgRecord();
      this.loadMsgRecord();
    }
  }, {
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
    key: 'initMsgRecord',
    value: function initMsgRecord() {
      this.msgrecord = new MsgRecordType(this);
    }
  }, {
    key: 'loadMsgRecord',
    value: function loadMsgRecord(paginationIn, sortIn, filtersIn, paramsIn) {
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
        _msgRecord2['default'].setData([]);
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

      _msgRecord2['default'].loadData(pagination, filters, sort, params, this.msgrecord.type, this.msgrecord.orgId).then(function (data) {
        _msgRecord2['default'].setData(data.content);
        _this2.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          loading: false,
          sort: sort,
          filters: filters,
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
    key: 'getPermission',
    value: function getPermission() {
      var AppState = this.props.AppState;
      var type = AppState.currentMenuType.type;

      var retryService = ['notify-service.send-setting-site.update'];
      if (type === 'organization') {
        retryService = ['notify-service.send-setting-org.update'];
      }
      return retryService;
    }

    // 刷新

  }, {
    key: 'retry',


    // 重发
    value: function retry(record) {
      var _this3 = this;

      var intl = this.props.intl;

      _msgRecord2['default'].retry(record.id, this.msgrecord.type, this.msgrecord.orgId).then(function (data) {
        var msg = intl.formatMessage({ id: 'msgrecord.send.success' });
        if (data.failed) {
          msg = data.message;
        }
        Choerodon.prompt(msg);
        _this3.loadMsgRecord();
      })['catch'](function () {
        Choerodon.prompt(intl.formatMessage({ id: 'msgrecord.send.failed' }));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;

      var retryService = this.getPermission();
      var _state2 = this.state,
          _state2$sort = _state2.sort,
          columnKey = _state2$sort.columnKey,
          order = _state2$sort.order,
          filters = _state2.filters,
          params = _state2.params,
          pagination = _state2.pagination,
          loading = _state2.loading;

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.status' }),
        dataIndex: 'status',
        key: 'status',
        render: function render(status) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: status.toLowerCase() }), colorCode: status });
        },
        filters: [{
          value: 'COMPLETED',
          text: '完成'
        }, {
          value: 'FAILED',
          text: '失败'
        }],
        filteredValue: filters.status || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.email' }),
        dataIndex: 'email',
        key: 'email',
        width: '20%',
        filters: [],
        filteredValue: filters.email || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.templateType' }),
        dataIndex: 'templateType',
        key: 'templateType',
        width: '15%',
        filters: [],
        filteredValue: filters.templateType || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.failedReason' }),
        dataIndex: 'failedReason',
        key: 'failedReason',
        width: '20%',
        filters: [],
        filteredValue: filters.failedReason || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.send.count' }),
        dataIndex: 'retryCount',
        key: 'retryCount'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.creationDate' }),
        dataIndex: 'creationDate',
        key: 'creationDate'
      }, {
        title: '',
        width: '100px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return record.status === 'FAILED' && record.isManualRetry ? _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.resend' }),
              placement: 'bottom'
            },
            _react2['default'].createElement(_button2['default'], {
              size: 'small',
              icon: 'redo',
              shape: 'circle',
              onClick: _this4.retry.bind(_this4, record)
            })
          ) : '';
        }
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'c7n-msgrecord',
          service: ['notify-service.message-record-site.pageEmail', 'notify-service.message-record-org.pageEmail']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'msgrecord.header.title' })
          },
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
            code: this.msgrecord.code,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(_table2['default'], {
            columns: columns,
            dataSource: _msgRecord2['default'].getData,
            pagination: pagination,
            onChange: this.handlePageChange,
            filters: params,
            loading: loading,
            rowKey: 'id',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return APITest;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = APITest;
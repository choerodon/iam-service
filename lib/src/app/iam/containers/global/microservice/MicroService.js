'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class; /**
                   * Created by hulingfangzi on 2018/7/3.
                   */


require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

require('./MicroService.scss');

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.microservice';

var MicroService = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MicroService, _Component);

  function MicroService() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, MicroService);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = MicroService.__proto__ || Object.getPrototypeOf(MicroService)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadInitData(pagination, sorter, filters, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadInitData();
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(MicroService, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadInitData();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        loading: true,
        content: null,
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
    key: 'loadInitData',
    value: function loadInitData(paginationIn, sortIn, filtersIn, paramsIn) {
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
        this.setState({
          loading: false,
          pagination: {
            total: 0
          },
          content: [],
          sort: sort,
          params: params
        });
        return;
      }
      this.fetch(pagination, sort, filters, params).then(function (data) {
        _this2.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          content: data.content,
          loading: false,
          sort: sort,
          params: params
        });
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(_ref2, _ref3, _ref4, params) {
      var current = _ref2.current,
          pageSize = _ref2.pageSize;
      var columnKey = _ref3.columnKey,
          order = _ref3.order;
      var serviceName = _ref4.serviceName;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        service_name: serviceName,
        params: params
      };
      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
        queryObj.sort = sorter.join(',');
      }
      return _choerodonBootCombine.axios.get('/manager/v1/services/manager?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'render',
    value: function render() {
      var _state2 = this.state,
          loading = _state2.loading,
          content = _state2.content,
          _state2$sort = _state2.sort,
          columnKey = _state2$sort.columnKey,
          order = _state2$sort.order,
          filters = _state2.filters,
          pagination = _state2.pagination,
          params = _state2.params;
      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'serviceName',
        key: 'serviceName',
        filters: [],
        filteredValue: filters.serviceName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.instancenum' }),
        dataIndex: 'instanceNum',
        key: 'instanceNum'
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['manager-service.service.pageManager']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
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
            code: intlPrefix,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            columns: columns,
            dataSource: content,
            pagination: pagination,
            filters: params,
            onChange: this.handlePageChange,
            rowKey: 'serviceName',
            className: 'c7n-microservice-table',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return MicroService;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = MicroService;
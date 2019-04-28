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

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class; /**
                          * Created by hulingfangzi on 2018/6/20.
                          */


require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _instance = require('../../../stores/global/instance');

var _instance2 = _interopRequireDefault(_instance);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;

var intlPrefix = 'global.instance';

var Instance = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Instance, _Component);

  function Instance() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Instance);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Instance.__proto__ || Object.getPrototypeOf(Instance)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.loadInitData = function () {
      _instance2['default'].setLoading(true);
      _instance2['default'].loadService().then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
        } else {
          _instance2['default'].setService(res || []);
          if (res.length) {
            var defaultService = { name: 'total' };
            _instance2['default'].setCurrentService(defaultService);
            _this.loadInstanceData();
          } else {
            _instance2['default'].setLoading(false);
          }
        }
      });
    }, _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadInstanceData(pagination, sorter, filters, params);
    }, _this.handleRefresh = function () {
      var defaultService = { name: 'total' };
      _instance2['default'].setCurrentService(defaultService);
      _this.setState(_this.getInitState(), function () {
        _this.loadInitData();
      });
    }, _this.goDetail = function (record) {
      _this.props.history.push('/iam/instance/detail/' + record.instanceId);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Instance, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        sort: {
          columnKey: 'service',
          order: 'asc'
        },
        filters: {},
        params: [],
        defaultService: 'total'
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadInitData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _instance2['default'].setCurrentService([]);
    }
  }, {
    key: 'loadInstanceData',
    value: function loadInstanceData(paginationIn, sortIn, filtersIn, paramsIn) {
      var _this2 = this;

      _instance2['default'].setLoading(true);
      var _state = this.state,
          paginationState = _state.pagination,
          sortState = _state.sort,
          filtersState = _state.filters,
          paramsState = _state.params;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      var service = _instance2['default'].getCurrentService.name === 'total' ? '' : _instance2['default'].getCurrentService.name;
      // 防止标签闪烁
      this.setState({ filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _instance2['default'].setInstanceData([]);
        this.setState({
          pagination: {
            total: 0
          },
          sort: sort,
          params: params
        });
        _instance2['default'].setLoading(false);
        return;
      }
      this.fetch(service, pagination, sort, filters, params).then(function (data) {
        _this2.setState({
          sort: sort,
          params: params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          }
        });
        _instance2['default'].setInstanceData(data.content.slice());
        _instance2['default'].setLoading(false);
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(serviceName, _ref2, _ref3, _ref4, params) {
      var current = _ref2.current,
          pageSize = _ref2.pageSize;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'service' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'asc' : _ref3$order;
      var instanceId = _ref4.instanceId,
          version = _ref4.version;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        instanceId: instanceId,
        version: version,
        params: params,
        service: serviceName
      };
      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'asc') {
          sorter.push('asc');
        }
        queryObj.sort = sorter.join(',');
      }
      return _choerodonBootCombine.axios.get('/manager/v1/instances?' + _queryString2['default'].stringify(queryObj));
    }

    /* 刷新 */

  }, {
    key: 'handleChange',


    /**
     * 微服务下拉框改变事件
     * @param serviceName 服务名称
     */
    value: function handleChange(serviceName) {
      var _this3 = this;

      var currentService = void 0;
      if (serviceName !== 'total') {
        currentService = _instance2['default'].service.find(function (service) {
          return service.name === serviceName;
        });
      } else {
        currentService = { name: 'total' };
      }
      _instance2['default'].setCurrentService(currentService);
      this.setState(this.getInitState(), function () {
        _this3.loadInstanceData();
      });
    }

    /* 微服务下拉框 */

  }, {
    key: 'getOptionList',
    value: function getOptionList() {
      var service = _instance2['default'].service;

      return service && service.length > 0 ? [_react2['default'].createElement(
        Option,
        { key: 'total', value: 'total' },
        '\u6240\u6709\u5FAE\u670D\u52A1'
      )].concat(service.map(function (_ref5) {
        var name = _ref5.name;
        return _react2['default'].createElement(
          Option,
          { key: name, value: name },
          name
        );
      })) : _react2['default'].createElement(
        Option,
        { value: 'total' },
        '\u65E0\u670D\u52A1'
      );
    }

    /* 跳转详情页 */

  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state2 = this.state,
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.id' }),
        dataIndex: 'instanceId',
        key: 'instanceId',
        width: '30%',
        filters: [],
        filteredValue: filters.instanceId || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.version' }),
        dataIndex: 'version',
        key: 'version',
        width: '30%',
        filters: [],
        filteredValue: filters.version || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.port' }),
        dataIndex: 'pod',
        key: 'pod'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.registertime' }),
        dataIndex: 'registrationTime',
        key: 'registrationTime'
      }, {
        title: '',
        width: '100px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['manager-service.instance.query'] },
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
                onClick: _this4.goDetail.bind(_this4, record)
              })
            )
          );
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['manager-service.instance.list', 'manager-service.instance.query']
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
          _react2['default'].createElement(
            _select2['default'],
            {
              style: { width: '512px', marginBottom: '32px' },
              getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('page-content')[0];
              },
              value: _instance2['default'].currentService.name,
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
              filterOption: function filterOption(input, option) {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              },
              filter: true,
              onChange: this.handleChange.bind(this)
            },
            this.getOptionList()
          ),
          _react2['default'].createElement(_table2['default'], {
            loading: _instance2['default'].loading,
            columns: columns,
            dataSource: _instance2['default'].getInstanceData.slice(),
            pagination: pagination,
            filters: params,
            onChange: this.handlePageChange,
            rowKey: 'instanceId',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return Instance;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Instance;
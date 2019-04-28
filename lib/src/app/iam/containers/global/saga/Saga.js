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

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/tabs/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _SagaImg = require('./SagaImg');

var _SagaImg2 = _interopRequireDefault(_SagaImg);

var _jsonFormat = require('../../../common/json-format');

var _jsonFormat2 = _interopRequireDefault(_jsonFormat);

var _SagaStore = require('../../../stores/global/saga/SagaStore');

var _SagaStore2 = _interopRequireDefault(_SagaStore);

require('./style/saga.scss');

require('./style/json.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlPrefix = 'global.saga';
var Sidebar = _modal2['default'].Sidebar;
var TabPane = _tabs2['default'].TabPane;
var Saga = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Saga, _Component);

  function Saga() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Saga);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Saga.__proto__ || Object.getPrototypeOf(Saga)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.reload = function (paginationIn, filtersIn, sortIn, paramsIn) {
      var _this$state = _this.state,
          paginationState = _this$state.pagination,
          sortState = _this$state.sort,
          filtersState = _this$state.filters,
          paramsState = _this$state.params;

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
        _SagaStore2['default'].setData([]);
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
      _SagaStore2['default'].loadData(pagination, filters, sort, params).then(function (data) {
        _SagaStore2['default'].setData(data.content);
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
    }, _this.tableChange = function (pagination, filters, sort, params) {
      _this.reload(pagination, filters, sort, params);
    }, _this.openSidebar = function (id) {
      _SagaStore2['default'].loadDetailData(id).then(function (data) {
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
      }, function () {
        _this.setState({
          showJson: false
        });
      });
    }, _this.handleTabChange = function (showJson) {
      _this.setState({
        showJson: showJson === 'json'
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Saga, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.reload();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
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
        showJson: false,
        data: {}
      };
    }
  }, {
    key: 'renderTable',
    value: function renderTable() {
      var _this2 = this;

      var intl = this.props.intl;
      var filters = this.state.filters;

      var dataSource = _SagaStore2['default'].getData.slice();
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        key: 'code',
        width: '30%',
        dataIndex: 'code',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
        key: 'service',
        dataIndex: 'service',
        filters: [],
        filteredValue: filters.service || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.desc' }),
        key: 'description',
        width: '40%',
        dataIndex: 'description',
        filters: [],
        filteredValue: filters.description || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.3 },
            text
          );
        }
      }, {
        title: '',
        width: '100px',
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
                onClick: _this2.openSidebar.bind(_this2, record.id)
              })
            )
          );
        }
      }];
      return _react2['default'].createElement(_table2['default'], {
        loading: this.state.loading,
        pagination: this.state.pagination,
        columns: columns,
        indentSize: 0,
        dataSource: dataSource,
        filters: this.state.params,
        rowKey: 'id',
        onChange: this.tableChange,
        filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          showJson = _state.showJson,
          data = _state.data;
      var AppState = this.props.AppState;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'c7n-saga',
          service: ['asgard-service.saga.pagingQuery', 'asgard-service.saga.query']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: function onClick() {
                _this3.setState(_this3.getInitState(), function () {
                  _this3.reload();
                });
              }
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
          this.renderTable(),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail' }),
              onOk: this.handleOk,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' }),
              okCancel: false,
              visible: this.state.visible,
              className: 'c7n-saga-sidebar',
              destroyOnClose: true
            },
            _react2['default'].createElement(
              _choerodonBootCombine.Content,
              {
                className: 'sidebar-content',
                code: intlPrefix + '.detail',
                values: { name: data.code }
              },
              _react2['default'].createElement(
                _tabs2['default'],
                { activeKey: showJson ? 'json' : 'img', onChange: this.handleTabChange },
                _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.img' }), key: 'img' }),
                _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.json' }), key: 'json' })
              ),
              showJson ? _react2['default'].createElement(
                'div',
                { className: 'c7n-saga-detail-json', style: { margin: 0 } },
                _react2['default'].createElement(
                  'pre',
                  null,
                  _react2['default'].createElement(
                    'code',
                    { id: 'json' },
                    (0, _jsonFormat2['default'])(data)
                  )
                )
              ) : _react2['default'].createElement(_SagaImg2['default'], { data: data })
            )
          )
        )
      );
    }
  }]);
  return Saga;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Saga;
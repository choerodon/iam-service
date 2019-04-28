'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/table/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _RoleLabelStore = require('../../../stores/global/role-label/RoleLabelStore');

var _RoleLabelStore2 = _interopRequireDefault(_RoleLabelStore);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.rolelabel';

var RoleLabel = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(RoleLabel, _Component);

  function RoleLabel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, RoleLabel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = RoleLabel.__proto__ || Object.getPrototypeOf(RoleLabel)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.reload = function (filtersIn, sortIn, paramsIn) {
      var _this$state = _this.state,
          sortState = _this$state.sort,
          filtersState = _this$state.filters,
          paramsState = _this$state.params;

      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      // 防止标签闪烁
      _this.setState({ filters: filters, loading: true });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _RoleLabelStore2['default'].setData([]);
        _this.setState({
          loading: false,
          sort: sort,
          params: params,
          pagination: {
            total: 0
          }
        });
        return;
      }

      _RoleLabelStore2['default'].loadData(filters, sort, params).then(function (data) {
        _RoleLabelStore2['default'].setData(data);
        _this.setState({
          loading: false,
          sort: sort,
          filters: filters,
          params: params
        });
      });
    }, _this.tableChange = function (pagination, filters, sort, params) {
      _this.reload(filters, sort, params);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(RoleLabel, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.reload();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        visible: false,
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        filters: {},
        params: [],
        submitting: false
      };
    }
  }, {
    key: 'renderLevel',
    value: function renderLevel(level) {
      var intl = this.props.intl;

      if (level === 'site') {
        return intl.formatMessage({ id: 'global' });
      } else if (level === 'organization') {
        return intl.formatMessage({ id: 'organization' });
      } else {
        return intl.formatMessage({ id: 'project' });
      }
    }
  }, {
    key: 'renderTable',
    value: function renderTable() {
      var _this2 = this;

      var intl = this.props.intl;
      var filters = this.state.filters;

      var dataSource = _RoleLabelStore2['default'].getData.slice();
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        key: 'name',
        dataIndex: 'name',
        filters: [],
        filteredValue: filters.name || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.level' }),
        key: 'level',
        dataIndex: 'level',
        filters: [{
          text: intl.formatMessage({ id: 'global' }),
          value: 'site'
        }, {
          text: intl.formatMessage({ id: 'organization' }),
          value: 'organization'
        }, {
          text: intl.formatMessage({ id: 'project' }),
          value: 'project'
        }],
        filteredValue: filters.level || [],
        render: function render(level) {
          return _this2.renderLevel(level);
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.desc' }),
        key: 'description',
        dataIndex: 'description',
        filters: [],
        filteredValue: filters.description || []
      }];
      return _react2['default'].createElement(_table2['default'], {
        loading: this.state.loading,
        pagination: false,
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

      var AppState = this.props.AppState;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'role-label',
          service: ['iam-service.label.listByType']
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
          this.renderTable()
        )
      );
    }
  }]);
  return RoleLabel;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = RoleLabel;
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
                          * Created by hulingfangzi on 2018/6/11.
                          */


require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/modal/style');

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

var _configuration = require('../../../stores/global/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

require('./Configuration.scss');

require('../../../common/ConfirmModal.scss');

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var intlPrefix = 'global.configuration';

var Configuration = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Configuration, _Component);

  function Configuration() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Configuration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Configuration.__proto__ || Object.getPrototypeOf(Configuration)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.loadInitData = function () {
      _configuration2['default'].setCurrentService({});
      _configuration2['default'].setService([]);
      _configuration2['default'].setLoading(true);
      _configuration2['default'].loadService().then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
        } else {
          _configuration2['default'].setService(res || []);
          if (res.length) {
            var name = _configuration2['default'].getRelatedService.name;

            var defaultService = name ? _configuration2['default'].getRelatedService : res[0];
            _configuration2['default'].setCurrentService(defaultService);
            _this.loadConfig();
          } else {
            _configuration2['default'].setLoading(false);
          }
        }
      });
    }, _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadConfig(pagination, sorter, filters, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _configuration2['default'].setLoading(true);
        var defaultService = _configuration2['default'].service[0];
        _configuration2['default'].setCurrentService(defaultService);
        _this.loadConfig();
      });
    }, _this.deleteConfig = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.delete.content' }, { name: record.name }),
        onOk: function onOk() {
          _configuration2['default'].deleteConfig(record.id).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.loadConfig();
            }
          });
        }
      });
    }, _this.setDefaultConfig = function (configId) {
      var intl = _this.props.intl;

      _configuration2['default'].setDefaultConfig(configId).then(function (_ref3) {
        var failed = _ref3.failed,
            message = _ref3.message;

        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          _this.loadConfig();
        }
      });
    }, _this.creatConfig = function () {
      _configuration2['default'].setStatus('create');
      _this.props.history.push('/iam/configuration/create');
    }, _this.createByThis = function (record) {
      _configuration2['default'].setCurrentConfigId(record.id);
      _configuration2['default'].setStatus('baseon');
      _this.props.history.push('/iam/configuration/create');
    }, _this.handleEdit = function (record) {
      _this.props.history.push('/iam/configuration/edit/' + _configuration2['default'].getCurrentService.name + '/' + record.id);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Configuration, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _configuration2['default'].setCurrentConfigId(null);
      this.loadInitData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _configuration2['default'].setRelatedService({}); // 保存时的微服务信息
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
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
    key: 'loadConfig',
    value: function loadConfig(paginationIn, sortIn, filtersIn, paramsIn) {
      var _this2 = this;

      _configuration2['default'].setConfigData([]);
      _configuration2['default'].setLoading(true);
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
      this.setState({ filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _configuration2['default'].setConfigData([]);
        this.setState({
          pagination: {
            total: 0
          },
          sort: sort,
          params: params
        });
        _configuration2['default'].setLoading(false);
        return;
      }

      this.fetch(_configuration2['default'].getCurrentService.name, pagination, sort, filters, params).then(function (data) {
        _this2.setState({
          sort: sort,
          params: params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          }
        });
        _configuration2['default'].setConfigData(data.content.slice());
        _configuration2['default'].setLoading(false);
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(serviceName, _ref4, _ref5, _ref6, params) {
      var current = _ref4.current,
          pageSize = _ref4.pageSize;
      var _ref5$columnKey = _ref5.columnKey,
          columnKey = _ref5$columnKey === undefined ? 'id' : _ref5$columnKey,
          _ref5$order = _ref5.order,
          order = _ref5$order === undefined ? 'descend' : _ref5$order;
      var name = _ref6.name,
          configVersion = _ref6.configVersion,
          isDefault = _ref6.isDefault;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        name: name,
        configVersion: configVersion,
        isDefault: isDefault,
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
      return _choerodonBootCombine.axios.get('/manager/v1/services/' + serviceName + '/configs?' + _queryString2['default'].stringify(queryObj));
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

      var currentService = _configuration2['default'].service.find(function (service) {
        return service.name === serviceName;
      });
      _configuration2['default'].setCurrentService(currentService);
      this.setState(this.getInitState(), function () {
        _this3.loadConfig();
      });
    }

    /**
     * 删除配置
     * @param record 当前行数据
     */


    /**
     * 设置默认配置
     * @param configId 配置id
     */


    /* 创建配置 */


    /**
     * 基于此创建
     * @param record 当前行数据
     */


    /**
     * 修改
     * @param record 当前行数据
     */

  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var _state2 = this.state,
          _state2$sort = _state2.sort,
          columnKey = _state2$sort.columnKey,
          order = _state2$sort.order,
          filters = _state2.filters,
          pagination = _state2.pagination,
          params = _state2.params;

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.id' }),
        dataIndex: 'name',
        key: 'name',
        width: '25%',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.version' }),
        dataIndex: 'configVersion',
        key: 'configVersion',
        width: '25%',
        filters: [],
        filteredValue: filters.configVersion || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.publictime' }),
        dataIndex: 'publicTime',
        key: 'publicTime'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modifytime' }),
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.isdefault' }),
        dataIndex: 'isDefault',
        key: 'isDefault',
        filters: [{
          text: intl.formatMessage({ id: 'yes' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'no' }),
          value: 'false'
        }],
        filteredValue: filters.isDefault || [],
        render: function render(text) {
          return intl.formatMessage({ id: text ? 'yes' : 'no' });
        }
      }, {
        title: '',
        width: '100px',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          var actionsDatas = [{
            service: ['manager-service.config.create'],
            type: 'site',
            icon: '',
            text: intl.formatMessage({ id: intlPrefix + '.create.base' }),
            action: _this4.createByThis.bind(_this4, record)
          }, {
            service: ['manager-service.config.updateConfig'],
            type: 'site',
            icon: '',
            text: intl.formatMessage({ id: 'modify' }),
            action: _this4.handleEdit.bind(_this4, record)
          }];
          if (!record.isDefault) {
            actionsDatas.push({
              service: ['manager-service.config.delete'],
              type: 'site',
              icon: '',
              text: intl.formatMessage({ id: 'delete' }),
              action: _this4.deleteConfig.bind(_this4, record)
            }, {
              service: ['manager-service.config.updateConfigDefault'],
              type: 'site',
              icon: '',
              text: intl.formatMessage({ id: intlPrefix + '.setdefault' }),
              action: _this4.setDefaultConfig.bind(_this4, record.id)
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
          service: ['manager-service.config.create', 'manager-service.config.query', 'manager-service.config.updateConfig', 'manager-service.config.updateConfigDefault']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['manager-service.config.create'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'playlist_add',
                onClick: this.creatConfig
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
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
            code: intlPrefix,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          this.filterBar,
          _react2['default'].createElement(_table2['default'], {
            loading: _configuration2['default'].loading,
            columns: columns,
            dataSource: _configuration2['default'].getConfigData.slice(),
            pagination: pagination,
            filters: params,
            onChange: this.handlePageChange,
            rowKey: 'id',
            className: 'c7n-configuration-table',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }, {
    key: 'filterBar',


    /* 微服务下拉框 */
    get: function get() {
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _select2['default'],
          {
            style: { width: '512px', marginBottom: '32px' },
            value: _configuration2['default'].currentService.name,
            getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('page-content')[0];
            },
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
            filterOption: function filterOption(input, option) {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            },
            filter: true,
            onChange: this.handleChange.bind(this)
          },
          _configuration2['default'].service.map(function (_ref7) {
            var name = _ref7.name;
            return _react2['default'].createElement(
              Option,
              { key: name },
              name
            );
          })
        )
      );
    }
  }]);
  return Configuration;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Configuration;
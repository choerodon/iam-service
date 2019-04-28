'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

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

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tabs/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _executableProgram3 = require('../../../stores/global/executable-program');

var _executableProgram4 = _interopRequireDefault(_executableProgram3);

var _jsonFormat = require('../../../common/json-format');

var _jsonFormat2 = _interopRequireDefault(_jsonFormat);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

require('./ExecutableProgram.scss');

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Sidebar = _modal2['default'].Sidebar;
var TabPane = _tabs2['default'].TabPane;

var intlPrefix = 'executable.program';

// 公用方法类

var ExecutableProgramType = function ExecutableProgramType(context) {
  (0, _classCallCheck3['default'])(this, ExecutableProgramType);

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
  this.code = codePrefix + '.executable.program';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.type = type;
  this.id = id; // 项目或组织id
  this.name = name; // 项目或组织名称
};

var ExecutableProgram = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(ExecutableProgram, _Component);

  function ExecutableProgram() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ExecutableProgram);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ExecutableProgram.__proto__ || Object.getPrototypeOf(ExecutableProgram)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadTaskClassName(pagination, filters, sort, params);
    }, _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadTaskClassName();
      });
    }, _this.openSidebar = function (record) {
      _this.setState({
        classLoading: true
      });
      var _this$executableProgr = _this.executableProgram,
          type = _this$executableProgr.type,
          id = _this$executableProgr.id;

      _executableProgram4['default'].loadProgramDetail(record.id, type, id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
          _this.setState({
            classLoading: false
          });
        } else {
          _executableProgram4['default'].setDetail(data);
          _this.setState({
            isShowSidebar: true,
            programName: record.code,
            classLoading: false
          });
        }
      });
    }, _this.handleDelete = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.delete.content' }, { name: record.code }),
        onOk: function onOk() {
          return _executableProgram4['default'].deleteExecutableProgramById(record.id).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.handleRefresh();
            }
          });
        }
      });
    }, _this.handleOk = function () {
      _this.setState({
        isShowSidebar: false
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

  (0, _createClass3['default'])(ExecutableProgram, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        isShowSidebar: false,
        loading: true,
        classLoading: true,
        showJson: false,
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
        programName: null
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initExecutableProgram();
      this.loadTaskClassName();
    }
  }, {
    key: 'initExecutableProgram',
    value: function initExecutableProgram() {
      this.executableProgram = new ExecutableProgramType(this);
    }
  }, {
    key: 'loadTaskClassName',
    value: function loadTaskClassName(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this2 = this;

      var _executableProgram = this.executableProgram,
          type = _executableProgram.type,
          id = _executableProgram.id;
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
        _executableProgram4['default'].setData([]);
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

      _executableProgram4['default'].loadData(pagination, filters, sort, params, type, id).then(function (data) {
        _executableProgram4['default'].setData(data.content);
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

    // 开启侧边栏


    // 关闭侧边栏


    /**
     * 侧边栏选项卡切换
     * @param showJson 选项卡的key
     */

  }, {
    key: 'renderParamsTable',


    // 渲染侧边栏参数列表
    value: function renderParamsTable() {
      var intl = this.props.intl;

      var classColumns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.name' }),
        dataIndex: 'name',
        key: 'name'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.description' }),
        dataIndex: 'description',
        key: 'description'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.type' }),
        dataIndex: 'type',
        key: 'type'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.default' }),
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        render: function render(text) {
          return _react2['default'].createElement(
            'span',
            null,
            '' + text
          );
        }
      }];
      return _react2['default'].createElement(_table2['default'], {
        loading: this.state.classLoading,
        columns: classColumns,
        dataSource: _executableProgram4['default'].getDetail.paramsList,
        pagination: false,
        filterBar: false,
        rowKey: 'name'

      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;
      var _state2 = this.state,
          _state2$sort = _state2.sort,
          columnKey = _state2$sort.columnKey,
          order = _state2$sort.order,
          filters = _state2.filters,
          params = _state2.params,
          pagination = _state2.pagination,
          loading = _state2.loading,
          isShowSidebar = _state2.isShowSidebar,
          showJson = _state2.showJson,
          programName = _state2.programName;
      var _executableProgram2 = this.executableProgram,
          code = _executableProgram2.code,
          values = _executableProgram2.values;

      var data = _executableProgram4['default'].getData.slice();
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '10%',
        filters: [],
        filteredValue: filters.code || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.belong.service' }),
        dataIndex: 'service',
        key: 'service',
        width: '10%',
        filters: [],
        filteredValue: filters.service || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'method',
        key: 'method',
        width: '20%',
        filters: [],
        filteredValue: filters.method || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            text
          );
        }
      }, this.executableProgram.type === 'site' ? {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'level' }),
        dataIndex: 'level',
        key: 'level',
        width: '5%',
        filters: [{
          value: 'site',
          text: '平台'
        }, {
          value: 'organization',
          text: '组织'
        }, {
          value: 'project',
          text: '项目'
        }],
        filteredValue: filters.level || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.05 },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: text })
          );
        }
      } : { hidden: true }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'description' }),
        dataIndex: 'description',
        key: 'description',
        width: '25%',
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.online.instance.count' }),
        width: 65,
        dataIndex: 'onlineInstanceNum',
        key: 'onlineInstanceNum'
      }, {
        title: '',
        width: 60,
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _react2['default'].Fragment,
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['asgard-service.schedule-method-site.getParams', 'asgard-service.schedule-method-org.getParams', 'asgard-service.schedule-method-project.getParams']
              },
              _react2['default'].createElement(_button2['default'], {
                shape: 'circle',
                icon: 'find_in_page',
                size: 'small',
                onClick: _this3.openSidebar.bind(_this3, record)
              })
            ),
            _this3.executableProgram.type === 'site' && _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['asgard-service.schedule-method-site.delete']
              },
              _react2['default'].createElement(_button2['default'], {
                shape: 'circle',
                icon: 'delete_forever',
                size: 'small',
                onClick: function onClick() {
                  return _this3.handleDelete(record);
                }
              })
            )
          );
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['asgard-service.schedule-method-site.pagingQuery', 'asgard-service.schedule-method-org.pagingQuery', 'asgard-service.schedule-method-project.pagingQuery', 'asgard-service.schedule-method-site.getParams', 'asgard-service.schedule-method-org.getParams', 'asgard-service.schedule-method-project.getParams', 'asgard-service.schedule-method-site.delete']
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
            dataSource: data,
            pagination: pagination,
            filters: params,
            rowKey: 'id',
            onChange: this.handlePageChange,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.program.header.title' }),
              visible: isShowSidebar,
              onOk: this.handleOk,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' }),
              okCancel: false,
              className: 'c7n-executable-program-sidebar'
            },
            _react2['default'].createElement(
              _choerodonBootCombine.Content,
              {
                className: 'sidebar-content',
                code: code + '.class',
                values: { name: programName }
              },
              _react2['default'].createElement(
                _tabs2['default'],
                { activeKey: showJson ? 'json' : 'table', onChange: this.handleTabChange },
                _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.list' }), key: 'table' }),
                _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.json' }), key: 'json' })
              ),
              showJson ? _react2['default'].createElement(
                'div',
                { className: 'c7n-executable-program-json', style: { margin: 0 } },
                _react2['default'].createElement(
                  'pre',
                  null,
                  _react2['default'].createElement(
                    'code',
                    { id: 'json' },
                    (0, _jsonFormat2['default'])(_executableProgram4['default'].getDetail.paramsList)
                  )
                )
              ) : this.renderParamsTable()
            )
          )
        )
      );
    }
  }]);
  return ExecutableProgram;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = ExecutableProgram;
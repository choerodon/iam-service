'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

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

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class;

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _util = require('../../../common/util');

var _taskDetail = require('../../../stores/global/task-detail');

var _taskDetail2 = _interopRequireDefault(_taskDetail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlPrefix = 'organization.ldap.record';
var Sidebar = _modal2['default'].Sidebar;
var SyncRecord = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = function (_Component) {
  (0, _inherits3['default'])(SyncRecord, _Component);

  function SyncRecord(props) {
    (0, _classCallCheck3['default'])(this, SyncRecord);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (SyncRecord.__proto__ || Object.getPrototypeOf(SyncRecord)).call(this, props));

    _this.state = _this.getInitState();

    _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadSyncRecord(pagination, filters, sort, params);
    };

    _this.handleDetailPageChange = function (pagination, filters, sort, params) {
      _this.loadDetail(pagination, filters, sort, params);
    };

    _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadSyncRecord();
      });
    };

    _this.getBackPath = function () {
      var currentMenuType = _this.props.AppState.currentMenuType;
      var type = currentMenuType.type,
          name = currentMenuType.name,
          id = currentMenuType.id;

      var backPath = '/iam/ldap?type=' + type + '&id=' + id + '&name=' + name + '&organizationId=' + id;
      return backPath;
    };

    _this.renderSpendTime = function (startTime, endTime) {
      var intl = _this.props.intl;

      var timeUnit = {
        day: intl.formatMessage({ id: 'day' }),
        hour: intl.formatMessage({ id: 'hour' }),
        minute: intl.formatMessage({ id: 'minute' }),
        second: intl.formatMessage({ id: 'second' })
      };
      var spentTime = new Date(endTime).getTime() - new Date(startTime).getTime(); // 时间差的毫秒数
      // 天数
      var days = Math.floor(spentTime / (24 * 3600 * 1000));
      // 小时
      var leave1 = spentTime % (24 * 3600 * 1000); //  计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      // 分钟
      var leave2 = leave1 % (3600 * 1000); //  计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      // 秒数
      var leave3 = leave2 % (60 * 1000); //  计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      var resultDays = days ? days + timeUnit.day : '';
      var resultHours = hours ? hours + timeUnit.hour : '';
      var resultMinutes = minutes ? minutes + timeUnit.minute : '';
      var resultSeconds = seconds ? seconds + timeUnit.second : '';
      return resultDays + resultHours + resultMinutes + resultSeconds;
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.setState({
        isShowSidebar: false
      });
    };

    _this.ldapId = _this.props.match.params.id;
    return _this;
  }

  (0, _createClass3['default'])(SyncRecord, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        loading: true,
        detailLoading: true,
        recordId: null,
        isShowSidebar: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        detailPagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        detailSort: {
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
      this.loadSyncRecord();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var LDAPStore = this.props.LDAPStore;

      LDAPStore.setSyncRecord([]);
    }
  }, {
    key: 'loadSyncRecord',
    value: function loadSyncRecord(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this2 = this;

      var _props = this.props,
          LDAPStore = _props.LDAPStore,
          AppState = _props.AppState;

      var organizationId = AppState.menuType.id;
      var _state = this.state,
          paginationState = _state.pagination,
          sortState = _state.sort;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      // 防止标签闪烁
      this.setState({ loading: true });
      LDAPStore.loadSyncRecord(pagination, sort, organizationId, this.ldapId).then(function (data) {
        LDAPStore.setSyncRecord(data.content);
        _this2.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          loading: false,
          sort: sort
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this2.setState({
          loading: false
        });
      });
    }
  }, {
    key: 'loadDetail',
    value: function loadDetail(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this3 = this;

      var LDAPStore = this.props.LDAPStore;
      var _state2 = this.state,
          paginationState = _state2.detailPagination,
          sortState = _state2.detailSort,
          filtersState = _state2.filters,
          paramsState = _state2.params,
          recordId = _state2.recordId;

      var detailPagination = paginationIn || paginationState;
      var detailSort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      // 防止标签闪烁
      this.setState({ detailLoading: true, filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        LDAPStore.setDetailRecord([]);
        this.setState({
          detailPagination: {
            total: 0
          },
          detailLoading: false,
          detailSort: detailSort,
          params: params
        });
        return;
      }

      LDAPStore.loadDetail(detailPagination, filters, detailSort, params, recordId).then(function (data) {
        LDAPStore.setDetailRecord(data.content);
        _this3.setState({
          detailPagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          detailLoading: false,
          detailSort: detailSort,
          params: params
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this3.setState({
          detailLoading: false
        });
      });
    }
  }, {
    key: 'handleOpenSidebar',
    value: function handleOpenSidebar(id) {
      var _this4 = this;

      var LDAPStore = this.props.LDAPStore;

      LDAPStore.setDetailRecord([]);
      this.setState({
        isShowSidebar: true,
        recordId: id,
        detailPagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        detailSort: {
          columnKey: 'id',
          order: 'descend'
        },
        filters: {},
        params: []
      }, function () {
        _this4.loadDetail();
      });
    }

    // 关闭失败记录

  }, {
    key: 'renderDetailContent',
    value: function renderDetailContent() {
      var _state3 = this.state,
          detailLoading = _state3.detailLoading,
          detailPagination = _state3.detailPagination,
          filters = _state3.filters,
          params = _state3.params;
      var _props2 = this.props,
          AppState = _props2.AppState,
          LDAPStore = _props2.LDAPStore,
          intl = _props2.intl;

      var detailRecord = LDAPStore.getDetailRecord;
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.uuid' }),
        dataIndex: 'uuid',
        key: 'uuid',
        filters: [],
        filteredValue: filters.uuid || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.loginname' }),
        dataIndex: 'loginName',
        key: 'loginName',
        filters: [],
        filteredValue: filters.loginName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.realname' }),
        dataIndex: 'realName',
        key: 'realName',
        filters: [],
        filteredValue: filters.realName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.email' }),
        dataIndex: 'email',
        key: 'email',
        filters: [],
        filteredValue: filters.email || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.reason' }),
        dataIndex: 'cause',
        key: 'cause'
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'sidebar-content',
          code: intlPrefix + '.detail'
        },
        _react2['default'].createElement(_table2['default'], {
          loading: detailLoading,
          columns: columns,
          filters: params,
          dataSource: detailRecord,
          pagination: detailPagination,
          onChange: this.handleDetailPageChange,
          rowKey: 'id',
          filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props3 = this.props,
          AppState = _props3.AppState,
          LDAPStore = _props3.LDAPStore;

      var syncRecord = LDAPStore.getSyncRecord;
      var _state4 = this.state,
          loading = _state4.loading,
          pagination = _state4.pagination,
          isShowSidebar = _state4.isShowSidebar;

      var organizationName = AppState.menuType.name;
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sync.time' }),
        dataIndex: 'syncBeginTime',
        key: 'syncBeginTime',
        width: '25%'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.success.count' }),
        dataIndex: 'newUserCount',
        key: 'newUserCount',
        width: '20%',
        render: function render(text, _ref) {
          var errorUserCount = _ref.errorUserCount,
              updateUserCount = _ref.updateUserCount;

          if (text !== null && errorUserCount !== null && updateUserCount !== null) {
            var totalCount = text + errorUserCount + updateUserCount;
            var successCount = text + updateUserCount;
            return successCount + '/' + totalCount;
          } else {
            return 'null';
          }
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.count' }),
        dataIndex: 'errorUserCount',
        key: 'errorUserCount',
        width: '20%',
        render: function render(text) {
          return text !== null ? text : 'null';
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.spend' }),
        key: 'spendTime',
        render: function render(text, _ref2) {
          var syncBeginTime = _ref2.syncBeginTime,
              syncEndTime = _ref2.syncEndTime,
              errorUserCount = _ref2.errorUserCount;

          if (errorUserCount !== null) {
            return _this5.renderSpendTime(syncBeginTime, syncEndTime);
          } else {
            return '同步任务异常';
          }
        }
      }, {
        title: '',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return record.errorUserCount ? _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.ldap.pagingQueryErrorUsers'] },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  icon: 'find_in_page',
                  shape: 'circle',
                  onClick: _this5.handleOpenSidebar.bind(_this5, record.id)
                })
              )
            )
          ) : '';
        }
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.ldap.pagingQueryHistories', 'iam-service.ldap.pagingQueryErrorUsers']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }),
            backPath: this.getBackPath()
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
            code: intlPrefix,
            values: { name: organizationName }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            columns: columns,
            dataSource: syncRecord,
            pagination: pagination,
            onChange: this.handlePageChange,
            rowKey: 'id',
            filterBar: false
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.failed.header.title' }),
              visible: isShowSidebar,
              onOk: this.handleSubmit,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' }),
              okCancel: false
            },
            this.renderDetailContent()
          )
        )
      );
    }
  }]);
  return SyncRecord;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = SyncRecord;
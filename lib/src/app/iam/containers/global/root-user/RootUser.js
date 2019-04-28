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

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _util = require('../../../common/util');

var _RootUserStore = require('../../../stores/global/root-user/RootUserStore');

var _RootUserStore2 = _interopRequireDefault(_RootUserStore);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

require('../../../common/ConfirmModal.scss');

require('./RootUser.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var timer = void 0;
var Sidebar = _modal2['default'].Sidebar;

var intlPrefix = 'global.rootuser';
var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var FormItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

var RootUser = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(RootUser, _Component);

  function RootUser() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, RootUser);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = RootUser.__proto__ || Object.getPrototypeOf(RootUser)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.isEmptyFilters = function (_ref2) {
      var loginName = _ref2.loginName,
          realName = _ref2.realName,
          enabled = _ref2.enabled,
          locked = _ref2.locked;

      if (loginName && loginName.length || realName && realName.length || enabled && enabled.length || locked && locked.length) {
        return false;
      }
      return true;
    }, _this.reload = function (paginationIn, filtersIn, sortIn, paramsIn) {
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
        _RootUserStore2['default'].setRootUserData([]);
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

      _RootUserStore2['default'].loadRootUserData(pagination, filters, sort, params).then(function (data) {
        if (_this.isEmptyFilters(filters) && !params.length) {
          _this.setState({
            onlyRootUser: data.totalElements <= 1
          });
        }
        _RootUserStore2['default'].setRootUserData(data.content);
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
    }, _this.openSidebar = function () {
      var resetFields = _this.props.form.resetFields;

      resetFields();
      _this.setState({
        visible: true
      });
    }, _this.closeSidebar = function () {
      _this.setState({
        submitting: false,
        visible: false
      });
    }, _this.handleDelete = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.remove.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.remove.content' }, {
          name: record.realName
        }),
        onOk: function onOk() {
          return _RootUserStore2['default'].deleteRootUser(record.id).then(function (_ref3) {
            var failed = _ref3.failed,
                message = _ref3.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'remove.success' }));
              _this.reload();
            }
          });
        }
      });
    }, _this.handleOk = function (e) {
      var intl = _this.props.intl;
      var validateFields = _this.props.form.validateFields;

      e.preventDefault();
      validateFields(function (err, _ref4) {
        var member = _ref4.member;

        if (!err) {
          _this.setState({
            submitting: true
          });
          _RootUserStore2['default'].addRootUser(member).then(function (_ref5) {
            var failed = _ref5.failed,
                message = _ref5.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'add.success' }));
              _this.closeSidebar();
              _this.reload();
            }
          });
        }
      });
    }, _this.getUserOption = function () {
      var usersData = _RootUserStore2['default'].getUsersData;
      return usersData && usersData.length > 0 ? usersData.map(function (_ref6) {
        var id = _ref6.id,
            imageUrl = _ref6.imageUrl,
            loginName = _ref6.loginName,
            realName = _ref6.realName;
        return _react2['default'].createElement(
          Option,
          { key: id, value: id, label: '' + loginName + realName },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-rootuser-user-option' },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-rootuser-user-option-avatar' },
              imageUrl ? _react2['default'].createElement('img', { src: imageUrl, alt: 'userAvatar', style: { width: '100%' } }) : _react2['default'].createElement(
                'span',
                { className: 'c7n-iam-rootuser-user-option-avatar-noavatar' },
                realName && realName.split('')[0]
              )
            ),
            _react2['default'].createElement(
              'span',
              null,
              loginName,
              realName
            )
          )
        );
      }) : null;
    }, _this.handleSelectFilter = function (value) {
      _this.setState({
        selectLoading: true
      });
      var queryObj = {
        param: value,
        sort: 'id',
        organization_id: 0
      };

      if (timer) {
        clearTimeout(timer);
      }

      if (value) {
        timer = setTimeout(function () {
          return _this.loadUsers(queryObj);
        }, 300);
      } else {
        return _this.loadUsers(queryObj);
      }
    }, _this.loadUsers = function (queryObj) {
      _RootUserStore2['default'].loadUsers(queryObj).then(function (data) {
        _RootUserStore2['default'].setUsersData(data.content.slice());
        _this.setState({
          selectLoading: false
        });
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(RootUser, [{
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
        onlyRootUser: false,
        submitting: false,
        selectLoading: true
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.reload();
    }

    // 加载全平台用户信息

  }, {
    key: 'renderTable',
    value: function renderTable() {
      var _this2 = this;

      var _props = this.props,
          AppState = _props.AppState,
          intl = _props.intl;
      var type = AppState.currentMenuType.type;
      var _state = this.state,
          filters = _state.filters,
          _state$sort = _state.sort,
          columnKey = _state$sort.columnKey,
          order = _state$sort.order;

      var rootUserData = _RootUserStore2['default'].getRootUserData.slice();
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.loginname' }),
        key: 'loginName',
        dataIndex: 'loginName',
        filters: [],
        filteredValue: filters.loginName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.realname' }),
        key: 'realName',
        dataIndex: 'realName',
        filters: [],
        filteredValue: filters.realName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.status.enabled' }),
        key: 'enabled',
        dataIndex: 'enabled',
        render: function render(enabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: enabled ? 'enable' : 'disable' }), colorCode: enabled ? 'COMPLETED' : 'DISABLE' });
        },
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false'
        }],
        filteredValue: filters.enabled || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.status.locked' }),
        key: 'locked',
        dataIndex: 'locked',
        filters: [{
          text: intl.formatMessage({ id: intlPrefix + '.normal' }),
          value: 'false'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.locked' }),
          value: 'true'
        }],
        filteredValue: filters.locked || [],
        render: function render(lock) {
          return intl.formatMessage({ id: lock ? intlPrefix + '.locked' : intlPrefix + '.normal' });
        }
      }, {
        title: '',
        width: 100,
        align: 'right',
        render: function render(text, record) {
          var onlyRootUser = _this2.state.onlyRootUser;

          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['iam-service.user.deleteDefaultUser'],
                type: type
              },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: onlyRootUser ? _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.remove.disable.tooltip' }) : _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'remove' }),
                  placement: onlyRootUser ? 'bottomRight' : 'bottom',
                  overlayStyle: { maxWidth: '300px' }
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  disabled: onlyRootUser,
                  onClick: _this2.handleDelete.bind(_this2, record),
                  shape: 'circle',
                  icon: 'delete_forever'
                })
              )
            )
          );
        }
      }];
      return _react2['default'].createElement(_table2['default'], {
        loading: this.state.loading,
        pagination: this.state.pagination,
        columns: columns,
        indentSize: 0,
        dataSource: rootUserData,
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

      var _props2 = this.props,
          AppState = _props2.AppState,
          form = _props2.form,
          intl = _props2.intl;
      var type = AppState.currentMenuType.type;
      var getFieldDecorator = form.getFieldDecorator;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'root-user-setting',
          service: ['iam-service.user.pagingQueryAdminUsers', 'iam-service.user.addDefaultUsers', 'iam-service.user.deleteDefaultUser', 'iam-service.role-member.queryAllUsers']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.user.addDefaultUsers'],
              type: type
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.openSidebar,
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' })
            )
          ),
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
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.add' }),
              onOk: this.handleOk,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' }),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              onCancel: this.closeSidebar,
              visible: this.state.visible,
              confirmLoading: this.state.submitting
            },
            _react2['default'].createElement(
              _choerodonBootCombine.Content,
              {
                className: 'sidebar-content',
                code: intlPrefix + '.add',
                values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
              },
              _react2['default'].createElement(
                FormItem,
                FormItemNumLayout,
                getFieldDecorator('member', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: intlPrefix + '.require.msg' })
                  }],
                  initialValue: []
                })(_react2['default'].createElement(
                  _select2['default'],
                  {
                    label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.user' }),
                    optionLabelProp: 'label',
                    allowClear: true,
                    style: { width: 512 },
                    mode: 'multiple',
                    optionFilterProp: 'children',
                    filterOption: false,
                    filter: true,
                    onFilterChange: this.handleSelectFilter,
                    notFoundContent: intl.formatMessage({ id: intlPrefix + '.notfound.msg' }),
                    loading: this.state.selectLoading
                  },
                  this.getUserOption()
                ))
              )
            )
          )
        )
      );
    }
  }]);
  return RootUser;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = RootUser;
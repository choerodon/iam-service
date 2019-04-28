'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/tooltip/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./PermissionInfo.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'user.permissioninfo';

var PermissionInfo = (_dec = (0, _mobxReact.inject)('AppState', 'PermissionInfoStore', 'HeaderStore'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(PermissionInfo, _Component);

  function PermissionInfo() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, PermissionInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = PermissionInfo.__proto__ || Object.getPrototypeOf(PermissionInfo)).call.apply(_ref, [this].concat(args))), _this), _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.props.PermissionInfoStore.loadData(pagination, params);
    }, _this.handleRefresh = function () {
      _this.loadData();
    }, _this.loadData = function () {
      _this.props.PermissionInfoStore.setRole(_this.props.AppState.getUserInfo);
      _this.props.PermissionInfoStore.loadData();
    }, _this.renderRoleColumn = function (text) {
      return text.map(function (_ref2, index) {
        var name = _ref2.name,
            enabled = _ref2.enabled;

        var item = _react2['default'].createElement(
          'span',
          { className: (0, _classnames2['default'])('role-wrapper', { 'role-wrapper-enabled': enabled, 'role-wrapper-disabled': !enabled }), key: index },
          index > 0 ? name.substring(1) : name
        );
        if (enabled === false) {
          item = _react2['default'].createElement(
            _tooltip2['default'],
            { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.role.disabled.tip' }) },
            item
          );
        }
        return item;
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(PermissionInfo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadData();
    }
  }, {
    key: 'getRedirectURL',
    value: function getRedirectURL(_ref3) {
      var id = _ref3.id,
          name = _ref3.name,
          level = _ref3.level,
          projName = _ref3.projName,
          organizationId = _ref3.organizationId;

      switch (level) {
        case 'site':
          return { pathname: '/' };
        case 'organization':
          return '/?type=' + level + '&id=' + id + '&name=' + encodeURIComponent(name);
        case 'project':
          return '/?type=' + level + '&id=' + id + '&name=' + encodeURIComponent(projName) + '&organizationId=' + organizationId;
        default:
          return { pathname: '/', query: {} };
      }
    }
  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      var _this2 = this;

      var iconType = { site: 'dvr', project: 'project', organization: 'domain' };
      var siteInfo = this.props.AppState.getSiteInfo;
      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.name' }),
        width: '20%',
        dataIndex: 'name',
        key: 'name',
        className: 'c7n-permission-info-name',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _reactRouterDom.Link,
            { to: _this2.getRedirectURL(record) },
            record.level !== 'site' ? _react2['default'].createElement(
              'div',
              { className: 'c7n-permission-info-name-avatar' },
              record.imageUrl ? _react2['default'].createElement('img', { src: record.imageUrl, alt: 'avatar', style: { width: '100%' } }) : _react2['default'].createElement(
                _react2['default'].Fragment,
                null,
                record.projName ? record.projName.split('')[0] : text.split('')[0]
              )
            ) : _react2['default'].createElement('div', { className: 'c7n-permission-info-name-avatar-default', style: siteInfo.favicon ? { backgroundImage: 'url(' + siteInfo.favicon + ')' } : {} }),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { width: 0.18, text: text },
              text
            )
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.code' }),
        width: '10%',
        dataIndex: 'code',
        key: 'code',
        className: 'c7n-permission-info-code',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.08 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'level' }),
        width: '5%',
        dataIndex: 'level',
        key: 'level',
        className: 'c7n-permission-info-level',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.04 },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: text })
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'role' }),
        width: '42%',
        dataIndex: 'roles',
        key: 'roles',
        className: 'c7n-permission-info-description',
        render: this.renderRoleColumn
      }, {
        title: '',
        width: '5%',
        key: 'action',
        className: 'c7n-permission-info-action',
        align: 'right',
        render: function render(text, record) {
          var name = record.name,
              level = record.level;

          return _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.' + level + '.redirect', values: { name: name } }),
              placement: 'bottomRight'
            },
            _react2['default'].createElement(
              _reactRouterDom.Link,
              { to: _this2.getRedirectURL(record) },
              _react2['default'].createElement(_button2['default'], {
                shape: 'circle',
                icon: 'exit_to_app',
                size: 'small'
              })
            )
          );
        }
      }];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          intl = _props.intl,
          _props$PermissionInfo = _props.PermissionInfoStore,
          pagination = _props$PermissionInfo.pagination,
          params = _props$PermissionInfo.params,
          PermissionInfoStore = _props.PermissionInfoStore,
          realName = _props.AppState.getUserInfo.realName;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.user.pagingQueryRole']
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
          { code: intlPrefix, values: { name: realName } },
          _react2['default'].createElement(_table2['default'], {
            loading: PermissionInfoStore.getLoading,
            columns: this.getTableColumns(),
            pagination: pagination,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' }),
            dataSource: PermissionInfoStore.getDataSource,
            filters: params,
            rowKey: 'id',
            onChange: this.handlePageChange,
            fixed: true,
            className: 'c7n-permission-info-table'
          })
        )
      );
    }
  }]);
  return PermissionInfo;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = PermissionInfo;
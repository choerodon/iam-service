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

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

require('./Application.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'organization.application';

var Application = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Application, _Component);

  function Application() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Application);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Application.__proto__ || Object.getPrototypeOf(Application)).call.apply(_ref, [this].concat(args))), _this), _this.refresh = function () {
      var ApplicationStore = _this.props.ApplicationStore;

      ApplicationStore.refresh();
    }, _this.handleopenTab = function (record, operation) {
      var _this$props = _this.props,
          ApplicationStore = _this$props.ApplicationStore,
          _this$props$AppState$ = _this$props.AppState.currentMenuType,
          name = _this$props$AppState$.name,
          id = _this$props$AppState$.id;

      ApplicationStore.setEditData(record);
      ApplicationStore.setOperation(operation);
      _this.props.history.push('/iam/application/manage/' + (operation === 'create' ? 0 : record.id) + '?type=organization&id=' + id + '&name=' + encodeURIComponent(name));
      // ApplicationStore.showSidebar();
    }, _this.handleEnable = function (record) {
      var ApplicationStore = _this.props.ApplicationStore;

      if (record.enabled) {
        ApplicationStore.disableApplication(record.id).then(function () {
          ApplicationStore.loadData();
        });
      } else {
        ApplicationStore.enableApplication(record.id).then(function () {
          ApplicationStore.loadData();
        });
      }
    }, _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.props.ApplicationStore.loadData(pagination, filters, sorter, params);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Application, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refresh();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$ApplicationSto = _props.ApplicationStore,
          filters = _props$ApplicationSto.filters,
          pagination = _props$ApplicationSto.pagination,
          params = _props$ApplicationSto.params,
          AppState = _props.AppState,
          intl = _props.intl,
          ApplicationStore = _props.ApplicationStore,
          applicationData = _props.ApplicationStore.applicationData;

      var menuType = AppState.currentMenuType;
      var orgId = menuType.id;
      var type = menuType.type;
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        width: '10%',
        filters: [],
        filteredValue: filters.name || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
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
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.category' }),
        dataIndex: 'applicationCategory',
        // width: '25%',
        render: function render(category) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: intlPrefix + '.category.' + category.toLowerCase() }), iconType: category === 'application' ? 'application_-general' : 'grain' });
        },
        filters: [{
          text: '组合应用',
          value: 'combination-application'
        }, {
          text: '普通应用',
          value: 'application'
        }],
        filteredValue: filters.applicationCategory || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.application-type' }),
        dataIndex: 'applicationType',
        filters: [{
          text: '开发应用',
          value: 'normal'
        }, {
          text: '测试应用',
          value: 'test'
        }],
        filteredValue: filters.applicationType || [],
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            intl.formatMessage({ id: intlPrefix + '.type.' + text })
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.project-name' }),
        dataIndex: 'projectName',
        filters: [],
        filteredValue: filters.projectName || [],
        width: '20%',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            text && _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-application-name-avatar' },
              record.imageUrl ? _react2['default'].createElement('img', { src: record.imageUrl, alt: 'avatar', style: { width: '100%' } }) : _react2['default'].createElement(
                _react2['default'].Fragment,
                null,
                text.split('')[0]
              )
            ),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.2 },
              text
            )
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'enabled',
        width: '15%',
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false'
        }],
        filteredValue: filters.enabled || [],
        key: 'enabled',
        render: function render(enabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: enabled ? 'enable' : 'disable' }), colorCode: enabled ? 'COMPLETED' : 'DISABLE' });
        }
      }, {
        title: '',
        key: 'action',
        width: '120px',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.application.update'], type: type, organizationId: orgId },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  size: 'small',
                  onClick: function onClick(e) {
                    return _this2.handleopenTab(record, 'edit');
                  },
                  icon: record.category === 'application' ? 'mode_edit' : 'predefine'
                })
              )
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['iam-service.application.disable', 'iam-service.application.enabled'],
                type: type,
                organizationId: orgId
              },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: record.enabled ? 'disable' : 'enable' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  size: 'small',
                  onClick: function onClick(e) {
                    return _this2.handleEnable(record);
                  },
                  icon: record.enabled ? 'remove_circle_outline' : 'finished'
                })
              )
            )
          );
        }
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.application.pagingQuery', 'iam-service.application.create', 'iam-service.application.types', 'iam-service.application.update', 'iam-service.application.disable', 'iam-service.application.enabled']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.application.create'], type: type, organizationId: orgId },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: function onClick(e) {
                  return _this2.handleopenTab(null, 'create');
                },
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: this.refresh
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix
          },
          _react2['default'].createElement(_table2['default'], {
            pagination: pagination,
            columns: columns,
            dataSource: ApplicationStore.getDataSource,
            rowKey: function rowKey(record) {
              return record.id;
            },
            filters: params,
            onChange: this.handlePageChange,
            loading: ApplicationStore.loading,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return Application;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Application;
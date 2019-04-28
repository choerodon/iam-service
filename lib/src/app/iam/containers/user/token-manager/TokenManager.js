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

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./TokenManager.scss');

var _timeagoReact = require('timeago-react');

var _timeagoReact2 = _interopRequireDefault(_timeagoReact);

var _timeago = require('timeago.js');

var _timeago2 = _interopRequireDefault(_timeago);

var _reactRouterDom = require('react-router-dom');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'user.token-manager';
_timeago2['default'].register('zh_CN', require('./locale/zh_CN'));

var TokenManager = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _reactIntl.injectIntl)(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(TokenManager, _Component);

  function TokenManager() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, TokenManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = TokenManager.__proto__ || Object.getPrototypeOf(TokenManager)).call.apply(_ref, [this].concat(args))), _this), _this.onSelectChange = function (selectedRowKeys) {
      var TokenManagerStore = _this.props.TokenManagerStore;

      TokenManagerStore.setSelectedRowKeys(selectedRowKeys);
    }, _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadInitData(pagination, params);
    }, _this.handleDelete = function (record) {
      var TokenManagerStore = _this.props.TokenManagerStore;
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.remove.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.remove.content' }, { name: record.accesstoken }),
        onOk: function onOk() {
          return TokenManagerStore.deleteTokenById(record.tokenId, Choerodon.getAccessToken().split(' ')[1]).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'remove.success' }));
              _this.refresh();
            }
          });
        }
      });
    }, _this.handleBatchDelete = function () {
      var _this$props = _this.props,
          selectedRowKeys = _this$props.TokenManagerStore.selectedRowKeys,
          TokenManagerStore = _this$props.TokenManagerStore;
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.remove.batch.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.remove.batch.content' }, { name: selectedRowKeys.length }),
        onOk: function onOk() {
          return TokenManagerStore.batchDelete(selectedRowKeys, Choerodon.getAccessToken().split(' ')[1]).then(function (_ref3) {
            var failed = _ref3.failed,
                message = _ref3.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              TokenManagerStore.setSelectedRowKeys([]);
              Choerodon.prompt(intl.formatMessage({ id: 'remove.success' }));
              _this.refresh();
            }
          });
        }
      });
    }, _this.refresh = function () {
      var TokenManagerStore = _this.props.TokenManagerStore;

      TokenManagerStore.refresh(Choerodon.getAccessToken().split(' ')[1]);
    }, _this.renderTime = function (time) {
      return _react2['default'].createElement(
        _tooltip2['default'],
        {
          title: time,
          placement: 'top'
        },
        _react2['default'].createElement(_timeagoReact2['default'], {
          datetime: time,
          locale: Choerodon.getMessage('zh_CN', 'en')
        })
      );
    }, _this.getColumns = function () {
      var intl = _this.props.intl;

      var columns = [{
        title: 'token',
        dataIndex: 'accesstoken',
        key: 'accesstoken',
        width: '30%',
        className: 'c7n-iam-token-manager-token',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _react2['default'].Fragment,
            null,
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.2 },
              text
            ),
            record.currentToken ? _react2['default'].createElement(_statusTag2['default'], {
              mode: 'tags',
              name: '当前',
              style: { color: '#3f51b5' },
              color: '#e7ecfc'
            }) : null
          );
        }
      }, {
        title: intl.formatMessage({ id: intlPrefix + '.client-id' }),
        dataIndex: 'clientId',
        key: 'clientId',
        width: '12%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: intl.formatMessage({ id: intlPrefix + '.redirect-uri' }),
        dataIndex: 'redirectUri',
        key: 'redirectUri',
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2 },
            _react2['default'].createElement(
              'a',
              { className: 'c7n-iam-token-manager-url', onClick: function onClick() {
                  return window.open(text);
                } },
              text
            )
          );
        }
      }, {
        title: intl.formatMessage({ id: intlPrefix + '.create-time' }),
        dataIndex: 'createTime',
        key: 'createTime',
        width: '10%',
        render: _this.renderTime
      }, {
        title: intl.formatMessage({ id: intlPrefix + '.expiration-time' }),
        dataIndex: 'expirationTime',
        key: 'expirationTime',
        width: '10%',
        render: _this.renderTime
      }, {
        title: intl.formatMessage({ id: 'status' }),
        dataIndex: 'expire',
        key: 'expire',
        width: '12%',
        // filters: [
        //   {
        //     text: '正常',
        //     value: false,
        //   }, {
        //     text: '已失效',
        //     value: true,
        //   },
        // ],
        // filteredValue: filters.expire || [],
        render: function render(expire) {
          return _react2['default'].createElement(_statusTag2['default'], {
            mode: 'tags',
            name: !expire ? '正常' : '已失效',
            colorCode: !expire ? 'COMPLETED' : 'DEFAULT'
          });
        }
      }, {
        title: '',
        width: '5%',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete' }),
              placement: 'top'
            },
            _react2['default'].createElement(_button2['default'], {
              shape: 'circle',
              icon: 'delete_forever',
              disabled: record.currentToken,
              size: 'small',
              onClick: function onClick() {
                return _this.handleDelete(record);
              }
            })
          );
        }
      }];
      return columns;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(TokenManager, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadInitData();
    }
  }, {
    key: 'loadInitData',
    value: function loadInitData(pagination, params) {
      var TokenManagerStore = this.props.TokenManagerStore;

      TokenManagerStore.loadData(Choerodon.getAccessToken().split(' ')[1], pagination, params);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$TokenManagerSt = _props.TokenManagerStore,
          loading = _props$TokenManagerSt.loading,
          tokenData = _props$TokenManagerSt.tokenData,
          params = _props$TokenManagerSt.params,
          selectedRowKeys = _props$TokenManagerSt.selectedRowKeys,
          pagination = _props$TokenManagerSt.pagination,
          intl = _props.intl;


      var rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: function getCheckboxProps(record) {
          return { disabled: record.accesstoken === Choerodon.getAccessToken().split(' ')[1] };
        }
      };

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.access-token.list', 'iam-service.access-token.delete']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            { onClick: this.refresh, icon: 'refresh' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            { onClick: this.handleBatchDelete, icon: 'delete_forever', disabled: selectedRowKeys.length === 0 },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete.all' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            className: 'c7n-iam-token-manager',
            code: intlPrefix
          },
          _react2['default'].createElement(_table2['default'], {
            rowSelection: rowSelection,
            loading: loading,
            filters: params.slice(),
            columns: this.getColumns(),
            dataSource: tokenData.slice(),
            pagination: pagination,
            rowKey: 'tokenId',
            fixed: true,
            onChange: this.handlePageChange,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          })
        )
      );
    }
  }]);
  return TokenManager;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = TokenManager;
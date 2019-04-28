'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _checkbox = require('choerodon-ui/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

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

require('choerodon-ui/lib/checkbox/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _ReceiveSettingStore = require('../../../stores/user/receive-setting/ReceiveSettingStore');

var _ReceiveSettingStore2 = _interopRequireDefault(_ReceiveSettingStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'user.receive-setting';

var ReceiveSetting = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(ReceiveSetting, _Component);

  function ReceiveSetting() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ReceiveSetting);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ReceiveSetting.__proto__ || Object.getPrototypeOf(ReceiveSetting)).call.apply(_ref, [this].concat(args))), _this), _this.refresh = function () {
      var AppState = _this.props.AppState;


      _ReceiveSettingStore2['default'].setLoading(true);
      Promise.all([_ReceiveSettingStore2['default'].loadReceiveTypeData(AppState.getUserInfo.id), _ReceiveSettingStore2['default'].loadReceiveSettingData(), _ReceiveSettingStore2['default'].loadAllowConfigData()]).then(function () {
        _ReceiveSettingStore2['default'].setLoading(false);
        _ReceiveSettingStore2['default'].setDirty(false);
      })['catch'](function (error) {
        // Choerodon.prompt(`${error.response.status} ${error.response.statusText}`);
        Choerodon.handleResponseError(error);
        _ReceiveSettingStore2['default'].setLoading(false);
      });
    }, _this.handleCheckAllChange = function (type) {
      var intl = _this.props.intl;

      if (_ReceiveSettingStore2['default'].isAllSelected(type)) {
        _modal2['default'].confirm({
          className: 'c7n-iam-confirm-modal',
          title: intl.formatMessage({ id: intlPrefix + '.uncheck-all.title' }, { name: intl.formatMessage({ id: type }) }),
          content: intl.formatMessage({ id: intlPrefix + '.uncheck-all.content' }),
          onOk: function onOk() {
            _ReceiveSettingStore2['default'].unCheckAll(type);
          }
        });
      } else {
        _ReceiveSettingStore2['default'].checkAll(type);
      }
    }, _this.handleCheckChange = function (e, id, type) {
      _ReceiveSettingStore2['default'].check(id, type);
      _this.forceUpdate();
    }, _this.saveSettings = function () {
      var intl = _this.props.intl;

      if (_ReceiveSettingStore2['default'].getDirty) {
        _ReceiveSettingStore2['default'].saveData().then(function (data) {
          if (!data.fail) {
            Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
            _ReceiveSettingStore2['default'].setDirty(false);
          }
        });
      } else {
        Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
      }
    }, _this.isCheckDisabled = function (record, type) {
      var level = record.id.split('-')[0];
      if ('settings' in record) {
        var allDisable = true;
        _ReceiveSettingStore2['default'].getAllowConfigData.forEach(function (value, key) {
          if (value.type === level) {
            var _allowConfigData = _ReceiveSettingStore2['default'].getAllowConfigData.get(key);
            if (_allowConfigData && _allowConfigData.disabled && !_allowConfigData.disabled[type]) {
              allDisable = false;
            }
          }
        });
        return allDisable;
      }
      var allowConfigData = _ReceiveSettingStore2['default'].getAllowConfigData.get(parseInt(record.id.split('-')[2], 10));
      return allowConfigData && allowConfigData.disabled && allowConfigData.disabled[type];
    }, _this.getCheckbox = function (record, type) {
      if (_this.isCheckDisabled(record, type)) {
        return _react2['default'].createElement(_checkbox2['default'], {
          key: record.id ? record.id : record.id + '-' + record.sendSettingId,
          disabled: true
        });
      } else {
        return _react2['default'].createElement(_checkbox2['default'], {
          key: record.id ? record.id : record.id + '-' + record.sendSettingId,
          indeterminate: record.id ? type === 'pm' ? record.pmIndeterminate : record.mailIndeterminate : false,
          onChange: function onChange(e) {
            return _this.handleCheckChange(e, record.id, type);
          },
          checked: type === 'pm' ? record.pmChecked : record.mailChecked
        });
      }
    }, _this.getTitleCheckbox = function (type) {
      var intl = _this.props.intl;

      return _react2['default'].createElement(
        _checkbox2['default'],
        {
          key: type,
          indeterminate: !_ReceiveSettingStore2['default'].isAllSelected(type) && !_ReceiveSettingStore2['default'].isAllUnSelected(type),
          checked: _ReceiveSettingStore2['default'].isAllSelected(type) && !_ReceiveSettingStore2['default'].getDataSource.every(function (record) {
            return _this.isCheckDisabled(record, type);
          }),
          onChange: function onChange() {
            return _this.handleCheckAllChange(type);
          },
          disabled: _ReceiveSettingStore2['default'].getDataSource.every(function (record) {
            return _this.isCheckDisabled(record, type);
          })
        },
        intl.formatMessage({ id: type })
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ReceiveSetting, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.refresh();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var intl = this.props.intl;

      var promptMsg = intl.formatMessage({ id: 'global.menusetting.prompt.inform.title' }) + Choerodon.STRING_DEVIDER + intl.formatMessage({ id: 'global.menusetting.prompt.inform.message' });
      var columns = [{
        title: '信息类型',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: intl.formatMessage({ id: 'level' }),
        width: '20%',
        render: function render(text, record) {
          return intl.formatMessage({ id: record.id.split('-')[0] });
        }
      }, {
        title: this.getTitleCheckbox('pm'),
        width: '15%',
        render: function render(text, record) {
          return _this2.getCheckbox(record, 'pm');
        }
      }, {
        title: this.getTitleCheckbox('email'),
        width: '15%',
        render: function render(text, record) {
          return _this2.getCheckbox(record, 'email');
        }
      }];

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['notify-service.receive-setting.update', 'notify-service.receive-setting.updateByUserId', 'notify-service.receive-setting.queryByUserId']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            { onClick: this.refresh, icon: 'refresh' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            className: 'c7n-iam-receive-setting',
            code: intlPrefix
          },
          _react2['default'].createElement(_reactRouterDom.Prompt, { message: promptMsg, wrapper: 'c7n-iam-confirm-modal', when: _ReceiveSettingStore2['default'].getDirty }),
          _react2['default'].createElement(_table2['default'], {
            loading: _ReceiveSettingStore2['default'].getLoading,
            filterBar: false,
            columns: columns,
            pagination: false,
            dataSource: _ReceiveSettingStore2['default'].getDataSource,
            childrenColumnName: 'settings',
            rowKey: 'id',
            fixed: true,
            className: 'c7n-permission-info-table'
          }),
          _react2['default'].createElement(
            'div',
            { style: { marginTop: 25 } },
            _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                type: 'primary',
                onClick: this.saveSettings
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                onClick: this.refresh,
                style: { marginLeft: 16, color: '#3F51B5' }
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
            )
          )
        )
      );
    }
  }]);
  return ReceiveSetting;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = ReceiveSetting;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class; /**
                          * Created by chenbinjie on 2018/8/6.
                          */

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./MailSetting.scss');

var _index = require('../../../stores/global/mail-setting/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.mailsetting';
var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var RadioGroup = _radio2['default'].Group;
var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  }
};

var MailSetting = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MailSetting, _Component);

  function MailSetting(props) {
    (0, _classCallCheck3['default'])(this, MailSetting);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (MailSetting.__proto__ || Object.getPrototypeOf(MailSetting)).call(this, props));

    _this.loadMailSetting = function () {
      _this.setState({ loading: true });
      _index2['default'].loadData().then(function (data) {
        if (!data.failed) {
          _index2['default'].setSettingData(data);
          if (data.protocol === 'EXCHANGE') {
            _this.setState({
              isExchange: true
            });
          }
        } else {
          Choerodon.prompt(data.message);
        }
        _this.setState({ loading: false });
      })['catch'](Choerodon.handleResponseError);
    };

    _this.handleRefresh = function () {
      _this.loadMailSetting();
    };

    _this.testContact = function () {
      var _this$props = _this.props,
          intl = _this$props.intl,
          form = _this$props.form;
      var getFieldsValue = form.getFieldsValue;

      var values = getFieldsValue();
      var setting = (0, _extends3['default'])({}, values, {
        ssl: values.ssl === 'Y',
        port: Number(values.port),
        objectVersionNumber: _index2['default'].getSettingData.objectVersionNumber
      });
      _index2['default'].testConnection(setting).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.connect.success' }));
        }
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var intl = _this.props.intl;

      _this.props.form.validateFieldsAndScroll(function (err, values) {
        if (!err) {
          _this.setState({
            saving: true
          });
          var setting = (0, _extends3['default'])({}, values, {
            ssl: values.ssl === 'Y',
            port: Number(values.port),
            objectVersionNumber: _index2['default'].getSettingData.objectVersionNumber
          });
          _index2['default'].updateData(setting).then(function (data) {
            if (data.failed) {
              Choerodon.prompt(data.message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
              _index2['default'].setSettingData(data);
            }
            _this.setState({
              saving: false
            });
          })['catch'](function (error) {
            Choerodon.handleResponseError(error);
            _this.setState({
              saving: false
            });
          });
        }
      });
    };

    _this.loadMailSetting = _this.loadMailSetting.bind(_this);
    _this.state = _this.getInitState();
    return _this;
  }

  (0, _createClass3['default'])(MailSetting, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadMailSetting();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        loading: true,
        saving: false,
        isExchange: false // 下拉框选中EXCHANGE时，控制SSL和端口号的显示
      };
    }

    /* 加载邮件配置 */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          intl = _props.intl,
          form = _props.form,
          AppState = _props.AppState;
      var _state = this.state,
          loading = _state.loading,
          saving = _state.saving;
      var getFieldDecorator = form.getFieldDecorator;

      var inputWidth = '512px';
      var mainContent = _react2['default'].createElement(
        'div',
        { className: (0, _classnames2['default'])('c7n-mailsetting-container', { 'c7n-mailsetting-loading-container': loading }) },
        loading ? _react2['default'].createElement(_spin2['default'], { size: 'large' }) : _react2['default'].createElement(
          _form2['default'],
          { onSubmit: this.handleSubmit, layout: 'vertical' },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('account', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.account.required' })
              }, {
                type: 'email',
                message: intl.formatMessage({ id: intlPrefix + '.account.format' })
              }],
              initialValue: _index2['default'].getSettingData.account
            })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.sending.mail' }), style: { width: inputWidth }, autoComplete: 'off' }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('password', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.password.required' })
              }],
              initialValue: _index2['default'].getSettingData.password
            })(_react2['default'].createElement(_input2['default'], { type: 'password', label: intl.formatMessage({ id: intlPrefix + '.sending.password' }), style: { width: inputWidth }, autoComplete: 'off' }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('sendName', {
              rules: [],
              initialValue: _index2['default'].getSettingData.sendName
            })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.sender' }), style: { width: inputWidth }, autoComplete: 'off' }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('protocol', {
              rules: [],
              initialValue: 'SMTP'
            })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.server.type' }), style: { width: inputWidth }, disabled: true }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('host', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.host.required' })
              }],
              initialValue: _index2['default'].getSettingData.host
            })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.server.address' }), style: { width: inputWidth }, autoComplete: 'off' }))
          ),
          !this.state.isExchange ? _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('ssl', {
                initialValue: _index2['default'].getSettingData.ssl ? 'Y' : 'N'
              })(_react2['default'].createElement(
                RadioGroup,
                {
                  className: 'sslRadioGroup',
                  label: intl.formatMessage({ id: intlPrefix + '.ssl' })
                },
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'Y' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
                ),
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'N' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
                )
              ))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('port', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.port.required' })
                }, {
                  pattern: /^[1-9]\d*$/,
                  message: intl.formatMessage({ id: intlPrefix + '.port.pattern' })
                }],
                initialValue: String(_index2['default'].getSettingData.port)
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.port' }), style: { width: inputWidth }, autoComplete: 'off' }))
            )
          ) : '',
          _react2['default'].createElement('hr', { className: 'divider' }),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['notify-service.config.updateEmail'] },
            _react2['default'].createElement(
              'div',
              { className: 'btnGroup' },
              _react2['default'].createElement(
                _button2['default'],
                {
                  funcType: 'raised',
                  type: 'primary',
                  htmlType: 'submit',
                  loading: saving
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
              ),
              _react2['default'].createElement(
                _button2['default'],
                {
                  funcType: 'raised',
                  onClick: function onClick() {
                    var resetFields = _this2.props.form.resetFields;

                    resetFields();
                  },
                  style: { color: '#3F51B5' },
                  disabled: saving
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
              )
            )
          )
        )
      );

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['notify-service.config.selectEmail', 'notify-service.config.testEmailConnect', 'notify-service.config.updateEmail']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['notify-service.config.testEmailConnect'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.testContact,
                icon: 'low_priority'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.test.contact' })
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
          mainContent
        )
      );
    }
  }]);
  return MailSetting;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = MailSetting;
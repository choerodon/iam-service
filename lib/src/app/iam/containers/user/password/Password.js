'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

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

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _UserInfoStore = require('../../../stores/user/user-info/UserInfoStore');

var _UserInfoStore2 = _interopRequireDefault(_UserInfoStore);

require('./Password.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormItem = _form2['default'].Item;
var intlPrefix = 'user.changepwd';
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

var inputWidth = 512;

var Password = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Password, _Component);

  function Password(props) {
    (0, _classCallCheck3['default'])(this, Password);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Password.__proto__ || Object.getPrototypeOf(Password)).call(this, props));

    _this.state = {
      submitting: false,
      confirmDirty: null
    };

    _this.loadUserInfo = function () {
      _UserInfoStore2['default'].setUserInfo(_this.props.AppState.getUserInfo);
    };

    _this.compareToFirstPassword = function (rule, value, callback) {
      var _this$props = _this.props,
          intl = _this$props.intl,
          form = _this$props.form;

      if (value && value !== form.getFieldValue('password')) {
        callback(intl.formatMessage({ id: intlPrefix + '.twopwd.pattern.msg' }));
      } else {
        callback();
      }
    };

    _this.validateToNextPassword = function (rule, value, callback) {
      var form = _this.props.form;
      if (value && _this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }if (value.indexOf(' ') !== -1) {
        callback('密码不能包含空格');
      }
      callback();
    };

    _this.handleConfirmBlur = function (e) {
      var value = e.target.value;
      _this.setState({ confirmDirty: _this.state.confirmDirty || !!value });
    };

    _this.handleSubmit = function (e) {
      var getFieldValue = _this.props.form.getFieldValue;

      var user = _UserInfoStore2['default'].getUserInfo;
      var body = {
        originalPassword: getFieldValue('oldpassword'),
        password: getFieldValue('confirm')
      };
      e.preventDefault();
      _this.props.form.validateFields(function (err, values) {
        if (!err) {
          _this.setState({ submitting: true });
          _UserInfoStore2['default'].updatePassword(user.id, body).then(function (_ref) {
            var failed = _ref.failed,
                message = _ref.message;

            _this.setState({ submitting: false });
            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.logout();
            }
          })['catch'](function (error) {
            _this.setState({ submitting: false });
            Choerodon.handleResponseError(error);
          });
        }
      });
    };

    _this.reload = function () {
      var resetFields = _this.props.form.resetFields;

      resetFields();
    };

    _this.editFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(Password, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadUserInfo();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          intl = _props.intl,
          form = _props.form;
      var getFieldDecorator = form.getFieldDecorator;
      var submitting = this.state.submitting;

      var user = _UserInfoStore2['default'].getUserInfo;
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.user.selfUpdatePassword']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            { onClick: this.reload, icon: 'refresh' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix,
            values: { name: user.realName }
          },
          _react2['default'].createElement(
            'div',
            { className: 'ldapContainer' },
            _react2['default'].createElement(
              _form2['default'],
              { onSubmit: this.handleSubmit, layout: 'vertical' },
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('oldpassword', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: intlPrefix + '.oldpassword.require.msg' })
                  }, {
                    validator: this.validateToNextPassword
                  }],
                  validateTrigger: 'onBlur'
                })(_react2['default'].createElement(_input2['default'], {
                  autoComplete: 'off',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.oldpassword' }),
                  type: 'password',
                  style: { width: inputWidth },
                  ref: function ref(e) {
                    _this2.editFocusInput = e;
                  },
                  disabled: user.ldap
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('password', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: intlPrefix + '.newpassword.require.msg' })
                  }, {
                    validator: this.validateToNextPassword
                  }],
                  validateTrigger: 'onBlur',
                  validateFirst: true
                })(_react2['default'].createElement(_input2['default'], {
                  autoComplete: 'off',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.newpassword' }),
                  type: 'password',
                  style: { width: inputWidth },
                  showPasswordEye: true,
                  disabled: user.ldap
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                formItemLayout,
                getFieldDecorator('confirm', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: intlPrefix + '.confirmpassword.require.msg' })
                  }, {
                    validator: this.compareToFirstPassword
                  }],
                  validateTrigger: 'onBlur',
                  validateFirst: true
                })(_react2['default'].createElement(_input2['default'], {
                  autoComplete: 'off',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.confirmpassword' }),
                  type: 'password',
                  style: { width: inputWidth },
                  onBlur: this.handleConfirmBlur,
                  showPasswordEye: true,
                  disabled: user.ldap
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                _react2['default'].createElement(
                  _choerodonBootCombine.Permission,
                  {
                    service: ['iam-service.user.selfUpdatePassword'],
                    type: 'site',
                    onAccess: function onAccess() {
                      setTimeout(function () {
                        _this2.editFocusInput.input.focus();
                      }, 10);
                    }
                  },
                  _react2['default'].createElement(
                    _row2['default'],
                    null,
                    _react2['default'].createElement('hr', { className: 'hrLine' }),
                    _react2['default'].createElement(
                      _col2['default'],
                      { span: 5, style: { marginRight: 16 } },
                      _react2['default'].createElement(
                        _button2['default'],
                        {
                          funcType: 'raised',
                          type: 'primary',
                          htmlType: 'submit',
                          loading: submitting,
                          disabled: user.ldap
                        },
                        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
                      ),
                      _react2['default'].createElement(
                        _button2['default'],
                        {
                          funcType: 'raised',
                          onClick: this.reload,
                          style: { marginLeft: 16 },
                          disabled: submitting || user.ldap
                        },
                        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);
  return Password;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Password;
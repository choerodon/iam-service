'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _inputNumber = require('choerodon-ui/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class;

require('choerodon-ui/lib/input-number/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _index = require('../../../stores/organization/password-policy/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../../components/loadingBar/index');

var _index4 = _interopRequireDefault(_index3);

require('./PasswordPolicy.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inputPrefix = 'organization.pwdpolicy';
var FormItem = _form2['default'].Item;
var RadioGroup = _radio2['default'].Group;
var TextArea = _input2['default'].TextArea;

var formItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  }
};

var PasswordPolicy = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(PasswordPolicy, _Component);

  function PasswordPolicy(props) {
    (0, _classCallCheck3['default'])(this, PasswordPolicy);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (PasswordPolicy.__proto__ || Object.getPrototypeOf(PasswordPolicy)).call(this, props));

    _this.isShowPanel = function (policy) {
      _this.setState(function (prevState) {
        return (0, _defineProperty3['default'])({}, policy, !prevState[policy]);
      });
    };

    _this.changeStatus = function (status, e) {
      _this.setState((0, _defineProperty3['default'])({}, status, e.target.value));
    };

    _this.inputNumBlur = function (fieldName, e) {
      var setFieldsValue = _this.props.form.setFieldsValue;

      if (!e.target.value) {
        setFieldsValue((0, _defineProperty3['default'])({}, fieldName, 0));
      }
    };

    _this.reload = function () {
      _this.loadData();
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          intl = _this$props.intl;

      _this.props.form.validateFieldsAndScroll(function (err, datas) {
        if (!err) {
          var value = (0, _extends3['default'])({}, _index2['default'].getPasswordPolicy, datas);
          var newValue = (0, _extends3['default'])({}, value, {
            id: _index2['default'].getPasswordPolicy.id,
            objectVersionNumber: _index2['default'].getPasswordPolicy.objectVersionNumber,
            enablePassword: value.enablePassword === 'enablePwd',
            notUsername: value.notUsername === 'different',
            enableSecurity: value.enableSecurity === true || value.enableSecurity === 'enabled',
            enableCaptcha: value.enableCaptcha === true || value.enableCaptcha === 'enableCode',
            enableLock: value.enableLock === true || value.enableLock === 'enableLock'
          });
          _this.setState({
            submitting: true,
            showPwd: true,
            showLogin: true
          });
          _index2['default'].updatePasswordPolicy(AppState.currentMenuType.id, newValue.id, newValue).then(function (data) {
            _this.setState({ submitting: false });
            Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
            _index2['default'].setPasswordPolicy(data);
            _this.loadData();
          })['catch'](function (error) {
            _this.setState({ submitting: false });
            Choerodon.handleResponseError(error);
          });
        }
      });
    };

    _this.checkMaxLength = function (rule, value, callback) {
      var getFieldValue = _this.props.form.getFieldValue;
      var intl = _this.props.intl;

      var digitsCount = getFieldValue('digitsCount');
      var lowercaseCount = getFieldValue('lowercaseCount');
      var uppercaseCount = getFieldValue('uppercaseCount');
      var specialCharCount = getFieldValue('specialCharCount');
      if (digitsCount + lowercaseCount + uppercaseCount + specialCharCount > value) {
        callback(intl.formatMessage({ id: inputPrefix + '.max.length' }));
      }
      _this.props.form.validateFields(['minLength'], { force: true });
      callback();
    };

    _this.checkMinLength = function (rule, value, callback) {
      var intl = _this.props.intl;
      var getFieldValue = _this.props.form.getFieldValue;

      var maxLength = getFieldValue('maxLength');
      if (value > maxLength) callback(intl.formatMessage({ id: inputPrefix + '.min.lessthan.more' }));
      callback();
    };

    _this.checkOtherLength = function (rule, value, callback) {
      _this.props.form.validateFields(['maxLength'], { force: true });
      callback();
    };

    _this.state = {
      loading: false,
      showPwd: true, // 是否显示密码安全策略
      showLogin: true, // 是否显示登录安全策略
      lockStatus: false, // 登录安全策略是否开启锁定
      codeStatus: false, // 登录安全策略是否开启验证码
      submitting: false,
      organizationId: _this.props.AppState.currentMenuType.id
    };
    return _this;
  }

  (0, _createClass3['default'])(PasswordPolicy, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadData();
    }

    /**
     * 显示面板
     * @param policy showPwd/showLogin
     */


    /**
     * 验证码和锁定的切换事件
     * @param status codeStatus/lockStatus
     * @param e
     */


    /**
     * inputNumber失焦事件
     * @param fieldName form控件名称
     * @param e
     */


    /**
     * 刷新函数
     */

  }, {
    key: 'loadData',


    /**
     * 加载当前组织密码策略
     */
    value: function loadData() {
      var _this2 = this;

      var organizationId = this.state.organizationId;

      this.setState({
        loading: true
      });
      _index2['default'].loadData(organizationId).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _index2['default'].setPasswordPolicy(data);
          var codeStatus = data.enableCaptcha ? 'enableCode' : 'disableCode'; // 登录安全策略是否开启验证码
          var lockStatus = data.enableLock ? 'enableLock' : 'disableLock'; // 登录安全策略是否开启锁定
          _this2.setState({
            loading: false,
            codeStatus: codeStatus,
            lockStatus: lockStatus
          });
        }
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this2.setState({
          loading: false
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          AppState = _props.AppState,
          form = _props.form,
          intl = _props.intl;
      var getFieldDecorator = form.getFieldDecorator;
      var _state = this.state,
          loading = _state.loading,
          submitting = _state.submitting,
          showPwd = _state.showPwd,
          showLogin = _state.showLogin;

      var inputHalfWidth = '236px';
      var inputWidth = '512px';
      var passwordPolicy = _index2['default'].passwordPolicy;
      var pwdStatus = passwordPolicy && passwordPolicy.enablePassword ? 'enablePwd' : 'disablePwd'; // 密码安全策略是否启用
      var sameStatus = passwordPolicy && passwordPolicy.notUsername ? 'different' : 'same'; // 密码安全策略是否允许与登录名相同
      var ableStatus = passwordPolicy && passwordPolicy.enableSecurity ? 'enabled' : 'disabled'; // 登录安全策略是否启用
      var mainContent = loading ? _react2['default'].createElement(_index4['default'], null) : _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'foldTitle' },
          _react2['default'].createElement(_button2['default'], {
            shape: 'circle',
            funcType: 'raised',
            icon: showPwd ? 'expand_more' : 'expand_less',
            size: 'small',
            style: { float: 'left' },
            onClick: this.isShowPanel.bind(this, 'showPwd')
          }),
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.password' })
        ),
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical', className: 'PwdPolicyForm' },
          _react2['default'].createElement(
            'div',
            { style: { display: showPwd ? 'block' : 'none' } },
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('enablePassword', {
                initialValue: pwdStatus
              })(_react2['default'].createElement(
                RadioGroup,
                { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.enabled.password' }), className: 'radioGroup' },
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'enablePwd' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
                ),
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'disablePwd' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
                )
              ))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('notUsername', {
                initialValue: sameStatus
              })(_react2['default'].createElement(
                RadioGroup,
                { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.notusername' }), className: 'radioGroup' },
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'same' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
                ),
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'different' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
                )
              ))
            ),
            _react2['default'].createElement(
              FormItem,
              null,
              getFieldDecorator('originalPassword', {
                rules: [{}],
                initialValue: passwordPolicy ? passwordPolicy.originalPassword : ''
              })(_react2['default'].createElement(_input2['default'], {
                autoComplete: 'off',
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.originalpassword' }),
                style: { width: inputWidth }
              }))
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-collection' },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('minLength', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }, {
                    validator: this.checkMinLength,
                    validateFirst: true
                  }],
                  initialValue: passwordPolicy && passwordPolicy.minLength ? passwordPolicy.minLength : 0
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  autoComplete: 'off',
                  onBlur: this.inputNumBlur.bind(this, 'minLength'),
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.minlength' }),
                  style: { width: inputHalfWidth }
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('maxLength', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }, {
                    validator: this.checkMaxLength,
                    validateFirst: true
                  }],
                  initialValue: passwordPolicy && passwordPolicy.maxLength ? passwordPolicy.maxLength : 0
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  autoComplete: 'off',
                  onBlur: this.inputNumBlur.bind(this, 'maxLength'),
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.maxlength' }),
                  style: { width: inputHalfWidth }
                }))
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-collection' },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('digitsCount', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }, {
                    validator: this.checkOtherLength,
                    validateFirst: true
                  }],
                  initialValue: passwordPolicy && passwordPolicy.digitsCount ? passwordPolicy.digitsCount : 0
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  onBlur: this.inputNumBlur.bind(this, 'digitsCount'),
                  autoComplete: 'off',
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.digitscount' }),
                  style: { width: inputHalfWidth }
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('lowercaseCount', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }, {
                    validator: this.checkOtherLength,
                    validateFirst: true
                  }],
                  initialValue: passwordPolicy && passwordPolicy.lowercaseCount ? passwordPolicy.lowercaseCount : 0
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  autoComplete: 'off',
                  onBlur: this.inputNumBlur.bind(this, 'lowercaseCount'),
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.lowercasecount' }),
                  style: { width: inputHalfWidth }
                }))
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-collection' },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('uppercaseCount', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }, {
                    validator: this.checkOtherLength,
                    validateFirst: true
                  }],
                  initialValue: passwordPolicy && passwordPolicy.uppercaseCount ? passwordPolicy.uppercaseCount : 0
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  autoComplete: 'off',
                  onBlur: this.inputNumBlur.bind(this, 'uppercaseCount'),
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.uppercasecount' }),
                  style: { width: inputHalfWidth }
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('specialCharCount', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }, {
                    validator: this.checkOtherLength,
                    validateFirst: true
                  }],
                  initialValue: passwordPolicy && passwordPolicy.specialCharCount ? passwordPolicy.specialCharCount : 0
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  autoComplete: 'off',
                  onBlur: this.inputNumBlur.bind(this, 'specialCharCount'),
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.specialcharcount' }),
                  style: { width: inputHalfWidth }
                }))
              )
            ),
            _react2['default'].createElement(
              FormItem,
              null,
              getFieldDecorator('notRecentCount', {
                rules: [{
                  pattern: /^([1-9]\d*|[0]{1,1})$/,
                  message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                }],
                initialValue: passwordPolicy && passwordPolicy.notRecentCount ? passwordPolicy.notRecentCount : 0
              })(_react2['default'].createElement(_inputNumber2['default'], {
                autoComplete: 'off',
                min: 0,
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.notrecentcount' }),
                style: { width: inputHalfWidth }
              }))
            ),
            _react2['default'].createElement(
              FormItem,
              { style: { width: inputWidth } },
              getFieldDecorator('regularExpression', {
                initialValue: passwordPolicy ? passwordPolicy.regularExpression : 0
              })(_react2['default'].createElement(TextArea, {
                autoComplete: 'off',
                rows: 2,
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.regularexpression' })
              }))
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'foldTitle' },
            _react2['default'].createElement(_button2['default'], {
              shape: 'circle',
              funcType: 'raised',
              icon: showLogin ? 'expand_more' : 'expand_less',
              size: 'small',
              style: { float: 'left' },
              onClick: this.isShowPanel.bind(this, 'showLogin')
            }),
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.login' })
          ),
          _react2['default'].createElement(
            'div',
            { style: { display: showLogin ? 'block' : 'none' } },
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('enableSecurity', {
                initialValue: ableStatus
              })(_react2['default'].createElement(
                RadioGroup,
                { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.enabled.security' }), className: 'radioGroup' },
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'enabled' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
                ),
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'disabled' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
                )
              ))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('enableCaptcha', {
                initialValue: this.state.codeStatus
              })(_react2['default'].createElement(
                RadioGroup,
                {
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.enabled.captcha' }),
                  className: 'radioGroup',
                  onChange: this.changeStatus.bind(this, 'codeStatus')
                },
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'enableCode' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
                ),
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'disableCode' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
                )
              ))
            ),
            this.state.codeStatus === 'enableCode' ? _react2['default'].createElement(
              FormItem,
              null,
              getFieldDecorator('maxCheckCaptcha', {
                rules: [{
                  pattern: /^([1-9]\d*|[0]{1,1})$/,
                  message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                }],
                initialValue: passwordPolicy && passwordPolicy.enableCaptcha ? passwordPolicy.maxCheckCaptcha : 3
              })(_react2['default'].createElement(_inputNumber2['default'], {
                onBlur: this.inputNumBlur.bind(this, 'maxCheckCaptcha'),
                autoComplete: 'off',
                min: 0,
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.maxerror.count' }),
                style: { width: inputWidth }
              }))
            ) : '',
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('enableLock', {
                initialValue: this.state.lockStatus
              })(_react2['default'].createElement(
                RadioGroup,
                {
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.enabled.lock' }),
                  className: 'radioGroup',
                  onChange: this.changeStatus.bind(this, 'lockStatus')
                },
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'enableLock' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
                ),
                _react2['default'].createElement(
                  _radio2['default'],
                  { value: 'disableLock' },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
                )
              ))
            ),
            this.state.lockStatus === 'enableLock' ? _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('maxErrorTime', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }],
                  initialValue: passwordPolicy && passwordPolicy.enableLock ? passwordPolicy.maxErrorTime : 5
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  onBlur: this.inputNumBlur.bind(this, 'maxErrorTime'),
                  autoComplete: 'off',
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.maxerror.count' }),
                  style: { width: inputWidth }
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('lockedExpireTime', {
                  rules: [{
                    pattern: /^([1-9]\d*|[0]{1,1})$/,
                    message: intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' })
                  }],
                  initialValue: passwordPolicy && passwordPolicy.enableLock ? passwordPolicy.lockedExpireTime : 3600
                })(_react2['default'].createElement(_inputNumber2['default'], {
                  onBlur: this.inputNumBlur.bind(this, 'lockedExpireTime'),
                  autoComplete: 'off',
                  min: 0,
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.locktime' }),
                  style: { width: '490px' }
                })),
                _react2['default'].createElement(
                  'span',
                  { style: { position: 'absolute', bottom: '-10px', right: '-20px' } },
                  intl.formatMessage({ id: 'second' })
                )
              )
            ) : ''
          )
        ),
        _react2['default'].createElement('div', { className: 'divider' }),
        _react2['default'].createElement(
          'div',
          { className: 'btnGroup' },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.password-policy.update'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                type: 'primary',
                loading: submitting,
                onClick: this.handleSubmit
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              funcType: 'raised',
              onClick: function onClick() {
                var resetFields = _this3.props.form.resetFields;

                resetFields();
              },
              disabled: submitting,
              style: { color: '#3F51B5' }
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
          )
        )
      );
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          className: 'PasswordPolicy',
          service: ['iam-service.password-policy.update', 'iam-service.password-policy.queryByOrganizationId']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: inputPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.reload,
              icon: 'refresh'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: inputPrefix,
            values: { name: AppState.currentMenuType.name }
          },
          _react2['default'].createElement(
            'div',
            { className: 'policyContainer' },
            mainContent
          )
        )
      );
    }
  }]);
  return PasswordPolicy;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = PasswordPolicy;
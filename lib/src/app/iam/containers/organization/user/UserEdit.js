'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

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

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class;

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _CreateUserStore = require('../../../stores/organization/user/CreateUserStore');

var _CreateUserStore2 = _interopRequireDefault(_CreateUserStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var intlPrefix = 'organization.user';

var inputWidth = 512; // input框的长度
var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

function noop() {}

var UserEdit = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(UserEdit, _Component);

  function UserEdit(props) {
    (0, _classCallCheck3['default'])(this, UserEdit);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (UserEdit.__proto__ || Object.getPrototypeOf(UserEdit)).call(this, props));

    _this.state = _this.getInitState();

    _this.checkUsername = function (rule, username, callback) {
      var _this$props = _this.props,
          edit = _this$props.edit,
          AppState = _this$props.AppState,
          intl = _this$props.intl;

      if (!edit || username !== _this.state.userInfo.loginName) {
        if (/\s/.test(username)) {
          callback(intl.formatMessage({ id: intlPrefix + '.name.space.msg' }));
        }
        if (username && _this.checkUsernameAndPwd()) {
          callback(intl.formatMessage({ id: intlPrefix + '.name.samepwd.msg' }));
        }

        var id = AppState.currentMenuType.id;
        _CreateUserStore2['default'].checkUsername(id, username).then(function (data) {
          if (data.failed) {
            callback(data.message);
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };

    _this.checkPassword = function (rule, value, callback) {
      var passwordPolicy = _CreateUserStore2['default'].getPasswordPolicy;
      var _this$props2 = _this.props,
          intl = _this$props2.intl,
          form = _this$props2.form;

      if (value && _this.checkUsernameAndPwd()) {
        callback(intl.formatMessage({ id: intlPrefix + '.name.samepwd.msg' }));
        return;
      }
      if (value && passwordPolicy && passwordPolicy.originalPassword !== value) {
        // const userName = this.state.userInfo.loginName;
        var userName = form.getFieldValue('loginName');
        Choerodon.checkPassword(passwordPolicy, value, callback, userName);
      } else {
        callback();
      }
    };

    _this.validateToNextPassword = function (rule, value, callback) {
      var form = _this.props.form;

      var _ref = _CreateUserStore2['default'].getPasswordPolicy || {},
          originalPassword = _ref.originalPassword;

      if (value && (_this.state.rePasswordDirty || originalPassword)) {
        form.validateFields(['rePassword'], { force: true });
      }
      callback();
    };

    _this.handleRePasswordBlur = function (e) {
      var value = e.target.value;
      _this.setState({ rePasswordDirty: _this.state.rePasswordDirty || !!value });
    };

    _this.checkRepassword = function (rule, value, callback) {
      var _this$props3 = _this.props,
          intl = _this$props3.intl,
          form = _this$props3.form;

      if (value && value !== form.getFieldValue('password')) {
        callback(intl.formatMessage({ id: intlPrefix + '.password.unrepeat.msg' }));
      } else {
        callback();
      }
    };

    _this.checkEmailAddress = function (rule, value, callback) {
      var _this$props4 = _this.props,
          edit = _this$props4.edit,
          AppState = _this$props4.AppState,
          intl = _this$props4.intl;

      if (!edit || value !== _this.state.userInfo.email) {
        var id = AppState.currentMenuType.id;
        _CreateUserStore2['default'].checkEmailAddress(id, value).then(function (_ref2) {
          var failed = _ref2.failed;

          if (failed) {
            callback(intl.formatMessage({ id: intlPrefix + '.email.used.msg' }));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.props.form.validateFieldsAndScroll(function (err, data, modify) {
        data.realName = data.realName.trim();
        if (!err) {
          var _this$props5 = _this.props,
              AppState = _this$props5.AppState,
              edit = _this$props5.edit,
              _this$props5$onSubmit = _this$props5.onSubmit,
              onSubmit = _this$props5$onSubmit === undefined ? noop : _this$props5$onSubmit,
              _this$props5$onSucces = _this$props5.onSuccess,
              onSuccess = _this$props5$onSucces === undefined ? noop : _this$props5$onSucces,
              _this$props5$onError = _this$props5.onError,
              onError = _this$props5$onError === undefined ? noop : _this$props5$onError,
              _this$props5$OnUnchan = _this$props5.OnUnchangedSuccess,
              OnUnchangedSuccess = _this$props5$OnUnchan === undefined ? noop : _this$props5$OnUnchan,
              intl = _this$props5.intl;

          var menuType = AppState.currentMenuType;
          var organizationId = menuType.id;
          onSubmit();
          if (edit) {
            if (!modify) {
              Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
              OnUnchangedSuccess();
              return;
            }
            var _this$state$userInfo = _this.state.userInfo,
                id = _this$state$userInfo.id,
                objectVersionNumber = _this$state$userInfo.objectVersionNumber;

            _CreateUserStore2['default'].updateUser(organizationId, id, (0, _extends3['default'])({}, data, {
              objectVersionNumber: objectVersionNumber,
              loginName: null
            })).then(function (_ref3) {
              var failed = _ref3.failed,
                  message = _ref3.message;

              if (failed) {
                Choerodon.prompt(message);
                onError();
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                onSuccess();
              }
            })['catch'](function (error) {
              Choerodon.handleResponseError(error);
            });
          } else {
            _CreateUserStore2['default'].createUser(data, organizationId).then(function (_ref4) {
              var failed = _ref4.failed,
                  message = _ref4.message;

              if (failed) {
                Choerodon.prompt(message);
                onError();
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                onSuccess();
              }
            })['catch'](function (error) {
              onError();
              Choerodon.handleResponseError(error);
            });
          }
        }
      });
    };

    _this.editFocusInput = _react2['default'].createRef();
    _this.createFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(UserEdit, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.props.onRef(this);
      this.fetch(this.props);
      var edit = this.props.edit;

      setTimeout(function () {
        _this2[edit ? 'editFocusInput' : 'createFocusInput'].input.focus();
      }, 10);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (!nextProps.visible) {
        nextProps.form.resetFields();
        this.setState(this.getInitState());
      } else if (!this.props.visible) {
        this.fetch(nextProps);
        var edit = nextProps.edit;

        setTimeout(function () {
          _this3[edit ? 'editFocusInput' : 'createFocusInput'].input.focus();
        }, 10);
      }
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        rePasswordDirty: false,
        userInfo: {
          id: '',
          loginName: '',
          realName: '',
          email: '',
          language: 'zh_CN',
          timeZone: 'CTT',
          objectVersionNumber: ''
        }
      };
    }
  }, {
    key: 'getUserInfoById',
    value: function getUserInfoById(organizationId, id) {
      var _this4 = this;

      _CreateUserStore2['default'].getUserInfoById(organizationId, id).then(function (data) {
        _this4.setState({
          userInfo: data
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'loadPasswordPolicyById',
    value: function loadPasswordPolicyById(id) {
      _CreateUserStore2['default'].loadPasswordPolicyById(id)['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(props) {
      var AppState = props.AppState,
          edit = props.edit,
          id = props.id;
      var organizationId = AppState.currentMenuType.id;

      if (edit) {
        this.getUserInfoById(organizationId, id);
      }
      this.loadPasswordPolicyById(organizationId);
    }
  }, {
    key: 'checkUsernameAndPwd',
    value: function checkUsernameAndPwd() {
      var getFieldValue = this.props.form.getFieldValue;

      var _ref5 = _CreateUserStore2['default'].getPasswordPolicy || {},
          enablePassword = _ref5.enablePassword,
          notUsername = _ref5.notUsername;

      var password = getFieldValue('password');
      var loginName = getFieldValue('loginName');
      if (enablePassword && notUsername && password === loginName) {
        return true;
      }
      return false;
    }

    // validateToPassword = (rule, value, callback) => {
    //   const passwordPolicy = CreateUserStore.getPasswordPolicy;
    //   if(value && passwordPolicy && passwordPolicy.not)
    // }

    // 分别验证密码的最小长度，特殊字符和大写字母的情况和密码策略进行比对

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          AppState = _props.AppState,
          edit = _props.edit,
          intl = _props.intl;

      var menuType = AppState.currentMenuType;
      var organizationName = menuType.name;
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var userInfo = this.state.userInfo;

      var _ref6 = _CreateUserStore2['default'].getPasswordPolicy || {},
          originalPassword = _ref6.originalPassword,
          enablePassword = _ref6.enablePassword;

      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'sidebar-content',
          code: edit ? intlPrefix + '.modify' : intlPrefix + '.create',
          values: { name: edit ? userInfo.loginName : organizationName }
        },
        _react2['default'].createElement(
          _form2['default'],
          { onSubmit: this.handleSubmit.bind(this), layout: 'vertical' },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('loginName', {
              rules: !edit ? [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.loginname.require.msg' })
              }, {
                validator: this.checkUsername
              }] : [],
              validateTrigger: 'onBlur',
              initialValue: userInfo.loginName,
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.loginname' }),
              disabled: edit,
              style: { width: inputWidth },
              ref: function ref(e) {
                _this5.createFocusInput = e;
              },
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('realName', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.realname.require.msg' })
              }],
              initialValue: userInfo.realName,
              validateTrigger: 'onBlur'
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.realname' }),
              type: 'text',
              rows: 1,
              style: { width: inputWidth },
              ref: function ref(e) {
                _this5.editFocusInput = e;
              },
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('email', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.email.require.msg' })
              }, {
                type: 'email',
                message: intl.formatMessage({ id: intlPrefix + '.email.pattern.msg' })
              }, {
                validator: this.checkEmailAddress
              }],
              validateTrigger: 'onBlur',
              initialValue: userInfo.email,
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.email' }),
              style: { width: inputWidth },
              maxLength: 64,
              showLengthInfo: false
            }))
          ),
          !edit && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('password', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.password.require.msg' })
              }, {
                validator: this.checkPassword
              }, {
                validator: this.validateToNextPassword
              }],
              initialValue: enablePassword && originalPassword || AppState.getSiteInfo.defaultPassword || 'abcd1234',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.password' }),
              type: 'password',
              style: { width: inputWidth },
              showPasswordEye: true
            }))
          ),
          !edit && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('rePassword', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.repassword.require.msg' })
              }, {
                validator: this.checkRepassword
              }],
              initialValue: enablePassword && originalPassword || AppState.getSiteInfo.defaultPassword || 'abcd1234',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.repassword' }),
              type: 'password',
              style: { width: inputWidth },
              onBlur: this.handleRePasswordBlur,
              showPasswordEye: true
            }))
          ),
          edit && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('language', {
              initialValue: this.state.userInfo.language
            })(_react2['default'].createElement(
              _select2['default'],
              {
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                },
                label: intl.formatMessage({ id: intlPrefix + '.language' }),
                style: { width: inputWidth }
              },
              _react2['default'].createElement(
                Option,
                { value: 'zh_CN' },
                '\u7B80\u4F53\u4E2D\u6587'
              )
            ))
          ),
          edit && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('timeZone', {
              initialValue: this.state.userInfo.timeZone
            })(_react2['default'].createElement(
              _select2['default'],
              {
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                },
                label: intl.formatMessage({ id: intlPrefix + '.timezone' }),
                style: { width: inputWidth }
              },
              _react2['default'].createElement(
                Option,
                { value: 'CTT' },
                '\u4E2D\u56FD'
              )
            ))
          )
        )
      );
    }
  }]);
  return UserEdit;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = UserEdit;
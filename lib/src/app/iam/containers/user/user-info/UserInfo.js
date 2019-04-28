'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

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

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _dec, _dec2, _class;

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/select/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _UserInfoStore = require('../../../stores/user/user-info/UserInfoStore');

var _UserInfoStore2 = _interopRequireDefault(_UserInfoStore);

var _AvatarUploader = require('./AvatarUploader');

var _AvatarUploader2 = _interopRequireDefault(_AvatarUploader);

require('./Userinfo.scss');

var _textEditToggle = require('./textEditToggle');

var _textEditToggle2 = _interopRequireDefault(_textEditToggle);

var _phoneWrapper = require('./phoneWrapper');

var _phoneWrapper2 = _interopRequireDefault(_phoneWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Text = _textEditToggle2['default'].Text,
    Edit = _textEditToggle2['default'].Edit;

var Option = _select2['default'].Option;
var intlPrefix = 'user.userinfo';

var UserInfo = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(UserInfo, _Component);

  function UserInfo(props) {
    (0, _classCallCheck3['default'])(this, UserInfo);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (UserInfo.__proto__ || Object.getPrototypeOf(UserInfo)).call(this, props));

    _this.state = {
      submitting: false,
      visible: false,
      phoneZone: _UserInfoStore2['default'].getUserInfo.internationalTelCode ? _UserInfoStore2['default'].getUserInfo.internationalTelCode.split('+')[1] : undefined,
      phone: _UserInfoStore2['default'].getUserInfo.phone
    };

    _this.loadUserInfo = function () {
      _UserInfoStore2['default'].setUserInfo(_this.props.AppState.getUserInfo);
    };

    _this.checkEmailAddress = function (rule, value, callback) {
      var _this$props = _this.props,
          edit = _this$props.edit,
          intl = _this$props.intl;

      if (!edit || value !== _this.state.userInfo.email) {
        _UserInfoStore2['default'].checkEmailAddress(value).then(function (_ref) {
          var failed = _ref.failed;

          if (failed) {
            callback(intl.formatMessage({ id: intlPrefix + '.email.used.msg' }));
          } else {
            callback();
          }
        })['catch'](Choerodon.handleResponseError);
      } else {
        callback();
      }
    };

    _this.openAvatorUploader = function () {
      _this.setState({
        visible: true
      });
    };

    _this.handleVisibleChange = function (visible) {
      _this.setState({ visible: visible });
    };

    _this.handleSubmitPhone = function (value) {
      var originUser = _UserInfoStore2['default'].getUserInfo;
      var user = (0, _extends4['default'])({}, originUser, value, {
        imageUrl: _UserInfoStore2['default'].getAvatar
      });
      user.internationalTelCode = user.internationalTelCode ? '+' + value.internationalTelCode : '';
      user.phone = user.phone || '';
      _this.submitForm(user);
    };

    _this.handleSubmit = function (formKey, value) {
      var _extends2;

      var originUser = _UserInfoStore2['default'].getUserInfo;
      _this.setState({
        submitting: true
      });
      var user = (0, _extends4['default'])({}, originUser, (_extends2 = {}, (0, _defineProperty3['default'])(_extends2, formKey, value), (0, _defineProperty3['default'])(_extends2, 'imageUrl', _UserInfoStore2['default'].getAvatar), _extends2));
      _this.submitForm(user);
    };

    _this.submitForm = function (user) {
      var _this$props2 = _this.props,
          AppState = _this$props2.AppState,
          intl = _this$props2.intl;

      user.loginName = null;
      _UserInfoStore2['default'].updateUserInfo(user).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.props.form.resetFields();
          _UserInfoStore2['default'].setUserInfo(data);
          Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          _this.setState({ submitting: false });
          AppState.setUserInfo(data);
        }
      })['catch'](function () {
        Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
        _this.setState({ submitting: false });
      });
    };

    _this.editFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(UserInfo, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadUserInfo();
    }
  }, {
    key: 'getLanguageOptions',
    value: function getLanguageOptions() {
      var language = void 0;
      if (language) {
        return language.content.map(function (_ref2) {
          var code = _ref2.code,
              name = _ref2.name;
          return _react2['default'].createElement(
            Option,
            { key: code, value: code },
            name
          );
        });
      } else {
        return [_react2['default'].createElement(
          Option,
          { key: 'zh_CN', value: 'zh_CN' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.language.zhcn' })
        )];
      }
    }
  }, {
    key: 'getTimeZoneOptions',
    value: function getTimeZoneOptions() {
      var timeZone = [];
      if (timeZone.length > 0) {
        return timeZone.map(function (_ref3) {
          var code = _ref3.code,
              description = _ref3.description;
          return _react2['default'].createElement(
            Option,
            { key: code, value: code },
            description
          );
        });
      } else {
        return [_react2['default'].createElement(
          Option,
          { key: 'CTT', value: 'CTT' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.timezone.ctt' })
        )];
      }
    }
  }, {
    key: 'getAvatar',
    value: function getAvatar(_ref4) {
      var id = _ref4.id,
          realName = _ref4.realName;
      var visible = this.state.visible;

      var avatar = _UserInfoStore2['default'].getAvatar;
      return _react2['default'].createElement(
        'div',
        { className: 'user-info-avatar-wrap' },
        _react2['default'].createElement(
          'div',
          {
            className: 'user-info-avatar',
            style: avatar && {
              backgroundImage: 'url(' + Choerodon.fileServer(avatar) + ')'
            }
          },
          !avatar && realName && realName.charAt(0),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.user.uploadPhoto'],
              type: 'site'
            },
            _react2['default'].createElement(
              _button2['default'],
              { className: 'user-info-avatar-button', onClick: this.openAvatorUploader },
              _react2['default'].createElement(
                'div',
                { className: 'user-info-avatar-button-icon' },
                _react2['default'].createElement(_icon2['default'], { type: 'photo_camera' })
              )
            ),
            _react2['default'].createElement(_AvatarUploader2['default'], { id: id, visible: visible, onVisibleChange: this.handleVisibleChange })
          )
        )
      );
    }
  }, {
    key: 'renderForm',
    value: function renderForm(user) {
      var _this2 = this;

      var intl = this.props.intl;
      var loginName = user.loginName,
          realName = user.realName,
          email = user.email,
          language = user.language,
          timeZone = user.timeZone,
          phone = user.phone,
          ldap = user.ldap,
          organizationName = user.organizationName,
          organizationCode = user.organizationCode,
          internationalTelCode = user.internationalTelCode;

      return _react2['default'].createElement(
        _form2['default'],
        { layout: 'vertical', className: 'user-info' },
        _react2['default'].createElement(
          'div',
          { className: 'user-info-top-container' },
          _react2['default'].createElement(
            'div',
            { className: 'user-info-avatar-wrap-container' },
            this.getAvatar(user)
          ),
          _react2['default'].createElement(
            'div',
            { className: 'user-info-login-info' },
            _react2['default'].createElement(
              'div',
              null,
              loginName
            ),
            _react2['default'].createElement(
              'div',
              null,
              intl.formatMessage({ id: intlPrefix + '.source' }),
              ':',
              ldap ? intl.formatMessage({ id: intlPrefix + '.ldap' }) : intl.formatMessage({ id: intlPrefix + '.notldap' })
            ),
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                'span',
                null,
                intl.formatMessage({ id: intlPrefix + '.name' }),
                '\uFF1A'
              ),
              _react2['default'].createElement(
                _textEditToggle2['default'],
                {
                  formKey: 'realName',
                  formStyle: { width: '80px' },
                  originData: realName,
                  className: 'user-info-info-container-account-content-realName',
                  onSubmit: function onSubmit(value) {
                    return _this2.handleSubmit('realName', value);
                  },
                  validate: {
                    validateFirst: true
                  },
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
                  }]
                },
                _react2['default'].createElement(
                  Text,
                  { style: { fontSize: '13px' } },
                  _react2['default'].createElement(
                    'span',
                    null,
                    realName
                  )
                ),
                _react2['default'].createElement(
                  Edit,
                  null,
                  _react2['default'].createElement(_input2['default'], { autoComplete: 'off' })
                )
              )
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'user-info-info-container' },
          _react2['default'].createElement(
            'div',
            { className: 'user-info-info-container-account' },
            _react2['default'].createElement(
              'div',
              null,
              intl.formatMessage({ id: intlPrefix + '.account.info' })
            ),
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_icon2['default'], { type: 'markunread', className: 'form-icon' }),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-title' },
                  intl.formatMessage({ id: intlPrefix + '.email' }),
                  ':'
                ),
                _react2['default'].createElement(
                  _textEditToggle2['default'],
                  {
                    formStyle: { width: '289px' },
                    formKey: 'email',
                    originData: email,
                    className: 'user-info-info-container-account-content',
                    onSubmit: function onSubmit(value) {
                      return _this2.handleSubmit('email', value);
                    },
                    validate: {
                      validateTrigger: 'onBlur',
                      validateFirst: true
                    },
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage({ id: intlPrefix + '.email.require.msg' })
                    }, {
                      type: 'email',
                      message: intl.formatMessage({ id: intlPrefix + '.email.pattern.msg' })
                    }, {
                      validator: this.checkEmailAddress
                    }]

                  },
                  _react2['default'].createElement(
                    Text,
                    null,
                    _react2['default'].createElement(
                      'span',
                      { style: { width: '300px' } },
                      email
                    )
                  ),
                  _react2['default'].createElement(
                    Edit,
                    null,
                    _react2['default'].createElement(_input2['default'], { autoComplete: 'off' })
                  )
                )
              ),
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_icon2['default'], { type: 'phone_iphone', className: 'form-icon' }),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-title' },
                  intl.formatMessage({ id: intlPrefix + '.phone' }),
                  ':'
                ),
                _react2['default'].createElement(_phoneWrapper2['default'], {
                  initialPhone: phone,
                  initialCode: internationalTelCode,
                  onSubmit: function onSubmit(value) {
                    return _this2.handleSubmitPhone(value);
                  }
                })
              ),
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_icon2['default'], { type: 'language', className: 'form-icon' }),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-title' },
                  intl.formatMessage({ id: intlPrefix + '.language' }),
                  ':'
                ),
                _react2['default'].createElement(
                  _textEditToggle2['default'],
                  {
                    formKey: 'language',
                    originData: language,
                    className: 'user-info-info-container-account-content user-info-info-container-account-content-short',
                    formStyle: { width: '80px' }
                  },
                  _react2['default'].createElement(
                    Text,
                    null,
                    _react2['default'].createElement(
                      'span',
                      null,
                      '简体中文'
                    )
                  ),
                  _react2['default'].createElement(
                    Edit,
                    null,
                    _react2['default'].createElement(
                      _select2['default'],
                      {
                        getPopupContainer: function getPopupContainer() {
                          return document.getElementsByClassName('page-content')[0];
                        }
                      },
                      this.getLanguageOptions()
                    ),
                    ','
                  )
                )
              ),
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_icon2['default'], { type: 'location_city', className: 'form-icon' }),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-title' },
                  intl.formatMessage({ id: intlPrefix + '.timezone' }),
                  ':'
                ),
                _react2['default'].createElement(
                  _textEditToggle2['default'],
                  {
                    formKey: 'timeZone',
                    originData: timeZone || 'CTT',
                    className: 'user-info-info-container-account-content user-info-info-container-account-content-short',
                    formStyle: { width: '80px' }
                  },
                  _react2['default'].createElement(
                    Text,
                    null,
                    _react2['default'].createElement(
                      'span',
                      null,
                      '中国'
                    )
                  ),
                  _react2['default'].createElement(
                    Edit,
                    null,
                    _react2['default'].createElement(
                      _select2['default'],
                      {
                        getPopupContainer: function getPopupContainer() {
                          return document.getElementsByClassName('page-content')[0];
                        }
                      },
                      this.getTimeZoneOptions()
                    ),
                    ','
                  )
                )
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'user-info-info-container-account' },
            _react2['default'].createElement(
              'div',
              null,
              intl.formatMessage({ id: intlPrefix + '.orginfo' })
            ),
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_icon2['default'], { type: 'domain', className: 'form-icon' }),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-title' },
                  intl.formatMessage({ id: intlPrefix + '.org.name' }),
                  ':'
                ),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-content' },
                  organizationName
                )
              ),
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_icon2['default'], { type: 'copyright', className: 'form-icon' }),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-title' },
                  intl.formatMessage({ id: intlPrefix + '.org.code' }),
                  ':'
                ),
                _react2['default'].createElement(
                  'span',
                  { className: 'user-info-info-container-account-content' },
                  organizationCode
                )
              )
            )
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var user = _UserInfoStore2['default'].getUserInfo;
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.user.query', 'iam-service.user.check', 'iam-service.user.querySelf', 'iam-service.user.queryInfo', 'iam-service.user.updateInfo', 'iam-service.user.uploadPhoto', 'iam-service.user.queryProjects']
        },
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
        }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          { className: 'user-info-container' },
          this.renderForm(user)
        )
      );
    }
  }]);
  return UserInfo;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = UserInfo;
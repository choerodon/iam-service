'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _inputNumber = require('choerodon-ui/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class;

require('choerodon-ui/lib/input-number/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

require('./SystemSetting.scss');

require('../../../common/ConfirmModal.scss');

var _LogoUploader = require('./LogoUploader');

var _LogoUploader2 = _interopRequireDefault(_LogoUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import AvatarUploader from '../../../components/AvatarUploader';

var intlPrefix = 'global.system-setting';
var prefixClas = 'c7n-iam-system-setting';
var inputPrefix = 'organization.pwdpolicy';
var limitSize = 1024;
var FormItem = _form2['default'].Item;
var RadioGroup = _radio2['default'].Group;
var Option = _select2['default'].Option;
var confirm = _modal2['default'].confirm;
var TextArea = _input2['default'].TextArea;

var dirty = false;
var cardContentFavicon = _react2['default'].createElement(
  'div',
  null,
  _react2['default'].createElement(
    'p',
    null,
    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.favicon.tips' })
  ),
  _react2['default'].createElement('div', { className: prefixClas + '-tips-favicon' })
);
var cardContentLogo = _react2['default'].createElement(
  'div',
  null,
  _react2['default'].createElement(
    'p',
    null,
    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.logo.tips' })
  ),
  _react2['default'].createElement('div', { className: prefixClas + '-tips-logo' })
);
var cardContentTitle = _react2['default'].createElement(
  'div',
  null,
  _react2['default'].createElement(
    'p',
    null,
    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.title.tips' })
  ),
  _react2['default'].createElement('div', { className: prefixClas + '-tips-title' })
);
var cardContentName = _react2['default'].createElement(
  'div',
  null,
  _react2['default'].createElement(
    'p',
    null,
    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name.tips' })
  ),
  _react2['default'].createElement('div', { className: prefixClas + '-tips-name' })
);
var cardTitle = _react2['default'].createElement(
  _popover2['default'],
  { content: cardContentTitle, getPopupContainer: function getPopupContainer() {
      return document.getElementsByClassName('page-content')[0];
    } },
  _react2['default'].createElement(_icon2['default'], { type: 'help', style: { fontSize: 16, color: '#bdbdbd' } })
);
var cardName = _react2['default'].createElement(
  _popover2['default'],
  { content: cardContentName, getPopupContainer: function getPopupContainer() {
      return document.getElementsByClassName('page-content')[0];
    } },
  _react2['default'].createElement(_icon2['default'], { type: 'help', style: { fontSize: 16, color: '#bdbdbd' } })
);

var SystemSetting = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(SystemSetting, _Component);

  function SystemSetting() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, SystemSetting);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = SystemSetting.__proto__ || Object.getPrototypeOf(SystemSetting)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loading: false,
      submitting: false,
      visible: false,
      uploadLogoVisible: false
    }, _this.init = function () {
      var SystemSettingStore = _this.props.SystemSettingStore;

      _this.props.form.resetFields();
      _choerodonBootCombine.axios.get('/iam/v1/system/setting').then(function (data) {
        SystemSettingStore.setUserSetting(data);
        SystemSettingStore.setFavicon(data.favicon);
        SystemSettingStore.setLogo(data.systemLogo);
      });
    }, _this.handleReset = function () {
      var _this$props = _this.props,
          SystemSettingStore = _this$props.SystemSettingStore,
          intl = _this$props.intl;

      SystemSettingStore.resetUserSetting().then(function () {
        window.location.reload(true);
      });
    }, _this.showDeleteConfirm = function () {
      var that = _this;
      var intl = _this.props.intl;

      confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.reset.confirm.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.reset.confirm.content' }),
        okText: intl.formatMessage({ id: 'yes' }),
        okType: 'danger',
        cancelText: intl.formatMessage({ id: 'no' }),
        onOk: function onOk() {
          that.handleReset();
        },
        onCancel: function onCancel() {}
      });
    }, _this.handleVisibleChange = function () {
      var visible = _this.state.visible;

      _this.setState({
        visible: !visible
      });
    }, _this.handleUploadLogoVisibleChange = function () {
      var uploadLogoVisible = _this.state.uploadLogoVisible;

      _this.setState({
        uploadLogoVisible: !uploadLogoVisible
      });
    }, _this.checkMaxLength = function (rule, value, callback) {
      var getFieldValue = _this.props.form.getFieldValue;
      var intl = _this.props.intl;

      var minPasswordLength = getFieldValue('minPasswordLength');
      if (value < 0) {
        callback(intl.formatMessage({ id: inputPrefix + '.max.length' }));
      } else if (value < minPasswordLength) {
        callback('最大密码长度须大于或等于最小密码长度');
      }
      _this.props.form.validateFields(['minPasswordLength'], { force: true });
      callback();
    }, _this.checkMinLength = function (rule, value, callback) {
      var intl = _this.props.intl;
      var getFieldValue = _this.props.form.getFieldValue;

      var maxPasswordLength = getFieldValue('maxPasswordLength');
      if (value < 0) callback(intl.formatMessage({ id: inputPrefix + '.number.pattern.msg' }));else if (value > maxPasswordLength) callback(intl.formatMessage({ id: inputPrefix + '.min.lessthan.more' }));
      callback();
    }, _this.beforeUpload = function (file) {
      var intl = _this.props.intl;

      var isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.file.size.limit' }, { size: limitSize / 1024 + 'M' }));
      }
      return isLt1M;
    }, _this.handleFaviconChange = function (_ref2) {
      var file = _ref2.file;
      var status = file.status,
          response = file.response;
      var SystemSettingStore = _this.props.SystemSettingStore;

      if (status === 'done') {
        SystemSettingStore.setFavicon(response);
      } else if (status === 'error') {
        Choerodon.prompt('' + response.message);
      }
    }, _this.handleLogoChange = function (_ref3) {
      var file = _ref3.file;
      var status = file.status,
          response = file.response;
      var SystemSettingStore = _this.props.SystemSettingStore;

      if (status === 'uploading') {
        _this.setState({
          loading: true
        });
      } else if (status === 'done') {
        SystemSettingStore.setLogo(response);
        _this.setState({
          loading: false
        });
      } else if (status === 'error') {
        Choerodon.prompt('' + response.message);
        _this.setState({
          loading: false
        });
      }
    }, _this.getByteLen = function (val) {
      var len = 0;
      val = val.split('');
      val.forEach(function (v) {
        if (v.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        } else {
          len += 1;
        }
      });
      return len;
    }, _this.validateToInputName = function (rule, value, callback) {
      if (_this.getByteLen(value) > 18) {
        callback('简称需要小于 9 个汉字或 18 个英文字母');
      } else {
        callback();
      }
    }, _this.validateToPassword = function (rule, value, callback) {
      if (!/^[a-zA-Z0-9]{6,15}$/.test(value)) {
        callback('密码至少为6位数字或字母组成');
      } else {
        callback();
      }
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props2 = _this.props,
          SystemSettingStore = _this$props2.SystemSettingStore,
          intl = _this$props2.intl;

      _this.setState({
        submitting: true
      });
      _this.props.form.validateFieldsAndScroll(function (err, values) {
        if (err) {
          _this.setState({
            submitting: false
          });
          return;
        }
        var prevSetting = SystemSettingStore.getUserSetting;
        prevSetting = (0, _extends3['default'])({}, prevSetting);
        var submitSetting = (0, _extends3['default'])({}, values, {
          favicon: SystemSettingStore.getFavicon,
          systemLogo: SystemSettingStore.getLogo
        });
        var defaultLanguage = submitSetting.defaultLanguage,
            defaultPassword = submitSetting.defaultPassword,
            systemName = submitSetting.systemName,
            systemTitle = submitSetting.systemTitle,
            favicon = submitSetting.favicon,
            systemLogo = submitSetting.systemLogo,
            registerEnabled = submitSetting.registerEnabled,
            registerUrl = submitSetting.registerUrl;

        submitSetting.objectVersionNumber = prevSetting.objectVersionNumber;
        if (Object.keys(prevSetting).length) {
          if (_this.dirty || Object.keys(prevSetting).some(function (v) {
            return prevSetting[v] !== submitSetting[v];
          })) {
            SystemSettingStore.putUserSetting(submitSetting).then(function (data) {
              if (!data.failed) {
                window.location.reload(true);
              } else {
                _this.setState({
                  submitting: false
                });
              }
            })['catch'](function (error) {
              _this.setState({
                submitting: false
              });
            });
          } else {
            Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.save.conflict' }));
            _this.setState({
              submitting: false
            });
          }
        } else if (!_this.dirty && defaultLanguage === 'zh_CN' && systemName === 'Choerodon' && systemTitle === 'Choerodon | 企业数字化服务平台' && defaultPassword === 'abcd1234' && !favicon && !systemLogo && !registerEnabled && !registerUrl) {
          Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.save.conflict' }));
          _this.setState({
            submitting: false
          });
        } else {
          SystemSettingStore.postUserSetting(submitSetting).then(function (data) {
            if (!data.failed) {
              window.location.reload(true);
            } else {
              _this.setState({
                submitting: false
              });
            }
          })['catch'](function (error) {
            _this.setState({
              submitting: false
            });
          });
        }
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(SystemSetting, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.init();
    }
  }, {
    key: 'faviconContainer',
    value: function faviconContainer() {
      var _this2 = this;

      var SystemSettingStore = this.props.SystemSettingStore;
      var visible = this.state.visible;

      var favicon = SystemSettingStore.getFavicon;
      return _react2['default'].createElement(
        'div',
        { className: prefixClas + '-avatar-wrap' },
        _react2['default'].createElement(
          'div',
          { className: prefixClas + '-avatar', style: favicon ? { backgroundImage: 'url(' + favicon + ')' } : {} },
          _react2['default'].createElement(
            _button2['default'],
            { className: prefixClas + '-avatar-button', onClick: function onClick() {
                return _this2.setState({ visible: true });
              } },
            _react2['default'].createElement(
              'div',
              { className: prefixClas + '-avatar-button-icon' },
              _react2['default'].createElement(_icon2['default'], { type: 'photo_camera', style: { display: 'block', textAlign: 'center' } })
            )
          ),
          _react2['default'].createElement(_LogoUploader2['default'], { type: 'favicon', visible: visible, onVisibleChange: this.handleVisibleChange, onSave: function onSave(res) {
              SystemSettingStore.setFavicon(res);
            } })
        ),
        _react2['default'].createElement(
          'span',
          { className: prefixClas + '-tips' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.favicon' }),
          _react2['default'].createElement(
            _popover2['default'],
            { content: cardContentFavicon, getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('page-content')[0];
              } },
            _react2['default'].createElement(_icon2['default'], { type: 'help', style: { fontSize: 16, color: '#bdbdbd' } })
          )
        )
      );
    }
  }, {
    key: 'getLanguageOptions',
    value: function getLanguageOptions() {
      return [_react2['default'].createElement(
        Option,
        { key: 'zh_CN', value: 'zh_CN' },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.language.zhcn' })
      ), _react2['default'].createElement(
        Option,
        { disabled: true, key: 'en_US', value: 'en_US' },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.language.enus' })
      )];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          SystemSettingStore = _props.SystemSettingStore,
          intl = _props.intl,
          AppState = _props.AppState;
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var _state = this.state,
          logoLoadingStatus = _state.logoLoadingStatus,
          submitting = _state.submitting,
          uploadLogoVisible = _state.uploadLogoVisible;
      var _SystemSettingStore$g = SystemSettingStore.getUserSetting,
          _SystemSettingStore$g2 = _SystemSettingStore$g.defaultLanguage,
          defaultLanguage = _SystemSettingStore$g2 === undefined ? 'zh_CN' : _SystemSettingStore$g2,
          _SystemSettingStore$g3 = _SystemSettingStore$g.defaultPassword,
          defaultPassword = _SystemSettingStore$g3 === undefined ? 'abcd1234' : _SystemSettingStore$g3,
          _SystemSettingStore$g4 = _SystemSettingStore$g.systemName,
          systemName = _SystemSettingStore$g4 === undefined ? 'Choerodon' : _SystemSettingStore$g4,
          systemTitle = _SystemSettingStore$g.systemTitle,
          maxPasswordLength = _SystemSettingStore$g.maxPasswordLength,
          minPasswordLength = _SystemSettingStore$g.minPasswordLength,
          _SystemSettingStore$g5 = _SystemSettingStore$g.registerEnabled,
          registerEnabled = _SystemSettingStore$g5 === undefined ? false : _SystemSettingStore$g5,
          registerUrl = _SystemSettingStore$g.registerUrl;

      var systemLogo = SystemSettingStore.getLogo;
      var formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      };
      var inputHalfWidth = '236px';
      var uploadButton = _react2['default'].createElement(
        'div',
        { onClick: this.handleUploadLogoVisibleChange },
        logoLoadingStatus ? _react2['default'].createElement(_spin2['default'], null) : _react2['default'].createElement('div', { className: 'initLogo' })
      );

      var mainContent = _react2['default'].createElement(
        _form2['default'],
        { onSubmit: this.handleSubmit, layout: 'vertical', className: prefixClas },
        _react2['default'].createElement(
          FormItem,
          null,
          this.faviconContainer()
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          _react2['default'].createElement(_input2['default'], { style: { display: 'none' } }),
          getFieldDecorator('systemName', {
            initialValue: systemName,
            rules: [{
              required: true,
              message: intl.formatMessage({ id: intlPrefix + '.systemName.error' })
            }, {
              validator: this.validateToInputName
            }]
          })(_react2['default'].createElement(_input2['default'], {
            autoComplete: 'new-password',
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.systemName' }),
            ref: function ref(e) {
              _this3.editFocusInput = e;
            },
            maxLength: 18,
            showLengthInfo: false,
            suffix: cardTitle
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          _react2['default'].createElement(
            'span',
            { className: prefixClas + '-tips' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.systemLogo' }),
            _react2['default'].createElement(
              _popover2['default'],
              { content: cardContentLogo, getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('page-content')[0];
                } },
              _react2['default'].createElement(_icon2['default'], { type: 'help', style: { fontSize: 16, color: '#bdbdbd' } })
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'ant-upload ant-upload-select ant-upload-select-picture-card' },
            _react2['default'].createElement(_LogoUploader2['default'], { type: 'logo', visible: uploadLogoVisible, onVisibleChange: this.handleUploadLogoVisibleChange, onSave: function onSave(res) {
                SystemSettingStore.setLogo(res);
              } }),
            systemLogo ? _react2['default'].createElement(
              'div',
              { className: 'ant-upload', onClick: this.handleUploadLogoVisibleChange },
              _react2['default'].createElement('img', { src: systemLogo, alt: '', style: { width: '80px', height: '80px' } })
            ) : uploadButton
          )
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          _react2['default'].createElement(_input2['default'], { style: { display: 'none' } }),
          getFieldDecorator('systemTitle', {
            initialValue: systemTitle || AppState.getSiteInfo.defaultTitle
          })(_react2['default'].createElement(_input2['default'], {
            autoComplete: 'new-password',
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.systemTitle' }),
            ref: function ref(e) {
              _this3.editFocusInput = e;
            },
            maxLength: 32,
            showLengthInfo: true,
            suffix: cardName
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          _react2['default'].createElement(_input2['default'], { style: { display: 'none' } }),
          getFieldDecorator('defaultPassword', {
            initialValue: defaultPassword,
            rules: [{
              required: true,
              message: intl.formatMessage({ id: intlPrefix + '.defaultPassword.error' })
            }, {
              validator: this.validateToPassword
            }]
          })(_react2['default'].createElement(_input2['default'], {
            autoComplete: 'new-password',
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.defaultPassword' }),
            maxLength: 15,
            type: 'password',
            showPasswordEye: true
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          (0, _extends3['default'])({}, formItemLayout, {
            style: { display: 'inline-block' }
          }),
          getFieldDecorator('minPasswordLength', {
            rules: [{
              validator: this.checkMinLength,
              validateFirst: true
            }],
            initialValue: minPasswordLength
          })(_react2['default'].createElement(_inputNumber2['default'], {
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.min-length' }),
            style: { width: inputHalfWidth },
            max: 65535,
            min: 0,
            onChange: function onChange() {
              _this3.dirty = true;
            }
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          (0, _extends3['default'])({}, formItemLayout, {
            style: { display: 'inline-block', marginLeft: 40 }
          }),
          getFieldDecorator('maxPasswordLength', {
            rules: [{
              validator: this.checkMaxLength,
              validateFirst: true
            }],
            initialValue: maxPasswordLength
          })(_react2['default'].createElement(_inputNumber2['default'], {
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.max-length' }),
            style: { width: inputHalfWidth },
            max: 65535,
            min: 0,
            onChange: function onChange() {
              _this3.dirty = true;
            }
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('defaultLanguage', {
            initialValue: defaultLanguage,
            rules: [{
              required: true,
              message: intl.formatMessage({ id: intlPrefix + '.defaultLanguage.error' })
            }]
          })(_react2['default'].createElement(
            _select2['default'],
            { getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('page-content')[0];
              }, label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.defaultLanguage' }) },
            this.getLanguageOptions()
          ))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('registerEnabled', {
            initialValue: registerEnabled
          })(_react2['default'].createElement(
            RadioGroup,
            { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.registerEnabled' }), className: 'radioGroup' },
            _react2['default'].createElement(
              _radio2['default'],
              { value: true },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'yes' })
            ),
            _react2['default'].createElement(
              _radio2['default'],
              { value: false },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'no' })
            )
          ))
        ),
        this.props.form.getFieldValue('registerEnabled') && _react2['default'].createElement(
          FormItem,
          formItemLayout,
          _react2['default'].createElement(_input2['default'], { style: { display: 'none' } }),
          getFieldDecorator('registerUrl', {
            initialValue: registerUrl,
            rules: [{
              required: true,
              message: intl.formatMessage({ id: intlPrefix + '.registerUrl.error' })
            }]
          })(_react2['default'].createElement(TextArea, {
            autoComplete: 'new-password',
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.registerUrl' }),
            ref: function ref(e) {
              _this3.editFocusInput = e;
            },
            autosize: { minRows: 2, maxRows: 6 }
          }))
        ),
        _react2['default'].createElement('div', { className: prefixClas + '-divider' }),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _button2['default'],
            {
              htmlType: 'submit',
              funcType: 'raised',
              type: 'primary',
              loading: submitting
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              funcType: 'raised',
              onClick: this.init,
              style: { marginLeft: 16 },
              disabled: submitting
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
          )
        )
      );

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.system-setting.uploadFavicon', 'iam-service.system-setting.uploadLogo', 'iam-service.system-setting.addSetting', 'iam-service.system-setting.updateSetting', 'iam-service.system-setting.resetSetting', 'iam-service.system-setting.getSetting']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header' }) },
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.init,
              icon: 'refresh'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.showDeleteConfirm,
              icon: 'swap_horiz'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'reset' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          { code: intlPrefix },
          mainContent
        )
      );
    }
  }]);
  return SystemSetting;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = SystemSetting;
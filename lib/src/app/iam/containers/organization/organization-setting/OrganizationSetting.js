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

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./OrganizationSetting.scss');

var _OrganizationSettingStore = require('../../../stores/organization/organization-setting/OrganizationSettingStore');

var _OrganizationSettingStore2 = _interopRequireDefault(_OrganizationSettingStore);

require('../../../common/ConfirmModal.scss');

var _avatarUploader = require('../../../components/avatarUploader');

var _avatarUploader2 = _interopRequireDefault(_avatarUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var HeaderStore = _choerodonBootCombine.stores.HeaderStore;

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var intlPrefix = 'organization.info';
var ORGANIZATION_TYPE = 'organization';
var PROJECT_TYPE = 'project';

var OrganizationSetting = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(OrganizationSetting, _Component);

  function OrganizationSetting() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, OrganizationSetting);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = OrganizationSetting.__proto__ || Object.getPrototypeOf(OrganizationSetting)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      submitting: false,
      isShowAvatar: false
    }, _this.loadOrganization = function () {
      var AppState = _this.props.AppState;

      var id = AppState.currentMenuType.id;
      _OrganizationSettingStore2['default'].axiosGetOrganizationInfo(id).then(function (data) {
        _OrganizationSettingStore2['default'].setImageUrl(data.imageUrl);
        _OrganizationSettingStore2['default'].setOrganizationInfo(data);
      })['catch'](Choerodon.handleResponseError);
    }, _this.cancelValue = function () {
      var resetFields = _this.props.form.resetFields;
      var imageUrl = _OrganizationSettingStore2['default'].getOrganizationInfo.imageUrl;

      _OrganizationSettingStore2['default'].setImageUrl(imageUrl);
      resetFields();
    }, _this.openAvatarUploader = function () {
      _this.setState({
        isShowAvatar: true
      });
    }, _this.closeAvatarUploader = function (visible) {
      _this.setState({
        isShowAvatar: visible
      });
    }, _this.handleUploadOk = function (res) {
      _OrganizationSettingStore2['default'].setImageUrl(res);
      _this.setState({
        // imgUrl: res,
        isShowAvatar: false
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(OrganizationSetting, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadOrganization();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _OrganizationSettingStore2['default'].setOrganizationInfo({});
      _OrganizationSettingStore2['default'].setImageUrl(null);
    }
  }, {
    key: 'handleSave',
    value: function handleSave(e) {
      var _this2 = this;

      e.preventDefault();
      var form = this.props.form;

      form.validateFields(function (err, value, modify) {
        if (!err) {
          if (_OrganizationSettingStore2['default'].getOrganizationInfo.imageUrl !== _OrganizationSettingStore2['default'].getImageUrl) modify = true;
          if (!modify) {
            Choerodon.prompt(_this2.props.intl.formatMessage({ id: 'save.success' }));
            return;
          }
          var _OrganizationSettingS = _OrganizationSettingStore2['default'].getOrganizationInfo,
              id = _OrganizationSettingS.id,
              objectVersionNumber = _OrganizationSettingS.objectVersionNumber;

          var body = (0, _extends3['default'])({
            id: id,
            objectVersionNumber: objectVersionNumber
          }, value, {
            imageUrl: _OrganizationSettingStore2['default'].getImageUrl
          });
          _this2.setState({ submitting: true });
          _OrganizationSettingStore2['default'].axiosSaveProjectInfo(body).then(function (data) {
            _this2.setState({ submitting: false });
            Choerodon.prompt(_this2.props.intl.formatMessage({ id: 'save.success' }));
            _OrganizationSettingStore2['default'].setImageUrl(data.imageUrl);
            _OrganizationSettingStore2['default'].setOrganizationInfo(data);
            HeaderStore.updateOrg(data);
          })['catch'](function (error) {
            _this2.setState({ submitting: false });
            Choerodon.handleResponseError(error);
          });
        }
      });
    }
  }, {
    key: 'getAvatar',
    value: function getAvatar() {
      var isShowAvatar = this.state.isShowAvatar;
      var name = _OrganizationSettingStore2['default'].getOrganizationInfo.name;

      var imageUrl = _OrganizationSettingStore2['default'].getImageUrl;
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-organizationsetting-avatar' },
        _react2['default'].createElement(
          'div',
          {
            className: 'c7n-iam-organizationsetting-avatar-wrap',
            style: {
              backgroundColor: '#c5cbe8',
              backgroundImage: imageUrl ? 'url(' + Choerodon.fileServer(imageUrl) + ')' : ''
            }
          },
          !imageUrl && name && name.charAt(0),
          _react2['default'].createElement(
            _button2['default'],
            { className: (0, _classnames2['default'])('c7n-iam-organizationsetting-avatar-button', 'c7n-iam-organizationsetting-avatar-button-edit'), onClick: this.openAvatarUploader },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-organizationsetting-avatar-button-icon' },
              _react2['default'].createElement(_icon2['default'], { type: 'photo_camera' })
            )
          ),
          _react2['default'].createElement(_avatarUploader2['default'], { visible: isShowAvatar, intlPrefix: 'organization.project.avatar.edit', onVisibleChange: this.closeAvatarUploader, onUploadOk: this.handleUploadOk })
        )
      );
    }

    /**
     * 打开上传图片模态框
     */


    /**
     * 关闭上传图片模态框
     * @param visible 模态框是否可见
     */

  }, {
    key: 'render',
    value: function render() {
      var submitting = this.state.submitting;
      var intl = this.props.intl;
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var _OrganizationSettingS2 = _OrganizationSettingStore2['default'].getOrganizationInfo,
          enabled = _OrganizationSettingS2.enabled,
          name = _OrganizationSettingS2.name,
          code = _OrganizationSettingS2.code,
          address = _OrganizationSettingS2.address,
          ownerRealName = _OrganizationSettingS2.ownerRealName;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.organization.queryOrgLevel']
        },
        _react2['default'].createElement(_choerodonBootCombine.Header, { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: enabled ? intlPrefix : intlPrefix + '.disabled',
            values: { name: enabled ? name : code }
          },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-organizationsetting' },
            _react2['default'].createElement(
              _form2['default'],
              { onSubmit: this.handleSave.bind(this) },
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: intlPrefix + '.namerequiredmsg' })
                  }, {
                    /* eslint-disable-next-line */
                    pattern: /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/,
                    message: intl.formatMessage({ id: intlPrefix + '.name.pattern.msg' })
                  }],
                  initialValue: name
                })(_react2['default'].createElement(_input2['default'], {
                  style: { width: 512 },
                  autoComplete: 'off',
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
                  disabled: !enabled,
                  maxLength: 32,
                  showLengthInfo: false
                }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('code', {
                  initialValue: code
                })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }), disabled: true, style: { width: 512 } }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('address', {
                  initialValue: address
                })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.address' }), style: { width: 512 } }))
              ),
              _react2['default'].createElement(
                FormItem,
                null,
                getFieldDecorator('ownerRealName', {
                  initialValue: ownerRealName
                })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.owner' }), disabled: true, style: { width: 512 } }))
              ),
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(
                  'span',
                  { style: { color: 'rgba(0,0,0,.6)' } },
                  intl.formatMessage({ id: intlPrefix + '.avatar' })
                ),
                this.getAvatar()
              ),
              _react2['default'].createElement('div', { className: 'divider' }),
              _react2['default'].createElement(
                _choerodonBootCombine.Permission,
                { service: ['iam-service.organization.updateOnOrganizationLevel'] },
                _react2['default'].createElement(
                  'div',
                  { className: 'btnGroup' },
                  _react2['default'].createElement(
                    _button2['default'],
                    {
                      funcType: 'raised',
                      htmlType: 'submit',
                      type: 'primary',
                      loading: submitting,
                      disabled: !enabled
                    },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
                  ),
                  _react2['default'].createElement(
                    _button2['default'],
                    {
                      funcType: 'raised',
                      onClick: this.cancelValue,
                      disabled: !enabled
                    },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);
  return OrganizationSetting;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = OrganizationSetting;
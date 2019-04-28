'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

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

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class;

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _TestLdap = require('./TestLdap');

var _TestLdap2 = _interopRequireDefault(_TestLdap);

var _index = require('../../../components/loadingBar/index');

var _index2 = _interopRequireDefault(_index);

require('./LDAP.scss');

require('../../../common/ConfirmModal.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Sidebar = _modal2['default'].Sidebar;
var RadioGroup = _radio2['default'].Group;
var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var intlPrefix = 'organization.ldap';
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

var LDAP = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(LDAP, _Component);

  function LDAP(props) {
    (0, _classCallCheck3['default'])(this, LDAP);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (LDAP.__proto__ || Object.getPrototypeOf(LDAP)).call(this, props));

    _this.loadLDAP = function () {
      var _this$props = _this.props,
          LDAPStore = _this$props.LDAPStore,
          intl = _this$props.intl;
      var organizationId = _this.state.organizationId;

      LDAPStore.loadLDAP(organizationId)['catch'](function (error) {
        LDAPStore.cleanData();
        var response = error.response;
        if (response) {
          var status = response.status;
          var mess = response.data.message;
          switch (status) {
            case 400:
              Choerodon.prompt(mess);
              break;
            case 404:
              Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.notfound.msg' }));
              break;
            default:
              break;
          }
          LDAPStore.setIsLoading(false);
        }
      });
      _this.setState({
        saving: false
      });
    };

    _this.reload = function () {
      _this.loadLDAP();
    };

    _this.redirectSyncRecord = function () {
      var _this$props2 = _this.props,
          AppState = _this$props2.AppState,
          LDAPStore = _this$props2.LDAPStore;

      var ldapData = LDAPStore.getLDAPData;
      var menu = AppState.currentMenuType;
      var type = menu.type,
          id = menu.id,
          name = menu.name;

      _this.props.history.push('/iam/ldap/sync-record/' + ldapData.id + '?type=' + type + '&id=' + id + '&name=' + name + '&organizationId=' + id);
    };

    _this.closeSidebar = function () {
      _this.setState({
        sidebar: false
      }, function () {
        _this.TestLdap.closeSyncSidebar();
      });
    };

    _this.isShowServerSetting = function () {
      _this.setState({
        showServer: !_this.state.showServer
      });
    };

    _this.isShowUserSetting = function () {
      _this.setState({
        showUser: !_this.state.showUser
      });
    };

    _this.enableLdap = function () {
      var _this$props3 = _this.props,
          LDAPStore = _this$props3.LDAPStore,
          intl = _this$props3.intl;
      var organizationId = _this.state.organizationId;

      var ldapData = LDAPStore.getLDAPData;
      if (ldapData.enabled) {
        _modal2['default'].confirm({
          className: 'c7n-iam-confirm-modal',
          title: intl.formatMessage({ id: intlPrefix + '.disable.title' }),
          content: intl.formatMessage({ id: intlPrefix + '.disable.content' }),
          onOk: function onOk() {
            return LDAPStore.disabledLdap(organizationId, ldapData.id).then(function (data) {
              if (data.failed) {
                Choerodon.prompt(data.message);
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'disable.success' }));
                LDAPStore.setLDAPData(data);
              }
            });
          }
        });
      } else {
        LDAPStore.enabledLdap(organizationId, ldapData.id).then(function (data) {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'enable.success' }));
            LDAPStore.setLDAPData(data);
          }
        });
      }
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var AppState = _this.props.AppState;

      _this.setState({
        showServer: true,
        showUser: true
      });
      _this.props.form.validateFieldsAndScroll(function (err, values) {
        if (!err) {
          var _this$props4 = _this.props,
              LDAPStore = _this$props4.LDAPStore,
              intl = _this$props4.intl;

          var original = LDAPStore.getLDAPData;
          var ldapStatus = values.useSSL === 'Y';
          var ladp = (0, _extends3['default'])({}, values, {
            id: original.id,
            objectVersionNumber: original.objectVersionNumber,
            realNameField: values.realNameField || null,
            phoneField: values.phoneField || null
          });
          ladp.useSSL = ldapStatus;
          if (!ladp.port) {
            ladp.port = ladp.useSSL ? 636 : 389;
          }
          ladp.name = AppState.currentMenuType.name;
          ladp.organizationId = AppState.currentMenuType.organizationId;
          ladp.enabled = LDAPStore.getLDAPData.enabled;
          _this.setState({
            saving: true
          });
          LDAPStore.updateLDAP(_this.state.organizationId, LDAPStore.getLDAPData.id, ladp).then(function (data) {
            if (!data.failed) {
              LDAPStore.setLDAPData(data);
              Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
              _this.setState({
                saving: false
              });
              if (LDAPStore.getLDAPData.enabled) {
                LDAPStore.setIsConnectLoading(true);
                LDAPStore.setIsConfirmLoading(true);
                _this.openSidebar('adminConnect');
                LDAPStore.testConnect(_this.state.organizationId, LDAPStore.getLDAPData.id, ladp).then(function (res) {
                  if (res.failed) {
                    Choerodon.prompt(res.message);
                  } else {
                    LDAPStore.setTestData(res);
                    LDAPStore.setIsConnectLoading(false);
                    LDAPStore.setIsConfirmLoading(false);
                  }
                });
              }
            } else {
              _this.setState({
                saving: false
              });
              Choerodon.prompt(data.message);
            }
          })['catch'](function (error) {
            Choerodon.handleResponseError(error);
            _this.setState({
              saving: false
            });
          });
        }
      });
    };

    _this.loadLDAP = _this.loadLDAP.bind(_this);
    _this.state = _this.getInitState();
    return _this;
  }

  (0, _createClass3['default'])(LDAP, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadLDAP();
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        sidebar: false,
        open: false,
        saving: false,
        organizationId: this.props.AppState.currentMenuType.id,
        value: '',
        showServer: true,
        showUser: true,
        showAdminPwd: false,
        showWhich: '',
        ldapAdminData: ''
      };
    }

    /* 获取同步用户信息 */

  }, {
    key: 'getSyncInfo',
    value: function getSyncInfo() {
      var LDAPStore = this.props.LDAPStore;
      var organizationId = this.state.organizationId;

      var ldapData = LDAPStore.getLDAPData;
      LDAPStore.getSyncInfo(organizationId, ldapData.id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          LDAPStore.setIsConfirmLoading(data && !data.syncEndTime);
          LDAPStore.setSyncData(data);
        }
      });
    }

    /**
     * Input后缀提示
     * @param text
     */

  }, {
    key: 'getSuffix',
    value: function getSuffix(text) {
      return _react2['default'].createElement(
        _popover2['default'],
        {
          overlayStyle: { maxWidth: '180px', wordBreak: 'break-all' },
          className: 'routePop',
          placement: 'right',
          trigger: 'hover',
          content: text
        },
        _react2['default'].createElement(_icon2['default'], { type: 'help' })
      );
    }

    /**
     * label后缀提示
     * @param label label文字
     * @param tip 提示文字
     */

  }, {
    key: 'labelSuffix',
    value: function labelSuffix(label, tip) {
      return _react2['default'].createElement(
        'div',
        { className: 'labelSuffix' },
        _react2['default'].createElement(
          'span',
          null,
          label
        ),
        _react2['default'].createElement(
          _popover2['default'],
          {
            overlayStyle: { maxWidth: '180px' },
            placement: 'right',
            trigger: 'hover',
            content: tip
          },
          _react2['default'].createElement(_icon2['default'], { type: 'help' })
        )
      );
    }

    /* 加载LDAP */


    /* 刷新 */

  }, {
    key: 'openSidebar',


    /* 开启侧边栏 */
    value: function openSidebar(status) {
      var _this2 = this;

      var LDAPStore = this.props.LDAPStore;

      LDAPStore.setIsShowResult(false);
      LDAPStore.setIsSyncLoading(false);
      if (this.TestLdap) {
        var resetFields = this.TestLdap.props.form.resetFields;

        resetFields();
      }

      this.setState({
        sidebar: true,
        showWhich: status
      }, function () {
        if (status === 'connect') {
          LDAPStore.setIsConfirmLoading(false);
        } else if (status === 'sync') {
          _this2.getSyncInfo();
        }
      });
    }

    /* 关闭侧边栏 */


    /* 是否显示服务器设置下拉面板 */


    /* 是否显示用户设置属性下拉面板 */

  }, {
    key: 'changeSsl',


    /* ssl修改状态默认端口号更改 */
    value: function changeSsl() {
      var _props$form = this.props.form,
          getFieldValue = _props$form.getFieldValue,
          setFieldsValue = _props$form.setFieldsValue;

      setFieldsValue({
        port: getFieldValue('useSSL') === 'Y' ? '389' : '636'
      });
    }

    /* 表单提交 */

  }, {
    key: 'renderSidebarTitle',


    /* 渲染侧边栏头部 */
    value: function renderSidebarTitle() {
      var intl = this.props.intl;
      var showWhich = this.state.showWhich;

      if (showWhich === 'connect' || showWhich === 'adminConnect') {
        return intl.formatMessage({ id: intlPrefix + '.connect' });
      } else {
        return intl.formatMessage({ id: intlPrefix + '.syncuser' });
      }
    }

    /* 渲染侧边栏内容 */

  }, {
    key: 'renderSidebarContent',
    value: function renderSidebarContent() {
      var _this3 = this;

      var _state = this.state,
          sidebar = _state.sidebar,
          showWhich = _state.showWhich;

      return _react2['default'].createElement(_TestLdap2['default'], {
        sidebar: sidebar,
        showWhich: showWhich,
        onRef: function onRef(node) {
          _this3.TestLdap = node;
        },
        onAbort: function onAbort() {
          _this3.closeSidebar();_this3.getSyncInfo();
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          LDAPStore = _props.LDAPStore,
          AppState = _props.AppState,
          form = _props.form,
          intl = _props.intl;
      var _state2 = this.state,
          saving = _state2.saving,
          sidebar = _state2.sidebar,
          showWhich = _state2.showWhich;

      var menuType = AppState.currentMenuType;
      var organizationName = menuType.name;
      var ldapData = LDAPStore.getLDAPData;
      var getFieldDecorator = form.getFieldDecorator;

      var inputWidth = 512;
      var tips = {
        hostname: intl.formatMessage({ id: intlPrefix + '.hostname.tip' }),
        ssl: intl.formatMessage({ id: intlPrefix + '.ssl.tip' }),
        basedn: intl.formatMessage({ id: intlPrefix + '.basedn.tip' }),
        loginname: intl.formatMessage({ id: intlPrefix + '.loginname.tip' }),
        username: intl.formatMessage({ id: intlPrefix + '.username.tip' }),
        customFilter: intl.formatMessage({ id: intlPrefix + '.custom-filter.tip' }),
        objectclass: intl.formatMessage({ id: intlPrefix + '.objectclass.tip' }),
        uuid: intl.formatMessage({ id: intlPrefix + '.uuid.tip' })
      };
      var mainContent = LDAPStore.getIsLoading ? _react2['default'].createElement(_index2['default'], null) : _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'serverContainer' },
          _react2['default'].createElement(_button2['default'], {
            shape: 'circle',
            funcType: 'raised',
            icon: this.state.showServer ? 'expand_more' : 'expand_less',
            size: 'small',
            style: { float: 'left' },
            onClick: this.isShowServerSetting
          }),
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.server.setting' })
        ),
        _react2['default'].createElement(
          _form2['default'],
          { onSubmit: this.handleSubmit, layout: 'vertical', className: 'ldapForm' },
          _react2['default'].createElement(
            'div',
            { style: { display: this.state.showServer ? 'block' : 'none' } },
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('directoryType', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.directorytype.require.msg' })
                }],
                initialValue: ldapData.directoryType ? ldapData.directoryType : undefined
              })(_react2['default'].createElement(
                _select2['default'],
                {
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('page-content')[0];
                  },
                  label: intl.formatMessage({ id: intlPrefix + '.directorytype' }),
                  style: { width: inputWidth }
                },
                _react2['default'].createElement(
                  Option,
                  { value: 'Microsoft Active Directory' },
                  _react2['default'].createElement(
                    _tooltip2['default'],
                    {
                      placement: 'right',
                      title: intl.formatMessage({ id: intlPrefix + '.directorytype.mad.tip' }),
                      overlayStyle: { maxWidth: '300px' }
                    },
                    _react2['default'].createElement(
                      'span',
                      { style: { display: 'inline-block', width: '100%' } },
                      'Microsoft Active Directory'
                    )
                  )
                ),
                _react2['default'].createElement(
                  Option,
                  { value: 'OpenLDAP' },
                  _react2['default'].createElement(
                    _tooltip2['default'],
                    {
                      placement: 'right',
                      title: intl.formatMessage({ id: intlPrefix + '.directorytype.openldap.tip' }),
                      overlayStyle: { maxWidth: '300px' }
                    },
                    _react2['default'].createElement(
                      'span',
                      { style: { display: 'inline-block', width: '100%' } },
                      'OpenLDAP'
                    )
                  )
                )
              ))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('serverAddress', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.serveraddress.require.msg' })
                }],
                initialValue: ldapData.serverAddress || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.serveraddress' }), style: { width: inputWidth }, suffix: this.getSuffix(tips.hostname), autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('useSSL', {
                initialValue: ldapData.useSSL ? 'Y' : 'N'
              })(_react2['default'].createElement(
                RadioGroup,
                {
                  className: 'ldapRadioGroup',
                  label: this.labelSuffix(intl.formatMessage({ id: intlPrefix + '.usessl.suffix' }), tips.ssl),
                  onChange: this.changeSsl.bind(this)
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
              getFieldDecorator('sagaBatchSize', {
                rules: [{
                  pattern: /^[1-9]\d*$/,
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.saga-batch-size.msg' })
                }],
                initialValue: ldapData.sagaBatchSize || '500'
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.saga-batch-size' }), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('connectionTimeout', {
                rules: [{
                  pattern: /^[1-9]\d*$/,
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.connection-timeout.msg' })
                }],
                initialValue: ldapData.connectionTimeout || '10'
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.connection-timeout' }), style: { width: inputWidth }, autoComplete: 'off', suffix: intl.formatMessage({ id: 'second' }) }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('port', {
                rules: [{
                  pattern: /^[1-9]\d*$/,
                  message: intl.formatMessage({ id: intlPrefix + '.port.pattern.msg' })
                }],
                initialValue: ldapData.port || (ldapData.useSSL ? '636' : '389')
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.port' }), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('baseDn', {
                initialValue: ldapData.baseDn || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.basedn' }), suffix: this.getSuffix(tips.basedn), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('account', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.admin.loginname.msg' })
                }],
                initialValue: ldapData.account || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.admin.loginname' }), suffix: this.getSuffix(tips.loginname), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.admin.password.msg' })
                }],
                initialValue: ldapData.password || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.admin.password' }), type: 'password', style: { width: inputWidth }, autoComplete: 'off' }))
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'serverContainer' },
            _react2['default'].createElement(_button2['default'], {
              shape: 'circle',
              funcType: 'raised',
              icon: this.state.showUser ? 'expand_more' : 'expand_less',
              size: 'small',
              style: { float: 'left' },
              onClick: this.isShowUserSetting
            }),
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.user.setting' })
          ),
          _react2['default'].createElement(
            'div',
            { style: { display: this.state.showUser ? 'block' : 'none' } },
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('objectClass', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.objectclass.require.msg' })
                }],
                initialValue: ldapData.objectClass || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.objectclass' }), suffix: this.getSuffix(tips.objectclass), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('loginNameField', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.loginname.require.msg' })
                }],
                initialValue: ldapData.loginNameField || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.loginname' }), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('emailField', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.email.require.msg' })
                }],
                initialValue: ldapData.emailField || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.email' }), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('realNameField', {
                initialValue: ldapData.realNameField || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.realname' }), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('phoneField', {
                initialValue: ldapData.phoneField || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.phone' }), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('uuidField', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.uuid.required.msg' })
                }],
                initialValue: ldapData.uuidField || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.uuid' }), suffix: this.getSuffix(tips.uuid), style: { width: inputWidth }, autoComplete: 'off' }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('customFilter', {
                rules: [{
                  pattern: /^\(.*\)$/,
                  message: intl.formatMessage({ id: intlPrefix + '.custom-filter.msg' })
                }],
                initialValue: ldapData.customFilter || undefined
              })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.custom-filter' }), suffix: this.getSuffix(tips.customFilter), style: { width: inputWidth }, autoComplete: 'off' }))
            )
          ),
          _react2['default'].createElement('div', { className: 'divider' }),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.ldap.update'] },
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
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: ldapData.enabled ? intlPrefix + '.saveandtest' : 'save' })
              ),
              _react2['default'].createElement(
                _button2['default'],
                {
                  funcType: 'raised',
                  onClick: function onClick() {
                    var resetFields = _this4.props.form.resetFields;

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
          service: ['iam-service.ldap.create', 'iam-service.ldap.queryByOrgId', 'iam-service.ldap.disableLdap', 'iam-service.ldap.enableLdap', 'iam-service.ldap.syncUsers', 'iam-service.ldap.testConnect', 'iam-service.ldap.update', 'iam-service.ldap.pagingQueryHistories', 'iam-service.ldap.pagingQueryErrorUsers']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: ldapData && ldapData.enabled ? 'remove_circle_outline' : 'finished',
              onClick: this.enableLdap
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: ldapData && ldapData.enabled ? 'disable' : 'enable' })
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.ldap.testConnect']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'low_priority',
                onClick: this.openSidebar.bind(this, 'connect'),
                disabled: !(ldapData && ldapData.enabled)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.connect' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.ldap.syncUsers']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'sync_user',
                onClick: this.openSidebar.bind(this, 'sync'),
                disabled: !(ldapData && ldapData.enabled)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.syncuser' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.ldap.pagingQueryHistories']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'sync_records',
                onClick: this.redirectSyncRecord
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.record.header.title' })
            )
          ),
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
            code: intlPrefix,
            values: { name: organizationName }
          },
          _react2['default'].createElement(
            'div',
            { className: 'ldapContainer' },
            mainContent
          ),
          _react2['default'].createElement(
            Sidebar,
            {
              className: 'connectContainer',
              title: this.renderSidebarTitle(),
              visible: sidebar,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: showWhich === 'sync' ? intlPrefix + '.sync' : intlPrefix + '.test' }),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: showWhich === 'sync' ? 'return' : 'cancel' }),
              onOk: function onOk(e) {
                return _this4.TestLdap.handleSubmit(e);
              },
              onCancel: this.closeSidebar,
              confirmLoading: LDAPStore.confirmLoading,
              alwaysCanCancel: true
            },
            this.renderSidebarContent()
          )
        )
      );
    }
  }]);
  return LDAP;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = LDAP;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

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

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

require('./Organization.scss');

var _avatarUploader = require('../../../components/avatarUploader');

var _avatarUploader2 = _interopRequireDefault(_avatarUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ORGANIZATION_TYPE = 'organization';
var PROJECT_TYPE = 'project';
var Sidebar = _modal2['default'].Sidebar;

var Option = _select2['default'].Option;
var FormItem = _form2['default'].Item;
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
var inputWidth = 512;
var intlPrefix = 'global.organization';
var timer = void 0;

var Organization = (_dec = _form2['default'].create(), _dec2 = (0, _mobxReact.inject)('AppState', 'HeaderStore'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Organization, _Component);

  function Organization(props) {
    (0, _classCallCheck3['default'])(this, Organization);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Organization.__proto__ || Object.getPrototypeOf(Organization)).call(this, props));

    _this.handleRefresh = function () {
      var OrganizationStore = _this.props.OrganizationStore;

      OrganizationStore.refresh();
    };

    _this.createOrg = function () {
      var _this$props = _this.props,
          form = _this$props.form,
          OrganizationStore = _this$props.OrganizationStore;

      form.resetFields();
      _this.setState({
        imgUrl: null
      });
      (0, _mobx.runInAction)(function () {
        OrganizationStore.setEditData({});
        OrganizationStore.show = 'create';
        OrganizationStore.showSideBar();
      });
      setTimeout(function () {
        _this.creatOrgFocusInput.input.focus();
      }, 10);
    };

    _this.handleEdit = function (data) {
      var _this$props2 = _this.props,
          form = _this$props2.form,
          OrganizationStore = _this$props2.OrganizationStore;

      form.resetFields();
      _this.setState({
        imgUrl: data.imageUrl
      });
      (0, _mobx.runInAction)(function () {
        OrganizationStore.show = 'edit';
        OrganizationStore.setEditData(data);
        OrganizationStore.showSideBar();
      });
      setTimeout(function () {
        _this.editOrgFocusInput.input.focus();
      }, 10);
    };

    _this.showDetail = function (data) {
      var OrganizationStore = _this.props.OrganizationStore;

      (0, _mobx.runInAction)(function () {
        OrganizationStore.setEditData(data);
        OrganizationStore.loadOrgDetail(data.id).then(function (message) {
          if (message) {
            Choerodon.prompt(message);
          }
        });
        OrganizationStore.show = 'detail';
      });
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props3 = _this.props,
          form = _this$props3.form,
          intl = _this$props3.intl,
          OrganizationStore = _this$props3.OrganizationStore,
          HeaderStore = _this$props3.HeaderStore,
          AppState = _this$props3.AppState;

      if (OrganizationStore.show !== 'detail') {
        form.validateFields(function (err, values, modify) {
          Object.keys(values).forEach(function (key) {
            // 去除form提交的数据中的全部前后空格
            if (typeof values[key] === 'string') values[key] = values[key].trim();
          });
          var _AppState$getUserInfo = AppState.getUserInfo,
              loginName = _AppState$getUserInfo.loginName,
              realName = _AppState$getUserInfo.realName,
              id = _AppState$getUserInfo.id;

          if (values.userId === '' + loginName + realName) values.userId = false;
          if (OrganizationStore.editData.imageUrl !== _this.state.imgUrl) modify = true;
          if (!err) {
            OrganizationStore.createOrUpdateOrg(values, modify, _this.state.imgUrl, HeaderStore).then(function (message) {
              OrganizationStore.hideSideBar();
              Choerodon.prompt(intl.formatMessage({ id: message }));
            });
          }
        });
      } else {
        OrganizationStore.hideSideBar();
      }
    };

    _this.handleCancelFun = function () {
      var OrganizationStore = _this.props.OrganizationStore;

      OrganizationStore.hideSideBar();
    };

    _this.handleDisable = function (_ref) {
      var enabled = _ref.enabled,
          id = _ref.id;
      var _this$props4 = _this.props,
          intl = _this$props4.intl,
          OrganizationStore = _this$props4.OrganizationStore,
          HeaderStore = _this$props4.HeaderStore,
          AppState = _this$props4.AppState;

      var userId = AppState.getUserId;
      OrganizationStore.toggleDisable(id, enabled).then(function () {
        Choerodon.prompt(intl.formatMessage({ id: enabled ? 'disable.success' : 'enable.success' }));
        HeaderStore.axiosGetOrgAndPro(sessionStorage.userId || userId);
      })['catch'](Choerodon.handleResponseError);
    };

    _this.checkCode = function (rule, value, callback) {
      var _this$props5 = _this.props,
          intl = _this$props5.intl,
          OrganizationStore = _this$props5.OrganizationStore;

      OrganizationStore.checkCode(value).then(function (_ref2) {
        var failed = _ref2.failed;

        if (failed) {
          callback(intl.formatMessage({ id: 'global.organization.onlymsg' }));
        } else {
          callback();
        }
      });
    };

    _this.handleSelectFilter = function (value) {
      _this.setState({
        selectLoading: true
      });

      var queryObj = {
        param: value,
        sort: 'id',
        organization_id: 0
      };

      if (timer) {
        clearTimeout(timer);
      }

      if (value) {
        timer = setTimeout(function () {
          return _this.loadUsers(queryObj);
        }, 300);
      } else {
        return _this.loadUsers(queryObj);
      }
    };

    _this.loadUsers = function (queryObj) {
      var OrganizationStore = _this.props.OrganizationStore;

      OrganizationStore.loadUsers(queryObj).then(function (data) {
        OrganizationStore.setUsersData(data.content.slice());
        _this.setState({
          selectLoading: false
        });
      });
    };

    _this.openAvatarUploader = function () {
      _this.setState({
        isShowAvatar: true
      });
    };

    _this.closeAvatarUploader = function (visible) {
      _this.setState({
        isShowAvatar: visible
      });
    };

    _this.handleUploadOk = function (res) {
      _this.setState({
        imgUrl: res,
        isShowAvatar: false
      });
    };

    _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadOrganizations(pagination, filters, sorter, params);
    };

    _this.editOrgFocusInput = _react2['default'].createRef();
    _this.creatOrgFocusInput = _react2['default'].createRef();
    _this.state = {
      selectLoading: true,
      isShowAvatar: false,
      imgUrl: null
    };
    return _this;
  }

  (0, _createClass3['default'])(Organization, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadOrganizations();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var OrganizationStore = this.props.OrganizationStore;

      clearTimeout(timer);
      OrganizationStore.setFilters();
      OrganizationStore.setParams();
    }
  }, {
    key: 'loadOrganizations',
    value: function loadOrganizations(pagination, filters, sort, params) {
      var OrganizationStore = this.props.OrganizationStore;

      OrganizationStore.loadData(pagination, filters, sort, params);
    }

    // 创建组织侧边


    /**
     * 组织编码校验
     * @param rule 表单校验规则
     * @param value 组织编码
     * @param callback 回调函数
     */


    // 加载全平台用户信息

  }, {
    key: 'getOption',


    /**
     * 获取组织所有者下拉选项
     * @returns {any[]}
     */
    value: function getOption() {
      var OrganizationStore = this.props.OrganizationStore;

      var usersData = OrganizationStore.getUsersData;
      return usersData && usersData.length > 0 ? usersData.map(function (_ref3) {
        var id = _ref3.id,
            loginName = _ref3.loginName,
            realName = _ref3.realName;
        return _react2['default'].createElement(
          Option,
          { key: id, value: id },
          loginName,
          realName
        );
      }) : null;
    }
  }, {
    key: 'renderSidebarTitle',
    value: function renderSidebarTitle() {
      var show = this.props.OrganizationStore.show;

      switch (show) {
        case 'create':
          return 'global.organization.create';
        case 'edit':
          return 'global.organization.modify';
        case 'detail':
          return 'global.organization.detail';
        default:
          return '';
      }
    }

    // 渲染侧边栏成功按钮文字

  }, {
    key: 'renderSidebarOkText',
    value: function renderSidebarOkText() {
      var show = this.props.OrganizationStore.show;

      if (show === 'create') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' });
      } else if (show === 'edit') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' });
      } else {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' });
      }
    }
  }, {
    key: 'renderSidebarDetail',
    value: function renderSidebarDetail() {
      var _props = this.props,
          formatMessage = _props.intl.formatMessage,
          _props$OrganizationSt = _props.OrganizationStore,
          editData = _props$OrganizationSt.editData,
          partDetail = _props$OrganizationSt.partDetail;

      var infoList = [{
        key: formatMessage({ id: intlPrefix + '.name' }),
        value: editData.name
      }, {
        key: formatMessage({ id: intlPrefix + '.code' }),
        value: editData.code
      }, {
        key: formatMessage({ id: intlPrefix + '.region' }),
        value: editData.address ? editData.address : '无'
      }, {
        key: formatMessage({ id: intlPrefix + '.project.creationDate' }),
        value: editData.creationDate
      }, {
        key: formatMessage({ id: intlPrefix + '.owner.login.name' }),
        value: partDetail.ownerLoginName
      }, {
        key: formatMessage({ id: intlPrefix + '.owner.user.name' }),
        value: partDetail.ownerRealName
      }, {
        key: formatMessage({ id: intlPrefix + '.phone' }),
        value: partDetail.ownerPhone ? partDetail.ownerPhone : '无'
      }, {
        key: formatMessage({ id: intlPrefix + '.mailbox' }),
        value: partDetail.ownerEmail
      }, {
        key: formatMessage({ id: intlPrefix + '.avatar' }),
        value: {
          imgUrl: editData.imageUrl,
          name: editData.name.charAt(0)
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'sidebar-content',
          code: 'global.organization.detail',
          values: { name: '' + editData.code }
        },
        infoList.map(function (_ref4) {
          var key = _ref4.key,
              value = _ref4.value;
          return _react2['default'].createElement(
            _row2['default'],
            { key: key, className: (0, _classnames2['default'])('c7n-organization-detail-row', { 'c7n-organization-detail-row-hide': value === null }) },
            _react2['default'].createElement(
              _col2['default'],
              { span: 3 },
              key,
              ':'
            ),
            key === formatMessage({ id: intlPrefix + '.avatar' }) ? _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-organization-avatar' },
              _react2['default'].createElement(
                'div',
                {
                  className: 'c7n-iam-organization-avatar-wrap',
                  style: {
                    backgroundColor: '#c5cbe8',
                    backgroundImage: value.imgUrl ? 'url(' + Choerodon.fileServer(value.imgUrl) + ')' : ''
                  }
                },
                !value.imgUrl && value.name
              )
            ) : _react2['default'].createElement(
              _col2['default'],
              { span: 21 },
              value
            )
          );
        })
      );
    }
  }, {
    key: 'renderSidebarContent',
    value: function renderSidebarContent() {
      var _this2 = this;

      var _props2 = this.props,
          intl = _props2.intl,
          getFieldDecorator = _props2.form.getFieldDecorator,
          _props2$OrganizationS = _props2.OrganizationStore,
          show = _props2$OrganizationS.show,
          editData = _props2$OrganizationS.editData,
          AppState = _props2.AppState;
      var _AppState$getUserInfo2 = AppState.getUserInfo,
          loginName = _AppState$getUserInfo2.loginName,
          realName = _AppState$getUserInfo2.realName;

      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          className: 'sidebar-content',
          code: show === 'create' ? 'global.organization.create' : 'global.organization.modify',
          values: { name: show === 'create' ? '' + (AppState.getSiteInfo.systemName || 'Choerodon') : '' + editData.code }
        },
        _react2['default'].createElement(
          _form2['default'],
          null,
          show === 'create' && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('code', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: 'global.organization.coderequiredmsg' })
              }, {
                max: 15,
                message: intl.formatMessage({ id: 'global.organization.codemaxmsg' })
              }, {
                pattern: /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/,
                message: intl.formatMessage({ id: 'global.organization.codepatternmsg' })
              }, {
                validator: this.checkCode
              }],
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              ref: function ref(e) {
                _this2.creatOrgFocusInput = e;
              },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.code' }),
              autoComplete: 'off',
              style: { width: inputWidth },
              maxLength: 15,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              rules: [{ required: true, message: intl.formatMessage({ id: 'global.organization.namerequiredmsg' }), whitespace: true }],
              validateTrigger: 'onBlur',
              initialValue: show === 'create' ? undefined : editData.name
            })(_react2['default'].createElement(_input2['default'], {
              ref: function ref(e) {
                _this2.editOrgFocusInput = e;
              },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.name' }),
              autoComplete: 'off',
              style: { width: inputWidth },
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('address', {
              rules: [],
              initialValue: show === 'create' ? undefined : editData.address
            })(_react2['default'].createElement(_input2['default'], {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.region' }),
              autoComplete: 'off',
              style: { width: inputWidth }
            }))
          ),
          show === 'create' && _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('userId', {
              initialValue: '' + loginName + realName
            })(_react2['default'].createElement(
              _select2['default'],
              {
                style: { width: 300 },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.owner' }),
                notFoundContent: intl.formatMessage({ id: 'memberrole.notfound.msg' }),
                onFilterChange: this.handleSelectFilter,
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                },
                filterOption: false,
                optionFilterProp: 'children',
                loading: this.state.selectLoading,
                filter: true
              },
              this.getOption()
            ))
          ),
          _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'span',
              { style: { color: 'rgba(0,0,0,.6)' } },
              intl.formatMessage({ id: intlPrefix + '.avatar' })
            ),
            this.getAvatar(editData)
          )
        )
      );
    }
  }, {
    key: 'getAvatar',
    value: function getAvatar() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _state = this.state,
          isShowAvatar = _state.isShowAvatar,
          imgUrl = _state.imgUrl;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-organization-avatar' },
        _react2['default'].createElement(
          'div',
          {
            className: 'c7n-iam-organization-avatar-wrap',
            style: {
              backgroundColor: data.name ? ' #c5cbe8' : '#ccc',
              backgroundImage: imgUrl ? 'url(' + Choerodon.fileServer(imgUrl) + ')' : ''
            }
          },
          !imgUrl && data.name && data.name.charAt(0),
          _react2['default'].createElement(
            _button2['default'],
            { className: (0, _classnames2['default'])('c7n-iam-organization-avatar-button', { 'c7n-iam-organization-avatar-button-create': !data.name, 'c7n-iam-organization-avatar-button-edit': data.name }), onClick: this.openAvatarUploader },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-organization-avatar-button-icon' },
              _react2['default'].createElement(_icon2['default'], { type: 'photo_camera' })
            )
          ),
          _react2['default'].createElement(_avatarUploader2['default'], { visible: isShowAvatar, intlPrefix: 'global.organization.avatar.edit', onVisibleChange: this.closeAvatarUploader, onUploadOk: this.handleUploadOk })
        )
      );
    }

    /**
     * 打开上传图片模态框
     */

  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      var _this3 = this;

      var _props3 = this.props,
          intl = _props3.intl,
          _props3$OrganizationS = _props3.OrganizationStore,
          _props3$OrganizationS2 = _props3$OrganizationS.sort,
          columnKey = _props3$OrganizationS2.columnKey,
          order = _props3$OrganizationS2.order,
          filters = _props3$OrganizationS.filters;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        filters: [],
        width: '35%',
        render: function render(text, record) {
          return _react2['default'].createElement(
            _react2['default'].Fragment,
            null,
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-organization-name-avatar' },
              record.imageUrl ? _react2['default'].createElement('img', { src: record.imageUrl, alt: 'avatar', style: { width: '100%' } }) : _react2['default'].createElement(
                _react2['default'].Fragment,
                null,
                text.split('')[0]
              )
            ),
            _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.3 },
              text
            )
          );
        },
        sortOrder: columnKey === 'name' && order,
        filteredValue: filters.name || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'code' }),
        dataIndex: 'code',
        key: 'code',
        filters: [],
        sortOrder: columnKey === 'code' && order,
        filteredValue: filters.code || [],
        width: '20%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.3 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.project.count' }),
        dataIndex: 'projectCount',
        key: 'projectCount',
        align: 'center'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'enabled',
        key: 'enabled',
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false'
        }],
        filteredValue: filters.enabled || [],
        render: function render(enabled) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: enabled ? 'enable' : 'disable' }), colorCode: enabled ? 'COMPLETED' : 'DISABLE' });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.project.creationDate' }),
        dataIndex: 'creationDate',
        key: 'creationDate'
      }, {
        title: '',
        width: 150,
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            { className: 'operation' },
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.organization.update'] },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  icon: 'mode_edit',
                  shape: 'circle',
                  onClick: _this3.handleEdit.bind(_this3, record)
                })
              )
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.organization.disableOrganization', 'iam-service.organization.enableOrganization'] },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: record.enabled ? 'disable' : 'enable' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  size: 'small',
                  icon: record.enabled ? 'remove_circle_outline' : 'finished',
                  shape: 'circle',
                  onClick: function onClick() {
                    return _this3.handleDisable(record);
                  }
                })
              )
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.organization.query'] },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  icon: 'find_in_page',
                  size: 'small',
                  onClick: _this3.showDetail.bind(_this3, record)
                })
              )
            )
          );
        }
      }];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          intl = _props4.intl,
          _props4$OrganizationS = _props4.OrganizationStore,
          params = _props4$OrganizationS.params,
          loading = _props4$OrganizationS.loading,
          pagination = _props4$OrganizationS.pagination,
          sidebarVisible = _props4$OrganizationS.sidebarVisible,
          submitting = _props4$OrganizationS.submitting,
          show = _props4$OrganizationS.show,
          orgData = _props4$OrganizationS.orgData,
          AppState = _props4.AppState;


      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.organization.list', 'iam-service.organization.query', 'organization-service.organization.create', 'iam-service.organization.update', 'iam-service.organization.disableOrganization', 'iam-service.organization.enableOrganization', 'iam-service.role-member.queryAllUsers']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['organization-service.organization.create'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.createOrg,
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'global.organization.create' })
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
            code: 'global.organization',
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' },
            className: 'c7n-iam-organization'
          },
          _react2['default'].createElement(_table2['default'], {
            columns: this.getTableColumns(),
            dataSource: orgData,
            pagination: pagination,
            onChange: this.handlePageChange,
            filters: params,
            loading: loading,
            rowKey: 'id',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: this.renderSidebarTitle() }),
              visible: sidebarVisible,
              onOk: this.handleSubmit,
              onCancel: this.handleCancelFun,
              okCancel: show !== 'detail',
              okText: this.renderSidebarOkText(),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              confirmLoading: submitting,
              className: (0, _classnames2['default'])('c7n-iam-organization-sidebar', { 'c7n-iam-organization-sidebar-create': show === 'create' })
            },
            show !== 'detail' ? this.renderSidebarContent() : this.renderSidebarDetail()
          )
        )
      );
    }
  }]);
  return Organization;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Organization;
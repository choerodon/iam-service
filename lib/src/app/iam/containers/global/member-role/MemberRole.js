'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _progress = require('choerodon-ui/lib/progress');

var _progress2 = _interopRequireDefault(_progress);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _upload = require('choerodon-ui/lib/upload');

var _upload2 = _interopRequireDefault(_upload);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class;

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/progress/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/upload/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _reactDom = require('react-dom');

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _MemberRoleType = require('./MemberRoleType');

var _MemberRoleType2 = _interopRequireDefault(_MemberRoleType);

require('./MemberRole.scss');

require('../../../common/ConfirmModal.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var timer = void 0;
var Sidebar = _modal2['default'].Sidebar;

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var RadioGroup = _radio2['default'].Group;
var FormItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};
var intlPrefix = 'memberrole';

var MemberRole = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MemberRole, _Component);

  function MemberRole() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, MemberRole);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = MemberRole.__proto__ || Object.getPrototypeOf(MemberRole)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.changeMode = function (value) {
      var MemberRoleStore = _this.props.MemberRoleStore;

      MemberRoleStore.setCurrentMode(value);
      _this.reload();
    }, _this.reload = function () {
      _this.setState(_this.getInitState(), function () {
        _this.init();
      });
    }, _this.formatMessage = function (id) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var intl = _this.props.intl;

      return intl.formatMessage({
        id: id
      }, values);
    }, _this.openSidebar = function () {
      _this.props.form.resetFields();
      _this.setState({
        roleIds: _this.initFormRoleIds(),
        sidebar: true
      });
    }, _this.closeSidebar = function () {
      _this.setState({ sidebar: false });
    }, _this.deleteRoleByMultiple = function () {
      var _this$state = _this.state,
          selectMemberRoles = _this$state.selectMemberRoles,
          showMember = _this$state.showMember,
          selectRoleMembers = _this$state.selectRoleMembers;
      var MemberRoleStore = _this.props.MemberRoleStore;

      var content = void 0;
      if (MemberRoleStore.currentMode === 'user' && showMember) {
        content = 'memberrole.remove.select.all.content';
      } else if (MemberRoleStore.currentMode === 'user' && !showMember) {
        content = 'memberrole.remove.select.content';
      } else if (MemberRoleStore.currentMode === 'client' && showMember) {
        content = 'memberrole.remove.select.all.client.content';
      } else {
        content = 'memberrole.remove.select.client.content';
      }
      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: _this.formatMessage('memberrole.remove.title'),
        content: _this.formatMessage(content),
        onOk: function onOk() {
          if (showMember) {
            return _this.deleteRolesByIds(selectMemberRoles);
          } else {
            var data = {};
            selectRoleMembers.forEach(function (_ref2) {
              var id = _ref2.id,
                  roleId = _ref2.roleId;

              if (!data[roleId]) {
                data[roleId] = [];
              }
              data[roleId].push(id);
            });
            return _this.deleteRolesByIds(data);
          }
        }
      });
    }, _this.handleDelete = function (record) {
      var MemberRoleStore = _this.props.MemberRoleStore;

      var isUsersMode = MemberRoleStore.currentMode === 'user';
      var content = void 0;
      if (isUsersMode) {
        content = _this.formatMessage('memberrole.remove.all.content', { name: record.loginName });
      } else {
        content = _this.formatMessage('memberrole.remove.all.client.content', { name: record.name });
      }
      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: _this.formatMessage('memberrole.remove.title'),
        content: content,
        onOk: function onOk() {
          return _this.deleteRolesByIds((0, _defineProperty3['default'])({}, record.id, record.roles.map(function (_ref3) {
            var id = _ref3.id;
            return id;
          })));
        }
      });
    }, _this.deleteRoleByRole = function (record) {
      var MemberRoleStore = _this.props.MemberRoleStore;

      var isUsersMode = MemberRoleStore.currentMode === 'user';
      var content = void 0;
      if (isUsersMode) {
        content = _this.formatMessage('memberrole.remove.content', {
          member: record.loginName,
          role: record.roleName
        });
      } else {
        content = _this.formatMessage('memberrole.remove.client.content', {
          member: record.name,
          role: record.roleName
        });
      }
      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: _this.formatMessage('memberrole.remove.title'),
        content: content,
        onOk: function onOk() {
          return _this.deleteRolesByIds((0, _defineProperty3['default'])({}, record.roleId, [record.id]));
        }
      });
    }, _this.deleteRolesByIds = function (data) {
      var showMember = _this.state.showMember;
      var MemberRoleStore = _this.props.MemberRoleStore;

      var isUsersMode = MemberRoleStore.currentMode === 'user';
      var body = {
        view: showMember ? 'userView' : 'roleView',
        memberType: isUsersMode ? 'user' : 'client',
        data: data
      };
      return _this.roles.deleteRoleMember(body).then(function (_ref4) {
        var failed = _ref4.failed,
            message = _ref4.message;

        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(_this.formatMessage('remove.success'));
          _this.setState({
            selectRoleMemberKeys: [],
            selectMemberRoles: {}
          });
          if (isUsersMode) {
            _this.roles.fetch();
          } else {
            _this.roles.fetchClient();
          }
        }
      });
    }, _this.getUploadOkText = function () {
      var fileLoading = _this.state.fileLoading;
      var MemberRoleStore = _this.props.MemberRoleStore;

      var uploading = MemberRoleStore.getUploading;
      if (fileLoading === true) {
        return '上传中';
      } else if (uploading) {
        return '导入中';
      } else {
        return '上传';
      }
    }, _this.renderUpload = function () {
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        _this.getHeader(),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'div',
            { style: { width: '512px' } },
            _this.getUploadInfo()
          ),
          _react2['default'].createElement(
            'div',
            { style: { display: 'none' } },
            _react2['default'].createElement(
              _upload2['default'],
              _this.getUploadProps(),
              _react2['default'].createElement(_button2['default'], { className: 'c7n-user-upload-hidden' })
            )
          )
        )
      );
    }, _this.getHeaderCode = function () {
      var selectType = _this.state.selectType;
      var _this$roles = _this.roles,
          code = _this$roles.code,
          clientCode = _this$roles.clientCode;
      var MemberRoleStore = _this.props.MemberRoleStore;

      var codeType = '';
      switch (selectType) {
        case 'edit':
          codeType = 'modify';
          break;
        case 'create':
          codeType = 'add';
          break;
        default:
          codeType = 'upload';
          break;
      }
      if (selectType !== 'edit') {
        return code + '.' + codeType;
      } else {
        return MemberRoleStore.currentMode === 'user' ? code + '.' + codeType : code + '.' + codeType + '.client';
      }
    }, _this.saveSideBarRef = function (node) {
      if (node) {
        /* eslint-disable-next-line */
        _this.sidebarBody = (0, _reactDom.findDOMNode)(node).parentNode;
      }
    }, _this.getForm = function () {
      var selectType = _this.state.selectType;

      return selectType === 'create' ? _react2['default'].createElement(
        _form2['default'],
        { layout: 'vertical' },
        _this.getModeDom(),
        _this.getProjectNameDom(),
        _this.getRoleFormItems()
      ) : _react2['default'].createElement(
        _form2['default'],
        { layout: 'vertical' },
        _this.getRoleFormItems()
      );
    }, _this.getRoleFormItems = function () {
      var _this$state2 = _this.state,
          selectType = _this$state2.selectType,
          roleIds = _this$state2.roleIds,
          overflow = _this$state2.overflow;
      var getFieldDecorator = _this.props.form.getFieldDecorator;

      var formItems = roleIds.map(function (id, index) {
        var key = id === undefined ? 'role-index-' + index : String(id);
        return _react2['default'].createElement(
          FormItem,
          (0, _extends3['default'])({}, FormItemNumLayout, {
            key: key
          }),
          getFieldDecorator(key, {
            rules: [{
              required: roleIds.length === 1 && selectType === 'create',
              message: _this.formatMessage('memberrole.role.require.msg')
            }],
            initialValue: id
          })(_react2['default'].createElement(
            _select2['default'],
            {
              className: 'member-role-select',
              style: { width: 300 },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role.label' }),
              getPopupContainer: function getPopupContainer() {
                return overflow ? _this.sidebarBody : document.body;
              },
              filterOption: function filterOption(input, option) {
                var childNode = option.props.children;
                if (childNode && _react2['default'].isValidElement(childNode)) {
                  return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }
                return false;
              },
              onChange: function onChange(value) {
                roleIds[index] = value;
              },
              filter: true
            },
            _this.getOption(id)
          )),
          _react2['default'].createElement(_button2['default'], {
            size: 'small',
            icon: 'delete',
            shape: 'circle',
            onClick: function onClick() {
              return _this.removeRole(index);
            },
            disabled: roleIds.length === 1 && selectType === 'create',
            className: 'delete-role'
          })
        );
      });
      return formItems;
    }, _this.changeCreateMode = function (e) {
      var form = _this.props.form;

      _this.setState({
        createMode: e.target.value,
        selectLoading: true,
        roleIds: [undefined]
      });
      form.setFields({
        member: {
          values: []
        },
        'role-index-0': {
          values: undefined
        }
      });
    }, _this.handleSelectFilter = function (value) {
      _this.setState({
        selectLoading: true
      });
      var createMode = _this.state.createMode;

      var queryObj = {
        param: value,
        sort: 'id',
        organization_id: (0, _get2['default'])(_this.props.AppState, 'currentMenuType.organizationId', 0)
      };

      if (timer) {
        clearTimeout(timer);
      }

      if (value) {
        timer = setTimeout(function () {
          return createMode === 'user' ? _this.loadUsers(queryObj) : _this.loadClients(queryObj);
        }, 300);
      } else {
        return createMode === 'user' ? _this.loadUsers(queryObj) : _this.loadClients(queryObj);
      }
    }, _this.loadUsers = function (queryObj) {
      var MemberRoleStore = _this.props.MemberRoleStore;

      MemberRoleStore.loadUsers(queryObj).then(function (data) {
        MemberRoleStore.setUsersData(data.content.slice());
        _this.setState({
          selectLoading: false
        });
      });
    }, _this.loadClients = function (queryObj) {
      var MemberRoleStore = _this.props.MemberRoleStore;

      MemberRoleStore.loadClients(queryObj).then(function (data) {
        MemberRoleStore.setClientsData(data.content.slice());
        _this.setState({
          selectLoading: false
        });
      });
    }, _this.getUserOption = function () {
      var MemberRoleStore = _this.props.MemberRoleStore;

      var usersData = MemberRoleStore.getUsersData;
      return usersData && usersData.length > 0 ? usersData.map(function (_ref5) {
        var id = _ref5.id,
            imageUrl = _ref5.imageUrl,
            loginName = _ref5.loginName,
            realName = _ref5.realName;
        return _react2['default'].createElement(
          Option,
          { key: id, value: id, label: '' + loginName + realName },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-memberrole-user-option' },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-memberrole-user-option-avatar' },
              imageUrl ? _react2['default'].createElement('img', { src: imageUrl, alt: 'userAvatar', style: { width: '100%' } }) : _react2['default'].createElement(
                'span',
                { className: 'c7n-iam-memberrole-user-option-avatar-noavatar' },
                realName && realName.split('')[0]
              )
            ),
            _react2['default'].createElement(
              'span',
              null,
              loginName,
              realName
            )
          )
        );
      }) : null;
    }, _this.getClientOption = function () {
      var MemberRoleStore = _this.props.MemberRoleStore;

      var clientsData = MemberRoleStore.getClientsData;
      return clientsData && clientsData.length > 0 ? clientsData.map(function (_ref6) {
        var id = _ref6.id,
            clientName = _ref6.clientName;
        return _react2['default'].createElement(
          Option,
          { key: id, value: id },
          clientName
        );
      }) : null;
    }, _this.getOption = function (current) {
      var _this$state3 = _this.state,
          _this$state3$roleData = _this$state3.roleData,
          roleData = _this$state3$roleData === undefined ? [] : _this$state3$roleData,
          roleIds = _this$state3.roleIds;

      return roleData.reduce(function (options, _ref7) {
        var id = _ref7.id,
            name = _ref7.name,
            enabled = _ref7.enabled,
            code = _ref7.code;

        if (roleIds.indexOf(id) === -1 || id === current) {
          if (enabled === false) {
            options.push(_react2['default'].createElement(
              Option,
              { style: { display: 'none' }, disabled: true, value: id, key: id },
              name
            ));
          } else {
            options.push(_react2['default'].createElement(
              Option,
              { value: id, key: id, title: name },
              _react2['default'].createElement(
                _tooltip2['default'],
                { title: code, placement: 'right', align: { offset: [20, 0] } },
                _react2['default'].createElement(
                  'span',
                  { style: { display: 'inline-block', width: '100%' } },
                  name
                )
              )
            ));
          }
        }
        return options;
      }, []);
    }, _this.removeRole = function (index) {
      var roleIds = _this.state.roleIds;

      roleIds.splice(index, 1);
      _this.setState({ roleIds: roleIds });
    }, _this.addRoleList = function () {
      var roleIds = _this.state.roleIds;

      roleIds.push(undefined);
      _this.setState({ roleIds: roleIds });
    }, _this.getSpentTime = function (startTime, endTime) {
      var intl = _this.props.intl;

      var timeUnit = {
        day: intl.formatMessage({ id: 'day' }),
        hour: intl.formatMessage({ id: 'hour' }),
        minute: intl.formatMessage({ id: 'minute' }),
        second: intl.formatMessage({ id: 'second' })
      };
      var spentTime = new Date(endTime).getTime() - new Date(startTime).getTime(); // 时间差的毫秒数
      // 天数
      var days = Math.floor(spentTime / (24 * 3600 * 1000));
      // 小时
      var leave1 = spentTime % (24 * 3600 * 1000); //  计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      // 分钟
      var leave2 = leave1 % (3600 * 1000); //  计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      // 秒数
      var leave3 = leave2 % (60 * 1000); //  计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      var resultDays = days ? days + timeUnit.day : '';
      var resultHours = hours ? hours + timeUnit.hour : '';
      var resultMinutes = minutes ? minutes + timeUnit.minute : '';
      var resultSeconds = seconds ? seconds + timeUnit.second : '';
      return resultDays + resultHours + resultMinutes + resultSeconds;
    }, _this.getUploadInfo = function () {
      var MemberRoleStore = _this.props.MemberRoleStore;
      var fileLoading = _this.state.fileLoading;

      var uploadInfo = MemberRoleStore.getUploadInfo || {};
      var uploading = MemberRoleStore.getUploading;
      var container = [];

      if (uploading) {
        // 如果正在导入
        container.push(_this.renderLoading());
        _this.handleUploadInfo();
        if (fileLoading) {
          _this.setState({
            fileLoading: false
          });
        }
      } else if (fileLoading) {
        // 如果还在上传
        container.push(_this.renderLoading());
      } else if (!uploadInfo.noData) {
        var failedStatus = uploadInfo.finished ? 'detail' : 'error';
        container.push(_react2['default'].createElement(
          'p',
          { key: 'upload.lasttime' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'upload.lasttime' }),
          uploadInfo.beginTime,
          '\uFF08',
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'upload.spendtime' }),
          _this.getSpentTime(uploadInfo.beginTime, uploadInfo.endTime),
          '\uFF09'
        ), _react2['default'].createElement(
          'p',
          { key: 'upload.time' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, {
            id: 'upload.time',
            values: {
              successCount: _react2['default'].createElement(
                'span',
                { className: 'success-count' },
                uploadInfo.successfulCount || 0
              ),
              failedCount: _react2['default'].createElement(
                'span',
                { className: 'failed-count' },
                uploadInfo.failedCount || 0
              )
            }
          }),
          uploadInfo.url && _react2['default'].createElement(
            'span',
            { className: 'download-failed-' + failedStatus },
            _react2['default'].createElement(
              'a',
              { href: uploadInfo.url },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'download.failed.' + failedStatus })
            )
          )
        ));
      } else {
        container.push(_react2['default'].createElement(
          'p',
          { key: 'upload.norecord' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'upload.norecord' })
        ));
      }
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-user-upload-container' },
        container
      );
    }, _this.getUploadProps = function () {
      var _this$props = _this.props,
          intl = _this$props.intl,
          MemberRoleStore = _this$props.MemberRoleStore;

      return {
        multiple: false,
        name: 'file',
        accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        action: '' + process.env.API_HOST + MemberRoleStore.urlRoleMember + '/batch_import',
        headers: {
          Authorization: 'bearer ' + Choerodon.getCookie('access_token')
        },
        showUploadList: false,
        onChange: function onChange(_ref8) {
          var file = _ref8.file;
          var status = file.status,
              response = file.response;
          var fileLoading = _this.state.fileLoading;

          if (status === 'done') {
            _this.handleUploadInfo(true);
          } else if (status === 'error') {
            Choerodon.prompt('' + response.message);
            _this.setState({
              fileLoading: false
            });
          }
          if (response && response.failed === true) {
            Choerodon.prompt('' + response.message);
            _this.setState({
              fileLoading: false
            });
          }
          if (!fileLoading) {
            _this.setState({
              fileLoading: status === 'uploading'
            });
          }
        }
      };
    }, _this.isModify = function () {
      var _this$state4 = _this.state,
          roleIds = _this$state4.roleIds,
          currentMemberData = _this$state4.currentMemberData;

      var roles = currentMemberData.roles;
      if (roles.length !== roleIds.length) {
        return true;
      }
      for (var i = 0; i < roles.length; i += 1) {
        if (!roleIds.includes(roles[i].id)) {
          return true;
        }
      }
      return false;
    }, _this.handleDownLoad = function () {
      var MemberRoleStore = _this.props.MemberRoleStore;

      MemberRoleStore.downloadTemplate().then(function (result) {
        var blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        var url = window.URL.createObjectURL(blob);
        var linkElement = document.getElementById('c7n-user-download-template');
        linkElement.setAttribute('href', url);
        linkElement.click();
      });
    }, _this.handleOk = function (e) {
      var _this$state5 = _this.state,
          selectType = _this$state5.selectType,
          roleIds = _this$state5.roleIds;
      var MemberRoleStore = _this.props.MemberRoleStore;

      e.preventDefault();
      _this.props.form.validateFields(function (err, values) {
        var memberType = selectType === 'create' ? values.mode : MemberRoleStore.currentMode;
        if (!err) {
          var body = roleIds.filter(function (roleId) {
            return roleId;
          }).map(function (roleId, index) {
            return {
              memberType: memberType,
              roleId: roleId,
              sourceId: sessionStorage.selectData.id || 0,
              sourceType: sessionStorage.type
            };
          });
          var pageInfo = {
            current: 1,
            total: 0,
            pageSize: _MemberRoleType.pageSize
          };
          _this.setState({ submitting: true });
          if (selectType === 'create') {
            _this.roles.fetchRoleMember(values.member, body, memberType).then(function (_ref9) {
              var failed = _ref9.failed,
                  message = _ref9.message;

              _this.setState({ submitting: false });
              if (failed) {
                Choerodon.prompt(message);
              } else {
                Choerodon.prompt(_this.formatMessage('add.success'));
                _this.closeSidebar();
                if (MemberRoleStore.currentMode === 'user') {
                  _this.setState({
                    memberRolePageInfo: pageInfo
                  }, function () {
                    _this.roles.fetch();
                  });
                } else {
                  _this.setState({
                    clientMemberRolePageInfo: pageInfo
                  }, function () {
                    _this.roles.fetchClient();
                  });
                }
              }
            })['catch'](function (error) {
              _this.setState({ submitting: false });
              Choerodon.handleResponseError(error);
            });
          } else if (selectType === 'edit') {
            if (!_this.isModify()) {
              _this.setState({ submitting: false });
              Choerodon.prompt(_this.formatMessage('modify.success'));
              _this.closeSidebar();
              return;
            }
            var currentMemberData = _this.state.currentMemberData;

            var memberIds = [currentMemberData.id];
            _this.roles.fetchRoleMember(memberIds, body, memberType, true).then(function (_ref10) {
              var failed = _ref10.failed,
                  message = _ref10.message;

              _this.setState({ submitting: false });
              if (failed) {
                Choerodon.prompt(message);
              } else {
                Choerodon.prompt(_this.formatMessage('modify.success'));
                _this.closeSidebar();
                if (MemberRoleStore.currentMode === 'user') {
                  if (body.length) {
                    _this.setState({
                      memberRolePageInfo: pageInfo
                    }, function () {
                      _this.roles.fetch();
                    });
                  } else {
                    _this.roles.fetch();
                  }
                } else if (MemberRoleStore.currentMode === 'client') {
                  if (body.length) {
                    _this.setState({
                      clientMemberRolePageInfo: pageInfo
                    }, function () {
                      _this.roles.fetchClient();
                    });
                  } else {
                    _this.roles.fetchClient();
                  }
                }
              }
            })['catch'](function (error) {
              _this.setState({ submitting: false });
              Choerodon.handleResponseError(error);
            });
          }
        }
      });
    }, _this.createRole = function () {
      var MemberRoleStore = _this.props.MemberRoleStore;

      _this.setState({ selectType: 'create', createMode: MemberRoleStore.currentMode }, function () {
        _this.openSidebar();
      });
    }, _this.editRole = function (memberData) {
      _this.setState({
        selectType: 'edit',
        currentMemberData: memberData
      }, function () {
        return _this.openSidebar();
      });
    }, _this.handleEditRole = function (_ref11) {
      var memberId = _ref11.id,
          loginName = _ref11.loginName;

      var member = _this.state.memberDatas.find(function (_ref12) {
        var id = _ref12.id;
        return id === memberId;
      });
      if (!member) {
        _this.roles.loadMemberDatas({
          current: 1,
          pageSize: _MemberRoleType.pageSize
        }, {
          loginName: [loginName]
        }).then(function (_ref13) {
          var content = _ref13.content;

          _this.editRole(content.find(function (memberData) {
            return memberData.loginName === loginName;
          }));
        });
      } else {
        _this.editRole(member);
      }
    }, _this.handleEditClientRole = function (_ref14) {
      var memberId = _ref14.id,
          clientName = _ref14.clientName;

      var member = _this.state.clientMemberDatas.find(function (_ref15) {
        var id = _ref15.id;
        return id === memberId;
      });
      if (!member) {
        _this.roles.loadClientMemberDatas({
          current: 1,
          pageSize: _MemberRoleType.pageSize
        }, {
          clientName: clientName
        }).then(function (_ref16) {
          var content = _ref16.content;

          _this.editRole(content.find(function (memberData) {
            return memberData.name === clientName;
          }));
        });
      } else {
        _this.editRole(member);
      }
    }, _this.memberRoleTableChange = function (memberRolePageInfo, memberRoleFilters, sort, params) {
      _this.setState({
        memberRolePageInfo: memberRolePageInfo,
        memberRoleFilters: memberRoleFilters,
        params: params,
        loading: true
      });
      _this.roles.loadMemberDatas(memberRolePageInfo, memberRoleFilters, params).then(function (_ref17) {
        var content = _ref17.content,
            totalElements = _ref17.totalElements,
            number = _ref17.number,
            size = _ref17.size;

        _this.setState({
          loading: false,
          memberDatas: content,
          memberRolePageInfo: {
            current: number + 1,
            total: totalElements,
            pageSize: size
          },
          params: params,
          memberRoleFilters: memberRoleFilters
        });
      });
    }, _this.clientMemberRoleTableChange = function (clientMemberRolePageInfo, clientMemberRoleFilters, sort, clientParams) {
      _this.setState({
        clientMemberRolePageInfo: clientMemberRolePageInfo,
        clientMemberRoleFilters: clientMemberRoleFilters,
        clientParams: clientParams,
        loading: true
      });
      _this.roles.loadClientMemberDatas(clientMemberRolePageInfo, clientMemberRoleFilters, clientParams).then(function (_ref18) {
        var content = _ref18.content,
            totalElements = _ref18.totalElements,
            number = _ref18.number,
            size = _ref18.size;

        _this.setState({
          loading: false,
          clientMemberDatas: content,
          clientMemberRolePageInfo: {
            current: number + 1,
            total: totalElements,
            pageSize: size
          },
          clientParams: clientParams,
          clientMemberRoleFilters: clientMemberRoleFilters
        });
      });
    }, _this.roleMemberTableChange = function (pageInfo, _ref19, sort, params) {
      var name = _ref19.name,
          roleMemberFilters = (0, _objectWithoutProperties3['default'])(_ref19, ['name']);

      var newState = {
        roleMemberFilterRole: name,
        roleMemberFilters: roleMemberFilters,
        roleMemberParams: params
      };
      newState.loading = true;
      var expandedKeys = _this.state.expandedKeys;

      _this.roles.loadRoleMemberDatas((0, _extends3['default'])({ name: params }, roleMemberFilters)).then(function (roleData) {
        var roleMemberDatas = roleData.filter(function (role) {
          role.users = role.users || [];
          if (role.userCount > 0) {
            if (expandedKeys.find(function (expandedKey) {
              return expandedKey.split('-')[1] === String(role.id);
            })) {
              _this.roles.loadRoleMemberData(role, {
                current: 1,
                pageSize: _MemberRoleType.pageSize
              }, roleMemberFilters);
            }
            return true;
          }
          return false;
        });
        _this.setState({
          loading: false,
          expandedKeys: expandedKeys,
          roleMemberDatas: roleMemberDatas
        });
      });
      _this.setState(newState);
    }, _this.clientRoleMemberTableChange = function (pageInfo, _ref20, sort, params) {
      var name = _ref20.name,
          clientRoleMemberFilters = (0, _objectWithoutProperties3['default'])(_ref20, ['name']);

      var newState = {
        clientRoleMemberFilterRole: name,
        clientRoleMemberFilters: clientRoleMemberFilters,
        clientRoleMemberParams: params
      };
      newState.loading = true;
      var expandedKeys = _this.state.expandedKeys;

      _this.roles.loadClientRoleMemberDatas((0, _extends3['default'])({ name: params }, clientRoleMemberFilters)).then(function (roleData) {
        var cilentRoleMemberDatas = roleData.filter(function (role) {
          role.users = role.users || [];
          if (role.userCount > 0) {
            if (expandedKeys.find(function (expandedKey) {
              return expandedKey.split('-')[1] === String(role.id);
            })) {
              _this.roles.loadClientRoleMemberData(role, {
                current: 1,
                pageSize: _MemberRoleType.pageSize
              }, clientRoleMemberFilters);
            }
            return true;
          }
          return false;
        });
        _this.setState({
          loading: false,
          expandedKeys: expandedKeys,
          cilentRoleMemberDatas: cilentRoleMemberDatas
        });
      });
      _this.setState(newState);
    }, _this.renderSimpleColumn = function (text, _ref21) {
      var enabled = _ref21.enabled;

      if (enabled === false) {
        return _react2['default'].createElement(
          _tooltip2['default'],
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.member.disabled.tip' }) },
          _react2['default'].createElement(
            'span',
            { className: 'text-disabled' },
            text
          )
        );
      }
      return text;
    }, _this.renderRoleColumn = function (text) {
      return text.map(function (_ref22) {
        var id = _ref22.id,
            name = _ref22.name,
            enabled = _ref22.enabled;

        var item = _react2['default'].createElement(
          'span',
          { className: (0, _classnames2['default'])('role-wrapper', { 'role-wrapper-enabled': enabled, 'role-wrapper-disabled': !enabled }), key: id },
          name
        );
        if (enabled === false) {
          item = _react2['default'].createElement(
            _tooltip2['default'],
            { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role.disabled.tip' }) },
            item
          );
        }
        return item;
      });
    }, _this.renderRoleLoginNameColumn = function (text, data) {
      var roleMemberFilters = _this.state.roleMemberFilters;
      var loginName = data.loginName,
          name = data.name;

      if (loginName) {
        return loginName;
      } else if (name) {
        var userCount = data.userCount,
            length = data.users.length,
            isLoading = data.loading,
            enabled = data.enabled;

        var more = isLoading ? _react2['default'].createElement(_progress2['default'], { type: 'loading', width: 12 }) : length > 0 && userCount > length && _react2['default'].createElement(
          'a',
          { onClick: function onClick() {
              _this.roles.loadRoleMemberData(data, {
                current: length / _MemberRoleType.pageSize + 1,
                pageSize: _MemberRoleType.pageSize
              }, roleMemberFilters);
              _this.forceUpdate();
            }
          },
          '\u66F4\u591A'
        );
        var item = _react2['default'].createElement(
          'span',
          { className: (0, _classnames2['default'])({ 'text-disabled': !enabled }) },
          name,
          ' (',
          userCount,
          ') ',
          more
        );
        return enabled ? item : _react2['default'].createElement(
          _tooltip2['default'],
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role.disabled.tip' }) },
          item
        );
      }
    }, _this.renderRoleClientNameColumn = function (text, data) {
      var clientRoleMemberFilters = _this.state.clientRoleMemberFilters;
      var clientName = data.clientName,
          name = data.name;

      if (clientName) {
        return clientName;
      } else if (name) {
        var userCount = data.userCount,
            length = data.users.length,
            isLoading = data.loading,
            enabled = data.enabled;

        var more = isLoading ? _react2['default'].createElement(_progress2['default'], { type: 'loading', width: 12 }) : length > 0 && userCount > length && _react2['default'].createElement(
          'a',
          { onClick: function onClick() {
              _this.roles.loadClientRoleMemberData(data, {
                current: length / _MemberRoleType.pageSize + 1,
                pageSize: _MemberRoleType.pageSize
              }, clientRoleMemberFilters);
              _this.forceUpdate();
            }
          },
          '\u66F4\u591A'
        );
        var item = _react2['default'].createElement(
          'span',
          { className: (0, _classnames2['default'])({ 'text-disabled': !enabled }) },
          name,
          ' (',
          userCount,
          ') ',
          more
        );
        return enabled ? item : _react2['default'].createElement(
          _tooltip2['default'],
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role.disabled.tip' }) },
          item
        );
      }
    }, _this.renderActionColumn = function (text, record) {
      var _this$getPermission = _this.getPermission(),
          organizationId = _this$getPermission.organizationId,
          projectId = _this$getPermission.projectId,
          createService = _this$getPermission.createService,
          deleteService = _this$getPermission.deleteService,
          type = _this$getPermission.type;

      var MemberRoleStore = _this.props.MemberRoleStore;

      if ('roleId' in record || 'email' in record || 'secret' in record) {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: createService
            },
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                placement: 'bottom'
              },
              MemberRoleStore.currentMode === 'user' ? _react2['default'].createElement(_button2['default'], {
                onClick: function onClick() {
                  _this.handleEditRole(record);
                },
                size: 'small',
                shape: 'circle',
                icon: 'mode_edit'
              }) : _react2['default'].createElement(_button2['default'], {
                onClick: function onClick() {
                  _this.handleEditClientRole(record);
                },
                size: 'small',
                shape: 'circle',
                icon: 'mode_edit'
              })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: deleteService,
              type: type,
              organizationId: organizationId,
              projectId: projectId
            },
            _react2['default'].createElement(
              _tooltip2['default'],
              {
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'remove' }),
                placement: 'bottom'
              },
              _react2['default'].createElement(_button2['default'], {
                size: 'small',
                shape: 'circle',
                onClick: _this.state.showMember ? _this.handleDelete.bind(_this, record) : _this.deleteRoleByRole.bind(_this, record),
                icon: 'delete'
              })
            )
          )
        );
      }
    }, _this.handleExpandedRowsChange = function (expandedKeys) {
      _this.setState({
        expandedKeys: expandedKeys
      });
    }, _this.handleExpand = function (expand, data) {
      var _data$users = data.users,
          users = _data$users === undefined ? [] : _data$users,
          id = data.id;
      var MemberRoleStore = _this.props.MemberRoleStore;

      if (expand && !users.length) {
        if (MemberRoleStore.currentMode === 'user') {
          _this.roles.loadRoleMemberData(data, {
            current: 1,
            pageSize: _MemberRoleType.pageSize
          }, _this.state.roleMemberFilters, _this.state.roleMemberParams);
        } else {
          _this.roles.loadClientRoleMemberData(data, {
            current: 1,
            pageSize: _MemberRoleType.pageSize
          }, _this.state.clientRoleMemberFilters, _this.state.clientRoleMemberParams);
        }
      }
    }, _this.handleUpload = function () {
      _this.handleUploadInfo(true);
      _this.setState({
        sidebar: true,
        selectType: 'upload'
      });
    }, _this.handleUploadInfo = function (immediately) {
      var MemberRoleStore = _this.props.MemberRoleStore;
      var fileLoading = _this.state.fileLoading;

      var uploadInfo = MemberRoleStore.getUploadInfo || {};
      if (uploadInfo.finished !== null && fileLoading) {
        _this.setState({
          fileLoading: false
        });
      }
      if (immediately) {
        MemberRoleStore.handleUploadInfo();
        return;
      }
      if (uploadInfo.finished !== null) {
        clearInterval(_this.timer);
        return;
      }
      clearInterval(_this.timer);
      _this.timer = setInterval(function () {
        MemberRoleStore.handleUploadInfo();
        _this.init();
      }, 2000);
    }, _this.upload = function (e) {
      e.stopPropagation();
      var MemberRoleStore = _this.props.MemberRoleStore;

      var uploading = MemberRoleStore.getUploading;
      var fileLoading = _this.state.fileLoading;

      if (uploading || fileLoading) {
        return;
      }
      var uploadElement = document.getElementsByClassName('c7n-user-upload-hidden')[0];
      uploadElement.click();
    }, _this.renderTable = function () {
      var showMember = _this.state.showMember;
      var currentMode = _this.props.MemberRoleStore.currentMode;

      var showTable = void 0;
      if (showMember && currentMode === 'user') {
        showTable = _this.renderMemberTable();
      } else if (showMember && currentMode === 'client') {
        showTable = _this.renderClientMemberTable();
      } else if (!showMember && currentMode === 'user') {
        showTable = _this.renderRoleTable();
      } else {
        showTable = _this.renderClientRoleTable();
      }
      return showTable;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(MemberRole, [{
    key: 'getInitState',
    value: function getInitState() {
      var _props = this.props,
          MemberRoleStore = _props.MemberRoleStore,
          AppState = _props.AppState;

      MemberRoleStore.loadCurrentMenuType(AppState.currentMenuType, AppState.getUserId);
      return {
        selectLoading: true,
        loading: true,
        submitting: false,
        sidebar: false,
        selectType: '',
        showMember: true,
        expandedKeys: [], // 角色展开
        roleIds: [],
        overflow: false,
        fileLoading: false,
        createMode: 'user',
        selectRoleMemberKeys: [],
        roleData: MemberRoleStore.getRoleData, // 所有角色
        roleMemberDatas: MemberRoleStore.getRoleMemberDatas, // 用户-角色表数据源
        memberDatas: [], // 用户-成员表数据源
        currentMemberData: [], // 当前成员的角色分配信息
        selectMemberRoles: {},
        selectRoleMembers: [],
        roleMemberFilters: {}, // 用户-角色表格过滤
        roleMemberParams: [], // 用户-角色表格参数
        memberRoleFilters: {}, // 用户-成员表格过滤
        params: [], // 用户-成员表格参数
        memberRolePageInfo: { // 用户-成员表格分页信息
          current: 1,
          total: 0,
          pageSize: _MemberRoleType.pageSize
        },
        roleMemberFilterRole: [],
        clientMemberDatas: [],
        cilentRoleMemberDatas: MemberRoleStore.getClientRoleMemberDatas,
        clientMemberRolePageInfo: { // 客户端-成员表格分页信息
          current: 1,
          total: 0,
          pageSize: _MemberRoleType.pageSize
        },
        clientMemberRoleFilters: {},
        clientMemberParams: [],
        clientRoleMemberFilters: {},
        clientParams: [],
        clientRoleMemberParams: [],
        selectClientMemberRoles: {},
        selectClientRoleMembers: [],
        clientRoleMemberFilterRole: []
      };
    }
  }, {
    key: 'init',
    value: function init() {
      var MemberRoleStore = this.props.MemberRoleStore;

      this.initMemberRole();
      if (MemberRoleStore.currentMode === 'user') {
        this.roles.fetch();
      } else {
        this.roles.fetchClient();
      }
    }

    // 第一次渲染前获得数据

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.init();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSelectContainer();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var MemberRoleStore = this.props.MemberRoleStore;

      this.updateSelectContainer();
      MemberRoleStore.setRoleMemberDatas(this.state.roleMemberDatas);
      MemberRoleStore.setRoleData(this.state.roleData);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.timer);
      clearTimeout(timer);
      var MemberRoleStore = this.props.MemberRoleStore;

      MemberRoleStore.setRoleMemberDatas([]);
      MemberRoleStore.setRoleData([]);
      MemberRoleStore.setCurrentMode('user');
    }
  }, {
    key: 'initMemberRole',
    value: function initMemberRole() {
      this.roles = new _MemberRoleType2['default'](this);
    }

    /**
     * 更改模式
     * @param value 模式
     */

  }, {
    key: 'updateSelectContainer',
    value: function updateSelectContainer() {
      var body = this.sidebarBody;
      if (body) {
        var overflow = this.state.overflow;

        var bodyOverflow = body.clientHeight < body.scrollHeight;
        if (bodyOverflow !== overflow) {
          this.setState({
            overflow: bodyOverflow
          });
        }
      }
    }
  }, {
    key: 'initFormRoleIds',
    value: function initFormRoleIds() {
      var _state = this.state,
          selectType = _state.selectType,
          currentMemberData = _state.currentMemberData;

      var roleIds = [undefined];
      if (selectType === 'edit') {
        roleIds = currentMemberData.roles.map(function (_ref23) {
          var id = _ref23.id;
          return id;
        });
      }
      return roleIds;
    }

    /**
     * 批量移除角色
     */


    /**
     * 删除单个成员或客户端
     * @param record
     */

  }, {
    key: 'getSidebarTitle',
    value: function getSidebarTitle() {
      var selectType = this.state.selectType;

      if (selectType === 'create') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.add' });
      } else if (selectType === 'edit') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.modify' });
      } else if (selectType === 'upload') {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.upload' });
      }
    }
  }, {
    key: 'getSidebarContent',
    value: function getSidebarContent() {
      var _state2 = this.state,
          _state2$roleData = _state2.roleData,
          roleData = _state2$roleData === undefined ? [] : _state2$roleData,
          roleIds = _state2.roleIds,
          selectType = _state2.selectType;

      var disabled = roleIds.findIndex(function (id, index) {
        return id === undefined;
      }) !== -1 || !roleData.filter(function (_ref24) {
        var enabled = _ref24.enabled,
            id = _ref24.id;
        return enabled && roleIds.indexOf(id) === -1;
      }).length;
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        this.getHeader(),
        this.getForm(),
        this.getAddOtherBtn(disabled)
      );
    }
  }, {
    key: 'getHeader',
    value: function getHeader() {
      var _state3 = this.state,
          selectType = _state3.selectType,
          currentMemberData = _state3.currentMemberData;
      var values = this.roles.values;

      var modify = selectType === 'edit';
      return {
        className: 'sidebar-content',
        ref: this.saveSideBarRef,
        code: this.getHeaderCode(),
        values: modify ? { name: currentMemberData.loginName || currentMemberData.name } : values
      };
    }

    /**
     * 渲染创建及修改的表单
     * @returns {*}
     */

  }, {
    key: 'getModeDom',


    /**
     * 渲染表单选择成员类型的节点
     * @returns {null}
     */
    value: function getModeDom() {
      var selectType = this.state.selectType;
      var _props2 = this.props,
          form = _props2.form,
          MemberRoleStore = _props2.MemberRoleStore,
          intl = _props2.intl;
      var getFieldDecorator = form.getFieldDecorator;

      return selectType === 'create' ? _react2['default'].createElement(
        FormItem,
        FormItemNumLayout,
        getFieldDecorator('mode', {
          initialValue: MemberRoleStore.currentMode
        })(_react2['default'].createElement(
          RadioGroup,
          { label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.member.type' }), className: 'c7n-iam-memberrole-radiogroup', onChange: this.changeCreateMode },
          _react2['default'].createElement(
            _radio2['default'],
            { value: 'user' },
            intl.formatMessage({ id: 'memberrole.type.user' })
          ),
          _react2['default'].createElement(
            _radio2['default'],
            { value: 'client' },
            intl.formatMessage({ id: 'memberrole.client' })
          )
        ))
      ) : null;
    }

    /**
     * 渲染表单客户端或用户下拉框的节点
     * @returns {*}
     */

  }, {
    key: 'getProjectNameDom',
    value: function getProjectNameDom() {
      var _this2 = this;

      var _state4 = this.state,
          selectType = _state4.selectType,
          currentMemberData = _state4.currentMemberData,
          createMode = _state4.createMode,
          overflow = _state4.overflow;
      var _props3 = this.props,
          form = _props3.form,
          MemberRoleStore = _props3.MemberRoleStore,
          intl = _props3.intl;
      var getFieldDecorator = form.getFieldDecorator;

      var member = [];
      var style = {
        marginTop: '-15px'
      };
      if (selectType === 'edit') {
        member.push(MemberRoleStore.currentMode === 'user' ? currentMemberData.loginName : currentMemberData.id);
        style.display = 'none';
        return null;
      }

      if (createMode === 'user') {
        return selectType === 'create' && _react2['default'].createElement(
          FormItem,
          FormItemNumLayout,
          getFieldDecorator('member', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: 'memberrole.user.require.msg' })
            }],
            initialValue: selectType === 'create' ? [] : member
          })(_react2['default'].createElement(
            _select2['default'],
            {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.type.user' }),
              optionLabelProp: 'label',
              allowClear: true,
              style: { width: 512 },
              mode: 'multiple',
              optionFilterProp: 'children',
              filterOption: false,
              filter: true,
              getPopupContainer: function getPopupContainer() {
                return overflow ? _this2.sidebarBody : document.body;
              },
              onFilterChange: this.handleSelectFilter,
              notFoundContent: intl.formatMessage({ id: 'memberrole.notfound.msg' }),
              loading: this.state.selectLoading
            },
            this.getUserOption()
          ))
        );
      } else {
        return selectType === 'create' && _react2['default'].createElement(
          FormItem,
          FormItemNumLayout,
          getFieldDecorator('member', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: 'memberrole.client.require.msg' })
            }],
            initialValue: selectType === 'create' ? [] : member
          })(_react2['default'].createElement(
            _select2['default'],
            {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.client' }),
              allowClear: true,
              style: { width: 512 },
              mode: 'multiple',
              optionFilterProp: 'children',
              filterOption: false,
              filter: true,
              getPopupContainer: function getPopupContainer() {
                return overflow ? _this2.sidebarBody : document.body;
              },
              onFilterChange: this.handleSelectFilter,
              notFoundContent: intl.formatMessage({ id: 'memberrole.notfound.msg' }),
              loading: this.state.selectLoading
            },
            this.getClientOption()
          ))
        );
      }
    }

    /**
     * 渲染表单增删角色的节点
     * @returns {any[]}
     */


    // 加载全平台用户信息


    // 加载全平台客户端信息


    // 创建/编辑角色 下拉框的option


    // sidebar 删除角色

  }, {
    key: 'getAddOtherBtn',
    value: function getAddOtherBtn(disabled) {
      return _react2['default'].createElement(
        _button2['default'],
        { type: 'primary', disabled: disabled, className: 'add-other-role', icon: 'add', onClick: this.addRoleList },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.add.other' })
      );
    }

    /**
     *  application/vnd.ms-excel 2003-2007
     *  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 2010
     */


    // ok 按钮保存

  }, {
    key: 'showMemberTable',
    value: function showMemberTable(show) {
      this.reload();
      this.setState({
        showMember: show
      });
    }

    /**
     * 渲染操作列
     * @param text
     * @param record
     * @returns {*}
     */

  }, {
    key: 'renderMemberTable',
    value: function renderMemberTable() {
      var _this3 = this;

      var _state5 = this.state,
          selectMemberRoles = _state5.selectMemberRoles,
          roleMemberDatas = _state5.roleMemberDatas,
          memberRolePageInfo = _state5.memberRolePageInfo,
          memberDatas = _state5.memberDatas,
          memberRoleFilters = _state5.memberRoleFilters,
          loading = _state5.loading;

      var filtersRole = [].concat((0, _toConsumableArray3['default'])(new Set(roleMemberDatas.map(function (_ref25) {
        var name = _ref25.name;
        return name;
      })))).map(function (value) {
        return { value: value, text: value };
      });
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.loginname' }),
        dataIndex: 'loginName',
        key: 'loginName',
        width: '15%',
        filters: [],
        filteredValue: memberRoleFilters.loginName || [],
        render: this.renderSimpleColumn
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.realname' }),
        dataIndex: 'realName',
        key: 'realName',
        width: '15%',
        filters: [],
        filteredValue: memberRoleFilters.realName || [],
        render: this.renderSimpleColumn
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role' }),
        dataIndex: 'roles',
        key: 'roles',
        filters: filtersRole,
        filteredValue: memberRoleFilters.roles || [],
        className: 'memberrole-roles',
        width: '50%',
        render: this.renderRoleColumn
      }, {
        title: '',
        width: '20%',
        align: 'right',
        render: this.renderActionColumn
      }];
      var rowSelection = {
        selectedRowKeys: Object.keys(selectMemberRoles).map(function (key) {
          return Number(key);
        }),
        onChange: function onChange(selectedRowkeys, selectedRecords) {
          _this3.setState({
            selectMemberRoles: selectedRowkeys.reduce(function (data, key, index) {
              data[key] = selectedRecords[index].roles.map(function (_ref26) {
                var id = _ref26.id;
                return id;
              });
              return data;
            }, {})
          });
        }
      };
      return _react2['default'].createElement(_table2['default'], {
        key: 'member-role',
        className: 'member-role-table',
        loading: loading,
        rowSelection: rowSelection,
        pagination: memberRolePageInfo,
        columns: columns,
        filters: this.state.params,
        onChange: this.memberRoleTableChange,
        dataSource: memberDatas,
        filterBarPlaceholder: this.formatMessage('filtertable'),
        rowKey: function rowKey(_ref27) {
          var id = _ref27.id;
          return id;
        },
        noFilter: true
      });
    }
  }, {
    key: 'renderRoleTable',
    value: function renderRoleTable() {
      var _this4 = this;

      var _state6 = this.state,
          roleMemberDatas = _state6.roleMemberDatas,
          roleMemberFilterRole = _state6.roleMemberFilterRole,
          selectRoleMemberKeys = _state6.selectRoleMemberKeys,
          expandedKeys = _state6.expandedKeys,
          roleMemberParams = _state6.roleMemberParams,
          roleMemberFilters = _state6.roleMemberFilters,
          loading = _state6.loading;

      var filtersData = [].concat((0, _toConsumableArray3['default'])(new Set(roleMemberDatas.map(function (_ref28) {
        var name = _ref28.name;
        return name;
      })))).map(function (value) {
        return { value: value, text: value };
      });
      var dataSource = roleMemberDatas;
      if (roleMemberFilterRole && roleMemberFilterRole.length) {
        dataSource = roleMemberDatas.filter(function (_ref29) {
          var name = _ref29.name;
          return roleMemberFilterRole.some(function (role) {
            return name.indexOf(role) !== -1;
          });
        });
      }
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.loginname' }),
        key: 'loginName',
        hidden: true,
        filters: [],
        filteredValue: roleMemberFilters.loginName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.rolemember' }),
        filterTitle: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role' }),
        key: 'name',
        dataIndex: 'name',
        filters: filtersData,
        filteredValue: roleMemberFilterRole || [],
        render: this.renderRoleLoginNameColumn
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.realname' }),
        key: 'realName',
        dataIndex: 'realName',
        filteredValue: roleMemberFilters.realName || [],
        filters: []
      }, {
        title: '',
        width: 100,
        align: 'right',
        render: this.renderActionColumn
      }];
      var rowSelection = {
        type: 'checkbox',
        selectedRowKeys: selectRoleMemberKeys,
        getCheckboxProps: function getCheckboxProps(_ref30) {
          var loginName = _ref30.loginName;
          return {
            disabled: !loginName
          };
        },
        onChange: function onChange(newSelectRoleMemberKeys, newSelectRoleMembers) {
          _this4.setState({
            selectRoleMemberKeys: newSelectRoleMemberKeys,
            selectRoleMembers: newSelectRoleMembers
          });
        }
      };
      return _react2['default'].createElement(_table2['default'], {
        key: 'role-member',
        loading: loading,
        rowSelection: rowSelection,
        expandedRowKeys: expandedKeys,
        className: 'role-member-table',
        pagination: false,
        columns: columns,
        filters: roleMemberParams,
        indentSize: 0,
        dataSource: dataSource,
        rowKey: function rowKey(_ref31) {
          var _ref31$roleId = _ref31.roleId,
              roleId = _ref31$roleId === undefined ? '' : _ref31$roleId,
              id = _ref31.id;
          return [roleId, id].join('-');
        },
        childrenColumnName: 'users',
        onChange: this.roleMemberTableChange,
        onExpand: this.handleExpand,
        onExpandedRowsChange: this.handleExpandedRowsChange,
        filterBarPlaceholder: this.formatMessage('filtertable'),
        noFilter: true

      });
    }
  }, {
    key: 'renderClientMemberTable',
    value: function renderClientMemberTable() {
      var _this5 = this;

      var _state7 = this.state,
          selectMemberRoles = _state7.selectMemberRoles,
          cilentRoleMemberDatas = _state7.cilentRoleMemberDatas,
          clientMemberRolePageInfo = _state7.clientMemberRolePageInfo,
          clientMemberDatas = _state7.clientMemberDatas,
          clientMemberRoleFilters = _state7.clientMemberRoleFilters,
          loading = _state7.loading;

      var filtersRole = [].concat((0, _toConsumableArray3['default'])(new Set(cilentRoleMemberDatas.map(function (_ref32) {
        var name = _ref32.name;
        return name;
      })))).map(function (value) {
        return { value: value, text: value };
      });
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.client' }),
        dataIndex: 'name',
        key: 'name',
        filters: [],
        filteredValue: clientMemberRoleFilters.name || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role' }),
        dataIndex: 'roles',
        key: 'roles',
        filters: filtersRole,
        filteredValue: clientMemberRoleFilters.roles || [],
        className: 'memberrole-roles',
        width: '60%',
        render: this.renderRoleColumn
      }, {
        title: '',
        width: 100,
        align: 'right',
        render: this.renderActionColumn
      }];
      var rowSelection = {
        selectedRowKeys: Object.keys(selectMemberRoles).map(function (key) {
          return Number(key);
        }),
        onChange: function onChange(selectedRowkeys, selectedRecords) {
          _this5.setState({
            selectMemberRoles: selectedRowkeys.reduce(function (data, key, index) {
              data[key] = selectedRecords[index].roles.map(function (_ref33) {
                var id = _ref33.id;
                return id;
              });
              return data;
            }, {})
          });
        }
      };
      return _react2['default'].createElement(_table2['default'], {
        key: 'client-member-role',
        className: 'member-role-table',
        loading: loading,
        rowSelection: rowSelection,
        pagination: clientMemberRolePageInfo,
        columns: columns,
        filters: this.state.clientParams,
        onChange: this.clientMemberRoleTableChange,
        dataSource: clientMemberDatas,
        filterBarPlaceholder: this.formatMessage('filtertable'),
        rowKey: function rowKey(_ref34) {
          var id = _ref34.id;
          return id;
        },
        noFilter: true
      });
    }
  }, {
    key: 'renderClientRoleTable',
    value: function renderClientRoleTable() {
      var _this6 = this;

      var _state8 = this.state,
          cilentRoleMemberDatas = _state8.cilentRoleMemberDatas,
          clientRoleMemberFilterRole = _state8.clientRoleMemberFilterRole,
          selectRoleMemberKeys = _state8.selectRoleMemberKeys,
          expandedKeys = _state8.expandedKeys,
          clientRoleMemberParams = _state8.clientRoleMemberParams,
          clientRoleMemberFilters = _state8.clientRoleMemberFilters,
          loading = _state8.loading;

      var filtersData = [].concat((0, _toConsumableArray3['default'])(new Set(cilentRoleMemberDatas.map(function (_ref35) {
        var name = _ref35.name;
        return name;
      })))).map(function (value) {
        return { value: value, text: value };
      });
      var dataSource = cilentRoleMemberDatas;
      if (clientRoleMemberFilterRole && clientRoleMemberFilterRole.length) {
        dataSource = cilentRoleMemberDatas.filter(function (_ref36) {
          var name = _ref36.name;
          return clientRoleMemberFilterRole.some(function (role) {
            return name.indexOf(role) !== -1;
          });
        });
      }
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.client' }),
        key: 'clientName',
        hidden: true,
        filters: [],
        filteredValue: clientRoleMemberFilters.clientName || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.roleclient' }),
        filterTitle: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role' }),
        key: 'name',
        dataIndex: 'name',
        filters: filtersData,
        filteredValue: clientRoleMemberFilterRole || [],
        render: this.renderRoleClientNameColumn
      }, {
        title: '',
        width: 100,
        align: 'right',
        render: this.renderActionColumn
      }];

      var rowSelection = {
        type: 'checkbox',
        selectedRowKeys: selectRoleMemberKeys,
        getCheckboxProps: function getCheckboxProps(_ref37) {
          var secret = _ref37.secret;
          return {
            disabled: !secret
          };
        },
        onChange: function onChange(newSelectRoleMemberKeys, newSelectRoleMembers) {
          _this6.setState({
            selectRoleMemberKeys: newSelectRoleMemberKeys,
            selectRoleMembers: newSelectRoleMembers
          });
        }
      };
      return _react2['default'].createElement(_table2['default'], {
        key: 'client-role-member',
        loading: loading,
        rowSelection: rowSelection,
        className: 'role-member-table',
        pagination: false,
        columns: columns,
        filters: clientRoleMemberParams,
        indentSize: 0,
        dataSource: dataSource,
        rowKey: function rowKey(_ref38) {
          var _ref38$roleId = _ref38.roleId,
              roleId = _ref38$roleId === undefined ? '' : _ref38$roleId,
              id = _ref38.id;
          return [roleId, id].join('-');
        },
        childrenColumnName: 'users',
        onChange: this.clientRoleMemberTableChange,
        onExpand: this.handleExpand,
        onExpandedRowsChange: this.handleExpandedRowsChange,
        filterBarPlaceholder: this.formatMessage('filtertable'),
        noFilter: true
      });
    }

    /**
     * 角色表格展开控制
     * @param expand Boolean 是否展开
     * @param data 展开行数据
     */


    /**
     * 上传按钮点击时触发
     */


    /**
     * immediately为false时设置2秒查询一次接口，若有更新删除定时器并更新列表
     * @param immediately
     */

  }, {
    key: 'renderLoading',
    value: function renderLoading() {
      var formatMessage = this.props.intl.formatMessage;
      var fileLoading = this.state.fileLoading;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-user-uploading-container', key: 'c7n-user-uploading-container' },
        _react2['default'].createElement(
          'div',
          { className: 'loading' },
          _react2['default'].createElement(_spin2['default'], { size: 'large' })
        ),
        _react2['default'].createElement(
          'p',
          { className: 'text' },
          formatMessage({
            id: intlPrefix + '.' + (fileLoading ? 'fileloading' : 'uploading') + '.text' })
        ),
        !fileLoading && _react2['default'].createElement(
          'p',
          { className: 'tip' },
          formatMessage({ id: intlPrefix + '.uploading.tip' })
        )
      );
    }
  }, {
    key: 'getMemberRoleClass',
    value: function getMemberRoleClass(name) {
      var showMember = this.state.showMember;

      return (0, _classnames2['default'])({ active: name === 'role' ^ showMember });
    }
  }, {
    key: 'getPermission',
    value: function getPermission() {
      var AppState = this.props.AppState;
      var type = AppState.currentMenuType.type;

      var createService = ['iam-service.role-member.createOrUpdateOnSiteLevel'];
      var deleteService = ['iam-service.role-member.deleteOnSiteLevel'];
      var importService = ['iam-service.role-member.import2MemberRoleOnSite'];
      if (type === 'organization') {
        createService = ['iam-service.role-member.createOrUpdateOnOrganizationLevel'];
        deleteService = ['iam-service.role-member.deleteOnOrganizationLevel'];
        importService = ['iam-service.role-member.import2MemberRoleOnOrganization'];
      } else if (type === 'project') {
        createService = ['iam-service.role-member.createOrUpdateOnProjectLevel'];
        deleteService = ['iam-service.role-member.deleteOnProjectLevel'];
        importService = ['iam-service.role-member.import2MemberRoleOnProject'];
      }
      return {
        createService: createService,
        deleteService: deleteService,
        importService: importService
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var _props4 = this.props,
          MemberRoleStore = _props4.MemberRoleStore,
          intl = _props4.intl;
      var _state9 = this.state,
          sidebar = _state9.sidebar,
          selectType = _state9.selectType,
          roleData = _state9.roleData,
          showMember = _state9.showMember,
          selectMemberRoles = _state9.selectMemberRoles,
          selectRoleMemberKeys = _state9.selectRoleMemberKeys,
          submitting = _state9.submitting,
          fileLoading = _state9.fileLoading;

      var uploading = MemberRoleStore.getUploading;
      var okText = selectType === 'create' ? this.formatMessage('add') : this.formatMessage('save');

      var _getPermission = this.getPermission(),
          createService = _getPermission.createService,
          deleteService = _getPermission.deleteService,
          importService = _getPermission.importService;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.role-member.createOrUpdateOnSiteLevel', 'iam-service.role-member.deleteOnSiteLevel', 'iam-service.role-member.createOrUpdateOnOrganizationLevel', 'iam-service.role-member.deleteOnOrganizationLevel', 'iam-service.role-member.createOrUpdateOnProjectLevel', 'iam-service.role-member.deleteOnProjectLevel', 'iam-service.role-member.pagingQueryUsersByRoleIdOnOrganizationLevel', 'iam-service.role-member.listRolesWithUserCountOnOrganizationLevel', 'iam-service.role-member.pagingQueryUsersWithOrganizationLevelRoles', 'iam-service.role-member.pagingQueryUsersByRoleIdOnProjectLevel', 'iam-service.role-member.listRolesWithUserCountOnProjectLevel', 'iam-service.role-member.pagingQueryUsersWithProjectLevelRoles', 'iam-service.role-member.pagingQueryUsersByRoleIdOnSiteLevel', 'iam-service.role-member.listRolesWithUserCountOnSiteLevel', 'iam-service.role-member.pagingQueryUsersWithSiteLevelRoles', 'iam-service.role-member.listRolesWithClientCountOnSiteLevel', 'iam-service.role-member.listRolesWithClientCountOnSiteLevel', 'iam-service.role-member.pagingQueryClientsWithSiteLevelRoles', 'iam-service.role-member.listRolesWithClientCountOnOrganizationLevel', 'iam-service.role-member.pagingQueryClientsByRoleIdOnOrganizationLevel', 'iam-service.role-member.pagingQueryClientsWithOrganizationLevelRoles', 'iam-service.role-member.listRolesWithClientCountOnProjectLevel', 'iam-service.role-member.pagingQueryClientsWithProjectLevelRoles', 'iam-service.role-member.pagingQueryClientsByRoleIdOnProjectLevel', 'iam-service.role-member.queryAllUsers', 'iam-service.role-member.queryAllClients']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: this.roles.code + '.header.title' }) },
          _react2['default'].createElement(
            _select2['default'],
            {
              value: MemberRoleStore.currentMode,
              dropdownClassName: 'c7n-memberrole-select-dropdown',
              className: 'c7n-memberrole-select',
              onChange: this.changeMode
            },
            _react2['default'].createElement(
              Option,
              { value: 'user', key: 'user' },
              intl.formatMessage({ id: 'memberrole.type.user' })
            ),
            _react2['default'].createElement(
              Option,
              { value: 'client', key: 'client' },
              intl.formatMessage({ id: 'memberrole.client' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: createService
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.createRole,
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: importService
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'get_app',
                style: { display: MemberRoleStore.currentMode === 'user' ? 'inline' : 'none' },
                onClick: this.handleDownLoad
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'download.template' }),
              _react2['default'].createElement('a', { id: 'c7n-user-download-template', href: '', onClick: function onClick(event) {
                  event.stopPropagation();
                }, download: 'roleAssignment.xlsx' })
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'file_upload',
                style: { display: MemberRoleStore.currentMode === 'user' ? 'inline' : 'none' },
                onClick: this.handleUpload
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'upload.file' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: deleteService
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.deleteRoleByMultiple,
                icon: 'delete',
                disabled: !(showMember ? Object.keys(selectMemberRoles) : selectRoleMemberKeys).length
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'remove' })
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
            code: this.roles.code,
            values: this.roles.values
          },
          _react2['default'].createElement(
            'div',
            { className: 'member-role-btns' },
            _react2['default'].createElement(
              'span',
              { className: 'text' },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.view' }),
              '\uFF1A'
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                className: this.getMemberRoleClass('member'),
                onClick: function onClick() {
                  _this7.showMemberTable(true);
                },
                type: 'primary'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.member' })
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                className: this.getMemberRoleClass('role'),
                onClick: function onClick() {
                  _this7.showMemberTable(false);
                },
                type: 'primary'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'memberrole.role' })
            )
          ),
          this.renderTable(),
          _react2['default'].createElement(
            Sidebar,
            {
              title: this.getSidebarTitle(),
              visible: sidebar,
              okText: selectType === 'upload' ? this.getUploadOkText() : okText,
              confirmLoading: uploading || fileLoading || submitting,
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: selectType === 'upload' ? 'close' : 'cancel' }),
              onOk: selectType === 'upload' ? this.upload : this.handleOk,
              onCancel: this.closeSidebar
            },
            roleData.length && this.state.selectType !== 'upload' ? this.getSidebarContent() : null,
            this.state.selectType === 'upload' ? this.renderUpload() : null
          )
        )
      );
    }
  }]);
  return MemberRole;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = MemberRole;
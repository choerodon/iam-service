'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _upload = require('choerodon-ui/lib/upload');

var _upload2 = _interopRequireDefault(_upload);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/upload/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _UserEdit = require('./UserEdit');

var _UserEdit2 = _interopRequireDefault(_UserEdit);

require('./User.scss');

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sidebar = _modal2['default'].Sidebar;

var intlPrefix = 'organization.user';

var User = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(User, _Component);

  function User() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, User);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadUser();
      });
    }, _this.onEdit = function (id) {
      _this.setState({
        visible: true,
        status: 'modify',
        selectedData: id
      });
    }, _this.loadUser = function (paginationIn, sortIn, filtersIn, paramsIn) {
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          UserStore = _this$props.UserStore;
      var _this$state = _this.state,
          paginationState = _this$state.pagination,
          sortState = _this$state.sort,
          filtersState = _this$state.filters,
          paramsState = _this$state.params;
      var id = AppState.currentMenuType.id;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      // 防止标签闪烁
      _this.setState({ filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        UserStore.setUsers([]);
        _this.setState({
          pagination: {
            total: 0
          },
          params: params,
          sort: sort
        });
        return;
      }

      UserStore.loadUsers(id, pagination, sort, filters, params).then(function (data) {
        UserStore.setUsers(data.content);
        _this.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          params: params,
          sort: sort
        });
      })['catch'](function (error) {
        return Choerodon.handleResponseError(error);
      });
    }, _this.handleCreate = function () {
      _this.setState({
        visible: true,
        status: 'create'
      });
    }, _this.handleUnLock = function (record) {
      var _this$props2 = _this.props,
          AppState = _this$props2.AppState,
          UserStore = _this$props2.UserStore,
          intl = _this$props2.intl;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      UserStore.unLockUser(organizationId, record.id).then(function () {
        Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.unlock.success' }));
        _this.loadUser();
      })['catch'](function (error) {
        Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.unlock.failed' }));
      });
    }, _this.handleAble = function (record) {
      var _this$props3 = _this.props,
          UserStore = _this$props3.UserStore,
          AppState = _this$props3.AppState,
          intl = _this$props3.intl;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      if (record.enabled) {
        // 禁用
        UserStore.UnenableUser(organizationId, record.id, !record.enabled).then(function () {
          Choerodon.prompt(intl.formatMessage({ id: 'disable.success' }));
          _this.loadUser();
        })['catch'](function (error) {
          Choerodon.prompt(intl.formatMessage({ id: 'disable.error' }));
        });
      } else {
        UserStore.EnableUser(organizationId, record.id, !record.enabled).then(function () {
          Choerodon.prompt(intl.formatMessage({ id: 'enable.success' }));
          _this.loadUser();
        })['catch'](function (error) {
          Choerodon.prompt(intl.formatMessage({ id: 'enable.error' }));
        });
      }
    }, _this.handleReset = function (record) {
      var intl = _this.props.intl;
      var loginName = record.loginName;
      var _this$props4 = _this.props,
          UserStore = _this$props4.UserStore,
          AppState = _this$props4.AppState;

      var organizationId = AppState.currentMenuType.id;
      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.reset.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.reset.content' }, { loginName: loginName }),
        onOk: function onOk() {
          return UserStore.resetUserPwd(organizationId, record.id).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.reset.success' }));
            }
          })['catch'](function () {
            Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.reset.failed' }));
          });
        }
      });
    }, _this.changeLanguage = function (code) {
      if (code === 'zh_CN') {
        return '简体中文';
      } else if (code === 'en_US') {
        return 'English';
      }
      return null;
    }, _this.handleDownLoad = function (organizationId) {
      var UserStore = _this.props.UserStore;

      UserStore.downloadTemplate(organizationId).then(function (result) {
        var blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        var url = window.URL.createObjectURL(blob);
        var linkElement = document.getElementById('c7n-user-download-template');
        linkElement.setAttribute('href', url);
        linkElement.click();
      });
    }, _this.upload = function (e) {
      e.stopPropagation();
      var UserStore = _this.props.UserStore;

      var uploading = UserStore.getUploading;
      var fileLoading = _this.state.fileLoading;

      if (uploading || fileLoading) {
        return;
      }
      var uploadElement = document.getElementsByClassName('c7n-user-upload-hidden')[0];
      uploadElement.click();
    }, _this.handleUpload = function () {
      _this.handleUploadInfo(true);
      _this.setState({
        visible: true,
        status: 'upload'
      });
    }, _this.getUploadProps = function (organizationId) {
      var intl = _this.props.intl;

      return {
        multiple: false,
        name: 'file',
        accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        action: organizationId && process.env.API_HOST + '/iam/v1/organizations/' + organizationId + '/users/batch_import',
        headers: {
          Authorization: 'bearer ' + Choerodon.getCookie('access_token')
        },
        showUploadList: false,
        onChange: function onChange(_ref3) {
          var file = _ref3.file;
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
    }, _this.handleSubmit = function (e) {
      _this.editUser.handleSubmit(e);
    }, _this.handleUploadInfo = function (immediately) {
      var _this$props5 = _this.props,
          UserStore = _this$props5.UserStore,
          _this$props5$AppState = _this$props5.AppState,
          currentMenuType = _this$props5$AppState.currentMenuType,
          userId = _this$props5$AppState.getUserId;
      var organizationId = currentMenuType.id;
      var fileLoading = _this.state.fileLoading;

      var uploadInfo = UserStore.getUploadInfo || {};
      if (uploadInfo.finished !== null && fileLoading) {
        _this.setState({
          fileLoading: false
        });
      }
      if (immediately) {
        UserStore.handleUploadInfo(organizationId, userId);
        return;
      }
      if (uploadInfo.finished !== null) {
        clearInterval(_this.timer);
        return;
      }
      clearInterval(_this.timer);
      _this.timer = setInterval(function () {
        UserStore.handleUploadInfo(organizationId, userId);
        _this.loadUser();
      }, 2000);
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
      var UserStore = _this.props.UserStore;
      var fileLoading = _this.state.fileLoading;

      var uploadInfo = UserStore.getUploadInfo || {};
      var uploading = UserStore.getUploading;
      var container = [];
      if (uploading) {
        container.push(_this.renderLoading());
        _this.handleUploadInfo();
        if (fileLoading) {
          _this.setState({
            fileLoading: false
          });
        }
      } else if (fileLoading) {
        container.push(_this.renderLoading());
      } else if (!uploadInfo.noData) {
        var failedStatus = uploadInfo.finished ? 'detail' : 'error';
        container.push(_react2['default'].createElement(
          'p',
          { key: intlPrefix + '.upload.lasttime' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.upload.lasttime' }),
          uploadInfo.beginTime,
          '\uFF08',
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.upload.spendtime' }),
          _this.getSpentTime(uploadInfo.beginTime, uploadInfo.endTime),
          '\uFF09'
        ), _react2['default'].createElement(
          'p',
          { key: intlPrefix + '.upload.time' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, {
            id: intlPrefix + '.upload.time',
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
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.download.failed.' + failedStatus })
            )
          )
        ));
      } else {
        container.push(_react2['default'].createElement(
          'p',
          { key: intlPrefix + '.upload.norecord' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.upload.norecord' })
        ));
      }
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-user-upload-container' },
        container
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(User, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        submitting: false,
        open: false,
        status: 'create', // 'create' 'edit' 'upload'
        id: '',
        page: 0,
        isLoading: true,
        params: [],
        filters: {},
        pagination: {
          current: 1,
          pageSize: 10,
          total: ''
        },
        sort: 'id,desc',
        visible: false,
        fileLoading: false,
        selectedData: ''
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadUser();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.timer = 0;
    }

    /*
    * 解锁
    * */


    /*
    * 启用停用
    * */


    /**
     * 重置用户密码
     * @param record
     */

  }, {
    key: 'handlePageChange',
    value: function handlePageChange(pagination, filters, _ref4, params) {
      var field = _ref4.field,
          order = _ref4.order;

      var sorter = [];
      if (field) {
        sorter.push(field);
        if (order === 'descend') {
          sorter.push('desc');
        }
      }
      this.loadUser(pagination, sorter.join(','), filters, params);
    }

    /**
     *  application/vnd.ms-excel 2003-2007
     *  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 2010
     */

  }, {
    key: 'getSidebarText',
    value: function getSidebarText() {
      var _state = this.state,
          submitting = _state.submitting,
          status = _state.status,
          fileLoading = _state.fileLoading;
      var UserStore = this.props.UserStore;

      var uploading = UserStore.getUploading;
      if (submitting) {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'loading' });
      } else if (uploading) {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'uploading' });
      } else if (fileLoading) {
        return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.fileloading' });
      }
      return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: status });
    }
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
    key: 'renderUpload',
    value: function renderUpload(organizationId, organizationName) {
      return _react2['default'].createElement(
        _choerodonBootCombine.Content,
        {
          code: intlPrefix + '.upload',
          values: {
            name: organizationName
          },
          className: 'sidebar-content'
        },
        _react2['default'].createElement(
          'div',
          { style: { width: '512px' } },
          this.getUploadInfo()
        ),
        _react2['default'].createElement(
          'div',
          { style: { display: 'none' } },
          _react2['default'].createElement(
            _upload2['default'],
            this.getUploadProps(organizationId),
            _react2['default'].createElement(_button2['default'], { className: 'c7n-user-upload-hidden' })
          )
        )
      );
    }
  }, {
    key: 'renderSideTitle',
    value: function renderSideTitle() {
      var status = this.state.status;

      switch (status) {
        case 'create':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' });
        case 'modify':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify' });
        case 'upload':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.upload' });
        default:
          return '';
      }
    }
  }, {
    key: 'renderSideBar',
    value: function renderSideBar() {
      var _this2 = this;

      var _state2 = this.state,
          selectedData = _state2.selectedData,
          status = _state2.status,
          visible = _state2.visible;

      return _react2['default'].createElement(_UserEdit2['default'], {
        id: selectedData,
        visible: visible,
        edit: status === 'modify',
        onRef: function onRef(node) {
          _this2.editUser = node;
        },
        OnUnchangedSuccess: function OnUnchangedSuccess() {
          _this2.setState({
            visible: false,
            submitting: false
          });
        },
        onSubmit: function onSubmit() {
          _this2.setState({
            submitting: true
          });
        },
        onSuccess: function onSuccess() {
          _this2.setState({
            visible: false,
            submitting: false
          });
          _this2.loadUser();
        },
        onError: function onError() {
          _this2.setState({
            submitting: false
          });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          _props$UserStore = _props.UserStore,
          getUsers = _props$UserStore.getUsers,
          isLoading = _props$UserStore.isLoading,
          _props$AppState = _props.AppState,
          currentMenuType = _props$AppState.currentMenuType,
          getType = _props$AppState.getType,
          intl = _props.intl;
      var _state3 = this.state,
          filters = _state3.filters,
          pagination = _state3.pagination,
          visible = _state3.visible,
          status = _state3.status,
          submitting = _state3.submitting,
          params = _state3.params;
      var organizationId = currentMenuType.id,
          organizationName = currentMenuType.name,
          menuType = currentMenuType.type;


      var type = void 0;
      if (getType) {
        type = getType;
      } else if (sessionStorage.type) {
        type = sessionStorage.type;
      } else {
        type = menuType;
      }
      var data = getUsers.slice() || [];

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.loginname' }),
        dataIndex: 'loginName',
        key: 'loginName',
        width: '20%',
        filters: [],
        filteredValue: filters.loginName || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.15 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.realname' }),
        key: 'realName',
        dataIndex: 'realName',
        width: '20%',
        filters: [],
        filteredValue: filters.realName || [],
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.15 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.source' }),
        key: 'ldap',
        width: '20%',
        render: function render(text, record) {
          return record.ldap ? _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.ldap' }) : _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.notldap' });
        },
        filters: [{
          text: intl.formatMessage({ id: intlPrefix + '.ldap' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.notldap' }),
          value: 'false'
        }],
        filteredValue: filters.ldap || []
      },
      // {
      //   title: <FormattedMessage id={`${intlPrefix}.language`} />,
      //   dataIndex: 'language',
      //   key: 'language',
      //   width: '17%',
      //   render: (text, record) => (
      //     this.changeLanguage(record.language)
      //   ),
      //   filters: [
      //     {
      //       text: '简体中文',
      //       value: 'zh_CN',
      //     }, {
      //       text: 'English',
      //       value: 'en_US',
      //     },
      //   ],
      //   filteredValue: filters.language || [],
      // },
      {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.enabled' }),
        key: 'enabled',
        dataIndex: 'enabled',
        width: '15%',
        render: function render(text) {
          return _react2['default'].createElement(_statusTag2['default'], { mode: 'icon', name: intl.formatMessage({ id: text ? 'enable' : 'disable' }), colorCode: text ? 'COMPLETED' : 'DISABLE' });
        },
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true'
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false'
        }],
        filteredValue: filters.enabled || []
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.locked' }),
        key: 'locked',
        width: '15%',
        render: function render(text, record) {
          return record.locked ? _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.lock' }) : _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.normal' });
        },
        filters: [{
          text: intl.formatMessage({ id: intlPrefix + '.normal' }),
          value: 'false'
        }, {
          text: intl.formatMessage({ id: intlPrefix + '.lock' }),
          value: 'true'
        }],
        filteredValue: filters.locked || []
      }, {
        title: '',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          var actionDatas = [{
            service: ['iam-service.organization-user.update'],
            icon: '',
            text: intl.formatMessage({ id: 'modify' }),
            action: _this3.onEdit.bind(_this3, record.id)
          }];
          if (record.enabled) {
            actionDatas.push({
              service: ['iam-service.organization-user.disableUser'],
              icon: '',
              text: intl.formatMessage({ id: 'disable' }),
              action: _this3.handleAble.bind(_this3, record)
            });
          } else {
            actionDatas.push({
              service: ['iam-service.organization-user.enableUser'],
              icon: '',
              text: intl.formatMessage({ id: 'enable' }),
              action: _this3.handleAble.bind(_this3, record)
            });
          }
          if (record.locked) {
            actionDatas.push({
              service: ['iam-service.organization-user.unlock'],
              icon: '',
              text: intl.formatMessage({ id: intlPrefix + '.unlock' }),
              action: _this3.handleUnLock.bind(_this3, record)
            });
          }
          actionDatas.push({
            service: ['iam-service.organization-user.resetUserPassword'],
            icon: '',
            text: intl.formatMessage({ id: intlPrefix + '.reset' }),
            action: _this3.handleReset.bind(_this3, record)
          });
          return _react2['default'].createElement(_choerodonBootCombine.Action, { data: actionDatas, getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('page-content')[0];
            } });
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.organization-user.create', 'iam-service.organization-user.list', 'iam-service.organization-user.query', 'iam-service.organization-user.update', 'iam-service.organization-user.delete', 'iam-service.organization-user.disableUser', 'iam-service.organization-user.enableUser', 'iam-service.organization-user.unlock', 'iam-service.organization-user.check', 'iam-service.organization-user.resetUserPassword']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.organization-user.create'],
              type: type,
              organizationId: organizationId
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.handleCreate,
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.handleDownLoad.bind(this, organizationId),
              icon: 'get_app'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.download.template' }),
            _react2['default'].createElement('a', { id: 'c7n-user-download-template', href: '', onClick: function onClick(event) {
                event.stopPropagation();
              }, download: 'userTemplate.xlsx' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'file_upload',
              onClick: this.handleUpload
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.upload.file' })
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
            values: { name: organizationName }
          },
          _react2['default'].createElement(_table2['default'], {
            size: 'middle',
            pagination: pagination,
            columns: columns,
            dataSource: data,
            rowKey: 'id',
            onChange: this.handlePageChange.bind(this),
            loading: isLoading,
            filters: params,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: this.renderSideTitle(),
              visible: visible,
              okText: this.getSidebarText(),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: status === 'upload' ? 'close' : 'cancel' }),
              onOk: status === 'upload' ? this.upload : this.handleSubmit,
              onCancel: function onCancel() {
                _this3.setState({
                  visible: false,
                  selectedData: ''
                });
              },
              confirmLoading: submitting
            },
            status === 'upload' ? this.renderUpload(organizationId, organizationName) : this.renderSideBar()
          )
        )
      );
    }
  }]);
  return User;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = User;
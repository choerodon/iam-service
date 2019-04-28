'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var UserStore = (_dec = (0, _choerodonBootCombine.store)('UserStore'), _dec(_class = (_class2 = function () {

  /**
   * 上传状态
   */


  /* 用户列表 */
  function UserStore() {
    var _this = this;

    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, UserStore);

    _initDefineProp(this, 'isLoading', _descriptor, this);

    _initDefineProp(this, 'passwordPolicy', _descriptor2, this);

    _initDefineProp(this, 'userInfo', _descriptor3, this);

    _initDefineProp(this, 'language', _descriptor4, this);

    _initDefineProp(this, 'organization', _descriptor5, this);

    _initDefineProp(this, 'timeZone', _descriptor6, this);

    _initDefineProp(this, 'checkEmail', _descriptor7, this);

    _initDefineProp(this, 'users', _descriptor8, this);

    _initDefineProp(this, 'totalSize', _descriptor9, this);

    _initDefineProp(this, 'totalPage', _descriptor10, this);

    _initDefineProp(this, 'uploading', _descriptor11, this);

    _initDefineProp(this, 'uploadInfo', _descriptor12, this);

    this.handleUploadInfo = function (organizationId, userId) {
      var timestamp = new Date().getTime();
      _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/users/' + userId + '/upload/history?t=' + timestamp).then(function (data) {
        if (!data) {
          _this.setUploadInfo({ noData: true });
          _this.setUploading(false);
          return;
        }
        _this.setUploadInfo(data);
        _this.setUploading(!data.endTime);
      });
    };

    this.loadPasswordPolicy = function () {
      return _choerodonBootCombine.axios.get('/iam/v1/passwordPolicies/querySelf').then(function (data) {
        if (data) {
          _this.setPasswordPolicy(data);
        }
      });
    };

    this.updatePassword = function (originPassword, hashedPassword) {
      return _choerodonBootCombine.axios.put('/iam/v1/password/updateSelf?originPassword=' + originPassword + '&password=' + hashedPassword);
    };

    this.loadUserInfo = function () {
      _this.setIsLoading(true);
      return _choerodonBootCombine.axios.get('/iam/v1/users/self').then(function (data) {
        if (data) {
          _this.setUserInfo(data);
        }
        _this.setIsLoading(false);
      });
    };

    this.checkEmails = function (id, email) {
      return _choerodonBootCombine.axios.get('/iam/v1/organization/' + id + '/users/checkEmail?email=' + email);
    };

    this.updateUserInfo = function (user) {
      return _choerodonBootCombine.axios.put('/iam/v1/users/' + _this.userInfo.id + '/updateSelf', JSON.stringify(user));
    };

    this.EnableUser = function (orgId, userId, data) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + orgId + '/users/' + userId + '/enable');
    };

    this.UnenableUser = function (orgId, userId, data) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + orgId + '/users/' + userId + '/disable');
    };

    this.resetUserPwd = function (orgId, userId) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + orgId + '/users/' + userId + '/reset');
    };

    this.loadUsers = function (organizationId, page, sortParam, _ref, param) {
      var loginName = _ref.loginName,
          realName = _ref.realName,
          ldap = _ref.ldap,
          language = _ref.language,
          enabled = _ref.enabled,
          locked = _ref.locked;

      _this.setIsLoading(true);
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/users/search?page=' + (page.current - 1) + '&size=' + page.pageSize + '&sort=' + sortParam, JSON.stringify({
        loginName: loginName && loginName[0],
        realName: realName && realName[0],
        ldap: ldap && ldap[0],
        language: language && language[0],
        enabled: enabled && enabled[0],
        locked: locked && locked[0],
        param: param
      })).then(function (data) {
        _this.setIsLoading(false);
        return data;
      });
    };

    this.deleteUserById = function (organizationId, id) {
      return _choerodonBootCombine.axios['delete']('/iam/v1/organizations/' + organizationId + '/users/' + id);
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  /* 密码策略用于修改密码时校验 */


  (0, _createClass3['default'])(UserStore, [{
    key: 'setIsLoading',
    value: function setIsLoading(flag) {
      this.isLoading = flag;
    }
  }, {
    key: 'setPasswordPolicy',
    value: function setPasswordPolicy(data) {
      this.passwordPolicy = data;
    }
  }, {
    key: 'setUserInfo',
    value: function setUserInfo(data) {
      this.userInfo = data;
    }
  }, {
    key: 'setLanguage',
    value: function setLanguage(data) {
      this.language = data;
    }
  }, {
    key: 'setOrganization',
    value: function setOrganization(data) {
      this.organization = data;
    }
  }, {
    key: 'setTimeZone',
    value: function setTimeZone(data) {
      this.timeZone = data;
    }
  }, {
    key: 'setCheckEmail',
    value: function setCheckEmail(data) {
      this.checkEmail = data;
    }
  }, {
    key: 'setUsers',
    value: function setUsers(data) {
      this.users = data;
    }
  }, {
    key: 'setTotalSize',
    value: function setTotalSize(totalSize) {
      this.totalSize = totalSize;
    }
  }, {
    key: 'setTotalPage',
    value: function setTotalPage(totalPage) {
      this.totalPage = totalPage;
    }
  }, {
    key: 'setUploading',
    value: function setUploading(flag) {
      this.uploading = flag;
    }
  }, {
    key: 'setUploadInfo',
    value: function setUploadInfo(info) {
      this.uploadInfo = info;
    }

    /**
     * 下载文件
     */

  }, {
    key: 'downloadTemplate',
    value: function downloadTemplate(organizationId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/users/download_templates', {
        responseType: 'arraybuffer'
      });
    }
  }, {
    key: 'unLockUser',
    value: function unLockUser(orgId, UserId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + orgId + '/users/' + UserId + '/unlock');
    }

    // 用户信息维护


    // 加载用户列表

  }, {
    key: 'getIsLoading',
    get: function get() {
      return this.isLoading;
    }
  }, {
    key: 'getUserInfo',
    get: function get() {
      return this.userInfo;
    }
  }, {
    key: 'getTimeZone',
    get: function get() {
      return this.timeZone;
    }
  }, {
    key: 'getUsers',
    get: function get() {
      return this.users;
    }
  }, {
    key: 'getTotalSize',
    get: function get() {
      return this.totalSize;
    }
  }, {
    key: 'getTotalPage',
    get: function get() {
      return this.totalPage;
    }

    // upload

  }, {
    key: 'getUploading',
    get: function get() {
      return this.uploading;
    }
  }, {
    key: 'getUploadInfo',
    get: function get() {
      return this.uploadInfo;
    }
  }]);
  return UserStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'isLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'passwordPolicy', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'userInfo', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'language', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'organization', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'timeZone', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'checkEmail', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'users', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'totalSize', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'totalPage', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'uploading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'uploadInfo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      noData: true
    };
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setIsLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPasswordPolicy', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPasswordPolicy'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUserInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLanguage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLanguage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setOrganization', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setOrganization'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTimeZone', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTimeZone'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTimeZone', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTimeZone'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCheckEmail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCheckEmail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUsers', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUsers'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUsers', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUsers'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalSize', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUploading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUploading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUploading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUploading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUploadInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUploadInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUploadInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUploadInfo'), _class2.prototype)), _class2)) || _class);


var userStore = new UserStore();

exports['default'] = userStore;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

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

/**
 * 当要改写 src/app/iam/containers/global/member-role/MemberRoleType.js中的内容时可以逐步把用到的东西移到store里
 */
var MemberRoleStore = (_dec = (0, _choerodonBootCombine.store)('MemberRoleStore'), _dec(_class = (_class2 = function () {
  function MemberRoleStore() {
    (0, _classCallCheck3['default'])(this, MemberRoleStore);

    _initDefineProp(this, 'uploading', _descriptor, this);

    _initDefineProp(this, 'currentMode', _descriptor2, this);

    _initDefineProp(this, 'uploadInfo', _descriptor3, this);

    _initDefineProp(this, 'roleData', _descriptor4, this);

    _initDefineProp(this, 'roleMemberDatas', _descriptor5, this);

    _initDefineProp(this, 'clientRoleMemberDatas', _descriptor6, this);

    _initDefineProp(this, 'usersData', _descriptor7, this);

    _initDefineProp(this, 'clientsData', _descriptor8, this);

    _initDefineProp(this, 'handleUploadInfo', _descriptor9, this);

    this.loadUsers = function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { sort: 'id' };
      return _choerodonBootCombine.axios.get('/iam/v1/all/users?' + _queryString2['default'].stringify(queryObj));
    };

    this.loadClients = function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { sort: 'id' };
      return _choerodonBootCombine.axios.get('/iam/v1/all/clients?' + _queryString2['default'].stringify(queryObj));
    };
  } // 所选模式 默认为用户

  // @observable isShowMember = true; // tab 默认为成员

  // 用户模式下的所有角色

  // 用户-角色表格数据

  // 客户端-角色表格数据

  (0, _createClass3['default'])(MemberRoleStore, [{
    key: 'setUsersData',
    value: function setUsersData(data) {
      this.usersData = data;
    }
  }, {
    key: 'setClientsData',
    value: function setClientsData(data) {
      this.clientsData = data;
    }
  }, {
    key: 'setCurrentMode',
    value: function setCurrentMode(data) {
      this.currentMode = data;
    }
  }, {
    key: 'setRoleData',
    value: function setRoleData(data) {
      this.roleData = data;
    }
  }, {
    key: 'setRoleMemberDatas',
    value: function setRoleMemberDatas(data) {
      this.roleMemberDatas = data;
    }
  }, {
    key: 'setClientRoleMemberDatas',
    value: function setClientRoleMemberDatas(data) {
      this.clientRoleMemberDatas = data;
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
     *
     * @param data  通过AppState.currentMenuType获取的层级、id和name
     */

  }, {
    key: 'loadCurrentMenuType',
    value: function loadCurrentMenuType(data, userId) {
      this.data = data;
      this.userId = userId;
      var _data = this.data,
          type = _data.type,
          id = _data.id,
          name = _data.name;

      var apiGetway = '/iam/v1/' + type + 's/' + id;
      var codePrefix = void 0;
      switch (type) {
        case 'organization':
          codePrefix = 'organization';
          break;
        case 'project':
          codePrefix = 'project';
          break;
        case 'site':
          codePrefix = 'global';
          apiGetway = '/iam/v1/' + type;
          break;
        default:
          break;
      }
      this.code = codePrefix + '.memberrole';
      this.values = { name: name || 'Choerodon' };
      this.urlUsers = apiGetway + '/role_members/users';
      this.urlRoles = apiGetway + '/role_members/users/roles';
      this.urlRoleMember = apiGetway + '/role_members';
      this.urlMemberRole = apiGetway + '/member_role';
      this.urlDeleteMember = apiGetway + '/role_members/delete';
      this.urlUserCount = apiGetway + '/role_members/users/count';
      this.roleId = id || 0;
    }

    /**
     * 下载文件
     */

  }, {
    key: 'downloadTemplate',
    value: function downloadTemplate() {
      return _choerodonBootCombine.axios.get(this.urlRoleMember + '/download_templates', {
        responseType: 'arraybuffer'
      });
    }
  }, {
    key: 'getUsersData',
    get: function get() {
      return this.usersData;
    }
  }, {
    key: 'getClientsData',
    get: function get() {
      return this.clientsData;
    }
  }, {
    key: 'getRoleData',
    get: function get() {
      return this.roleData;
    }
  }, {
    key: 'getRoleMemberDatas',
    get: function get() {
      return this.roleMemberDatas;
    }
  }, {
    key: 'getClientRoleMemberDatas',
    get: function get() {
      return this.clientRoleMemberDatas;
    }
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
  return MemberRoleStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'uploading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'currentMode', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'user';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'uploadInfo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      noData: true
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'roleData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'roleMemberDatas', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'clientRoleMemberDatas', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'usersData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'clientsData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setUsersData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUsersData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUsersData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUsersData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setClientsData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setClientsData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getClientsData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getClientsData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentMode', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentMode'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getRoleData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getRoleData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setRoleData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setRoleData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getRoleMemberDatas', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getRoleMemberDatas'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setRoleMemberDatas', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setRoleMemberDatas'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getClientRoleMemberDatas', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getClientRoleMemberDatas'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setClientRoleMemberDatas', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setClientRoleMemberDatas'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUploading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUploading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUploading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUploading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUploadInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUploadInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUploadInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUploadInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadCurrentMenuType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadCurrentMenuType'), _class2.prototype), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'handleUploadInfo', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this = this;

    return function () {
      var _data2 = _this.data,
          type = _data2.type,
          id = _data2.id,
          name = _data2.name;

      var timestamp = new Date().getTime();
      _choerodonBootCombine.axios.get(_this.urlMemberRole + '/users/' + _this.userId + '/upload/history?t=' + timestamp).then(function (data) {
        if (!data) {
          _this.setUploadInfo({ noData: true });
          _this.setUploading(false);
          return;
        }
        _this.setUploadInfo(data);
        _this.setUploading(!data.endTime);
      });
    };
  }
})), _class2)) || _class);

var memberRoleStore = new MemberRoleStore();
exports['default'] = memberRoleStore;
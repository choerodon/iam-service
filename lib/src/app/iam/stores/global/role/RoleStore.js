'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _difference2 = require('lodash/difference');

var _difference3 = _interopRequireDefault(_difference2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11;

var _mobx = require('mobx');

var _rxjs = require('rxjs');

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

var RoleStore = (_dec = (0, _choerodonBootCombine.store)('RoleStore'), _dec(_class = (_class2 = function () {
  function RoleStore() {
    var _this = this;

    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, RoleStore);

    _initDefineProp(this, 'roles', _descriptor, this);

    _initDefineProp(this, 'isLoading', _descriptor2, this);

    _initDefineProp(this, 'totalPage', _descriptor3, this);

    _initDefineProp(this, 'totalSize', _descriptor4, this);

    _initDefineProp(this, 'canChosePermission', _descriptor5, this);

    _initDefineProp(this, 'wholeServerAndType', _descriptor6, this);

    _initDefineProp(this, 'selectedRolesPermission', _descriptor7, this);

    _initDefineProp(this, 'allRoleLabel', _descriptor8, this);

    _initDefineProp(this, 'chosenLevel', _descriptor9, this);

    _initDefineProp(this, 'permissionPage', _descriptor10, this);

    _initDefineProp(this, 'initSelectedPermission', _descriptor11, this);

    this.loadRoleLabel = function (level) {
      _choerodonBootCombine.axios.get('iam/v1/labels?type=role&level=' + level).then(function (data) {
        _this.setLabel(data);
      })['catch'](function (error) {
        Choerodon.prompt(error);
      });
    };

    this.queryRole = function (state) {
      if (state.code === '') {
        _choerodonBootCombine.axios.get('iam/v1/roles?param=' + state.input + '&page=0&size=10').then(function (data) {
          _this.setRoles(data.content);
        });
      } else {
        _choerodonBootCombine.axios.get('iam/v1/roles?' + state.code + '=' + state.input + '&page=0&size=10').then(function (data) {
          _this.setRoles(data.content);
        });
      }
    };

    this.getSelectedRolePermissions = function (ids) {
      return _choerodonBootCombine.axios.post('iam/v1/permissions', ids);
    };

    this.createRole = function (role) {
      return _choerodonBootCombine.axios.post('iam/v1/roles', role);
    };

    this.getRoleById = function (id) {
      return _choerodonBootCombine.axios.get('iam/v1/roles/' + id);
    };

    this.updateRoleById = function (id, role) {
      return _choerodonBootCombine.axios.put('/iam/v1/roles/' + id, JSON.stringify(role));
    };

    this.deleteRoleById = function (id) {
      return _choerodonBootCombine.axios['delete']('/iam/v1/roles/' + id);
    };

    this.editRoleByid = function (id, data) {
      return _choerodonBootCombine.axios.put('/iam/v1/roles/' + id, data);
    };

    this.enableRole = function (id) {
      return _choerodonBootCombine.axios.put('/iam/v1/roles/' + id + '/enable');
    };

    this.disableRole = function (id) {
      return _choerodonBootCombine.axios.put('/iam/v1/roles/' + id + '/disable');
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  (0, _createClass3['default'])(RoleStore, [{
    key: 'setInitSelectedPermission',
    value: function setInitSelectedPermission(permission) {
      this.initSelectedPermission = permission;
    }
  }, {
    key: 'setChosenLevel',
    value: function setChosenLevel(data) {
      this.chosenLevel = data;
    }
  }, {
    key: 'getSelectedRolePermissionByLevel',
    value: function getSelectedRolePermissionByLevel(level) {
      return this.selectedRolesPermission[level];
    }
  }, {
    key: 'setSelectedRolesPermission',
    value: function setSelectedRolesPermission(data) {
      this.selectedRolesPermission = data;
    }
  }, {
    key: 'pushSelectedRolesPermission',
    value: function pushSelectedRolesPermission(level, data) {
      this.selectedRolesPermission[level].push(data);
    }
  }, {
    key: 'setRoles',
    value: function setRoles(data) {
      this.roles = data;
    }
  }, {
    key: 'setIsLoading',
    value: function setIsLoading(flag) {
      this.isLoading = flag;
    }
  }, {
    key: 'setTotalPage',
    value: function setTotalPage(totalPage) {
      this.totalPage = totalPage;
    }
  }, {
    key: 'setTotalSize',
    value: function setTotalSize(totalSize) {
      this.totalSize = totalSize;
    }
  }, {
    key: 'setPermissionPage',
    value: function setPermissionPage(level, page) {
      this.permissionPage[level] = page;
    }
  }, {
    key: 'checkUserName',
    value: function checkUserName(name) {
      return _choerodonBootCombine.axios.get('/iam/v1/public/role/name?name=' + name);
    }
  }, {
    key: 'handleCanChosePermission',
    value: function handleCanChosePermission(level, data) {
      this.setCanChosePermission(level, data.content);
      this.setPermissionPage(level, {
        current: data.number + 1,
        total: data.totalElements,
        size: data.size
      });
    }
  }, {
    key: 'setCanChosePermission',
    value: function setCanChosePermission(level, data) {
      this.canChosePermission[level] = data;
    }
  }, {
    key: 'changePermissionCheckAllFalse',
    value: function changePermissionCheckAllFalse(level, item) {
      var data = this.canChosePermission;
      var data2 = (0, _difference3['default'])(['site', 'organization', 'project'], [level]);
      for (var a = 0; a < data2.length; a += 1) {
        for (var b = 0; b < data[data2[a]].length; b += 1) {
          // if (level === 'site') {
          //   if (data2[a] !== 'site') {
          //     data[data2[a]][b].check = false;
          //   }
          // } else if (data2[a] === 'site') {
          //   data[data2[a]][b].check = false;
          // }
          data[data2[a]][b].check = false;
        }
      }
      this.setCanChosePermission(data);
      // this.changePermissionCheck(level, item);
    }
  }, {
    key: 'changePermissionCheckAllFalse2',
    value: function changePermissionCheckAllFalse2(level, item) {
      var data = this.canChosePermission;
      var data2 = ['site', 'organization', 'project'];
      for (var a = 0; a < data2.length; a += 1) {
        for (var b = 0; b < data[data2[a]].length; b += 1) {
          if (level === 'site') {
            if (data2[a] !== 'site') {
              data[data2[a]][b].check = false;
            }
          } else if (data2[a] === 'site') {
            data[data2[a]][b].check = false;
          }
        }
      }
      this.setCanChosePermission(data);
      for (var c = 0; c < item.length; c += 1) {
        this.changePermissionCheck(level, item[c]);
      }
    }
  }, {
    key: 'changePermissionCheckByValue',
    value: function changePermissionCheckByValue(level, item, value) {
      var data = this.canChosePermission[level];
      for (var a = 0; a < data.length; a += 1) {
        if (data[a].name === item.name) {
          data[a].check = value;
        }
      }
      this.setCanChosePermission(level, data);
    }
  }, {
    key: 'changePermissionClear',
    value: function changePermissionClear() {
      var data = this.canChosePermission;
      var levels = ['organization', 'project', 'site'];
      (0, _forEach3['default'])(levels, function (item) {
        (0, _forEach3['default'])(data[item], function (item2, index) {
          data[item][index].check = false;
        });
      });
      this.canChosePermission = data;
    }
  }, {
    key: 'changeChosenPermission',
    value: function changeChosenPermission(level, chosen) {
      var data = (0, _mobx.toJS)(this.canChosePermission[level]);
      (0, _forEach3['default'])(data, function (item, index) {
        var flag = 0;
        (0, _forEach3['default'])(chosen, function (item2) {
          if (item.code === item2.code) {
            flag = 1;
          }
        });
        if (flag === 1) {
          data[index].check = true;
        } else {
          data[index].check = false;
        }
      });
      var datas = JSON.parse(JSON.stringify(data));
      this.setCanChosePermission(level, datas);
    }
  }, {
    key: 'changePermissionCheck',
    value: function changePermissionCheck(level, item) {
      var data = this.canChosePermission[level];
      for (var a = 0; a < data.length; a += 1) {
        if (data[a].code === item.code) {
          data[a].check = !data[a].check;
        }
      }
      this.setCanChosePermission(level, data);
    }
  }, {
    key: 'setWholeService',
    value: function setWholeService(data) {
      this.wholeServerAndType = data;
    }
  }, {
    key: 'setLabel',
    value: function setLabel(data) {
      this.allRoleLabel = data;
    }
  }, {
    key: 'getWholePermission',
    value: function getWholePermission(level, page) {
      var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        code: '',
        params: ''
      };

      return _rxjs.Observable.fromPromise(_choerodonBootCombine.axios.get('iam/v1/permissions?level=' + level + '&page=' + (page.current - 1) + '&size=' + page.pageSize + '&code=' + filters.code + '&params=' + filters.params));
    }
  }, {
    key: 'loadRole',
    value: function loadRole(_ref, _ref2, _ref3) {
      var _ref$current = _ref.current,
          current = _ref$current === undefined ? 1 : _ref$current,
          pageSize = _ref.pageSize;
      var columnKey = _ref2.columnKey,
          order = _ref2.order;
      var name = _ref3.name,
          code = _ref3.code,
          level = _ref3.level,
          enabled = _ref3.enabled,
          builtIn = _ref3.builtIn;
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      var body = {
        name: name && name[0],
        code: code && code[0],
        level: level && level[0],
        enabled: enabled && enabled[0],
        builtIn: builtIn && builtIn[0],
        params: params
      };
      var sorter = [];
      if (columnKey) {
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
      }
      this.setIsLoading(true);
      return _choerodonBootCombine.axios.post('/iam/v1/roles/search?page=' + (current - 1) + '&size=' + pageSize + '&sort=' + sorter.join(','), JSON.stringify(body));
    }
  }, {
    key: 'queryDatas',
    value: function queryDatas(_ref4, value) {
      var _this2 = this;

      var _ref5 = (0, _slicedToArray3['default'])(_ref4, 2),
          page = _ref5[0],
          size = _ref5[1];

      var url = '';
      if (typeof value === 'string') {
        url = '&param=' + value;
      } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) === 'object') {
        for (var i = 0; i < value.length; i += 1) {
          url += '&' + value[i].key + '=' + value[i].values;
        }
      }
      this.setIsLoading(true);
      return _choerodonBootCombine.axios.get('/iam/v1/roles?page=' + page + '&size=' + size + url).then(function (data) {
        if (data) {
          _this2.setRoles(data.content);
          _this2.setTotalPage(data.totalPages);
          _this2.setTotalSize(data.totalElements);
        }
        _this2.setIsLoading(false);
      });
    }
  }, {
    key: 'getInitSelectedPermission',
    get: function get() {
      return this.initSelectedPermission;
    }
  }, {
    key: 'getChosenLevel',
    get: function get() {
      return this.chosenLevel;
    }
  }, {
    key: 'getSelectedRolesPermission',
    get: function get() {
      return this.selectedRolesPermission;
    }
  }, {
    key: 'getRoles',
    get: function get() {
      return this.roles.slice();
    }
  }, {
    key: 'getIsLoading',
    get: function get() {
      return this.isLoading;
    }
  }, {
    key: 'getTotalPage',
    get: function get() {
      return this.totalPage;
    }
  }, {
    key: 'getTotalSize',
    get: function get() {
      return this.totalSize;
    }
  }, {
    key: 'getCanChosePermission',
    get: function get() {
      return this.canChosePermission;
    }
  }, {
    key: 'getPermissionPage',
    get: function get() {
      return this.permissionPage;
    }
  }, {
    key: 'getWholeService',
    get: function get() {
      return this.wholeServerAndType;
    }
  }, {
    key: 'getLabel',
    get: function get() {
      return this.allRoleLabel;
    }
  }]);
  return RoleStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'roles', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'isLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'totalPage', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'totalSize', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'canChosePermission', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      site: [],
      organization: [],
      project: []
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'wholeServerAndType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'selectedRolesPermission', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'allRoleLabel', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'chosenLevel', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'permissionPage', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      site: {
        current: 1,
        pageSize: 10,
        total: ''
      },
      organization: {
        current: 1,
        pageSize: 10,
        total: ''
      },
      project: {
        current: 1,
        pageSize: 10,
        total: ''
      }
    };
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'initSelectedPermission', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setInitSelectedPermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setInitSelectedPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getInitSelectedPermission', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getInitSelectedPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setChosenLevel', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setChosenLevel'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getChosenLevel', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getChosenLevel'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSelectedRolesPermission', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSelectedRolesPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSelectedRolesPermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSelectedRolesPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'pushSelectedRolesPermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'pushSelectedRolesPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getRoles', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getRoles'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setRoles', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setRoles'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalSize', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCanChosePermission', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCanChosePermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPermissionPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPermissionPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getPermissionPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getPermissionPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'handleCanChosePermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'handleCanChosePermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCanChosePermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCanChosePermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changePermissionCheckAllFalse', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changePermissionCheckAllFalse'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changePermissionCheckAllFalse2', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changePermissionCheckAllFalse2'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changePermissionCheckByValue', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changePermissionCheckByValue'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changePermissionClear', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changePermissionClear'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changeChosenPermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changeChosenPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changePermissionCheck', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changePermissionCheck'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getWholeService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getWholeService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setWholeService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setWholeService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLabel', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLabel'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLabel', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLabel'), _class2.prototype)), _class2)) || _class);


var roleStore = new RoleStore();

exports['default'] = roleStore;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

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

var RootUserStore = (_dec = (0, _choerodonBootCombine.store)('RootUserStore'), _dec(_class = (_class2 = function () {
  function RootUserStore() {
    (0, _classCallCheck3['default'])(this, RootUserStore);

    _initDefineProp(this, 'loading', _descriptor, this);

    _initDefineProp(this, 'rootUserData', _descriptor2, this);

    _initDefineProp(this, 'usersData', _descriptor3, this);

    this.loadUsers = function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { sort: 'id' };
      return _choerodonBootCombine.axios.get('/iam/v1/all/users?' + _queryString2['default'].stringify(queryObj));
    };
  }

  (0, _createClass3['default'])(RootUserStore, [{
    key: 'setRootUserData',
    // 全平台启用用户数据

    value: function setRootUserData(data) {
      this.rootUserData = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(loading) {
      this.loading = loading;
    }
  }, {
    key: 'setUsersData',
    value: function setUsersData(data) {
      this.usersData = data;
    }
  }, {
    key: 'loadRootUserData',
    value: function loadRootUserData(_ref, _ref2, _ref3, params) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var loginName = _ref2.loginName,
          realName = _ref2.realName,
          enabled = _ref2.enabled,
          locked = _ref2.locked;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'id' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'descend' : _ref3$order;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        loginName: loginName,
        realName: realName,
        enabled: enabled,
        locked: locked,
        params: params
      };
      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
        queryObj.sort = sorter.join(',');
      }
      return _choerodonBootCombine.axios.get('/iam/v1/users/admin?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'searchMemberIds',
    value: function searchMemberIds(loginNames) {
      var promises = loginNames.map(function (index) {
        return _choerodonBootCombine.axios.get('/iam/v1/users?login_name=' + index);
      });
      return _choerodonBootCombine.axios.all(promises);
    }
  }, {
    key: 'addRootUser',
    value: function addRootUser(ids) {
      var id = ids.join(',');
      return _choerodonBootCombine.axios.post('/iam/v1/users/admin?id=' + id);
    }
  }, {
    key: 'deleteRootUser',
    value: function deleteRootUser(id) {
      return _choerodonBootCombine.axios['delete']('/iam/v1/users/admin/' + id);
    }
  }, {
    key: 'getRootUserData',
    get: function get() {
      return this.rootUserData;
    }
  }, {
    key: 'getLoading',
    get: function get() {
      return this.loading;
    }
  }, {
    key: 'getUsersData',
    get: function get() {
      return this.usersData;
    }
  }]);
  return RootUserStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'rootUserData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'usersData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setRootUserData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setRootUserData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getRootUserData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getRootUserData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUsersData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUsersData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUsersData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUsersData'), _class2.prototype)), _class2)) || _class);


var rootUserStore = new RootUserStore();

exports['default'] = rootUserStore;
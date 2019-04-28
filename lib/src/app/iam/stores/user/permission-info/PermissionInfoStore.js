'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

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

var PermissionInfoStore = (_dec = (0, _choerodonBootCombine.store)('PermissionInfoStore'), _dec(_class = (_class2 = function () {
  function PermissionInfoStore() {
    (0, _classCallCheck3['default'])(this, PermissionInfoStore);

    _initDefineProp(this, 'permissionData', _descriptor, this);

    _initDefineProp(this, 'loading', _descriptor2, this);

    _initDefineProp(this, 'pagination', _descriptor3, this);

    _initDefineProp(this, 'sort', _descriptor4, this);

    _initDefineProp(this, 'params', _descriptor5, this);

    _initDefineProp(this, 'role', _descriptor6, this);
  }

  (0, _createClass3['default'])(PermissionInfoStore, [{
    key: 'setRole',
    value: function setRole(role) {
      this.role = role;
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var _this = this;

      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.params;
      var id = this.role.id;

      this.loading = true;
      this.params = params;
      return _choerodonBootCombine.axios.get('/iam/v1/users/' + id + '/roles?' + _queryString2['default'].stringify({
        page: pagination.current - 1,
        size: pagination.pageSize,
        params: params.join(',')
      })).then((0, _mobx.action)(function (_ref) {
        var failed = _ref.failed,
            content = _ref.content,
            totalElements = _ref.totalElements;

        if (!failed) {
          _this.permissionData = content;
          _this.pagination = (0, _extends3['default'])({}, pagination, {
            total: totalElements
          });
        }
        _this.loading = false;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this.loading = false;
      }));
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.permissionData = [];
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0
      };
      this.filters = {};
      this.sort = {};
      this.params = [];
    }
  }, {
    key: 'getLoading',
    get: function get() {
      return this.loading;
    }
  }, {
    key: 'getDataSource',
    get: function get() {
      return this.permissionData;
    }
  }]);
  return PermissionInfoStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'permissionData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'pagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'role', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'getLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getDataSource', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getDataSource'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setRole', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setRole'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype)), _class2)) || _class);
exports['default'] = new PermissionInfoStore();
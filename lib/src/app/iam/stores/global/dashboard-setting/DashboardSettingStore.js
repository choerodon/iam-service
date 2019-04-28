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

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _util = require('../../../common/util');

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

var DashboardSettingStore = (_dec = (0, _choerodonBootCombine.store)('DashboardSettingStore'), _dec(_class = (_class2 = function () {
  function DashboardSettingStore() {
    (0, _classCallCheck3['default'])(this, DashboardSettingStore);

    _initDefineProp(this, 'dashboardData', _descriptor, this);

    _initDefineProp(this, 'loading', _descriptor2, this);

    _initDefineProp(this, 'sidebarVisible', _descriptor3, this);

    _initDefineProp(this, 'pagination', _descriptor4, this);

    _initDefineProp(this, 'filters', _descriptor5, this);

    _initDefineProp(this, 'sort', _descriptor6, this);

    _initDefineProp(this, 'params', _descriptor7, this);

    _initDefineProp(this, 'editData', _descriptor8, this);

    _initDefineProp(this, 'needRoles', _descriptor9, this);

    _initDefineProp(this, 'currentRoles', _descriptor10, this);

    _initDefineProp(this, 'roleMap', _descriptor11, this);

    _initDefineProp(this, 'needUpdateRoles', _descriptor12, this);
  }

  (0, _createClass3['default'])(DashboardSettingStore, [{
    key: 'refresh',
    value: function refresh() {
      this.loadData({ current: 1, pageSize: 10 }, {}, {}, []);
    }
  }, {
    key: 'setNeedUpdateRoles',
    value: function setNeedUpdateRoles(flag) {
      this.needUpdateRoles = flag;
    }
  }, {
    key: 'setNeedRoles',
    value: function setNeedRoles(flag) {
      this.needRoles = flag;
    }
  }, {
    key: 'setEditData',
    value: function setEditData(data) {
      this.editData = data;
    }
  }, {
    key: 'showSideBar',
    value: function showSideBar() {
      this.sidebarVisible = true;
    }
  }, {
    key: 'hideSideBar',
    value: function hideSideBar() {
      this.sidebarVisible = false;
    }
  }, {
    key: 'updateData',
    value: function updateData(values) {
      var _this = this;

      this.loading = true;
      var rolesQuery = values.roleIds || this.needUpdateRoles === this.editData.roleIds ? '' : '?update_role=true';
      this.editData.needRoles = this.needRoles;
      return _choerodonBootCombine.axios.post('/iam/v1/dashboards/' + this.editData.id + rolesQuery, JSON.stringify((0, _extends3['default'])({}, this.editData, values))).then((0, _mobx.action)(function (data) {
        (0, _extends3['default'])(_this.editData, data);
        if (_this.editData.roleIds === null) _this.editData.roleIds = values.roleIds; // 在没有更新roleIds的时候data中的roleIds会为空，不修改不应该置为空而是应该不变。
        _this.loading = false;
        _this.sidebarVisible = false;
        _this.needUpdateRoles = false;
        return data;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this.loading = false;
      }));
    }
  }, {
    key: 'dashboardDisable',
    value: function dashboardDisable(record) {
      var _this2 = this;

      return _choerodonBootCombine.axios.post('/iam/v1/dashboards/' + record.id + '?update_role=false', JSON.stringify((0, _extends3['default'])({}, record, { enabled: !record.enabled }))).then(function () {
        return _this2.loadData();
      });
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.filters;

      var _this3 = this;

      var sort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.sort;
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.params;
      var columnKey = sort.columnKey,
          order = sort.order;

      var sorter = [];
      if (columnKey) {
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
      }
      this.loading = true;
      this.filters = filters;
      this.sort = sort;
      this.params = params;
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        this.dashboardData.length = 0;
        this.pagination = {
          current: 1,
          pageSize: 10,
          total: 0
        };
        this.loading = false;
        return;
      }

      return _choerodonBootCombine.axios.get('/iam/v1/dashboards?' + _queryString2['default'].stringify({
        page: pagination.current - 1,
        size: pagination.pageSize,
        name: filters.name,
        code: filters.code,
        level: filters.level,
        enable: filters.enabled,
        namespace: filters.namespace,
        needRoles: filters.needRoles,
        params: params.join(','),
        sort: sorter.join(',')
      })).then((0, _mobx.action)(function (_ref) {
        var failed = _ref.failed,
            content = _ref.content,
            totalElements = _ref.totalElements;

        if (!failed) {
          _this3.dashboardData = content;
          _this3.pagination = (0, _extends3['default'])({}, pagination, {
            total: totalElements
          });
        }
        _this3.loading = false;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this3.loading = false;
      }));
    }
  }]);
  return DashboardSettingStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'dashboardData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'sidebarVisible', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'pagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'editData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'needRoles', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'currentRoles', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'roleMap', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'needUpdateRoles', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setNeedUpdateRoles', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setNeedUpdateRoles'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setNeedRoles', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setNeedRoles'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEditData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEditData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'showSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'showSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hideSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'hideSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'updateData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'updateData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype)), _class2)) || _class);


var dashboardSettingStore = new DashboardSettingStore();

exports['default'] = dashboardSettingStore;
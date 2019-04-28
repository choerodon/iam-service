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

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

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

var ProjectTypeStore = (_dec = (0, _choerodonBootCombine.store)('ProjectTypeStore'), _dec(_class = (_class2 = function () {
  function ProjectTypeStore() {
    (0, _classCallCheck3['default'])(this, ProjectTypeStore);

    _initDefineProp(this, 'projectTypeData', _descriptor, this);

    _initDefineProp(this, 'loading', _descriptor2, this);

    _initDefineProp(this, 'pagination', _descriptor3, this);

    _initDefineProp(this, 'filters', _descriptor4, this);

    _initDefineProp(this, 'sort', _descriptor5, this);

    _initDefineProp(this, 'params', _descriptor6, this);

    _initDefineProp(this, 'editData', _descriptor7, this);

    _initDefineProp(this, 'sidebarVisible', _descriptor8, this);

    _initDefineProp(this, 'sidebarType', _descriptor9, this);
  }

  (0, _createClass3['default'])(ProjectTypeStore, [{
    key: 'setSidebarType',
    value: function setSidebarType(type) {
      this.sidebarType = type;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.loadData({ current: 1, pageSize: 10 }, {}, {}, []);
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
      return _choerodonBootCombine.axios.post('/iam/v1/projects/types/' + this.editData.id, JSON.stringify((0, _extends3['default'])({}, values, {
        id: this.editData.id,
        objectVersionNumber: this.editData.objectVersionNumber
      }))).then((0, _mobx.action)(function (data) {
        _this.loading = false;
        _this.sidebarVisible = false;
        return data;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this.loading = false;
      }));
    }
  }, {
    key: 'createType',
    value: function createType(values) {
      var _this2 = this;

      this.loading = true;
      return _choerodonBootCombine.axios.post('/iam/v1/projects/types', values).then((0, _mobx.action)(function (data) {
        _this2.loading = false;
        _this2.sidebarVisible = false;
        return data;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this2.loading = false;
      }));
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
        this.projectTypeData.length = 0;
        this.pagination = {
          current: 1,
          pageSize: 10,
          total: 0
        };
        this.loading = false;
        return;
      }

      return _choerodonBootCombine.axios.get('/iam/v1/projects/types/paging_query?' + _queryString2['default'].stringify({
        name: filters.name,
        code: filters.code,
        description: filters.description,
        params: params.join(','),
        sort: sorter.join(',')
      })).then((0, _mobx.action)(function (_ref) {
        var failed = _ref.failed,
            content = _ref.content,
            totalElements = _ref.totalElements;

        if (!failed) {
          _this3.projectTypeData = content;
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
  return ProjectTypeStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'projectTypeData', [_mobx.observable], {
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
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'editData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'sidebarVisible', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'sidebarType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'create';
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setSidebarType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSidebarType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEditData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEditData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'showSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'showSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hideSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'hideSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'updateData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'updateData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'createType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'createType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype)), _class2)) || _class);


var projectTypeStore = new ProjectTypeStore();

exports['default'] = projectTypeStore;
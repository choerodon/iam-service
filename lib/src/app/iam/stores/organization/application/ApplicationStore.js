'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _temp, _initialiseProps, _dec, _class2, _desc, _value, _class3, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20;

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

var AppState = _choerodonBootCombine.stores.AppState;
var TreeData = (_temp = _class = function TreeData(data) {
  (0, _classCallCheck3['default'])(this, TreeData);

  _initialiseProps.call(this);

  if (data.length > 0) {
    this.treeDatas = this.dfsAdd(null, data);
  }
}, _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.treeDatas = [];
  this.currentPath = '/';

  this.dfsAdd = function (rootId, data) {
    return data.filter(function (v) {
      return v.parentId === rootId && v.path === '' + _this.currentPath + v.applicationId + '/';
    }).map(function (v) {
      // 保存原路径
      var originPath = '' + _this.currentPath;
      // 当前路径变为原路径+当前id
      _this.currentPath = '' + _this.currentPath + v.applicationId + '/';
      // 递归调用
      var children = _this.dfsAdd(v.applicationId, data);
      // 还原现场
      _this.currentPath = '' + originPath;
      if (children.length > 0) {
        return (0, _extends3['default'])({}, v, { children: children });
      }
      return v;
    });
  };
}, _temp);
var ApplicationStore = (_dec = (0, _choerodonBootCombine.store)('ApplicationStore'), _dec(_class2 = (_class3 = function () {
  (0, _createClass3['default'])(ApplicationStore, [{
    key: 'refresh',

    /**
     * 创建按钮是否正在加载中
     * @type {boolean}
     */


    /**
     * 可选择的数据
     * @type {Array}
     */


    /**
     * 应用清单数据
     * @type {Array}
     */
    value: function refresh() {
      this.loadProject();
      this.loadData();
    }

    /**
     * 组织内的项目数据
     * @type {Array}
     */


    /**
     * 应用树数据
     * @type {Array}
     */

  }, {
    key: 'initSelectedKeys',
    value: function initSelectedKeys() {
      if (this.applicationTreeData.length > 0) {
        if (this.applicationTreeData[0].children && this.applicationTreeData[0].children.length > 0) {
          this.selectedRowKeys = this.applicationTreeData[0].children.map(function (v) {
            return v.applicationId;
          });
        } else {
          this.selectedRowKeys = [];
        }
      } else {
        this.selectedRowKeys = [];
      }
    }
  }, {
    key: 'setSelectedRowKeys',
    value: function setSelectedRowKeys(keys) {
      this.selectedRowKeys = keys;
    }
  }, {
    key: 'getProjectById',
    value: function getProjectById(id) {
      var value = this.projectData.filter(function (v) {
        return v.id === id;
      });
      return value.length > 0 ? value[0] : { name: null, imageUrl: null };
    }
  }, {
    key: 'setEditData',
    value: function setEditData(data) {
      this.editData = data;
    }
  }, {
    key: 'setSubmitting',
    value: function setSubmitting(flag) {
      this.submitting = flag;
    }
  }, {
    key: 'setOperation',
    value: function setOperation(data) {
      this.operation = data;
    }
  }, {
    key: 'showSidebar',
    value: function showSidebar() {
      this.sidebarVisible = true;
    }
  }, {
    key: 'closeSidebar',
    value: function closeSidebar() {
      this.sidebarVisible = false;
    }
  }, {
    key: 'getDataSource',
    get: function get() {
      var _this2 = this;

      return this.applicationData.map(function (v) {
        return (0, _extends3['default'])({}, v, { projectName: _this2.getProjectById(v.projectId).name, imageUrl: _this2.getProjectById(v.projectId).imageUrl });
      });
    }
  }, {
    key: 'getAddListDataSource',
    get: function get() {
      var _this3 = this;

      return this.addListData.map(function (v) {
        return (0, _extends3['default'])({}, v, { projectName: _this3.getProjectById(v.projectId).name, imageUrl: _this3.getProjectById(v.projectId).imageUrl });
      });
    }
  }]);

  function ApplicationStore() {
    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, ApplicationStore);

    _initDefineProp(this, 'applicationData', _descriptor, this);

    _initDefineProp(this, 'applicationTreeData', _descriptor2, this);

    _initDefineProp(this, 'applicationListData', _descriptor3, this);

    _initDefineProp(this, 'projectData', _descriptor4, this);

    _initDefineProp(this, 'addListData', _descriptor5, this);

    _initDefineProp(this, 'selectedRowKeys', _descriptor6, this);

    _initDefineProp(this, 'loading', _descriptor7, this);

    _initDefineProp(this, 'addListLoading', _descriptor8, this);

    _initDefineProp(this, 'listLoading', _descriptor9, this);

    _initDefineProp(this, 'sidebarVisible', _descriptor10, this);

    _initDefineProp(this, 'pagination', _descriptor11, this);

    _initDefineProp(this, 'listPagination', _descriptor12, this);

    _initDefineProp(this, 'addListPagination', _descriptor13, this);

    _initDefineProp(this, 'filters', _descriptor14, this);

    _initDefineProp(this, 'sort', _descriptor15, this);

    _initDefineProp(this, 'params', _descriptor16, this);

    _initDefineProp(this, 'listParams', _descriptor17, this);

    _initDefineProp(this, 'editData', _descriptor18, this);

    _initDefineProp(this, 'operation', _descriptor19, this);

    _initDefineProp(this, 'submitting', _descriptor20, this);

    this.createApplication = function (applicationData) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications', JSON.stringify(applicationData));
    };

    this.updateApplication = function (applicationData, id) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id, JSON.stringify(applicationData));
    };

    this.enableApplication = function (id) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id + '/enable');
    };

    this.disableApplication = function (id) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id + '/disable');
    };

    this.checkApplicationCode = function (codes) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/check', JSON.stringify(codes));
    };

    this.getDetailById = function (id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id);
    };

    this.addToCombination = function (id, ids) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id + '/add_to_combination', JSON.stringify([].concat((0, _toConsumableArray3['default'])(new Set(ids)))));
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  (0, _createClass3['default'])(ApplicationStore, [{
    key: 'loadProject',
    value: function loadProject() {
      var _this4 = this;

      _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/projects?page=-1').then((0, _mobx.action)(function (data) {
        if (!data.failed) {
          _this4.projectData = data.content;
        }
      }));
    }
  }, {
    key: 'loadTreeData',
    value: function loadTreeData(id) {
      var _this5 = this;

      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id + '/descendant').then((0, _mobx.action)(function (data) {
        if (!data.failed) {
          var treeData = new TreeData(data);
          _this5.applicationTreeData = treeData.treeDatas.map(function (v) {
            return (0, _extends3['default'])({}, v, { projectName: _this5.getProjectById(v.projectId).name, imageUrl: _this5.getProjectById(v.projectId).imageUrl });
          });
          _this5.initSelectedKeys();
        }
      }));
    }
  }, {
    key: 'loadListData',
    value: function loadListData() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.listPagination;
      var filters = arguments[1];

      var _this6 = this;

      var sort = arguments[2];
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.listParams;

      this.listLoading = true;
      this.listParams = params;

      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + this.editData.id + '/app_list?' + _queryString2['default'].stringify({
        page: pagination.current - 1,
        size: pagination.pageSize,
        params: params.join(',')
      })).then((0, _mobx.action)(function (_ref) {
        var failed = _ref.failed,
            content = _ref.content,
            totalElements = _ref.totalElements;

        if (!failed) {
          _this6.applicationListData = content;
          _this6.listPagination = (0, _extends3['default'])({}, pagination, {
            total: totalElements
          });
        }
        _this6.listLoading = false;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this6.listLoading = false;
      }));
    }
  }, {
    key: 'loadAddListData',
    value: function loadAddListData(id) {
      var _this7 = this;

      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications/' + id + '/enabled_app').then((0, _mobx.action)(function (data) {
        if (!data.failed) {
          _this7.addListData = data;
        } else {
          Choerodon.prompt(data.message);
        }
      }));
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.filters;

      var _this8 = this;

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

      var queryObj = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        params: params.join(','),
        sort: sorter.join(',')
      };
      ['applicationCategory', 'applicationType', 'name', 'code', 'projectName', 'enabled'].forEach(function (value) {
        if (filters[value] && filters[value].length > 0) queryObj[value] = filters[value];
      });

      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/applications?' + _queryString2['default'].stringify(queryObj)).then((0, _mobx.action)(function (_ref2) {
        var failed = _ref2.failed,
            content = _ref2.content,
            totalElements = _ref2.totalElements;

        if (!failed) {
          _this8.applicationData = content;
          _this8.pagination = (0, _extends3['default'])({}, pagination, {
            total: totalElements
          });
        }
        _this8.loading = false;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this8.loading = false;
      }));
    }

    /**
     * 添加到组合应用中
     * @param id {Number}
     * @param ids {Array}
     * @returns {Promise}
     */

  }]);
  return ApplicationStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class3.prototype, 'applicationData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class3.prototype, 'applicationTreeData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, 'applicationListData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class3.prototype, 'projectData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class3.prototype, 'addListData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class3.prototype, 'selectedRowKeys', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class3.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class3.prototype, 'addListLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class3.prototype, 'listLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class3.prototype, 'sidebarVisible', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class3.prototype, 'pagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class3.prototype, 'listPagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class3.prototype, 'addListPagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class3.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class3.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class3.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class3.prototype, 'listParams', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class3.prototype, 'editData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class3.prototype, 'operation', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor20 = _applyDecoratedDescriptor(_class3.prototype, 'submitting', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class3.prototype, 'initSelectedKeys', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'initSelectedKeys'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setSelectedRowKeys', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setSelectedRowKeys'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getDataSource', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getDataSource'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getAddListDataSource', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getAddListDataSource'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setEditData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setEditData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setSubmitting', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setSubmitting'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setOperation', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setOperation'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'showSidebar', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'showSidebar'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'closeSidebar', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'closeSidebar'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'loadProject', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'loadProject'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'loadTreeData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'loadTreeData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'loadListData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'loadListData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'loadAddListData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'loadAddListData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'loadData'), _class3.prototype)), _class3)) || _class2);


var applicationStore = new ApplicationStore();
exports['default'] = applicationStore;
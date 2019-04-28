'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10; /**
                                                                                                                                                                                       * Created by jinqin.ma on 2017/6/27.
                                                                                                                                                                                       */

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

var AppState = _choerodonBootCombine.stores.AppState;

var isNum = /^\d+$/;

var ProjectStore = (_dec = (0, _choerodonBootCombine.store)('ProjectStore'), _dec(_class = (_class2 = function () {
  function ProjectStore() {
    var _this = this;

    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, ProjectStore);

    _initDefineProp(this, 'projectData', _descriptor, this);

    _initDefineProp(this, 'totalSize', _descriptor2, this);

    _initDefineProp(this, 'totalPage', _descriptor3, this);

    _initDefineProp(this, 'isLoading', _descriptor4, this);

    _initDefineProp(this, 'myRoles', _descriptor5, this);

    _initDefineProp(this, 'projectTypes', _descriptor6, this);

    _initDefineProp(this, 'groupProjects', _descriptor7, this);

    _initDefineProp(this, 'currentGroup', _descriptor8, this);

    _initDefineProp(this, 'optionAgileData', _descriptor9, this);

    _initDefineProp(this, 'disabledTime', _descriptor10, this);

    this.projectRelationNeedRemove = [];

    this.loadProject = function (organizationId, _ref, _ref2, _ref3) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var _ref2$columnKey = _ref2.columnKey,
          columnKey = _ref2$columnKey === undefined ? 'id' : _ref2$columnKey,
          _ref2$order = _ref2.order,
          order = _ref2$order === undefined ? 'descend' : _ref2$order;
      var name = _ref3.name,
          code = _ref3.code,
          typeName = _ref3.typeName,
          enabled = _ref3.enabled,
          params = _ref3.params;

      _this.changeLoading(true);
      var queryObj = {
        page: current - 1,
        size: pageSize,
        name: name,
        code: code,
        enabled: enabled,
        typeName: typeName,
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
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/projects?' + _queryString2['default'].stringify(queryObj));
    };

    this.checkProjectName = function (organizationId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organization/' + organizationId + '/projects/self');
    };

    this.checkProjectCode = function (orgId, codes) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + orgId + '/projects/check', JSON.stringify(codes));
    };

    this.createProject = function (orgId, projectData) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + projectData.organizationId + '/projects', JSON.stringify(projectData));
    };

    this.updateProject = function (organizationId, projectData, id) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + organizationId + '/projects/' + id, JSON.stringify(projectData));
    };

    this.getProjectById = function (organizationId, id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/projects?param=' + id);
    };

    this.saveProjectGroup = function (data) {
      var copyGroupProjects = JSON.parse(JSON.stringify(_this.groupProjects));
      Object.keys(data).forEach(function (k) {
        if (data[k] && isNum.test(data[k])) {
          copyGroupProjects[k].projectId = data[k];
          copyGroupProjects[k].enabled = !!data['enabled-' + k];
          copyGroupProjects[k].startDate = data['startDate-' + k] && data['startDate-' + k].format('YYYY-MM-DD 00:00:00');
          copyGroupProjects[k].endDate = data['endDate-' + k] && data['endDate-' + k].format('YYYY-MM-DD 00:00:00');
          copyGroupProjects[k].parentId = _this.currentGroup.id;
        }
      });
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/project_relations', copyGroupProjects.filter(function (value) {
        return value.projectId !== null;
      }));
    };

    this.getProjectsByGroupId = function (parentId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/project_relations/' + parentId);
    };

    this.axiosDeleteProjectsFromGroup = function () {
      _this.projectRelationNeedRemove.forEach(function (id) {
        _choerodonBootCombine.axios['delete']('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/project_relations/' + id);
      });
      _this.projectRelationNeedRemove = [];
    };

    this.loadProjectTypes = function () {
      return _choerodonBootCombine.axios.get('/iam/v1/projects/types');
    };

    this.loadMyData = function (organizationId, userId) {
      _this.getRolesById(organizationId, userId).then((0, _mobx.action)(function (roles) {
        _this.myRoles = roles;
      }));
    };

    this.clearProjectRelationNeedRemove = function () {
      _this.projectRelationNeedRemove = [];
    };

    this.checkCanEnable = function (id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/project_relations/check/' + id + '/can_be_enabled');
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  (0, _createClass3['default'])(ProjectStore, [{
    key: 'setDisabledTime',
    value: function setDisabledTime(projectId) {
      var _this2 = this;

      if (projectId) {
        return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + AppState.currentMenuType.organizationId + '/project_relations/' + projectId + '/unavailable/under/' + this.currentGroup.id).then((0, _mobx.action)(function (data) {
          _this2.disabledTime[projectId] = data;
        }));
      }
      return false;
    }
  }, {
    key: 'setOptionAgileData',
    value: function setOptionAgileData(data) {
      this.optionAgileData = data.concat(this.groupProjects.map(function (v) {
        return (0, _extends3['default'])({}, v, { name: v.projName, code: v.proCode, id: v.projectId });
      }));
    }
  }, {
    key: 'setCurrentGroup',
    value: function setCurrentGroup(data) {
      this.currentGroup = data;
    }
  }, {
    key: 'removeProjectFromGroup',
    value: function removeProjectFromGroup(index) {
      var delData = this.groupProjects.splice(index, 1)[0];
      if (delData.id) {
        this.deleteProjectFromGroup(delData.id);
        this.optionAgileData.push((0, _extends3['default'])({}, delData, { name: delData.projName, code: delData.projCode, id: delData.projectId }));
        this.optionAgileData = [].concat((0, _toConsumableArray3['default'])(this.optionAgileData));
      }
    }
  }, {
    key: 'addProjectToGroup',
    value: function addProjectToGroup(data) {
      this.groupProjects = [].concat((0, _toConsumableArray3['default'])(this.projectData), [data]);
    }
  }, {
    key: 'setGroupProjects',
    value: function setGroupProjects(data) {
      this.groupProjects = data;
    }
  }, {
    key: 'setGroupProjectByIndex',
    value: function setGroupProjectByIndex(index, data) {
      this.groupProjects[index] = data;
    }
  }, {
    key: 'addNewProjectToGroup',
    value: function addNewProjectToGroup() {
      this.groupProjects = [].concat((0, _toConsumableArray3['default'])(this.groupProjects), [{ projectId: null, startDate: null, endDate: null, enabled: true }]);
    }
  }, {
    key: 'deleteProjectFromGroup',
    value: function deleteProjectFromGroup(projectId) {
      this.groupProjects = this.groupProjects.filter((0, _mobx.action)(function (data) {
        if (data.projectId !== projectId) {
          // this.optionAgileData = this.optionAgileData.toJS().push({ ...data, name: data.projName, code: data.proCode, id: data.projectId });
          return true;
        }
        return false;
      }));

      // 待删除的项目关系，需要等到提交表单的时候再发请求
      this.projectRelationNeedRemove.push(projectId);
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
    key: 'setProjectData',
    value: function setProjectData(data) {
      this.projectData = data;
    }
  }, {
    key: 'changeLoading',
    value: function changeLoading(flag) {
      this.isLoading = flag;
    }
  }, {
    key: 'setProjectTypes',
    value: function setProjectTypes(data) {
      this.projectTypes = data;
    }
  }, {
    key: 'enableProject',
    value: function enableProject(orgId, projectId, data) {
      return data ? _choerodonBootCombine.axios.put('/iam/v1/organizations/' + orgId + '/projects/' + projectId + '/disable') : _choerodonBootCombine.axios.put('/iam/v1/organizations/' + orgId + '/projects/' + projectId + '/enable');
    }
  }, {
    key: 'getRolesById',
    value: function getRolesById(organizationId, userId) {
      return _choerodonBootCombine.axios.get('/iam/v1/projects/' + organizationId + '/role_members/users/' + userId);
    }
  }, {
    key: 'getAgileProject',
    value: function getAgileProject(organizationId, projectId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/projects/' + projectId + '/agile');
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
  }, {
    key: 'getProjectData',
    get: function get() {
      return this.projectData.slice();
    }
  }, {
    key: 'getIsLoading',
    get: function get() {
      return this.isLoading;
    }
  }, {
    key: 'getProjectTypes',
    get: function get() {
      return this.projectTypes;
    }
  }]);
  return ProjectStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'projectData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'totalSize', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'totalPage', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'isLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'myRoles', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'projectTypes', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'groupProjects', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'currentGroup', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'optionAgileData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'disabledTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setDisabledTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setDisabledTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setOptionAgileData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setOptionAgileData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentGroup', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentGroup'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'removeProjectFromGroup', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'removeProjectFromGroup'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'addProjectToGroup', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'addProjectToGroup'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setGroupProjects', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setGroupProjects'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setGroupProjectByIndex', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setGroupProjectByIndex'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'addNewProjectToGroup', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'addNewProjectToGroup'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'deleteProjectFromGroup', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'deleteProjectFromGroup'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalSize', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setProjectData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setProjectData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getProjectData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getProjectData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changeLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changeLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setProjectTypes', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setProjectTypes'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getProjectTypes', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getProjectTypes'), _class2.prototype)), _class2)) || _class);


var projectStore = new ProjectStore();
exports['default'] = projectStore;
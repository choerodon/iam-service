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

var TaskDetailStore = (_dec = (0, _choerodonBootCombine.store)('TaskDetailStore'), _dec(_class = (_class2 = function () {
  function TaskDetailStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, TaskDetailStore);

    _initDefineProp(this, 'data', _descriptor, this);

    _initDefineProp(this, 'service', _descriptor2, this);

    _initDefineProp(this, 'info', _descriptor3, this);

    _initDefineProp(this, 'log', _descriptor4, this);

    _initDefineProp(this, 'currentService', _descriptor5, this);

    _initDefineProp(this, 'classNames', _descriptor6, this);

    _initDefineProp(this, 'currentClassNames', _descriptor7, this);

    _initDefineProp(this, 'currentTask', _descriptor8, this);

    _initDefineProp(this, 'userdata', _descriptor9, this);

    this.getLevelType = function (type, id) {
      return type === 'site' ? '' : '/' + type + 's/' + id;
    };

    this.getRoleLevelType = function (type, id) {
      return type === 'site' ? '/iam/v1/' + type : '/iam/v1/' + type + 's/' + id;
    };

    this.loadService = function (type, id) {
      return _choerodonBootCombine.axios.get('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/methods/services');
    };

    this.loadClass = function (service, type, id) {
      return _choerodonBootCombine.axios.get('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/methods/service?service=' + service);
    };

    this.loadParams = function (classId, type, id) {
      return _choerodonBootCombine.axios.get('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/methods/' + classId);
    };

    this.ableTask = function (taskId, objectVersionNumber, status, type, id) {
      return _choerodonBootCombine.axios.put('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/tasks/' + taskId + '/' + status + '?objectVersionNumber=' + objectVersionNumber);
    };

    this.deleteTask = function (taskId, type, id) {
      return _choerodonBootCombine.axios['delete']('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/tasks/' + taskId);
    };

    this.checkName = function (name, type, id) {
      return _choerodonBootCombine.axios.post('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/tasks/check', name);
    };

    this.createTask = function (body, type, id) {
      return _choerodonBootCombine.axios.post('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/tasks', JSON.stringify(body));
    };

    this.loadInfo = function (currentId, type, id) {
      return _choerodonBootCombine.axios.get('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/tasks/' + currentId);
    };

    this.checkCron = function (body, type, id) {
      return _choerodonBootCombine.axios.post('/asgard/v1/schedules' + _this.getLevelType(type, id) + '/tasks/cron', body);
    };
  } // 任务信息
  // 任务日志
  // 任务类名下拉框数据
  // 当前任务程序


  (0, _createClass3['default'])(TaskDetailStore, [{
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'setLog',
    value: function setLog(data) {
      this.log = data;
    }
  }, {
    key: 'setService',
    value: function setService(data) {
      this.service = data;
    }
  }, {
    key: 'setCurrentService',
    value: function setCurrentService(data) {
      this.currentService = data;
    }
  }, {
    key: 'setCurrentClassNames',
    value: function setCurrentClassNames(data) {
      this.currentClassNames = data;
    }
  }, {
    key: 'setClassNames',
    value: function setClassNames(data) {
      this.classNames = data;
    }
  }, {
    key: 'setInfo',
    value: function setInfo(data) {
      this.info = data;
      if (this.info.simpleRepeatCount != null) this.info.simpleRepeatCount += 1;
    }
  }, {
    key: 'setCurrentTask',
    value: function setCurrentTask(data) {
      this.currentTask = data;
    }
  }, {
    key: 'setUserData',
    value: function setUserData(data) {
      this.userdata = data;
    }
  }, {
    key: 'loadData',
    value: function loadData(_ref, _ref2, _ref3, params, type, id) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var status = _ref2.status,
          name = _ref2.name,
          description = _ref2.description;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'id' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'descend' : _ref3$order;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        status: status,
        name: name,
        description: description,
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
      return _choerodonBootCombine.axios.get('asgard/v1/schedules' + this.getLevelType(type, id) + '/tasks?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'loadLogData',
    value: function loadLogData(_ref4, _ref5, _ref6, params, taskId, type, id) {
      var current = _ref4.current,
          pageSize = _ref4.pageSize;
      var status = _ref5.status,
          serviceInstanceId = _ref5.serviceInstanceId;
      var _ref6$columnKey = _ref6.columnKey,
          columnKey = _ref6$columnKey === undefined ? 'id' : _ref6$columnKey,
          _ref6$order = _ref6.order,
          order = _ref6$order === undefined ? 'descend' : _ref6$order;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        status: status,
        serviceInstanceId: serviceInstanceId,
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
      return _choerodonBootCombine.axios.get('/asgard/v1/schedules' + this.getLevelType(type, id) + '/tasks/instances/' + taskId + '?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'loadUserDatas',
    value: function loadUserDatas(_ref7, _ref8, params, type, id) {
      var current = _ref7.current,
          pageSize = _ref7.pageSize;
      var _ref8$columnKey = _ref8.columnKey,
          columnKey = _ref8$columnKey === undefined ? 'id' : _ref8$columnKey,
          _ref8$order = _ref8.order,
          order = _ref8$order === undefined ? 'descend' : _ref8$order;

      var body = {
        param: params
      };
      var queryObj = {
        size: pageSize,
        page: current - 1
      };
      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
        queryObj.sort = sorter.join(',');
      }
      if (type === 'site') {
        return _choerodonBootCombine.axios.post(this.getRoleLevelType(type, id) + '/role_members/users/roles/for_all?' + _queryString2['default'].stringify(queryObj), JSON.stringify(body));
      } else {
        return _choerodonBootCombine.axios.post(this.getRoleLevelType(type, id) + '/role_members/users/roles?' + _queryString2['default'].stringify(queryObj), JSON.stringify(body));
      }
    }
  }, {
    key: 'getData',
    get: function get() {
      return this.data;
    }
  }, {
    key: 'getLog',
    get: function get() {
      return this.log;
    }
  }, {
    key: 'getCurrentService',
    get: function get() {
      return this.currentService;
    }
  }, {
    key: 'getCurrentClassNames',
    get: function get() {
      return this.currentClassNames;
    }
  }, {
    key: 'getClassNames',
    get: function get() {
      return this.classNames;
    }
  }, {
    key: 'getUserData',
    get: function get() {
      return this.userdata;
    }
  }]);
  return TaskDetailStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'service', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'info', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'log', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'currentService', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'classNames', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'currentClassNames', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'currentTask', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'userdata', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLog', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLog'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLog', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLog'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentClassNames', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentClassNames'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentClassNames', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentClassNames'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setClassNames', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setClassNames'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getClassNames', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getClassNames'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentTask', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentTask'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUserData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserData'), _class2.prototype)), _class2)) || _class);


var taskDetailStore = new TaskDetailStore();
exports['default'] = taskDetailStore;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

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

var SagaInstanceStore = (_dec = (0, _choerodonBootCombine.store)('SagaInstanceStore'), _dec(_class = (_class2 = function () {
  function SagaInstanceStore() {
    (0, _classCallCheck3['default'])(this, SagaInstanceStore);

    _initDefineProp(this, 'loading', _descriptor, this);

    _initDefineProp(this, 'data', _descriptor2, this);

    _initDefineProp(this, 'taskData', _descriptor3, this);

    _initDefineProp(this, 'statistics', _descriptor4, this);

    this.sagaInstanceType = null;
  }

  (0, _createClass3['default'])(SagaInstanceStore, [{
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'setTaskData',
    value: function setTaskData(data) {
      this.taskData = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(loading) {
      this.loading = loading;
    }
  }, {
    key: 'retry',


    /**
     * 重试
     * @param id
     * @returns {IDBRequest | Promise<void>}
     */
    value: function retry(id) {
      return _choerodonBootCombine.axios.put(this.sagaInstanceType.apiGetway + 'tasks/instances/' + id + '/retry');
    }

    /**
     * 解锁
     */

  }, {
    key: 'unLock',
    value: function unLock(id) {
      return _choerodonBootCombine.axios.put(this.sagaInstanceType.apiGetway + 'tasks/instances/' + id + '/unlock');
    }

    /**
     * 强制失败
     * @param id
     */

  }, {
    key: 'abort',
    value: function abort(id) {
      return _choerodonBootCombine.axios.put(this.sagaInstanceType.apiGetway + 'tasks/instances/' + id + '/failed');
    }

    /**
     * 详情
     * @param id
     */

  }, {
    key: 'loadDetailData',
    value: function loadDetailData(id) {
      return _choerodonBootCombine.axios.get(this.sagaInstanceType.apiGetway + 'instances/' + id);
    }

    /**
     * 加载统计数据
     * @returns {*}
     */

  }, {
    key: 'loadStatistics',
    value: function loadStatistics() {
      var _this = this;

      return _choerodonBootCombine.axios.get(this.sagaInstanceType.apiGetway + 'instances/statistics').then((0, _mobx.action)(function (data) {
        _this.statistics = data;
      }));
    }

    /**
     * 初始数据
     * @param current
     * @param pageSize
     * @param id
     * @param status
     * @param sagaCode
     * @param refType
     * @param refId
     * @param taskInstanceCode
     * @param sagaInstanceCode
     * @param description
     * @param columnKey
     * @param order
     * @param params
     * @param sagaInstanceType
     * @param type
     */

  }, {
    key: 'loadData',
    value: function loadData(_ref, _ref2, _ref3, params, sagaInstanceType, type) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var id = _ref2.id,
          status = _ref2.status,
          sagaCode = _ref2.sagaCode,
          refType = _ref2.refType,
          refId = _ref2.refId,
          taskInstanceCode = _ref2.taskInstanceCode,
          sagaInstanceCode = _ref2.sagaInstanceCode,
          description = _ref2.description;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'id' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'descend' : _ref3$order;

      this.sagaInstanceType = sagaInstanceType;
      var queryObj = type !== 'task' ? {
        page: current - 1,
        size: pageSize,
        id: id,
        status: status,
        sagaCode: sagaCode,
        refType: refType,
        refId: refId,
        params: params
      } : {
        page: current - 1,
        size: pageSize,
        id: id,
        status: status,
        taskInstanceCode: taskInstanceCode,
        sagaInstanceCode: sagaInstanceCode,
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
      switch (type) {
        case 'instance':
          return _choerodonBootCombine.axios.get(sagaInstanceType.apiGetway + 'instances?' + _queryString2['default'].stringify(queryObj));
        case 'task':
          return _choerodonBootCombine.axios.get(sagaInstanceType.apiGetway + 'tasks/instances?' + _queryString2['default'].stringify(queryObj));
        default:
          return _choerodonBootCombine.axios.get(sagaInstanceType.apiGetway + 'instances?' + _queryString2['default'].stringify(queryObj));
      }
    }
  }, {
    key: 'getStatistics',
    get: function get() {
      // 旧的statistics字段数据后缀没有_COUNT 这里去掉，让新数据兼容旧的代码
      return {
        COMPLETED: this.statistics.COMPLETED_COUNT,
        FAILED: this.statistics.FAILED_COUNT,
        RUNNING: this.statistics.RUNNING_COUNT,
        ROLLBACK: this.statistics.ROLLBACK_COUNT
      };
    }
  }, {
    key: 'getData',
    get: function get() {
      return this.data;
    }
  }, {
    key: 'getTaskData',
    get: function get() {
      return this.taskData;
    }
  }, {
    key: 'getLoading',
    get: function get() {
      return this.loading;
    }
  }]);
  return SagaInstanceStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'data', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'taskData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'statistics', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      COMPLETED_COUNT: 0,
      FAILED_COUNT: 0,
      RUNNING_COUNT: 0,
      ROLLBACK_COUNT: 0
    };
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTaskData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTaskData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getStatistics', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getStatistics'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTaskData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTaskData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadStatistics', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadStatistics'), _class2.prototype)), _class2)) || _class);


var sagaInstanceStore = new SagaInstanceStore();

exports['default'] = sagaInstanceStore;
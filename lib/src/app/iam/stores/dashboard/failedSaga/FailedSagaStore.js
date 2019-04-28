'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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

var FailedSagaStore = (_dec = (0, _choerodonBootCombine.store)('FailedSagaStore'), _dec(_class = (_class2 = function () {
  function FailedSagaStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, FailedSagaStore);

    _initDefineProp(this, 'data', _descriptor, this);

    _initDefineProp(this, 'loading', _descriptor2, this);

    _initDefineProp(this, 'startTime', _descriptor3, this);

    _initDefineProp(this, 'endTime', _descriptor4, this);

    _initDefineProp(this, 'showSize', _descriptor5, this);

    this.loadData = function (beginDate, endDate) {
      return _choerodonBootCombine.axios.get('/asgard/v1/sagas/instances/failed/count?begin_date=' + beginDate + '&end_date=' + endDate).then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
        } else {
          _this.setChartData(res);
        }
        _this.setLoading(false);
      })['catch'](function (error) {
        _this.setLoading(false);
        Choerodon.handleResponseError(error);
      });
    };
  }

  (0, _createClass3['default'])(FailedSagaStore, [{
    key: 'setShowSize',
    value: function setShowSize(size) {
      this.showSize = size;
    }
  }, {
    key: 'setChartData',
    value: function setChartData(data) {
      this.data = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setStartTime',
    value: function setStartTime(data) {
      this.startTime = data;
    }
  }, {
    key: 'setEndTime',
    value: function setEndTime(data) {
      this.endTime = data;
    }
  }, {
    key: 'getChartData',
    get: function get() {
      return this.data;
    }
  }, {
    key: 'getStartTime',
    get: function get() {
      return this.startTime;
    }
  }, {
    key: 'getEndTime',
    get: function get() {
      return this.endTime;
    }
  }]);
  return FailedSagaStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'startTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])().subtract(6, 'days');
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'endTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'showSize', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 220;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setShowSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setShowSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setChartData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getChartData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setStartTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setStartTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getStartTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getStartTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEndTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEndTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getEndTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getEndTime'), _class2.prototype)), _class2)) || _class);


var failedSagaStore = new FailedSagaStore();
exports['default'] = failedSagaStore;
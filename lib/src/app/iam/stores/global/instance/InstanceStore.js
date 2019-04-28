'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5; /**
                                                                                                                * Created by hulingfangzi on 2018/6/20.
                                                                                                                */


var _mobx = require('mobx');

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

var InstanceStore = (_dec = (0, _choerodonBootCombine.store)('InstanceStore'), _dec(_class = (_class2 = function () {
  function InstanceStore() {
    (0, _classCallCheck3['default'])(this, InstanceStore);

    _initDefineProp(this, 'service', _descriptor, this);

    _initDefineProp(this, 'currentService', _descriptor2, this);

    _initDefineProp(this, 'loading', _descriptor3, this);

    _initDefineProp(this, 'instanceData', _descriptor4, this);

    _initDefineProp(this, 'instanceDetail', _descriptor5, this);

    this.loadService = function () {
      return _choerodonBootCombine.axios.get('manager/v1/services');
    };

    this.loadInstanceInfo = function (instanceId) {
      return _choerodonBootCombine.axios.get('manager/v1/instances/' + instanceId);
    };
  }

  (0, _createClass3['default'])(InstanceStore, [{
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setCurrentService',
    value: function setCurrentService(data) {
      this.currentService = data;
    }
  }, {
    key: 'setInstanceData',
    value: function setInstanceData(data) {
      this.instanceData = data;
    }
  }, {
    key: 'setService',
    value: function setService(data) {
      this.service = data;
    }
  }, {
    key: 'setInstanceDetail',
    value: function setInstanceDetail(data) {
      this.instanceDetail = data;
    }
  }, {
    key: 'getCurrentService',
    get: function get() {
      return this.currentService;
    }
  }, {
    key: 'getInstanceData',
    get: function get() {
      return this.instanceData;
    }
  }, {
    key: 'getInstanceDetail',
    get: function get() {
      return this.instanceDetail;
    }
  }]);
  return InstanceStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'currentService', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return { name: 'total' };
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'instanceData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'instanceDetail', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setInstanceData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setInstanceData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getInstanceData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getInstanceData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setInstanceDetail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setInstanceDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getInstanceDetail', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getInstanceDetail'), _class2.prototype)), _class2)) || _class);


var instanceStore = new InstanceStore();
exports['default'] = instanceStore;
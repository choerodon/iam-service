'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10; /**
                                                                                                                                                                                       * Created by hulingfangzi on 2018/6/12.
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
var ConfigurationStore = (_dec = (0, _choerodonBootCombine.store)('ConfigurationStore'), _dec(_class = (_class2 = function () {
  function ConfigurationStore() {
    (0, _classCallCheck3['default'])(this, ConfigurationStore);

    _initDefineProp(this, 'service', _descriptor, this);

    _initDefineProp(this, 'currentService', _descriptor2, this);

    _initDefineProp(this, 'configData', _descriptor3, this);

    _initDefineProp(this, 'loading', _descriptor4, this);

    _initDefineProp(this, 'currentServiceConfig', _descriptor5, this);

    _initDefineProp(this, 'currentConfigId', _descriptor6, this);

    _initDefineProp(this, 'status', _descriptor7, this);

    _initDefineProp(this, 'editConfig', _descriptor8, this);

    _initDefineProp(this, 'relatedService', _descriptor9, this);

    _initDefineProp(this, 'lastPath', _descriptor10, this);

    this.loadService = function () {
      return _choerodonBootCombine.axios.get('manager/v1/services');
    };

    this.deleteConfig = function (configId) {
      return _choerodonBootCombine.axios['delete']('manager/v1/configs/' + configId);
    };

    this.setDefaultConfig = function (configId) {
      return _choerodonBootCombine.axios.put('manager/v1/configs/' + configId + '/default');
    };

    this.createConfig = function (data) {
      return _choerodonBootCombine.axios.post('manager/v1/configs', JSON.stringify(data));
    };

    this.getEditConfigData = function (id) {
      return _choerodonBootCombine.axios.get('manager/v1/configs/' + id);
    };

    this.versionCheck = function (data) {
      return _choerodonBootCombine.axios.post('manager/v1/configs/check', JSON.stringify(data));
    };
  } // 当前配置id
  // 联动service


  (0, _createClass3['default'])(ConfigurationStore, [{
    key: 'setStatus',
    // 记录上次路径

    value: function setStatus(data) {
      this.status = data;
    }
  }, {
    key: 'setRelatedService',
    value: function setRelatedService(data) {
      this.relatedService = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
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
    key: 'setConfigData',
    value: function setConfigData(data) {
      this.configData = data;
    }
  }, {
    key: 'setCurrentServiceConfig',
    value: function setCurrentServiceConfig(data) {
      this.currentServiceConfig = data;
    }
  }, {
    key: 'setCurrentConfigId',
    value: function setCurrentConfigId(data) {
      this.currentConfigId = data;
    }
  }, {
    key: 'setEditConfig',
    value: function setEditConfig(data) {
      this.editConfig = data;
    }
  }, {
    key: 'setLastPath',
    value: function setLastPath(data) {
      this.lastPath = data;
    }
  }, {
    key: 'loadCurrentServiceConfig',
    value: function loadCurrentServiceConfig(serviceId) {
      var _this = this;

      var queryObj = {
        serviceId: serviceId,
        page: 0,
        size: 200
      };
      _choerodonBootCombine.axios.get('/manager/v1/configs?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        return _this.setCurrentServiceConfig(data.content.slice());
      });
    }
  }, {
    key: 'modifyConfig',
    value: function modifyConfig(configId, type, data) {
      return _choerodonBootCombine.axios.put('manager/v1/configs/' + configId + '?type=' + type, data);
    }
  }, {
    key: 'getStatus',
    get: function get() {
      return this.status;
    }
  }, {
    key: 'getRelatedService',
    get: function get() {
      return this.relatedService;
    }
  }, {
    key: 'getCurrentService',
    get: function get() {
      return this.currentService;
    }
  }, {
    key: 'getConfigData',
    get: function get() {
      return this.configData;
    }
  }, {
    key: 'getCurrentServiceConfig',
    get: function get() {
      return this.currentServiceConfig;
    }
  }, {
    key: 'getCurrentConfigId',
    get: function get() {
      return this.currentConfigId;
    }
  }, {
    key: 'getEditConfig',
    get: function get() {
      return this.editConfig;
    }
  }, {
    key: 'getLastPath',
    get: function get() {
      return this.lastPath;
    }
  }]);
  return ConfigurationStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'currentService', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'configData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'currentServiceConfig', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'currentConfigId', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'status', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'editConfig', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'relatedService', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'lastPath', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'configuration';
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setStatus', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setStatus'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getStatus', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getStatus'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setRelatedService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setRelatedService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getRelatedService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getRelatedService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setConfigData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setConfigData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getConfigData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getConfigData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentServiceConfig', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentServiceConfig'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentServiceConfig', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentServiceConfig'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentConfigId', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentConfigId'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentConfigId', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentConfigId'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEditConfig', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEditConfig'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getEditConfig', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getEditConfig'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLastPath', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLastPath'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLastPath', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLastPath'), _class2.prototype)), _class2)) || _class);

var configurationStore = new ConfigurationStore();
exports['default'] = configurationStore;
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

var _orderBy2 = require('lodash/orderBy');

var _orderBy3 = _interopRequireDefault(_orderBy2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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

var APIOverviewStore = (_dec = (0, _choerodonBootCombine.store)('APIOverviewStore'), _dec(_class = (_class2 = function () {
  function APIOverviewStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, APIOverviewStore);

    _initDefineProp(this, 'service', _descriptor, this);

    _initDefineProp(this, 'firstChartData', _descriptor2, this);

    _initDefineProp(this, 'secChartData', _descriptor3, this);

    _initDefineProp(this, 'thirdChartData', _descriptor4, this);

    _initDefineProp(this, 'firstLoading', _descriptor5, this);

    _initDefineProp(this, 'secLoading', _descriptor6, this);

    _initDefineProp(this, 'thirdLoading', _descriptor7, this);

    _initDefineProp(this, 'secStartTime', _descriptor8, this);

    _initDefineProp(this, 'secEndTime', _descriptor9, this);

    _initDefineProp(this, 'thirdStartTime', _descriptor10, this);

    _initDefineProp(this, 'thirdEndTime', _descriptor11, this);

    _initDefineProp(this, 'currentService', _descriptor12, this);

    _initDefineProp(this, 'thirdStartDate', _descriptor13, this);

    _initDefineProp(this, 'thirdEndDate', _descriptor14, this);

    this.loadFirstChart = function () {
      return _choerodonBootCombine.axios.get('/manager/v1/swaggers/api/count').then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.setFirstChartData(data);
        }
        _this.setFirstLoading(false);
      })['catch'](function (error) {
        _this.setFirstLoading(false);
        Choerodon.handleResponseError(error);
      });
    };

    this.loadSecChart = function (beginDate, endDate) {
      return _choerodonBootCombine.axios.get('/manager/v1/swaggers/service_invoke/count?begin_date=' + beginDate + '&end_date=' + endDate).then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
        } else {
          var details = res.details,
              service = res.service;

          if (details.length && service.length) {
            var handleDetails = details.map(function (item) {
              return (0, _extends3['default'])({}, item, { sortIndex: service.indexOf(item.service) });
            });
            var finalDetails = (0, _orderBy3['default'])(handleDetails, ['sortIndex'], ['asc']);
            res.details = finalDetails;
          }
          _this.setSecChartData(res);
        }
        _this.setSecLoading(false);
      })['catch'](function (error) {
        _this.setSecLoading(false);
        Choerodon.handleResponseError(error);
      });
    };

    this.loadServices = function () {
      return _choerodonBootCombine.axios.get('/manager/v1/swaggers/resources');
    };

    this.loadThirdChart = function (beginDate, endDate, service) {
      var queryObj = {
        begin_date: beginDate,
        end_date: endDate,
        service: service
      };
      return _choerodonBootCombine.axios.get('/manager/v1/swaggers/api_invoke/count?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          if (data.api.length) {
            var arr = data.api.map(function (item) {
              return item.split(':')[1] + ': ' + item.split(':')[0];
            });
            data.api = arr;
          }

          _this.setThirdChartData(data);
        }
        _this.setThirdLoading(false);
      })['catch'](function (error) {
        _this.setThirdLoading(false);
        Choerodon.handleResponseError(error);
      });
    };
  }

  (0, _createClass3['default'])(APIOverviewStore, [{
    key: 'setThirdStartDate',
    value: function setThirdStartDate(data) {
      this.thirdStartDate = data;
    }
  }, {
    key: 'setThirdEndDate',
    value: function setThirdEndDate(data) {
      this.thirdEndDate = data;
    }
  }, {
    key: 'setSecStartTime',
    value: function setSecStartTime(data) {
      this.secStartTime = data;
    }
  }, {
    key: 'setThirdStartTime',
    value: function setThirdStartTime(data) {
      this.thirdStartTime = data;
    }
  }, {
    key: 'setSecEndTime',
    value: function setSecEndTime(data) {
      this.secEndTime = data;
    }
  }, {
    key: 'setThirdEndTime',
    value: function setThirdEndTime(data) {
      this.thirdEndTime = data;
    }
  }, {
    key: 'setFirstChartData',
    value: function setFirstChartData(data) {
      this.firstChartData = data;
    }
  }, {
    key: 'setSecChartData',
    value: function setSecChartData(data) {
      this.secChartData = data;
    }
  }, {
    key: 'setThirdChartData',
    value: function setThirdChartData(data) {
      this.thirdChartData = data;
    }
  }, {
    key: 'setFirstLoading',
    value: function setFirstLoading(flag) {
      this.firstLoading = flag;
    }
  }, {
    key: 'setSecLoading',
    value: function setSecLoading(flag) {
      this.secLoading = flag;
    }
  }, {
    key: 'setThirdLoading',
    value: function setThirdLoading(flag) {
      this.thirdLoading = flag;
    }
  }, {
    key: 'setService',
    value: function setService(service) {
      this.service = service;
    }
  }, {
    key: 'setCurrentService',
    value: function setCurrentService(data) {
      this.currentService = data;
    }
  }, {
    key: 'getThirdStartDate',
    get: function get() {
      return this.thirdStartDate;
    }
  }, {
    key: 'getThirdEndDate',
    get: function get() {
      return this.thirdEndDate;
    }
  }, {
    key: 'getSecStartTime',
    get: function get() {
      return this.secStartTime;
    }
  }, {
    key: 'getThirdStartTime',
    get: function get() {
      return this.thirdStartTime;
    }
  }, {
    key: 'getSecEndTime',
    get: function get() {
      return this.secEndTime;
    }
  }, {
    key: 'getThirdEndTime',
    get: function get() {
      return this.thirdEndTime;
    }
  }, {
    key: 'getFirstChartData',
    get: function get() {
      return this.firstChartData;
    }
  }, {
    key: 'getSecChartData',
    get: function get() {
      return this.secChartData;
    }
  }, {
    key: 'getThirdChartData',
    get: function get() {
      return this.thirdChartData;
    }
  }, {
    key: 'getService',
    get: function get() {
      return this.service;
    }
  }, {
    key: 'getCurrentService',
    get: function get() {
      return this.currentService;
    }
  }]);
  return APIOverviewStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'firstChartData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'secChartData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'thirdChartData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'firstLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'secLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'thirdLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'secStartTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])().subtract(6, 'days');
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'secEndTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])();
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'thirdStartTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])().subtract(6, 'days');
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'thirdEndTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])();
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'currentService', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'thirdStartDate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'thirdEndDate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setThirdStartDate', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setThirdStartDate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getThirdStartDate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getThirdStartDate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setThirdEndDate', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setThirdEndDate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getThirdEndDate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getThirdEndDate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSecStartTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSecStartTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSecStartTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSecStartTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setThirdStartTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setThirdStartTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getThirdStartTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getThirdStartTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSecEndTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSecEndTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSecEndTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSecEndTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setThirdEndTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setThirdEndTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getThirdEndTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getThirdEndTime'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setFirstChartData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setFirstChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getFirstChartData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getFirstChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSecChartData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSecChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSecChartData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSecChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setThirdChartData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setThirdChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getThirdChartData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getThirdChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setFirstLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setFirstLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSecLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSecLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setThirdLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setThirdLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentService'), _class2.prototype)), _class2)) || _class);


var apioverviewStore = new APIOverviewStore();
exports['default'] = apioverviewStore;
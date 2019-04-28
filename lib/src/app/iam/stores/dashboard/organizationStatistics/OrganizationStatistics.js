'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

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

var OrganizationStatisticsStore = (_dec = (0, _choerodonBootCombine.store)('OrganizationStatisticsStore'), _dec(_class = (_class2 = function () {
  function OrganizationStatisticsStore() {
    (0, _classCallCheck3['default'])(this, OrganizationStatisticsStore);

    _initDefineProp(this, 'loading', _descriptor, this);

    _initDefineProp(this, 'organizations', _descriptor2, this);

    _initDefineProp(this, 'currentorg', _descriptor3, this);

    _initDefineProp(this, 'chartData', _descriptor4, this);

    _initDefineProp(this, 'loadOrganizations', _descriptor5, this);

    _initDefineProp(this, 'loadPie', _descriptor6, this);
  }

  (0, _createClass3['default'])(OrganizationStatisticsStore, [{
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setChartData',
    value: function setChartData(data) {
      this.chartData = data;
    }
  }, {
    key: 'setOrganizations',
    value: function setOrganizations(data) {
      this.organizations = data;
    }
  }, {
    key: 'setCurrentOrg',
    value: function setCurrentOrg(data) {
      this.currentorg = data;
    }
  }, {
    key: 'getChartData',
    get: function get() {
      return this.chartData;
    }
  }, {
    key: 'getOrganizations',
    get: function get() {
      return this.organizations;
    }
  }, {
    key: 'getCurrentOrg',
    get: function get() {
      return this.currentorg;
    }
  }]);
  return OrganizationStatisticsStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'organizations', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'currentorg', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'chartData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setChartData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getChartData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getChartData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setOrganizations', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setOrganizations'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getOrganizations', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getOrganizations'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentOrg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentOrg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentOrg', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentOrg'), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'loadOrganizations', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this = this;

    return function () {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/all?size=500').then((0, _mobx.action)(function (data) {
        _this.organizations = data;
        if (data.length) {
          _this.currentorg = data[0].id;
          _this.loadPie(data[0].id);
        }
      }));
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'loadPie', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this2 = this;

    return function (id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + id + '/projects/under_the_type').then((0, _mobx.action)(function (data) {
        _this2.chartData = data;
        _this2.loading = false;
      }));
    };
  }
})), _class2)) || _class);


var organizationStatisticsStore = new OrganizationStatisticsStore();
exports['default'] = organizationStatisticsStore;
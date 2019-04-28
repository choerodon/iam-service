'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4; /**
                                                                                                  * Created by jaywoods on 2017/6/25.
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

var ServiceStore = (_dec = (0, _choerodonBootCombine.store)('ServiceStore'), _dec(_class = (_class2 = function () {
  function ServiceStore() {
    var _this = this;

    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, ServiceStore);

    _initDefineProp(this, 'service', _descriptor, this);

    _initDefineProp(this, 'totalSize', _descriptor2, this);

    _initDefineProp(this, 'totalPage', _descriptor3, this);

    _initDefineProp(this, 'isLoading', _descriptor4, this);

    this.queryServices = function (state) {
      if (state.code === '') {
        _choerodonBootCombine.axios.get('/uaa/v1/services?param=' + state.input + '&page=0&size=10').then(function (data) {
          _this.setService(data.content);
        });
      } else {
        _choerodonBootCombine.axios.get('/uaa/v1/services?' + state.code + '=' + state.input + '&page=0&size=10').then(function (data) {
          _this.setService(data.content);
        });
      }
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  (0, _createClass3['default'])(ServiceStore, [{
    key: 'setService',
    value: function setService(data) {
      this.service = data;
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
    key: 'changeLoading',
    value: function changeLoading(flag) {
      this.isLoading = flag;
    }
  }, {
    key: 'loadServices',
    value: function loadServices(organizationId, page, size, state) {
      var _this2 = this;

      this.changeLoading(true);
      if (!state) {
        return _choerodonBootCombine.axios.get('/uaa/v1/services?page=' + page + '&size=' + size).then(function (data) {
          if (data) {
            _this2.setService(data.content);
            _this2.setTotalPage(data.totalPages);
            _this2.setTotalSize(data.totalElements);
          }
          _this2.changeLoading(false);
        });
      } else if (state.code === '') {
        return _choerodonBootCombine.axios.get('/uaa/v1/services?param=' + state.input + '&page=' + page + '&size=' + size).then(function (data) {
          if (data) {
            _this2.setService(data.content);
            _this2.setTotalPage(data.totalPages);
            _this2.setTotalSize(data.totalElements);
          }
          _this2.changeLoading(false);
        });
      } else {
        return _choerodonBootCombine.axios.get('/uaa/v1/services?' + state.code + '=' + state.input + '&page=' + page + '&size=' + size).then(function (data) {
          if (data) {
            _this2.setService(data.content);
            _this2.setTotalPage(data.totalPages);
            _this2.setTotalSize(data.totalElements);
          }
          _this2.changeLoading(false);
        });
      }
    }
  }, {
    key: 'queryDatas',
    value: function queryDatas(_ref, value) {
      var _this3 = this;

      var _ref2 = (0, _slicedToArray3['default'])(_ref, 2),
          page = _ref2[0],
          size = _ref2[1];

      var url = '';
      if (typeof value === 'string') {
        url = '&param=' + value;
      } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) === 'object') {
        for (var i = 0; i < value.length; i += 1) {
          url += '&' + value[i].key + '=' + value[i].values;
        }
      }
      this.changeLoading(true);
      return _choerodonBootCombine.axios.get('/uaa/v1/services?page=' + page + '&size=' + size + url).then(function (data) {
        if (data) {
          _this3.setService(data.content);
          _this3.setTotalPage(data.totalPages);
          _this3.setTotalSize(data.totalElements);
          _this3.changeLoading(false);
        }
      });
    }
  }, {
    key: 'getServices',
    get: function get() {
      return this.service;
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
    key: 'getIsLoading',
    get: function get() {
      return this.isLoading;
    }
  }]);
  return ServiceStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_mobx.observable], {
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
}), _applyDecoratedDescriptor(_class2.prototype, 'setService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getServices', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getServices'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalSize', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changeLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changeLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype)), _class2)) || _class);


var serviceStore = new ServiceStore();

exports['default'] = serviceStore;
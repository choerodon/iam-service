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

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6; /**
                                                                                                                              * Created by hand on 2017/7/18.
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

var SaasTokenStore = (_dec = (0, _choerodonBootCombine.store)('SaasTokenStore'), _dec(_class = (_class2 = function () {
  function SaasTokenStore() {
    var _this = this;

    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, SaasTokenStore);

    _initDefineProp(this, 'SaasTokenData', _descriptor, this);

    _initDefineProp(this, 'totalSize', _descriptor2, this);

    _initDefineProp(this, 'totalPage', _descriptor3, this);

    _initDefineProp(this, 'isLoading', _descriptor4, this);

    _initDefineProp(this, 'permission', _descriptor5, this);

    _initDefineProp(this, 'allData', _descriptor6, this);

    this.querySaasToken = function (state) {
      if (state.code === '') {
        _choerodonBootCombine.axios.get('/uaa/v1/tokens/querySelf?param=' + state.input + '&page=0&size=10').then(function (data) {
          _this.setSaasTokenData(data.content);
        });
      } else {
        _choerodonBootCombine.axios.get('uaa/v1/tokens/querySelf?' + state.code + '=' + state.input + '&page=0&size=10').then(function (data) {
          _this.setSaasTokenData(data.content);
        });
      }
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  (0, _createClass3['default'])(SaasTokenStore, [{
    key: 'setSaasTokenData',
    value: function setSaasTokenData(data) {
      this.SaasTokenData = data;
    }
  }, {
    key: 'setPermission',
    value: function setPermission(flag) {
      this.permission = flag;
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
    key: 'setAllData',
    value: function setAllData(data) {
      this.allData = data;
    }
  }, {
    key: 'getPermession',
    value: function getPermession(data) {
      var _this2 = this;

      _choerodonBootCombine.axios.post('/v1/testPermission', JSON.stringify(data)).then(function (datas) {
        if (datas) {
          _this2.setPermission(datas[0].approve);
        }
      });
    }
  }, {
    key: 'loadSaasToken',
    value: function loadSaasToken(page, size, state) {
      var _this3 = this;

      this.changeLoading(true);
      if (state.code === '') {
        _choerodonBootCombine.axios.get('uaa/v1/tokens/querySelf?page=' + page + '&size=' + size + '&param=' + state.input).then(function (data) {
          if (data) {
            _this3.setSaasTokenData(data.content);
            _this3.setTotalPage(data.totalPages);
            _this3.setTotalSize(data.totalElements);
            _this3.changeLoading(false);
          }
        });
      } else {
        _choerodonBootCombine.axios.get('uaa/v1/tokens/querySelf?page=' + page + '&size=' + size + '&' + state.code + '=' + state.input).then(function (data) {
          if (data) {
            _this3.setSaasTokenData(data.content);
            _this3.setTotalPage(data.totalPages);
            _this3.setTotalSize(data.totalElements);
            _this3.changeLoading(false);
          }
        });
      }
    }
  }, {
    key: 'queryDatas',
    value: function queryDatas(_ref, value) {
      var _this4 = this;

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
      _choerodonBootCombine.axios.get('/uaa/v1/tokens/querySelf?' + page + '&size=' + size + url).then(function (data) {
        if (data) {
          _this4.setSaasTokenData(data.content);
          _this4.setTotalPage(data.totalPages);
          _this4.setTotalSize(data.totalElements);
          _this4.changeLoading(false);
        }
      });
    }
  }, {
    key: 'loadAllSaasToken',
    value: function loadAllSaasToken() {
      var _this5 = this;

      _choerodonBootCombine.axios.get('uaa/v1/tokens/querySelf?page=0&size=999').then(function (data) {
        if (data) {
          _this5.setAllData(data.content);
        }
      });
    }
  }, {
    key: 'createSaasToken',
    value: function createSaasToken(data) {
      return _choerodonBootCombine.axios.post('/uaa/v1/tokens', JSON.stringify(data));
    }
  }, {
    key: 'deleteSaasToken',
    value: function deleteSaasToken(name) {
      return _choerodonBootCombine.axios['delete']('uaa/v1/tokens/deleteSelf/' + name);
    }
  }, {
    key: 'getTokenData',
    get: function get() {
      return this.SaasTokenData.slice();
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
  return SaasTokenStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'SaasTokenData', [_mobx.observable], {
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
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'permission', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'allData', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, 'setSaasTokenData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSaasTokenData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPermission', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPermission'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTokenData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTokenData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalSize', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changeLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changeLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setAllData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setAllData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype)), _class2)) || _class);


var saasTokenStore = new SaasTokenStore();

exports['default'] = saasTokenStore;
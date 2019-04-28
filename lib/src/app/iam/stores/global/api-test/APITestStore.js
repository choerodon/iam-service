'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25; /**
                                                                                                                                                                                                                                                                                                                                                                                                                        * Created by hulingfangzi on 2018/7/9.
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

var ApitestStore = (_dec = (0, _choerodonBootCombine.store)('ApitestStore'), _dec(_class = (_class2 = function () {
  function ApitestStore() {
    (0, _classCallCheck3['default'])(this, ApitestStore);

    _initDefineProp(this, 'service', _descriptor, this);

    _initDefineProp(this, 'currentService', _descriptor2, this);

    _initDefineProp(this, 'currentVersion', _descriptor3, this);

    _initDefineProp(this, 'versions', _descriptor4, this);

    _initDefineProp(this, 'apiData', _descriptor5, this);

    _initDefineProp(this, 'isShowModal', _descriptor6, this);

    _initDefineProp(this, 'apitoken', _descriptor7, this);

    _initDefineProp(this, 'loading', _descriptor8, this);

    _initDefineProp(this, 'modalSaving', _descriptor9, this);

    _initDefineProp(this, 'userInfo', _descriptor10, this);

    _initDefineProp(this, 'isShowResult', _descriptor11, this);

    _initDefineProp(this, 'isExpand', _descriptor12, this);

    _initDefineProp(this, 'apiDetail', _descriptor13, this);

    _initDefineProp(this, 'initData', _descriptor14, this);

    _initDefineProp(this, 'needReload', _descriptor15, this);

    _initDefineProp(this, 'filters', _descriptor16, this);

    _initDefineProp(this, 'isShowTree', _descriptor17, this);

    _initDefineProp(this, 'controllers', _descriptor18, this);

    _initDefineProp(this, 'paths', _descriptor19, this);

    _initDefineProp(this, 'expandedKeys', _descriptor20, this);

    _initDefineProp(this, 'pageLoading', _descriptor21, this);

    _initDefineProp(this, 'totalData', _descriptor22, this);

    _initDefineProp(this, 'detailFlag', _descriptor23, this);

    _initDefineProp(this, 'currentNode', _descriptor24, this);

    _initDefineProp(this, 'eventKey', _descriptor25, this);

    this.loadApis = function () {
      return _choerodonBootCombine.axios.get('/manager/v1/swaggers/tree');
    };
  } // 用来缓存APITest列表页的state实现打开新的page然后返回仍在离开时的分页
  // 只有跳转到api详情界面然后回到api列表才不需要reload
  // 是否显示树形结构
  //


  (0, _createClass3['default'])(ApitestStore, [{
    key: 'setEventKey',
    value: function setEventKey(key) {
      this.eventKey = key;
    }
  }, {
    key: 'setCurrentNode',
    value: function setCurrentNode(node) {
      this.currentNode = node;
    }
  }, {
    key: 'setDetailFlag',
    value: function setDetailFlag(flag) {
      this.detailFlag = flag;
    }
  }, {
    key: 'setTotalData',
    value: function setTotalData(data) {
      this.totalData = data;
    }
  }, {
    key: 'setIsShowTree',
    value: function setIsShowTree(flag) {
      this.isShowTree = flag;
    }
  }, {
    key: 'setControllers',
    value: function setControllers(controllers) {
      this.controllers = controllers;
    }
  }, {
    key: 'setPaths',
    value: function setPaths(paths) {
      this.paths = paths;
    }
  }, {
    key: 'setExpandedKeys',
    value: function setExpandedKeys(expandedKeys) {
      // window.console.log(expandedKeys);
      this.expandedKeys = expandedKeys;
    }
  }, {
    key: 'setPageLoading',
    value: function setPageLoading(flag) {
      this.pageLoading = flag;
    }
  }, {
    key: 'setFilters',
    value: function setFilters(filters) {
      this.filters = filters;
    }
  }, {
    key: 'setNeedReload',
    value: function setNeedReload(flag) {
      this.needReload = flag;
    }

    // @action setDetailFlag(flag) {
    //   this.detailFlag = flag;
    // }

  }, {
    key: 'setIsExpand',
    value: function setIsExpand(name) {
      if (this.isExpand.has(name)) {
        this.isExpand['delete'](name);
      } else {
        this.isExpand.add(name);
      }
    }
  }, {
    key: 'clearIsExpand',
    value: function clearIsExpand() {
      this.isExpand.clear();
    }
  }, {
    key: 'setVersions',
    value: function setVersions(data) {
      this.versions = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setModalSaving',
    value: function setModalSaving(flag) {
      this.modalSaving = flag;
    }
  }, {
    key: 'setIsShowResult',
    value: function setIsShowResult(flag) {
      this.isShowResult = flag;
    }
  }, {
    key: 'setUserInfo',
    value: function setUserInfo(data) {
      this.userInfo = data;
    }
  }, {
    key: 'setInitData',
    value: function setInitData(data) {
      this.initData = data;
    }
  }, {
    key: 'setIsShowModal',
    value: function setIsShowModal(flag) {
      this.isShowModal = flag;
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
    key: 'setCurrentVersion',
    value: function setCurrentVersion(data) {
      this.currentVersion = data;
    }
  }, {
    key: 'setApiToken',
    value: function setApiToken(data) {
      this.apitoken = data;
    }
  }, {
    key: 'setApiData',
    value: function setApiData(data) {
      this.apiData = data;
    }
  }, {
    key: 'setApiDetail',
    value: function setApiDetail(data) {
      this.apiDetail = data;
    }
  }, {
    key: 'getEventKey',
    get: function get() {
      return this.eventKey;
    }
  }, {
    key: 'getCurrentNode',
    get: function get() {
      return this.currentNode;
    }
  }, {
    key: 'getDetailFlag',
    get: function get() {
      return (0, _mobx.toJS)(this.detailFlag);
    }
  }, {
    key: 'getTotalData',
    get: function get() {
      return this.totalData;
    }
  }, {
    key: 'getExpandedKeys',
    get: function get() {
      return (0, _mobx.toJS)(this.expandedKeys);
    }
  }, {
    key: 'getFilters',
    get: function get() {
      return this.filters;
    }
  }, {
    key: 'getFilteredData',
    get: function get() {
      var _this = this;

      var a = this.apiData;
      if (this.filters.length === 0) return a;
      var filteredController = a.slice().filter(function (controller) {
        var matchAPI = controller.paths && controller.paths.slice().filter(function (api) {
          return _this.filters.some(function (str) {
            return api.url.indexOf(str) !== -1 || controller.name.indexOf(str) !== -1;
          });
        });
        return matchAPI.length > 0;
      });
      if (filteredController.length > 0) {
        var ret = [];
        (0, _mobx.toJS)(filteredController).forEach(function (v, i) {
          ret.push({ description: v.description, name: v.name });
          var matchAPI = v.paths && v.paths.slice().filter(function (api) {
            return _this.filters.some(function (str) {
              return api.url.indexOf(str) !== -1;
            });
          });
          if (v.name.indexOf(_this.filters) !== -1) {
            ret[i].paths = v.paths;
          } else {
            ret[i].paths = matchAPI.slice();
          }
        });
        return ret;
      } else {
        return [];
      }
    }
  }, {
    key: 'getNeedReload',
    get: function get() {
      return this.needReload;
    }
  }, {
    key: 'getInitData',
    get: function get() {
      return this.initData;
    }
  }, {
    key: 'getUserInfo',
    get: function get() {
      return this.userInfo;
    }
  }, {
    key: 'getIsExpand',
    get: function get() {
      return this.isExpand;
    }
  }, {
    key: 'getExpandKeys',
    get: function get() {
      return [].concat((0, _toConsumableArray3['default'])(this.isExpand));
    }
  }, {
    key: 'getIsShowModal',
    get: function get() {
      return this.isShowModal;
    }
  }, {
    key: 'getCurrentService',
    get: function get() {
      return this.currentService;
    }
  }, {
    key: 'getCurrentVersion',
    get: function get() {
      return this.currentVersion;
    }
  }, {
    key: 'getApiToken',
    get: function get() {
      return this.apitoken;
    }
  }, {
    key: 'getApiData',
    get: function get() {
      return this.apiData;
    }
  }, {
    key: 'getApiDetail',
    get: function get() {
      return this.apiDetail;
    }
  }]);
  return ApitestStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'currentService', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'currentVersion', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'versions', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return ['asdasd', 'asd'];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'apiData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'isShowModal', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'apitoken', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'modalSaving', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'userInfo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'isShowResult', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'isExpand', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'apiDetail', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      description: '[]',
      responses: []
    };
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'initData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, 'needReload', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, 'isShowTree', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, 'controllers', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, 'paths', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, 'expandedKeys', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, 'pageLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, 'totalData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, 'detailFlag', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'empty';
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, 'currentNode', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, 'eventKey', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setEventKey', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEventKey'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getEventKey', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getEventKey'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentNode', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentNode'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentNode', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentNode'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setDetailFlag', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setDetailFlag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getDetailFlag', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getDetailFlag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsShowTree', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsShowTree'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setControllers', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setControllers'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPaths', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPaths'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setExpandedKeys', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setExpandedKeys'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getExpandedKeys', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getExpandedKeys'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPageLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPageLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setFilters', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setFilters'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getFilters', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getFilters'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getFilteredData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getFilteredData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setNeedReload', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setNeedReload'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsExpand', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsExpand'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'clearIsExpand', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'clearIsExpand'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setVersions', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setVersions'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setModalSaving', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setModalSaving'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsShowResult', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsShowResult'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setInitData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setInitData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getNeedReload', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getNeedReload'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getInitData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getInitData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUserInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsExpand', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsExpand'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getExpandKeys', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getExpandKeys'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsShowModal', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsShowModal'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsShowModal', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsShowModal'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentService', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentVersion', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentVersion'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentService', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentService'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentVersion', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentVersion'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setApiToken', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setApiToken'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getApiToken', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getApiToken'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setApiData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setApiData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getApiData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getApiData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setApiDetail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setApiDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getApiDetail', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getApiDetail'), _class2.prototype)), _class2)) || _class);


var apitestStore = new ApitestStore();
exports['default'] = apitestStore;
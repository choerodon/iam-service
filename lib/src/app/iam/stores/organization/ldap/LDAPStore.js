'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10; /**
                                                                                                                                                                                       * Created by song on 2017/6/26.
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

var LDAPStore = (_dec = (0, _choerodonBootCombine.store)('LDAPStore'), _dec(_class = (_class2 = function () {
  function LDAPStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, LDAPStore);

    _initDefineProp(this, 'ldapData', _descriptor, this);

    _initDefineProp(this, 'testData', _descriptor2, this);

    _initDefineProp(this, 'syncData', _descriptor3, this);

    _initDefineProp(this, 'isLoading', _descriptor4, this);

    _initDefineProp(this, 'isConnectLoading', _descriptor5, this);

    _initDefineProp(this, 'isShowResult', _descriptor6, this);

    _initDefineProp(this, 'confirmLoading', _descriptor7, this);

    _initDefineProp(this, 'isSyncLoading', _descriptor8, this);

    _initDefineProp(this, 'syncRecord', _descriptor9, this);

    _initDefineProp(this, 'detailRecord', _descriptor10, this);

    this.loadLDAP = function (organizationId) {
      _this.cleanData();
      _this.setIsLoading(true);
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/ldaps').then(function (data) {
        if (data) {
          _this.setLDAPData(data);
        }
        _this.setIsLoading(false);
      });
    };

    this.updateLDAP = function (organizationId, id, ldap) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/ldaps/' + id, JSON.stringify(ldap));
    };

    this.testConnect = function (organizationId, id, ldap) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/ldaps/' + id + '/test_connect', JSON.stringify(ldap));
    };

    this.getSyncInfo = function (organizationId, id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/ldaps/' + id + '/latest_history');
    };

    this.SyncUsers = function (organizationId, id) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/ldaps/' + id + '/sync_users');
    };

    this.enabledLdap = function (organizationId, id) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + organizationId + '/ldaps/' + id + '/enable');
    };

    this.disabledLdap = function (organizationId, id) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + organizationId + '/ldaps/' + id + '/disable');
    };
  } // 同步记录


  (0, _createClass3['default'])(LDAPStore, [{
    key: 'setIsLoading',
    // 失败记录

    value: function setIsLoading(flag) {
      this.isLoading = flag;
    }
  }, {
    key: 'setIsConnectLoading',
    value: function setIsConnectLoading(flag) {
      this.isConnectLoading = flag;
    }
  }, {
    key: 'setIsSyncLoading',
    value: function setIsSyncLoading(flag) {
      this.isSyncLoading = flag;
    }
  }, {
    key: 'setIsConfirmLoading',
    value: function setIsConfirmLoading(flag) {
      this.confirmLoading = flag;
    }
  }, {
    key: 'setIsShowResult',
    value: function setIsShowResult(data) {
      this.isShowResult = data;
    }
  }, {
    key: 'setLDAPData',
    value: function setLDAPData(data) {
      this.ldapData = data;
    }
  }, {
    key: 'setTestData',
    value: function setTestData(data) {
      this.testData = data;
    }
  }, {
    key: 'setSyncData',
    value: function setSyncData(data) {
      this.syncData = data;
    }
  }, {
    key: 'cleanData',
    value: function cleanData() {
      this.ldapData = {};
    }
  }, {
    key: 'setSyncRecord',
    value: function setSyncRecord(data) {
      this.syncRecord = data;
    }
  }, {
    key: 'setDetailRecord',
    value: function setDetailRecord(data) {
      this.detailRecord = data;
    }
  }, {
    key: 'loadSyncRecord',


    // 加载同步记录
    value: function loadSyncRecord(_ref, _ref2, organizationId, id) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var _ref2$columnKey = _ref2.columnKey,
          columnKey = _ref2$columnKey === undefined ? 'id' : _ref2$columnKey,
          _ref2$order = _ref2.order,
          order = _ref2$order === undefined ? 'descend' : _ref2$order;

      var queryObj = {
        page: current - 1,
        size: pageSize
      };

      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
        queryObj.sort = sorter.join(',');
      }
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/ldaps/' + id + '/history?' + _queryString2['default'].stringify(queryObj));
    }

    // 加载失败详情

  }, {
    key: 'loadDetail',
    value: function loadDetail(_ref3, _ref4, _ref5, params, id) {
      var current = _ref3.current,
          pageSize = _ref3.pageSize;
      var uuid = _ref4.uuid,
          loginName = _ref4.loginName,
          realName = _ref4.realName,
          email = _ref4.email;
      var _ref5$columnKey = _ref5.columnKey,
          columnKey = _ref5$columnKey === undefined ? 'id' : _ref5$columnKey,
          _ref5$order = _ref5.order,
          order = _ref5$order === undefined ? 'descend' : _ref5$order;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        uuid: uuid,
        loginName: loginName,
        realName: realName,
        email: email,
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
      return _choerodonBootCombine.axios.get('/iam/v1/ldap_histories/' + id + '/error_users?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'loadOrganization',
    value: function loadOrganization(organizationId) {
      var _this2 = this;

      this.setIsLoading(true);
      _choerodonBootCombine.axios.get('/uaa/v1/organizations/' + organizationId).then(function (data) {
        if (data) {
          _this2.setOrganization(data);
        }
        _this2.setIsLoading(false);
      });
    }
  }, {
    key: 'getIsLoading',
    get: function get() {
      return this.isLoading;
    }
  }, {
    key: 'getIsConnectLoading',
    get: function get() {
      return this.isConnectLoading;
    }
  }, {
    key: 'getIsSyncLoading',
    get: function get() {
      return this.isSyncLoading;
    }
  }, {
    key: 'getIsConfirmLoading',
    get: function get() {
      return this.confirmLoading;
    }
  }, {
    key: 'getIsShowResult',
    get: function get() {
      return this.isShowResult;
    }
  }, {
    key: 'getLDAPData',
    get: function get() {
      return this.ldapData;
    }
  }, {
    key: 'getTestData',
    get: function get() {
      return this.testData;
    }
  }, {
    key: 'getSyncData',
    get: function get() {
      return this.syncData;
    }
  }, {
    key: 'getSyncRecord',
    get: function get() {
      return this.syncRecord;
    }
  }, {
    key: 'getDetailRecord',
    get: function get() {
      return this.detailRecord;
    }
  }]);
  return LDAPStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'ldapData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'testData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'syncData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'isLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'isConnectLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'isShowResult', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'confirmLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'isSyncLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'syncRecord', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'detailRecord', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setIsLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsConnectLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsConnectLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsConnectLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsConnectLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsSyncLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsSyncLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsSyncLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsSyncLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsConfirmLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsConfirmLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsConfirmLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsConfirmLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setIsShowResult', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsShowResult'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsShowResult', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsShowResult'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLDAPData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLDAPData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLDAPData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLDAPData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTestData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTestData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTestData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTestData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSyncData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSyncData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSyncData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSyncData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'cleanData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'cleanData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSyncRecord', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSyncRecord'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSyncRecord', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSyncRecord'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setDetailRecord', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setDetailRecord'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getDetailRecord', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getDetailRecord'), _class2.prototype)), _class2)) || _class);


var ldapStore = new LDAPStore();

exports['default'] = ldapStore;
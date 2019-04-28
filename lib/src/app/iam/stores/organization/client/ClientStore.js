'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _rxjs = require('rxjs');

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

var ClientStore = (_dec = (0, _choerodonBootCombine.store)('ClientStore'), _dec(_class = (_class2 = function () {
  function ClientStore() {
    var totalPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var totalSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    (0, _classCallCheck3['default'])(this, ClientStore);

    _initDefineProp(this, 'clients', _descriptor, this);

    _initDefineProp(this, 'clientById', _descriptor2, this);

    _initDefineProp(this, 'totalSize', _descriptor3, this);

    _initDefineProp(this, 'totalPage', _descriptor4, this);

    _initDefineProp(this, 'isLoading', _descriptor5, this);

    _initDefineProp(this, 'seachData', _descriptor6, this);

    _initDefineProp(this, 'isRefresh', _descriptor7, this);

    this.getClientById = function (organizationId, id) {
      return _rxjs.Observable.fromPromise(_choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/clients/' + id));
    };

    this.createClient = function (organizationId, client) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/clients', JSON.stringify(client));
    };

    this.getCreateClientInitValue = function (organizationId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/clients/createInfo');
    };

    this.updateClient = function (organizationId, client, id) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/clients/' + id, JSON.stringify(client));
    };

    this.deleteClientById = function (organizationId, id) {
      return _choerodonBootCombine.axios['delete']('/iam/v1/organizations/' + organizationId + '/clients/' + id);
    };

    this.checkName = function (organizationId, client) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/clients/check', client);
    };

    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  (0, _createClass3['default'])(ClientStore, [{
    key: 'setClients',
    value: function setClients(data) {
      this.clients = data;
    }
  }, {
    key: 'setSearchData',
    value: function setSearchData(data) {
      this.seachData = data;
    }
  }, {
    key: 'setClientById',
    value: function setClientById(data) {
      this.clientById = data;
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
    key: 'changeRefresh',
    value: function changeRefresh(flag) {
      this.isRefresh = flag;
    }
  }, {
    key: 'loadClients',
    value: function loadClients(organizationId, _ref, _ref2, _ref3, params) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var _ref2$columnKey = _ref2.columnKey,
          columnKey = _ref2$columnKey === undefined ? 'id' : _ref2$columnKey,
          _ref2$order = _ref2.order,
          order = _ref2$order === undefined ? 'descend' : _ref2$order;
      var name = _ref3.name;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        name: name,
        params: params
      };
      this.changeLoading(true);
      if (columnKey) {
        var sorter = [];
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
        queryObj.sort = sorter.join(',');
      }
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/clients?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'getClients',
    get: function get() {
      return this.clients.slice();
    }
  }, {
    key: 'getClient',
    get: function get() {
      return this.clientById;
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
  return ClientStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'clients', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'clientById', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'totalSize', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'totalPage', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'isLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'seachData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'isRefresh', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setClients', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setClients'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSearchData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSearchData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getClients', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getClients'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setClientById', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setClientById'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getClient', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getClient'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalSize', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalSize', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalSize'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTotalPage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTotalPage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTotalPage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changeLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changeLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'changeRefresh', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'changeRefresh'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype)), _class2)) || _class);


var clientStore = new ClientStore();

exports['default'] = clientStore;
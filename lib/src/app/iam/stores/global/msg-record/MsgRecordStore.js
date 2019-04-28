'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor;

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

var MsgRecordStore = (_dec = (0, _choerodonBootCombine.store)('MsgRecordStore'), _dec(_class = (_class2 = function () {
  function MsgRecordStore() {
    (0, _classCallCheck3['default'])(this, MsgRecordStore);

    _initDefineProp(this, 'data', _descriptor, this);

    this.retry = function (id, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      var method = appType === 'site' ? 'post' : 'get';
      return _choerodonBootCombine.axios[method]('/notify/v1/records/emails/' + id + '/retry' + path);
    };
  }

  (0, _createClass3['default'])(MsgRecordStore, [{
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'loadData',
    value: function loadData(_ref, _ref2, _ref3, params, appType, orgId) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var status = _ref2.status,
          email = _ref2.email,
          templateType = _ref2.templateType,
          failedReason = _ref2.failedReason,
          retryStatus = _ref2.retryStatus;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'id' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'descend' : _ref3$order;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        status: status,
        receiveEmail: email,
        templateType: templateType,
        failedReason: failedReason,
        retryStatus: retryStatus,
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
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.get('/notify/v1/records/emails' + path + '?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'getData',
    get: function get() {
      return this.data;
    }
  }]);
  return MsgRecordStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getData'), _class2.prototype)), _class2)) || _class);


var msgRecordStore = new MsgRecordStore();

exports['default'] = msgRecordStore;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

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

var RoleLabelStore = (_dec = (0, _choerodonBootCombine.store)('RoleLabelStore'), _dec(_class = (_class2 = function () {
  function RoleLabelStore() {
    (0, _classCallCheck3['default'])(this, RoleLabelStore);

    _initDefineProp(this, 'loading', _descriptor, this);

    _initDefineProp(this, 'data', _descriptor2, this);
  }

  (0, _createClass3['default'])(RoleLabelStore, [{
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(loading) {
      this.loading = loading;
    }
  }, {
    key: 'loadData',
    value: function loadData(_ref, _ref2, params) {
      var name = _ref.name,
          level = _ref.level,
          description = _ref.description;
      var _ref2$columnKey = _ref2.columnKey,
          columnKey = _ref2$columnKey === undefined ? 'id' : _ref2$columnKey,
          _ref2$order = _ref2.order,
          order = _ref2$order === undefined ? 'descend' : _ref2$order;

      var queryObj = {
        name: name,
        level: level,
        description: description,
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
      return _choerodonBootCombine.axios.get('/iam/v1/labels?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'getData',
    get: function get() {
      return this.data;
    }
  }, {
    key: 'getLoading',
    get: function get() {
      return this.loading;
    }
  }]);
  return RoleLabelStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'data', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoading'), _class2.prototype)), _class2)) || _class);


var roleLabelStore = new RoleLabelStore();

exports['default'] = roleLabelStore;
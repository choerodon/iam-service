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

var MailSettingStore = (_dec = (0, _choerodonBootCombine.store)('MailSettingStore'), _dec(_class = (_class2 = function () {
  function MailSettingStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, MailSettingStore);

    _initDefineProp(this, 'mailSettingData', _descriptor, this);

    this.loadData = function () {
      _this.cleanData();
      return _choerodonBootCombine.axios.get('notify/v1/notices/configs/email');
    };

    this.updateData = function (data) {
      return _choerodonBootCombine.axios.put('notify/v1/notices/configs/email', JSON.stringify(data));
    };

    this.testConnection = function (data) {
      return _choerodonBootCombine.axios.post('notify/v1/notices/configs/email/test', JSON.stringify(data));
    };
  }

  (0, _createClass3['default'])(MailSettingStore, [{
    key: 'setSettingData',
    value: function setSettingData(data) {
      this.mailSettingData = data;
    }
  }, {
    key: 'cleanData',
    value: function cleanData() {
      this.mailSettingData = {};
    }
  }, {
    key: 'getSettingData',
    get: function get() {
      return this.mailSettingData;
    }
  }]);
  return MailSettingStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mailSettingData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setSettingData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSettingData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSettingData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSettingData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'cleanData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'cleanData'), _class2.prototype)), _class2)) || _class);


var mailSettingStore = new MailSettingStore();
exports['default'] = mailSettingStore;
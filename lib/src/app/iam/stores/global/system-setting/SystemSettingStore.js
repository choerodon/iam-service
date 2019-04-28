'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

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

var SystemSettingStore = (_dec = (0, _choerodonBootCombine.store)('SystemSettingStore'), _dec(_class = (_class2 = function () {
  function SystemSettingStore() {
    (0, _classCallCheck3['default'])(this, SystemSettingStore);

    _initDefineProp(this, 'logoLoadingStatus', _descriptor, this);

    _initDefineProp(this, 'userSetting', _descriptor2, this);

    _initDefineProp(this, 'logo', _descriptor3, this);

    _initDefineProp(this, 'favicon', _descriptor4, this);

    _initDefineProp(this, 'submitting', _descriptor5, this);
  }

  (0, _createClass3['default'])(SystemSettingStore, [{
    key: 'setUserSetting',
    value: function setUserSetting(data) {
      this.userSetting = data;
    }
  }, {
    key: 'setFavicon',
    value: function setFavicon(favicon) {
      this.favicon = favicon;
    }
  }, {
    key: 'setLogo',
    value: function setLogo(logo) {
      this.logo = logo;
    }
  }, {
    key: 'putUserSetting',
    value: function putUserSetting(data) {
      return _choerodonBootCombine.axios.put('/iam/v1/system/setting', data);
    }
  }, {
    key: 'postUserSetting',
    value: function postUserSetting(data) {
      return _choerodonBootCombine.axios.post('/iam/v1/system/setting', data);
    }
  }, {
    key: 'resetUserSetting',
    value: function resetUserSetting() {
      return _choerodonBootCombine.axios['delete']('/iam/v1/system/setting');
    }
  }, {
    key: 'loadUserSetting',
    value: function loadUserSetting() {
      return _choerodonBootCombine.axios.get('/iam/v1/system/setting');
    }
  }, {
    key: 'getUserSetting',
    get: function get() {
      return this.userSetting ? this.userSetting : {};
    }
  }, {
    key: 'getFavicon',
    get: function get() {
      return this.favicon ? this.favicon : '';
    }
  }, {
    key: 'getLogo',
    get: function get() {
      return this.logo ? this.logo : '';
    }
  }]);
  return SystemSettingStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'logoLoadingStatus', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'userSetting', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'logo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'favicon', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'submitting', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'getUserSetting', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserSetting'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserSetting', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserSetting'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getFavicon', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getFavicon'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setFavicon', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setFavicon'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLogo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLogo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLogo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLogo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'putUserSetting', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'putUserSetting'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'postUserSetting', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'postUserSetting'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'resetUserSetting', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'resetUserSetting'), _class2.prototype)), _class2)) || _class);


var systemSettingStore = new SystemSettingStore();

exports['default'] = systemSettingStore;
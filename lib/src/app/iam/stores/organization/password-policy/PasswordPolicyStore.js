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

var PasswordPolicyStore = (_dec = (0, _choerodonBootCombine.store)('PasswordPolicyStore'), _dec(_class = (_class2 = function () {
  function PasswordPolicyStore() {
    (0, _classCallCheck3['default'])(this, PasswordPolicyStore);

    _initDefineProp(this, 'passwordPolicy', _descriptor, this);

    _initDefineProp(this, 'isLoading', _descriptor2, this);

    this.updatePasswordPolicy = function (orgId, id, data) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + orgId + '/password_policies/' + id, JSON.stringify(data));
    };
  }

  (0, _createClass3['default'])(PasswordPolicyStore, [{
    key: 'setIsLoading',
    value: function setIsLoading(flag) {
      this.isLoading = flag;
    }
  }, {
    key: 'setPasswordPolicy',
    value: function setPasswordPolicy(data) {
      this.passwordPolicy = data;
    }
  }, {
    key: 'cleanData',
    value: function cleanData() {
      this.passwordPolicy = {};
    }
  }, {
    key: 'setPasswordChange',
    value: function setPasswordChange(change) {
      this.passwordChange = change;
    }
  }, {
    key: 'setLoginChange',
    value: function setLoginChange(change) {
      this.passwordChange = change;
    }
  }, {
    key: 'loadData',
    value: function loadData(organizationId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/password_policies');
    }
  }, {
    key: 'getIsLoading',
    get: function get() {
      return this.isLoading;
    }
  }, {
    key: 'getPasswordPolicy',
    get: function get() {
      return this.passwordPolicy;
    }
  }, {
    key: 'getPasswordChange',
    get: function get() {
      return this.passwordChange;
    }
  }, {
    key: 'getLoginChange',
    get: function get() {
      return this.passwordChange;
    }
  }]);
  return PasswordPolicyStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'passwordPolicy', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'isLoading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setIsLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getIsLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getIsLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPasswordPolicy', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPasswordPolicy'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getPasswordPolicy', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getPasswordPolicy'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'cleanData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'cleanData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPasswordChange', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPasswordChange'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getPasswordChange', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getPasswordChange'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoginChange', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoginChange'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoginChange', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoginChange'), _class2.prototype)), _class2)) || _class);


var passwordPolicyStore = new PasswordPolicyStore();

exports['default'] = passwordPolicyStore;
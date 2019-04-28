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

var CreateUserStore = (_dec = (0, _choerodonBootCombine.store)('CreateUserStore'), _dec(_class = (_class2 = function () {
  function CreateUserStore() {
    (0, _classCallCheck3['default'])(this, CreateUserStore);

    _initDefineProp(this, 'language', _descriptor, this);

    _initDefineProp(this, 'passwordPolicy', _descriptor2, this);

    this.checkUsername = function (organizationId, loginName) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/users/check', JSON.stringify({ organizationId: organizationId, loginName: loginName }));
    };

    this.checkEmailAddress = function (organizationId, email) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + organizationId + '/users/check', JSON.stringify({ organizationId: organizationId, email: email }));
    };

    this.createUser = function (user, id) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/' + id + '/users', JSON.stringify(user));
    };

    this.getUserInfoById = function (orgId, id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + orgId + '/users/' + id);
    };

    this.updateUser = function (orgId, id, user) {
      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + orgId + '/users/' + id, JSON.stringify(user));
    };
  }

  (0, _createClass3['default'])(CreateUserStore, [{
    key: 'setLanguage',
    value: function setLanguage(lang) {
      this.language = lang;
    }
  }, {
    key: 'setPasswordPolicy',
    value: function setPasswordPolicy(data) {
      this.passwordPolicy = data;
    }
  }, {
    key: 'loadPasswordPolicyById',
    value: function loadPasswordPolicyById(id) {
      var _this = this;

      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + id + '/password_policies').then(function (data) {
        _this.setPasswordPolicy(data);
      });
    }
  }, {
    key: 'getLanguage',
    get: function get() {
      return this.language;
    }
  }, {
    key: 'getPasswordPolicy',
    get: function get() {
      return this.passwordPolicy;
    }
  }]);
  return CreateUserStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'language', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'passwordPolicy', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, 'setLanguage', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLanguage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLanguage', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLanguage'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPasswordPolicy', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPasswordPolicy'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getPasswordPolicy', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getPasswordPolicy'), _class2.prototype)), _class2)) || _class);


var createUserStore = new CreateUserStore();

exports['default'] = createUserStore;
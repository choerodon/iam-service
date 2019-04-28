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

var UserInfoStore = (_dec = (0, _choerodonBootCombine.store)('UserInfoStore'), _dec(_class = (_class2 = function () {
  function UserInfoStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, UserInfoStore);

    _initDefineProp(this, 'userInfo', _descriptor, this);

    _initDefineProp(this, 'avatar', _descriptor2, this);

    this.updateUserInfo = function (user) {
      return _choerodonBootCombine.axios.put('/iam/v1/users/' + user.id + '/info', JSON.stringify(user));
    };

    this.updatePassword = function (id, body) {
      return _choerodonBootCombine.axios.put('/iam/v1/users/' + id + '/password', JSON.stringify(body));
    };

    this.checkEmailAddress = function (email) {
      return _choerodonBootCombine.axios.post('/iam/v1/users/check', JSON.stringify({ id: _this.userInfo.id, email: email }));
    };
  }

  (0, _createClass3['default'])(UserInfoStore, [{
    key: 'setUserInfo',
    value: function setUserInfo(data) {
      this.userInfo = data;
      this.avatar = data.imageUrl;
    }
  }, {
    key: 'setAvatar',
    value: function setAvatar(avatar) {
      this.avatar = avatar;
    }
  }, {
    key: 'getUserInfo',
    get: function get() {
      return this.userInfo;
    }
  }, {
    key: 'getAvatar',
    get: function get() {
      return this.avatar;
    }
  }]);
  return UserInfoStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'userInfo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'avatar', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, 'getUserInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setAvatar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setAvatar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getAvatar', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getAvatar'), _class2.prototype)), _class2)) || _class);
exports['default'] = new UserInfoStore();
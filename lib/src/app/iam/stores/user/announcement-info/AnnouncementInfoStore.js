'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

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

var AnnouncementInfoStore = (_dec = (0, _choerodonBootCombine.store)('AnnouncementInfoStore'), _dec(_class = (_class2 = function () {
  function AnnouncementInfoStore() {
    (0, _classCallCheck3['default'])(this, AnnouncementInfoStore);

    _initDefineProp(this, 'announcementData', _descriptor, this);

    _initDefineProp(this, 'visible', _descriptor2, this);

    _initDefineProp(this, 'title', _descriptor3, this);

    _initDefineProp(this, 'content', _descriptor4, this);
  }

  (0, _createClass3['default'])(AnnouncementInfoStore, [{
    key: 'showDetail',
    value: function showDetail(_ref) {
      var title = _ref.title,
          content = _ref.content;

      this.title = title;
      this.content = content;
      this.visible = true;
    }
  }, {
    key: 'closeDetail',
    value: function closeDetail() {
      this.visible = false;
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var _this = this;

      return _choerodonBootCombine.axios.get('notify/v1/system_notice/completed?size=30').then((0, _mobx.action)(function (data) {
        if (!data.failed) {
          _this.announcementData = data.content;
        }
      }));
    }
  }]);
  return AnnouncementInfoStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'announcementData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'visible', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'title', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'content', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'showDetail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'showDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'closeDetail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'closeDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype)), _class2)) || _class);
exports['default'] = new AnnouncementInfoStore();
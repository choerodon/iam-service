'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

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

var ProjectSettingStore = (_dec = (0, _choerodonBootCombine.store)('ProjectSettingStore'), _dec(_class = (_class2 = function () {
  function ProjectSettingStore() {
    (0, _classCallCheck3['default'])(this, ProjectSettingStore);

    _initDefineProp(this, 'projectInfo', _descriptor, this);

    _initDefineProp(this, 'projectTypes', _descriptor2, this);

    _initDefineProp(this, 'imageUrl', _descriptor3, this);

    this.loadProjectTypes = function () {
      return _choerodonBootCombine.axios.get('/iam/v1/projects/types');
    };
  }

  (0, _createClass3['default'])(ProjectSettingStore, [{
    key: 'setImageUrl',
    value: function setImageUrl(data) {
      this.imageUrl = data;
    }
  }, {
    key: 'setProjectInfo',
    value: function setProjectInfo(data) {
      this.projectInfo = data;
    }
  }, {
    key: 'setProjectTypes',
    value: function setProjectTypes(data) {
      this.projectTypes = data;
    }
  }, {
    key: 'axiosGetProjectInfo',
    value: function axiosGetProjectInfo(id) {
      return _choerodonBootCombine.axios.get('/iam/v1/projects/' + id);
    }
  }, {
    key: 'axiosSaveProjectInfo',
    value: function axiosSaveProjectInfo(data) {
      return _choerodonBootCombine.axios.put('/iam/v1/projects/' + data.id, data);
    }
  }, {
    key: 'disableProject',
    value: function disableProject(proId) {
      return _choerodonBootCombine.axios.put('/iam/v1/projects/' + proId + '/disable');
    }
  }, {
    key: 'getImageUrl',
    get: function get() {
      return this.imageUrl;
    }
  }, {
    key: 'getProjectInfo',
    get: function get() {
      return this.projectInfo;
    }
  }, {
    key: 'getProjectTypes',
    get: function get() {
      return this.projectTypes;
    }
  }]);
  return ProjectSettingStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'projectInfo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'projectTypes', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'imageUrl', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setImageUrl', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setImageUrl'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getImageUrl', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getImageUrl'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setProjectInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setProjectInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getProjectInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getProjectInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setProjectTypes', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setProjectTypes'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getProjectTypes', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getProjectTypes'), _class2.prototype)), _class2)) || _class);


var projectSettingStore = new ProjectSettingStore();

exports['default'] = projectSettingStore;
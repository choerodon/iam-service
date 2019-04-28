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

var SendSettingStore = (_dec = (0, _choerodonBootCombine.store)('SendSettingStore'), _dec(_class = (_class2 = function () {
  function SendSettingStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, SendSettingStore);

    _initDefineProp(this, 'data', _descriptor, this);

    _initDefineProp(this, 'currentRecord', _descriptor2, this);

    _initDefineProp(this, 'template', _descriptor3, this);

    _initDefineProp(this, 'pmTemplate', _descriptor4, this);

    _initDefineProp(this, 'currentTemplate', _descriptor5, this);

    this.loadCurrentRecord = function (id, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.get('/notify/v1/notices/send_settings/' + id + path);
    };

    this.loadTemplate = function (appType, orgId, businessType) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      _choerodonBootCombine.axios.get('notify/v1/notices/emails/templates/names' + path + '?business_type=' + businessType).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.setTemplate(data);
        }
      });
    };

    this.loadPmTemplate = function (appType, orgId, businessType) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      _choerodonBootCombine.axios.get('notify/v1/notices/letters/templates/names' + path + '?business_type=' + businessType).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.setPmTemplate(data);
        }
      });
    };

    this.modifySetting = function (id, body, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.put('notify/v1/notices/send_settings/' + id + path, JSON.stringify(body));
    };

    this.deleteSettingById = function (id) {
      return _choerodonBootCombine.axios['delete']('notify/v1/notices/send_settings/' + id);
    };
  }

  (0, _createClass3['default'])(SendSettingStore, [{
    key: 'setData',
    value: function setData(data) {
      this.data = data;
    }
  }, {
    key: 'setCurrentRecord',
    value: function setCurrentRecord(data) {
      this.currentRecord = data;
    }
  }, {
    key: 'setCurrentTemplate',
    value: function setCurrentTemplate(data) {
      this.currentTemplate = data;
    }
  }, {
    key: 'setTemplate',
    value: function setTemplate(data) {
      this.template = data;
    }
  }, {
    key: 'setPmTemplate',
    value: function setPmTemplate(data) {
      this.pmTemplate = data;
    }
  }, {
    key: 'loadData',
    value: function loadData(_ref, _ref2, _ref3, params, appType, orgId) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var name = _ref2.name,
          code = _ref2.code,
          description = _ref2.description,
          level = _ref2.level;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'id' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'descend' : _ref3$order;

      var queryObj = {
        page: current - 1,
        size: pageSize,
        name: name,
        code: code,
        description: description,
        level: level,
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
      return _choerodonBootCombine.axios.get('/notify/v1/notices/send_settings' + path + '?' + _queryString2['default'].stringify(queryObj));
    }
  }, {
    key: 'getData',
    get: function get() {
      return this.data;
    }
  }, {
    key: 'getCurrentRecord',
    get: function get() {
      return this.currentRecord;
    }
  }, {
    key: 'getCurrentTemplate',
    get: function get() {
      return this.currentTemplate;
    }
  }, {
    key: 'getTemplate',
    get: function get() {
      return this.template;
    }
  }, {
    key: 'getPmTemplate',
    get: function get() {
      return this.pmTemplate;
    }
  }]);
  return SendSettingStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'currentRecord', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'template', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'pmTemplate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'currentTemplate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentRecord', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentRecord'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentRecord', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentRecord'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentTemplate', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentTemplate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentTemplate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentTemplate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTemplate', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTemplate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTemplate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTemplate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPmTemplate', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPmTemplate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getPmTemplate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getPmTemplate'), _class2.prototype)), _class2)) || _class);


var sendSettingStore = new SendSettingStore();

exports['default'] = sendSettingStore;
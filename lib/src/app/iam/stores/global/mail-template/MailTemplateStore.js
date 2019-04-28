'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6; /**
                                                                                                                              * Created by chenbinjie on 2018/8/6.
                                                                                                                              */


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

var MailTemplateStore = (_dec = (0, _choerodonBootCombine.store)('MailTemplateStore'), _dec(_class = (_class2 = function () {
  function MailTemplateStore() {
    (0, _classCallCheck3['default'])(this, MailTemplateStore);

    _initDefineProp(this, 'loading', _descriptor, this);

    _initDefineProp(this, 'mailTemplate', _descriptor2, this);

    _initDefineProp(this, 'templateType', _descriptor3, this);

    _initDefineProp(this, 'currentDetail', _descriptor4, this);

    _initDefineProp(this, 'editorContent', _descriptor5, this);

    _initDefineProp(this, 'selectType', _descriptor6, this);

    this.loadMailTemplate = function (_ref, _ref2, _ref3, params, appType, orgId) {
      var current = _ref.current,
          pageSize = _ref.pageSize;
      var name = _ref2.name,
          code = _ref2.code,
          type = _ref2.type,
          isPredefined = _ref2.isPredefined;
      var _ref3$columnKey = _ref3.columnKey,
          columnKey = _ref3$columnKey === undefined ? 'id' : _ref3$columnKey,
          _ref3$order = _ref3.order,
          order = _ref3$order === undefined ? 'descend' : _ref3$order;

      var queryObj = {
        name: name && name[0],
        type: type && type[0],
        code: code && code[0],
        isPredefined: isPredefined && isPredefined[0],
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
      if (appType === 'site') {
        return _choerodonBootCombine.axios.get('/notify/v1/notices/emails/templates?page=' + (current - 1) + '&size=' + pageSize + '&' + _queryString2['default'].stringify(queryObj));
      } else {
        return _choerodonBootCombine.axios.get('/notify/v1/notices/emails/templates/organizations/' + orgId + '?page=' + (current - 1) + '&size=' + pageSize + '&' + _queryString2['default'].stringify(queryObj));
      }
    };

    this.loadTemplateType = function (appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.get('/notify/v1/notices/send_settings/names' + path);
    };

    this.createTemplate = function (data, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.post('notify/v1/notices/emails/templates' + path, JSON.stringify(data));
    };

    this.deleteMailTemplate = function (id, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios['delete']('/notify/v1/notices/emails/templates/' + id + path);
    };

    this.getTemplateDetail = function (id, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.get('notify/v1/notices/emails/templates/' + id + path);
    };

    this.updateTemplateDetail = function (id, data, appType, orgId) {
      var path = appType === 'site' ? '' : '/organizations/' + orgId;
      return _choerodonBootCombine.axios.put('notify/v1/notices/emails/templates/' + id + path, JSON.stringify(data));
    };
  }

  (0, _createClass3['default'])(MailTemplateStore, [{
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setMailTemplate',
    value: function setMailTemplate(data) {
      this.mailTemplate = data;
    }
  }, {
    key: 'setTemplateType',
    value: function setTemplateType(data) {
      this.templateType = data;
    }
  }, {
    key: 'setCurrentDetail',
    value: function setCurrentDetail(data) {
      this.currentDetail = data;
    }
  }, {
    key: 'setEditorContent',
    value: function setEditorContent(data) {
      this.editorContent = data;
    }
  }, {
    key: 'setSelectType',
    value: function setSelectType(data) {
      this.selectType = data;
    }
  }, {
    key: 'getMailTemplate',
    value: function getMailTemplate() {
      return this.mailTemplate;
    }
  }, {
    key: 'getTemplateType',
    get: function get() {
      return this.templateType;
    }
  }, {
    key: 'getCurrentDetail',
    get: function get() {
      return this.currentDetail;
    }
  }, {
    key: 'getEditorContent',
    get: function get() {
      return this.editorContent;
    }
  }]);
  return MailTemplateStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mailTemplate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'templateType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'currentDetail', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'editorContent', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'selectType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'create';
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setMailTemplate', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setMailTemplate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setTemplateType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setTemplateType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTemplateType', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTemplateType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentDetail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentDetail', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEditorContent', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEditorContent'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getEditorContent', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getEditorContent'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSelectType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSelectType'), _class2.prototype)), _class2)) || _class);


var mailTemplateStore = new MailTemplateStore();
exports['default'] = mailTemplateStore;
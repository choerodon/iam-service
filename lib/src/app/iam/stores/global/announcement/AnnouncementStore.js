'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _util = require('../../../common/util');

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

var imgPartten = /<img(.*?)>/g;
var htmlTagParttrn = /<[^>]*>/g;

function htmlDecode(str) {
  var s = '';
  if (str.length === 0) return '';
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, '\'');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/<br>/g, '\n');
  return s;
}

var AnnouncementStore = (_dec = (0, _choerodonBootCombine.store)('AnnouncementStore'), _dec(_class = (_class2 = function () {
  function AnnouncementStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, AnnouncementStore);

    _initDefineProp(this, 'announcementData', _descriptor, this);

    _initDefineProp(this, 'editorContent', _descriptor2, this);

    _initDefineProp(this, 'loading', _descriptor3, this);

    _initDefineProp(this, 'submitting', _descriptor4, this);

    _initDefineProp(this, 'sidebarVisible', _descriptor5, this);

    _initDefineProp(this, 'currentRecord', _descriptor6, this);

    _initDefineProp(this, 'pagination', _descriptor7, this);

    _initDefineProp(this, 'params', _descriptor8, this);

    _initDefineProp(this, 'filters', _descriptor9, this);

    _initDefineProp(this, 'sort', _descriptor10, this);

    _initDefineProp(this, 'announcementType', _descriptor11, this);

    _initDefineProp(this, 'selectType', _descriptor12, this);

    this.deleteAnnouncementById = function (id) {
      return _choerodonBootCombine.axios['delete'](_this.announcementType.apiPrefix + '/' + id);
    };

    this.createAnnouncement = function (data) {
      return _choerodonBootCombine.axios.post(_this.announcementType.apiPrefix + '/create', JSON.stringify(data));
    };

    this.modifyAnnouncement = function (data) {
      return _choerodonBootCombine.axios.put(_this.announcementType.apiPrefix + '/update', JSON.stringify(data));
    };
  }

  (0, _createClass3['default'])(AnnouncementStore, [{
    key: 'setSelectType',
    value: function setSelectType(type) {
      this.selectType = type;
    }
  }, {
    key: 'setAnnouncementType',
    value: function setAnnouncementType(type) {
      this.announcementType = type;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.loadData({ current: 1, pageSize: 10, total: 0 }, {}, { columnKey: 'id', order: 'descend' }, []);
    }
  }, {
    key: 'setSubmitting',
    value: function setSubmitting(flag) {
      this.submitting = flag;
    }
  }, {
    key: 'setCurrentRecord',
    value: function setCurrentRecord(record) {
      this.currentRecord = record;
    }
  }, {
    key: 'showSideBar',
    value: function showSideBar() {
      this.sidebarVisible = true;
    }
  }, {
    key: 'hideSideBar',
    value: function hideSideBar() {
      this.sidebarVisible = false;
    }
  }, {
    key: 'setEditorContent',
    value: function setEditorContent(data) {
      this.editorContent = data;
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.filters;

      var _this2 = this;

      var sort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.sort;
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.params;
      var columnKey = sort.columnKey,
          order = sort.order;

      var sorter = [];
      if (columnKey) {
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
      }
      this.loading = true;
      this.filters = filters;
      this.sort = sort;
      this.params = params;
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        this.announcementData.length = 0;
        this.pagination = {
          current: 1,
          pageSize: 10,
          total: 0
        };
        this.loading = false;
        return;
      }
      return _choerodonBootCombine.axios.get(this.announcementType.apiPrefix + '/all?' + _queryString2['default'].stringify({
        page: pagination.current - 1,
        size: pagination.pageSize,
        content: filters.content && filters.content[0],
        status: filters.status && filters.status[0],
        title: filters.title && filters.title[0],
        params: params.join(','),
        sort: sorter.join(',')
      })).then((0, _mobx.action)(function (_ref) {
        var failed = _ref.failed,
            content = _ref.content,
            totalElements = _ref.totalElements;

        if (!failed) {
          _this2.announcementData = content;
          _this2.announcementData.forEach(function (data) {
            data.textContent = htmlDecode(data.content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, ''));
          });
          // this.announcementData.content = content.content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, '');
          _this2.pagination = (0, _extends3['default'])({}, pagination, {
            total: totalElements
          });
        }
        _this2.loading = false;
      }))['catch']((0, _mobx.action)(function (error) {
        Choerodon.handleResponseError(error);
        _this2.loading = false;
      }));
    }
  }]);
  return AnnouncementStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'announcementData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'editorContent', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'submitting', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sidebarVisible', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'currentRecord', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'pagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return { columnKey: 'id', order: 'descend' };
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'announcementType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'selectType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'create';
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setSelectType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSelectType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setAnnouncementType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setAnnouncementType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setSubmitting', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setSubmitting'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentRecord', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentRecord'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'showSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'showSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hideSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'hideSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEditorContent', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEditorContent'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype)), _class2)) || _class);
exports['default'] = new AnnouncementStore();
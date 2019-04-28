'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16;

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

var PAGELOADSIZE = 10;

/**
 * 在今天这个版本重构消息添加了两种类型，在界面上标注为消息和通知。
 */
var UserMsgStore = (_dec = (0, _choerodonBootCombine.store)('UserMsgStore'), _dec(_class = (_class2 = function () {
  function UserMsgStore() {
    (0, _classCallCheck3['default'])(this, UserMsgStore);

    _initDefineProp(this, 'userMsg', _descriptor, this);

    _initDefineProp(this, 'announceMsg', _descriptor2, this);

    _initDefineProp(this, 'userInfo', _descriptor3, this);

    _initDefineProp(this, 'expandCardId', _descriptor4, this);

    _initDefineProp(this, 'selectMsg', _descriptor5, this);

    _initDefineProp(this, 'expandMsg', _descriptor6, this);

    _initDefineProp(this, 'currentType', _descriptor7, this);

    _initDefineProp(this, 'showAll', _descriptor8, this);

    _initDefineProp(this, 'loading', _descriptor9, this);

    _initDefineProp(this, 'pagination', _descriptor10, this);

    _initDefineProp(this, 'sort', _descriptor11, this);

    _initDefineProp(this, 'filters', _descriptor12, this);

    _initDefineProp(this, 'params', _descriptor13, this);

    _initDefineProp(this, 'loadingMore', _descriptor14, this);

    _initDefineProp(this, 'needReload', _descriptor15, this);

    _initDefineProp(this, 'paginationChange', _descriptor16, this);
  }

  (0, _createClass3['default'])(UserMsgStore, [{
    key: 'setNeedReload',
    value: function setNeedReload(flag) {
      this.needReload = flag;
    }
  }, {
    key: 'initPagination',
    value: function initPagination() {
      this.pagination = {
        current: 1,
        pageSize: PAGELOADSIZE,
        total: 0,
        totalPages: 0,
        onChange: this.paginationChange,
        onShowSizeChange: this.paginationChange
      };
    }
  }, {
    key: 'expandAllMsg',
    value: function expandAllMsg() {
      var msg = this.currentType === 'announcement' ? this.getAnnounceMsg.map((0, _mobx.action)(function (v) {
        return v.id;
      })) : this.getUserMsg.map((0, _mobx.action)(function (v) {
        return v.id;
      }));
      this.expandMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.expandMsg), (0, _toConsumableArray3['default'])(msg)));
    }
  }, {
    key: 'selectAllMsg',
    value: function selectAllMsg() {
      this.selectMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.selectMsg), (0, _toConsumableArray3['default'])(this.getUserMsg.map((0, _mobx.action)(function (v) {
        return v.id;
      })))));
    }
  }, {
    key: 'unSelectAllMsg',
    value: function unSelectAllMsg() {
      var _this = this;

      this.selectMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.selectMsg)).filter(function (x) {
        return !_this.userMsg.find(function (v) {
          return v.id === x;
        });
      }));
    }
  }, {
    key: 'setCurrentType',
    value: function setCurrentType(newType) {
      this.currentType = newType;
    }
  }, {
    key: 'addSelectMsgById',
    value: function addSelectMsgById(id) {
      this.selectMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.selectMsg), [id]));
    }
  }, {
    key: 'expandMsgById',
    value: function expandMsgById(id) {
      this.expandMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.expandMsg), [id]));
    }
  }, {
    key: 'unExpandMsgById',
    value: function unExpandMsgById(id) {
      this.expandMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.expandMsg)).filter(function (v) {
        return v !== id;
      }));
    }
  }, {
    key: 'setLoadingMore',
    value: function setLoadingMore(flag) {
      this.loadingMore = flag;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'deleteSelectMsgById',
    value: function deleteSelectMsgById(id) {
      this.selectMsg = new Set([].concat((0, _toConsumableArray3['default'])(this.selectMsg)).filter(function (v) {
        return v !== id;
      }));
    }
  }, {
    key: 'setExpandCardId',
    value: function setExpandCardId(id) {
      this.expandCardId = id;
      this.setReadLocal(id);
    }
  }, {
    key: 'setUserMsg',
    value: function setUserMsg(data) {
      this.userMsg = data;
    }
  }, {
    key: 'setAnnounceMsg',
    value: function setAnnounceMsg(data) {
      this.announceMsg = data;
    }
  }, {
    key: 'setUserInfo',
    value: function setUserInfo(data) {
      this.userInfo = data;
    }
  }, {
    key: 'setReadLocal',
    value: function setReadLocal(id) {
      this.userMsg.forEach(function (v) {
        if (v.id === id) v.read = true;
      });
    }
  }, {
    key: 'readMsg',
    value: function readMsg(data) {
      data = data === undefined ? [].concat((0, _toConsumableArray3['default'])(this.selectMsg)) : data;
      return _choerodonBootCombine.axios.put('/notify/v1/notices/sitemsgs/batch_read?user_id=' + this.userInfo.id, JSON.stringify(data));
    }

    /**
     * 不传data时默认将store中选中的消息设为删除
     * @param data
     * @returns {*|IDBRequest|Promise<void>}
     */

  }, {
    key: 'deleteMsg',
    value: function deleteMsg(data) {
      data = data === undefined ? [].concat((0, _toConsumableArray3['default'])(this.selectMsg)) : data;
      return _choerodonBootCombine.axios.put('/notify/v1/notices/sitemsgs/batch_delete?user_id=' + this.userInfo.id, JSON.stringify(data));
    }

    /**
     * 稳定的load，加载数据并返回Promise
     * @param pagination
     * @param filters
     * @param columnKey
     * @param order
     * @param params
     * @param showAll 为true时获取全部消息，为false时获取未读消息
     * @param type 在今天这个版本重构消息添加了两种类型
     * @returns {*} 返回的是一个Promise
     */

  }, {
    key: 'load',
    value: function load() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.filters;
      var _ref = arguments[2];
      var _ref$columnKey = _ref.columnKey,
          columnKey = _ref$columnKey === undefined ? 'id' : _ref$columnKey,
          _ref$order = _ref.order,
          order = _ref$order === undefined ? 'descend' : _ref$order;
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.params;
      var showAll = arguments[4];
      var type = arguments[5];

      var sorter = [];
      if (columnKey) {
        sorter.push(columnKey);
        if (order === 'descend') {
          sorter.push('desc');
        }
      }
      this.filters = filters;
      this.params = params;
      return _choerodonBootCombine.axios.get('/notify/v1/notices/sitemsgs?' + _queryString2['default'].stringify({
        user_id: this.userInfo.id,
        read: showAll ? null : false,
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: sorter.join(','),
        type: type
      }));
    }
  }, {
    key: 'loadAnnouncement',
    value: function loadAnnouncement() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var filters = arguments[1];
      var sort = arguments[2];
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.params;

      return _choerodonBootCombine.axios.get('/notify/v1/system_notice/completed?' + _queryString2['default'].stringify({
        page: pagination.current - 1,
        size: pagination.pageSize
      }));
    }

    /**
     *
     * @param pagination 分页
     * @param filters 过滤
     * @param columnKey
     * @param order
     * @param params
     * @param showAll 为true时load已读和未读消息，为false时只load未读消息
     * @param isWebSocket 请求是否由webSocket服务器推送（旧有字段，现在重构的版本暂时没有webSocket了，但仍保留，平时使用传false即可）
     * @param msgId 默认展开显示当msgId
     * @param type
     */

  }, {
    key: 'loadData',
    value: function loadData() {
      var pagination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pagination;
      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.filters;
      var _ref2 = arguments[2];
      var _ref2$columnKey = _ref2.columnKey,
          columnKey = _ref2$columnKey === undefined ? 'id' : _ref2$columnKey,
          _ref2$order = _ref2.order,
          order = _ref2$order === undefined ? 'descend' : _ref2$order;
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.params;
      var showAll = arguments[4];
      var isWebSocket = arguments[5];

      var _this2 = this;

      var msgId = arguments[6];
      var type = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : this.currentType;

      if (isWebSocket) this.setLoadingMore(true);else this.setLoading(true);
      if (type !== 'announcement') {
        this.load(pagination, filters, { columnKey: columnKey, order: order }, params, showAll, type).then((0, _mobx.action)(function (data) {
          _this2.setUserMsg(data.content ? data.content : data);
          // 当显示的是未读消息的时候，加载完成后自动展开全部消息
          _this2.showAll = showAll;
          if (!showAll) _this2.expandAllMsg();
          _this2.pagination.totalPages = data.content ? data.totalPages : data.length / PAGELOADSIZE + 1;
          if (isWebSocket) _this2.setLoadingMore(false);else _this2.setLoading(false);
          if (msgId) {
            _this2.setExpandCardId(msgId);
            _this2.readMsg([msgId]);
          }
          _this2.pagination = (0, _extends3['default'])({}, pagination, {
            total: data.totalElements,
            pageSize: _this2.pagination.pageSize,
            onChange: _this2.pagination.onChange,
            onShowSizeChange: _this2.pagination.onShowSizeChange
          });
          _this2.setLoading(false);
        }))['catch']((0, _mobx.action)(function (error) {
          if (isWebSocket) _this2.setLoadingMore(false);else _this2.setLoading(false);
          Choerodon.prompt(error.response.statusText);
        }));
      } else {
        this.loadAnnouncement(pagination = this.pagination, filters, { columnKey: columnKey, order: order }, params).then((0, _mobx.action)(function (data) {
          _this2.setAnnounceMsg(data.content);
          _this2.showAll = true;
          _this2.expandAllMsg();
          _this2.pagination.totalPages = data.content ? data.totalPages : data.length / PAGELOADSIZE + 1;
          _this2.pagination = (0, _extends3['default'])({}, pagination, {
            total: data.totalElements,
            pageSize: _this2.pagination.pageSize,
            onChange: _this2.pagination.onChange,
            onShowSizeChange: _this2.pagination.onShowSizeChange
          });
          _this2.setLoading(false);
        }));
      }
    }
  }, {
    key: 'getNeedReload',
    get: function get() {
      return this.needReload;
    }
  }, {
    key: 'isAllSelected',
    get: function get() {
      var _this3 = this;

      return !this.getUserMsg.some(function (v) {
        return !_this3.selectMsg.has(v.id);
      });
    }
  }, {
    key: 'getCurrentType',
    get: function get() {
      return this.currentType;
    }
  }, {
    key: 'getPagination',
    get: function get() {
      return this.pagination;
    }
  }, {
    key: 'getSelectMsg',
    get: function get() {
      return this.selectMsg;
    }
  }, {
    key: 'getExpandMsg',
    get: function get() {
      return this.expandMsg;
    }
  }, {
    key: 'getLoading',
    get: function get() {
      return this.loading;
    }
  }, {
    key: 'getLoadingMore',
    get: function get() {
      return this.loadingMore;
    }
  }, {
    key: 'getExpandCardId',
    get: function get() {
      return this.expandCardId;
    }
  }, {
    key: 'getUserMsg',
    get: function get() {
      return this.userMsg;
    }
  }, {
    key: 'getAnnounceMsg',
    get: function get() {
      return this.announceMsg;
    }
  }, {
    key: 'getUserInfo',
    get: function get() {
      return this.userInfo;
    }
  }, {
    key: 'isNoMore',
    get: function get() {
      return this.pagination.current === this.pagination.totalPages;
    }

    /**
     * 不传data时默认将store中选中的消息设为已读
     * @param data
     * @returns {*|IDBRequest|Promise<void>}
     */

  }]);
  return UserMsgStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'userMsg', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'announceMsg', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'userInfo', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'expandCardId', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'selectMsg', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'expandMsg', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'currentType', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'msg';
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'showAll', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'pagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: PAGELOADSIZE,
      total: 0,
      onChange: this.paginationChange,
      onShowSizeChange: this.paginationChange
    };
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      columnKey: 'id',
      order: 'descend'
    };
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'loadingMore', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, 'needReload', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setNeedReload', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setNeedReload'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getNeedReload', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getNeedReload'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'initPagination', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'initPagination'), _class2.prototype), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, 'paginationChange', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (current, pageSize) {
      _this4.pagination.current = current;
      _this4.pagination.pageSize = pageSize;
      document.getElementsByClassName('page-content')[0].scrollTop = 0;
      _this4.loadData(_this4.pagination, {}, {}, {}, _this4.showAll, false);
    };
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'expandAllMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'expandAllMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'selectAllMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'selectAllMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'unSelectAllMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'unSelectAllMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'isAllSelected', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'isAllSelected'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getCurrentType', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getCurrentType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setCurrentType', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setCurrentType'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getPagination', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getPagination'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getSelectMsg', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getSelectMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'addSelectMsgById', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'addSelectMsgById'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getExpandMsg', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getExpandMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'expandMsgById', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'expandMsgById'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'unExpandMsgById', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'unExpandMsgById'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoadingMore', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoadingMore'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoadingMore', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoadingMore'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'deleteSelectMsgById', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'deleteSelectMsgById'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getExpandCardId', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getExpandCardId'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setExpandCardId', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setExpandCardId'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUserMsg', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getAnnounceMsg', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getAnnounceMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setAnnounceMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setAnnounceMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUserInfo', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUserInfo', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUserInfo'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setReadLocal', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setReadLocal'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'isNoMore', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'isNoMore'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'readMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'readMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'deleteMsg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'deleteMsg'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'load', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'load'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadAnnouncement', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadAnnouncement'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype)), _class2)) || _class);


var userMsgStore = new UserMsgStore();
exports['default'] = userMsgStore;
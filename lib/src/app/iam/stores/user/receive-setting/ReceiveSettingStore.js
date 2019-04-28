'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var ReceiveSettingStore = (_dec = (0, _choerodonBootCombine.store)('ReceiveSettingStore'), _dec(_class = (_class2 = function () {
  function ReceiveSettingStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, ReceiveSettingStore);

    _initDefineProp(this, 'receiveTypeData', _descriptor, this);

    _initDefineProp(this, 'receiveSettingData', _descriptor2, this);

    _initDefineProp(this, 'allowConfigData', _descriptor3, this);

    _initDefineProp(this, 'loading', _descriptor4, this);

    _initDefineProp(this, 'dirty', _descriptor5, this);

    this.saveData = function () {
      return _choerodonBootCombine.axios.put('/notify/v1/notices/receive_setting/all', JSON.stringify(_this.receiveSettingData));
    };
  }

  /**
   * 接收设置的数据，只存放接收设置中被关闭的消息的数据
   * @type {Array}
   */


  /**
   * 允许被设置的通知的数据
   * @type {Map<any, Object>} id => {name, type, pmType}的映射
   */


  /**
   * 表格是否正在加载中
   * @type {boolean}
   */


  (0, _createClass3['default'])(ReceiveSettingStore, [{
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setDirty',
    value: function setDirty(flag) {
      this.dirty = flag;
    }
  }, {
    key: 'loadReceiveTypeData',
    value: function loadReceiveTypeData(id) {
      var _this2 = this;

      var newData = [];
      return _choerodonBootCombine.axios.get('iam/v1/users/' + id + '/organization_project').then((0, _mobx.action)(function (data) {
        if (data.failed) {
          return data.message;
        } else {
          newData.push({ id: 'site-0', name: '平台设置', code: 'site-0', type: 'site' }); // 需要在表格里添加一个平台设置的选项，code和id不能和已有的组织和项目重复
          _this2.receiveTypeData = newData.concat(data.organizationList.map(function (v) {
            return (0, _extends3['default'])({}, v, { id: 'organization-' + v.id, type: 'organization' });
          }), data.projectList.map(function (v) {
            return (0, _extends3['default'])({}, v, { id: 'project-' + v.id, type: 'project' });
          })); // 这一行是格式化数据
          return _this2.receiveTypeData;
        }
      }));
    }
  }, {
    key: 'loadAllowConfigData',
    value: function loadAllowConfigData() {
      var _this3 = this;

      return _choerodonBootCombine.axios.get('notify/v1/notices/send_settings/list/allow_config').then((0, _mobx.action)(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
          return data.message;
        } else {
          data.forEach(function (v) {
            _this3.allowConfigData.set(v.id, { name: v.name, type: v.level, pmType: v.pmType, disabled: { pm: v.pmTemplateId === null, email: v.emailTemplateId === null } });
          });
          _this3.allowConfigData = new Map(_this3.allowConfigData);
        }
      }));
    }
  }, {
    key: 'loadReceiveSettingData',
    value: function loadReceiveSettingData() {
      var _this4 = this;

      return _choerodonBootCombine.axios.get('notify/v1/notices/receive_setting').then((0, _mobx.action)(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
          return data.message;
        } else {
          _this4.receiveSettingData = data;
        }
      }));
    }
  }, {
    key: 'check',
    value: function check(id, type) {
      var _this5 = this;

      this.dirty = true;
      if (id.split('-').length === 2) {
        // 当使用-分割然后id有2部分时，这是一个项目或组织或site的id，处理成组check的逻辑
        if (!this.isGroupAllSelected(id, type)) {
          this.receiveSettingData.filter(function (v) {
            return v.messageType === type && id === v.sourceType + '-' + v.sourceId;
          }).forEach(function (v) {
            _this5.check(id + '-' + v.sendSettingId, type);
          });
        } else {
          [].concat((0, _toConsumableArray3['default'])(this.allowConfigData.keys())).forEach(function (v) {
            if (id.split('-')[0] === _this5.allowConfigData.get(v).type) {
              _this5.check(id + '-' + v, type);
            }
          });
        }
      } else if (this.receiveSettingData.some(function (v) {
        return v.messageType === type && id === v.sourceType + '-' + v.sourceId + '-' + v.sendSettingId && !_this5.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type];
      })) {
        this.receiveSettingData = this.receiveSettingData.filter(function (v) {
          return v.messageType !== type || v.messageType === type && id !== v.sourceType + '-' + v.sourceId + '-' + v.sendSettingId;
        });
      } else if (!this.allowConfigData.get(parseInt(id.split('-')[2], 10)).disabled[type]) {
        var temp = id.split('-');
        this.receiveSettingData.push({
          messageType: type,
          disable: true,
          sourceType: temp[0],
          sourceId: temp[1],
          sendSettingId: temp[2]
        });
      }
    }

    /**
     * 根据type全选
     * @param type
     */

  }, {
    key: 'checkAll',
    value: function checkAll(type) {
      var _this6 = this;

      this.dirty = true;
      this.receiveSettingData = this.receiveSettingData.filter(function (v) {
        return v.messageType !== type || _this6.allowConfigData.get(parseInt(v.sendSettingId, 10)) && _this6.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type];
      });
    }

    /**
     * 根据type全否
     * @param type
     */

  }, {
    key: 'unCheckAll',
    value: function unCheckAll(type) {
      var _this7 = this;

      this.receiveTypeData.forEach(function (v) {
        return _this7.check(v.id, type);
      });
    }

    /**
     * 判断某个元素是否选中
     * @param id 元素的id
     * @param type type 有'pm'、'email'、'sms' 三种对应表中的站内信列、邮件列和短信列
     * @returns {boolean} 这个元素是否是选中的
     */

  }, {
    key: 'isChecked',
    value: function isChecked(id, type) {
      if (id.split('-').length === 2) {
        return this.isGroupAllSelected(id, type);
      }
      return !this.receiveSettingData.some(function (v) {
        return v.messageType === type && id === v.sourceType + '-' + v.sourceId + '-' + v.sendSettingId;
      });
    }

    /**
     * 判断是否某组全选
     * @param id type-sourceId
     * @param type 有'pm'、'email'、'sms' 三种对应表中的站内信列、邮件列和短信列
     * @returns {boolean} 这个组是否是全选中的
     */

  }, {
    key: 'isGroupAllSelected',
    value: function isGroupAllSelected(id, type) {
      var _this8 = this;

      return !this.receiveSettingData.filter(function (v) {
        return v.messageType === type && id === v.sourceType + '-' + v.sourceId && _this8.allowConfigData.get(parseInt(v.sendSettingId, 10)) && !_this8.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type];
      }).some(function (v) {
        return !_this8.isChecked(id + '-' + v.sendSettingId, type);
      });
    }

    /**
     * 根据type判断是否全选
     * @param type type有'pm'、'email'、'sms' 三种对应表中的站内信列、邮件列和短信列
     * @returns {boolean}
     */

  }, {
    key: 'isAllSelected',
    value: function isAllSelected(type) {
      var _this9 = this;

      return this.receiveSettingData.filter(function (v) {
        return v.messageType === type && _this9.allowConfigData.get(parseInt(v.sendSettingId, 10)) && !_this9.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type];
      }).length === 0;
    }

    /**
     * 根据type判断全选框是否为全不选
     * @param type
     * @returns {boolean}
     */

  }, {
    key: 'isAllUnSelected',
    value: function isAllUnSelected(type) {
      var maxLength = this.receiveTypeData.length;
      var unSelectedLength = void 0;
      switch (type) {
        case 'pm':
          unSelectedLength = this.getDataSource.reduce(function (previousValue, currentValue) {
            return previousValue + (currentValue.pmChecked || currentValue.pmIndeterminate ? 0 : 1);
          }, 0);
          break;
        case 'email':
          unSelectedLength = this.getDataSource.reduce(function (previousValue, currentValue) {
            return previousValue + (currentValue.mailChecked || currentValue.mailIndeterminate ? 0 : 1);
          }, 0);
          break;
        default:
          unSelectedLength = this.getDataSource.reduce(function (previousValue, currentValue) {
            return previousValue + (currentValue.pmChecked || currentValue.pmIndeterminate ? 0 : 1);
          }, 0);
      }
      return maxLength === unSelectedLength;
    }

    /**
     * 判断某组的indeterminate
     * @param id
     * @param type
     * @returns {boolean}
     */

  }, {
    key: 'isGroupIndeterminate',
    value: function isGroupIndeterminate(id, type) {
      var _this10 = this;

      // if (this.isGroupAllSelected(id, type)) return false;
      var selectLength = this.receiveSettingData.filter(function (v) {
        return v.messageType === type && id === v.sourceType + '-' + v.sourceId && _this10.allowConfigData.get(parseInt(v.sendSettingId, 10)) && !_this10.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type];
      }).length;
      var checkAbleLength = [].concat((0, _toConsumableArray3['default'])(this.allowConfigData.keys())).filter(function (value) {
        return _this10.allowConfigData.get(value).type === id.split('-')[0] && !_this10.allowConfigData.get(value).disabled[type];
      }).length;
      return selectLength > 0 && selectLength < checkAbleLength;
    }
  }, {
    key: 'getAllowConfigData',
    get: function get() {
      return this.allowConfigData;
    }
  }, {
    key: 'getDirty',
    get: function get() {
      return this.dirty;
    }
  }, {
    key: 'getReceiveTypeData',
    get: function get() {
      return this.receiveTypeData;
    }
  }, {
    key: 'getLoading',
    get: function get() {
      return this.loading;
    }
  }, {
    key: 'getDataSource',
    get: function get() {
      var _this11 = this;

      var ds = this.receiveTypeData;
      ds.forEach(function (v) {
        var allowConfig = new Map();
        [].concat((0, _toConsumableArray3['default'])(_this11.allowConfigData.keys())).forEach(function (value) {
          if (_this11.allowConfigData.get(value).type === v.type) {
            allowConfig.set(value, _this11.allowConfigData.get(value));
          }
        });
        v.pmChecked = _this11.isChecked('' + v.id, 'pm');
        v.pmIndeterminate = _this11.isGroupIndeterminate('' + v.id, 'pm');
        v.mailChecked = _this11.isChecked('' + v.id, 'email');
        v.mailIndeterminate = _this11.isGroupIndeterminate('' + v.id, 'email');
        v.settings = [].concat((0, _toConsumableArray3['default'])(allowConfig.keys())).map(function (k) {
          return {
            id: v.id + '-' + k,
            name: allowConfig.get(k).name,
            pmChecked: _this11.isChecked(v.id + '-' + k, 'pm'),
            mailChecked: _this11.isChecked(v.id + '-' + k, 'email')
          };
        });
      });
      return ds;
    }
  }]);
  return ReceiveSettingStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'receiveTypeData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'receiveSettingData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'allowConfigData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'dirty', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'getAllowConfigData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getAllowConfigData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getDirty', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getDirty'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getReceiveTypeData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getReceiveTypeData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getLoading', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getDataSource', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getDataSource'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setLoading'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setDirty', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setDirty'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadReceiveTypeData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadReceiveTypeData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadAllowConfigData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadAllowConfigData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadReceiveSettingData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadReceiveSettingData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'check', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'check'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'checkAll', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'checkAll'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'unCheckAll', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'unCheckAll'), _class2.prototype)), _class2)) || _class);
exports['default'] = new ReceiveSettingStore();
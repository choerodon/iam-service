'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _class, _temp, _dec, _class2, _desc, _value, _class3, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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

var MenuStore = _choerodonBootCombine.stores.MenuStore;
var DataSorter = (_temp = _class = function DataSorter() {
  (0, _classCallCheck3['default'])(this, DataSorter);
}, _class.GetNumSorter = function (orderBy, direction) {
  return function (item1, item2) {
    switch (direction) {
      case 'asc':
        return item1[orderBy] - item2[orderBy];
      case 'desc':
        return item2[orderBy] - item1[orderBy];
      default:
        return item1[orderBy] - item2[orderBy];
    }
  };
}, _temp);
var SiteStatisticsStore = (_dec = (0, _choerodonBootCombine.store)('SiteStatisticsStore'), _dec(_class2 = (_class3 = function () {
  function SiteStatisticsStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, SiteStatisticsStore);

    _initDefineProp(this, 'chartData', _descriptor, this);

    _initDefineProp(this, 'tableData', _descriptor2, this);

    _initDefineProp(this, 'startTime', _descriptor3, this);

    _initDefineProp(this, 'endTime', _descriptor4, this);

    _initDefineProp(this, 'currentLevel', _descriptor5, this);

    _initDefineProp(this, 'startDate', _descriptor6, this);

    _initDefineProp(this, 'endDate', _descriptor7, this);

    _initDefineProp(this, 'loading', _descriptor8, this);

    this.allTableDate = [];
    this.set = new Set();

    this.loadChart = function (beginDate, endDate, level) {
      var queryObj = {
        begin_date: beginDate,
        end_date: endDate,
        level: level
      };
      return _choerodonBootCombine.axios.get('/manager/v1/statistic/menu_click?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          if (data.menu.length) {
            var arr = data.menu.map(function (item) {
              return item.split(':')[1] + ': ' + item.split(':')[0];
            });
            data.menu = arr;
          }

          _this.setTableData(data);
          _this.setChartData(data);
        }
        _this.setLoading(false);
      })['catch'](function (error) {
        _this.setLoading(false);
        Choerodon.handleResponseError(error);
      });
    };

    this.tableDataFormatter = function (data) {
      var tableData = data.details ? data.details.map(function (v) {
        return {
          code: v.menu.split(':')[0],
          name: v.menu.split(':')[1],
          sum: v.data.reduce(function (prev, cur) {
            return prev + cur;
          }, 0)
        };
      }) : _this.tableData;
      return tableData.sort(DataSorter.GetNumSorter('sum', 'desc'));
    };

    this.getTableDate = function (level) {
      var queryObj = {
        begin_date: _this.startTime.format().split('T')[0],
        end_date: _this.endTime.format().split('T')[0],
        level: level
      };
      return _choerodonBootCombine.axios.get('/manager/v1/statistic/menu_click?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          data = _this.tableDataFormatter(data).map(function (values) {
            return (0, _extends3['default'])({}, values, { level: level });
          });
          _this.allTableDate = _this.allTableDate.concat(data);
        }
      });
    };

    this.getMenuData = function (level) {
      return _choerodonBootCombine.axios.get('/iam/v1/menus/menu_config?level=' + level).then(function (data) {
        _this.dfsAddAllMenu(data, level);
      });
    };
  }

  (0, _createClass3['default'])(SiteStatisticsStore, [{
    key: 'setStartDate',
    value: function setStartDate(data) {
      this.startDate = data;
    }
  }, {
    key: 'setTableData',
    value: function setTableData(data) {
      this.tableData = data.details ? data.details.map(function (v) {
        return {
          code: v.menu.split(':')[0],
          name: v.menu.split(':')[1],
          sum: v.data.reduce(function (prev, cur) {
            return prev + cur;
          }, 0)
        };
      }) : this.tableData;
      this.tableData = this.tableData.sort(DataSorter.GetNumSorter('sum', 'desc'));
    }
  }, {
    key: 'appendTableData',
    value: function appendTableData(data) {
      var _this2 = this;

      this.set.clear();
      this.tableData.forEach(function (v) {
        _this2.set.add(v.code);
      });
      this.dfsAddMenu(data);
      this.setTableData({ detail: [].concat((0, _toConsumableArray3['default'])(this.tableData.slice())) });
    }
  }, {
    key: 'dfsAddMenu',
    value: function dfsAddMenu(data) {
      var _this3 = this;

      data.forEach(function (v) {
        if (!_this3.set.has(v.code)) {
          _this3.tableData.push({ code: v.code, name: v.name, sum: 0 });
          _this3.set.add(v.code);
        }
        if (v.subMenus) {
          _this3.dfsAddMenu(v.subMenus);
        }
      });
    }
  }, {
    key: 'setEndDate',
    value: function setEndDate(data) {
      this.endDate = data;
    }
  }, {
    key: 'setStartTime',
    value: function setStartTime(data) {
      this.startTime = data;
    }
  }, {
    key: 'setEndTime',
    value: function setEndTime(data) {
      this.endTime = data;
    }
  }, {
    key: 'setChartData',
    value: function setChartData(data) {
      this.chartData = data;
    }
  }, {
    key: 'setLoading',
    value: function setLoading(flag) {
      this.loading = flag;
    }
  }, {
    key: 'setCurrentLevel',
    value: function setCurrentLevel(data) {
      this.currentLevel = data;
    }
  }, {
    key: 'dfsAddAllMenu',
    value: function dfsAddAllMenu(data, level) {
      var _this4 = this;

      data.forEach(function (v) {
        if (!_this4.set.has(v.code)) {
          _this4.allTableDate.push({ code: v.code, name: v.name, sum: 0, level: level });
          _this4.set.add(v.code);
        }
        if (v.subMenus) {
          _this4.dfsAddAllMenu(v.subMenus, level);
        }
      });
    }

    /**
     * 获取所有层级的表数据
     */

  }, {
    key: 'getAllTableDate',
    value: function () {
      var _ref = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee() {
        return _regenerator2['default'].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.allTableDate = [];
                this.set.clear();

                _context.next = 4;
                return this.getTableDate('site');

              case 4:
                _context.next = 6;
                return this.getMenuData('site');

              case 6:
                _context.next = 8;
                return this.getTableDate('organization');

              case 8:
                _context.next = 10;
                return this.getMenuData('organization');

              case 10:
                _context.next = 12;
                return this.getTableDate('project');

              case 12:
                _context.next = 14;
                return this.getMenuData('project');

              case 14:
                _context.next = 16;
                return this.getTableDate('user');

              case 16:
                _context.next = 18;
                return this.getMenuData('user');

              case 18:
                return _context.abrupt('return', this.allTableDate);

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAllTableDate() {
        return _ref.apply(this, arguments);
      }

      return getAllTableDate;
    }()
  }, {
    key: 'getStartDate',
    get: function get() {
      return this.startDate;
    }
  }, {
    key: 'getTableData',
    get: function get() {
      return this.tableData;
    }
  }, {
    key: 'getEndDate',
    get: function get() {
      return this.endDate;
    }
  }, {
    key: 'getStartTime',
    get: function get() {
      return this.startTime;
    }
  }, {
    key: 'getEndTime',
    get: function get() {
      return this.endTime;
    }
  }, {
    key: 'getChartData',
    get: function get() {
      return this.chartData;
    }
  }, {
    key: 'getCurrentLevel',
    get: function get() {
      return this.currentLevel;
    }
  }]);
  return SiteStatisticsStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class3.prototype, 'chartData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class3.prototype, 'tableData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, 'startTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])().subtract(6, 'days');
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class3.prototype, 'endTime', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return (0, _moment2['default'])();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class3.prototype, 'currentLevel', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return 'site';
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class3.prototype, 'startDate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class3.prototype, 'endDate', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class3.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class3.prototype, 'setStartDate', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setStartDate'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getStartDate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getStartDate'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getTableData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getTableData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setTableData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setTableData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'appendTableData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'appendTableData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'dfsAddMenu', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'dfsAddMenu'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setEndDate', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setEndDate'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getEndDate', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getEndDate'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setStartTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setStartTime'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getStartTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getStartTime'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setEndTime', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setEndTime'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getEndTime', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getEndTime'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setChartData', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setChartData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getChartData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getChartData'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setLoading', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setLoading'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'setCurrentLevel', [_mobx.action], Object.getOwnPropertyDescriptor(_class3.prototype, 'setCurrentLevel'), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, 'getCurrentLevel', [_mobx.computed], Object.getOwnPropertyDescriptor(_class3.prototype, 'getCurrentLevel'), _class3.prototype)), _class3)) || _class2);


var siteStatisticsStore = new SiteStatisticsStore();
exports['default'] = siteStatisticsStore;
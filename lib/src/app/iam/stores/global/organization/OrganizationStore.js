'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14; /**
                                                                                                                                                                                                                                                   * Created by jinqin.ma on 2017/6/27.
                                                                                                                                                                                                                                                   */


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

var OrganizationStore = (_dec = (0, _choerodonBootCombine.store)('OrganizationStore'), _dec(_class = (_class2 = function () {
  function OrganizationStore() {
    var _this = this;

    (0, _classCallCheck3['default'])(this, OrganizationStore);

    _initDefineProp(this, 'orgData', _descriptor, this);

    _initDefineProp(this, 'loading', _descriptor2, this);

    _initDefineProp(this, 'submitting', _descriptor3, this);

    _initDefineProp(this, 'show', _descriptor4, this);

    _initDefineProp(this, 'sidebarVisible', _descriptor5, this);

    _initDefineProp(this, 'pagination', _descriptor6, this);

    _initDefineProp(this, 'filters', _descriptor7, this);

    _initDefineProp(this, 'sort', _descriptor8, this);

    _initDefineProp(this, 'params', _descriptor9, this);

    _initDefineProp(this, 'editData', _descriptor10, this);

    _initDefineProp(this, 'myOrg', _descriptor11, this);

    _initDefineProp(this, 'myRoles', _descriptor12, this);

    _initDefineProp(this, 'partDetail', _descriptor13, this);

    _initDefineProp(this, 'usersData', _descriptor14, this);

    this.checkCode = function (value) {
      return _choerodonBootCombine.axios.post('/iam/v1/organizations/check', JSON.stringify({ code: value }));
    };

    this.getOrgById = function (organizationId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId);
    };

    this.getOrgByIdOrgLevel = function (organizationId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/org_level');
    };

    this.getRolesById = function (organizationId, userId) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + organizationId + '/role_members/users/' + userId);
    };

    this.loadOrgDetail = function (id) {
      return _choerodonBootCombine.axios.get('/iam/v1/organizations/' + id).then(function (data) {
        if (data.failed) {
          return data.message;
        } else {
          _this.setPartDetail(data);
          _this.showSideBar();
        }
      })['catch'](Choerodon.handleResponseError);
    };

    this.loadUsers = function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { sort: 'id' };
      return _choerodonBootCombine.axios.get('/iam/v1/all/users?' + _queryString2['default'].stringify(queryObj));
    };
  }

  (0, _createClass3['default'])(OrganizationStore, [{
    key: 'setFilters',
    value: function setFilters() {
      this.filters = {};
    }
  }, {
    key: 'setParams',
    value: function setParams() {
      this.params = [];
    }
  }, {
    key: 'setPartDetail',
    value: function setPartDetail(data) {
      this.partDetail = data;
    }
  }, {
    key: 'setEditData',
    value: function setEditData(data) {
      this.editData = data;
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
    key: 'setUsersData',
    value: function setUsersData(data) {
      this.usersData = data;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.loadData({ current: 1, pageSize: 10 }, {}, {}, []);
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
        this.orgData.length = 0;
        this.pagination = {
          current: 1,
          pageSize: 10,
          total: 0
        };
        this.loading = false;
        return;
      }

      return _choerodonBootCombine.axios.get('/iam/v1/organizations?' + _queryString2['default'].stringify({
        page: pagination.current - 1,
        size: pagination.pageSize,
        name: filters.name,
        code: filters.code,
        enabled: filters.enabled,
        params: params.join(','),
        sort: sorter.join(',')
      })).then((0, _mobx.action)(function (_ref) {
        var failed = _ref.failed,
            content = _ref.content,
            totalElements = _ref.totalElements;

        if (!failed) {
          _this2.orgData = content;
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
  }, {
    key: 'toggleDisable',
    value: function toggleDisable(id, enabled) {
      var _this3 = this;

      return _choerodonBootCombine.axios.put('/iam/v1/organizations/' + id + '/' + (enabled ? 'disable' : 'enable')).then(function () {
        return _this3.loadData();
      });
    }
  }, {
    key: 'createOrUpdateOrg',
    value: function createOrUpdateOrg(_ref2, modify) {
      var code = _ref2.code,
          name = _ref2.name,
          address = _ref2.address,
          userId = _ref2.userId;

      var _this4 = this;

      var imgUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var HeaderStore = arguments[3];
      var show = this.show,
          _editData = this.editData,
          id = _editData.id,
          originCode = _editData.code,
          objectVersionNumber = _editData.objectVersionNumber;

      var isCreate = show === 'create';
      if (!modify && !isCreate) {
        return Promise.resolve('modify.success');
      } else {
        var url = void 0;
        var body = void 0;
        var message = void 0;
        var method = void 0;
        if (isCreate) {
          url = '/org/v1/organizations';
          body = {
            name: name,
            code: code
          };

          if (address) {
            body.address = address;
          }

          if (userId) {
            body.userId = userId;
          }

          message = 'create.success';
          method = 'post';
        } else {
          url = '/iam/v1/organizations/' + id;
          body = {
            name: name,
            objectVersionNumber: objectVersionNumber,
            code: originCode,
            address: address || null
          };
          message = 'modify.success';
          method = 'put';
        }

        if (imgUrl) {
          body.imageUrl = imgUrl;
        }
        this.submitting = true;
        return _choerodonBootCombine.axios[method](url, JSON.stringify(body)).then((0, _mobx.action)(function (data) {
          _this4.submitting = false;
          if (data.failed) {
            return data.message;
          } else {
            _this4.sidebarVisible = false;
            if (isCreate) {
              _this4.refresh();
              HeaderStore.addOrg(data);
            } else {
              _this4.loadData();
              HeaderStore.updateOrg(data);
            }
            return message;
          }
        }))['catch']((0, _mobx.action)(function (error) {
          _this4.submitting = false;
          Choerodon.handleResponseError(error);
        }));
      }
    }
  }, {
    key: 'loadMyData',
    value: function loadMyData(organizationId, userId) {
      var _this5 = this;

      _choerodonBootCombine.axios.all([this.getOrgByIdOrgLevel(organizationId), this.getRolesById(organizationId, userId)]).then((0, _mobx.action)(function (_ref3) {
        var _ref4 = (0, _slicedToArray3['default'])(_ref3, 2),
            org = _ref4[0],
            roles = _ref4[1];

        _this5.myOrg = org;
        _this5.myRoles = roles;
      }))['catch'](Choerodon.handleResponseError);
    }
  }, {
    key: 'getUsersData',
    get: function get() {
      return this.usersData;
    }
  }]);
  return OrganizationStore;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'orgData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'submitting', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'show', [_mobx.observable], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sidebarVisible', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'pagination', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {
      current: 1,
      pageSize: 10,
      total: 0
    };
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'sort', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'params', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'editData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'myOrg', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, 'myRoles', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, 'partDetail', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, 'usersData', [_mobx.observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, 'setFilters', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setFilters'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setParams', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setParams'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setPartDetail', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setPartDetail'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setEditData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setEditData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'showSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'showSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'hideSideBar', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'hideSideBar'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'setUsersData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'setUsersData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getUsersData', [_mobx.computed], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUsersData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'loadData', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'loadData'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'createOrUpdateOrg', [_mobx.action], Object.getOwnPropertyDescriptor(_class2.prototype, 'createOrUpdateOrg'), _class2.prototype)), _class2)) || _class);
exports['default'] = new OrganizationStore();
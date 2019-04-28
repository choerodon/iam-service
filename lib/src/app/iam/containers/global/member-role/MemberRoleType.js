'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = exports.pageSize = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var pageSize = exports.pageSize = 10;

/**
 * 公用方法类
 * 当要改写 src/app/iam/containers/global/member-role/MemberRoleType.js中的内容时可以逐步把用到的东西移到store里
 */

var MemberRoleType = function () {
  function MemberRoleType(context) {
    (0, _classCallCheck3['default'])(this, MemberRoleType);

    this.context = context;
    var AppState = this.context.props.AppState;

    this.data = AppState.currentMenuType;
    var _data = this.data,
        type = _data.type,
        id = _data.id,
        name = _data.name;

    var apiGetway = '/iam/v1/' + type + 's/' + id;
    var codePrefix = void 0;
    switch (type) {
      case 'organization':
        codePrefix = 'organization';
        break;
      case 'project':
        codePrefix = 'project';
        break;
      case 'site':
        codePrefix = 'global';
        apiGetway = '/iam/v1/' + type;
        break;
      default:
        break;
    }
    this.code = codePrefix + '.memberrole';
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.urlRoles = apiGetway + '/role_members/users/roles'; // 查询用户列表以及该用户拥有的角色
    this.urlUserCount = apiGetway + '/role_members/users/count'; // 查询角色列表以及该角色下的用户数量
    this.urlUsers = apiGetway + '/role_members/users'; // 查询角色下的用户
    this.urlClientRoles = apiGetway + '/role_members/clients/roles'; // 查询客户端列表以及该客户端拥有的角色
    this.urlClientCount = apiGetway + '/role_members/clients/count'; // 查询角色列表以及该角色下的客户端数量
    this.urlClients = apiGetway + '/role_members/clients'; // 查询角色下的客户端
    this.urlDeleteMember = apiGetway + '/role_members/delete'; // 批量移除用户角色
    this.urlRoleMember = apiGetway + '/role_members'; // 批量分配给用户/客户端角色
    this.roleId = id || 0;
  }

  // fetch分配角色（post）


  (0, _createClass3['default'])(MemberRoleType, [{
    key: 'fetchRoleMember',
    value: function fetchRoleMember(memberIds, body, memberType, isEdit) {
      var str = 'member_ids=' + memberIds.join(',');
      if (isEdit === true) {
        str += '&is_edit=true';
        if (memberType === 'client') {
          str += '&member_type=client';
        }
      }
      return _choerodonBootCombine.axios.post(this.urlRoleMember + '?' + str, JSON.stringify(body));
    }

    // delete分配角色（delete)

  }, {
    key: 'deleteRoleMember',
    value: function deleteRoleMember(body) {
      var id = this.data.id;

      body.sourceId = id || 0;
      return _choerodonBootCombine.axios.post(this.urlDeleteMember, JSON.stringify(body));
    }

    // 根据用户名查询memberId

  }, {
    key: 'searchMemberId',
    value: function searchMemberId(loginName) {
      if (loginName) {
        return _choerodonBootCombine.axios.get('/iam/v1/users?login_name=' + loginName);
      }
    }
  }, {
    key: 'searchMemberIds',
    value: function searchMemberIds(loginNames) {
      var _this = this;

      var promises = loginNames.map(function (index, value) {
        return _this.searchMemberId(index);
      });
      return _choerodonBootCombine.axios.all(promises);
    }

    /**
     * 加载单个角色下的成员
     * @param roleData
     * @param current
     * @param loginName
     * @param realName
     * @param params
     * @returns {PromiseLike<T | never> | Promise<T | never>}
     */

  }, {
    key: 'loadRoleMemberData',
    value: function loadRoleMemberData(roleData, _ref, _ref2, params) {
      var current = _ref.current;

      var _this2 = this;

      var loginName = _ref2.loginName,
          realName = _ref2.realName;
      var roleId = roleData.id,
          users = roleData.users,
          name = roleData.name;

      var body = {
        loginName: loginName && loginName[0],
        realName: realName && realName[0]
      };
      var queryObj = { role_id: roleId, size: pageSize, page: current - 1 };
      roleData.loading = true;
      return _choerodonBootCombine.axios.post(this.urlUsers + '?' + _queryString2['default'].stringify(queryObj), JSON.stringify(body)).then(function (_ref3) {
        var content = _ref3.content;

        roleData.users = users.concat(content.map(function (member) {
          member.roleId = roleId;
          member.roleName = name;
          return member;
        }));
        delete roleData.loading;
        _this2.context.forceUpdate();
      });
    }

    /**
     * 加载单个客户端下的成员
     * @param roleData 单个角色数据
     * @param current
     * @param clientName
     * @param realName
     * @param params
     * @returns {PromiseLike<T | never> | Promise<T | never>}
     */

  }, {
    key: 'loadClientRoleMemberData',
    value: function loadClientRoleMemberData(roleData, _ref4, _ref5, params) {
      var current = _ref4.current;

      var _this3 = this;

      var clientName = _ref5.clientName;
      var roleId = roleData.id,
          users = roleData.users,
          name = roleData.name;

      var body = {
        clientName: clientName && clientName[0]
      };
      var queryObj = { role_id: roleId, size: pageSize, page: current - 1 };
      roleData.loading = true;
      return _choerodonBootCombine.axios.post(this.urlClients + '?' + _queryString2['default'].stringify(queryObj), JSON.stringify(body)).then(function (_ref6) {
        var content = _ref6.content;

        roleData.users = users.concat(content.map(function (member) {
          member.roleId = roleId;
          member.roleName = name;
          member.clientName = member.name;
          delete member.name;
          return member;
        }));
        delete roleData.loading;
        _this3.context.forceUpdate();
      });
    }

    // 用户模式下的成员数据

  }, {
    key: 'loadMemberDatas',
    value: function loadMemberDatas(_ref7, _ref8, params) {
      var size = _ref7.pageSize,
          current = _ref7.current;
      var loginName = _ref8.loginName,
          realName = _ref8.realName,
          roles = _ref8.roles;

      var body = {
        loginName: loginName && loginName[0],
        roleName: roles && roles[0],
        realName: realName && realName[0],
        param: params
      };
      var queryObj = { size: size, page: current - 1, sort: 'id' };
      return _choerodonBootCombine.axios.post(this.urlRoles + '?' + _queryString2['default'].stringify(queryObj), JSON.stringify(body));
    }

    // 用户模式下的角色数据

  }, {
    key: 'loadRoleMemberDatas',
    value: function loadRoleMemberDatas(_ref9) {
      var loginName = _ref9.loginName,
          realName = _ref9.realName,
          name = _ref9.name;

      var body = {
        roleName: name && name[0],
        loginName: loginName && loginName[0],
        realName: realName && realName[0]
      };
      return _choerodonBootCombine.axios.post(this.urlUserCount, JSON.stringify(body));
    }

    // 客户端模式下的成员数据

  }, {
    key: 'loadClientMemberDatas',
    value: function loadClientMemberDatas(_ref10, _ref11, params) {
      var size = _ref10.pageSize,
          current = _ref10.current;
      var name = _ref11.name,
          roles = _ref11.roles;

      var body = {
        clientName: name && name[0],
        roleName: roles && roles[0],
        param: params
      };
      var queryObj = { size: size, page: current - 1, sort: 'id' };
      return _choerodonBootCombine.axios.post(this.urlClientRoles + '?' + _queryString2['default'].stringify(queryObj), JSON.stringify(body));
    }

    // 客户端模式下的角色数据

  }, {
    key: 'loadClientRoleMemberDatas',
    value: function loadClientRoleMemberDatas(_ref12) {
      var clientName = _ref12.clientName,
          name = _ref12.name;

      var body = {
        clientName: clientName && clientName[0],
        roleName: name && name[0]
      };
      return _choerodonBootCombine.axios.post(this.urlClientCount, JSON.stringify(body));
    }

    // 多路请求

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this4 = this;

      var _context$state = this.context.state,
          memberRolePageInfo = _context$state.memberRolePageInfo,
          memberRoleFilters = _context$state.memberRoleFilters,
          roleMemberFilters = _context$state.roleMemberFilters,
          expandedKeys = _context$state.expandedKeys,
          params = _context$state.params,
          roleMemberParams = _context$state.roleMemberParams;

      this.context.setState({
        loading: true
      });
      return _choerodonBootCombine.axios.all([this.loadMemberDatas(memberRolePageInfo, memberRoleFilters, params), this.loadRoleMemberDatas((0, _extends3['default'])({ name: roleMemberParams }, roleMemberFilters))]).then(function (_ref13) {
        var _ref14 = (0, _slicedToArray3['default'])(_ref13, 2),
            _ref14$ = _ref14[0],
            content = _ref14$.content,
            totalElements = _ref14$.totalElements,
            number = _ref14$.number,
            roleData = _ref14[1];

        _this4.context.setState({
          memberDatas: content, // 用户-成员列表数据源
          expandedKeys: expandedKeys,
          // 用户-角色表数据源
          roleMemberDatas: roleData.filter(function (role) {
            role.users = role.users || [];
            if (role.userCount > 0) {
              if (expandedKeys.find(function (expandedKey) {
                return expandedKey.split('-')[1] === String(role.id);
              })) {
                _this4.loadRoleMemberData(role, {
                  current: 1,
                  pageSize: pageSize
                }, roleMemberFilters);
              }
              return true;
            }
            return false;
          }),
          roleData: roleData,
          loading: false,
          memberRolePageInfo: {
            total: totalElements,
            current: number + 1,
            pageSize: pageSize
          }
        });
      });
    }

    // 客户端 多路请求

  }, {
    key: 'fetchClient',
    value: function fetchClient() {
      var _this5 = this;

      var _context$state2 = this.context.state,
          clientMemberRolePageInfo = _context$state2.clientMemberRolePageInfo,
          clientMemberRoleFilters = _context$state2.clientMemberRoleFilters,
          clientRoleMemberFilters = _context$state2.clientRoleMemberFilters,
          expandedKeys = _context$state2.expandedKeys,
          clientParams = _context$state2.clientParams,
          clientRoleMemberParams = _context$state2.clientRoleMemberParams;

      this.context.setState({
        loading: true
      });
      return _choerodonBootCombine.axios.all([this.loadClientMemberDatas(clientMemberRolePageInfo, clientMemberRoleFilters, clientParams), this.loadClientRoleMemberDatas((0, _extends3['default'])({ name: clientRoleMemberParams }, clientRoleMemberFilters))]).then(function (_ref15) {
        var _ref16 = (0, _slicedToArray3['default'])(_ref15, 2),
            _ref16$ = _ref16[0],
            content = _ref16$.content,
            totalElements = _ref16$.totalElements,
            number = _ref16$.number,
            roleData = _ref16[1];

        _this5.context.setState({
          clientMemberDatas: content,
          expandedKeys: expandedKeys,
          cilentRoleMemberDatas: roleData.filter(function (role) {
            role.users = role.users || [];
            if (role.userCount > 0) {
              if (expandedKeys.find(function (expandedKey) {
                return expandedKey.split('-')[1] === String(role.id);
              })) {
                _this5.loadClientRoleMemberData(role, {
                  current: 1,
                  pageSize: pageSize
                }, clientRoleMemberFilters);
              }
              return true;
            }
            return false;
          }),
          roleData: roleData,
          loading: false,
          clientMemberRolePageInfo: {
            total: totalElements,
            current: number + 1,
            pageSize: pageSize
          }
        });
      });
    }
  }]);
  return MemberRoleType;
}();

exports['default'] = MemberRoleType;
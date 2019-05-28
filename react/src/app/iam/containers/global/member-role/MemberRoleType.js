import { axios } from '@choerodon/boot';
import querystring from 'query-string';

export const pageSize = 10;

/**
 * 公用方法类
 * 当要改写 src/app/iam/containers/global/member-role/MemberRoleType.js中的内容时可以逐步把用到的东西移到store里
 */
export default class MemberRoleType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    let apiGetway = `/iam/v1/${type}s/${id}`;
    let codePrefix;
    switch (type) {
      case 'organization':
        codePrefix = 'organization';
        break;
      case 'project':
        codePrefix = 'project';
        break;
      case 'site':
        codePrefix = 'global';
        apiGetway = `/iam/v1/${type}`;
        break;
      default:
        break;
    }
    this.code = `${codePrefix}.memberrole`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.urlRoles = `${apiGetway}/role_members/users/roles`; // 查询用户列表以及该用户拥有的角色
    this.urlUserCount = `${apiGetway}/role_members/users/count`; // 查询角色列表以及该角色下的用户数量
    this.urlUsers = `${apiGetway}/role_members/users`; // 查询角色下的用户
    this.urlClientRoles = `${apiGetway}/role_members/clients/roles`; // 查询客户端列表以及该客户端拥有的角色
    this.urlClientCount = `${apiGetway}/role_members/clients/count`; // 查询角色列表以及该角色下的客户端数量
    this.urlClients = `${apiGetway}/role_members/clients`; // 查询角色下的客户端
    this.urlDeleteMember = `${apiGetway}/role_members/delete`; // 批量移除用户角色
    this.urlRoleMember = `${apiGetway}/role_members`; // 批量分配给用户/客户端角色
    this.roleId = id || 0;
  }

  // fetch分配角色（post）
  fetchRoleMember(memberIds, body, memberType, isEdit) {
    let str = `member_ids=${memberIds.join(',')}`;
    if (isEdit === true) {
      str += '&is_edit=true';
      if (memberType === 'client') {
        str += '&member_type=client';
      }
    }
    return axios.post(`${this.urlRoleMember}?${str}`, JSON.stringify(body));
  }

  // delete分配角色（delete)
  deleteRoleMember(body) {
    const { id } = this.data;
    body.sourceId = id || 0;
    return axios.post(this.urlDeleteMember, JSON.stringify(body));
  }

  // 根据用户名查询memberId
  searchMemberId(loginName) {
    if (loginName) {
      return axios.get(`/iam/v1/users?login_name=${loginName}`);
    }
  }

  searchMemberIds(loginNames) {
    const promises = loginNames.map((index, value) => this.searchMemberId(index));
    return axios.all(promises);
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
  loadRoleMemberData(roleData, { current }, { loginName, realName }, params) {
    const { id: roleId, users, name } = roleData;
    const body = {
      loginName: loginName && loginName[0],
      realName: realName && realName[0],
      param: params && params.length ? params : undefined,
    };
    const queryObj = { role_id: roleId, size: pageSize, page: current };
    roleData.loading = true;
    return axios.post(`${this.urlUsers}?${querystring.stringify(queryObj)}`,
      JSON.stringify(body))
      .then(({ list }) => {
        roleData.users = users.concat((list || []).map((member) => {
          member.roleId = roleId;
          member.roleName = name;
          return member;
        }));
        delete roleData.loading;
        this.context.forceUpdate();
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
  loadClientRoleMemberData(roleData, { current }, { clientName }, params) {
    const { id: roleId, users, name } = roleData;
    const body = {
      clientName: clientName && clientName[0],
    };
    const queryObj = { role_id: roleId, size: pageSize, page: current };
    roleData.loading = true;
    return axios.post(`${this.urlClients}?${querystring.stringify(queryObj)}`,
      JSON.stringify(body))
      .then(({ list }) => {
        roleData.users = users.concat((list || []).map((member) => {
          member.roleId = roleId;
          member.roleName = name;
          member.clientName = member.name;
          delete member.name;
          return member;
        }));
        delete roleData.loading;
        this.context.forceUpdate();
      });
  }

  // 用户模式下的成员数据
  loadMemberDatas({ pageSize: size, current }, { loginName, realName, roles }, params) {
    const body = {
      loginName: loginName && loginName[0],
      roleName: roles && roles[0],
      realName: realName && realName[0],
      param: params,
    };
    const queryObj = { size, page: current, sort: 'id' };
    return axios.post(`${this.urlRoles}?${querystring.stringify(queryObj)}`, JSON.stringify(body));
  }

  // 用户模式下的角色数据
  loadRoleMemberDatas({ loginName, realName, roleName }, params) {
    const body = {
      roleName: roleName && roleName[0],
      loginName: loginName && loginName[0],
      realName: realName && realName[0],
      param: params && params.length ? params : undefined,
    };
    return axios.post(this.urlUserCount, JSON.stringify(body));
  }

  // 客户端模式下的成员数据
  loadClientMemberDatas({ pageSize: size, current }, { name, roles }, params) {
    const body = {
      clientName: name && name[0],
      roleName: roles && roles[0],
      param: params,
    };
    const queryObj = { size, page: current, sort: 'id' };
    return axios.post(`${this.urlClientRoles}?${querystring.stringify(queryObj)}`, JSON.stringify(body));
  }

  // 客户端模式下的角色数据
  loadClientRoleMemberDatas({ clientName, name }) {
    const body = {
      clientName: clientName && clientName[0],
      roleName: name && name[0],
    };
    return axios.post(this.urlClientCount, JSON.stringify(body));
  }

  // 多路请求
  fetch() {
    const { memberRolePageInfo, memberRoleFilters, roleMemberFilters, expandedKeys, params, roleMemberParams } = this.context.state;
    this.context.setState({
      loading: true,
    });
    return axios.all([
      this.loadMemberDatas(memberRolePageInfo, memberRoleFilters, params),
      this.loadRoleMemberDatas({ name: roleMemberParams, ...roleMemberFilters }),
    ]).then(([{ list, total, pageNum }, roleData]) => {
      this.context.setState({
        memberDatas: list, // 用户-成员列表数据源
        expandedKeys,
        // 用户-角色表数据源
        roleMemberDatas: roleData.filter((role) => {
          role.users = role.users || [];
          if (role.userCount > 0) {
            if (expandedKeys.find(expandedKey => expandedKey.split('-')[1] === String(role.id))) {
              this.loadRoleMemberData(role, {
                current: 1,
                pageSize,
              }, roleMemberFilters);
            }
            return true;
          }
          return false;
        }),
        roleData,
        loading: false,
        memberRolePageInfo: {
          total,
          current: pageNum,
          pageSize,
        },
      });
    });
  }

  // 客户端 多路请求
  fetchClient() {
    const { clientMemberRolePageInfo, clientMemberRoleFilters, clientRoleMemberFilters, expandedKeys, clientParams, clientRoleMemberParams } = this.context.state;
    this.context.setState({
      loading: true,
    });
    return axios.all([
      this.loadClientMemberDatas(clientMemberRolePageInfo, clientMemberRoleFilters, clientParams),
      this.loadClientRoleMemberDatas({ name: clientRoleMemberParams, ...clientRoleMemberFilters }),
    ]).then(([{ list, total, pageNum }, roleData]) => {
      this.context.setState({
        clientMemberDatas: list,
        expandedKeys,
        cilentRoleMemberDatas: roleData.filter((role) => {
          role.users = role.users || [];
          if (role.userCount > 0) {
            if (expandedKeys.find(expandedKey => expandedKey.split('-')[1] === String(role.id))) {
              this.loadClientRoleMemberData(role, {
                current: 1,
                pageSize,
              }, clientRoleMemberFilters);
            }
            return true;
          }
          return false;
        }),
        roleData,
        loading: false,
        clientMemberRolePageInfo: {
          total,
          current: pageNum,
          pageSize,
        },
      });
    });
  }
}

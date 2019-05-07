import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

/**
 * 当要改写 src/app/iam/containers/global/member-role/MemberRoleType.js中的内容时可以逐步把用到的东西移到store里
 */
@store('MemberRoleStore')
class MemberRoleStore {
  /**
   * 上传状态
   */
  @observable uploading = false;

  @observable currentMode = 'user'; // 所选模式 默认为用户

  // @observable isShowMember = true; // tab 默认为成员

  @observable uploadInfo = {
    noData: true,
  };

  @observable roleData = []; // 用户模式下的所有角色

  @observable roleMemberDatas = []; // 用户-角色表格数据

  @observable clientRoleMemberDatas = []; // 客户端-角色表格数据

  @observable usersData = [];

  @observable clientsData = [];

  @action setUsersData(data) {
    this.usersData = data;
  }

  @computed get getUsersData() {
    return this.usersData;
  }

  @action setClientsData(data) {
    this.clientsData = data;
  }

  @computed get getClientsData() {
    return this.clientsData;
  }

  @action setCurrentMode(data) {
    this.currentMode = data;
  }

  @computed
  get getRoleData() {
    return this.roleData;
  }

  @action
  setRoleData(data) {
    this.roleData = data;
  }

  @computed
  get getRoleMemberDatas() {
    return this.roleMemberDatas;
  }

  @action
  setRoleMemberDatas(data) {
    this.roleMemberDatas = data;
  }

  @computed
  get getClientRoleMemberDatas() {
    return this.clientRoleMemberDatas;
  }

  @action
  setClientRoleMemberDatas(data) {
    this.clientRoleMemberDatas = data;
  }

  @computed
  get getUploading() {
    return this.uploading;
  }

  @action
  setUploading(flag) {
    this.uploading = flag;
  }


  @computed
  get getUploadInfo() {
    return this.uploadInfo;
  }

  @action
  setUploadInfo(info) {
    this.uploadInfo = info;
  }

  /**
   *
   * @param data  通过AppState.currentMenuType获取的层级、id和name
   */
  @action
  loadCurrentMenuType(data, userId) {
    this.data = data;
    this.userId = userId;
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
    this.values = { name: name || 'Choerodon' };
    this.urlUsers = `${apiGetway}/role_members/users`;
    this.urlRoles = `${apiGetway}/role_members/users/roles`;
    this.urlRoleMember = `${apiGetway}/role_members`;
    this.urlMemberRole = `${apiGetway}/member_role`;
    this.urlDeleteMember = `${apiGetway}/role_members/delete`;
    this.urlUserCount = `${apiGetway}/role_members/users/count`;
    this.roleId = id || 0;
  }

  /**
   * 下载文件
   */
  downloadTemplate() {
    return axios.get(`${this.urlRoleMember}/download_templates`, {
      responseType: 'arraybuffer',
    });
  }

  @action
  handleUploadInfo = () => {
    const { type, id, name } = this.data;
    const timestamp = new Date().getTime();
    axios.get(`${this.urlMemberRole}/users/${this.userId}/upload/history?t=${timestamp}`).then((data) => {
      if (!data) {
        this.setUploadInfo({ noData: true });
        this.setUploading(false);
        return;
      }
      this.setUploadInfo(data);
      this.setUploading(!data.endTime);
    });
  }

  loadUsers = (queryObj = { sort: 'id' }) => axios.get(`/iam/v1/all/users?${querystring.stringify(queryObj)}`);

  loadClients = (queryObj = { sort: 'id' }) => axios.get(`/iam/v1/all/clients?${querystring.stringify(queryObj)}`);
}
const memberRoleStore = new MemberRoleStore();
export default memberRoleStore;

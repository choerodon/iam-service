import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('UserStore')
class UserStore {
  @observable isLoading = true;

  /* 密码策略用于修改密码时校验 */
  @observable passwordPolicy;

  @observable userInfo;

  @observable language;

  @observable organization;

  @observable timeZone = [];

  @observable checkEmail;

  @observable users = [];

  /* 用户列表 */
  @observable totalSize;

  @observable totalPage;

  /**
   * 上传状态
   */
  @observable uploading = false;

  @observable uploadInfo = {
    noData: true,
  };

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action
  setIsLoading(flag) {
    this.isLoading = flag;
  }

  @computed
  get getIsLoading() {
    return this.isLoading;
  }

  @action
  setPasswordPolicy(data) {
    this.passwordPolicy = data;
  }

  @action
  setUserInfo(data) {
    this.userInfo = data;
  }

  @computed
  get getUserInfo() {
    return this.userInfo;
  }

  @action
  setLanguage(data) {
    this.language = data;
  }

  @action
  setOrganization(data) {
    this.organization = data;
  }

  @computed
  get getTimeZone() {
    return this.timeZone;
  }

  @action
  setTimeZone(data) {
    this.timeZone = data;
  }

  @action
  setCheckEmail(data) {
    this.checkEmail = data;
  }

  @action
  setUsers(data) {
    this.users = data;
  }

  @computed
  get getUsers() {
    return this.users;
  }

  @action
  setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @computed
  get getTotalSize() {
    return this.totalSize;
  }

  @action
  setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  @computed
  get getTotalPage() {
    return this.totalPage;
  }

  // upload

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
   * 下载文件
   */
  downloadTemplate(organizationId) {
    return axios.get(`/iam/v1/organizations/${organizationId}/users/download_templates`, {
      responseType: 'arraybuffer',
    });
  }

  handleUploadInfo = (organizationId, userId) => {
    const timestamp = new Date().getTime();
    axios.get(`/iam/v1/organizations/${organizationId}/users/${userId}/upload/history?t=${timestamp}`).then((data) => {
      if (!data) {
        this.setUploadInfo({ noData: true });
        this.setUploading(false);
        return;
      }
      this.setUploadInfo(data);
      this.setUploading(!data.endTime);
    });
  }

  unLockUser(orgId, UserId) {
    return axios.get(`/iam/v1/organizations/${orgId}/users/${UserId}/unlock`);
  }

  loadPasswordPolicy = () => axios.get('/iam/v1/passwordPolicies/querySelf').then((data) => {
    if (data) {
      this.setPasswordPolicy(data);
    }
  });

  updatePassword = (originPassword, hashedPassword) => axios.put(`/iam/v1/password/updateSelf?originPassword=${originPassword}&password=${hashedPassword}`);

  // 用户信息维护
  loadUserInfo = () => {
    this.setIsLoading(true);
    return axios.get('/iam/v1/users/self').then((data) => {
      if (data) {
        this.setUserInfo(data);
      }
      this.setIsLoading(false);
    });
  };

  checkEmails = (id, email) => axios.get(`/iam/v1/organization/${id}/users/checkEmail?email=${email}`);

  updateUserInfo = user => axios.put(`/iam/v1/users/${this.userInfo.id}/updateSelf`, JSON.stringify(user));

  EnableUser = (orgId, userId, data) => axios.put(`/iam/v1/organizations/${orgId}/users/${userId}/enable`);

  UnenableUser = (orgId, userId, data) => axios.put(`/iam/v1/organizations/${orgId}/users/${userId}/disable`);

  resetUserPwd = (orgId, userId) => axios.put(`/iam/v1/organizations/${orgId}/users/${userId}/reset`);


  // 加载用户列表
  loadUsers = (organizationId, page, sortParam, {
    loginName, realName, ldap, language, enabled, locked,
  }, param) => {
    this.setIsLoading(true);
    return axios.post(
      `/iam/v1/organizations/${organizationId}/users/search?page=${page.current}&size=${page.pageSize}&sort=${sortParam}`,
      JSON.stringify({
        loginName: loginName && loginName[0],
        realName: realName && realName[0],
        ldap: ldap && ldap[0],
        language: language && language[0],
        enabled: enabled && enabled[0],
        locked: locked && locked[0],
        param,
      }),
    ).then((data) => {
      this.setIsLoading(false);
      return data;
    });
  };

  deleteUserById = (organizationId, id) => (
    axios.delete(`/iam/v1/organizations/${organizationId}/users/${id}`)
  );
}


const userStore = new UserStore();

export default userStore;

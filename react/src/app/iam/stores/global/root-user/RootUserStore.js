import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('RootUserStore')
class RootUserStore {
  @observable loading = true;
  @observable rootUserData = [];
  @observable usersData = []; // 全平台启用用户数据

  @action
  setRootUserData(data) {
    this.rootUserData = data;
  }

  @computed
  get getRootUserData() {
    return this.rootUserData;
  }

  @action
  setLoading(loading) {
    this.loading = loading;
  }

  @computed
  get getLoading() {
    return this.loading;
  }

  @action setUsersData(data) {
    this.usersData = data;
  }

  @computed get getUsersData() {
    return this.usersData;
  }


  loadRootUserData(
    { current, pageSize },
    { loginName, realName, enabled, locked },
    { columnKey = 'id', order = 'descend' },
    params) {
    const queryObj = {
      page: current,
      size: pageSize,
      loginName,
      realName,
      enabled,
      locked,
      params,
    };
    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
      queryObj.sort = sorter.join(',');
    }
    return axios.get(`/iam/v1/users/admin?${querystring.stringify(queryObj)}`);
  }

  searchMemberIds(loginNames) {
    const promises = loginNames.map(index => axios.get(`/iam/v1/users?login_name=${index}`));
    return axios.all(promises);
  }

  addRootUser(ids) {
    const id = ids.join(',');
    return axios.post(`/iam/v1/users/admin?id=${id}`);
  }

  deleteRootUser(id) {
    return axios.delete(`/iam/v1/users/admin/${id}`);
  }

  loadUsers = (queryObj = { sort: 'id' }) => axios.get(`/iam/v1/all/users?${querystring.stringify(queryObj)}`);
}

const rootUserStore = new RootUserStore();

export default rootUserStore;

import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';

@store('PermissionInfoStore')
class PermissionInfoStore {
  @observable permissionData = [];
  @observable loading = false;
  @observable pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  @observable sort = {};
  @observable params = [];
  @observable role = {};

  @computed
  get getLoading() {
    return this.loading;
  }

  @computed
  get getDataSource() {
    return this.permissionData;
  }

  @action
  setRole(role) {
    this.role = role;
  }

  @action
  loadData(pagination = this.pagination, params = this.params) {
    const { id } = this.role;
    this.loading = true;
    this.params = params;
    return axios.get(`/iam/v1/users/${id}/roles?${queryString.stringify({
      page: pagination.current,
      size: pagination.pageSize,
      params: params.join(','),
    })}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          this.permissionData = list;
          this.pagination = {
            ...pagination,
            total,
          };
        }
        this.loading = false;
      }))
      .catch(action((error) => {
        Choerodon.handleResponseError(error);
        this.loading = false;
      }));
  }

  clear() {
    this.permissionData = [];
    this.pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
    };
    this.filters = {};
    this.sort = {};
    this.params = [];
  }
}

export default new PermissionInfoStore();

import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';
import { handleFiltersParams } from '../../../common/util';

@store('DashboardSettingStore')
class DashboardSettingStore {
  @observable dashboardData = [];
  @observable loading = false;
  @observable sidebarVisible = false;
  @observable pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  @observable filters = {};
  @observable sort = {};
  @observable params = [];
  @observable editData = {};
  @observable needRoles = false;
  @observable currentRoles = [];
  @observable roleMap = new Map();
  @observable needUpdateRoles = false;

  refresh() {
    this.loadData({ current: 1, pageSize: 10 }, {}, {}, []);
  }

  @action
  setNeedUpdateRoles(flag) {
    this.needUpdateRoles = flag;
  }

  @action
  setNeedRoles(flag) {
    this.needRoles = flag;
  }

  @action
  setEditData(data) {
    this.editData = data;
  }

  @action
  showSideBar() {
    this.sidebarVisible = true;
  }

  @action
  hideSideBar() {
    this.sidebarVisible = false;
  }

  @action
  updateData(values) {
    this.loading = true;
    const rolesQuery = values.roleIds || this.needUpdateRoles === this.editData.roleIds ? '' : '?update_role=true';
    this.editData.needRoles = this.needRoles;
    return axios.post(`/iam/v1/dashboards/${this.editData.id}${rolesQuery}`, JSON.stringify(Object.assign({}, this.editData, values)))
      .then(action((data) => {
        Object.assign(this.editData, data);
        if (this.editData.roleIds === null) this.editData.roleIds = values.roleIds; // 在没有更新roleIds的时候data中的roleIds会为空，不修改不应该置为空而是应该不变。
        this.loading = false;
        this.sidebarVisible = false;
        this.needUpdateRoles = false;
        return data;
      }))
      .catch(action((error) => {
        Choerodon.handleResponseError(error);
        this.loading = false;
      }));
  }

  dashboardDisable(record) {
    return axios.post(`/iam/v1/dashboards/${record.id}?update_role=false`, JSON.stringify(Object.assign({}, record, { enabled: !record.enabled })))
      .then(() => this.loadData());
  }

  @action
  loadData(pagination = this.pagination, filters = this.filters, sort = this.sort, params = this.params) {
    const { columnKey, order } = sort;
    const sorter = [];
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
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      this.dashboardData.length = 0;
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.loading = false;
      return;
    }

    return axios.get(`/iam/v1/dashboards?${queryString.stringify({
      page: pagination.current,
      size: pagination.pageSize,
      name: filters.name,
      code: filters.code,
      level: filters.level,
      enable: filters.enabled,
      namespace: filters.namespace,
      needRoles: filters.needRoles,
      params: params.join(','),
      sort: sorter.join(','),
    })}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          this.dashboardData = list;
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
}

const dashboardSettingStore = new DashboardSettingStore();

export default dashboardSettingStore;

import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';
import { handleFiltersParams } from '../../../common/util';

@store('ProjectTypeStore')
class ProjectTypeStore {
  @observable projectTypeData = [];
  @observable loading = false;
  @observable pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  @observable filters = {};
  @observable sort = {};
  @observable params = [];
  @observable editData = {};
  @observable sidebarVisible = false;
  @observable sidebarType = 'create';

  @action
  setSidebarType(type) {
    this.sidebarType = type;
  }

  refresh() {
    this.loadData({ current: 1, pageSize: 10 }, {}, {}, []);
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
    return axios.post(`/iam/v1/projects/types/${this.editData.id}`, JSON.stringify({
      ...values,
      id: this.editData.id,
      objectVersionNumber: this.editData.objectVersionNumber,
    }))
      .then(action((data) => {
        this.loading = false;
        this.sidebarVisible = false;
        return data;
      }))
      .catch(action((error) => {
        Choerodon.handleResponseError(error);
        this.loading = false;
      }));
  }

  @action
  createType(values) {
    this.loading = true;
    return axios.post('/iam/v1/projects/types', values).then(action((data) => {
      this.loading = false;
      this.sidebarVisible = false;
      return data;
    })).catch(action((error) => {
      Choerodon.handleResponseError(error);
      this.loading = false;
    }));
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
      this.projectTypeData.length = 0;
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.loading = false;
      return;
    }

    return axios.get(`/iam/v1/projects/types/paging_query?${queryString.stringify({
      name: filters.name,
      code: filters.code,
      description: filters.description,
      params: params.join(','),
      sort: sorter.join(','),
    })}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          this.projectTypeData = list;
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

const projectTypeStore = new ProjectTypeStore();

export default projectTypeStore;

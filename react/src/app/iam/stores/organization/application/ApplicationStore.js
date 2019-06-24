import { action, computed, observable } from 'mobx';
import { axios, store, stores } from '@choerodon/boot';
import queryString from 'query-string';
import { handleFiltersParams } from '../../../common/util';

const { AppState } = stores;

class TreeData {
  treeDatas = [];

  currentPath = '/';

  constructor(data) {
    if (data.length > 0) {
      this.treeDatas = this.dfsAdd(null, data);
    }
  }

  dfsAdd = (rootId, data) => data.filter(v => (v.parentId === rootId && v.path === `${this.currentPath}${v.applicationId}/`)).map((v) => {
    // 保存原路径
    const originPath = `${this.currentPath}`;
    // 当前路径变为原路径+当前id
    this.currentPath = `${this.currentPath}${v.applicationId}/`;
    // 递归调用
    const children = this.dfsAdd(v.applicationId, data);
    // 还原现场
    this.currentPath = `${originPath}`;
    if (children.length > 0) {
      return ({ ...v, children });
    }
    return v;
  });
}

function combineRouteLink(list, link) {
  list.__uuid__ = `${link} - ${list.id}`;
  if (list.descendants) {
    list.descendants.forEach((v) => {
      combineRouteLink(v, list.__uuid__);
    });
  }
}

function addRouteLink(list) {
  list.forEach((v) => {
    combineRouteLink(v, v.parentId || 0);
  });
}

@store('ApplicationStore')
class ApplicationStore {
  /**
   * 应用列表数据
   * @type {Array}
   */
  @observable applicationData = [];

  /**
   * 应用树数据
   * @type {Array}
   */
  @observable applicationTreeData = [];

  /**
   * 应用清单数据
   * @type {Array}
   */
  @observable applicationListData = [];

  /**
   * 组织内的项目数据
   * @type {Array}
   */
  @observable projectData = [];

  /**
   * 可选择的数据
   * @type {Array}
   */
  @observable addListData = [];

  @observable selectedRowKeys = [];

  /**
   * 创建按钮是否正在加载中
   * @type {boolean}
   */
  @observable loading = false;

  @observable addListLoading = false;

  @observable listLoading = false;

  @observable sidebarVisible = false;

  @observable pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  @observable listPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  @observable addListPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  @observable filters = {};

  @observable sort = {};

  @observable params = [];

  @observable listParams = [];

  @observable editData = null;

  @observable operation;

  @observable submitting = false;

  refresh() {
    this.loadProject();
    this.loadData();
  }

  @action
  initSelectedKeys() {
    if (this.applicationTreeData.length > 0) {
      if (this.applicationTreeData[0].children && this.applicationTreeData[0].children.length > 0) {
        this.selectedRowKeys = this.applicationTreeData[0].children.map(v => v.applicationId);
      } else {
        this.selectedRowKeys = [];
      }
    } else {
      this.selectedRowKeys = [];
    }
  }

  @action
  setSelectedRowKeys(keys) {
    this.selectedRowKeys = keys;
  }

  getProjectById(id) {
    const value = this.projectData.filter(v => v.id === id);
    return value.length > 0 ? value[0] : { name: null, imageUrl: null };
  }

  @computed
  get getDataSource() {
    return this.applicationData.map(v => ({ ...v, projectName: this.getProjectById(v.projectId).name, imageUrl: this.getProjectById(v.projectId).imageUrl }));
  }

  @computed
  get getAddListDataSource() {
    return this.applicationTreeData.slice();
  }

  @action
  setEditData(data) {
    this.editData = data;
  }

  @action
  setSubmitting(flag) {
    this.submitting = flag;
  }

  @action
  setOperation(data) {
    this.operation = data;
  }

  @action
  showSidebar() {
    this.sidebarVisible = true;
  }

  @action
  closeSidebar() {
    this.sidebarVisible = false;
  }

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action
  loadProject() {
    axios.get(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/projects/list?page=-1`).then(action((data) => {
      if (!data.failed) {
        this.projectData = data;
      }
    }));
  }

  @action
  loadApplications() {
    return axios.get(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications?size=0&with_descendants=false`).then(action((data) => {
      if (!data.failed) {
        this.applicationTreeData = data.list;
        this.selectedRowKeys = [];
      }
    }));
  }

  @action
  loadListData(pagination = this.listPagination, filters, sort, params = this.listParams) {
    this.listLoading = true;
    this.listParams = params;

    return axios.get(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${this.editData.id}/app_list?${queryString.stringify({
      page: pagination.current,
      size: pagination.pageSize,
      params: params.join(','),
    })}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          this.applicationListData = list;
          this.listPagination = {
            ...pagination,
            total,
          };
        }
        this.listLoading = false;
      }))
      .catch(action((error) => {
        Choerodon.handleResponseError(error);
        this.listLoading = false;
      }));
  }

  @action
  loadAddListData(id) {
    return axios.get(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${id}/enabled_app`).then(action((data) => {
      if (!data.failed) {
        this.addListData = data;
      } else {
        Choerodon.prompt(data.message);
      }
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
      this.dashboardData.length = 0;
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.loading = false;
      return;
    }

    const queryObj = {
      page: pagination.current,
      size: pagination.pageSize,
      params: params.join(','),
      sort: sorter.join(','),
    };
    ['applicationCategory', 'applicationType', 'name', 'code', 'projectName', 'enabled'].forEach(((value) => {
      if (filters[value] && filters[value].length > 0) queryObj[value] = filters[value];
    }));

    return axios.get(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications?${queryString.stringify(queryObj)}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          if (list.length) {
            // eslint-disable-next-line no-return-assign
            list.forEach(v => v.isFirst = true);
          }
          addRouteLink(list);
          this.applicationData = list;
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

  createApplication = applicationData => axios.post(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications`, JSON.stringify(applicationData));

  updateApplication = (applicationData, id) => axios.post(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${id}`, JSON.stringify(applicationData));

  enableApplication = id => axios.put(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${id}/enable`);

  disableApplication = id => axios.put(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${id}/disable`);

  checkApplicationCode = codes => axios.post(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/check`, JSON.stringify(codes));

  getDetailById = id => axios.get(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${id}`);

  /**
   * 添加到组合应用中
   * @param id {Number}
   * @param ids {Array}
   * @returns {Promise}
   */
  addToCombination = (id, ids) => axios.post(`/iam/v1/organizations/${AppState.currentMenuType.organizationId}/applications/${id}/add_to_combination`, JSON.stringify([...new Set(ids)]));
}

const applicationStore = new ApplicationStore();
export default applicationStore;

/**
 * Created by jinqin.ma on 2017/6/27.
 */
import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';
import { handleFiltersParams } from '../../../common/util';

@store('OrganizationStore')
class OrganizationStore {
  @observable orgData = [];
  @observable loading = false;
  @observable submitting = false;
  @observable show;
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
  @observable myOrg = {};
  @observable myRoles = [];
  @observable partDetail = {};
  @observable usersData = [];

  @action
  setFilters() {
    this.filters = {};
  }

  @action
  setParams() {
    this.params = [];
  }

  @action
  setPartDetail(data) {
    this.partDetail = data;
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

  @action setUsersData(data) {
    this.usersData = data;
  }

  @computed get getUsersData() {
    return this.usersData;
  }

  refresh() {
    this.loadData({ current: 1, pageSize: 10 }, {}, {}, []);
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
      this.orgData.length = 0;
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.loading = false;
      return;
    }

    return axios.get(`/iam/v1/organizations?${queryString.stringify({
      page: pagination.current,
      size: pagination.pageSize,
      name: filters.name,
      code: filters.code,
      enabled: filters.enabled,
      params: params.join(','),
      sort: sorter.join(','),
    })}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          this.orgData = list;
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

  toggleDisable(id, enabled) {
    return axios.put(`/iam/v1/organizations/${id}/${enabled ? 'disable' : 'enable'}`)
      .then(() => this.loadData());
  }

  checkCode = value =>
    axios.post('/iam/v1/organizations/check', JSON.stringify({ code: value }));

  @action
  createOrUpdateOrg({ code, name, address, userId, homePage }, modify, imgUrl = null, HeaderStore) {
    const { show, editData: { id, code: originCode, objectVersionNumber } } = this;
    const isCreate = show === 'create';
    if (!modify && !isCreate) {
      return Promise.resolve('modify.success');
    } else {
      let url;
      let body;
      let message;
      let method;
      if (isCreate) {
        url = '/org/v1/organizations';
        body = {
          name,
          code,
        };

        if (address) {
          body.address = address;
        }

        if (userId) {
          body.userId = userId;
        }

        if (homePage) {
          body.homePage = homePage;
        }

        message = 'create.success';
        method = 'post';
      } else {
        url = `/iam/v1/organizations/${id}`;
        body = {
          name,
          homePage,
          objectVersionNumber,
          code: originCode,
          address: address || null,
        };
        message = 'modify.success';
        method = 'put';
      }

      if (imgUrl) {
        body.imageUrl = imgUrl;
      }
      this.submitting = true;
      return axios[method](url, JSON.stringify(body))
        .then(action((data) => {
          this.submitting = false;
          if (data.failed) {
            return data.message;
          } else {
            this.sidebarVisible = false;
            if (isCreate) {
              this.refresh();
              HeaderStore.addOrg(data);
            } else {
              this.loadData();
              HeaderStore.updateOrg(data);
            }
            return message;
          }
        }))
        .catch(action((error) => {
          this.submitting = false;
          Choerodon.handleResponseError(error);
        }));
    }
  }

  getOrgById = organizationId =>
    axios.get(`/iam/v1/organizations/${organizationId}`);

  getOrgByIdOrgLevel = organizationId =>
    axios.get(`/iam/v1/organizations/${organizationId}/org_level`);

  getRolesById = (organizationId, userId) =>
    axios.get(`/iam/v1/organizations/${organizationId}/role_members/users/${userId}`);

  loadMyData(organizationId, userId) {
    axios.all([
      this.getOrgByIdOrgLevel(organizationId),
      this.getRolesById(organizationId, userId),
    ])
      .then(action(([org, roles]) => {
        this.myOrg = org;
        this.myRoles = roles;
      }))
      .catch(Choerodon.handleResponseError);
  }

  loadOrgDetail = id => axios.get(`/iam/v1/organizations/${id}`).then((data) => {
    if (data.failed) {
      return data.message;
    } else {
      this.setPartDetail(data);
      this.showSideBar();
    }
  }).catch(Choerodon.handleResponseError);

  loadUsers = (queryObj = { sort: 'id' }) => axios.get(`/iam/v1/all/users?${queryString.stringify(queryObj)}`);
}

export default new OrganizationStore();

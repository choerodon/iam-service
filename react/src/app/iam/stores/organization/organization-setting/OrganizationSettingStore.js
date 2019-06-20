import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';

@store('OrganizationSetting')
class OrganizationSettingStore {
  @observable projectInfo = {};
  @observable projectTypes = [];
  @observable imageUrl = null;
  @observable orgCategories = [];

  @action setOrgCategories(data) {
    this.orgCategories = data;
  }

  @computed get getOrgCategories() {
    return this.orgCategories;
  }
  @action setImageUrl(data) {
    this.imageUrl = data;
  }

  @computed get getImageUrl() {
    return this.imageUrl;
  }
  
  @action setOrganizationInfo(data) {
    this.projectInfo = data;
  }

  @computed get getOrganizationInfo() {
    return this.projectInfo;
  }

  axiosGetOrganizationInfo(id) {
    return axios.get(`/iam/v1/organizations/${id}/org_level`);
  }

  axiosSaveProjectInfo(data) {
    return axios.put(`/iam/v1/organizations/${data.id}/organization_level`, data);
  }

  loadOrganizationCategories = (queryObj) => axios.get(`/org/v1/categories/org?${queryString.stringify(queryObj)}`).then((data) => {
    this.setOrgCategories((data.list || []).slice());
  });

}

const organizationSetting = new OrganizationSettingStore();

export default organizationSetting;

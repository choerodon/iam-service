import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('ProjectSettingStore')
class ProjectSettingStore {
  @observable projectInfo = {};
  @observable projectTypes = [];
  @observable imageUrl = null;

  @action setImageUrl(data) {
    this.imageUrl = data;
  }

  @computed get getImageUrl() {
    return this.imageUrl;
  }
  
  @action setProjectInfo(data) {
    this.projectInfo = data;
  }

  @computed get getProjectInfo() {
    return this.projectInfo;
  }

  @action setProjectTypes(data) {
    this.projectTypes = data;
  }

  @computed get getProjectTypes() {
    return this.projectTypes;
  }

  axiosGetProjectInfo(id) {
    return axios.get(`/iam/v1/projects/${id}`);
  }

  axiosSaveProjectInfo(data) {
    return axios.put(`/iam/v1/projects/${data.id}`, data);
  }

  disableProject(proId) {
    return axios.put(`/iam/v1/projects/${proId}/disable`);
  }

  loadProjectTypes = () => axios.get('/iam/v1/projects/types');
}

const projectSettingStore = new ProjectSettingStore();

export default projectSettingStore;

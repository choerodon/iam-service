/**
 * Created by hulingfangzi on 2018/6/12.
 */
import { action, computed, observable } from 'mobx';
import { axios, store, stores } from 'choerodon-boot-combine';
import querystring from 'query-string';

const { AppState } = stores;

@store('ConfigurationStore')
class ConfigurationStore {
  @observable service = [];
  @observable currentService = {};
  @observable configData = [];
  @observable loading = true;
  @observable currentServiceConfig = {};
  @observable currentConfigId = null; // 当前配置id
  @observable status = '';
  @observable editConfig = null;
  @observable relatedService = {}; // 联动service
  @observable lastPath = 'configuration'; // 记录上次路径

  @action setStatus(data) {
    this.status = data;
  }

  @computed get getStatus() {
    return this.status;
  }

  @action setRelatedService(data) {
    this.relatedService = data;
  }

  @computed get getRelatedService() {
    return this.relatedService;
  }

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setService(data) {
    this.service = data;
  }

  @action setCurrentService(data) {
    this.currentService = data;
  }

  @computed get getCurrentService() {
    return this.currentService;
  }

  @action setConfigData(data) {
    this.configData = data;
  }

  @computed get getConfigData() {
    return this.configData;
  }

  @action setCurrentServiceConfig(data) {
    this.currentServiceConfig = data;
  }

  @computed get getCurrentServiceConfig() {
    return this.currentServiceConfig;
  }

  @action setCurrentConfigId(data) {
    this.currentConfigId = data;
  }

  @computed get getCurrentConfigId() {
    return this.currentConfigId;
  }

  @action setEditConfig(data) {
    this.editConfig = data;
  }

  @computed get getEditConfig() {
    return this.editConfig;
  }

  @action setLastPath(data) {
    this.lastPath = data;
  }

  @computed get getLastPath() {
    return this.lastPath;
  }

  loadService = () => axios.get('manager/v1/services');

  loadCurrentServiceConfig(serviceId) {
    const queryObj = {
      serviceId,
      page: 1,
      size: 200,
    };
    axios.get(`/manager/v1/configs?${querystring.stringify(queryObj)}`).then(data => this.setCurrentServiceConfig((data.list || []).slice()));
  }

  modifyConfig(configId, type, data) {
    return axios.put(`manager/v1/configs/${configId}?type=${type}`, data);
  }

  deleteConfig = configId => axios.delete(`manager/v1/configs/${configId}`);

  setDefaultConfig = configId => axios.put(`manager/v1/configs/${configId}/default`);

  createConfig = data => axios.post('manager/v1/configs', JSON.stringify(data));

  getEditConfigData = id => axios.get(`manager/v1/configs/${id}`);

  versionCheck = data => axios.post('manager/v1/configs/check', JSON.stringify(data));
}
const configurationStore = new ConfigurationStore();
export default configurationStore;

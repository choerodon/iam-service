import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('SystemSettingStore')
class SystemSettingStore {
  @observable logoLoadingStatus = false;
  @observable userSetting = {};
  @observable logo = '';
  @observable favicon = '';
  @observable submitting = false;
  @computed
  get getUserSetting() {
    return this.userSetting ? this.userSetting : {};
  }
  @action
  setUserSetting(data) {
    this.userSetting = data;
  }
  @computed
  get getFavicon() {
    return this.favicon ? this.favicon : '';
  }
  @action
  setFavicon(favicon) {
    this.favicon = favicon;
  }
  @computed
  get getLogo() {
    return this.logo ? this.logo : '';
  }
  @action
  setLogo(logo) {
    this.logo = logo;
  }
  @action
  putUserSetting(data) {
    return axios.put('/iam/v1/system/setting', data);
  }
  @action
  postUserSetting(data) {
    return axios.post('/iam/v1/system/setting', data);
  }
  @action
  resetUserSetting() {
    return axios.delete('/iam/v1/system/setting');
  }
  loadUserSetting() {
    return axios.get('/iam/v1/system/setting');
  }
}

const systemSettingStore = new SystemSettingStore();

export default systemSettingStore;

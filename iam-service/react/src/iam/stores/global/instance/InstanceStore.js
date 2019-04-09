/**
 * Created by hulingfangzi on 2018/6/20.
 */
import { action, computed, observable } from 'mobx';
import { axios, store, stores } from 'choerodon-boot-combine';

@store('InstanceStore')
class InstanceStore {
  @observable service = [];
  @observable currentService = { name: 'total' };
  @observable loading = true;
  @observable instanceData = [];
  @observable instanceDetail = null;

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setCurrentService(data) {
    this.currentService = data;
  }

  @computed get getCurrentService() {
    return this.currentService;
  }

  @action setInstanceData(data) {
    this.instanceData = data;
  }

  @computed get getInstanceData() {
    return this.instanceData;
  }

  @action setService(data) {
    this.service = data;
  }

  @action setInstanceDetail(data) {
    this.instanceDetail = data;
  }

  @computed get getInstanceDetail() {
    return this.instanceDetail;
  }

  loadService = () => axios.get('manager/v1/services');

  loadInstanceInfo = instanceId => axios.get(`manager/v1/instances/${instanceId}`)
}

const instanceStore = new InstanceStore();
export default instanceStore;

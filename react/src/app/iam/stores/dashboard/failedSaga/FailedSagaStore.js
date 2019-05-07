import { action, computed, observable, toJS } from 'mobx';
import { axios, store } from '@choerodon/boot';
import moment from 'moment';

@store('FailedSagaStore')
class FailedSagaStore {
  @observable data = null;
  @observable loading = true;
  @observable startTime = moment().subtract(6, 'days');
  @observable endTime = moment();
  @observable showSize = 220;

  @action
  setShowSize(size) {
    this.showSize = size;
  }

  @action setChartData(data) {
    this.data = data;
  }

  @computed get getChartData() {
    return this.data;
  }

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setStartTime(data) {
    this.startTime = data;
  }

  @computed get getStartTime() {
    return this.startTime;
  }

  @action setEndTime(data) {
    this.endTime = data;
  }

  @computed get getEndTime() {
    return this.endTime;
  }

  loadData = (beginDate, endDate) => axios.get(`/asgard/v1/sagas/instances/failed/count?begin_date=${beginDate}&end_date=${endDate}`)
    .then((res) => {
      if (res.failed) {
        Choerodon.prompt(res.message);
      } else {
        this.setChartData(res);
      }
      this.setLoading(false);
    }).catch((error) => {
      this.setLoading(false);
      Choerodon.handleResponseError(error);
    })
}

const failedSagaStore = new FailedSagaStore();
export default failedSagaStore;

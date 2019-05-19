import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('OrganizationStatisticsStore')
class OrganizationStatisticsStore {
  @observable loading = true;

  @observable organizations = [];

  @observable currentorg = null;
  
  @observable chartData = {};

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setChartData(data) {
    this.chartData = data;
  }

  @computed get getChartData() {
    return this.chartData;
  }

  @action setOrganizations(data) {
    this.organizations = data;
  }

  @computed get getOrganizations() {
    return this.organizations;
  }

  @action setCurrentOrg(data) {
    this.currentorg = data;
  }

  @computed get getCurrentOrg() {
    return this.currentorg;
  }

  @action loadOrganizations = () => axios.get('/iam/v1/organizations/all?size=500')
    .then(action((data) => {
      this.organizations = data.list;
      if (data.list.length) {
        this.currentorg = data.list[0].id;
        this.loadPie(data.list[0].id);
      }
    }))

  @action loadPie = id => axios.get(`/iam/v1/organizations/${id}/projects/under_the_type`)
    .then(action(
      (data) => {
        this.chartData = data;
        this.loading = false;
      },
    ))
}

const organizationStatisticsStore = new OrganizationStatisticsStore();
export default organizationStatisticsStore;

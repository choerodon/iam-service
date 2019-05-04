import { action, computed, observable, toJS } from 'mobx';
import { axios, store, stores } from '@choerodon/boot';
import moment from 'moment';
import querystring from 'query-string';

const { MenuStore } = stores;

class DataSorter {
  static GetNumSorter = (orderBy, direction) => (item1, item2) => {
    switch (direction) {
      case 'asc':
        return item1[orderBy] - item2[orderBy];
      case 'desc':
        return item2[orderBy] - item1[orderBy];
      default:
        return item1[orderBy] - item2[orderBy];
    }
  }
}

@store('SiteStatisticsStore')
class SiteStatisticsStore {
  @observable chartData = null;
  @observable tableData = [];
  @observable startTime = moment().subtract(6, 'days');
  @observable endTime = moment();
  @observable currentLevel = 'site';
  @observable startDate = null;
  @observable endDate = null;
  @observable loading = false;
  allTableDate = [];
  set = new Set();

  @action setStartDate(data) {
    this.startDate = data;
  }

  @computed get getStartDate() {
    return this.startDate;
  }

  @computed get getTableData() {
    return this.tableData;
  }

  @action setTableData(data) {
    this.tableData = (data.details ? data.details.map(v => ({
      code: v.menu.split(':')[0],
      name: v.menu.split(':')[1],
      sum: v.data.reduce((prev, cur) => prev + cur, 0),
    })) : this.tableData);
    this.tableData = this.tableData.sort(DataSorter.GetNumSorter('sum', 'desc'));
  }

  @action appendTableData(data) {
    this.set.clear();
    this.tableData.forEach((v) => {
      this.set.add(v.code);
    });
    this.dfsAddMenu(data);
    this.setTableData({ detail: [...this.tableData.slice()] });
  }

  @action
  dfsAddMenu(data) {
    data.forEach((v) => {
      if (!this.set.has(v.code)) {
        this.tableData.push({ code: v.code, name: v.name, sum: 0 });
        this.set.add(v.code);
      }
      if (v.subMenus) {
        this.dfsAddMenu(v.subMenus);
      }
    });
  }

  @action setEndDate(data) {
    this.endDate = data;
  }

  @computed get getEndDate() {
    return this.endDate;
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

  @action setChartData(data) {
    this.chartData = data;
  }

  @computed get getChartData() {
    return this.chartData;
  }

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setCurrentLevel(data) {
    this.currentLevel = data;
  }

  @computed get getCurrentLevel() {
    return this.currentLevel;
  }

  loadChart = (beginDate, endDate, level) => {
    const queryObj = {
      begin_date: beginDate,
      end_date: endDate,
      level,
    };
    return axios.get(`/manager/v1/statistic/menu_click?${querystring.stringify(queryObj)}`)
      .then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          if (data.menu.length) {
            const arr = data.menu.map(item => `${item.split(':')[1]}: ${item.split(':')[0]}`);
            data.menu = arr;
          }

          this.setTableData(data);
          this.setChartData(data);
        }
        this.setLoading(false);
      }).catch((error) => {
        this.setLoading(false);
        Choerodon.handleResponseError(error);
      });
  };

  tableDataFormatter = (data) => {
    const tableData = (data.details ? data.details.map(v => ({
      code: v.menu.split(':')[0],
      name: v.menu.split(':')[1],
      sum: v.data.reduce((prev, cur) => prev + cur, 0),
    })) : this.tableData);
    return tableData.sort(DataSorter.GetNumSorter('sum', 'desc'));
  };

  getTableDate = (level) => {
    const queryObj = {
      begin_date: this.startTime.format().split('T')[0],
      end_date: this.endTime.format().split('T')[0],
      level,
    };
    return axios.get(`/manager/v1/statistic/menu_click?${querystring.stringify(queryObj)}`).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        data = this.tableDataFormatter(data).map(values => ({ ...values, level }));
        this.allTableDate = this.allTableDate.concat(data);
      }
    });
  };

  getMenuData = level => axios.get(`/iam/v1/menus/menu_config?level=${level}`).then((data) => {
    this.dfsAddAllMenu(data, level);
  });


  dfsAddAllMenu(data, level) {
    data.forEach((v) => {
      if (!this.set.has(v.code)) {
        this.allTableDate.push({ code: v.code, name: v.name, sum: 0, level });
        this.set.add(v.code);
      }
      if (v.subMenus) {
        this.dfsAddAllMenu(v.subMenus, level);
      }
    });
  }

  /**
   * 获取所有层级的表数据
   */
  async getAllTableDate() {
    this.allTableDate = [];
    this.set.clear();

    await this.getTableDate('site');
    await this.getMenuData('site');
    await this.getTableDate('organization');
    await this.getMenuData('organization');
    await this.getTableDate('project');
    await this.getMenuData('project');
    await this.getTableDate('user');
    await this.getMenuData('user');
    return this.allTableDate;
  }
}

const siteStatisticsStore = new SiteStatisticsStore();
export default siteStatisticsStore;

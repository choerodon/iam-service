import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('RoleLabelStore')
class RoleLabelStore {
  @observable loading = true;
  @observable data = [];

  @action
  setData(data) {
    this.data = data;
  }

  @computed
  get getData() {
    return this.data;
  }

  @action
  setLoading(loading) {
    this.loading = loading;
  }

  @computed
  get getLoading() {
    return this.loading;
  }

  loadData(
    { name, level, description },
    { columnKey = 'id', order = 'descend' },
    params) {
    const queryObj = {
      name,
      level,
      description,
      params,
    };
    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
      queryObj.sort = sorter.join(',');
    }
    return axios.get(`/iam/v1/labels?${querystring.stringify(queryObj)}`);
  }
}

const roleLabelStore = new RoleLabelStore();

export default roleLabelStore;

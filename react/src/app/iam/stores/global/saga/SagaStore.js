import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('SagaStore')
class SagaStore {
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

  /**
   * detail data
   * 详情页数据
   * @param id
   */
  loadDetailData(id) {
    return axios.get(`/asgard/v1/sagas/${id}`);
  }

  /**
   * init data
   * 初始加载数据
   * @param current
   * @param pageSize
   * @param code
   * @param description
   * @param service
   * @param columnKey
   * @param order
   * @param params
   */
  loadData(
    { current, pageSize },
    { code, description, service },
    { columnKey = 'id', order = 'descend' },
    params) {
    const queryObj = {
      page: current,
      size: pageSize,
      code,
      description,
      service,
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
    return axios.get(`/asgard/v1/sagas?${querystring.stringify(queryObj)}`);
  }
}

const sagaStore = new SagaStore();

export default sagaStore;

import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('SagaInstanceStore')
class SagaInstanceStore {
  @observable loading = true;
  @observable data = [];
  @observable taskData = [];
  @observable statistics = {
    COMPLETED_COUNT: 0,
    FAILED_COUNT: 0,
    RUNNING_COUNT: 0,
    ROLLBACK_COUNT: 0,
  };

  sagaInstanceType = null;

  @action
  setData(data) {
    this.data = data;
  }

  @action
  setTaskData(data) {
    this.taskData = data;
  }

  @computed
  get getStatistics() {
    // 旧的statistics字段数据后缀没有_COUNT 这里去掉，让新数据兼容旧的代码
    return {
      COMPLETED: this.statistics.COMPLETED_COUNT,
      FAILED: this.statistics.FAILED_COUNT,
      RUNNING: this.statistics.RUNNING_COUNT,
      ROLLBACK: this.statistics.ROLLBACK_COUNT,
    };
  }

  @computed
  get getData() {
    return this.data;
  }

  @computed
  get getTaskData() {
    return this.taskData;
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
   * 重试
   * @param id
   * @returns {IDBRequest | Promise<void>}
   */
  retry(id) {
    return axios.put(`${this.sagaInstanceType.apiGetway}tasks/instances/${id}/retry`);
  }

  /**
   * 解锁
   */
  unLock(id) {
    return axios.put(`${this.sagaInstanceType.apiGetway}tasks/instances/${id}/unlock`);
  }

  /**
   * 强制失败
   * @param id
   */
  abort(id) {
    return axios.put(`${this.sagaInstanceType.apiGetway}tasks/instances/${id}/failed`);
  }

  /**
   * 详情
   * @param id
   */
  loadDetailData(id) {
    return axios.get(`${this.sagaInstanceType.apiGetway}instances/${id}`);
  }

  /**
   * 加载统计数据
   * @returns {*}
   */
  @action
  loadStatistics() {
    return axios.get(`${this.sagaInstanceType.apiGetway}instances/statistics`).then(action((data) => {
      this.statistics = data;
    }));
  }

  /**
   * 初始数据
   * @param current
   * @param pageSize
   * @param id
   * @param status
   * @param sagaCode
   * @param refType
   * @param refId
   * @param taskInstanceCode
   * @param sagaInstanceCode
   * @param description
   * @param columnKey
   * @param order
   * @param params
   * @param sagaInstanceType
   * @param type
   */
  loadData(
    { current, pageSize },
    { id, status, sagaCode, refType, refId, taskInstanceCode, sagaInstanceCode, description },
    { columnKey = 'id', order = 'descend' },
    params,
    sagaInstanceType,
    type) {
    this.sagaInstanceType = sagaInstanceType;
    const queryObj = type !== 'task' ? {
      page: current,
      size: pageSize,
      id,
      status,
      sagaCode,
      refType,
      refId,
      params,
    } : {
      page: current,
      size: pageSize,
      id,
      status,
      taskInstanceCode,
      sagaInstanceCode,
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
    switch (type) {
      case 'instance':
        return axios.get(`${sagaInstanceType.apiGetway}instances?${querystring.stringify(queryObj)}`);
      case 'task':
        return axios.get(`${sagaInstanceType.apiGetway}tasks/instances?${querystring.stringify(queryObj)}`);
      default:
        return axios.get(`${sagaInstanceType.apiGetway}instances?${querystring.stringify(queryObj)}`);
    }
  }
}

const sagaInstanceStore = new SagaInstanceStore();

export default sagaInstanceStore;

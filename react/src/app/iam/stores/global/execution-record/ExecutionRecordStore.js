import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('ExecutionRecordStore')
class ExecutionRecordStore {
  @observable data = [];

  @action setData(data) {
    this.data = data;
  }

  @computed get getData() {
    return this.data;
  }

  loadData(
    { current, pageSize },
    { status, taskName, exceptionMessage },
    { columnKey = 'id', order = 'descend' },
    params, type, id) {
    const queryObj = {
      page: current,
      size: pageSize,
      status,
      taskName,
      exceptionMessage,
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
    const path = type === 'site' ? '' : `/${type}s/${id}`;
    return axios.get(`asgard/v1/schedules${path}/tasks/instances?${querystring.stringify(queryObj)}`);
  }
}

const executionRecordStore = new ExecutionRecordStore();
export default executionRecordStore;

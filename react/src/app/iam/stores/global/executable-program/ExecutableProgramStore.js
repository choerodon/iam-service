import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('ExecutableProgramStore')
class ExecutableProgramStore {
  @observable data = [];
  @observable detail = {};

  @action setData(data) {
    this.data = data;
  }

  @computed get getData() {
    return this.data;
  }

  @action setDetail(data) {
    this.detail = data;
  }

  @computed get getDetail() {
    return this.detail;
  }

  loadData(
    { current, pageSize },
    { code, service, method, description, level },
    { columnKey = 'id', order = 'descend' },
    params, type, id) {
    const queryObj = {
      page: current,
      size: pageSize,
      code,
      service,
      method,
      description,
      level,
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
    return axios.get(`/asgard/v1/schedules${path}/methods?${querystring.stringify(queryObj)}`);
  }

  loadProgramDetail = (recordId, type, id) => {
    const path = type === 'site' ? '' : `/${type}s/${id}`;
    return axios.get(`/asgard/v1/schedules${path}/methods/${recordId}`);
  };

  deleteExecutableProgramById = id => axios.delete(`/asgard/v1/schedules/methods/${id}`);
}

const executableProgramStore = new ExecutableProgramStore();
export default executableProgramStore;

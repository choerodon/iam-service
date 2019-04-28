import { action, computed, observable } from 'mobx';
import { axios, store, stores } from 'choerodon-boot-combine';
import querystring from 'query-string';

@store('TaskDetailStore')
class TaskDetailStore {
  @observable data = [];
  @observable service = [];
  @observable info = {}; // 任务信息
  @observable log = []; // 任务日志
  @observable currentService = [];
  @observable classNames = []; // 任务类名下拉框数据
  @observable currentClassNames = {}; // 当前任务程序
  @observable currentTask = {};
  @observable userdata = [];

  @action setData(data) {
    this.data = data;
  }

  @computed get getData() {
    return this.data;
  }

  @action setLog(data) {
    this.log = data;
  }

  @computed get getLog() {
    return this.log;
  }

  @action setService(data) {
    this.service = data;
  }

  @action setCurrentService(data) {
    this.currentService = data;
  }

  @computed get getCurrentService() {
    return this.currentService;
  }

  @action setCurrentClassNames(data) {
    this.currentClassNames = data;
  }

  @computed get getCurrentClassNames() {
    return this.currentClassNames;
  }

  @action setClassNames(data) {
    this.classNames = data;
  }

  @computed get getClassNames() {
    return this.classNames;
  }

  @action setInfo(data) {
    this.info = data;
    if (this.info.simpleRepeatCount != null) this.info.simpleRepeatCount += 1;
  }

  @action setCurrentTask(data) {
    this.currentTask = data;
  }

  @action setUserData(data) {
    this.userdata = data;
  }

  @computed get getUserData() {
    return this.userdata;
  }

  getLevelType = (type, id) => (type === 'site' ? '' : `/${type}s/${id}`);
  getRoleLevelType = (type, id) => (type === 'site' ? `/iam/v1/${type}` : `/iam/v1/${type}s/${id}`);

  loadData(
    { current, pageSize },
    { status, name, description },
    { columnKey = 'id', order = 'descend' },
    params, type, id) {
    const queryObj = {
      page: current,
      size: pageSize,
      status,
      name,
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
    return axios.get(`asgard/v1/schedules${this.getLevelType(type, id)}/tasks?${querystring.stringify(queryObj)}`);
  }

  loadLogData(
    { current, pageSize },
    { status, serviceInstanceId },
    { columnKey = 'id', order = 'descend' },
    params, taskId, type, id) {
    const queryObj = {
      page: current,
      size: pageSize,
      status,
      serviceInstanceId,
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
    return axios.get(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks/instances/${taskId}?${querystring.stringify(queryObj)}`);
  }


  loadUserDatas(
    { current, pageSize },
    { columnKey = 'id', order = 'descend' },
    params, type, id) {
    const body = {
      param: params,
    };
    const queryObj = {
      size: pageSize,
      page: current,
    };
    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
      queryObj.sort = sorter.join(',');
    }
    if (type === 'site') {
      return axios.post(`${this.getRoleLevelType(type, id)}/role_members/users/roles/for_all?${querystring.stringify(queryObj)}`, JSON.stringify(body));
    } else {
      return axios.post(`${this.getRoleLevelType(type, id)}/role_members/users/roles?${querystring.stringify(queryObj)}`, JSON.stringify(body));
    }
  }

  loadService = (type, id) => axios.get(`/asgard/v1/schedules${this.getLevelType(type, id)}/methods/services`);

  loadClass = (service, type, id) => axios.get(`/asgard/v1/schedules${this.getLevelType(type, id)}/methods/service?service=${service}`);


  loadParams = (classId, type, id) => axios.get(`/asgard/v1/schedules${this.getLevelType(type, id)}/methods/${classId}`);


  ableTask = (taskId, objectVersionNumber, status, type, id) => axios.put(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks/${taskId}/${status}?objectVersionNumber=${objectVersionNumber}`);


  deleteTask = (taskId, type, id) => axios.delete(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks/${taskId}`);


  checkName = (name, type, id) => axios.post(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks/check`, name);


  createTask = (body, type, id) => axios.post(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks`, JSON.stringify(body));


  loadInfo = (currentId, type, id) => axios.get(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks/${currentId}`);


  checkCron = (body, type, id) => axios.post(`/asgard/v1/schedules${this.getLevelType(type, id)}/tasks/cron`, body);
}


const taskDetailStore = new TaskDetailStore();
export default taskDetailStore;

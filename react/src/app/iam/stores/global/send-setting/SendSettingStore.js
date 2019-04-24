import { action, computed, observable } from 'mobx';
import { axios, store } from 'choerodon-boot-combine';
import querystring from 'query-string';

@store('SendSettingStore')
class SendSettingStore {
  @observable data = [];

  @observable currentRecord = {};

  @observable template = [];

  @observable pmTemplate = [];

  @observable currentTemplate = [];

  @action setData(data) {
    this.data = data;
  }

  @computed get getData() {
    return this.data;
  }

  @action setCurrentRecord(data) {
    this.currentRecord = data;
  }

  @computed get getCurrentRecord() {
    return this.currentRecord;
  }

  @action setCurrentTemplate(data) {
    this.currentTemplate = data;
  }

  @computed get getCurrentTemplate() {
    return this.currentTemplate;
  }

  @action setTemplate(data) {
    this.template = data;
  }

  @computed get getTemplate() {
    return this.template;
  }

  @action setPmTemplate(data) {
    this.pmTemplate = data;
  }

  @computed get getPmTemplate() {
    return this.pmTemplate;
  }


  loadData(
    { current, pageSize },
    { name, code, description, level },
    { columnKey = 'id', order = 'descend' },
    params, appType, orgId) {
    const queryObj = {
      page: current - 1,
      size: pageSize,
      name,
      code,
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
    const path = appType === 'site' ? '' : `/organizations/${orgId}`;
    return axios.get(`/notify/v1/notices/send_settings${path}?${querystring.stringify(queryObj)}`);
  }

  loadCurrentRecord = (id, appType, orgId) => {
    const path = appType === 'site' ? '' : `/organizations/${orgId}`;
    return axios.get(`/notify/v1/notices/send_settings/${id}${path}`);
  };

  loadTemplate = (appType, orgId, businessType) => {
    const path = appType === 'site' ? '' : `/organizations/${orgId}`;
    axios.get(`notify/v1/notices/emails/templates/names${path}?business_type=${businessType}`).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.setTemplate(data);
      }
    });
  };

  loadPmTemplate = (appType, orgId, businessType) => {
    const path = appType === 'site' ? '' : `/organizations/${orgId}`;
    axios.get(`notify/v1/notices/letters/templates/names${path}?business_type=${businessType}`).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.setPmTemplate(data);
      }
    });
  };

  modifySetting = (id, body, appType, orgId) => {
    const path = appType === 'site' ? '' : `/organizations/${orgId}`;
    return axios.put(`notify/v1/notices/send_settings/${id}${path}`, JSON.stringify(body));
  };

  deleteSettingById = id => axios.delete(`notify/v1/notices/send_settings/${id}`);
}

const sendSettingStore = new SendSettingStore();

export default sendSettingStore;

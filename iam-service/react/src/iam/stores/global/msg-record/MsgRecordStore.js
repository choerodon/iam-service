import { action, computed, observable } from 'mobx';
import { axios, store } from 'choerodon-boot-combine';
import querystring from 'query-string';

@store('MsgRecordStore')
class MsgRecordStore {
  @observable data = [];

  @action setData(data) {
    this.data = data;
  }

  @computed get getData() {
    return this.data;
  }

  loadData(
    { current, pageSize },
    { status, email, templateType, failedReason, retryStatus },
    { columnKey = 'id', order = 'descend' },
    params, appType, orgId) {
    const queryObj = {
      page: current - 1,
      size: pageSize,
      status,
      receiveEmail: email,
      templateType,
      failedReason,
      retryStatus,
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
    return axios.get(`/notify/v1/records/emails${path}?${querystring.stringify(queryObj)}`);
  }

  retry = (id, appType, orgId) => {
    const path = appType === 'site' ? '' : `/organizations/${orgId}`;
    const method = appType === 'site' ? 'post' : 'get';
    return axios[method](`/notify/v1/records/emails/${id}/retry${path}`);
  }
}

const msgRecordStore = new MsgRecordStore();

export default msgRecordStore;

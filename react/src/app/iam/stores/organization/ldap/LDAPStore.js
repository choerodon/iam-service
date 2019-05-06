/**
 * Created by song on 2017/6/26.
 */

import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import querystring from 'query-string';

@store('LDAPStore')
class LDAPStore {
  @observable ldapData = null;
  @observable testData = null;
  @observable syncData = null;
  @observable isLoading = true;
  @observable isConnectLoading = true;
  @observable isShowResult = false;
  @observable confirmLoading = false;
  @observable isSyncLoading = false;
  @observable syncRecord = []; // 同步记录
  @observable detailRecord = []; // 失败记录

  @action setIsLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setIsConnectLoading(flag) {
    this.isConnectLoading = flag;
  }

  @computed get getIsConnectLoading() {
    return this.isConnectLoading;
  }

  @action setIsSyncLoading(flag) {
    this.isSyncLoading = flag;
  }

  @computed get getIsSyncLoading() {
    return this.isSyncLoading;
  }

  @action setIsConfirmLoading(flag) {
    this.confirmLoading = flag;
  }

  @computed get getIsConfirmLoading() {
    return this.confirmLoading;
  }

  @action setIsShowResult(data) {
    this.isShowResult = data;
  }

  @computed get getIsShowResult() {
    return this.isShowResult;
  }

  @action setLDAPData(data) {
    this.ldapData = data;
  }

  @computed get getLDAPData() {
    return this.ldapData;
  }

  @action setTestData(data) {
    this.testData = data;
  }

  @computed get getTestData() {
    return this.testData;
  }

  @action setSyncData(data) {
    this.syncData = data;
  }

  @computed get getSyncData() {
    return this.syncData;
  }

  @action cleanData() {
    this.ldapData = {};
  }

  @action setSyncRecord(data) {
    this.syncRecord = data;
  }

  @computed get getSyncRecord() {
    return this.syncRecord;
  }

  @action setDetailRecord(data) {
    this.detailRecord = data;
  }

  @computed get getDetailRecord() {
    return this.detailRecord;
  }

  // 加载同步记录
  loadSyncRecord(
    { current, pageSize },
    { columnKey = 'id', order = 'descend' },
    organizationId, id) {
    const queryObj = {
      page: current,
      size: pageSize,
    };

    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
      queryObj.sort = sorter.join(',');
    }
    return axios.get(`/iam/v1/organizations/${organizationId}/ldaps/${id}/history?${querystring.stringify(queryObj)}`);
  }

  // 加载失败详情
  loadDetail(
    { current, pageSize },
    { uuid, loginName, realName, email },
    { columnKey = 'id', order = 'descend' },
    params, id) {
    const queryObj = {
      page: current,
      size: pageSize,
      uuid,
      loginName,
      realName,
      email,
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
    return axios.get(`/iam/v1/ldap_histories/${id}/error_users?${querystring.stringify(queryObj)}`);
  }

  loadLDAP = (organizationId) => {
    this.cleanData();
    this.setIsLoading(true);
    return axios.get(`/iam/v1/organizations/${organizationId}/ldaps`).then((data) => {
      if (data) {
        this.setLDAPData(data);
      }
      this.setIsLoading(false);
    });
  };

  loadOrganization(organizationId) {
    this.setIsLoading(true);
    axios.get(`/uaa/v1/organizations/${organizationId}`).then((data) => {
      if (data) {
        this.setOrganization(data);
      }
      this.setIsLoading(false);
    });
  }

  updateLDAP = (organizationId, id, ldap) =>
    axios.post(`/iam/v1/organizations/${organizationId}/ldaps/${id}`, JSON.stringify(ldap));

  testConnect = (organizationId, id, ldap) =>
    axios.post(`/iam/v1/organizations/${organizationId}/ldaps/${id}/test_connect`, JSON.stringify(ldap));

  getSyncInfo = (organizationId, id) =>
    axios.get(`/iam/v1/organizations/${organizationId}/ldaps/${id}/latest_history`);

  SyncUsers = (organizationId, id) =>
    axios.post(`/iam/v1/organizations/${organizationId}/ldaps/${id}/sync_users`);

  enabledLdap = (organizationId, id) =>
    axios.put(`/iam/v1/organizations/${organizationId}/ldaps/${id}/enable`);

  disabledLdap = (organizationId, id) =>
    axios.put(`/iam/v1/organizations/${organizationId}/ldaps/${id}/disable`);
}

const ldapStore = new LDAPStore();

export default ldapStore;

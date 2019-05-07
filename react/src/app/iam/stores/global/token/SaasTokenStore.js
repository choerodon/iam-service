/**
 * Created by hand on 2017/7/18.
 */

import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('SaasTokenStore')
class SaasTokenStore {
  @observable SaasTokenData = [];
  @observable totalSize;
  @observable totalPage;
  @observable isLoading = true;
  @observable permission = false;
  @observable allData;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setSaasTokenData(data) {
    this.SaasTokenData = data;
  }

  @action setPermission(flag) {
    this.permission = flag;
  }

  @computed get getTokenData() {
    return this.SaasTokenData.slice();
  }

  @action setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @computed get getTotalSize() {
    return this.totalSize;
  }

  @action setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  @computed get getTotalPage() {
    return this.totalPage;
  }

  @action changeLoading(flag) {
    this.isLoading = flag;
  }

  @action setAllData(data) {
    this.allData = data;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  getPermession(data) {
    axios.post('/v1/testPermission', JSON.stringify(data))
      .then((datas) => {
        if (datas) {
          this.setPermission(datas[0].approve);
        }
      });
  }

  loadSaasToken(page, size, state) {
    this.changeLoading(true);
    if (state.code === '') {
      axios.get(`uaa/v1/tokens/querySelf?page=${page}&size=${size}&param=${state.input}`).then((data) => {
        if (data) {
          this.setSaasTokenData(data.list);
          this.setTotalPage(data.totalPages);
          this.setTotalSize(data.total);
          this.changeLoading(false);
        }
      });
    } else {
      axios.get(`uaa/v1/tokens/querySelf?page=${page}&size=${size}&${state.code}=${state.input}`).then((data) => {
        if (data) {
          this.setSaasTokenData(data.list);
          this.setTotalPage(data.totalPages);
          this.setTotalSize(data.total);
          this.changeLoading(false);
        }
      });
    }
  }

  querySaasToken = (state) => {
    if (state.code === '') {
      axios.get(`/uaa/v1/tokens/querySelf?param=${state.input}&pag1=0&size=10`).then((data) => {
        this.setSaasTokenData(data.list);
      });
    } else {
      axios.get(`uaa/v1/tokens/querySelf?${state.code}=${state.input}&page=1&size=10`).then((data) => {
        this.setSaasTokenData(data.list);
      });
    }
  }

  queryDatas([page, size], value) {
    let url = '';
    if (typeof value === 'string') {
      url = `&param=${value}`;
    } else if (typeof value === 'object') {
      for (let i = 0; i < value.length; i += 1) {
        url += `&${value[i].key}=${value[i].values}`;
      }
    }
    this.changeLoading(true);
    axios.get(`/uaa/v1/tokens/querySelf?${page}&size=${size}${url}`)
      .then((data) => {
        if (data) {
          this.setSaasTokenData(data.list);
          this.setTotalPage(data.totalPages);
          this.setTotalSize(data.total);
          this.changeLoading(false);
        }
      });
  }

  loadAllSaasToken() {
    axios.get('uaa/v1/tokens/querySelf?page=1&size=999').then((data) => {
      if (data) {
        this.setAllData(data.list);
      }
    });
  }

  createSaasToken(data) {
    return axios.post('/uaa/v1/tokens', JSON.stringify(data));
  }
  deleteSaasToken(name) {
    return axios.delete(`uaa/v1/tokens/deleteSelf/${name}`);
  }
}

const saasTokenStore = new SaasTokenStore();

export default saasTokenStore;

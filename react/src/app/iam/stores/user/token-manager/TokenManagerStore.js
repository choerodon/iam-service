import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';

@store('TokenManagerStore')
class TokenManagerStore {
  @observable tokenData = [];
  @observable loading = false;
  @observable pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  @observable params = [];

  @observable filters = {
    expire: [],
  };

  @observable selectedRowKeys = [];

  @action
  setSelectedRowKeys(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys;
  }


  refresh(token) {
    this.loadData(token, { current: 1, pageSize: 10 }, []);
  }

  deleteTokenById(tokenId, token) {
    return axios.delete(`/iam/v1/token?tokenId=${tokenId}&currentToken=${token}`);
  }

  batchDelete(arrTokenIds, token) {
    return axios.delete(`/iam/v1/token/batch?currentToken=${token}`, { data: arrTokenIds });
  }

  @action
  loadData(currentToken, pagination = this.pagination, params = this.params, filters = this.filters) {
    this.loading = true;
    this.params = params;
    return axios.get(`/iam/v1/token?${queryString.stringify({
      currentToken,
      page: pagination.current,
      size: pagination.pageSize,
      params: params.join(','),
    })}`)
      .then(action(({ failed, list, total }) => {
        if (!failed) {
          this.tokenData = list;
          this.pagination = {
            ...pagination,
            total,
          };
        }
        this.loading = false;
      }))
      .catch(action((error) => {
        Choerodon.handleResponseError(error);
        this.loading = false;
      }));
  }
}

export default new TokenManagerStore();

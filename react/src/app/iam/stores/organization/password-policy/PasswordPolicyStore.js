import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('PasswordPolicyStore')
class PasswordPolicyStore {
  @observable _passwordPolicy = null;
  @observable isLoading = true;

  @action setIsLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setPasswordPolicy(data) {
    this._passwordPolicy = data;
  }

  @computed get passwordPolicy() {
    return this._passwordPolicy;
  }

  @action cleanData() {
    this._passwordPolicy = {};
  }

  @action setPasswordChange(change) {
    this.passwordChange = change;
  }

  @computed get getPasswordChange() {
    return this.passwordChange;
  }

  @action setLoginChange(change) {
    this.passwordChange = change;
  }

  @computed get getLoginChange() {
    return this.passwordChange;
  }

  loadData(organizationId) {
    return axios.get(
      `/iam/v1/organizations/${organizationId}/password_policies`
    );
  }

  updatePasswordPolicy = (orgId, id, data) =>
    axios.post(
      `/iam/v1/organizations/${orgId}/password_policies/${id}`,
      JSON.stringify(data)
    );
}

const passwordPolicyStore = new PasswordPolicyStore();

export default passwordPolicyStore;

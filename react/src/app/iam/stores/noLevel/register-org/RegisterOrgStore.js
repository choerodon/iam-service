import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const newConfig = config;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
    const accessToken = Choerodon.getAccessToken();
    if (accessToken) {
      newConfig.headers.Authorization = accessToken;
    }
    return newConfig;
  },
  (err) => {
    const error = err;
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(res => res.data,
  (error) => {
    window.console.log(error);
  });

@store('RegisterOrgStore')
class RegisterOrgStore {
  checkCode = value => instance.post('/org/v1/organizations/check', JSON.stringify({ code: value }));

  checkLoginname = loginName => instance.post('/iam/v1/users/check', JSON.stringify({ loginName }));

  checkEmailAddress = email => instance.post('/iam/v1/users/check', JSON.stringify({ email }));

  sendCaptcha = email => instance.get(`/org/v1/organizations/send/email_captcha?email=${email}`);

  registerOrg = body => instance.post('/org/v1/organizations/register', JSON.stringify(body));

  submitAccount = (email, captcha) => instance.post(`/org/v1/organizations/check/email_captcha?email=${email}&captcha=${captcha}`);
}

const registerOrgStore = new RegisterOrgStore();

export default registerOrgStore;

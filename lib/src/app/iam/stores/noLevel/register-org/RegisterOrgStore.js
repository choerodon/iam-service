'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _dec, _class;

var _mobx = require('mobx');

var _choerodonBootCombine = require('choerodon-boot-combine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var instance = _choerodonBootCombine.axios.create();

instance.interceptors.request.use(function (config) {
  var newConfig = config;
  newConfig.headers['Content-Type'] = 'application/json';
  newConfig.headers.Accept = 'application/json';
  var accessToken = Choerodon.getAccessToken();
  if (accessToken) {
    newConfig.headers.Authorization = accessToken;
  }
  return newConfig;
}, function (err) {
  var error = err;
  return Promise.reject(error);
});

instance.interceptors.response.use(function (res) {
  return res.data;
}, function (error) {
  window.console.log(error);
});

var RegisterOrgStore = (_dec = (0, _choerodonBootCombine.store)('RegisterOrgStore'), _dec(_class = function RegisterOrgStore() {
  (0, _classCallCheck3['default'])(this, RegisterOrgStore);

  this.checkCode = function (value) {
    return instance.post('/org/v1/organizations/check', JSON.stringify({ code: value }));
  };

  this.checkLoginname = function (loginName) {
    return instance.post('/iam/v1/users/check', JSON.stringify({ loginName: loginName }));
  };

  this.checkEmailAddress = function (email) {
    return instance.post('/iam/v1/users/check', JSON.stringify({ email: email }));
  };

  this.sendCaptcha = function (email) {
    return instance.get('/org/v1/organizations/send/email_captcha?email=' + email);
  };

  this.registerOrg = function (body) {
    return instance.post('/org/v1/organizations/register', JSON.stringify(body));
  };

  this.submitAccount = function (email, captcha) {
    return instance.post('/org/v1/organizations/check/email_captcha?email=' + email + '&captcha=' + captcha);
  };
}) || _class);


var registerOrgStore = new RegisterOrgStore();

exports['default'] = registerOrgStore;
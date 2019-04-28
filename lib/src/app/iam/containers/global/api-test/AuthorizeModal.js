'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class; /* eslint-disable */
/* the encode function is no necessary to lint */


require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _apiTest = require('../../../stores/global/api-test');

var _apiTest2 = _interopRequireDefault(_apiTest);

require('./APITest.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'global.apitest';
var FormItem = _form2['default'].Item;
var instance = _choerodonBootCombine.axios.create();
var getInfoinstance = _choerodonBootCombine.axios.create();

var keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  }
};

getInfoinstance.interceptors.request.use(function (config) {
  var newConfig = config;
  newConfig.headers['Content-Type'] = 'application/json';
  newConfig.headers.Accept = 'application/json';
  var accessToken = _apiTest2['default'].getApiToken;
  newConfig.headers.Authorization = accessToken;
  return newConfig;
}, function (err) {
  var error = err;
  return Promise.reject(error);
});

instance.interceptors.response.use(function (res) {
  if (res.status === 200) {
    _apiTest2['default'].setApiToken(res.data.token_type + ' ' + res.data.access_token);
    _apiTest2['default'].setIsShowResult(null);
    getInfoinstance.get('iam/v1/users/self').then(function (info) {
      _apiTest2['default'].setUserInfo('' + info.data.loginName + info.data.realName);
      Choerodon.prompt('授权成功');
    });
    _apiTest2['default'].setIsShowModal(false);
    _apiTest2['default'].setModalSaving(false);
  }
}, function (error) {
  Choerodon.prompt('授权失败');
  _apiTest2['default'].setModalSaving(false);
});

var AuthorizeModal = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(AuthorizeModal, _Component);

  function AuthorizeModal() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, AuthorizeModal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AuthorizeModal.__proto__ || Object.getPrototypeOf(AuthorizeModal)).call.apply(_ref, [this].concat(args))), _this), _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.props.form.validateFields(function (err, values) {
        if (!err) {
          var password = _this.encode(values.password);
          var queryObj = {
            username: values.account,
            password: password,
            client_id: 'client',
            grant_type: 'password',
            client_secret: 'secret'
          };
          _apiTest2['default'].setModalSaving(true);
          instance.post('oauth/oauth/token?' + _queryString2['default'].stringify(queryObj));
        }
      });
    }, _this.encode = function (password) {
      var output = "";
      var chr1,
          chr2,
          chr3 = "";
      var enc1,
          enc2,
          enc3,
          enc4 = "";
      var i = 0;
      do {
        chr1 = password.charCodeAt(i++);
        chr2 = password.charCodeAt(i++);
        chr3 = password.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < password.length);
      return output;
    }, _this.handleCancel = function () {
      _apiTest2['default'].setIsShowModal(false);
    }, _this.submitBtnRef = function (node) {
      if (node) {
        _this.submitBtnRef = node;
      }
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(AuthorizeModal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.onRef(this);
    }

    /**
     * 密码加密
     * @param password
     * @returns {string|string}
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          intl = _props.intl,
          form = _props.form,
          AppState = _props.AppState;
      var getFieldDecorator = form.getFieldDecorator;

      var siteInfo = AppState.getSiteInfo;
      var inputWidth = '370px';
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-apitest-modal' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-apitest-modal-icon-content' },
          _react2['default'].createElement('div', { className: (0, _classnames2['default'])('c7n-apitest-modal-icon', !siteInfo.favicon ? 'c7n-apitest-modal-default-icon' : null),
            style: { backgroundImage: siteInfo.favicon ? 'url(' + siteInfo.favicon + ')' : null } }),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-apitest-modal-icon-title' },
            siteInfo.systemName ? siteInfo.systemName : 'Choerodon'
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-apitest-modal-title' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.authorize.title' })
        ),
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical', onSubmit: this.handleSubmit },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('account', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.account.required' })
              }]
            })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.authorize.account' }), style: { width: inputWidth }, autoComplete: 'off' }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('password', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.pwd.required' })
              }]
            })(_react2['default'].createElement(_input2['default'], { label: intl.formatMessage({ id: intlPrefix + '.authorize.password' }), type: 'password', style: { width: inputWidth }, autoComplete: 'off' }))
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-apitest-modal-btn-group' },
            _react2['default'].createElement(
              _button2['default'],
              { funcType: 'flat', onClick: this.handleCancel, style: { color: '#3F51B5' }, disabled: _apiTest2['default'].modalSaving },
              '\u53D6\u6D88\u6388\u6743'
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                funcType: 'raised',
                type: 'primary',
                htmlType: 'submit',
                loading: _apiTest2['default'].modalSaving,
                ref: this.submitBtnRef
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.authorize' })
            )
          )
        )
      );
    }
  }]);
  return AuthorizeModal;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = AuthorizeModal;
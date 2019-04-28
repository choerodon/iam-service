'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

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

var _dec, _dec2, _class;

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactDom = require('react-dom');

require('./PhoneWrapper.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormItem = _form2['default'].Item;
var intlPrefix = 'user.userinfo';

var PhoneWrapper = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(PhoneWrapper, _Component);

  function PhoneWrapper(props) {
    (0, _classCallCheck3['default'])(this, PhoneWrapper);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (PhoneWrapper.__proto__ || Object.getPrototypeOf(PhoneWrapper)).call(this, props));

    _this.enterEditing = function () {
      var _this$props = _this.props,
          internationalCode = _this$props.internationalCode,
          phone = _this$props.phone;

      _this.setState({
        editing: true,
        internationalCode: internationalCode,
        phone: phone
      });
    };

    _this.leaveEditing = function () {
      var resetFields = _this.props.form.resetFields;

      _this.setState({
        editing: false
      });
      resetFields();
    };

    _this.onSubmit = function () {
      _this.props.form.validateFields(function (err, values, modify) {
        if (!err) {
          if (!modify) {
            _this.setState({
              editing: false
            });
          } else {
            _this.props.onSubmit(values);
            _this.setState({
              editing: false
            });
          }
        }
      });
    };

    _this.checkCode = function (rule, value, callback) {
      var formatMessage = _this.props.intl.formatMessage;

      var pattern = /^[0-9]*$/;
      var validateFields = _this.props.form.validateFields;

      if (value) {
        if (pattern.test(value)) {
          if (value === '86') {
            validateFields(['phone'], { force: true });
          }
          callback();
        } else {
          callback(formatMessage({ id: intlPrefix + '.num.required' }));
        }
      } else {
        validateFields(['phone'], { force: true });
        callback();
      }
    };

    _this.checkPhone = function (rule, value, callback) {
      var _this$props2 = _this.props,
          formatMessage = _this$props2.intl.formatMessage,
          getFieldValue = _this$props2.form.getFieldValue;

      var code = getFieldValue('internationalTelCode');
      var pattern = /^[0-9]*$/;
      if (value) {
        if (pattern.test(value)) {
          if (code === '86') {
            pattern = /^1[3-9]\d{9}$/;
            if (pattern.test(value)) {
              callback();
            } else {
              callback(formatMessage({ id: intlPrefix + '.phone.district.rule' }));
            }
          } else {
            callback();
          }
        } else {
          callback(formatMessage({ id: intlPrefix + '.num.required' }));
        }
      } else if (code) {
        callback(formatMessage({ id: intlPrefix + '.phone.pattern.msg' }));
      } else {
        callback();
      }
    };

    _this.getInitialCode = function (initialPhone, initialCode) {
      var code = void 0;
      if (initialPhone && initialCode) {
        code = initialCode.split('+')[1];
      } else if (initialPhone && !initialCode) {
        code = '';
      } else if (!initialPhone && !initialCode) {
        code = '86';
      }
      return code;
    };

    _this.state = {
      editing: false,
      internationalCode: null,
      phone: null,
      submitting: false
    };
    return _this;
  }

  (0, _createClass3['default'])(PhoneWrapper, [{
    key: 'renderText',
    value: function renderText() {
      var _props = this.props,
          initialPhone = _props.initialPhone,
          initialCode = _props.initialCode;

      var textContent = void 0;
      if (initialPhone) {
        textContent = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            { style: { display: initialCode ? 'inline' : 'none' } },
            initialCode
          ),
          _react2['default'].createElement(
            'span',
            null,
            initialPhone
          )
        );
      } else {
        textContent = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            null,
            '\u65E0'
          )
        );
      }

      return textContent;
    }

    // 进入编辑状态


    // 取消编辑

  }, {
    key: 'render',
    value: function render() {
      var editing = this.state.editing;
      var _props2 = this.props,
          initialPhone = _props2.initialPhone,
          initialCode = _props2.initialCode,
          form = _props2.form;
      var getFieldDecorator = form.getFieldDecorator;

      return editing ? _react2['default'].createElement(
        _form2['default'],
        { layout: 'inline', className: 'c7n-iam-userinfo-phone-wrapper-edit' },
        _react2['default'].createElement(
          FormItem,
          {
            style: { marginRight: '4px' }
          },
          getFieldDecorator('internationalTelCode', {
            rules: [{
              validator: this.checkCode
            }],
            initialValue: this.getInitialCode(initialPhone, initialCode)
          })(_react2['default'].createElement(_input2['default'], {
            prefix: '+',
            autoComplete: 'off',
            style: { width: '65px' },
            minLength: 0,
            maxLength: 4,
            showLengthInfo: false
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          null,
          getFieldDecorator('phone', {
            rules: [{
              validator: this.checkPhone
            }],
            initialValue: initialPhone
          })(_react2['default'].createElement(_input2['default'], {
            autoComplete: 'off',
            style: { width: '220px' }
          }))
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-userinfo-phone-wrapper-edit-icon-container' },
          _react2['default'].createElement(_icon2['default'], { type: 'done', className: 'c7n-iam-userinfo-phone-wrapper-edit-icon', onClick: this.onSubmit }),
          _react2['default'].createElement(_icon2['default'], { type: 'close', className: 'c7n-iam-userinfo-phone-wrapper-edit-icon', onClick: this.leaveEditing })
        )
      ) : _react2['default'].createElement(
        'div',
        {
          className: 'c7n-iam-userinfo-phone-wrapper-text c7n-iam-userinfo-phone-wrapper-text-active',
          onClick: this.enterEditing
        },
        this.renderText(),
        _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-iam-userinfo-phone-wrapper-text-icon' })
      );
    }
  }]);
  return PhoneWrapper;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = PhoneWrapper;
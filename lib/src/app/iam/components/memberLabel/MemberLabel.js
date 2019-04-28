'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

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

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./MemberLabel.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormItem = _form2['default'].Item;
var FormItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

var MemberLabel = function (_Component) {
  (0, _inherits3['default'])(MemberLabel, _Component);

  function MemberLabel(props, context) {
    (0, _classCallCheck3['default'])(this, MemberLabel);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (MemberLabel.__proto__ || Object.getPrototypeOf(MemberLabel)).call(this, props, context));

    _this.saveSelectRef = function (node) {
      if (node) {
        _this.rcSelect = node.rcSelect;
      }
    };

    _this.validateMember = function (rule, value, callback) {
      var intl = _this.props.intl;

      var length = value && value.length;
      if (length) {
        var validedMembers = _this.state.validedMembers;

        var errorMsg = void 0;
        Promise.all(value.map(function (item, index) {
          if (item in validedMembers && index !== length - 1) {
            return Promise.resolve(validedMembers[item]);
          } else {
            return new Promise(function (resolve) {
              if (!item.trim()) {
                errorMsg = intl.formatMessage({ id: 'memberlabel.member.notexist.msg' });
                resolve(false);
              }
              _this.searchMemberId(item).then(function (_ref) {
                var failed = _ref.failed,
                    enabled = _ref.enabled;

                var success = true;
                if (enabled === false) {
                  errorMsg = intl.formatMessage({ id: 'memberlabel.member.disabled.msg' });
                  success = false;
                } else if (failed) {
                  errorMsg = intl.formatMessage({ id: 'memberlabel.member.notexist.msg' });
                  success = false;
                }
                resolve(success);
              })['catch'](function (error) {
                errorMsg = error;
                resolve(false);
              });
            }).then(function (valid) {
              validedMembers[item] = valid;
              return valid;
            });
          }
        })).then(function (all) {
          return callback(all.every(function (item) {
            return item;
          }) ? undefined : errorMsg);
        });
      } else {
        callback(intl.formatMessage({ id: 'memberlabel.member.require.msg' }));
      }
    };

    _this.handleInputKeyDown = function (e) {
      var value = e.target.value;

      if (e.keyCode === 13 && !e.isDefaultPrevented() && value) {
        _this.setMembersInSelect(value);
      }
    };

    _this.handleChoiceRender = function (liNode, value) {
      var validedMembers = _this.state.validedMembers;

      return _react2['default'].cloneElement(liNode, {
        className: (0, _classnames2['default'])(liNode.props.className, {
          'choice-has-error': value in validedMembers && !validedMembers[value]
        })
      });
    };

    _this.handleChoiceRemove = function (value) {
      var validedMembers = _this.state.validedMembers;

      if (value in validedMembers) {
        delete validedMembers[value];
      }
    };

    _this.state = {
      validedMembers: {}
    };
    return _this;
  }

  (0, _createClass3['default'])(MemberLabel, [{
    key: 'searchMemberId',
    value: function searchMemberId(loginName) {
      return _choerodonBootCombine.axios.get('/iam/v1/users?login_name=' + loginName);
    }
  }, {
    key: 'setMembersInSelect',
    value: function setMembersInSelect(member) {
      var _props$form = this.props.form,
          getFieldValue = _props$form.getFieldValue,
          setFieldsValue = _props$form.setFieldsValue,
          validateFields = _props$form.validateFields;

      var members = getFieldValue('member') || [];
      if (members.indexOf(member) === -1) {
        members.push(member);
        setFieldsValue({
          member: members
        });
        validateFields(['member']);
      }
      if (this.rcSelect) {
        this.rcSelect.setState({
          inputValue: ''
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          style = _props.style,
          className = _props.className,
          form = _props.form,
          value = _props.value,
          label = _props.label;
      var getFieldDecorator = form.getFieldDecorator;

      setTimeout(function () {
        _this2.rcSelect.focus();
      }, 10);
      return _react2['default'].createElement(
        FormItem,
        (0, _extends3['default'])({}, FormItemNumLayout, {
          className: className,
          style: style
        }),
        getFieldDecorator('member', {
          rules: [{
            required: true,
            validator: this.validateMember
          }],
          validateTrigger: 'onChange',
          initialValue: value
        })(_react2['default'].createElement(_select2['default'], {
          mode: 'tags',
          ref: this.saveSelectRef,
          style: { width: 512 },
          filterOption: false,
          label: label,
          onChoiceRemove: this.handleChoiceRemove,
          onInputKeyDown: this.handleInputKeyDown,
          notFoundContent: false,
          showNotFindSelectedItem: false,
          showNotFindInputItem: false,
          choiceRender: this.handleChoiceRender,
          allowClear: true
        }))
      );
    }
  }]);
  return MemberLabel;
}(_react.Component);

exports['default'] = (0, _reactIntl.injectIntl)(MemberLabel);
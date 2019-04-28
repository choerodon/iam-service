'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class;

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _inmailTemplate = require('../../../stores/global/inmail-template');

var _inmailTemplate2 = _interopRequireDefault(_inmailTemplate);

require('./InMailTemplate.scss');

var _editor = require('../../../components/editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;

var MailTemplateType = function MailTemplateType(context) {
  (0, _classCallCheck3['default'])(this, MailTemplateType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = type === 'organization' ? 'organization' : 'global';
  this.code = codePrefix + '.inmailtemplate';
  this.values = { name: name || 'Choerodon' };
  this.type = type;
  this.orgId = id;
  this.orgName = name;
};

var InMailTemplateCreate = (_dec = _form2['default'].create(), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(InMailTemplateCreate, _Component);

  function InMailTemplateCreate() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, InMailTemplateCreate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = InMailTemplateCreate.__proto__ || Object.getPrototypeOf(InMailTemplateCreate)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.loadTemplateType = function () {
      _inmailTemplate2['default'].loadTemplateType(_this.mail.type, _this.mail.orgId).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _inmailTemplate2['default'].setTemplateType(data);
        }
      });
    }, _this.checkCode = function (rule, value, callback) {
      var intl = _this.props.intl;

      _choerodonBootCombine.axios.post('notify/v1/notices/letters/templates/check', value).then(function (mes) {
        if (mes.failed) {
          callback(intl.formatMessage({ id: 'inmailtemplate.code.exist' }));
        } else {
          callback();
        }
      });
    }, _this.handleSubmit = function (e) {
      e.preventDefault();
      var intl = _this.props.intl;

      _this.props.form.validateFieldsAndScroll(function (err, values) {
        if (!err) {
          var pattern = /^((<[^(>|img)]+>)*\s*)*$/g;
          // 判断富文本编辑器是否为空
          if (_this.state.editorContent && !pattern.test(_this.state.editorContent)) {
            _this.setState({
              isSubmitting: true
            });
            _this.handleSave(values);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'inmailtemplate.mailcontent.required' }));
          }
        }
      });
    }, _this.handleSave = function (values) {
      var intl = _this.props.intl;
      var _this$mail = _this.mail,
          type = _this$mail.type,
          orgId = _this$mail.orgId;

      var body = (0, _extends3['default'])({}, values, {
        content: _this.state.editorContent,
        isPredefined: true
      });
      _inmailTemplate2['default'].createTemplate(body, type, orgId).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
          _this.goBack();
        }
        _this.setState({
          isSubmitting: false
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this.setState({
          isSubmitting: false
        });
      });
    }, _this.goBack = function () {
      _this.props.history.push('/iam/inmail-template');
    }, _this.renderContent = function () {
      var intl = _this.props.intl;

      var selectType = _inmailTemplate2['default'].selectType;
      var getFieldDecorator = _this.props.form.getFieldDecorator;
      var isSubmitting = _this.state.isSubmitting;

      var inputWidth = 512;
      var tip = _react2['default'].createElement(
        'div',
        { className: 'c7n-mailcontent-icon-container-tip' },
        _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'mailtemplate.mailcontent.tip' }),
        _react2['default'].createElement(
          'a',
          { href: intl.formatMessage({ id: 'mailtemplate.mailcontent.tip.link' }), target: '_blank' },
          _react2['default'].createElement(
            'span',
            null,
            intl.formatMessage({ id: 'learnmore' })
          ),
          _react2['default'].createElement(_icon2['default'], { type: 'open_in_new', style: { fontSize: '13px' } })
        )
      );

      var formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      };
      return _react2['default'].createElement(
        _form2['default'],
        { className: 'c7n-mailtemplate-create-form' },
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('code', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: 'inmailtemplate.code.required' })
            }, {
              validator: _this.checkCode
            }],
            validateTrigger: 'onBlur',
            validateFirst: true
          })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', style: { width: inputWidth }, label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.code' }) }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: 'inmailtemplate.name.required' })
            }]
          })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', style: { width: inputWidth }, label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.name' }) }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('type', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: 'inmailtemplate.type.required' })
            }],
            initialValue: _inmailTemplate2['default'].getCurrentDetail.type || undefined
          })(_react2['default'].createElement(
            _select2['default'],
            {
              getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('page-content')[0];
              },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.table.mailtype' }),
              style: { width: inputWidth },
              disabled: selectType !== 'create'
            },
            _inmailTemplate2['default'].templateType.length && _inmailTemplate2['default'].templateType.map(function (_ref2) {
              var name = _ref2.name,
                  id = _ref2.id,
                  code = _ref2.code;
              return _react2['default'].createElement(
                Option,
                { key: id, value: code },
                name
              );
            })
          ))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('title', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: 'inmailtemplate.title.required' })
            }],
            initialValue: _inmailTemplate2['default'].getCurrentDetail.title || undefined
          })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', style: { width: inputWidth }, label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.title' }) }))
        ),
        _react2['default'].createElement(
          'div',
          { style: { marginBottom: '8px' } },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-mailcontent-icon-container' },
            _react2['default'].createElement(
              'span',
              { className: 'c7n-mailcontent-label' },
              intl.formatMessage({ id: 'inmailtemplate.mail.content' })
            ),
            _react2['default'].createElement(
              _popover2['default'],
              {
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('page-content')[0];
                },
                placement: 'right',
                trigger: 'hover',
                content: tip,
                overlayStyle: { maxWidth: '380px' }
              },
              _react2['default'].createElement(_icon2['default'], { type: 'help' })
            )
          ),
          _react2['default'].createElement(_editor2['default'], {
            value: _this.state.editorContent,
            onRef: function onRef(node) {
              _this.editor = node;
            },
            onChange: function onChange(value) {
              _this.setState({
                editorContent: value
              });
            }
          })
        ),
        _react2['default'].createElement('div', { className: 'divider' }),
        _react2['default'].createElement(
          'div',
          { className: 'btn-group' },
          _react2['default'].createElement(
            _button2['default'],
            {
              funcType: 'raised',
              type: 'primary',
              loading: isSubmitting,
              onClick: _this.handleSubmit
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              funcType: 'raised',
              onClick: _this.goBack,
              disabled: isSubmitting,
              style: { color: '#3F51B5' }
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
          )
        )
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(InMailTemplateCreate, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initMailTemplate();
      if (!_inmailTemplate2['default'].getTemplateType.length) {
        this.loadTemplateType();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (_inmailTemplate2['default'].getCurrentDetail.content) {
        this.setState({
          editorContent: _inmailTemplate2['default'].getCurrentDetail.content
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _inmailTemplate2['default'].setSelectType('create');
      _inmailTemplate2['default'].setCurrentDetail({});
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        editorContent: null
      };
    }
  }, {
    key: 'initMailTemplate',
    value: function initMailTemplate() {
      this.mail = new MailTemplateType(this);
    }

    /**
     * 模板编码校验
     * @param rule 表单校验规则
     * @param value 模板编码
     * @param callback 回调函数
     */

  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        null,
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'inmailtemplate.create' }),
          backPath: '/iam/inmail-template'
        }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: this.mail.code + '.create',
            values: this.mail.values
          },
          this.renderContent()
        )
      );
    }
  }]);
  return InMailTemplateCreate;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = InMailTemplateCreate;
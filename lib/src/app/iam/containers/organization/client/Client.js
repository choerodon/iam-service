'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _inputNumber = require('choerodon-ui/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/input-number/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _index = require('../../../components/loadingBar/index');

var _index2 = _interopRequireDefault(_index);

var _ClientStore = require('../../../stores/organization/client/ClientStore');

var _ClientStore2 = _interopRequireDefault(_ClientStore);

require('./Client.scss');

require('../../../common/ConfirmModal.scss');

var _util = require('../../../common/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sidebar = _modal2['default'].Sidebar;

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;
var TextArea = _input2['default'].TextArea;

var intlPrefix = 'organization.client';
var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};
var formItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

var Client = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Client, _Component);

  function Client(props) {
    (0, _classCallCheck3['default'])(this, Client);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this, props));

    _this.state = _this.getInitState();

    _this.handleRefresh = function () {
      _this.setState(_this.getInitState(), function () {
        _this.loadClient();
      });
    };

    _this.getSidebarContentInfo = function () {
      var menuType = _this.props.AppState.currentMenuType;
      var organizationName = menuType.name;
      var client = _ClientStore2['default'].getClient;
      var status = _this.state.status;

      switch (status) {
        case 'create':
          return {
            code: intlPrefix + '.create',
            values: {
              name: organizationName
            }
          };
        case 'edit':
          return {
            code: intlPrefix + '.modify',
            values: {
              name: client && client.name
            }
          };
        default:
          return {};
      }
    };

    _this.loadClient = function (paginationIn, sortIn, filtersIn, paramsIn) {
      var AppState = _this.props.AppState;
      var _this$state = _this.state,
          paginationState = _this$state.pagination,
          sortState = _this$state.sort,
          filtersState = _this$state.filters,
          paramsState = _this$state.params;
      var organizationId = AppState.currentMenuType.id;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var filters = filtersIn || filtersState;
      var params = paramsIn || paramsState;
      // 防止标签闪烁
      _this.setState({ filters: filters });
      // 若params或filters含特殊字符表格数据置空
      var isIncludeSpecialCode = (0, _util.handleFiltersParams)(params, filters);
      if (isIncludeSpecialCode) {
        _ClientStore2['default'].setClients([]);
        _this.setState({
          pagination: {
            total: 0
          },
          sort: sort,
          params: params
        });
        _ClientStore2['default'].changeLoading(false);
        return;
      }

      _ClientStore2['default'].loadClients(organizationId, pagination, sort, filters, params).then(function (data) {
        _ClientStore2['default'].setClients(data.content);
        _this.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          sort: sort,
          params: params
        });
        _ClientStore2['default'].changeLoading(false);
      });
    };

    _this.handlePageChange = function (pagination, filters, sorter, params) {
      _this.loadClient(pagination, sorter, filters, params);
    };

    _this.handleDelete = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.title' }),
        content: intl.formatMessage({ id: intlPrefix + '.delete.content' }, { name: record.name }),
        onOk: function onOk() {
          return _ClientStore2['default'].deleteClientById(record.organizationId, record.id).then(function (status) {
            if (status) {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.loadClient();
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
            }
          })['catch'](function () {
            Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
          });
        }
      });
    };

    _this.openSidebar = function (status) {
      var record = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var resetFields = _this.props.form.resetFields;

      resetFields();
      _ClientStore2['default'].setClientById([]);
      if (record.organizationId && record.id) {
        _ClientStore2['default'].getClientById(record.organizationId, record.id).subscribe(function (data) {
          _ClientStore2['default'].setClientById(data);
          _this.setState({
            status: status,
            visible: true,
            selectData: record
          });
        });
        setTimeout(function () {
          _this.editFocusInput.input.focus();
        }, 100);
      } else {
        var AppState = _this.props.AppState;

        _ClientStore2['default'].getCreateClientInitValue(AppState.currentMenuType.id).then(function (_ref) {
          var name = _ref.name,
              secret = _ref.secret;

          _this.setState({
            initName: name,
            initSecret: secret,
            status: status,
            visible: true
          });
        });
      }
    };

    _this.closeSidebar = function () {
      _this.setState({
        visible: false,
        submitting: false
      });
    };

    _this.checkName = function (rule, value, callback) {
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          intl = _this$props.intl;

      var menuType = AppState.currentMenuType;
      var organizationId = menuType.id;
      _ClientStore2['default'].checkName(organizationId, {
        name: value
      }).then(function (mes) {
        if (mes.failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.name.exist.msg' }));
        } else {
          callback();
        }
      });
    };

    _this.isJson = function (string) {
      try {
        if ((0, _typeof3['default'])(JSON.parse(string)) === 'object') {
          return true;
        }
      } catch (e) {
        return false;
      }
    };

    _this.saveSelectRef = function (node, name) {
      if (node) {
        _this[name] = node.rcSelect;
      }
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      var _this$props2 = _this.props,
          form = _this$props2.form,
          AppState = _this$props2.AppState,
          intl = _this$props2.intl;
      var _this$state2 = _this.state,
          status = _this$state2.status,
          selectData = _this$state2.selectData;

      form.validateFieldsAndScroll(function (err, data, modify) {
        Object.keys(data).forEach(function (key) {
          // 去除form提交的数据中的全部前后空格
          if (typeof data[key] === 'string') data[key] = data[key].trim();
        });
        if (!err) {
          var organizationId = AppState.currentMenuType.id;
          var dataType = data;
          if (dataType.authorizedGrantTypes) {
            dataType.authorizedGrantTypes = dataType.authorizedGrantTypes.join(',');
          }
          if (status === 'create') {
            dataType.organizationId = organizationId;
            _this.setState({
              submitting: true
            });
            _ClientStore2['default'].createClient(organizationId, (0, _extends3['default'])({}, dataType)).then(function (value) {
              if (value.failed) {
                Choerodon.prompt(value.message);
                _this.setState({
                  submitting: false
                });
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                _this.closeSidebar();
                _this.handleRefresh();
              }
            })['catch'](function () {
              Choerodon.prompt(intl.formatMessage({ id: 'create.error' }));
              _this.setState({
                submitting: false
              });
            });
          } else if (status === 'edit') {
            if (!modify) {
              Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
              _this.closeSidebar();
              return;
            }
            if (dataType.scope) {
              dataType.scope = dataType.scope.join(',');
            }
            if (dataType.autoApprove) {
              dataType.autoApprove = dataType.autoApprove.join(',');
            }
            var client = _ClientStore2['default'].getClient;
            _this.setState({
              submitting: true
            });
            if (dataType.additionalInformation === '') {
              dataType.additionalInformation = undefined;
            }

            var body = (0, _extends3['default'])({}, data, {
              authorizedGrantTypes: dataType.authorizedGrantTypes,
              objectVersionNumber: client.objectVersionNumber,
              organizationId: organizationId
            });

            _ClientStore2['default'].updateClient(selectData.organizationId, body, selectData.id).then(function (value) {
              if (value.failed) {
                Choerodon.prompt(value.message);
                _this.setState({
                  submitting: false
                });
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                _this.closeSidebar();
                _this.loadClient();
              }
            })['catch'](function () {
              _this.setState({
                submitting: false
              });
              Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
            });
          }
        }
      });
    };

    _this.handleChoiceRender = function (liNode, value) {
      var valid = /^[A-Za-z]+$/.test(value);
      return _react2['default'].cloneElement(liNode, {
        className: (0, _classnames2['default'])(liNode.props.className, {
          'choice-has-error': !valid
        })
      });
    };

    _this.handleInputKeyDown = function (e, name) {
      var value = e.target.value;

      if (e.keyCode === 13 && !e.isDefaultPrevented() && value) {
        _this.setValueInSelect(value, name);
      }
    };

    _this.validateSelect = function (rule, value, callback, name) {
      var intl = _this.props.intl;

      var length = value && value.length;
      if (length) {
        var reg = new RegExp(/^[A-Za-z]+$/);
        if (!reg.test(value[length - 1])) {
          callback(intl.formatMessage({ id: intlPrefix + '.' + name + '.pattern.msg' }));
          return;
        }
      }
      callback();
    };

    _this.editFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(Client, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        submitting: false,
        page: 0,
        open: false,
        id: null,
        params: [],
        filters: {},
        pagination: {
          current: 1,
          pageSize: 10,
          total: ''
        },
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        visible: false,
        status: '',
        selectData: {},
        initName: undefined, // 创建时客户端名称
        initSecret: undefined // 创建时客户端秘钥
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadClient();
    }
    /**
     * 加载客户端数据
     * @param pages 分页参数
     * @param state 当前search参数
     */


    /**
     * 分页加载数据
     * @param page
     * @returns {*}
     */


    /**
     * 删除客户端
     */


    /**
     * 校验客户端名称
     * @param rule
     * @param value
     * @param callback
     */

    /**
     * 编辑客户端form表单提交
     * @param e
     */

  }, {
    key: 'setValueInSelect',
    value: function setValueInSelect(value, name) {
      var _props$form = this.props.form,
          getFieldValue = _props$form.getFieldValue,
          setFieldsValue = _props$form.setFieldsValue;

      var values = getFieldValue(name) || [];
      if (values.length < 6 && values.indexOf(value) === -1) {
        values.push(value);
        this[name].fireChange(values);
      }
      if (this[name]) {
        this[name].setState({
          inputValue: ''
        });
      }
    }
  }, {
    key: 'getAuthorizedGrantTypes',
    value: function getAuthorizedGrantTypes() {
      var status = this.state.status;

      var client = _ClientStore2['default'].getClient || {};
      if (status === 'create') {
        return ['password', 'implicit', 'client_credentials', 'authorization_code', 'refresh_token'];
      } else {
        return client.authorizedGrantTypes ? client.authorizedGrantTypes.split(',') : [];
      }
    }
  }, {
    key: 'renderSidebarContent',
    value: function renderSidebarContent() {
      var _this2 = this;

      var intl = this.props.intl;

      var client = _ClientStore2['default'].getClient || {};
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var _state = this.state,
          status = _state.status,
          initName = _state.initName,
          initSecret = _state.initSecret;

      var mainContent = client ? _react2['default'].createElement(
        'div',
        { className: 'client-detail' },
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical', style: { width: 512 } },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              initialValue: status === 'create' ? initName : client.name,
              rules: status === 'create' ? [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.name.require.msg' })
              }, {
                pattern: /^[0-9a-zA-Z]+$/,
                message: intl.formatMessage({ id: intlPrefix + '.name.pattern.msg' })
              }, {
                max: 12,
                message: intl.formatMessage({ id: intlPrefix + '.name.pattern.msg' })
              }, {
                validator: status === 'create' && this.checkName
              }] : [],
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.name' }),
              disabled: status === 'edit',
              maxLength: 32,
              showLengthInfo: false
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('secret', {
              initialValue: status === 'create' ? initSecret : client.secret,
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.secret.require.msg' })
              }, {
                pattern: /^[0-9a-zA-Z]+$/,
                message: intl.formatMessage({ id: intlPrefix + '.secret.pattern.msg' })
              }, {
                min: 6,
                message: intl.formatMessage({ id: intlPrefix + '.secret.pattern.msg' })
              }, {
                max: 16,
                message: intl.formatMessage({ id: intlPrefix + '.secret.pattern.msg' })
              }],
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              autoComplete: 'off',
              type: 'password',
              label: intl.formatMessage({ id: intlPrefix + '.secret' }),
              ref: function ref(e) {
                _this2.editFocusInput = e;
              },
              showPasswordEye: true
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('authorizedGrantTypes', {
              initialValue: this.getAuthorizedGrantTypes(),
              rules: [{
                type: 'array',
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.granttypes.require.msg' })
              }]
            })(_react2['default'].createElement(
              _select2['default'],
              {
                mode: 'multiple',
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('sidebar-content')[0].parentNode;
                },
                label: intl.formatMessage({ id: intlPrefix + '.granttypes' }),
                size: 'default'
              },
              _react2['default'].createElement(
                Option,
                { value: 'password' },
                'password'
              ),
              _react2['default'].createElement(
                Option,
                { value: 'implicit' },
                'implicit'
              ),
              _react2['default'].createElement(
                Option,
                { value: 'client_credentials' },
                'client_credentials'
              ),
              _react2['default'].createElement(
                Option,
                { value: 'authorization_code' },
                'authorization_code'
              ),
              _react2['default'].createElement(
                Option,
                { value: 'refresh_token' },
                'refresh_token'
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemNumLayout,
            getFieldDecorator('accessTokenValidity', {
              initialValue: status === 'create' ? 3600 : client.accessTokenValidity ? parseInt(client.accessTokenValidity, 10) : undefined
            })(_react2['default'].createElement(_inputNumber2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.accesstokenvalidity' }),
              style: { width: 300 },
              size: 'default',
              min: 60
            })),
            _react2['default'].createElement(
              'span',
              { style: { position: 'absolute', bottom: '-10px', right: '-20px' } },
              intl.formatMessage({ id: 'second' })
            )
          ),
          _react2['default'].createElement(
            FormItem,
            formItemNumLayout,
            getFieldDecorator('refreshTokenValidity', {
              initialValue: status === 'create' ? 3600 : client.refreshTokenValidity ? parseInt(client.refreshTokenValidity, 10) : undefined
            })(_react2['default'].createElement(_inputNumber2['default'], {
              autoComplete: 'off',
              label: intl.formatMessage({ id: intlPrefix + '.tokenvalidity' }),
              style: { width: 300 },
              size: 'default',
              min: 60
            })),
            _react2['default'].createElement(
              'span',
              { style: { position: 'absolute', bottom: '-10px', right: '-20px' } },
              intl.formatMessage({ id: 'second' })
            )
          ),
          status === 'edit' && _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('scope', {
                rules: [{
                  validator: function validator(rule, value, callback) {
                    return _this2.validateSelect(rule, value, callback, 'scope');
                  }
                }],
                validateTrigger: 'onChange',
                initialValue: client.scope ? client.scope.split(',') : []
              })(_react2['default'].createElement(_select2['default'], {
                label: intl.formatMessage({ id: intlPrefix + '.scope' }),
                mode: 'tags',
                filterOption: false,
                onInputKeyDown: function onInputKeyDown(e) {
                  return _this2.handleInputKeyDown(e, 'scope');
                },
                ref: function ref(node) {
                  _this2.saveSelectRef(node, 'scope');
                },
                notFoundContent: false,
                showNotFindSelectedItem: false,
                showNotFindInputItem: false,
                choiceRender: this.handleChoiceRender,
                allowClear: false
              })),
              _react2['default'].createElement(
                _popover2['default'],
                {
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('sidebar-content')[0].parentNode;
                  },
                  overlayStyle: { maxWidth: '180px' },
                  placement: 'right',
                  trigger: 'hover',
                  content: intl.formatMessage({ id: intlPrefix + '.scope.help.msg' })
                },
                _react2['default'].createElement(_icon2['default'], { type: 'help', style: { position: 'absolute', bottom: '2px', right: '0', color: 'rgba(0, 0, 0, 0.26)' } })
              )
            ),
            _react2['default'].createElement(
              FormItem,
              formItemNumLayout,
              getFieldDecorator('autoApprove', {
                rules: [{
                  validator: function validator(rule, value, callback) {
                    return _this2.validateSelect(rule, value, callback, 'autoApprove');
                  }
                }],
                validateTrigger: 'onChange',
                initialValue: client.autoApprove ? client.autoApprove.split(',') : []
              })(_react2['default'].createElement(_select2['default'], {
                label: intl.formatMessage({ id: intlPrefix + '.autoApprove' }),
                mode: 'tags',
                filterOption: false,
                onInputKeyDown: function onInputKeyDown(e) {
                  return _this2.handleInputKeyDown(e, 'autoApprove');
                },
                ref: function ref(node) {
                  return _this2.saveSelectRef(node, 'autoApprove');
                },
                choiceRender: this.handleChoiceRender,
                notFoundContent: false,
                showNotFindSelectedItem: false,
                showNotFindInputItem: false,
                allowClear: false
              })),
              _react2['default'].createElement(
                _popover2['default'],
                {
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('sidebar-content')[0].parentNode;
                  },
                  overlayStyle: { maxWidth: '180px' },
                  placement: 'right',
                  trigger: 'hover',
                  content: intl.formatMessage({ id: intlPrefix + '.autoApprove.help.msg' })
                },
                _react2['default'].createElement(_icon2['default'], { type: 'help', style: { position: 'absolute', bottom: '2px', right: '0', color: 'rgba(0, 0, 0, 0.26)' } })
              )
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('webServerRedirectUri', {
                initialValue: client.webServerRedirectUri || undefined
              })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', label: intl.formatMessage({ id: intlPrefix + '.redirect' }) }))
            ),
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('additionalInformation', {
                rules: [{
                  validator: function validator(rule, value, callback) {
                    if (!value || _this2.isJson(value)) {
                      callback();
                    } else {
                      callback(intl.formatMessage({ id: intlPrefix + '.additional.pattern.msg' }));
                    }
                  }
                }],
                validateTrigger: 'onBlur',
                initialValue: client.additionalInformation || undefined
              })(_react2['default'].createElement(TextArea, {
                autoComplete: 'off',
                label: intl.formatMessage({ id: intlPrefix + '.additional' }),
                rows: 3
              }))
            )
          )
        )
      ) : _react2['default'].createElement(_index2['default'], null);
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          (0, _extends3['default'])({ className: 'sidebar-content' }, this.getSidebarContentInfo()),
          mainContent
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          AppState = _props.AppState,
          intl = _props.intl;
      var _state2 = this.state,
          submitting = _state2.submitting,
          status = _state2.status,
          pagination = _state2.pagination,
          visible = _state2.visible,
          filters = _state2.filters,
          params = _state2.params;

      var menuType = AppState.currentMenuType;
      var organizationName = menuType.name;
      var clientData = _ClientStore2['default'].getClients;
      var columns = [{
        title: intl.formatMessage({ id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        filters: [],
        filteredValue: filters.name || []
      }, {
        title: intl.formatMessage({ id: intlPrefix + '.granttypes' }),
        dataIndex: 'authorizedGrantTypes',
        key: 'authorizedGrantTypes',
        render: function render(text) {
          if (!text) {
            return '';
          }
          var grantTypes = text && text.split(',');
          return grantTypes.map(function (grantType) {
            return _react2['default'].createElement(
              'div',
              { key: grantType, className: 'client-granttype-item' },
              grantType
            );
          });
        }
      }, {
        title: '',
        width: 100,
        align: 'right',
        render: function render(text, record) {
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['iam-service.client.update']
              },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  onClick: function onClick() {
                    _this3.openSidebar('edit', record);
                  },
                  size: 'small',
                  shape: 'circle',
                  icon: 'mode_edit'
                })
              )
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              {
                service: ['iam-service.client.delete']
              },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  size: 'small',
                  onClick: _this3.handleDelete.bind(_this3, record),
                  icon: 'delete_forever'
                })
              )
            )
          );
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.client.create', 'iam-service.client.update', 'iam-service.client.delete', 'iam-service.client.list', 'iam-service.client.check', 'iam-service.client.queryByName', 'iam-service.client.query']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['iam-service.client.create']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: function onClick() {
                  return _this3.openSidebar('create');
                },
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.handleRefresh,
              icon: 'refresh'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix,
            values: { name: organizationName }
          },
          _react2['default'].createElement(_table2['default'], {
            size: 'middle',
            pagination: pagination,
            columns: columns,
            filters: params,
            dataSource: clientData,
            rowKey: 'id',
            onChange: this.handlePageChange,
            loading: _ClientStore2['default'].isLoading,
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: status === 'create' ? intlPrefix + '.create' : intlPrefix + '.modify' }),
              onOk: this.handleSubmit,
              onCancel: this.closeSidebar,
              visible: visible,
              okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: status === 'create' ? 'create' : 'save' }),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              confirmLoading: submitting
            },
            this.renderSidebarContent()
          )
        )
      );
    }
  }]);
  return Client;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Client;
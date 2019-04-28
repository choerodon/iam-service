'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

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

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _steps = require('choerodon-ui/lib/steps');

var _steps2 = _interopRequireDefault(_steps);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _dec, _class; /**
                   * Created by hulingfangzi on 2018/6/11.
                   */


require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/steps/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _reactIntl = require('react-intl');

var _yamlAce = require('../../../components/yamlAce');

var _yamlAce2 = _interopRequireDefault(_yamlAce);

require('./Configuration.scss');

var _configuration = require('../../../stores/global/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var confirm = _modal2['default'].confirm;
var Step = _steps2['default'].Step;

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;

var intlPrefix = 'global.configuration';

var CreateConfig = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(CreateConfig, _Component);

  function CreateConfig() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, CreateConfig);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = CreateConfig.__proto__ || Object.getPrototypeOf(CreateConfig)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.loadInitData = function () {
      _configuration2['default'].loadService().then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _configuration2['default'].setService(data || []);
        }
      });
    }, _this.handleChange = function (serviceName) {
      var intl = _this.props.intl;
      var _this$props$form = _this.props.form,
          setFieldsValue = _this$props$form.setFieldsValue,
          getFieldValue = _this$props$form.getFieldValue;

      var service = getFieldValue('service');
      if (service && _this.state.yamlData) {
        confirm({
          title: intl.formatMessage({ id: intlPrefix + '.service.modify.title' }),
          content: intl.formatMessage({ id: intlPrefix + '.service.modify.content' }),
          onOk: function onOk() {
            setFieldsValue({ template: undefined, version: undefined });
            _this.loadCurrentServiceConfig(serviceName);
          },
          onCancel: function onCancel() {
            setFieldsValue({ service: service });
          }
        });
      } else {
        setFieldsValue({ template: undefined, version: undefined });
        _this.loadCurrentServiceConfig(serviceName);
      }
    }, _this.checkVersion = function (rule, value, callback) {
      var intl = _this.props.intl;
      var getFieldValue = _this.props.form.getFieldValue;

      var serviceName = getFieldValue('service');
      var name = getFieldValue('template');
      var body = {
        configVersion: value,
        name: name,
        serviceName: serviceName
      };
      _configuration2['default'].versionCheck(body).then(function (data) {
        if (data.failed) {
          callback(intl.formatMessage({ id: 'global.configuration.version.only.msg' }));
        } else {
          callback();
        }
      });
    }, _this.getStatus = function (index) {
      var current = _this.state.current;

      var status = 'process';
      if (index === current) {
        status = 'process';
      } else if (index > current) {
        status = 'wait';
      } else {
        status = 'finish';
      }
      return status;
    }, _this.changeStep = function (index) {
      _this.setState({ current: index });
    }, _this.handleChangeValue = function (value) {
      _this.setState({ yamlData: value });
    }, _this.handleRenderService = function () {
      var intl = _this.props.intl;
      var _this$state = _this.state,
          templateDisable = _this$state.templateDisable,
          service = _this$state.service,
          template = _this$state.template,
          version = _this$state.version;
      var getFieldDecorator = _this.props.form.getFieldDecorator;

      var inputWidth = 512;
      var versionStatus = _configuration2['default'].getStatus === 'baseon' ? false : templateDisable;
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
        'div',
        null,
        _react2['default'].createElement(
          'p',
          null,
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step1.description' })
        ),
        _react2['default'].createElement(
          _form2['default'],
          null,
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('service', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.service.require.msg' })
              }],
              initialValue: service || undefined
            })(_react2['default'].createElement(
              _select2['default'],
              {
                disabled: _configuration2['default'].getStatus === 'baseon',
                style: { width: inputWidth },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('page-content')[0];
                },
                filterOption: function filterOption(input, option) {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                },
                filter: true,
                onChange: _this.handleChange.bind(_this)
              },
              _configuration2['default'].service.map(function (_ref2) {
                var name = _ref2.name;
                return _react2['default'].createElement(
                  Option,
                  { value: name, key: name },
                  name
                );
              })
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('template', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.template.require.msg' })
              }],
              initialValue: template || undefined
            })(_this.getSelect())
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('version', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.version.require.msg' })
              }, {
                /*  eslint-disable-next-line */
                pattern: /^[a-z0-9\.-]*$/g,
                message: intl.formatMessage({ id: intlPrefix + '.version.pattern.msg' })
              }, {
                validator: _configuration2['default'].getStatus !== 'edit' ? _this.checkVersion : ''
              }],
              initialValue: version || undefined,
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              disabled: versionStatus,
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.configversion' }),
              autoComplete: 'off',
              style: { width: inputWidth }
            }))
          )
        ),
        _react2['default'].createElement(
          'section',
          { className: 'serviceSection' },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['manager-service.config.queryYaml'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                type: 'primary',
                funcType: 'raised',
                onClick: _this.handleSubmit
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.next' })
            )
          )
        )
      );
    }, _this.handleSubmit = function () {
      _this.props.form.validateFields(function (err, _ref3) {
        var service = _ref3.service,
            template = _ref3.template,
            version = _ref3.version;

        if (!err) {
          _this.setState({
            service: service,
            template: template,
            version: version
          }, function () {
            if (!_this.state.yamlData) {
              _this.getConfigYaml();
            } else {
              _this.setState({
                current: 2
              });
            }
          });
        }
      });
    }, _this.handleRenderInfo = function () {
      var _this$state2 = _this.state,
          yamlData = _this$state2.yamlData,
          totalLine = _this$state2.totalLine;

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'p',
          null,
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step2.description' })
        ),
        _react2['default'].createElement(
          'span',
          { className: 'yamlInfoTitle' },
          ' ',
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.info' })
        ),
        _react2['default'].createElement(_yamlAce2['default'], {
          onChange: _this.handleChangeValue,
          value: yamlData,
          style: { height: totalLine ? totalLine * 16 + 'px' : '500px', width: '100%' }
        }),
        _react2['default'].createElement(
          'section',
          { className: 'serviceSection' },
          _react2['default'].createElement(
            _button2['default'],
            {
              type: 'primary',
              funcType: 'raised',
              onClick: _this.jumpToEnd
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.next' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            { funcType: 'raised', onClick: _this.changeStep.bind(_this, 1) },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.prev' })
          )
        )
      );
    }, _this.jumpToEnd = function () {
      _this.setState({
        current: 3
      });
    }, _this.handleRenderConfirm = function () {
      var _this$state3 = _this.state,
          yamlData = _this$state3.yamlData,
          totalLine = _this$state3.totalLine,
          version = _this$state3.version,
          service = _this$state3.service;

      return _react2['default'].createElement(
        'div',
        { className: 'confirmContainer' },
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            _row2['default'],
            null,
            _react2['default'].createElement(
              _col2['default'],
              { span: 3 },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.configid' }),
              '\uFF1A'
            ),
            _react2['default'].createElement(
              _col2['default'],
              { span: 21 },
              service + '.' + version
            )
          ),
          _react2['default'].createElement(
            _row2['default'],
            null,
            _react2['default'].createElement(
              _col2['default'],
              { span: 3 },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.configversion' }),
              '\uFF1A'
            ),
            _react2['default'].createElement(
              _col2['default'],
              { span: 21 },
              version
            )
          ),
          _react2['default'].createElement(
            _row2['default'],
            null,
            _react2['default'].createElement(
              _col2['default'],
              { span: 3 },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
              '\uFF1A'
            ),
            _react2['default'].createElement(
              _col2['default'],
              { span: 13 },
              service
            )
          )
        ),
        _react2['default'].createElement(
          'span',
          { className: 'finalyamTitle' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.info' }),
          '\uFF1A'
        ),
        _react2['default'].createElement(_yamlAce2['default'], {
          readOnly: true,
          value: yamlData,
          style: { height: totalLine ? totalLine * 16 + 'px' : '500px', width: '100%' }
        }),
        _react2['default'].createElement(
          'section',
          { className: 'serviceSection' },
          _react2['default'].createElement(
            _button2['default'],
            {
              type: 'primary',
              funcType: 'raised',
              onClick: _this.createConfig
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            { funcType: 'raised', onClick: _this.changeStep.bind(_this, 2) },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.prev' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            { funcType: 'raised', onClick: _this.cancelAll },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
          )
        )
      );
    }, _this.createConfig = function () {
      var intl = _this.props.intl;
      var _this$state4 = _this.state,
          service = _this$state4.service,
          version = _this$state4.version,
          yamlData = _this$state4.yamlData;

      var data = {
        serviceName: service,
        version: version,
        yaml: yamlData,
        name: service + '.' + version
      };
      _configuration2['default'].createConfig(data).then(function (_ref4) {
        var failed = _ref4.failed,
            message = _ref4.message;

        if (failed) {
          Choerodon.prompt(message);
        } else {
          var currentService = _configuration2['default'].service.find(function (item) {
            return item.name === data.serviceName;
          });
          _configuration2['default'].setRelatedService(currentService);
          Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
          _this.props.history.push('/iam/configuration');
        }
      });
    }, _this.cancelAll = function () {
      _configuration2['default'].setRelatedService(_configuration2['default'].getCurrentService);
      _this.props.history.push('/iam/configuration');
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(CreateConfig, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!_configuration2['default'].service.length) this.loadInitData();
      _configuration2['default'].setRelatedService({}); // 保存时的微服务信息
      if (_configuration2['default'].getStatus === 'baseon') {
        this.loadCurrentServiceConfig(_configuration2['default'].getCurrentService.name);
      }
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      var initData = {};
      if (_configuration2['default'].getStatus === 'baseon') {
        initData = {
          current: 1,
          templateDisable: true,
          currentServiceConfig: null,
          initVersion: undefined,
          configId: null,
          yamlData: null,
          service: _configuration2['default'].getCurrentService.name,
          template: _configuration2['default'].getCurrentConfigId,
          version: this.getDate()
        };
      } else {
        initData = {
          current: 1,
          firstStepNext: false,
          templateDisable: true,
          currentServiceConfig: null,
          initVersion: undefined,
          configId: null,
          yamlData: null,
          service: '',
          template: '',
          version: ''
        };
      }
      return initData;
    }

    /**
     * 选择微服务
     * @param serviceName 服务名称
     */

  }, {
    key: 'generateVersion',


    /**
     * 选择配置模板
     * @param configId 模板id
     */
    value: function generateVersion(configId) {
      var _this2 = this;

      var intl = this.props.intl;
      var _props$form = this.props.form,
          setFieldsValue = _props$form.setFieldsValue,
          getFieldValue = _props$form.getFieldValue;

      var template = getFieldValue('template');
      if (template && this.state.yamlData) {
        confirm({
          title: intl.formatMessage({ id: intlPrefix + '.template.modify.title' }),
          content: intl.formatMessage({ id: intlPrefix + '.template.modify.content' }),
          onOk: function onOk() {
            var version = _this2.getDate();
            setFieldsValue({ version: version });
            _this2.setState({ configId: configId, yamlData: null });
          },
          onCancel: function onCancel() {
            setFieldsValue({ template: template });
          }
        });
      } else {
        var version = this.getDate();
        setFieldsValue({ version: version });
        this.setState({ configId: configId, yamlData: null });
      }
    }

    /**
     * 根据所选微服务 获取配置模板
     * @param serviceName 微服务名称
     */

  }, {
    key: 'loadCurrentServiceConfig',
    value: function loadCurrentServiceConfig(serviceName) {
      var _this3 = this;

      var queryObj = {
        page: 0,
        size: 20
      };
      _choerodonBootCombine.axios.get('/manager/v1/services/' + serviceName + '/configs?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this3.setState({
            yamlData: null,
            templateDisable: _configuration2['default'].getStatus === 'baseon',
            currentServiceConfig: data.content
          });
        }
      });
    }

    /* 渲染配置模板下拉框 */

  }, {
    key: 'getSelect',
    value: function getSelect() {
      var _state = this.state,
          templateDisable = _state.templateDisable,
          currentServiceConfig = _state.currentServiceConfig;

      if (_configuration2['default'].getStatus === 'baseon') {
        return _react2['default'].createElement(
          _select2['default'],
          {
            disabled: templateDisable,
            style: { width: '512px' },
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.template' }),
            getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('page-content')[0];
            },
            filterOption: function filterOption(input, option) {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            },
            filter: true,
            onChange: this.generateVersion.bind(this)
          },
          currentServiceConfig && currentServiceConfig.map(function (_ref5) {
            var name = _ref5.name,
                id = _ref5.id;
            return _react2['default'].createElement(
              Option,
              { value: id, key: name },
              name
            );
          })
        );
      } else {
        var getFieldValue = this.props.form.getFieldValue;

        var service = getFieldValue('service');
        if (!service) {
          return _react2['default'].createElement(_select2['default'], {
            disabled: templateDisable,
            style: { width: '512px' },
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.template' }),
            getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('page-content')[0];
            },
            filterOption: function filterOption(input, option) {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            },
            filter: true
          });
        } else {
          return _react2['default'].createElement(
            _select2['default'],
            {
              disabled: templateDisable,
              style: { width: '512px' },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.template' }),
              getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('page-content')[0];
              },
              filterOption: function filterOption(input, option) {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              },
              filter: true,
              onChange: this.generateVersion.bind(this)
            },
            currentServiceConfig && currentServiceConfig.map(function (_ref6) {
              var name = _ref6.name,
                  id = _ref6.id;
              return _react2['default'].createElement(
                Option,
                { value: id, key: name },
                name
              );
            })
          );
        }
      }
    }

    /* 版本时间处理 */

  }, {
    key: 'getDate',
    value: function getDate() {
      var date = new Date();
      var y = String(date.getFullYear());
      var m = this.timeFilter(date.getMonth() + 1);
      var d = this.timeFilter(date.getDate());
      var h = this.timeFilter(date.getHours());
      var min = this.timeFilter(date.getMinutes());
      var s = this.timeFilter(date.getSeconds());
      return y + m + d + h + min + s;
    }
  }, {
    key: 'timeFilter',
    value: function timeFilter(time) {
      var handledTime = void 0;
      if (time < 10) {
        handledTime = '0' + String(time);
      } else {
        handledTime = String(time);
      }
      return handledTime;
    }

    /* 配置版本唯一性校验 */


    /* 获取步骤条状态 */


    /**
     * 上一步
     * @param index
     */

  }, {
    key: 'getConfigYaml',


    /* 获取配置yaml */
    value: function getConfigYaml() {
      var _this4 = this;

      var configId = this.state.configId || _configuration2['default'].getCurrentConfigId;
      _choerodonBootCombine.axios.get('manager/v1/configs/' + configId + '/yaml').then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this4.setState({
            yamlData: data.yaml,
            totalLine: data.totalLine,
            current: 2
          });
        }
      });
    }

    /**
     * 获取编辑器内容
     * @param value 编辑器内容
     */


    /* 第一步 */


    /* 第一步-下一步 */


    /* 第二步 */


    /* 第二步-下一步 */


    /* 第三步 */


    /* 创建配置 */


    /* 取消 */

  }, {
    key: 'render',
    value: function render() {
      var _state2 = this.state,
          current = _state2.current,
          service = _state2.service,
          template = _state2.template,
          version = _state2.version;
      var AppState = this.props.AppState;

      var code = void 0;
      var values = { name: '' + (AppState.getSiteInfo.systemName || 'Choerodon') };
      if (_configuration2['default'].getStatus === 'create') {
        code = intlPrefix + '.create';
      } else {
        code = intlPrefix + '.create.base';
      }
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['manager-service.config.queryYaml']
        },
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, {
            id: intlPrefix + '.create'
          }),
          backPath: '/iam/configuration'
        }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: code,
            values: values
          },
          _react2['default'].createElement(
            'div',
            { className: 'createConfigContainer' },
            _react2['default'].createElement(
              _steps2['default'],
              { current: current },
              _react2['default'].createElement(Step, {
                title: _react2['default'].createElement(
                  'span',
                  { style: { color: current === 1 ? '#3F51B5' : '', fontSize: 14 } },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step1.title' })
                ),
                status: this.getStatus(1)
              }),
              _react2['default'].createElement(Step, {
                title: _react2['default'].createElement(
                  'span',
                  { style: { color: current === 2 ? '#3F51B5' : '', fontSize: 14 } },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, {
                    id: intlPrefix + '.step2.title'
                  })
                ),
                status: this.getStatus(2)
              }),
              _react2['default'].createElement(Step, {
                title: _react2['default'].createElement(
                  'span',
                  { style: {
                      color: current === 3 ? '#3F51B5' : '',
                      fontSize: 14
                    }
                  },
                  _react2['default'].createElement(_reactIntl.FormattedMessage, {
                    id: intlPrefix + '.step3.create.title'
                  })
                ),
                status: this.getStatus(3)
              })
            ),
            _react2['default'].createElement(
              'div',
              { className: 'createConfigContent' },
              current === 1 && this.handleRenderService(),
              current === 2 && this.handleRenderInfo(),
              current === 3 && this.handleRenderConfirm()
            )
          )
        )
      );
    }
  }]);
  return CreateConfig;
}(_react.Component)) || _class) || _class);
exports['default'] = _form2['default'].create({})((0, _reactRouterDom.withRouter)((0, _reactIntl.injectIntl)(CreateConfig)));
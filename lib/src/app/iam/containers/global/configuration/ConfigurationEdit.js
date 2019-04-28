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

var _configuration = require('../../../stores/global/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

require('./Configuration.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Step = _steps2['default'].Step;

var FormItem = _form2['default'].Item;
var Option = _select2['default'].Option;

var intlPrefix = 'global.configuration';

var EditConfig = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(EditConfig, _Component);

  function EditConfig() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, EditConfig);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = EditConfig.__proto__ || Object.getPrototypeOf(EditConfig)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.oldAce = null, _this.newAce = null, _this.scrollTarget = null, _this.loadInitData = function () {
      _configuration2['default'].loadService().then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _configuration2['default'].setService(data || []);
        }
      });
    }, _this.goSecStep = function () {
      if (!_this.state.yamlData) {
        _this.getConfigYaml();
      } else {
        _this.setState({
          current: 2
        });
      }
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
      if (index === 1) {
        _this.setState({ yamlData: _this.state.oldYamlData });
      }
      _this.setState({ current: index });
    }, _this.handleChangeValue = function (e) {
      _this.setState({ yamlData: e });
    }, _this.editConfig = function () {
      var intl = _this.props.intl;

      var data = JSON.parse(JSON.stringify(_configuration2['default'].getEditConfig));
      data.txt = _this.state.yamlData;
      var configId = _this.state.id;
      _configuration2['default'].modifyConfig(configId, 'yaml', data).then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
        } else {
          var currentService = _configuration2['default'].service.find(function (service) {
            return service.name === _this.state.service;
          });
          _configuration2['default'].setRelatedService(currentService);
          _configuration2['default'].setStatus('');
          Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          _this.props.history.push('/iam/configuration');
        }
      });
    }, _this.cancelAll = function () {
      var currentService = _configuration2['default'].service.find(function (service) {
        return service.name === _this.state.service;
      });
      _configuration2['default'].setRelatedService(currentService);
      _configuration2['default'].setStatus('');
      _this.props.history.push('/iam/configuration');
    }, _this.handleRenderService = function () {
      var intl = _this.props.intl;
      var _this$state = _this.state,
          templateDisable = _this$state.templateDisable,
          service = _this$state.service,
          template = _this$state.template,
          version = _this$state.version;
      var getFieldDecorator = _this.props.form.getFieldDecorator;

      var inputWidth = 512;
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
                required: true
              }],
              initialValue: service
            })(_react2['default'].createElement(
              _select2['default'],
              {
                disabled: true,
                style: { width: inputWidth },
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('page-content')[0];
                },
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service' }),
                filterOption: function filterOption(input, option) {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                },
                filter: true
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
              initialValue: _configuration2['default'].getEditConfig && _configuration2['default'].getEditConfig.name
            })(_this.getSelect())
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('version', {
              rules: [{
                required: true
              }],
              initialValue: _configuration2['default'].getEditConfig && _configuration2['default'].getEditConfig.configVersion
            })(_react2['default'].createElement(_input2['default'], {
              disabled: true,
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
                onClick: _this.goSecStep
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.next' })
            )
          )
        )
      );
    }, _this.handleRenderInfo = function () {
      var _this$state2 = _this.state,
          yamlData = _this$state2.yamlData,
          totalLine = _this$state2.totalLine;

      return _react2['default'].createElement(
        'div',
        { key: 'step' },
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
        _react2['default'].createElement(
          _row2['default'],
          { key: 'ace-row' },
          _react2['default'].createElement(
            _col2['default'],
            { key: 'ace-column', span: 24 },
            _react2['default'].createElement(_yamlAce2['default'], {
              key: 'ace',
              onChange: _this.handleChangeValue,
              value: yamlData,
              style: { height: totalLine ? totalLine * 16 + 'px' : '500px', width: '100%' }
            })
          )
        ),
        _react2['default'].createElement(
          'section',
          { className: 'serviceSection' },
          _react2['default'].createElement(
            _button2['default'],
            {
              type: 'primary',
              funcType: 'raised',
              onClick: _this.changeStep.bind(_this, 3)
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
    }, _this.syncOldAceScroll = function (cm) {
      if (_this.scrollTarget === 'old') {
        _this.scrollTarget = null;
      } else if (_this.oldAce) {
        _this.scrollTarget = 'new';
        _this.oldAce.scrollTo(cm);
      }
    }, _this.syncNewAceScroll = function (cm) {
      if (_this.scrollTarget === 'new') {
        _this.scrollTarget = null;
      } else if (_this.newAce) {
        _this.scrollTarget = 'old';
        _this.newAce.scrollTo(cm);
      }
    }, _this.saveOldAce = function (node) {
      _this.oldAce = node;
    }, _this.saveNewAce = function (node) {
      _this.newAce = node;
    }, _this.handleRenderConfirm = function () {
      var _this$state3 = _this.state,
          yamlData = _this$state3.yamlData,
          totalLine = _this$state3.totalLine,
          service = _this$state3.service,
          oldYamlData = _this$state3.oldYamlData;

      return _react2['default'].createElement(
        'div',
        { key: 'step', className: 'confirmContainer' },
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
              {
                span: 21
              },
              _configuration2['default'].getEditConfig.name
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
              _configuration2['default'].getEditConfig.configVersion
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
        _react2['default'].createElement(
          _row2['default'],
          { key: 'ace-row' },
          _react2['default'].createElement(
            _col2['default'],
            { key: 'ace-column', span: 12 },
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.newYaml' })
            ),
            _react2['default'].createElement(_yamlAce2['default'], {
              key: 'ace',
              ref: _this.saveNewAce,
              readOnly: 'nocursor',
              value: yamlData,
              style: { height: totalLine ? (totalLine + 2) * 16 + 'px' : '500px', width: '100%' },
              onScroll: _this.syncOldAceScroll
            })
          ),
          _react2['default'].createElement(
            _col2['default'],
            { span: 12 },
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.oldYaml' })
            ),
            _react2['default'].createElement(_yamlAce2['default'], {
              ref: _this.saveOldAce,
              readOnly: 'nocursor',
              value: oldYamlData,
              style: { height: totalLine ? (totalLine + 2) * 16 + 'px' : '500px', width: '100%' },
              onScroll: _this.syncNewAceScroll
            })
          )
        ),
        _react2['default'].createElement(
          'section',
          { className: 'serviceSection' },
          _react2['default'].createElement(
            _button2['default'],
            {
              type: 'primary',
              funcType: 'raised',
              onClick: _this.editConfig
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
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
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(EditConfig, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        current: 1,
        templateDisable: true,
        currentServiceConfig: null, // 配置模板下拉内容
        initVersion: undefined,
        yamlData: null,
        oldYamlData: '',
        id: this.props.match.params.id,
        service: this.props.match.params.name
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      _configuration2['default'].setRelatedService({}); // 保存时的微服务信息
      if (!_configuration2['default'].service.length) this.loadInitData();
      _configuration2['default'].getEditConfigData(this.state.id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _configuration2['default'].setEditConfig(data);
        }
      });
      this.loadCurrentServiceConfig(this.state.service);
    }
  }, {
    key: 'loadCurrentServiceConfig',


    /**
     * 根据所选微服务 获取配置模板
     * @param serviceName 微服务名称
     */
    value: function loadCurrentServiceConfig(serviceName) {
      var _this2 = this;

      var queryObj = {
        page: 0,
        size: 20
      };
      _choerodonBootCombine.axios.get('/manager/v1/services/' + serviceName + '/configs?' + _queryString2['default'].stringify(queryObj)).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this2.setState({
            yamlData: null,
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

      return _react2['default'].createElement(
        _select2['default'],
        {
          disabled: true,
          style: { width: '512px' },
          label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.template' }),
          getPopupContainer: function getPopupContainer() {
            return document.getElementsByClassName('page-content')[0];
          },
          filterOption: function filterOption(input, option) {
            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
          filter: true
        },
        currentServiceConfig && currentServiceConfig.map(function (_ref3) {
          var name = _ref3.name,
              id = _ref3.id;
          return _react2['default'].createElement(
            Option,
            { value: id, key: name },
            name
          );
        })
      );
    }

    /* 第一步 下一步 */

  }, {
    key: 'getConfigYaml',


    /* 获取配置yaml */
    value: function getConfigYaml() {
      var _this3 = this;

      var id = this.state.id;

      _choerodonBootCombine.axios.get('manager/v1/configs/' + id + '/yaml').then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this3.setState({
            yamlData: data.yaml,
            oldYamlData: data.yaml,
            totalLine: data.totalLine,
            current: 2
          });
        }
      });
    }

    /* 获取步骤条状态 */


    /**
     * 上一步
     * @param index
     */


    /**
     * 获取编辑器内容
     * @param value 编辑器内容
     */


    /* 修改配置 */


    /* 取消 */


    /* 渲染第一步 */


    /* 渲染第二步 */


    /* 渲染第三步 */

  }, {
    key: 'render',
    value: function render() {
      var current = this.state.current;

      var values = {
        name: _configuration2['default'].getEditConfig && _configuration2['default'].getEditConfig.name
      };
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['manager-service.config.queryYaml']
        },
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify' }),
          backPath: '/iam/configuration'
        }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix + '.modify',
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
                  _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step3.modify.title' })
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
  return EditConfig;
}(_react.Component)) || _class) || _class);
exports['default'] = _form2['default'].create({})((0, _reactRouterDom.withRouter)((0, _reactIntl.injectIntl)(EditConfig)));
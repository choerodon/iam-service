'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _inputNumber = require('choerodon-ui/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _checkbox = require('choerodon-ui/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _steps = require('choerodon-ui/lib/steps');

var _steps2 = _interopRequireDefault(_steps);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _datePicker = require('choerodon-ui/lib/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/input-number/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/checkbox/style');

require('choerodon-ui/lib/steps/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/date-picker/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/input/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _classnames4 = require('classnames');

var _classnames5 = _interopRequireDefault(_classnames4);

var _taskDetail = require('../../../stores/global/task-detail');

var _taskDetail2 = _interopRequireDefault(_taskDetail);

require('./TaskDetail.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _tips = require('../../../components/tips');

var _tips2 = _interopRequireDefault(_tips);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var TextArea = _input2['default'].TextArea;

var FormItem = _form2['default'].Item;
var RangePicker = _datePicker2['default'].RangePicker;

var RadioGroup = _radio2['default'].Group;
var Option = _select2['default'].Option;
var Step = _steps2['default'].Step;

var CheckboxGroup = _checkbox2['default'].Group;
var intlPrefix = 'taskdetail';
var inputWidth = '512px';
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

(0, _mobx.configure)({ enforceActions: false });

// 公用方法类

var TaskDetailType = function TaskDetailType(context) {
  (0, _classCallCheck3['default'])(this, TaskDetailType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = void 0;
  switch (type) {
    case 'organization':
      codePrefix = 'organization';
      break;
    case 'project':
      codePrefix = 'project';
      break;
    case 'site':
      codePrefix = 'global';
      break;
    default:
      break;
  }
  this.code = codePrefix + '.taskdetail';
  this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
  this.type = type;
  this.id = id; // 项目或组织id
  this.name = name; // 项目或组织名称
};

var TaskCreate = (_dec = _form2['default'].create(), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = (_class2 = function (_Component) {
  (0, _inherits3['default'])(TaskCreate, _Component);

  function TaskCreate() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, TaskCreate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = TaskCreate.__proto__ || Object.getPrototypeOf(TaskCreate)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.getBackPath = function () {
      var backPath = void 0;
      var organizationId = void 0;
      var _this$taskdetail = _this.taskdetail,
          type = _this$taskdetail.type,
          name = _this$taskdetail.name,
          id = _this$taskdetail.id;
      var currentMenuType = _this.props.AppState.currentMenuType;

      if (currentMenuType.type === 'project') {
        organizationId = currentMenuType.organizationId;
      }
      switch (type) {
        case 'organization':
          backPath = '/iam/task-detail?type=' + type + '&id=' + id + '&name=' + name + '&organizationId=' + id;
          break;
        case 'project':
          backPath = '/iam/task-detail?type=' + type + '&id=' + id + '&name=' + name + '&organizationId=' + organizationId;
          break;
        case 'site':
          backPath = '/iam/task-detail';
          break;
        default:
          break;
      }
      return backPath;
    }, _this.goBack = function () {
      var backPath = _this.getBackPath();
      _this.props.history.push(backPath);
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
    }, _this.checkName = function (rule, value, callback) {
      var intl = _this.props.intl;
      var _this$taskdetail2 = _this.taskdetail,
          type = _this$taskdetail2.type,
          id = _this$taskdetail2.id;

      _taskDetail2['default'].checkName(value, type, id).then(function (_ref2) {
        var failed = _ref2.failed;

        if (failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.task.name.exist' }));
        } else {
          callback();
        }
      });
    }, _this.disabledStartDate = function (startTime) {
      var endTime = _this.state.endTime;
      if (!startTime || !endTime) {
        return false;
      }
      if (endTime.format().split('T')[1] === '00:00:00+08:00') {
        return startTime.format().split('T')[0] >= endTime.format().split('T')[0];
      } else {
        return startTime.format().split('T')[0] > endTime.format().split('T')[0];
      }
    }, _this.disabledEndDate = function (endTime) {
      var startTime = _this.state.startTime;
      if (!endTime || !startTime) {
        return false;
      }
      return endTime.valueOf() <= startTime.valueOf();
    }, _this.range = function (start, end) {
      var result = [];
      for (var i = start; i < end; i += 1) {
        result.push(i);
      }
      return result;
    }, _initDefineProp(_this, 'disabledDateStartTime', _descriptor, _this), _initDefineProp(_this, 'clearStartTimes', _descriptor2, _this), _initDefineProp(_this, 'clearEndTimes', _descriptor3, _this), _initDefineProp(_this, 'disabledDateEndTime', _descriptor4, _this), _this.onStartChange = function (value) {
      _this.onChange('startTime', value);
    }, _this.onEndChange = function (value) {
      _this.onChange('endTime', value);
    }, _this.onChange = function (field, value) {
      var setFieldsValue = _this.props.form.setFieldsValue;

      _this.setState((0, _defineProperty3['default'])({}, field, value), function () {
        setFieldsValue((0, _defineProperty3['default'])({}, field, _this.state[field]));
      });
    }, _this.checkCron = function () {
      var getFieldValue = _this.props.form.getFieldValue;
      var _this$taskdetail3 = _this.taskdetail,
          type = _this$taskdetail3.type,
          id = _this$taskdetail3.id;

      var cron = getFieldValue('cronExpression');
      if (_this.state.currentCron === cron) return;
      _this.setState({
        currentCron: cron
      });
      if (!cron) {
        _this.setState({
          cronLoading: 'empty'
        });
      } else {
        _this.setState({
          cronLoading: true
        });

        _taskDetail2['default'].checkCron(cron, type, id).then(function (data) {
          if (data.failed) {
            _this.setState({
              cronLoading: false
            });
          } else {
            _this.setState({
              cronLoading: 'right',
              cronTime: data
            });
          }
        });
      }
    }, _this.checkCronExpression = function (rule, value, callback) {
      var intl = _this.props.intl;
      var _this$taskdetail4 = _this.taskdetail,
          type = _this$taskdetail4.type,
          id = _this$taskdetail4.id;

      _taskDetail2['default'].checkCron(value, type, id).then(function (data) {
        if (data.failed) {
          callback(intl.formatMessage({ id: intlPrefix + '.cron.wrong' }));
        } else {
          callback();
        }
      });
    }, _this.getCronContent = function () {
      var _this$state = _this.state,
          cronLoading = _this$state.cronLoading,
          cronTime = _this$state.cronTime;
      var intl = _this.props.intl;

      var content = void 0;
      if (cronLoading === 'empty') {
        content = _react2['default'].createElement(
          'div',
          { className: 'c7n-task-deatil-cron-container-empty' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.cron.tip' })
        );
      } else if (cronLoading === true) {
        content = _react2['default'].createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } },
          _react2['default'].createElement(_spin2['default'], null)
        );
      } else if (cronLoading === 'right') {
        content = _react2['default'].createElement(
          'div',
          { className: 'c7n-task-deatil-cron-container' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.cron.example' }),
          cronTime.map(function (value, key) {
            return _react2['default'].createElement(
              'li',
              { key: key },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.cron.runtime', values: { time: key + 1 } }),
              _react2['default'].createElement(
                'span',
                null,
                value
              )
            );
          })
        );
      } else {
        content = _react2['default'].createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.cron.wrong' })
        );
      }
      return content;
    }, _this.loadService = function () {
      var _this$taskdetail5 = _this.taskdetail,
          type = _this$taskdetail5.type,
          id = _this$taskdetail5.id;

      _taskDetail2['default'].loadService(type, id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _taskDetail2['default'].setService(data);
        }
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }, _this.loadClass = function () {
      var currentService = _taskDetail2['default'].currentService;

      _taskDetail2['default'].loadClass(currentService[0], _this.taskdetail.type, _this.taskdetail.id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else if (data.length) {
          var classNames = [];
          data.map(function (_ref3) {
            var method = _ref3.method,
                code = _ref3.code,
                id = _ref3.id,
                description = _ref3.description;
            return classNames.push({ method: method, code: code, id: id, description: description });
          });
          _taskDetail2['default'].setClassNames(classNames);
          _taskDetail2['default'].setCurrentClassNames(classNames[0]);
          _this.loadParamsTable();
        } else {
          _taskDetail2['default'].setClassNames([]);
          _taskDetail2['default'].setCurrentClassNames({});
          _this.setState({
            paramsData: []
          });
        }
      });
    }, _this.loadParamsTable = function () {
      _this.setState({
        paramsLoading: true
      });
      var currentClassNames = _taskDetail2['default'].currentClassNames;
      var _this$taskdetail6 = _this.taskdetail,
          type = _this$taskdetail6.type,
          id = _this$taskdetail6.id;

      if (currentClassNames.id) {
        _taskDetail2['default'].loadParams(currentClassNames.id, type, id).then(function (data) {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else {
            var filteredParamsData = data.paramsList.length ? data.paramsList.filter(function (item) {
              return item['default'] === false;
            }) : [];
            _this.setState({
              paramsData: filteredParamsData
            });
          }
          _this.setState({
            paramsLoading: false
          });
        });
      } else {
        _this.setState({
          paramsData: [],
          paramsLoading: false
        });
      }
    }, _this.goPrevStep = function (index) {
      _this.setState({ current: index });
    }, _this.handleRenderFirstStep = function () {
      var _this$props = _this.props,
          intl = _this$props.intl,
          getFieldDecorator = _this$props.form.getFieldDecorator;
      var _this$state2 = _this.state,
          submitLoading = _this$state2.submitLoading,
          firstStepValues = _this$state2.firstStepValues,
          triggerType = _this$state2.triggerType;

      var stepPrefix = 'c7n-iam-create-task-content-step1-container';
      var contentPrefix = 'c7n-iam-create-task-content';
      return _react2['default'].createElement(
        'div',
        { className: '' + stepPrefix },
        _react2['default'].createElement(
          'p',
          { className: contentPrefix + '-des' },
          intl.formatMessage({ id: intlPrefix + '.step1.description' }),
          _react2['default'].createElement(
            'a',
            { href: intl.formatMessage({ id: intlPrefix + '.cron.tip.link' }), target: '_blank' },
            _react2['default'].createElement(
              'span',
              null,
              intl.formatMessage({ id: 'learnmore' })
            ),
            _react2['default'].createElement(_icon2['default'], { type: 'open_in_new', style: { fontSize: '13px' } })
          )
        ),
        _react2['default'].createElement(
          _form2['default'],
          { className: 'c7n-create-task' },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.task.name.required' })
              }, {
                validator: _this.checkName
              }],
              initialValue: firstStepValues ? firstStepValues.name : undefined,
              validateTrigger: 'onBlur',
              validateFirst: true
            })(_react2['default'].createElement(_input2['default'], {
              maxLength: 15,
              showLengthInfo: false,
              autoComplete: 'off',
              style: { width: inputWidth },
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.name' })
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, {
              style: { width: inputWidth }
            }),
            getFieldDecorator('description', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: intlPrefix + '.task.description.required' })
              }],
              initialValue: firstStepValues ? firstStepValues.description : undefined
            })(_react2['default'].createElement(TextArea, { autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.description' }) }))
          ),
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, {
              className: contentPrefix + '-inline-formitem'
            }),
            getFieldDecorator('startTime', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: intlPrefix + '.task.start.time.required' })
              }],
              initialValue: firstStepValues ? firstStepValues.startTime : undefined
            })(_react2['default'].createElement(_datePicker2['default'], {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.start.time' }),
              style: { width: '248px' },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate: _this.disabledStartDate,
              disabledTime: _this.disabledDateStartTime,
              showTime: { defaultValue: (0, _moment2['default'])('00:00:00', 'HH:mm:ss') },
              getCalendarContainer: function getCalendarContainer() {
                return document.getElementsByClassName('page-content')[0];
              },
              onChange: _this.onStartChange,
              onOpenChange: _this.clearStartTimes
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, {
              className: contentPrefix + '-inline-formitem'
            }),
            getFieldDecorator('endTime', {
              initialValue: firstStepValues ? firstStepValues.endTime : undefined
            })(_react2['default'].createElement(_datePicker2['default'], {
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.end.time' }),
              style: { width: '248px' },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate: _this.disabledEndDate.bind(_this),
              disabledTime: _this.disabledDateEndTime.bind(_this),
              showTime: { defaultValue: (0, _moment2['default'])() },
              getCalendarContainer: function getCalendarContainer() {
                return document.getElementsByClassName('page-content')[0];
              },
              onChange: _this.onEndChange,
              onOpenChange: _this.clearEndTimes
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            (0, _extends3['default'])({}, formItemLayout, {
              className: contentPrefix + '-inline-formitem',
              style: { width: 248 }
            }),
            getFieldDecorator('triggerType', {
              rules: [],
              initialValue: firstStepValues ? firstStepValues.triggerType : 'simple-trigger'
            })(_react2['default'].createElement(
              RadioGroup,
              {
                className: contentPrefix + '-radio-container',
                label: intl.formatMessage({ id: intlPrefix + '.trigger.type' }),
                onChange: _this.changeValue.bind(_this)
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'simple-trigger' },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.easy.task' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: 'cron-trigger' },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.cron.task' })
              )
            ))
          ),
          _react2['default'].createElement(
            'div',
            { style: { display: triggerType === 'simple-trigger' ? 'block' : 'none' } },
            _react2['default'].createElement(
              'div',
              { className: stepPrefix + '-simpletask-time-container' },
              _react2['default'].createElement(
                FormItem,
                (0, _extends3['default'])({}, formItemLayout, {
                  className: contentPrefix + '-inline-formitem'
                }),
                getFieldDecorator('simpleRepeatInterval', {
                  rules: [{
                    required: triggerType === 'simple-trigger',
                    message: intl.formatMessage({ id: intlPrefix + '.repeat.required' })
                  }, {
                    pattern: /^[1-9]\d*$/,
                    message: intl.formatMessage({ id: intlPrefix + '.repeat.pattern' })
                  }],
                  validateFirst: true,
                  initialValue: firstStepValues ? firstStepValues.simpleRepeatInterval : undefined
                })(_react2['default'].createElement(_input2['default'], { style: { width: '100px' }, autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.repeat.interval' }) }))
              ),
              _react2['default'].createElement(
                FormItem,
                (0, _extends3['default'])({}, formItemLayout, {
                  className: contentPrefix + '-inline-formitem ' + contentPrefix + '-inline-formitem-select'
                }),
                getFieldDecorator('simpleRepeatIntervalUnit', {
                  rules: [],
                  initialValue: firstStepValues ? firstStepValues.simpleRepeatIntervalUnit : 'SECONDS'
                })(_react2['default'].createElement(
                  _select2['default'],
                  {
                    style: { width: '124px' },
                    getPopupContainer: function getPopupContainer() {
                      return document.getElementsByClassName('page-content')[0];
                    }
                  },
                  _react2['default'].createElement(
                    Option,
                    { value: 'SECONDS', key: 'SECONDS' },
                    intl.formatMessage({ id: intlPrefix + '.seconds' })
                  ),
                  _react2['default'].createElement(
                    Option,
                    { value: 'MINUTES', key: 'MINUTES' },
                    intl.formatMessage({ id: intlPrefix + '.minutes' })
                  ),
                  _react2['default'].createElement(
                    Option,
                    { value: 'HOURS', key: 'HOURS' },
                    intl.formatMessage({ id: intlPrefix + '.hours' })
                  ),
                  _react2['default'].createElement(
                    Option,
                    { value: 'DAYS', key: 'DAYS' },
                    intl.formatMessage({ id: intlPrefix + '.days' })
                  )
                ))
              )
            ),
            _react2['default'].createElement(
              FormItem,
              (0, _extends3['default'])({
                className: contentPrefix + '-inline-formitem'
              }, formItemLayout),
              getFieldDecorator('simpleRepeatCount', {
                rules: [{
                  required: triggerType === 'simple-trigger',
                  message: intl.formatMessage({ id: intlPrefix + '.repeat.time.required' })
                }, {
                  pattern: /^[1-9]\d*$/,
                  message: intl.formatMessage({ id: intlPrefix + '.repeat.pattern' })
                }],
                initialValue: firstStepValues ? firstStepValues.simpleRepeatCount : undefined
              })(_react2['default'].createElement(_input2['default'], { style: { width: '100px' }, autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.repeat.time' }) }))
            )
          ),
          _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              FormItem,
              (0, _extends3['default'])({}, formItemLayout, {
                style: { position: 'relative', display: triggerType === 'cron-trigger' ? 'inline-block' : 'none' }
              }),
              getFieldDecorator('cronExpression', {
                rules: [{
                  required: triggerType === 'cron-trigger',
                  message: intl.formatMessage({ id: intlPrefix + '.cron.expression.required' })
                }, {
                  validator: triggerType === 'cron-trigger' ? _this.checkCronExpression : ''
                }],
                initialValue: firstStepValues ? firstStepValues.cronExpression : undefined,
                validateTrigger: 'onBlur',
                validateFirst: true
              })(_react2['default'].createElement(_input2['default'], { style: { width: inputWidth }, autoComplete: 'off', label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.cron.expression' }) }))
            ),
            _react2['default'].createElement(
              _popover2['default'],
              {
                content: _this.getCronContent(),
                trigger: 'click',
                placement: 'bottom',
                overlayClassName: stepPrefix + '.popover',
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('page-content')[0];
                }
              },
              _react2['default'].createElement(_icon2['default'], {
                onClick: _this.checkCron,
                style: { display: triggerType === 'cron-trigger' ? 'inline-block' : 'none' },
                className: stepPrefix + '-popover-icon',
                type: 'find_in_page'
              })
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-create-task-tip-select' },
            _react2['default'].createElement(
              FormItem,
              formItemLayout,
              getFieldDecorator('executeStrategy', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.execute-strategy.required' })
                }],
                initialValue: firstStepValues ? firstStepValues.executeStrategy : null
              })(_react2['default'].createElement(
                _select2['default'],
                {
                  style: { width: 242 },
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('page-content')[0];
                  },
                  label: intl.formatMessage({ id: intlPrefix + '.execute-strategy' }),
                  dropdownMatchSelectWidth: true
                },
                _react2['default'].createElement(
                  Option,
                  { value: 'STOP', key: 'STOP' },
                  intl.formatMessage({ id: intlPrefix + '.stop' })
                ),
                _react2['default'].createElement(
                  Option,
                  { value: 'SERIAL', key: 'SERIAL' },
                  intl.formatMessage({ id: intlPrefix + '.serial' })
                ),
                _react2['default'].createElement(
                  Option,
                  { value: 'PARALLEL', key: 'PARALLEL' },
                  intl.formatMessage({ id: intlPrefix + '.parallel' })
                )
              ))
            ),
            _react2['default'].createElement(_tips2['default'], { type: 'form', data: intlPrefix + '.execute-strategy.tips' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              type: 'primary',
              funcType: 'raised',
              style: { display: 'inlineBlock', marginTop: '8px' },
              loading: submitLoading,
              onClick: _this.handleSubmit.bind(_this, 1)
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.next' })
          )
        )
      );
    }, _this.getParamsInitvalue = function (text, record) {
      var params = _this.state.params;
      var name = record.name;

      var value = void 0;
      if ('' + name in params) {
        value = params[name];
      } else {
        value = text === null ? undefined : text;
      }
      return value;
    }, _this.handleRenderSecStep = function () {
      var _this$props2 = _this.props,
          intl = _this$props2.intl,
          getFieldDecorator = _this$props2.form.getFieldDecorator;
      var submitLoading = _this.state.submitLoading;

      var service = _taskDetail2['default'].service;
      var classNames = _taskDetail2['default'].classNames;
      var stepPrefix = 'c7n-iam-create-task-content-step2-container';
      var contentPrefix = 'c7n-iam-create-task-content';
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.name' }),
        dataIndex: 'name',
        key: 'name'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.value' }),
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        width: 258,
        render: function render(text, record) {
          var editableNode = void 0;
          if (record.type === 'Boolean') {
            editableNode = _react2['default'].createElement(
              FormItem,
              { style: { marginBottom: 0, width: '55px' } },
              getFieldDecorator('params.' + record.name, {
                rules: [{
                  required: text === null,
                  message: intl.formatMessage({ id: intlPrefix + '.default.required' })
                }],
                initialValue: _this.getParamsInitvalue(text, record)
              })(_react2['default'].createElement(
                _select2['default'],
                {
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('page-content')[0].parentNode;
                  },
                  tyle: { width: '55px' }
                },
                _react2['default'].createElement(Option, { value: null, style: { height: '22px' }, key: 'null' }),
                _react2['default'].createElement(
                  Option,
                  { value: true, key: 'true' },
                  'true'
                ),
                _react2['default'].createElement(
                  Option,
                  { value: false, key: 'false' },
                  'false'
                )
              ))
            );
          } else if (record.type === 'Integer' || record.type === 'Long' || record.type === 'Double' || record.type === 'Float') {
            editableNode = _react2['default'].createElement(
              FormItem,
              { style: { marginBottom: 0 } },
              getFieldDecorator('params.' + record.name, {
                rules: [{
                  required: text === null,
                  message: intl.formatMessage({ id: intlPrefix + '.num.required' })
                }, {
                  transform: function transform(value) {
                    return Number(value);
                  },
                  type: 'number',
                  message: intl.formatMessage({ id: intlPrefix + '.number.pattern' })
                }],
                validateFirst: true,
                initialValue: _this.getParamsInitvalue(text, record)
              })(_react2['default'].createElement(_inputNumber2['default'], {
                style: { width: '200px' },
                onFocus: _this.inputOnFocus,
                autoComplete: 'off'
              }))
            );
          } else {
            editableNode = _react2['default'].createElement(
              FormItem,
              { style: { marginBottom: 0 } },
              getFieldDecorator('params.' + record.name, {
                rules: [{
                  required: text === null,
                  whitespace: true,
                  message: intl.formatMessage({ id: intlPrefix + '.default.required' })
                }],
                initialValue: _this.getParamsInitvalue(text, record)
              })(_react2['default'].createElement(_input2['default'], {
                style: { width: '200px' },
                onFocus: _this.inputOnFocus,
                autoComplete: 'off'
              }))
            );
          }

          if (record.type !== 'Boolean') {
            editableNode = _react2['default'].createElement(
              'div',
              { className: 'c7n-taskdetail-text' },
              editableNode,
              _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-taskdetail-text-icon' })
            );
          }
          return editableNode;
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.type' }),
        dataIndex: 'type',
        key: 'type'
      }];

      return _react2['default'].createElement(
        'div',
        { className: '' + stepPrefix },
        _react2['default'].createElement(
          'p',
          { className: contentPrefix + '-des' },
          intl.formatMessage({ id: intlPrefix + '.step2.description' })
        ),
        _react2['default'].createElement(
          _form2['default'],
          null,
          _react2['default'].createElement(
            'div',
            { className: 'c7n-task-deatil-params-container' },
            _react2['default'].createElement(
              FormItem,
              (0, _extends3['default'])({}, formItemLayout, {
                className: contentPrefix + '-inline-formitem'
              }),
              getFieldDecorator('serviceName', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.service.required' })
                }],
                initialValue: _taskDetail2['default'].getCurrentService.length ? _taskDetail2['default'].getCurrentService : undefined
              })(_react2['default'].createElement(
                _select2['default'],
                {
                  style: { width: '176px' },
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('page-content')[0];
                  },
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.service.name' }),
                  filterOption: function filterOption(input, option) {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  },
                  filter: true,
                  onChange: _this.handleChangeService.bind(_this)
                },
                service && service.length ? service.map(function (item) {
                  return _react2['default'].createElement(
                    Option,
                    { key: item },
                    item
                  );
                }) : _react2['default'].createElement(
                  Option,
                  { key: 'empty' },
                  intl.formatMessage({ id: intlPrefix + '.noservice' })
                )
              ))
            ),
            _react2['default'].createElement(
              FormItem,
              (0, _extends3['default'])({}, formItemLayout, {
                style: { marginRight: '0' },
                className: contentPrefix + '-inline-formitem'
              }),
              getFieldDecorator('methodId', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: intlPrefix + '.task.class.required' })
                }],
                initialValue: classNames.length ? _taskDetail2['default'].currentClassNames.id : undefined
              })(_react2['default'].createElement(
                _select2['default'],
                {
                  notFoundContent: intl.formatMessage({ id: intlPrefix + '.noprograms' }),
                  label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.class.name' }),
                  style: { width: '292px' },
                  getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('page-content')[0];
                  },
                  filterOption: function filterOption(input, option) {
                    var childNode = option.props.children;
                    if (childNode && _react2['default'].isValidElement(childNode)) {
                      return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  },
                  filter: true,
                  onChange: _this.handleChangeClass.bind(_this)
                },
                classNames.length && classNames.map(function (_ref4) {
                  var description = _ref4.description,
                      method = _ref4.method,
                      id = _ref4.id;
                  return _react2['default'].createElement(
                    Option,
                    { key: method + '-' + id, value: id },
                    _react2['default'].createElement(
                      _tooltip2['default'],
                      {
                        title: method,
                        placement: 'right',
                        align: { offset: [20, 0] },
                        getPopupContainer: function getPopupContainer() {
                          return document.getElementsByClassName('page-content')[0];
                        }
                      },
                      _react2['default'].createElement(
                        'span',
                        {
                          className: stepPrefix + '-tooltip'
                        },
                        description
                      )
                    )
                  );
                })
              ))
            ),
            _react2['default'].createElement(_table2['default'], {
              loading: _this.state.paramsLoading,
              pagination: false,
              filterBar: false,
              columns: columns,
              rowKey: 'name',
              dataSource: _this.state.paramsData,
              style: { width: '488px', marginRight: '0' }
            })
          ),
          _react2['default'].createElement(
            'div',
            { className: contentPrefix + '-btn-group' },
            _react2['default'].createElement(
              _button2['default'],
              {
                type: 'primary',
                funcType: 'raised',
                loading: submitLoading,
                onClick: _this.handleSubmit.bind(_this, 2)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.next' })
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                disabled: submitLoading,
                funcType: 'raised',
                onClick: _this.goPrevStep.bind(_this, 1)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.prev' })
            )
          )
        )
      );
    }, _this.getLevelName = function () {
      var intl = _this.props.intl;

      var level = void 0;
      switch (_this.taskdetail.type) {
        case 'site':
          level = intl.formatMessage({ id: intlPrefix + '.site' });
          break;
        case 'organization':
          level = intl.formatMessage({ id: intlPrefix + '.organization' });
          break;
        case 'project':
          level = intl.formatMessage({ id: intlPrefix + '.project' });
          break;
        default:
          break;
      }
      return level;
    }, _this.handleRenderThirdStep = function () {
      var _this$props3 = _this.props,
          intl = _this$props3.intl,
          AppState = _this$props3.AppState;
      var _this$state3 = _this.state,
          submitLoading = _this$state3.submitLoading,
          isShowModal = _this$state3.isShowModal,
          showSelected = _this$state3.showSelected,
          showSelectedRowKeys = _this$state3.showSelectedRowKeys,
          informArr = _this$state3.informArr;

      var stepPrefix = 'c7n-iam-create-task-content-step3-container';
      var contentPrefix = 'c7n-iam-create-task-content';
      var level = _this.getLevelName();
      var options = [{ label: intl.formatMessage({ id: intlPrefix + '.creator' }), value: AppState.getUserInfo.id }, { label: '' + level + intl.formatMessage({ id: intlPrefix + '.manager' }), value: 'manager' }, { label: intl.formatMessage({ id: intlPrefix + '.user' }), value: 'user' }];

      return _react2['default'].createElement(
        'div',
        { className: '' + stepPrefix },
        _react2['default'].createElement(
          'p',
          { className: contentPrefix + '-des' },
          intl.formatMessage({ id: intlPrefix + '.step3.description' })
        ),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(CheckboxGroup, {
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.inform.person' }),
            options: options,
            className: stepPrefix + '-checkbox-group',
            onChange: _this.changeInformPerson,
            value: informArr
          }),
          _react2['default'].createElement(
            'div',
            { className: stepPrefix + '-specified-container', style: { display: informArr.indexOf('user') !== -1 ? 'block' : 'none' } },
            _react2['default'].createElement(
              'div',
              { style: { marginBottom: '15px' } },
              _react2['default'].createElement(
                'span',
                { className: stepPrefix + '-specified-container-title' },
                intl.formatMessage({ id: intlPrefix + '.user' })
              ),
              _react2['default'].createElement(
                _button2['default'],
                {
                  icon: 'playlist_add',
                  type: 'primary',
                  className: stepPrefix + '-specified-container-btn',
                  onClick: _this.handleOpenUsersModal
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' })
              )
            ),
            showSelected.length ? _react2['default'].createElement(
              _select2['default'],
              {
                mode: 'multiple',
                style: { width: '100%' },
                value: showSelectedRowKeys,
                showArrow: false,
                onChoiceRemove: _this.handleChoiceRemove,
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('c7n-iam-create-task-container')[0];
                },
                className: stepPrefix + '-select'
              },
              showSelected.length && showSelected.map(function (_ref5) {
                var loginName = _ref5.loginName,
                    realName = _ref5.realName,
                    id = _ref5.id;
                return _react2['default'].createElement(
                  Option,
                  { key: id, value: id },
                  loginName,
                  realName
                );
              })
            ) : _react2['default'].createElement(
              'div',
              null,
              intl.formatMessage({ id: intlPrefix + '.nousers' })
            ),
            _react2['default'].createElement(
              _modal2['default'],
              {
                width: 560,
                visible: isShowModal,
                closable: false,
                title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.add.specified.user' }),
                okText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'ok' }),
                onOk: _this.handleAddUsers,
                onCancel: _this.handleCloseModal,
                className: 'c7n-iam-create-task-modal'
              },
              _this.getModalContent()
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: contentPrefix + '-btn-group' },
            _react2['default'].createElement(
              _button2['default'],
              {
                type: 'primary',
                funcType: 'raised',
                loading: submitLoading,
                onClick: _this.handleSubmit.bind(_this, 3)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.next' })
            ),
            _react2['default'].createElement(
              _button2['default'],
              {
                disabled: submitLoading,
                funcType: 'raised',
                onClick: _this.goPrevStep.bind(_this, 2)
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.prev' })
            )
          )
        )
      );
    }, _this.handleChoiceRemove = function (value) {
      var _this$state4 = _this.state,
          showSelectedRowKeys = _this$state4.showSelectedRowKeys,
          showSelected = _this$state4.showSelected;

      var deleteItemIndex = showSelectedRowKeys.findIndex(function (item) {
        return item === value;
      });
      var deleteRowItemIndex = showSelected.findIndex(function (item) {
        return item.id === value;
      });
      showSelectedRowKeys.splice(deleteItemIndex, 1);
      showSelected.splice(deleteRowItemIndex, 1);
      _this.setState({
        createSelectedRowKeys: showSelectedRowKeys,
        showSelectedRowKeys: showSelectedRowKeys,
        showSelected: showSelected
      });
    }, _this.changeInformPerson = function (checkedValue) {
      if (checkedValue.indexOf('user') === -1) {
        _this.setState({
          createSelected: [],
          createSelectedRowKeys: [],
          showSelected: [],
          showSelectedRowKeys: [],
          createSelectedTemp: []
        });
      }
      _this.setState({
        informArr: checkedValue
      });
    }, _this.handleOpenUsersModal = function () {
      var showSelected = _this.state.showSelected;

      _this.setState({
        isShowModal: true,
        createSelected: showSelected,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        filters: {},
        userParams: [],
        loading: true
      }, function () {
        _this.loadUsers();
      });
    }, _this.handlePageChange = function (pagination, filters, sort, params) {
      _this.loadUsers(pagination, filters, sort, params);
    }, _this.handleAddUsers = function () {
      var _this$state5 = _this.state,
          createSelected = _this$state5.createSelected,
          createSelectedRowKeys = _this$state5.createSelectedRowKeys;

      _this.setState({
        showSelected: createSelected,
        showSelectedRowKeys: createSelectedRowKeys,
        isShowModal: false
      });
    }, _this.handleCloseModal = function () {
      var showSelectedRowKeys = _this.state.showSelectedRowKeys;

      _this.setState({
        createSelectedRowKeys: showSelectedRowKeys,
        isShowModal: false
      });
    }, _this.onCreateSelectChange = function (keys, selected) {
      var s = [];
      var a = _this.state.createSelectedTemp.concat(selected);
      _this.setState({ createSelectedTemp: a });
      (0, _map3['default'])(keys, function (o) {
        if ((0, _filter3['default'])(a, ['id', o]).length) {
          s.push((0, _filter3['default'])(a, ['id', o])[0]);
        }
      });
      _this.setState({
        createSelectedRowKeys: keys,
        createSelected: s
      });
    }, _this.getModalContent = function () {
      var _this$state6 = _this.state,
          pagination = _this$state6.pagination,
          userParams = _this$state6.userParams,
          loading = _this$state6.loading,
          createSelectedRowKeys = _this$state6.createSelectedRowKeys;
      var intl = _this.props.intl;

      var rowSelection = {
        selectedRowKeys: createSelectedRowKeys,
        onChange: _this.onCreateSelectChange
      };
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.login.name' }),
        dataIndex: 'loginName',
        key: 'loginName',
        width: '50%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.4 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.real.name' }),
        dataIndex: 'realName',
        key: 'realName',
        width: '50%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.4 },
            text
          );
        }
      }];

      return _react2['default'].createElement(_table2['default'], {
        loading: loading,
        columns: columns,
        pagination: pagination,
        dataSource: _taskDetail2['default'].getUserData,
        filters: userParams,
        rowKey: 'id',
        onChange: _this.handlePageChange,
        rowSelection: rowSelection,
        filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
      });
    }, _this.handleRenderFourthStep = function () {
      var stepPrefix = 'c7n-iam-create-task-content-step4-container';
      var contentPrefix = 'c7n-iam-create-task-content';
      var _this$props4 = _this.props,
          formatMessage = _this$props4.intl.formatMessage,
          AppState = _this$props4.AppState;

      var level = _this.getLevelName();
      var _this$state7 = _this.state,
          firstStepValues = _this$state7.firstStepValues,
          serviceName = _this$state7.serviceName,
          submitLoading = _this$state7.submitLoading,
          params = _this$state7.params,
          informArr = _this$state7.informArr,
          showSelected = _this$state7.showSelected;

      var tableData = [];
      Object.entries(params).map(function (item) {
        return tableData.push({ name: item[0], value: item[1] });
      });
      var unit = void 0;
      switch (firstStepValues.simpleRepeatIntervalUnit) {
        case 'SECONDS':
          unit = formatMessage({ id: intlPrefix + '.seconds' });
          break;
        case 'MINUTES':
          unit = formatMessage({ id: intlPrefix + '.minutes' });
          break;
        case 'HOURS':
          unit = formatMessage({ id: intlPrefix + '.hours' });
          break;
        case 'DAYS':
          unit = formatMessage({ id: intlPrefix + '.days' });
          break;
        default:
          break;
      }
      var infoList = [{
        key: formatMessage({ id: intlPrefix + '.task.name' }),
        value: firstStepValues.name
      }, {
        key: formatMessage({ id: intlPrefix + '.task.description' }),
        value: firstStepValues.description
      }, {
        key: formatMessage({ id: intlPrefix + '.task.start.time' }),
        value: firstStepValues.startTime.format('YYYY-MM-DD HH:mm:ss')
      }, {
        key: formatMessage({ id: intlPrefix + '.task.end.time' }),
        value: firstStepValues.endTime ? firstStepValues.endTime.format('YYYY-MM-DD HH:mm:ss') : null
      }, {
        key: formatMessage({ id: intlPrefix + '.cron.expression' }),
        value: firstStepValues.triggerType === 'simple-trigger' ? null : firstStepValues.cronExpression
      }, {
        key: formatMessage({ id: intlPrefix + '.trigger.type' }),
        value: formatMessage({ id: firstStepValues.triggerType === 'simple-trigger' ? intlPrefix + '.simple.trigger' : intlPrefix + '.cron.trigger' })
      }, {
        key: formatMessage({ id: intlPrefix + '.repeat.interval' }),
        value: firstStepValues.triggerType === 'simple-trigger' ? '' + firstStepValues.simpleRepeatInterval + unit : null
      }, {
        key: formatMessage({ id: intlPrefix + '.repeat.time' }),
        value: firstStepValues.simpleRepeatCount || null
      }, {
        key: formatMessage({ id: intlPrefix + '.execute-strategy' }),
        value: formatMessage({ id: intlPrefix + '.' + firstStepValues.executeStrategy.toLowerCase() }) || '阻塞'
      }, {
        key: formatMessage({ id: intlPrefix + '.service.name' }),
        value: serviceName
      }, {
        key: formatMessage({ id: intlPrefix + '.task.class.name' }),
        value: _taskDetail2['default'].getCurrentClassNames.description
      }, {
        key: formatMessage({ id: intlPrefix + '.params.data' }),
        value: ''
      }];

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.name' }),
        key: 'name',
        dataIndex: 'name'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.params.value' }),
        key: 'value',
        dataIndex: 'value',
        render: function render(text) {
          return '' + text;
        }
      }];
      return _react2['default'].createElement(
        'div',
        null,
        infoList.map(function (_ref6) {
          var key = _ref6.key,
              value = _ref6.value;
          return _react2['default'].createElement(
            _row2['default'],
            { key: key, className: (0, _classnames5['default'])(stepPrefix + '-row', { 'c7n-iam-create-task-content-step4-container-row-hide': value === null }) },
            _react2['default'].createElement(
              _col2['default'],
              { span: 3 },
              key,
              ':'
            ),
            _react2['default'].createElement(
              _col2['default'],
              { span: 21 },
              value
            )
          );
        }),
        _react2['default'].createElement(_table2['default'], {
          style: { width: '512px' },
          pagination: false,
          columns: columns,
          dataSource: tableData,
          filterBar: false
        }),
        _react2['default'].createElement(
          _row2['default'],
          { className: stepPrefix + '-informlist' },
          _react2['default'].createElement(
            _col2['default'],
            { span: 3 },
            formatMessage({ id: intlPrefix + '.inform.person' }),
            ':'
          ),
          _react2['default'].createElement(
            _col2['default'],
            { span: 21 },
            informArr.length ? _react2['default'].createElement(
              'ul',
              { style: { paddingLeft: '0' } },
              _react2['default'].createElement(
                'li',
                { className: (0, _classnames5['default'])((0, _defineProperty3['default'])({}, stepPrefix + '-informlist-li-hide', informArr.indexOf(AppState.getUserInfo.id) === -1)) },
                formatMessage({ id: intlPrefix + '.creator' })
              ),
              _react2['default'].createElement(
                'li',
                { className: (0, _classnames5['default'])((0, _defineProperty3['default'])({}, stepPrefix + '-informlist-li-hide', informArr.indexOf('manager') === -1)) },
                level,
                formatMessage({ id: intlPrefix + '.manager' })
              ),
              _react2['default'].createElement(
                'li',
                { className: (0, _classnames5['default'])((0, _defineProperty3['default'])({}, stepPrefix + '-informlist-li-hide', informArr.indexOf('user') === -1)) },
                formatMessage({ id: intlPrefix + '.user' }),
                ':',
                showSelected.length ? _react2['default'].createElement(
                  'div',
                  { className: stepPrefix + '-informlist-name-container' },
                  showSelected.map(function (item) {
                    return _react2['default'].createElement(
                      'div',
                      { key: item.id },
                      _react2['default'].createElement(
                        'span',
                        null,
                        item.loginName,
                        item.realName
                      ),
                      _react2['default'].createElement(
                        'span',
                        null,
                        '\u3001'
                      )
                    );
                  })
                ) : _react2['default'].createElement(
                  'div',
                  { className: stepPrefix + '-informlist-name-container' },
                  formatMessage({ id: intlPrefix + '.empty' })
                )
              )
            ) : _react2['default'].createElement(
              'span',
              null,
              formatMessage({ id: intlPrefix + '.empty' })
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: contentPrefix + '-btn-group' },
          _react2['default'].createElement(
            _button2['default'],
            {
              type: 'primary',
              funcType: 'raised',
              loading: submitLoading,
              onClick: _this.handleSubmit.bind(_this, 4)
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'create' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              disabled: submitLoading,
              funcType: 'raised',
              onClick: _this.goPrevStep.bind(_this, 3)
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step.prev' })
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              disabled: submitLoading,
              funcType: 'raised',
              onClick: _this.goBack
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
          )
        )
      );
    }, _this.handleSubmit = function (step, e) {
      e.preventDefault();
      var _this$props5 = _this.props,
          form = _this$props5.form,
          intl = _this$props5.intl,
          AppState = _this$props5.AppState;
      var _this$taskdetail7 = _this.taskdetail,
          type = _this$taskdetail7.type,
          id = _this$taskdetail7.id;

      _this.setState({
        submitLoading: true
      });
      form.validateFieldsAndScroll(function (err, values) {
        if (!err) {
          if (step === 1) {
            _this.setState({
              firstStepValues: (0, _extends3['default'])({}, values),
              current: step + 1,
              submitLoading: false
            }, function () {
              if (!_taskDetail2['default'].service.length) {
                _this.loadService();
              }
            });
          } else if (step === 2) {
            if (values.methodId === 'empty') {
              Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.noprogram' }));
              _this.setState({
                submitLoading: false
              });
              return;
            }

            _this.setState((0, _extends3['default'])({}, values, {
              current: step + 1,
              submitLoading: false
            }));
          } else if (step === 3) {
            _this.setState({
              current: step + 1,
              submitLoading: false
            });
          } else {
            var _this$state8 = _this.state,
                informArr = _this$state8.informArr,
                showSelectedRowKeys = _this$state8.showSelectedRowKeys,
                methodId = _this$state8.methodId,
                params = _this$state8.params,
                _this$state8$firstSte = _this$state8.firstStepValues,
                executeStrategy = _this$state8$firstSte.executeStrategy,
                startTime = _this$state8$firstSte.startTime,
                endTime = _this$state8$firstSte.endTime,
                cronExpression = _this$state8$firstSte.cronExpression,
                simpleRepeatInterval = _this$state8$firstSte.simpleRepeatInterval,
                simpleRepeatIntervalUnit = _this$state8$firstSte.simpleRepeatIntervalUnit,
                simpleRepeatCount = _this$state8$firstSte.simpleRepeatCount,
                triggerType = _this$state8$firstSte.triggerType;

            var flag = triggerType === 'simple-trigger';
            var body = (0, _extends3['default'])({}, _this.state.firstStepValues, {
              startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
              endTime: endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : null,
              cronExpression: flag ? null : cronExpression,
              simpleRepeatInterval: flag ? Number(simpleRepeatInterval) : null,
              simpleRepeatIntervalUnit: flag ? simpleRepeatIntervalUnit : null,
              simpleRepeatCount: flag ? Number(simpleRepeatCount) : null,
              executeStrategy: executeStrategy,
              params: params,
              methodId: methodId,
              notifyUser: {
                administrator: informArr.indexOf('manager') !== -1,
                creator: informArr.indexOf(AppState.getUserInfo.id) !== -1,
                assigner: informArr.indexOf('user') !== -1
              },
              assignUserIds: showSelectedRowKeys
            });

            _taskDetail2['default'].createTask(body, type, id).then(function (_ref7) {
              var failed = _ref7.failed,
                  message = _ref7.message;

              if (failed) {
                Choerodon.prompt(message);
                _this.setState({
                  submitLoading: false
                });
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                _this.setState({
                  submitLoading: false
                }, function () {
                  _this.goBack();
                });
              }
            })['catch'](function () {
              Choerodon.prompt(intl.formatMessage({ id: 'create.error' }));
              _this.setState({
                submitLoading: false
              });
            });
            _this.setState({
              submitLoading: false
            });
          }
        } else {
          _this.setState({
            submitLoading: false
          });
        }
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(TaskCreate, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        current: 1,
        loading: true, // 指定用户表格加载状态
        triggerType: 'simple-trigger', // 创建任务默认触发类型
        startTime: null,
        endTime: null,
        cronLoading: 'empty', // cron popover的状态
        cronTime: [],
        submitLoading: false, // 提交表单时下一步按钮的状态
        paramsData: [], // 参数列表的数据
        informArr: [], // 通知对象
        isShowModal: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        sort: {
          columnKey: 'id',
          order: 'descend'
        },
        filters: {},
        userParams: [],
        createSelectedRowKeys: [], // 模态框中选中的key
        createSelectedTemp: [],
        createSelected: [], // 模态框中选中的row
        showSelectedRowKeys: [], // 页面显示的key
        showSelected: [], // 页面的row
        params: {} // 参数列表参数
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initTaskDetail();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _taskDetail2['default'].setService([]);
      _taskDetail2['default'].setClassNames([]);
      _taskDetail2['default'].setCurrentService({});
      _taskDetail2['default'].setCurrentClassNames({});
      _taskDetail2['default'].setUserData([]);
    }
  }, {
    key: 'initTaskDetail',
    value: function initTaskDetail() {
      this.taskdetail = new TaskDetailType(this);
    }

    /**
     * 返回列表页
     */


    /**
     * 获取步骤条状态
     * @param index
     * @returns {string}
     */


    /**
     * 任务名称唯一性校验
     * @param rule 表单校验规则
     * @param value 任务名称
     * @param callback 回调函数
     */


    /* 时间选择器处理 -- start */

  }, {
    key: 'changeValue',

    /* 时间选择器处理 -- end */

    /**
     *  创建任务切换触发类型
     * @param e
     */
    value: function changeValue(e) {
      var resetFields = this.props.form.resetFields;

      resetFields(['simpleRepeatInterval', 'simpleRepeatCount', 'simpleRepeatIntervalUnit', 'cronExpression']);
      this.setState({
        triggerType: e.target.value
      });
    }

    /**
     * 校验cron表达式
     */


    /**
     * cron表达式popover提示内容
     * @returns {*}
     */

  }, {
    key: 'handleChangeService',


    /**
     * 服务名变换时
     * @param service 服务名
     */
    value: function handleChangeService(service) {
      var currentService = [service];
      _taskDetail2['default'].setCurrentService(currentService);
      this.loadClass();
    }

    /**
     * 类名变换时
     * @param id
     */

  }, {
    key: 'handleChangeClass',
    value: function handleChangeClass(id) {
      var currentClass = _taskDetail2['default'].classNames.find(function (item) {
        return item.id === id;
      });
      _taskDetail2['default'].setCurrentClassNames(currentClass);
      this.loadParamsTable();
    }

    /**
     * 获取所有服务名
     */


    /**
     * 获取对应服务名的类名
     */


    /**
     * 获取参数列表
     */


    /**
     * 返回上一步
     * @param index
     */


    /**
     * 渲染第一步
     * @returns {*}
     */


    /**
     * 渲染第二步
     * @returns {*}
     */


    /**
     * 获取当前层级名称
     * @returns {*}
     */


    /**
     * 渲染第三步
     * @returns {*}
     */


    /**
     * 移除指定用户标签
     * @param value 用户id
     */


    /**
     * 通知对象变化时
     * @param checkedValue array 选中的通知对象
     */


    /**
     * 开启指定用户模态框
     */

  }, {
    key: 'loadUsers',


    /**
     * 加载指定用户数据
     * @param paginationIn
     * @param filtersIn
     * @param sortIn
     * @param paramsIn
     */
    value: function loadUsers(paginationIn, filtersIn, sortIn, paramsIn) {
      var _this2 = this;

      var _state = this.state,
          paginationState = _state.pagination,
          sortState = _state.sort,
          paramsState = _state.userParams;

      var pagination = paginationIn || paginationState;
      var sort = sortIn || sortState;
      var userParams = paramsIn || paramsState;
      var _taskdetail = this.taskdetail,
          type = _taskdetail.type,
          id = _taskdetail.id;
      // 防止标签闪烁

      this.setState({ loading: true });
      _taskDetail2['default'].loadUserDatas(pagination, sort, userParams, type, id).then(function (data) {
        _taskDetail2['default'].setUserData(data.content.slice());
        _this2.setState({
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements
          },
          loading: false,
          userParams: userParams
        });
      });
    }

    /**
     * 指定用户模态框-确定
     */


    /**
     * 关闭指定用户模态框
     */


    /**
     * 模态框选择的key变化时
     * @param keys 用户id
     * @param selected 当前行数据
     */


    /**
     * 渲染第四步
     */

  }, {
    key: 'render',
    value: function render() {
      var current = this.state.current;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['asgard-service.schedule-task-site.check', 'asgard-service.schedule-task-org.check', 'asgard-service.schedule-task-project.check', 'asgard-service.schedule-task-site.cron', 'asgard-service.schedule-task-org.cron', 'asgard-service.schedule-task-project.cron', 'manager-service.service.pageAll', 'asgard-service.schedule-method-site.getMethodByService', 'asgard-service.schedule-method-org.getMethodByService', 'asgard-service.schedule-method-project.getMethodByService', 'asgard-service.schedule-method-site.pagingQuery', 'asgard-service.schedule-method-org.pagingQuery', 'asgard-service.schedule-method-project.pagingQuery', 'asgard-service.schedule-task-site.create', 'asgard-service.schedule-task-org.create', 'asgard-service.schedule-task-project.create']
        },
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create' }),
          backPath: this.getBackPath()
        }),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: this.taskdetail.code + '.create',
            values: this.taskdetail.values,
            className: 'c7n-iam-create-task-page'
          },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-create-task-container' },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-create-task-container-steps' },
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
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step2.title' })
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
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step3.title' })
                  ),
                  status: this.getStatus(3)
                }),
                _react2['default'].createElement(Step, {
                  title: _react2['default'].createElement(
                    'span',
                    { style: {
                        color: current === 4 ? '#3F51B5' : '',
                        fontSize: 14
                      }
                    },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.step4.title' })
                  ),
                  status: this.getStatus(4)
                })
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-create-task-content' },
              current === 1 && this.handleRenderFirstStep(),
              current === 2 && this.handleRenderSecStep(),
              current === 3 && this.handleRenderThirdStep(),
              current === 4 && this.handleRenderFourthStep()
            )
          )
        )
      );
    }
  }]);
  return TaskCreate;
}(_react.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'disabledDateStartTime', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this3 = this;

    return function (date) {
      _this3.startTimes = date;
      if (date && _this3.endTimes && _this3.endTimes.day() === date.day()) {
        if (_this3.endTimes.hour() === date.hour() && _this3.endTimes.minute() === date.minute()) {
          return {
            disabledHours: function disabledHours() {
              return _this3.range(_this3.endTimes.hour() + 1, 24);
            },
            disabledMinutes: function disabledMinutes() {
              return _this3.range(_this3.endTimes.minute() + 1, 60);
            },
            disabledSeconds: function disabledSeconds() {
              return _this3.range(_this3.endTimes.second(), 60);
            }
          };
        } else if (_this3.endTimes.hour() === date.hour()) {
          return {
            disabledHours: function disabledHours() {
              return _this3.range(_this3.endTimes.hour() + 1, 24);
            },
            disabledMinutes: function disabledMinutes() {
              return _this3.range(_this3.endTimes.minute() + 1, 60);
            }
          };
        } else {
          return {
            disabledHours: function disabledHours() {
              return _this3.range(_this3.endTimes.hour() + 1, 24);
            }
          };
        }
      }
    };
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'clearStartTimes', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (status) {
      if (!status) {
        _this4.endTimes = null;
      }
    };
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'clearEndTimes', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function (status) {
      if (!status) {
        _this5.startTimes = null;
      }
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'disabledDateEndTime', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this6 = this;

    return function (date) {
      _this6.endTimes = date;
      if (date && _this6.startTimes && _this6.startTimes.day() === date.day()) {
        if (_this6.startTimes.hour() === date.hour() && _this6.startTimes.minute() === date.minute()) {
          return {
            disabledHours: function disabledHours() {
              return _this6.range(0, _this6.startTimes.hour());
            },
            disabledMinutes: function disabledMinutes() {
              return _this6.range(0, _this6.startTimes.minute());
            },
            disabledSeconds: function disabledSeconds() {
              return _this6.range(0, _this6.startTimes.second() + 1);
            }
          };
        } else if (_this6.startTimes.hour() === date.hour()) {
          return {
            disabledHours: function disabledHours() {
              return _this6.range(0, _this6.startTimes.hour());
            },
            disabledMinutes: function disabledMinutes() {
              return _this6.range(0, _this6.startTimes.minute());
            }
          };
        } else {
          return {
            disabledHours: function disabledHours() {
              return _this6.range(0, _this6.startTimes.hour());
            }
          };
        }
      }
    };
  }
})), _class2)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = TaskCreate;
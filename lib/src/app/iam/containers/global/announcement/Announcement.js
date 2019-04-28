'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _datePicker = require('choerodon-ui/lib/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _radio = require('choerodon-ui/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/date-picker/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/radio/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _mobx = require('mobx');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./Announcement.scss');

var _statusTag = require('../../../components/statusTag');

var _statusTag2 = _interopRequireDefault(_statusTag);

var _editor = require('../../../components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

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

(0, _mobx.configure)({ enforceActions: false });

// 匹配html界面为空白的正则。
var patternHTMLEmpty = /^(((<[^>]+>)*\s*)|&nbsp;|\s)*$/g;
var inputWidth = '512px';
var iconType = {
  COMPLETED: 'COMPLETED',
  SENDING: 'RUNNING',
  WAITING: 'UN_START'
  // FAILED: 'FAILED',
};
var FormItem = _form2['default'].Item;
var RadioGroup = _radio2['default'].Group;
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
var Sidebar = _modal2['default'].Sidebar;
// 公用方法类

var AnnouncementType = function AnnouncementType(context) {
  (0, _classCallCheck3['default'])(this, AnnouncementType);

  this.context = context;
  var AppState = this.context.props.AppState;

  this.data = AppState.currentMenuType;
  var _data = this.data,
      type = _data.type,
      id = _data.id,
      name = _data.name;

  var codePrefix = type === 'organization' ? 'organization' : 'global';

  this.code = codePrefix + '.msgrecord';
  this.values = { name: name || 'Choerodon' };
  this.type = type;
  this.orgId = id;
  this.apiPrefix = '/notify/v1/system_notice';
  this.intlPrefix = codePrefix + '.announcement';
  this.intlValue = type === 'organization' ? name : AppState.getSiteInfo.systemName || 'Choerodon';
};

var Announcement = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = (_class2 = function (_Component) {
  (0, _inherits3['default'])(Announcement, _Component);

  function Announcement() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Announcement);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Announcement.__proto__ || Object.getPrototypeOf(Announcement)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.initAnnouncement = function () {
      var AnnouncementStore = _this.props.AnnouncementStore;

      _this.announcementType = new AnnouncementType(_this);
      AnnouncementStore.setAnnouncementType(_this.announcementType);
      AnnouncementStore.loadData();
    }, _this.handleTableChange = function (pagination, filters, sort, params) {
      _this.fetchData(pagination, filters, sort, params);
    }, _this.handleOk = function () {
      var _this$props = _this.props,
          _this$props$Announcem = _this$props.AnnouncementStore,
          editorContent = _this$props$Announcem.editorContent,
          currentRecord = _this$props$Announcem.currentRecord,
          selectType = _this$props$Announcem.selectType,
          AnnouncementStore = _this$props.AnnouncementStore,
          form = _this$props.form,
          intl = _this$props.intl;

      if (selectType !== 'detail') {
        form.validateFields(function (err, values) {
          if (!err) {
            AnnouncementStore.setSubmitting(true);
            if (editorContent === null || patternHTMLEmpty.test(editorContent)) {
              AnnouncementStore.setSubmitting(false);
              Choerodon.prompt(intl.formatMessage({ id: 'announcement.content.required' }));
            } else if (editorContent && !patternHTMLEmpty.test(editorContent)) {
              if (selectType === 'create') {
                AnnouncementStore.createAnnouncement((0, _extends3['default'])({}, values, {
                  content: editorContent,
                  sendDate: values.sendDate.format('YYYY-MM-DD HH:mm:ss'),
                  endDate: values.endDate && values.endDate.format('YYYY-MM-DD HH:mm:ss')
                })).then(function (data) {
                  AnnouncementStore.setSubmitting(false);
                  if (!data.failed) {
                    Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                    _this.handleRefresh();
                    AnnouncementStore.hideSideBar();
                  } else {
                    Choerodon.prompt(data.message);
                  }
                });
              } else {
                AnnouncementStore.modifyAnnouncement((0, _extends3['default'])({}, values, {
                  id: currentRecord.id,
                  objectVersionNumber: currentRecord.objectVersionNumber,
                  scheduleTaskId: currentRecord.scheduleTaskId,
                  status: currentRecord.status,
                  content: editorContent,
                  sendDate: values.sendDate.format('YYYY-MM-DD HH:mm:ss')
                })).then(function (data) {
                  AnnouncementStore.setSubmitting(false);
                  if (!data.failed) {
                    Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                    _this.handleRefresh();
                    AnnouncementStore.hideSideBar();
                  } else {
                    Choerodon.prompt(data.message);
                  }
                });
              }
            } else {
              AnnouncementStore.setSubmitting(false);
              Choerodon.prompt(intl.formatMessage({ id: 'announcement.content.required' }));
            }
          } else {
            AnnouncementStore.setSubmitting(false);
          }
        });
      } else {
        AnnouncementStore.hideSideBar();
      }
    }, _this.handleRefresh = function () {
      _this.props.AnnouncementStore.refresh();
    }, _this.handleCancel = function () {
      _this.props.AnnouncementStore.hideSideBar();
      _this.setState(_this.getInitState());
    }, _this.handleDelete = function (record) {
      var _this$props2 = _this.props,
          intl = _this$props2.intl,
          AnnouncementStore = _this$props2.AnnouncementStore;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: 'announcement.delete.title' }, { name: record.title }),
        content: intl.formatMessage({ id: 'announcement.delete.content' + (record.status === 'COMPLETED' ? '.send' : '') }),
        onOk: function onOk() {
          return AnnouncementStore.deleteAnnouncementById(record.id).then(function (_ref2) {
            var failed = _ref2.failed,
                message = _ref2.message;

            if (failed) {
              Choerodon.prompt(message);
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.handleRefresh();
            }
          });
        }
      });
    }, _this.handleOpen = function (selectType) {
      var record = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _this$props3 = _this.props,
          AnnouncementStore = _this$props3.AnnouncementStore,
          form = _this$props3.form;

      form.resetFields();
      if (_this.editor) {
        _this.editor.initEditor();
      }
      AnnouncementStore.setEditorContent(selectType === 'create' ? null : record.content);
      AnnouncementStore.setCurrentRecord(record);
      AnnouncementStore.setSelectType(selectType);
      AnnouncementStore.showSideBar();
    }, _this.renderAction = function (text, record) {
      return _react2['default'].createElement(
        _react2['default'].Fragment,
        null,
        record.status === 'WAITING' && _react2['default'].createElement(
          _choerodonBootCombine.Permission,
          { service: ['notify-service.system-announcement.update'] },
          _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
              placement: 'bottom'
            },
            _react2['default'].createElement(_button2['default'], {
              size: 'small',
              icon: 'mode_edit',
              shape: 'circle',
              onClick: function onClick() {
                return _this.handleOpen('modify', record);
              }
            })
          )
        ),
        _react2['default'].createElement(
          _tooltip2['default'],
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.detail' }),
            placement: 'bottom'
          },
          _react2['default'].createElement(_button2['default'], {
            shape: 'circle',
            icon: 'find_in_page',
            size: 'small',
            onClick: function onClick() {
              return _this.handleOpen('detail', record);
            }
          })
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Permission,
          { service: ['notify-service.system-announcement.delete'] },
          _react2['default'].createElement(
            _tooltip2['default'],
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete' }),
              placement: 'bottom'
            },
            _react2['default'].createElement(_button2['default'], {
              size: 'small',
              icon: 'delete_forever',
              shape: 'circle',
              onClick: function onClick() {
                return _this.handleDelete(record);
              }
            })
          )
        )
      );
    }, _this.disabledShowDate = function (current) {
      var endDate = (0, _moment2['default'])(_this.props.form.getFieldValue('sendDate'));
      if (endDate) {
        return current < endDate.add(1, 'days');
      } else {
        return current < (0, _moment2['default'])().subtract(1, 'days');
      }
    }, _this.disabledStartDate = function (sendDate) {
      var endDate = _this.state.endDate;
      if (!sendDate || !endDate) {
        return false;
      }
      if (endDate.format().split('T')[1] === '00:00:00+08:00') {
        return sendDate.format().split('T')[0] >= endDate.format().split('T')[0];
      } else {
        return sendDate.format().split('T')[0] > endDate.format().split('T')[0];
      }
    }, _this.disabledEndDate = function (endDate) {
      var sendDate = _this.state.sendDate;
      if (!endDate || !sendDate) {
        return false;
      }
      return endDate.valueOf() <= sendDate.valueOf();
    }, _this.range = function (start, end) {
      var result = [];
      for (var i = start; i < end; i += 1) {
        result.push(i);
      }
      return result;
    }, _initDefineProp(_this, 'disabledDateStartTime', _descriptor, _this), _initDefineProp(_this, 'clearStartTimes', _descriptor2, _this), _initDefineProp(_this, 'clearEndTimes', _descriptor3, _this), _initDefineProp(_this, 'disabledDateEndTime', _descriptor4, _this), _this.onStartChange = function (value) {
      _this.onChange('sendDate', value);
    }, _this.onEndChange = function (value) {
      _this.onChange('endDate', value);
    }, _this.onChange = function (field, value) {
      var setFieldsValue = _this.props.form.setFieldsValue;

      _this.setState((0, _defineProperty3['default'])({}, field, value), function () {
        setFieldsValue((0, _defineProperty3['default'])({}, field, _this.state[field]));
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Announcement, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        sendDate: null,
        endDate: null
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initAnnouncement();
    }
  }, {
    key: 'fetchData',
    value: function fetchData(pagination, filters, sort, params) {
      this.props.AnnouncementStore.loadData(pagination, filters, { columnKey: 'id', order: 'descend' }, params);
    }
  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      var _props = this.props,
          intl = _props.intl,
          filters = _props.AnnouncementStore.filters;
      var intlPrefix = this.announcementType.intlPrefix;

      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.title' }),
        dataIndex: 'title',
        key: 'title',
        filters: [],
        filteredValue: filters.title || [],
        width: '10%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.1 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.content' }),
        dataIndex: 'textContent',
        key: 'textContent',
        className: 'nowarp'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'status' }),
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        filters: Object.keys(iconType).map(function (value) {
          return {
            text: intl.formatMessage({ id: 'announcement.' + value.toLowerCase() }),
            value: value
          };
        }),
        filteredValue: filters.status || [],
        render: function render(status) {
          return _react2['default'].createElement(_statusTag2['default'], {
            mode: 'icon',
            name: intl.formatMessage({ id: status ? 'announcement.' + status.toLowerCase() : 'announcement.completed' }),
            colorCode: status ? iconType[status] : iconType.COMPLETED
          });
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.send-time' }),
        dataIndex: 'sendDate',
        key: 'sendDate',
        width: '10%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.15 },
            text
          );
        }
      }, {
        title: '',
        width: '14%',
        key: 'action',
        align: 'right',
        render: this.renderAction
      }];
    }
  }, {
    key: 'renderSidebarOkText',
    value: function renderSidebarOkText() {
      var selectType = this.props.AnnouncementStore.selectType;

      var text = void 0;
      switch (selectType) {
        case 'create':
          text = 'create';
          break;
        case 'modify':
          text = 'save';
          break;
        case 'detail':
          text = 'close';
          break;
        default:
          break;
      }
      return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: '' + text });
    }
  }, {
    key: 'disabledDate',
    value: function disabledDate(current) {
      return current < (0, _moment2['default'])().subtract(1, 'days');
    }
    /* 时间选择器处理 -- start */

  }, {
    key: 'renderForm',

    /* 时间选择器处理 -- end */

    value: function renderForm() {
      var _this2 = this;

      var _props2 = this.props,
          _props2$AnnouncementS = _props2.AnnouncementStore,
          editorContent = _props2$AnnouncementS.editorContent,
          selectType = _props2$AnnouncementS.selectType,
          currentRecord = _props2$AnnouncementS.currentRecord,
          AnnouncementStore = _props2.AnnouncementStore,
          intl = _props2.intl,
          _props2$form = _props2.form,
          getFieldDecorator = _props2$form.getFieldDecorator,
          getFieldValue = _props2$form.getFieldValue;

      var isModify = selectType === 'modify';
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-announcement-siderbar-content' },
        _react2['default'].createElement(
          _form2['default'],
          null,
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('sendDate', {
              rules: [{
                required: true,
                message: '请输入发送时间'
              }],
              initialValue: isModify ? (0, _moment2['default'])(currentRecord.sendDate) : undefined
            })(_react2['default'].createElement(_datePicker2['default'], {
              className: 'c7n-iam-announcement-siderbar-content-datepicker',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.send.date' }),
              style: { width: inputWidth },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate: this.disabledStartDate,
              disabledTime: this.disabledDateStartTime,
              showTime: { defaultValue: (0, _moment2['default'])('00:00:00', 'HH:mm:ss') },
              getCalendarContainer: function getCalendarContainer(that) {
                return that;
              },
              onChange: this.onStartChange,
              onOpenChange: this.clearStartTimes
            }))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('sendNotices', {
              rules: [],
              initialValue: isModify ? currentRecord.sendNotices : true
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.send.letter' }),
                className: 'radioGroup'
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: true },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: false },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('sticky', {
              rules: [],
              initialValue: isModify ? currentRecord.sticky || false : false
            })(_react2['default'].createElement(
              RadioGroup,
              {
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.send.is-sticky' }),
                className: 'radioGroup'
              },
              _react2['default'].createElement(
                _radio2['default'],
                { value: true },
                intl.formatMessage({ id: 'yes' })
              ),
              _react2['default'].createElement(
                _radio2['default'],
                { value: false },
                intl.formatMessage({ id: 'no' })
              )
            ))
          ),
          getFieldValue('sticky') ? _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('endDate', {
              rules: [{
                required: true,
                message: '请输入结束显示时间'
              }],
              initialValue: isModify && currentRecord.endDate ? (0, _moment2['default'])(currentRecord.endDate) : undefined
            })(_react2['default'].createElement(_datePicker2['default'], {
              className: 'c7n-iam-announcement-siderbar-content-datepicker',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.end-date' }),
              style: { width: inputWidth },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate: this.disabledEndDate,
              disabledTime: this.disabledDateEndTime,
              showTime: { defaultValue: (0, _moment2['default'])() },
              getCalendarContainer: function getCalendarContainer(that) {
                return that;
              },
              onChange: this.onEndChange,
              onOpenChange: this.clearEndTimes
            }))
          ) : null,
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            getFieldDecorator('title', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: 'announcement.title.required' })
              }],
              initialValue: isModify ? currentRecord.title : undefined
            })(_react2['default'].createElement(_input2['default'], { autoComplete: 'off', style: { width: inputWidth }, label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.title' }) }))
          )
        ),
        _react2['default'].createElement(
          'p',
          { className: 'content-text' },
          '\u516C\u544A\u5185\u5BB9\uFF1A'
        ),
        _react2['default'].createElement(_editor2['default'], {
          value: editorContent,
          onRef: function onRef(node) {
            _this2.editor = node;
          },
          onChange: function onChange(value) {
            AnnouncementStore.setEditorContent(value);
          }
        })
      );
    }
  }, {
    key: 'renderDetail',
    value: function renderDetail(_ref3) {
      var content = _ref3.content,
          status = _ref3.status,
          sendDate = _ref3.sendDate,
          endDate = _ref3.endDate,
          sticky = _ref3.sticky;
      var intl = this.props.intl;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-announcement-detail' },
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            null,
            intl.formatMessage({ id: 'status' }),
            '\uFF1A'
          ),
          _react2['default'].createElement(
            'div',
            { className: 'inline' },
            _react2['default'].createElement(_statusTag2['default'], {
              style: { fontSize: 14, color: 'rgba(0,0,0,0.65)' },
              mode: 'icon',
              name: intl.formatMessage({ id: status ? 'announcement.' + status.toLowerCase() : 'announcement.completed' }),
              colorCode: iconType[status]
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            null,
            intl.formatMessage({ id: 'announcement.send.date' }),
            '\uFF1A'
          ),
          _react2['default'].createElement(
            'span',
            { className: 'send-time' },
            sendDate
          )
        ),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            null,
            intl.formatMessage({ id: 'announcement.send.is-sticky' }),
            '\uFF1A'
          ),
          _react2['default'].createElement(
            'span',
            { className: 'send-time' },
            intl.formatMessage({ id: sticky ? 'yes' : 'no' })
          )
        ),
        sticky ? _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            null,
            intl.formatMessage({ id: 'announcement.end-date' }),
            '\uFF1A'
          ),
          _react2['default'].createElement(
            'span',
            { className: 'send-time' },
            endDate
          )
        ) : null,
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'span',
            null,
            intl.formatMessage({ id: 'global.announcement.content' }),
            '\uFF1A'
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-announcement-detail-wrapper' },
          _react2['default'].createElement('div', {
            className: 'c7n-iam-announcement-detail-content',
            dangerouslySetInnerHTML: { __html: '' + content }
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          intl = _props3.intl,
          _props3$AnnouncementS = _props3.AnnouncementStore,
          announcementData = _props3$AnnouncementS.announcementData,
          loading = _props3$AnnouncementS.loading,
          pagination = _props3$AnnouncementS.pagination,
          params = _props3$AnnouncementS.params,
          sidebarVisible = _props3$AnnouncementS.sidebarVisible,
          currentRecord = _props3$AnnouncementS.currentRecord,
          submitting = _props3$AnnouncementS.submitting;
      var intlPrefix = this.announcementType.intlPrefix;
      var selectType = this.props.AnnouncementStore.selectType;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['notify-service.system-announcement.pagingQuery', 'notify-service.system-announcement.create', 'notify-service.system-announcement.update', 'notify-service.system-announcement.delete']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['notify-service.system-announcement.create'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: function onClick() {
                  return _this3.handleOpen('create');
                },
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'announcement.add' })
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
            values: { name: this.announcementType.intlValue }
          },
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            className: 'c7n-iam-announcement',
            columns: this.getTableColumns(),
            dataSource: announcementData.slice(),
            pagination: pagination,
            filters: params,
            onChange: this.handleTableChange,
            rowKey: 'id',
            filterBarPlaceholder: intl.formatMessage({ id: 'filtertable' })
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.sidebar.title.' + selectType }),
              onOk: this.handleOk,
              okText: this.renderSidebarOkText(),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              okCancel: selectType !== 'detail',
              onCancel: this.handleCancel,
              confirmLoading: submitting,
              visible: sidebarVisible
            },
            (selectType === 'create' || selectType === 'modify') && this.renderForm(),
            selectType === 'detail' && this.renderDetail(currentRecord)
          )
        )
      );
    }
  }]);
  return Announcement;
}(_react.Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'disabledDateStartTime', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (date) {
      _this4.sendDates = date;
      if (date && _this4.endDates && _this4.endDates.day() === date.day()) {
        if (_this4.endDates.hour() === date.hour() && _this4.endDates.minute() === date.minute()) {
          return {
            disabledHours: function disabledHours() {
              return _this4.range(_this4.endDates.hour() + 1, 24);
            },
            disabledMinutes: function disabledMinutes() {
              return _this4.range(_this4.endDates.minute() + 1, 60);
            },
            disabledSeconds: function disabledSeconds() {
              return _this4.range(_this4.endDates.second(), 60);
            }
          };
        } else if (_this4.endDates.hour() === date.hour()) {
          return {
            disabledHours: function disabledHours() {
              return _this4.range(_this4.endDates.hour() + 1, 24);
            },
            disabledMinutes: function disabledMinutes() {
              return _this4.range(_this4.endDates.minute() + 1, 60);
            }
          };
        } else {
          return {
            disabledHours: function disabledHours() {
              return _this4.range(_this4.endDates.hour() + 1, 24);
            }
          };
        }
      }
    };
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'clearStartTimes', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function (status) {
      if (!status) {
        _this5.endDates = null;
      }
    };
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'clearEndTimes', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this6 = this;

    return function (status) {
      if (!status) {
        _this6.sendDates = null;
      }
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'disabledDateEndTime', [_mobx.action], {
  enumerable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (date) {
      _this7.endDates = date;
      if (date && _this7.sendDates && _this7.sendDates.day() === date.day()) {
        if (_this7.sendDates.hour() === date.hour() && _this7.sendDates.minute() === date.minute()) {
          return {
            disabledHours: function disabledHours() {
              return _this7.range(0, _this7.sendDates.hour());
            },
            disabledMinutes: function disabledMinutes() {
              return _this7.range(0, _this7.sendDates.minute());
            },
            disabledSeconds: function disabledSeconds() {
              return _this7.range(0, _this7.sendDates.second() + 1);
            }
          };
        } else if (_this7.sendDates.hour() === date.hour()) {
          return {
            disabledHours: function disabledHours() {
              return _this7.range(0, _this7.sendDates.hour());
            },
            disabledMinutes: function disabledMinutes() {
              return _this7.range(0, _this7.sendDates.minute());
            }
          };
        } else {
          return {
            disabledHours: function disabledHours() {
              return _this7.range(0, _this7.sendDates.hour());
            }
          };
        }
      }
    };
  }
})), _class2)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = Announcement;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _datePicker = require('choerodon-ui/lib/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _class; /**
             * 图表日期选择
             */

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/date-picker/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('./TimePicker.scss');

var _reactIntl = require('react-intl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RangePicker = _datePicker2['default'].RangePicker;

var ButtonGroup = _button2['default'].Group;
var disabledDate = function disabledDate(current) {
  return current && current > (0, _moment2['default'])().endOf('day');
};

var TimePicker = (0, _reactIntl.injectIntl)(_class = function (_Component) {
  (0, _inherits3['default'])(TimePicker, _Component);

  function TimePicker(props) {
    (0, _classCallCheck3['default'])(this, TimePicker);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (TimePicker.__proto__ || Object.getPrototypeOf(TimePicker)).call(this, props));

    _this.handleDatePicker = function (date, dateString) {
      var _this$props = _this.props,
          handleSetStartTime = _this$props.handleSetStartTime,
          handleSetEndTime = _this$props.handleSetEndTime,
          handleSetStartDate = _this$props.handleSetStartDate,
          handleSetEndDate = _this$props.handleSetEndDate,
          unlimit = _this$props.unlimit,
          func = _this$props.func;

      if ((0, _moment2['default'])(dateString[1]).format() > (0, _moment2['default'])(dateString[0]).add(29, 'days').format() && !unlimit) {
        Choerodon.prompt('暂支持最多查看30天，已自动截取开始日期后30天。');
        handleSetStartTime((0, _moment2['default'])(dateString[0]));
        handleSetEndTime((0, _moment2['default'])(dateString[0]).add(29, 'days'));
        handleSetStartDate((0, _moment2['default'])(dateString[0]));
        handleSetEndDate((0, _moment2['default'])(dateString[0]).add(29, 'days'));
      } else {
        handleSetStartTime((0, _moment2['default'])(dateString[0]));
        handleSetEndTime((0, _moment2['default'])(dateString[1]));
        handleSetStartDate((0, _moment2['default'])(dateString[0]));
        handleSetEndDate((0, _moment2['default'])(dateString[1]));
      }
      _this.setState({
        type: ''
      }, function () {
        func();
      });
    };

    _this.state = {
      type: 7 // 默认时间选择为近7天
    };
    return _this;
  }

  (0, _createClass3['default'])(TimePicker, [{
    key: 'handleClick',
    value: function handleClick() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 7;
      var _props = this.props,
          func = _props.func,
          handleSetStartTime = _props.handleSetStartTime,
          handleSetEndTime = _props.handleSetEndTime;

      handleSetEndTime((0, _moment2['default'])());
      handleSetStartTime((0, _moment2['default'])().subtract(val - 1, 'days'));
      this.setState({
        type: val
      }, function () {
        func();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          startTime = _props2.startTime,
          endTime = _props2.endTime,
          showDatePicker = _props2.showDatePicker,
          intl = _props2.intl;
      var type = this.state.type;

      var btnInfo = [{
        // name: intl.formatMessage({ id: 'time.seven.days' }),
        name: '近7天',
        value: 7
      }, {
        // name: intl.formatMessage({ id: 'time.fifteen.days' }),
        name: '近15天',
        value: 15
      }, {
        name: '近30天',
        value: 30
      }];
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-chart-date-wrap' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-chart-date-wrap-btn' },
          _react2['default'].createElement(
            ButtonGroup,
            null,
            btnInfo.map(function (_ref) {
              var name = _ref.name,
                  value = _ref.value;
              return _react2['default'].createElement(
                _button2['default'],
                { key: value, value: value, style: { backgroundColor: _this2.state.type === value ? 'rgba(0,0,0,.08)' : '' }, onClick: _this2.handleClick.bind(_this2, value) },
                name
              );
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          {
            className: (0, _classnames2['default'])('c7n-iam-chart-date-time-pick', { 'c7n-iam-chart-date-time-pick-selected': type === '' }),
            style: { display: showDatePicker ? 'inlineBlock' : 'none' }
          },
          _react2['default'].createElement(RangePicker, {
            disabledDate: disabledDate,
            value: [startTime, endTime],
            allowClear: false,
            onChange: this.handleDatePicker
          })
        )
      );
    }
  }]);
  return TimePicker;
}(_react.Component)) || _class;

exports['default'] = TimePicker;
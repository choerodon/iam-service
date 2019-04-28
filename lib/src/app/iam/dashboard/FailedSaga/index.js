'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/spin/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _echartsForReact = require('echarts-for-react');

var _echartsForReact2 = _interopRequireDefault(_echartsForReact);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _failedSaga = require('../../stores/dashboard/failedSaga');

var _failedSaga2 = _interopRequireDefault(_failedSaga);

var _timePicker = require('../../components/timePicker');

var _timePicker2 = _interopRequireDefault(_timePicker);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.failedsaga';

var FailedSaga = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(FailedSaga, _Component);

  function FailedSaga(props) {
    (0, _classCallCheck3['default'])(this, FailedSaga);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (FailedSaga.__proto__ || Object.getPrototypeOf(FailedSaga)).call(this, props));

    _this.loadChart = function () {
      _failedSaga2['default'].setLoading(true);
      var startDate = _failedSaga2['default'].getStartTime.format().split('T')[0];
      var endDate = _failedSaga2['default'].getEndTime.format().split('T')[0];
      _failedSaga2['default'].loadData(startDate, endDate);
    };

    _this.handleDateChoose = function (type) {
      _this.setState({ dateType: type });
    };

    _this.state = {
      dateType: 'seven'
    };
    return _this;
  }

  (0, _createClass3['default'])(FailedSaga, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadChart();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _failedSaga2['default'].setStartTime((0, _moment2['default'])().subtract(6, 'days'));
      _failedSaga2['default'].setEndTime((0, _moment2['default'])());
    }
  }, {
    key: 'getOption',
    value: function getOption() {
      var chartData = _failedSaga2['default'].getChartData;
      var intl = this.props.intl;

      return {
        color: ['#F44336'],
        tooltip: {
          trigger: 'axis',
          confine: true,
          borderWidth: 1,
          backgroundColor: '#fff',
          borderColor: '#DDDDDD',
          extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
          textStyle: {
            fontSize: 13,
            color: '#000000'
          }
        },
        grid: {
          top: '10px',
          left: '3%',
          right: '4%',
          bottom: '5px',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: chartData ? chartData.date : [],
          axisLine: {
            lineStyle: {
              color: '#eee',
              type: 'solid',
              width: 2
            },
            onZero: true
          },
          axisLabel: {
            margin: 11, // X轴文字和坐标线之间的间距
            textStyle: {
              color: 'rgba(0, 0, 0, 0.65)',
              fontSize: 12
            },
            formatter: function formatter(value) {
              var month = value.split('-')[1];
              var day = value.split('-')[2];
              return month + '/' + day;
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1,
              type: 'solid'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          name: intl.formatMessage({ id: intlPrefix + '.times' }),
          nameLocation: 'end',
          nameTextStyle: {
            color: '#000'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#eee'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee']
            }
          },
          axisLabel: {
            color: 'rgba(0,0,0,0.65)'
          }
        }],
        series: [{
          name: intl.formatMessage({ id: intlPrefix + '.failed.times' }),
          type: 'bar',
          barWidth: '60%',
          data: chartData ? chartData.data : []
        }]
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-failedsaga' },
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardToolBar,
          null,
          _react2['default'].createElement(_timePicker2['default'], {
            startTime: _failedSaga2['default'].getStartTime,
            endTime: _failedSaga2['default'].getEndTime,
            func: this.loadChart,
            handleSetStartTime: function handleSetStartTime(startTime) {
              return _failedSaga2['default'].setStartTime(startTime);
            },
            handleSetEndTime: function handleSetEndTime(endTime) {
              return _failedSaga2['default'].setEndTime(endTime);
            }
          })
        ),
        _react2['default'].createElement(
          _spin2['default'],
          { spinning: _failedSaga2['default'].loading },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-failedsaga-chart' },
            _react2['default'].createElement(_echartsForReact2['default'], {
              style: { height: '100%' },
              option: this.getOption()
            })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            _reactRouterDom.Link,
            { to: '/iam/saga-instance' },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.redirect' })
          )
        )
      );
    }
  }]);
  return FailedSaga;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = FailedSaga;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _uniqBy2 = require('lodash/uniqBy');

var _uniqBy3 = _interopRequireDefault(_uniqBy2);

var _dec, _class; /* eslint-disable */


require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/select/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _echartsForReact = require('echarts-for-react');

var _echartsForReact2 = _interopRequireDefault(_echartsForReact);

require('./APIOverview.scss');

var _apiOverview = require('../../../stores/global/api-overview');

var _apiOverview2 = _interopRequireDefault(_apiOverview);

var _timePicker = require('../../../components/timePicker');

var _timePicker2 = _interopRequireDefault(_timePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Option = _select2['default'].Option;

var intlPrefix = 'global.apioverview';
var colorArr = ['#FDB34E', '#5266D4', '#FD717C', '#53B9FC', '#F44336', '#6B83FC', '#B5D7FD', '#00BFA5']; // 默认取色

var APIOverview = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(APIOverview, _Component);

  function APIOverview() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, APIOverview);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = APIOverview.__proto__ || Object.getPrototypeOf(APIOverview)).call.apply(_ref, [this].concat(args))), _this), _this.state = _this.getInitState(), _this.handleRefresh = function () {
      _this.initTime();
      _apiOverview2['default'].setThirdLoading(true);
      _this.loadFirstChart();
      _this.setState(_this.getInitState(), function () {
        _this.loadSecChart();
        _apiOverview2['default'].loadServices().then(function (data) {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else if (data.length) {
            var handledData = (0, _uniqBy3['default'])(data.map(function (item) {
              return item = { name: item.name.split(':')[1] };
            }), 'name');
            _apiOverview2['default'].setService(handledData);
            _apiOverview2['default'].setCurrentService(handledData[0]);
            var startDate = _apiOverview2['default'].thirdStartTime.format().split('T')[0];
            var endDate = _apiOverview2['default'].thirdEndTime.format().split('T')[0];
            _apiOverview2['default'].loadThirdChart(startDate, endDate, handledData[0].name);
          }
        })['catch'](function (error) {
          Choerodon.handleResponseError(error);
        });
      });
    }, _this.initTime = function () {
      _apiOverview2['default'].setSecStartTime((0, _moment2['default'])().subtract(6, 'days'));
      _apiOverview2['default'].setThirdStartTime((0, _moment2['default'])().subtract(6, 'days'));
      _apiOverview2['default'].setSecEndTime((0, _moment2['default'])());
      _apiOverview2['default'].setThirdEndTime((0, _moment2['default'])());
      _apiOverview2['default'].setThirdStartDate(null);
      _apiOverview2['default'].setThirdEndDate(null);
    }, _this.loadFirstChart = function () {
      _apiOverview2['default'].setFirstLoading(true);
      _apiOverview2['default'].loadFirstChart();
    }, _this.loadSecChart = function () {
      _apiOverview2['default'].setSecLoading(true);
      var startDate = _apiOverview2['default'].getSecStartTime.format().split('T')[0];
      var endDate = _apiOverview2['default'].getSecEndTime.format().split('T')[0];
      _apiOverview2['default'].loadSecChart(startDate, endDate);
    }, _this.loadThirdChart = function () {
      _apiOverview2['default'].setThirdLoading(true);
      var currentService = _apiOverview2['default'].getCurrentService;
      var startDate = _apiOverview2['default'].getThirdStartTime.format().split('T')[0];
      var endDate = _apiOverview2['default'].getThirdEndTime.format().split('T')[0];
      _apiOverview2['default'].loadThirdChart(startDate, endDate, currentService.name);
    }, _this.getFirstChart = function () {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-api-overview-top-container-first-container' },
        _apiOverview2['default'].firstLoading ? _react2['default'].createElement(_spin2['default'], { spinning: _apiOverview2['default'].firstLoading }) : _react2['default'].createElement(_echartsForReact2['default'], {
          style: { width: '100%', height: 380 },
          option: _this.getFirstChartOption()
        })
      );
    }, _this.getSecChart = function () {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-api-overview-top-container-sec-container' },
        _react2['default'].createElement(
          _spin2['default'],
          { spinning: _apiOverview2['default'].secLoading },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-api-overview-top-container-sec-container-timewrapper' },
            _react2['default'].createElement(_timePicker2['default'], {
              showDatePicker: false,
              startTime: _apiOverview2['default'].getSecStartTime,
              endTime: _apiOverview2['default'].getSecEndTime,
              handleSetStartTime: function handleSetStartTime(startTime) {
                return _apiOverview2['default'].setSecStartTime(startTime);
              },
              handleSetEndTime: function handleSetEndTime(endTime) {
                return _apiOverview2['default'].setSecEndTime(endTime);
              },
              func: _this.loadSecChart
            })
          ),
          _react2['default'].createElement(_echartsForReact2['default'], {
            style: { width: '100%', height: 380 },
            option: _this.getSecChartOption(),
            notMerge: true
          })
        )
      );
    }, _this.getThirdChart = function () {
      var intl = _this.props.intl;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-api-overview-third-container' },
        _react2['default'].createElement(
          _spin2['default'],
          { spinning: _apiOverview2['default'].thirdLoading },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-api-overview-third-container-timewrapper' },
            _react2['default'].createElement(
              _select2['default'],
              {
                style: { width: '175px', marginRight: '34px' },
                value: _apiOverview2['default'].currentService.name,
                getPopupContainer: function getPopupContainer() {
                  return document.getElementsByClassName('page-content')[0];
                },
                onChange: _this.handleChange.bind(_this),
                label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.belong' })
              },
              _this.getOptionList()
            ),
            _react2['default'].createElement(_timePicker2['default'], {
              showDatePicker: true,
              startTime: _apiOverview2['default'].getThirdStartDate,
              endTime: _apiOverview2['default'].getThirdEndDate,
              func: _this.loadThirdChart,
              handleSetStartTime: function handleSetStartTime(startTime) {
                return _apiOverview2['default'].setThirdStartTime(startTime);
              },
              handleSetEndTime: function handleSetEndTime(endTime) {
                return _apiOverview2['default'].setThirdEndTime(endTime);
              },
              handleSetStartDate: function handleSetStartDate(startTime) {
                return _apiOverview2['default'].setThirdStartDate(startTime);
              },
              handleSetEndDate: function handleSetEndDate(endTime) {
                return _apiOverview2['default'].setThirdEndDate(endTime);
              }
            })
          ),
          _react2['default'].createElement(_echartsForReact2['default'], {
            className: 'c7n-iam-api-overview-third-chart',
            style: { width: '100%', height: 400 },
            option: _this.getThirdChartOption(),
            notMerge: true
          })
        )
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(APIOverview, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadFirstChart();
      this.loadSecChart();
      _apiOverview2['default'].setThirdLoading(true);
      _apiOverview2['default'].loadServices().then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else if (data.length) {
          var handledData = data.map(function (item) {
            return item = { name: item.name.split(':')[1] };
          });
          _apiOverview2['default'].setService(handledData);
          _apiOverview2['default'].setCurrentService(handledData[0]);
          var startDate = _apiOverview2['default'].thirdStartTime.format().split('T')[0];
          var endDate = _apiOverview2['default'].thirdEndTime.format().split('T')[0];
          _apiOverview2['default'].loadThirdChart(startDate, endDate, handledData[0].name);
        }
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.initTime();
      _apiOverview2['default'].setCurrentService({});
      _apiOverview2['default'].setService([]);
      _apiOverview2['default'].setFirstChartData(null);
      _apiOverview2['default'].setSecChartData(null);
      _apiOverview2['default'].setThirdChartData(null);
    }
  }, {
    key: 'getInitState',
    value: function getInitState() {
      return {
        dateType: 'seven',
        thirdDateType: 'seven'
      };
    }
  }, {
    key: 'getOptionList',


    /* 微服务下拉框 */
    value: function getOptionList() {
      var intl = this.props.intl;

      var service = _apiOverview2['default'].getService;
      return service && service.length > 0 ? service.map(function (_ref2, index) {
        var name = _ref2.name;
        return _react2['default'].createElement(
          Option,
          { key: index, value: name },
          name
        );
      }) : _react2['default'].createElement(
        Option,
        { value: 'empty' },
        intl.formatMessage({ id: intlPrefix + '.belong.empty' })
      );
    }

    /**
     * 微服务下拉框改变事件
     * @param serviceName 服务名称
     */

  }, {
    key: 'handleChange',
    value: function handleChange(serviceName) {
      var currentService = _apiOverview2['default'].service.find(function (service) {
        return service.name === serviceName;
      });
      _apiOverview2['default'].setCurrentService(currentService);
      this.loadThirdChart();
    }

    // 获取第一个图表的配置参数

  }, {
    key: 'getFirstChartOption',
    value: function getFirstChartOption() {
      var intl = this.props.intl;
      var firstChartData = _apiOverview2['default'].firstChartData;

      var handledFirstChartData = void 0;
      if (firstChartData) {
        handledFirstChartData = firstChartData.services.map(function (item, index) {
          return item = { name: item, value: firstChartData.apiCounts[index] };
        });
      }
      return {
        title: {
          text: intl.formatMessage({ id: intlPrefix + '.api.total.count' }),
          textStyle: {
            color: 'rgba(0,0,0,0.87)',
            fontWeight: '400'
          },
          top: 20,
          left: 16
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{b} <br/>百分比: {d}% <br/>总数: {c}',
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#DDDDDD',
          extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
          textStyle: {
            fontSize: 13,
            color: '#000000'
          }
        },
        legend: {
          right: 15,
          itemHeight: 11,
          y: 'center',
          type: 'plain',
          data: firstChartData ? firstChartData.services : [],
          orient: 'vertical', // 图例纵向排列
          icon: 'circle'
        },
        // calculable: true,
        series: [{
          type: 'pie',
          radius: [20, 110],
          center: ['31%', '50%'],
          roseType: 'radius',
          minAngle: 30,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          data: handledFirstChartData || {}
        }],
        color: colorArr
      };
    }

    // 获取第二个图表的配置参数

  }, {
    key: 'getSecChartOption',
    value: function getSecChartOption() {
      var secChartData = _apiOverview2['default'].getSecChartData;
      var formatMessage = this.props.intl.formatMessage;

      var handleSeriesData = [];
      if (secChartData) {
        handleSeriesData = secChartData.details.map(function (item) {
          return {
            type: 'line',
            name: item.service,
            data: item.data,
            smooth: 0.5,
            smoothMonotone: 'x',
            symbol: 'circle',
            areaStyle: {
              opacity: '0.5'
            }
          };
        });
      }
      return {
        title: {
          text: formatMessage({ id: intlPrefix + '.api.used.count' }),
          textStyle: {
            color: 'rgba(0,0,0,0.87)',
            fontWeight: '400'
          },
          top: 20,
          left: 16
        },

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
        legend: {
          top: 60,
          right: 16,
          itemHeight: 11,
          type: 'plain',
          orient: 'vertical', // 图例纵向排列
          icon: 'circle',
          data: secChartData ? secChartData.service : []
        },
        grid: {
          left: '3%',
          top: 110,
          width: '65%',
          height: '55%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#eee',
              type: 'solid',
              width: 2
            },
            onZero: true
          },
          axisLabel: {
            margin: 7, // X轴文字和坐标线之间的间距
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
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1,
              type: 'solid'
            }
          },
          data: secChartData ? secChartData.date : []
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          name: '次数',
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
          axisTick: {
            show: false
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
        series: handleSeriesData,
        color: colorArr
      };
    }

    // 获取第三个图表的配置参数

  }, {
    key: 'getThirdChartOption',
    value: function getThirdChartOption() {
      var formatMessage = this.props.intl.formatMessage;

      var thirdChartData = _apiOverview2['default'].getThirdChartData;
      var copyThirdChartData = JSON.parse(JSON.stringify(thirdChartData));
      var handledData = [];
      var handledApis = {};
      if (thirdChartData) {
        handledData = thirdChartData.details.map(function (item) {
          return {
            type: 'line',
            name: item.api.split(':')[1] + ': ' + item.api.split(':')[0],
            data: item.data,
            smooth: 0.2
          };
        });
        if (copyThirdChartData.api.length) {
          copyThirdChartData.api.map(function (item) {
            handledApis[item] = false;
          });
          var selectedApis = copyThirdChartData.api.splice(0, 10);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = selectedApis[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;

              handledApis[item] = true;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          handledApis = {};
        }
      }

      return {
        title: {
          text: formatMessage({ id: intlPrefix + '.api.single.count' }),
          textStyle: {
            color: 'rgba(0,0,0,0.87)',
            fontWeight: '400'
          },
          top: 20,
          left: 16
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          borderWidth: 1,
          backgroundColor: '#fff',
          borderColor: '#DDDDDD',
          extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
          textStyle: {
            fontSize: 13,
            color: '#000000'
          },

          formatter: function formatter(params) {
            return '<div>\n              <div>' + params.name + '</div>\n              <div><span class="c7n-iam-apioverview-charts-tooltip" style="background-color:' + params.color + ';"></span>' + params.seriesName + '</div>\n              <div>\u6B21\u6570: ' + params.value + '</div>\n            <div>';
          }
        },
        legend: {
          show: true,
          type: 'scroll',
          orient: 'vertical', // 图例纵向排列
          itemHeight: 11,
          top: 80,
          left: '72%',
          // right: 5,
          icon: 'circle',
          height: '70%',
          data: thirdChartData ? thirdChartData.api : [],
          selected: handledApis,
          formatter: function formatter(name) {
            var showLength = 44; // 截取长度
            if (name.length > showLength) {
              name = name.substring(0, showLength) + '...';
            }
            return name;
            //           let strFirstPart;
            //           let strSecPart;
            //           let strThirdPart;
            //           let result;
            //           const length = name.length / 48;
            //           const perLength = 48;
            //           if (length > 1 && length <= 2) {
            //             strFirstPart = name.substring(0, perLength);
            //             strSecPart = name.substring(perLength);
            //             result = `${strFirstPart}
            // ${strSecPart}`;
            //           } else if (length > 2) {
            //             strFirstPart = name.substring(0, perLength);
            //             strSecPart = name.substring(perLength, perLength * 2);
            //             strThirdPart = name.substring(perLength * 2);
            //             result = `${strFirstPart}
            // ${strSecPart}
            // ${strThirdPart}`;
            //           } else {
            //             result = name;
            //           }
            //           return result;
          },

          tooltip: {
            show: true
          }
        },
        grid: {
          left: '3%',
          top: 110,
          containLabel: true,
          width: '66%',
          height: '62.5%'
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#eee',
              type: 'solid',
              width: 2
            },
            onZero: true
          },
          axisLabel: {
            margin: 7, // X轴文字和坐标线之间的间距
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
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#eee'],
              width: 1,
              type: 'solid'
            }
          },
          data: thirdChartData ? thirdChartData.date : []
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          name: '次数',
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
          axisTick: {
            show: false
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
        series: handledData,
        color: colorArr
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['manager-service.api.queryInstancesAndApiCount', 'manager-service.api.queryApiInvoke', 'manager-service.api.queryServiceInvoke']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
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
          null,
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-api-overview-top-container' },
            this.getFirstChart(),
            this.getSecChart()
          ),
          this.getThirdChart()
        )
      );
    }
  }]);
  return APIOverview;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = APIOverview;
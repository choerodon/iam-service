'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

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

var _dec, _class;

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/table/style');

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

require('./SiteStatistics.scss');

var _siteStatistics = require('../../../stores/global/site-statistics');

var _siteStatistics2 = _interopRequireDefault(_siteStatistics);

var _timePicker = require('../../../components/timePicker');

var _timePicker2 = _interopRequireDefault(_timePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Option = _select2['default'].Option;

var intlPrefix = 'global.site-statistics';
var colorArr = ['#FDB34E', '#5266D4', '#FD717C', '#53B9FC', '#F44336', '#6B83FC', '#B5D7FD', '#00BFA5']; // 默认取色

var SiteStatistics = (_dec = (0, _mobxReact.inject)('AppState', 'MenuStore'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(SiteStatistics, _Component);

  function SiteStatistics() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, SiteStatistics);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = SiteStatistics.__proto__ || Object.getPrototypeOf(SiteStatistics)).call.apply(_ref, [this].concat(args))), _this), _this.handleRefresh = function () {
      _this.initTime();
      _siteStatistics2['default'].setLoading(true);
      var startDate = _siteStatistics2['default'].startTime.format().split('T')[0];
      var endDate = _siteStatistics2['default'].endTime.format().split('T')[0];
      _siteStatistics2['default'].loadChart(startDate, endDate, _siteStatistics2['default'].getCurrentLevel).then(function () {
        _this.props.MenuStore.loadMenuData({ type: _siteStatistics2['default'].getCurrentLevel }).then(function (data) {
          _siteStatistics2['default'].appendTableData(data);
        });
      });
    }, _this.initTime = function () {
      _siteStatistics2['default'].setStartTime((0, _moment2['default'])().subtract(6, 'days'));
      _siteStatistics2['default'].setEndTime((0, _moment2['default'])());
      _siteStatistics2['default'].setStartDate(null);
      _siteStatistics2['default'].setEndDate(null);
    }, _this.loadChart = function () {
      _siteStatistics2['default'].setLoading(true);
      var currentLevel = _siteStatistics2['default'].getCurrentLevel;
      var startDate = _siteStatistics2['default'].getStartTime.format().split('T')[0];
      var endDate = _siteStatistics2['default'].getEndTime.format().split('T')[0];
      _siteStatistics2['default'].loadChart(startDate, endDate, currentLevel).then(function () {
        _this.props.MenuStore.loadMenuData({ type: _siteStatistics2['default'].getCurrentLevel }).then(function (data) {
          _siteStatistics2['default'].appendTableData(data);
        });
      });
    }, _this.getChart = function () {
      var intl = _this.props.intl;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-site-statistics-third-container' },
        _react2['default'].createElement(
          _spin2['default'],
          { spinning: _siteStatistics2['default'].loading },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-site-statistics-third-container-timewrapper' },
            _react2['default'].createElement(
              _select2['default'],
              {
                style: { width: '175px', marginRight: '34px' },
                value: _siteStatistics2['default'].currentLevel,
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
              startTime: _siteStatistics2['default'].getStartDate,
              endTime: _siteStatistics2['default'].getEndDate,
              func: _this.loadChart,
              handleSetStartTime: function handleSetStartTime(startTime) {
                return _siteStatistics2['default'].setStartTime(startTime);
              },
              handleSetEndTime: function handleSetEndTime(endTime) {
                return _siteStatistics2['default'].setEndTime(endTime);
              },
              handleSetStartDate: function handleSetStartDate(startTime) {
                return _siteStatistics2['default'].setStartDate(startTime);
              },
              handleSetEndDate: function handleSetEndDate(endTime) {
                return _siteStatistics2['default'].setEndDate(endTime);
              }
            })
          ),
          _react2['default'].createElement(_echartsForReact2['default'], {
            className: 'c7n-iam-site-statistics-third-chart',
            style: { width: '100%', height: 400 },
            option: _this.getChartOption(),
            notMerge: true
          })
        )
      );
    }, _this.getTable = function () {
      return _react2['default'].createElement(_table2['default'], {
        columns: _this.getTableColumns(),
        dataSource: _siteStatistics2['default'].getTableData.slice(),
        rowKey: 'code',
        fixed: true
      });
    }, _this.clickDownload = function () {
      var intl = _this.props.intl;

      var str = '\u65F6\u95F4\u8303\u56F4\uFF1A' + _siteStatistics2['default'].startTime.format().split('T')[0].replace('-', '.') + ' -- ' + _siteStatistics2['default'].endTime.format().split('T')[0].replace('-', '.') + '\n\u83DC\u5355\u540D\u79F0,\u83DC\u5355\u7F16\u7801,\u83DC\u5355\u70B9\u51FB\u603B\u6570,\u5C42\u7EA7';
      _siteStatistics2['default'].getAllTableDate().then(function (data) {
        data.forEach(function (v) {
          str += '\n' + v.name + ',' + v.code + ',' + v.sum + ',' + intl.formatMessage({ id: v.level });
        });
        str = encodeURIComponent(str);
        var aLink = document.getElementById('download');
        aLink.download = _this.getDownloadName();
        aLink.href = 'data:text/csv;charset=utf-8,\uFEFF' + str;
        aLink.click();
      });
    }, _this.getDownloadName = function () {
      var momentTime = (0, _moment2['default'])(new Date().getTime());
      return '\u5E73\u53F0\u83DC\u5355\u7EDF\u8BA1-' + momentTime.format('YYYYMMDDHHmm') + '.csv';
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(SiteStatistics, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _siteStatistics2['default'].setCurrentLevel('site');
      this.handleRefresh();
    }
  }, {
    key: 'getTableColumns',
    value: function getTableColumns() {
      return [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        onFilter: function onFilter(value, record) {
          return record.name.toString().indexOf(value) === 0;
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '50%'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.table.click-sum' }),
        dataIndex: 'sum',
        key: 'sum',
        width: '20%',
        defaultSortOrder: 'descend',
        sorter: function sorter(a, b) {
          return a.sum - b.sum;
        }
      }];
    }
  }, {
    key: 'getOptionList',
    value: function getOptionList() {
      var intl = this.props.intl;

      var level = ['site', 'project', 'organization', 'user'];
      return level.map(function (name, index) {
        return _react2['default'].createElement(
          Option,
          { key: index, value: name },
          intl.formatMessage({ id: name })
        );
      });
    }
  }, {
    key: 'handleChange',
    value: function handleChange(level) {
      _siteStatistics2['default'].setCurrentLevel(level);
      this.props.MenuStore.loadMenuData({ type: level }).then(function (data) {
        _siteStatistics2['default'].appendTableData(data);
      });
      this.loadChart();
    }
  }, {
    key: 'getChartOption',
    value: function getChartOption() {
      var formatMessage = this.props.intl.formatMessage;

      var chartData = _siteStatistics2['default'].getChartData;
      var copyChartData = JSON.parse(JSON.stringify(chartData));
      var handledData = [];
      var handledApis = {};
      if (chartData) {
        handledData = chartData.details.map(function (item) {
          return {
            type: 'line',
            name: item.menu.split(':')[1] + ': ' + item.menu.split(':')[0],
            data: item.data,
            smooth: 0.2
          };
        });
        if (copyChartData.menu.length) {
          copyChartData.menu.forEach(function (item) {
            handledApis[item] = false;
          });
          var selectedApis = copyChartData.menu.splice(0, 10);
          selectedApis.forEach(function (item) {
            handledApis[item] = true;
          });
        } else {
          handledApis = {};
        }
      }

      return {
        title: {
          text: formatMessage({ id: intlPrefix + '.menu.count' }),
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
            return '<div>\n              <div>' + params.name + '</div>\n              <div><span class="c7n-iam-sitestatics-charts-tooltip" style="background-color:' + params.color + ';"></span>' + params.seriesName + '</div>\n              <div>\u6B21\u6570: ' + params.value + '</div>\n            <div>';
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
          data: chartData ? chartData.menu : [],
          selected: handledApis,
          formatter: function formatter(name) {
            var showLength = 44; // 截取长度
            name = name.split(':')[1];
            if (name.length > showLength) {
              name = name.substring(0, showLength) + '...';
            }
            return name;
          },

          tooltip: {
            show: true,
            formatter: function formatter(item) {
              return item.name;
            }
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
          data: chartData ? chartData.date : []
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
          service: ['manager-service.statistic.queryMenuClick']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' })
          },
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.clickDownload,
              icon: 'get_app'
            },
            '\u5BFC\u51FA\u8868\u683Ccsv\u6587\u4EF6'
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.handleRefresh,
              icon: 'refresh'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          ),
          _react2['default'].createElement('a', { id: 'download', download: 'site-statistics.csv', href: '#' })
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          null,
          this.getChart(),
          this.getTable()
        )
      );
    }
  }]);
  return SiteStatistics;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = SiteStatistics;
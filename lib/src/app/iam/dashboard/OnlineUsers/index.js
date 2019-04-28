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

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

var _echartsForReact = require('echarts-for-react');

var _echartsForReact2 = _interopRequireDefault(_echartsForReact);

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'dashboard.onlineusers';

var OnlineUsers = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(OnlineUsers, _Component);

  function OnlineUsers(props) {
    (0, _classCallCheck3['default'])(this, OnlineUsers);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (OnlineUsers.__proto__ || Object.getPrototypeOf(OnlineUsers)).call(this, props));

    _this.handleMessage = function (data) {
      _this.setState({
        info: {
          time: data.time,
          data: data.data
        }
      });
    };

    _this.getContent = function (data) {
      var content = void 0;
      if (data) {
        content = _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-onlineuser-main' },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-dashboard-onlineuser-main-current' },
              _react2['default'].createElement(
                'span',
                null,
                data ? data.CurrentOnliners : 0
              ),
              _react2['default'].createElement(
                'span',
                null,
                '\u4EBA'
              )
            ),
            _react2['default'].createElement(_echartsForReact2['default'], {
              style: { height: '60%', width: '100%' },
              option: _this.getOption()
            })
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-onlineuser-bottom' },
            '\u65E5\u603B\u8BBF\u95EE\u91CF: ',
            data ? data.numberOfVisitorsToday : 0
          )
        );
      } else {
        content = _react2['default'].createElement(_spin2['default'], { spinning: true });
      }
      return content;
    };

    _this.state = {
      loading: true,
      info: {
        time: [],
        data: []
      }
    };
    return _this;
  }

  (0, _createClass3['default'])(OnlineUsers, [{
    key: 'getOption',
    value: function getOption() {
      var info = this.state.info;
      var formatMessage = this.props.intl.formatMessage;

      return {
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: '{b}:00<br/>' + formatMessage({ id: 'dashboard.onlineusers.count' }) + ': {c}' + formatMessage({ id: 'dashboard.onlineusers.persons' }),
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
          show: false
        },

        grid: {
          left: '-10',
          bottom: '0px',
          height: '80%',
          width: '100%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          show: false,
          boundaryGap: false,
          data: info ? info.time : []
        }],
        yAxis: [{
          type: 'value',
          show: false,
          minInterval: 1
        }],
        series: [{
          name: formatMessage({ id: 'dashboard.onlineusers.count' }),
          type: 'line',
          areaStyle: {
            color: 'rgba(82,102,212,0.80)'
          },
          smooth: true,
          symbolSize: 0,
          data: info ? info.data : [],
          lineStyle: {
            width: 0
          }
        }]
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var loading = this.state.loading;

      return _react2['default'].createElement(
        _choerodonBootCombine.WSHandler,
        {
          messageKey: 'choerodon:msg:online-info',
          onMessage: this.handleMessage
        },
        function (data) {
          return _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-onlineuser', ref: function ref(e) {
                _this2.chartRef = e;
              } },
            _this2.getContent(data)
          );
        }
      );
    }
  }]);
  return OnlineUsers;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = OnlineUsers;
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

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _dec, _class;

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/button/style');

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

var _organizationStatistics = require('../../stores/dashboard/organizationStatistics');

var _organizationStatistics2 = _interopRequireDefault(_organizationStatistics);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonGroup = _button2['default'].Group;

var OrganizationStatistics = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(OrganizationStatistics, _Component);

  function OrganizationStatistics() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, OrganizationStatistics);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = OrganizationStatistics.__proto__ || Object.getPrototypeOf(OrganizationStatistics)).call.apply(_ref, [this].concat(args))), _this), _this.loadChart = function () {
      _organizationStatistics2['default'].setLoading(true);
      _organizationStatistics2['default'].loadOrganizations();
    }, _this.renderOrgs = function () {
      var orgs = _organizationStatistics2['default'].getOrganizations;
      var btns = orgs.map(function (_ref2) {
        var name = _ref2.name,
            id = _ref2.id;
        return _react2['default'].createElement(
          _button2['default'],
          { key: id, value: id, onClick: _this.setOrgId.bind(_this, id), style: { backgroundColor: _organizationStatistics2['default'].getCurrentOrg === id ? 'rgba(140,158,255,0.16' : '', color: _organizationStatistics2['default'].getCurrentOrg === id ? '#3f51b5' : '#000' } },
          name
        );
      });

      return btns;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(OrganizationStatistics, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadChart();
    }
  }, {
    key: 'setOrgId',
    value: function setOrgId(id, e) {
      if (id !== _organizationStatistics2['default'].getCurrentOrg) {
        _organizationStatistics2['default'].setLoading(true);
        _organizationStatistics2['default'].setCurrentOrg(id);
        _organizationStatistics2['default'].loadPie(id);
      }
    }
  }, {
    key: 'getOption',
    value: function getOption() {
      var chartData = _organizationStatistics2['default'].getChartData;
      return {
        tooltip: {
          trigger: 'item',
          confine: true,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#DDDDDD',
          extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20)',
          textStyle: {
            fontSize: 13,
            color: '#000000'
          },
          formatter: function formatter(params) {
            var projects = params.data.projects;

            var eachProjects = projects.length && projects.map(function (item) {
              return '<div class="c7n-iam-orgstatistics-pro">' + item + '</div>';
            });
            var ellipsis = params.data.projects.length > 8 ? '<div class="c7n-iam-orgstatistics-pro">...</div>' : '';
            return '<div>\n              <div class="c7n-iam-orgstatistics-type"><span class="c7n-iam-orgstatistics-tooltip" style="background-color:' + params.color + ';"></span>' + params.data.name + '(' + params.data.projects.length + '\u4E2A)</div>\n              ' + (projects.length ? eachProjects.splice(0, 8).join('') : '') + ellipsis + '\n            <div>';
          }
        },
        legend: {
          icon: 'circle',
          itemHeight: 8,
          bottom: '2%',
          width: '250px',
          data: chartData ? chartData.legend : []
        },
        series: [{
          type: 'pie',
          center: ['50%', '33%'],
          radius: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#FFFFFF', borderWidth: 1
            }
          },
          data: chartData ? chartData.data : []
        }],
        color: ['#B5CFFF', '#00BFA5', '#F7667F', '#5266D4', '#57AAF8', '#7589F2', '#FFB100', '#32C6DE', '#D3D3D3']
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-orgstatistics-wrapper' },
        _react2['default'].createElement(
          _spin2['default'],
          { spinning: _organizationStatistics2['default'].loading },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-orgstatistics' },
            _react2['default'].createElement(
              ButtonGroup,
              { className: 'c7n-iam-orgstatistics-btns' },
              this.renderOrgs()
            ),
            _react2['default'].createElement(
              'div',
              { className: 'c7n-iam-orgstatistics-chart' },
              _react2['default'].createElement(_echartsForReact2['default'], {
                style: { height: '100%' },
                option: this.getOption(),
                notMerge: true
              })
            )
          )
        )
      );
    }
  }]);
  return OrganizationStatistics;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = OrganizationStatistics;
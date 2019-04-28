'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _class; /**
             * Created by hulingfangzi on 2018/6/26.
             */


require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _yamlAce = require('../../../components/yamlAce');

var _yamlAce2 = _interopRequireDefault(_yamlAce);

var _instance = require('../../../stores/global/instance');

var _instance2 = _interopRequireDefault(_instance);

require('./Instance.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabPane = _tabs2['default'].TabPane;

var intlPrefix = 'global.instance';

var InstanceDetail = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = function (_Component) {
  (0, _inherits3['default'])(InstanceDetail, _Component);
  (0, _createClass3['default'])(InstanceDetail, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        info: null,
        metadata: null,
        loading: true
      };
    }
  }]);

  function InstanceDetail(props) {
    (0, _classCallCheck3['default'])(this, InstanceDetail);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (InstanceDetail.__proto__ || Object.getPrototypeOf(InstanceDetail)).call(this, props));

    _this.state = _this.getInitState();
    _this.instanceId = null;

    _this.getInstanceInfo = function () {
      var _this$state = _this.state,
          info = _this$state.info,
          metadata = _this$state.metadata;
      var formatMessage = _this.props.intl.formatMessage;

      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.name' }),
        dataIndex: 'name',
        key: 'name'
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.value' }),
        dataIndex: 'value',
        key: 'value'
      }];
      var infoList = [{
        key: formatMessage({ id: intlPrefix + '.instanceid' }),
        value: info.instanceId
      }, {
        key: formatMessage({ id: intlPrefix + '.hostname' }),
        value: info.hostName
      }, {
        key: formatMessage({ id: intlPrefix + '.ip' }),
        value: info.ipAddr
      }, {
        key: formatMessage({ id: intlPrefix + '.service' }),
        value: info.app
      }, {
        key: formatMessage({ id: intlPrefix + '.port' }),
        value: info.port
      }, {
        key: formatMessage({ id: intlPrefix + '.version' }),
        value: info.version
      }, {
        key: formatMessage({ id: intlPrefix + '.registertime' }),
        value: info.registrationTime
      }, {
        key: formatMessage({ id: intlPrefix + '.metadata' }),
        value: ''
      }];
      return _react2['default'].createElement(
        'div',
        { className: 'instanceInfoContainer' },
        _react2['default'].createElement(
          'div',
          { className: 'instanceInfo' },
          infoList.map(function (_ref) {
            var key = _ref.key,
                value = _ref.value;
            return _react2['default'].createElement(
              _row2['default'],
              { key: key },
              _react2['default'].createElement(
                _col2['default'],
                { span: 5 },
                key,
                ':'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 19 },
                value
              )
            );
          })
        ),
        _react2['default'].createElement(_table2['default'], {
          columns: columns,
          dataSource: metadata,
          rowKey: 'name',
          pagination: false,
          filterBarPlaceholder: formatMessage({ id: 'filtertable' })
        })
      );
    };

    _this.getConfigInfo = function () {
      var info = _this.state.info;

      return _react2['default'].createElement(
        'div',
        { className: 'configContainer' },
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.configinfo' })
          ),
          _react2['default'].createElement(_yamlAce2['default'], {
            readOnly: 'nocursor',
            value: info.configInfoYml.yaml || ''
          })
        ),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.envinfo' })
          ),
          _react2['default'].createElement(_yamlAce2['default'], {
            readOnly: 'nocursor',
            value: info.envInfoYml.yaml || ''
          })
        )
      );
    };

    _this.instanceId = props.match.params.id;
    return _this;
  }

  (0, _createClass3['default'])(InstanceDetail, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.setState({
        loading: true
      });
      _instance2['default'].loadInstanceInfo(this.instanceId).then(function (data) {
        if (data.failed) {
          _this2.setState({
            loading: false
          });
          Choerodon.prompt(data.message);
        } else {
          var metadata = (0, _extends3['default'])({}, data.metadata);
          metadata = Object.entries(metadata).map(function (item) {
            return {
              name: item[0],
              value: item[1]
            };
          });
          _this2.setState({
            info: data,
            metadata: metadata,
            loading: false
          });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var loading = this.state.loading;

      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        null,
        _react2['default'].createElement(_choerodonBootCombine.Header, {
          title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail' }),
          backPath: '/iam/instance'
        }),
        loading ? _react2['default'].createElement(_spin2['default'], { size: 'large', style: { paddingTop: 242 } }) : _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix + '.detail',
            values: { name: this.instanceId }
          },
          _react2['default'].createElement(
            _tabs2['default'],
            null,
            _react2['default'].createElement(
              TabPane,
              {
                tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.instanceinfo' }),
                key: 'instanceinfo'
              },
              this.getInstanceInfo()
            ),
            _react2['default'].createElement(
              TabPane,
              {
                tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.configenvInfo' }),
                key: 'configenvInfo'
              },
              this.getConfigInfo()
            )
          )
        )
      );
    }
  }]);
  return InstanceDetail;
}(_react.Component)) || _class) || _class;

exports['default'] = InstanceDetail;
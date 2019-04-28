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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _choerodonBootCombine = require('choerodon-boot-combine');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Guide = function (_Component) {
  (0, _inherits3['default'])(Guide, _Component);

  function Guide() {
    (0, _classCallCheck3['default'])(this, Guide);
    return (0, _possibleConstructorReturn3['default'])(this, (Guide.__proto__ || Object.getPrototypeOf(Guide)).apply(this, arguments));
  }

  (0, _createClass3['default'])(Guide, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-guide' },
        _react2['default'].createElement(
          'ul',
          null,
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://v0-10.choerodon.io/zh/docs/quick-start/admin/project/' },
              '\u521B\u5EFA\u4E00\u4E2A\u9879\u76EE'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://v0-10.choerodon.io/zh/docs/quick-start/project-member/nginx-demo/' },
              '\u521B\u5EFA\u4E00\u4E2Anginx\u793A\u4F8B'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://v0-10.choerodon.io/zh/docs/quick-start/project-manager/microservice-front/' },
              '\u521B\u5EFA\u4E00\u4E2A\u524D\u7AEF\u5E94\u7528'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://v0-10.choerodon.io/zh/docs/quick-start/project-manager/microservice-backend/' },
              '\u521B\u5EFA\u4E00\u4E2A\u540E\u7AEF\u5E94\u7528'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://v0-10.choerodon.io/zh/docs/quick-start/project-member/agile-management-tools-member/' },
              '\u4F7F\u7528\u654F\u6377\u7BA1\u7406\u5DE5\u5177'
            )
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            'a',
            { target: 'choerodon', href: 'http://choerodon.io/zh/docs/quick-start/' },
            '\u8F6C\u81F3\u6240\u6709\u65B0\u624B\u6307\u5F15'
          )
        )
      );
    }
  }]);
  return Guide;
}(_react.Component);

exports['default'] = Guide;
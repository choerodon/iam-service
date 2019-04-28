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

var Document = function (_Component) {
  (0, _inherits3['default'])(Document, _Component);

  function Document() {
    (0, _classCallCheck3['default'])(this, Document);
    return (0, _possibleConstructorReturn3['default'])(this, (Document.__proto__ || Object.getPrototypeOf(Document)).apply(this, arguments));
  }

  (0, _createClass3['default'])(Document, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-document' },
        _react2['default'].createElement(
          'ul',
          null,
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://choerodon.io/zh/docs/concept/choerodon-concept/' },
              'Choerodon \u662F\u4EC0\u4E48\uFF1F'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://choerodon.io/zh/docs/concept/platform-concept/' },
              '\u5E73\u53F0\u6982\u5FF5'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://choerodon.io/zh/docs/concept/choerodon-system-architecture/' },
              '\u7CFB\u7EDF\u67B6\u6784'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://choerodon.io/zh/docs/user-guide/' },
              '\u7528\u6237\u624B\u518C'
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { target: 'choerodon', href: 'http://choerodon.io/zh/docs/development-guide/' },
              '\u5F00\u53D1\u624B\u518C'
            )
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            'a',
            { target: 'choerodon', href: 'http://choerodon.io/zh/docs/' },
            '\u8F6C\u81F3\u6240\u6709\u6587\u6863'
          )
        )
      );
    }
  }]);
  return Document;
}(_react.Component);

exports['default'] = Document;
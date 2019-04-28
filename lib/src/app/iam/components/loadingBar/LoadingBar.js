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

var _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

require('./LoadingBar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var LoadingBar = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(LoadingBar, _Component);

  function LoadingBar() {
    (0, _classCallCheck3['default'])(this, LoadingBar);
    return (0, _possibleConstructorReturn3['default'])(this, (LoadingBar.__proto__ || Object.getPrototypeOf(LoadingBar)).apply(this, arguments));
  }

  (0, _createClass3['default'])(LoadingBar, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'showbox' },
        _react2['default'].createElement(
          'div',
          { className: 'loader' },
          _react2['default'].createElement(
            'svg',
            { className: 'circular', viewBox: '25 25 50 50' },
            _react2['default'].createElement('circle', { className: 'path', cx: '50', cy: '50', r: '22', fill: 'none', strokeWidth: '3', strokeMiterlimit: '10' })
          )
        )
      );
    }
  }]);
  return LoadingBar;
}(_react.Component)) || _class;

exports['default'] = LoadingBar;
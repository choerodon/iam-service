'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp2; /**
                     * hover 显示全称
                     */

require('choerodon-ui/lib/tooltip/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MouserOverWrapper = (_temp2 = _class = function (_Component) {
  (0, _inherits3['default'])(MouserOverWrapper, _Component);

  function MouserOverWrapper() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, MouserOverWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = MouserOverWrapper.__proto__ || Object.getPrototypeOf(MouserOverWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.strLength = function (str) {
      var len = { cL: 0, nL: 0, uL: 0, lL: 0, ol: 0, dL: 0, xL: 0, gL: 0 };
      for (var i = 0; i < str.length; i += 1) {
        if (str.charCodeAt(i) >= 19968) {
          len.cL += 1; // 中文
        } else if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
          len.nL += 1; // 0-9
        } else if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
          len.uL += 1; // A-Z
        } else if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
          len.lL += 1; // a-z
        } else if (str.charCodeAt(i) === 46) {
          len.dL += 1; // .
        } else if (str.charCodeAt(i) === 45) {
          len.gL += 1; // -
        } else if (str.charCodeAt(i) === 47 || str.charCodeAt(i) === 92) {
          len.xL += 1; // / \
        } else {
          len.ol += 1;
        }
      }
      return len.cL * 13 + len.nL * 7.09 + len.uL * 8.7 + len.lL * 6.8 + len.ol * 8 + len.dL * 3.78 + len.gL * 6.05 + len.xL * 4.58;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(MouserOverWrapper, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          text = _props.text,
          width = _props.width,
          className = _props.className,
          style = _props.style;

      var menuWidth = document.getElementsByClassName('common-menu')[0].offsetWidth || 250;
      var iWidth = window.innerWidth - 48 - menuWidth;
      var maxWidth = typeof width === 'number' ? iWidth * width : width.slice(0, -2);
      var textStyle = {
        maxWidth: maxWidth + 'px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      };
      var domWidth = 0;
      if (text) {
        domWidth = this.strLength(text.toString());
      }
      (0, _extends3['default'])(textStyle, style);
      if (text && domWidth <= maxWidth) {
        return _react2['default'].createElement(
          'div',
          { style: textStyle, className: className },
          ' ',
          this.props.children
        );
      } else {
        return _react2['default'].createElement(
          _tooltip2['default'],
          { title: text, placement: 'topLeft' },
          _react2['default'].createElement(
            'div',
            { style: textStyle, className: className },
            this.props.children
          )
        );
      }
    }
  }]);
  return MouserOverWrapper;
}(_react.Component), _class.propTypes = {
  text: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
  width: _propTypes2['default'].oneOfType([_propTypes2['default'].string.isRequired, _propTypes2['default'].number.isRequired])
}, _class.defaultProps = {
  text: ''
}, _temp2);
exports['default'] = MouserOverWrapper;
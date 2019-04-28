'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  思路
 *  字符串转为json对象 或者直接就是个Json对象
 *  递归遍历这个json对象
 *  对key和value做操作
 */
var tabSize = 2;

var JsonFormatter = function (_Component) {
  (0, _inherits3['default'])(JsonFormatter, _Component);

  function JsonFormatter() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, JsonFormatter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = JsonFormatter.__proto__ || Object.getPrototypeOf(JsonFormatter)).call.apply(_ref, [this].concat(args))), _this), _this.getSpace = function (count) {
      return ' '.repeat(count);
    }, _this.wrapper = function (value, className, count) {
      var newLine = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var quote = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      var space = _this.getSpace(count);
      var renderItem = _this.props.renderItem;

      var tag = _react2['default'].createElement(
        'span',
        { className: className },
        space,
        quote && '"',
        value,
        newLine && '\n',
        quote && '"'
      );
      return renderItem ? renderItem(tag) : tag;
    }, _this.withArray = function (value, count, space) {
      var _this2 = _this,
          wrapper = _this2.wrapper,
          process = _this2.process;

      var html = [];
      var comments = _this.comments(value);
      if (value.length) {
        html.push(wrapper('[', 'array', space, true));
        value.forEach(function (item, index) {
          var values = [];
          if (comments[item] && comments[item][0]) {
            values.push(wrapper(comments[item], 'comment', count + tabSize, true));
          }
          values.push(process(item, count + tabSize));
          if (index !== value.length - 1) {
            values.push(',');
          }
          if (comments[item] && comments[item][1]) {
            values.push(wrapper(comments[item], 'comment', 1));
          }
          html.push(wrapper(values, 'items-wrapper', 0, true));
        });
        html.push(wrapper(']', 'array', count));
      } else {
        html.push(wrapper('[]', 'array', 1));
      }
      return html;
    }, _this.comments = function () {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /*  eslint-disable */
      if (obj.__COMMENTS__) {
        return obj.__COMMENTS__.c || {};
      }
      return {};
    }, _this.withObject = function (value, count, space) {
      var _this3 = _this,
          wrapper = _this3.wrapper,
          process = _this3.process;

      var html = [];
      var comments = _this.comments(value);
      var arr = Object.keys(value);
      if (arr.length) {
        html.push(wrapper('{', 'object', space, true));
        arr.forEach(function (item, index) {
          var values = [];
          if (comments[item] && comments[item][0]) {
            values.push(wrapper(comments[item], 'comment', count + tabSize, true));
          }
          values.push(wrapper(item, 'item-key', count + tabSize, false, true));
          values.push(':');
          values.push(process(value[item], count + tabSize, 1));
          if (index !== arr.length - 1) {
            values.push(',');
          }
          if (comments[item] && comments[item][1]) {
            values.push(wrapper(comments[item], 'comment', 1));
          }
          html.push(wrapper(values, 'items-wrapper', 0, true));
        });
        html.push(wrapper('}', 'object', count));
      } else {
        html.push(wrapper('{}', 'object', 1));
      }
      return html;
    }, _this.process = function (value) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : count;

      var html = [];
      var type = typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value);
      if (value === null) {
        html.push(_this.wrapper('null', 'null', space));
      } else if (type === 'object' && value instanceof Array) {
        html.push(_this.withArray(value, count, space));
      } else if (type === 'object' && value instanceof Date) {
        html.push(_this.wrapper(value, 'date', space));
      } else if (type === 'object') {
        html.push(_this.withObject(value, count, space));
      } else if (type === 'number') {
        html.push(_this.wrapper(value, 'number', space));
      } else if (type === 'boolean') {
        html.push(_this.wrapper(value ? 'true' : 'false', 'boolean', space));
      } else if (type === 'undefined') {
        html.push(_this.wrapper('undefined', 'undefined', space));
      } else {
        html.push(_this.wrapper(value, 'string', space, false, true));
      }
      return html;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }
  /**
   *  根据count 返回空格数
   */


  /**
   * 每一行包 span标签
   * @param value
   * @param className
   * @param count 有多少前缀空格
   * @param newLine 是否换行
   * @param quote 是否给打引号
   * @returns {*}
   */


  return JsonFormatter;
}(_react.Component);

var defaultProps = {
  tabSize: 2
};

var jsonFormat = new JsonFormatter(defaultProps);

exports['default'] = jsonFormat.process;
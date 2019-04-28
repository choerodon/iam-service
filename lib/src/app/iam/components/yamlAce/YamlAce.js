'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactCodemirror = require('react-codemirror');

var _reactCodemirror2 = _interopRequireDefault(_reactCodemirror);

require('./YamlAce.scss');

require('codemirror/lib/codemirror.css');

require('codemirror/mode/yaml/yaml');

require('codemirror/theme/neat.css');

require('codemirror/addon/fold/foldgutter.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var YamlAce = (_temp2 = _class = function (_Component) {
  (0, _inherits3['default'])(YamlAce, _Component);

  function YamlAce() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, YamlAce);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = YamlAce.__proto__ || Object.getPrototypeOf(YamlAce)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.aceEditor = null, _this.saveRef = function (instance) {
      return _this.aceEditor = instance;
    }, _this.handleModifyHighLight = (0, _debounce3['default'])(function (values) {
      _this.props.onChange(values);
    }, 500), _this.handleChange = function (values, options) {
      var editor = _this.aceEditor.getCodeMirror();
      var start = options.from;
      var end = options.to;
      var newValue = editor.getLine(start.line);
      var from = { line: start.line, ch: newValue.split(':')[0].length + 2 };
      var ch = 1000;
      var to = { line: end.line, ch: ch };
      var lineInfo = editor.lineInfo(from.line).bgClass;
      // 新增行
      if (options.origin === '+input' && options.text.toString() === ',') {
        editor.addLineClass(start.line + 1, 'background', 'newLine-text');
      } else if (options.origin === '+input' && options.from.ch === 0 && options.to.ch === 0) {
        editor.addLineClass(start.line, 'background', 'newLine-text');
      } else if (lineInfo === 'lastModifyLine-line') {
        editor.addLineClass(start.line, 'background', 'lastModifyLine-line');
        editor.markText(from, to, { className: 'lastModifyLine-text' });
      } else if (lineInfo === 'newLine-text') {
        editor.addLineClass(start.line, 'background', 'newLine-text');
      } else if (options.origin === '+delete' && options.removed.toString() === ',') {
        var s = 'return';
      } else {
        editor.addLineClass(start.line, 'background', 'lastModifyLine-line');
        editor.markText(from, to, { className: 'lastModifyLine-text' });
      }
      _this.handleModifyHighLight(values, options);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  /**
   * 设置本次修改的高亮
   */


  (0, _createClass3['default'])(YamlAce, [{
    key: 'scrollTo',
    value: function scrollTo(_ref2) {
      var left = _ref2.left,
          top = _ref2.top;

      var editor = this.aceEditor.getCodeMirror();
      editor.scrollTo(left, top);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          readOnly = _props.readOnly,
          options = _props.options,
          restProps = (0, _objectWithoutProperties3['default'])(_props, ['readOnly', 'options']);

      var props = (0, _extends3['default'])({
        options: (0, _extends3['default'])({}, options, {
          readOnly: readOnly
        })
      }, restProps, {
        onChange: readOnly ? void 0 : this.handleChange,
        ref: this.saveRef
      });
      return _react2['default'].createElement(_reactCodemirror2['default'], props);
    }
  }]);
  return YamlAce;
}(_react.Component), _class.defaultProps = {
  readOnly: false,
  options: {
    theme: 'neat',
    mode: 'yaml',
    lineNumbers: true,
    lineWrapping: true
  }
}, _temp2);
exports['default'] = YamlAce;
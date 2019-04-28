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

var _reactImageLightbox = require('react-image-lightbox');

var _reactImageLightbox2 = _interopRequireDefault(_reactImageLightbox);

require('./EasyImg.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var EasyImg = function (_Component) {
  (0, _inherits3['default'])(EasyImg, _Component);

  function EasyImg() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, EasyImg);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = EasyImg.__proto__ || Object.getPrototypeOf(EasyImg)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isOpen: false
    }, _this.onOpenLightboxChange = function () {
      var isOpen = _this.state.isOpen;

      _this.setState({
        isOpen: !isOpen
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(EasyImg, [{
    key: 'render',
    value: function render() {
      var src = this.props.src;

      return _react2['default'].createElement(
        'div',
        { onClick: this.onOpenLightboxChange, className: 'c7n-iam-easy-img' },
        _react2['default'].createElement('img', { src: src, alt: '', style: { display: 'block', width: '100%' } }),
        this.state.isOpen ? _react2['default'].createElement(_reactImageLightbox2['default'], {
          mainSrc: src,
          onCloseRequest: this.onOpenLightboxChange
        }) : null
      );
    }
  }]);
  return EasyImg;
}(_react.Component);

exports['default'] = EasyImg;
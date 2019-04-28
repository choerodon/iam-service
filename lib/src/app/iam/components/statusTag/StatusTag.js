'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

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

var _class, _temp;

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./StatusTag.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Color = {
  RUNNING: '#4d90fe',
  FAILED: '#f44336',
  COMPLETED: '#00BFA5',
  NON_CONSUMER: '#00BFA5',
  DEFAULT: '#b8b8b8'
};

var IconType = {
  COMPLETED: 'check_circle',
  NON_CONSUMER: 'check_circle',
  FAILED: 'cancel',
  ENABLE: 'check_circle',
  DISABLE: 'remove_circle',
  FINISHED: 'state_over',
  RUNNING: 'timelapse',
  PREDEFINE: 'settings',
  CUSTOM: 'av_timer',
  UN_START: 'timer',
  QUEUE: 'watch_later'
};

var StatusTag = (_temp = _class = function (_Component) {
  (0, _inherits3['default'])(StatusTag, _Component);

  function StatusTag() {
    (0, _classCallCheck3['default'])(this, StatusTag);
    return (0, _possibleConstructorReturn3['default'])(this, (StatusTag.__proto__ || Object.getPrototypeOf(StatusTag)).apply(this, arguments));
  }

  (0, _createClass3['default'])(StatusTag, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(nextProps.name === this.props.name && nextProps.color === this.props.color && nextProps.colorCode === this.props.colorCode);
    }
  }, {
    key: 'renderIconMode',
    value: function renderIconMode() {
      var _props = this.props,
          name = _props.name,
          colorCode = _props.colorCode,
          iconType = _props.iconType;

      return _react2['default'].createElement(
        'span',
        {
          className: 'c7n-iam-status-tag-with-icon',
          style: (0, _extends3['default'])({}, this.props.style)
        },
        _react2['default'].createElement(_icon2['default'], { type: iconType || [IconType[colorCode]] }),
        _react2['default'].createElement(
          'span',
          null,
          name || ''
        )
      );
    }
  }, {
    key: 'renderDefaultMode',
    value: function renderDefaultMode() {
      var _props2 = this.props,
          name = _props2.name,
          color = _props2.color,
          colorCode = _props2.colorCode;

      return _react2['default'].createElement(
        'div',
        {
          className: 'c7n-iam-status-tag',
          style: (0, _extends3['default'])({
            background: color || Color[colorCode]
          }, this.props.style)
        },
        _react2['default'].createElement(
          'div',
          null,
          name
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var mode = this.props.mode;

      switch (mode) {
        case 'icon':
          return this.renderIconMode();
        default:
          return this.renderDefaultMode();
      }
    }
  }]);
  return StatusTag;
}(_react.Component), _class.propTypes = {
  name: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].bool]),
  color: _propTypes2['default'].string,
  colorCode: _propTypes2['default'].string,
  iconType: _propTypes2['default'].string
}, _class.defaultProps = {
  colorCode: 'DEFAULT'
}, _temp);
exports['default'] = StatusTag;
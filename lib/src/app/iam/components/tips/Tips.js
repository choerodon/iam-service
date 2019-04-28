'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./Tips.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function Tips(props) {
  var type = props.type,
      data = props.data,
      intl = props.intl;

  return _react2['default'].createElement(
    _react.Fragment,
    null,
    type === 'title' && _react2['default'].createElement(
      'div',
      { className: 'c7n-iam-table-title-tip' },
      _react2['default'].createElement(_reactIntl.FormattedMessage, { id: data }),
      _react2['default'].createElement(
        _popover2['default'],
        {
          content: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: data + '.tip' }),
          overlayClassName: 'c7n-iam-tips-popover',
          arrowPointAtCenter: true
        },
        _react2['default'].createElement(_icon2['default'], { type: 'help' })
      )
    ),
    type === 'form' && _react2['default'].createElement(
      _popover2['default'],
      {
        content: _react2['default'].createElement(
          _react.Fragment,
          null,
          intl.formatMessage({ id: data }).split('\n').map(function (v) {
            return _react2['default'].createElement(
              'div',
              { key: v },
              v
            );
          })
        ),
        overlayClassName: 'c7n-iam-tips-popover',
        placement: 'topRight',
        arrowPointAtCenter: true
      },
      _react2['default'].createElement(_icon2['default'], { type: 'help c7n-iam-select-tip' })
    )
  );
}

Tips.propTypes = {
  type: _propTypes2['default'].string.isRequired,
  data: _propTypes2['default'].string.isRequired
};

exports['default'] = (0, _reactIntl.injectIntl)(Tips);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _timeline = require('choerodon-ui/lib/timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var _dec, _class;

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/timeline/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _announcementInfo = require('../../stores/user/announcement-info');

var _announcementInfo2 = _interopRequireDefault(_announcementInfo);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Item = _timeline2['default'].Item;

var Announcement = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Announcement, _Component);

  function Announcement() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Announcement);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Announcement.__proto__ || Object.getPrototypeOf(Announcement)).call.apply(_ref, [this].concat(args))), _this), _this.handleCancel = function () {
      _announcementInfo2['default'].closeDetail();
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Announcement, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _announcementInfo2['default'].loadData();
    }
  }, {
    key: 'render',
    value: function render() {
      var visible = _announcementInfo2['default'].visible,
          title = _announcementInfo2['default'].title,
          content = _announcementInfo2['default'].content,
          announcementData = _announcementInfo2['default'].announcementData;

      var containerStyle = {
        display: 'block'
      };

      if (announcementData.length !== 0) {
        containerStyle = {
          display: 'flex',
          justifyContent: 'center'
        };
      }
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-announcement', style: containerStyle },
        announcementData.length === 0 ? _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          _react2['default'].createElement('div', { className: 'c7n-iam-dashboard-announcement-empty' }),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-announcement-empty-text' },
            '\u6682\u65E0\u516C\u544A'
          )
        ) : _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          _react2['default'].createElement(
            _timeline2['default'],
            { className: 'c7n-iam-dashboard-announcement-timeline' },
            announcementData.map(function (data) {
              return _react2['default'].createElement(
                Item,
                { className: 'item', key: '' + data.id },
                _react2['default'].createElement(
                  'div',
                  { className: 'time' },
                  _react2['default'].createElement(
                    'p',
                    null,
                    data.sendDate.split(' ')[0]
                  ),
                  _react2['default'].createElement(
                    'p',
                    null,
                    data.sendDate.split(' ')[1]
                  )
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'title' },
                  _react2['default'].createElement(
                    'a',
                    { onClick: function onClick() {
                        return _announcementInfo2['default'].showDetail(data);
                      } },
                    data.title
                  )
                )
              );
            }),
            _react2['default'].createElement(
              Item,
              null,
              'null'
            )
          )
        ),
        _react2['default'].createElement(
          _modal2['default'],
          {
            visible: visible,
            width: 800,
            title: title,
            onCancel: this.handleCancel,
            footer: [_react2['default'].createElement(
              _button2['default'],
              { key: 'back', onClick: this.handleCancel },
              '\u8FD4\u56DE'
            )]
          },
          _react2['default'].createElement('div', {
            className: 'c7n-iam-dashboard-announcement-detail-content',
            dangerouslySetInnerHTML: { __html: '' + content }
          })
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.DashBoardNavBar,
          null,
          _react2['default'].createElement(
            _reactRouterDom.Link,
            { to: '/iam/user-msg?type=site&msgType=announcement' },
            '\u8F6C\u81F3\u6240\u6709\u516C\u544A'
          )
        )
      );
    }
  }]);
  return Announcement;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Announcement;
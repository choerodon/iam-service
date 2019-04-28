'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _list = require('choerodon-ui/lib/list');

var _list2 = _interopRequireDefault(_list);

var _avatar = require('choerodon-ui/lib/avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _checkbox = require('choerodon-ui/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _collapse = require('choerodon-ui/lib/collapse');

var _collapse2 = _interopRequireDefault(_collapse);

var _dec, _class;

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/list/style');

require('choerodon-ui/lib/avatar/style');

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/checkbox/style');

require('choerodon-ui/lib/tabs/style');

require('choerodon-ui/lib/collapse/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./UserMsg.scss');

var _UserMsgStore = require('../../../stores/user/user-msg/UserMsgStore');

var _UserMsgStore2 = _interopRequireDefault(_UserMsgStore);

require('../../../common/ConfirmModal.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var intlPrefix = 'user.usermsg';
var Panel = _collapse2['default'].Panel;
var TabPane = _tabs2['default'].TabPane;

function timestampFormat(timestamp) {
  function zeroize(num) {
    return (String(num).length === 1 ? '0' : '') + num;
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000, 10); // 当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

  var Y = tmDate.getFullYear();
  var m = tmDate.getMonth() + 1;
  var d = tmDate.getDate();
  var H = tmDate.getHours();
  var i = tmDate.getMinutes();
  var s = tmDate.getSeconds();

  if (timestampDiff < 60) {
    // 一分钟以内
    return '刚刚';
  } else if (timestampDiff < 3600) {
    // 一小时前之内
    return Math.floor(timestampDiff / 60) + '\u5206\u949F\u524D';
  } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
    return '\u4ECA\u5929' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
      return '\u6628\u5929' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() === Y) {
      return zeroize(m) + '\u6708' + zeroize(d) + '\u65E5 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '\u5E74' + zeroize(m) + '\u6708' + zeroize(d) + '\u65E5 ' + zeroize(H) + ':' + zeroize(i);
    }
  }
}

var UserMsg = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(UserMsg, _Component);

  function UserMsg() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, UserMsg);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = UserMsg.__proto__ || Object.getPrototypeOf(UserMsg)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      showAll: false,
      needExpand: true
    }, _this.refresh = function () {
      _UserMsgStore2['default'].loadData({ current: 1, pageSize: 10 }, {}, {}, [], _this.state.showAll);
      _UserMsgStore2['default'].selectMsg.clear();
      _UserMsgStore2['default'].expandMsg.clear();
      _UserMsgStore2['default'].initPagination();
    }, _this.renderMsgTitle = function (title, id, read, sendTime, isChecked, avatar) {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-user-msg-collapse-title' },
        _react2['default'].createElement(_checkbox2['default'], {
          style: { verticalAlign: 'text-bottom' },
          onChange: function onChange(e) {
            return _this.handleCheckboxChange(e, id);
          },
          checked: isChecked
        }),
        avatar,
        _react2['default'].createElement(
          'span',
          { style: { color: '#000' } },
          title
        ),
        _react2['default'].createElement(
          _tooltip2['default'],
          {
            title: sendTime,
            placement: 'top'
          },
          _react2['default'].createElement(
            'span',
            { className: 'c7n-iam-user-msg-unread' },
            timestampFormat(new Date(sendTime.replace(/-/g, '/')).getTime() / 1000)
          )
        ),
        _react2['default'].createElement(_icon2['default'], { type: read ? 'drafts' : 'markunread', onClick: function onClick() {
            _this.handleReadIconClick(id);
          } })
      );
    }, _this.renderAnnoucenmentTitle = function (title, id, sendDate, avatar) {
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-user-msg-collapse-title' },
        avatar,
        _react2['default'].createElement(
          'span',
          { style: { color: '#000' } },
          title
        ),
        _react2['default'].createElement(
          _tooltip2['default'],
          {
            title: sendDate,
            placement: 'top'
          },
          _react2['default'].createElement(
            'span',
            { className: 'c7n-iam-user-msg-unread' },
            timestampFormat(new Date(sendDate.replace(/-/g, '/')).getTime() / 1000)
          )
        )
      );
    }, _this.handleBatchRead = function () {
      if (_UserMsgStore2['default'].getSelectMsg.size > 0) {
        _UserMsgStore2['default'].readMsg(_UserMsgStore2['default'].getSelectMsg).then(function () {
          return _this.refresh();
        });
      }
    }, _this.handleDelete = function () {
      var intl = _this.props.intl;

      if (_UserMsgStore2['default'].getSelectMsg.size > 0) {
        _modal2['default'].confirm({
          className: 'c7n-iam-confirm-modal',
          title: intl.formatMessage({ id: intlPrefix + '.delete.owntitle' }),
          content: intl.formatMessage({ id: intlPrefix + '.delete.owncontent' }, {
            count: _UserMsgStore2['default'].selectMsg.size
          }),
          onOk: function onOk() {
            _UserMsgStore2['default'].deleteMsg().then(function () {
              Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
              _this.refresh();
            });
          }
        });
      }
    }, _this.handleTabsChange = function (key) {
      _UserMsgStore2['default'].setCurrentType(key);
      if (/&msgType=.+/g.test(window.location.hash)) {
        window.location.hash = window.location.hash.replace(/&msgType=.+/g, '&msgType=' + key);
      } else {
        window.location.hash = window.location.hash + '&msgType=' + key;
      }
      _this.refresh();
    }, _this.handleCheckboxChange = function (e, id) {
      if (_UserMsgStore2['default'].getSelectMsg.has(id)) {
        _UserMsgStore2['default'].deleteSelectMsgById(id);
      } else {
        _UserMsgStore2['default'].addSelectMsgById(id);
      }
      _this.setState({ needExpand: false });
    }, _this.handleReadIconClick = function (id) {
      _UserMsgStore2['default'].setReadLocal(id);
      _UserMsgStore2['default'].readMsg([id]);
      _this.setState({ needExpand: false });
    }, _this.handleCollapseChange = function (item) {
      setTimeout(function () {
        if (_this.state.needExpand && _UserMsgStore2['default'].getExpandMsg.has(item.id)) {
          _UserMsgStore2['default'].unExpandMsgById(item.id);
        } else if (_this.state.needExpand) {
          _UserMsgStore2['default'].expandMsgById(item.id);
        }
        _this.setState({ needExpand: true });
      }, 10);
    }, _this.loadUserInfo = function () {
      return _UserMsgStore2['default'].setUserInfo(_this.props.AppState.getUserInfo);
    }, _this.selectAllMsg = function () {
      if (!_UserMsgStore2['default'].isAllSelected) {
        _UserMsgStore2['default'].selectAllMsg();
      } else {
        _UserMsgStore2['default'].unSelectAllMsg();
      }
    }, _this.renderEmpty = function (type) {
      var currentType = _UserMsgStore2['default'].getCurrentType;
      var isAnnounceMent = currentType === 'announcement';
      return isAnnounceMent ? _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'c7n-iam-user-msg-empty-icon' }),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-user-msg-empty-icon-text' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'user.usermsg.allempty' }),
          '\u516C\u544A'
        )
      ) : _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'c7n-iam-user-msg-empty-icon' }),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-user-msg-empty-icon-text' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: _this.state.showAll ? 'user.usermsg.allempty' : 'user.usermsg.empty' }),
          type
        )
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(UserMsg, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadUserInfo();
      var matchId = this.props.location.search.match(/msgId=(\d+)/g);
      var matchType = this.props.location.search.match(/(msgType=)(.+)/g); // 火狐浏览器不兼容js正则表达式的环视，只能改成这样了
      if (matchType) {
        _UserMsgStore2['default'].setCurrentType(matchType[0].substring(8));
      }
      if (matchId) {
        var id = Number(matchId[0].match(/\d+/g)[0]);
        _UserMsgStore2['default'].loadData({ current: 1, pageSize: 10 }, {}, {}, [], this.state.showAll, false);
      } else _UserMsgStore2['default'].loadData({ current: 1, pageSize: 10 }, {}, {}, [], this.state.showAll, false);
    }
  }, {
    key: 'getUserMsgClass',
    value: function getUserMsgClass(name) {
      var showAll = this.state.showAll;

      if (name === 'unRead') {
        return (0, _classnames2['default'])({
          active: !showAll
        });
      } else if (name === 'all') {
        return (0, _classnames2['default'])({
          active: showAll
        });
      }
    }
  }, {
    key: 'showUserMsg',
    value: function showUserMsg(show) {
      var _this2 = this;

      this.setState({ showAll: show }, function () {
        return _this2.refresh();
      });
    }
  }, {
    key: 'renderUserMsgCard',
    value: function renderUserMsgCard(item) {
      var _this3 = this;

      var AppState = this.props.AppState;

      var currentType = _UserMsgStore2['default'].getCurrentType;
      var isAnnouncement = currentType === 'announcement';
      var innerStyle = {
        userSelect: 'none', verticalAlign: 'top', marginRight: '8px', marginLeft: isAnnouncement ? '0' : '12px', fontSize: '16px', color: 'rgba(0,0,0,0.65)'
      };

      var systemAvatar = _react2['default'].createElement(
        _tooltip2['default'],
        { title: AppState.siteInfo.systemName || 'Choerodon' },
        _react2['default'].createElement(
          _avatar2['default'],
          { size: 'small', src: AppState.siteInfo.favicon || './favicon.ico', style: innerStyle },
          AppState.siteInfo.systemName && AppState.siteInfo.systemName[0] || 'Choerodon'
        )
      );

      var innerHTML = void 0;

      if (!isAnnouncement) {
        var id = item.id,
            title = item.title,
            read = item.read,
            sendTime = item.sendTime,
            content = item.content,
            sendByUser = item.sendByUser;

        var avatar = void 0;
        if (sendByUser !== null) {
          var imageUrl = sendByUser.imageUrl,
              loginName = sendByUser.loginName,
              realName = sendByUser.realName;

          avatar = _react2['default'].createElement(
            _tooltip2['default'],
            { title: loginName + ' ' + realName },
            _react2['default'].createElement(
              _avatar2['default'],
              { size: 'small', src: imageUrl, style: innerStyle },
              realName[0].toUpperCase()
            )
          );
        } else {
          avatar = systemAvatar;
        }
        innerHTML = _react2['default'].createElement(
          _list2['default'].Item,
          null,
          _react2['default'].createElement(
            _collapse2['default'],
            {
              onChange: function onChange() {
                return _this3.handleCollapseChange(item);
              },
              className: 'c7n-iam-user-msg-collapse',
              activeKey: _UserMsgStore2['default'].getExpandMsg.has(id) ? [id.toString()] : [],
              style: _UserMsgStore2['default'].getExpandMsg.has(id) ? null : { backgroundColor: '#fff' }
            },
            _react2['default'].createElement(
              Panel,
              { header: this.renderMsgTitle(title, id, read, sendTime, _UserMsgStore2['default'].getSelectMsg.has(id), avatar), key: id.toString(), className: 'c7n-iam-user-msg-collapse-panel' },
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement('div', { style: { width: 'calc(100% - 72px)', margin: '0 36px', display: 'inline-block' }, dangerouslySetInnerHTML: { __html: '' + content } })
              )
            )
          )
        );
      } else {
        var _id = item.id,
            _title = item.title,
            sendDate = item.sendDate,
            _content = item.content;

        innerHTML = _react2['default'].createElement(
          _list2['default'].Item,
          null,
          _react2['default'].createElement(
            _collapse2['default'],
            {
              onChange: function onChange() {
                return _this3.handleCollapseChange(item);
              },
              className: 'c7n-iam-user-msg-collapse',
              activeKey: _UserMsgStore2['default'].getExpandMsg.has(_id) ? [_id.toString()] : [],
              style: _UserMsgStore2['default'].getExpandMsg.has(_id) ? null : { backgroundColor: '#fff' }
            },
            _react2['default'].createElement(
              Panel,
              { header: this.renderAnnoucenmentTitle(_title, _id, sendDate, systemAvatar), key: _id.toString(), className: 'c7n-iam-user-msg-collapse-panel' },
              _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement('div', { style: { width: 'calc(100% - 72px)', margin: '0 36px', display: 'inline-block' }, dangerouslySetInnerHTML: { __html: '' + _content } })
              )
            )
          )
        );
      }
      return innerHTML;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var intl = this.props.intl;

      var pagination = _UserMsgStore2['default'].getPagination;
      var userMsg = _UserMsgStore2['default'].getUserMsg;
      var announceMsg = _UserMsgStore2['default'].getAnnounceMsg;
      var currentType = _UserMsgStore2['default'].getCurrentType;
      var isAnnounceMent = currentType === 'announcement';
      var currentMsg = isAnnounceMent ? announceMsg : userMsg;
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['notify-service.site-msg-record.pagingQuery', 'notify-service.site-msg-record.batchDeleted', 'notify-service.site-msg-record.batchRead', 'notify-service.system-announcement.pagingQueryCompleted']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          {
            title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'user.usermsg.header.title' })
          },
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'playlist_add_check',
              onClick: this.selectAllMsg,
              style: { width: '93px' },
              disabled: isAnnounceMent
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: _UserMsgStore2['default'].getUserMsg.length > 0 && _UserMsgStore2['default'].isAllSelected ? 'selectnone' : 'selectall' })
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['notify-service.site-msg-record.batchRead']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'all_read',
                disabled: _UserMsgStore2['default'].getSelectMsg.size === 0 || isAnnounceMent,
                onClick: this.handleBatchRead
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.markreadall' })
            )
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            {
              service: ['notify-service.site-msg-record.batchDeleted']
            },
            _react2['default'].createElement(
              _button2['default'],
              {
                icon: 'delete',
                disabled: _UserMsgStore2['default'].getSelectMsg.size === 0 || isAnnounceMent,
                onClick: this.handleDelete
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'remove' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              icon: 'refresh',
              onClick: this.refresh
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          null,
          _react2['default'].createElement(
            _tabs2['default'],
            { defaultActiveKey: 'msg', onChange: this.handleTabsChange, activeKey: currentType, animated: false, className: 'c7n-iam-user-msg-tab-container' },
            [{ key: 'msg', value: '消息' }, { key: 'notice', value: '通知' }, { key: 'announcement', value: '公告' }].map(function (panelItem) {
              return _react2['default'].createElement(
                TabPane,
                { tab: panelItem.value, key: panelItem.key, className: 'c7n-iam-user-msg-tab' },
                _react2['default'].createElement(
                  'div',
                  { className: (0, _classnames2['default'])('c7n-iam-user-msg-btns', { 'c7n-iam-user-msg-btns-hidden': currentType === 'announcement' }) },
                  _react2['default'].createElement(
                    _button2['default'],
                    {
                      className: _this4.getUserMsgClass('unRead'),
                      onClick: function onClick() {
                        _this4.showUserMsg(false);
                      },
                      type: 'primary'
                    },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'user.usermsg.unread' })
                  ),
                  _react2['default'].createElement(
                    _button2['default'],
                    {
                      className: _this4.getUserMsgClass('all'),
                      onClick: function onClick() {
                        _this4.showUserMsg(true);
                      },
                      type: 'primary'
                    },
                    _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'user.usermsg.all' })
                  )
                ),
                _react2['default'].createElement(_list2['default'], {
                  style: { width: isAnnounceMent ? '100%' : 'calc(100% - 113px)' },
                  className: 'c7n-iam-user-msg-list',
                  loading: _UserMsgStore2['default'].getLoading,
                  itemLayout: 'horizontal',
                  pagination: currentMsg.length > 0 ? pagination : false,
                  dataSource: isAnnounceMent ? announceMsg : userMsg,
                  renderItem: function renderItem(item) {
                    return _this4.renderUserMsgCard(item);
                  },
                  split: false,
                  empty: _this4.renderEmpty(panelItem.value)
                })
              );
            })
          )
        )
      );
    }
  }]);
  return UserMsg;
}(_react.Component)) || _class) || _class) || _class) || _class);
exports['default'] = UserMsg;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _timeline = require('choerodon-ui/lib/timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/timeline/style');

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

require('./index.scss');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _easyImg = require('../../components/easyImg');

var _easyImg2 = _interopRequireDefault(_easyImg);

var _siteRole = require('./image/site-role.png');

var _siteRole2 = _interopRequireDefault(_siteRole);

var _rootRole = require('./image/root-role.png');

var _rootRole2 = _interopRequireDefault(_rootRole);

var _addMenu = require('./image/add-menu.png');

var _addMenu2 = _interopRequireDefault(_addMenu);

var _card = require('./image/card.png');

var _card2 = _interopRequireDefault(_card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SiteBasic = (_dec = (0, _mobxReact.inject)('GuideStore', 'AppState'), _dec(_class = (0, _reactIntl.injectIntl)(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(SiteBasic, _Component);

  function SiteBasic() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, SiteBasic);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = SiteBasic.__proto__ || Object.getPrototypeOf(SiteBasic)).call.apply(_ref, [this].concat(args))), _this), _this.handleCheck = function (dom) {
      return dom.children[0].className !== 'guide-card';
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(SiteBasic, [{
    key: 'getGuideCard',
    value: function getGuideCard(iconType, name) {
      return _react2['default'].createElement(
        'div',
        { className: 'guide-card' },
        _react2['default'].createElement(_icon2['default'], { type: iconType, style: { color: 'rgba(0,0,0,0.65)', fontSize: '24px' } }),
        _react2['default'].createElement(
          'span',
          { style: { color: '#000', fontSize: '16px' } },
          name
        )
      );
    }
  }, {
    key: 'renderStep',
    value: function renderStep(current) {
      var _this2 = this;

      var _props = this.props,
          AppState = _props.AppState,
          GuideStore = _props.GuideStore,
          intl = _props.intl;

      switch (current) {
        case 0:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u6982\u89C8'
            ),
            _react2['default'].createElement(
              'p',
              { className: 'text' },
              '\u5728\u5E73\u53F0\u5C42\u60A8\u53EF\u4EE5\u7BA1\u7406\u7EC4\u7EC7\uFF0C\u7BA1\u7406\u89D2\u8272\u5BF9\u5E94\u7684\u6743\u9650\uFF0C\u7ED9\u6210\u5458\u5206\u914D\u5E73\u53F0\u5C42\u89D2\u8272\uFF0C\u8BBE\u7F6Eroot\u7528\u6237\uFF0C\u81EA\u5B9A\u4E49\u5E73\u53F0\u83DC\u5355\u3001\u4EEA\u8868\u76D8\u3001\u6807\u5FD7\u7B49\u57FA\u672C\u914D\u7F6E\u3002 \u5F53\u7136\uFF0C\u60A8\u60F3\u8FDB\u884C\u8FD9\u4E9B\u64CD\u4F5C\uFF0C\u60A8\u9700\u662F\u5E73\u53F0\u7BA1\u7406\u5458\u53CA\u5176\u4EE5\u4E0A\u7684\u6743\u9650\u89D2\u8272\u3002'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u5728\u6B64\u6559\u7A0B\uFF0C\u60A8\u5C06\u5B66\u4E60\u4EE5\u4E0B\u64CD\u4F5C\uFF1A'
            ),
            _react2['default'].createElement(
              'ul',
              { className: 'step-dire' },
              _react2['default'].createElement(
                'li',
                null,
                '\u7BA1\u7406\u7EC4\u7EC7'
              ),
              _react2['default'].createElement(
                'li',
                null,
                '\u521B\u5EFA\u89D2\u8272'
              ),
              _react2['default'].createElement(
                'li',
                null,
                '\u5206\u914D\u5E73\u53F0\u89D2\u8272'
              ),
              _react2['default'].createElement(
                'li',
                null,
                '\u8BBE\u7F6ERoot\u7528\u6237'
              ),
              _react2['default'].createElement(
                'li',
                null,
                '\u5E73\u53F0\u81EA\u5B9A\u4E49\u8BBE\u7F6E'
              )
            )
          );
        case 1:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u5BFC\u822A\u81F3\u5E73\u53F0\u8BBE\u7F6E\u9875\u9762'
            ),
            _react2['default'].createElement(
              _timeline2['default'],
              { style: { height: '100px' } },
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-settings', level: 1 },
                    '\u7BA1\u7406'
                  ),
                  '\u6309\u94AE'
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u6253\u5F00\u5E73\u53F0\u5DE6\u4FA7\u7684',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'c7n-boot-header-logo-menu-icon', level: 0 },
                    '\u83DC\u5355'
                  )
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-IAM', level: 2 },
                    '\u5E73\u53F0\u8BBE\u7F6E'
                  ),
                  '\u90E8\u5206'
                )
              )
            ),
            _react2['default'].createElement(
              _choerodonBootCombine.AutoGuide,
              {
                highLight: ['icon-settings', 'icon-settings', 'c7n-boot-header-logo-menu-icon', 'c7n-boot-header-logo-menu-icon', 'icon-IAM'],
                idx: [0, 0, 0, 0, 0],
                level: [1, 1, 0, 0, 2],
                mode: ['mask', 'click', 'mask', 'click', 'mask'],
                onStart: function onStart() {
                  return AppState.setMenuExpanded(false);
                }
              },
              _react2['default'].createElement(
                'div',
                { className: 'guide-card' },
                _react2['default'].createElement(_icon2['default'], { type: 'IAM', style: { color: 'rgba(0,0,0,0.65)', fontSize: '24px' } }),
                _react2['default'].createElement(
                  'span',
                  { style: { color: '#000', fontSize: '16px' } },
                  '\u5E73\u53F0\u8BBE\u7F6E'
                ),
                _react2['default'].createElement(_icon2['default'], { type: 'play_circle_filled', style: { marginLeft: 'calc(100% - 199.5px)', fontSize: '15px' } }),
                _react2['default'].createElement(
                  'span',
                  { style: { marginRight: '16px' } },
                  '\u4E92\u52A8\u6F14\u793A'
                )
              )
            )
          );

        case 2:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u7BA1\u7406\u7EC4\u7EC7'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u7EC4\u7EC7\u662F\u9879\u76EE\u7684\u4E0A\u4E00\u4E2A\u5C42\u7EA7\uFF0C\u7528\u6237\u5FC5\u987B\u5C5E\u4E8E\u4E00\u4E2A\u7EC4\u7EC7\u3002\u901A\u8FC7\u7EC4\u7EC7\u7BA1\u7406\u60A8\u53EF\u4EE5\u4FEE\u6539\u7EC4\u7EC7\u6216\u8005\u67E5\u770B\u7EC4\u7EC7\u8BE6\u60C5\u3002'
            ),
            _react2['default'].createElement(
              _timeline2['default'],
              null,
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon icon-manage_organization', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                        return _this2.handleCheck(dom);
                      } },
                    '\u7EC4\u7EC7\u7BA1\u7406'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon icon-manage_organization', className: 'no-border', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                      return _this2.handleCheck(dom);
                    } },
                  this.getGuideCard('manage_organization', '组织管理')
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-mode_edit', level: 1, siteLevel: 'site', route: '/iam/organization' },
                    '\u4FEE\u6539',
                    _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', style: { fontSize: 10 } })
                  ),
                  '\u56FE\u6807\uFF0C\u60A8\u53EF\u4EE5\u4FEE\u6539\u7EC4\u7EC7\u4FE1\u606F\u3002'
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-find_in_page', level: 1, siteLevel: 'site', route: '/iam/organization' },
                    '\u8BE6\u60C5',
                    _react2['default'].createElement(_icon2['default'], { type: 'find_in_page', style: { fontSize: 10 } })
                  ),
                  '\u56FE\u6807\uFF0C\u60A8\u53EF\u4EE5\u67E5\u770B\u7EC4\u7EC7\u4FE1\u606F\u3002'
                )
              )
            ),
            _react2['default'].createElement('div', null)
          );

        case 3:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u521B\u5EFA\u89D2\u8272'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u89D2\u8272\u662F\u60A8\u53EF\u5206\u914D\u7ED9\u6210\u5458\u7684\u4E00\u7EC4\u6743\u9650\u3002\u901A\u8FC7\u89D2\u8272\u7BA1\u7406\u60A8\u53EF\u4EE5\u521B\u5EFA\u3001\u542F\u505C\u7528\u89D2\u8272\uFF0C\u4E3A\u89D2\u8272\u6DFB\u52A0\u6743\u9650\u3002'
            ),
            _react2['default'].createElement(
              _timeline2['default'],
              null,
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-assignment_ind', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                        return _this2.handleCheck(dom);
                      } },
                    '\u89D2\u8272\u7BA1\u7406'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon-assignment_ind', className: 'no-border', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                      return _this2.handleCheck(dom);
                    } },
                  this.getGuideCard('assignment_ind', '角色管理')
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB ',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-playlist_add', level: 1, siteLevel: 'site', route: '/iam/role' },
                    '\u521B\u5EFA\u89D2\u8272'
                  ),
                  '\u6309\u94AE\u3002'
                ),
                _react2['default'].createElement(
                  'ul',
                  { className: 'ul1' },
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u9009\u62E9\u89D2\u8272\u5C42\u7EA7\uFF0C\u8F93\u5165\u89D2\u8272\u7F16\u7801\u3001\u89D2\u8272\u540D\u79F0\u3002'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u9009\u62E9\u89D2\u8272\u6807\u7B7E\u3002\uFF08\u9009\u586B\uFF09'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u70B9\u51FB',
                    _react2['default'].createElement(
                      _choerodonBootCombine.GuideMask,
                      { highLight: 'icon-add', level: 1, siteLevel: 'site', route: '/iam/role/create' },
                      '\u6DFB\u52A0\u6743\u9650'
                    ),
                    ',\u9009\u62E9\u8981\u7ED9\u89D2\u8272\u6DFB\u52A0\u7684\u6743\u9650.'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u70B9\u51FB\u521B\u5EFA\u6309\u94AE\u5B8C\u6210\u89D2\u8272\u521B\u5EFA'
                  )
                )
              )
            ),
            _react2['default'].createElement(
              'p',
              null,
              _react2['default'].createElement(_icon2['default'], { type: 'info', style: { color: '#ffb100', marginBottom: '3px' } }),
              _react2['default'].createElement(
                'span',
                null,
                ' \u89D2\u8272\u6807\u7B7E\u7528\u4E8E\u5B9A\u4E49\u89D2\u8272\u7684\u7279\u5B9A\u903B\u8F91\u7684\u529F\u80FD\uFF0C\u9700\u4E0E\u4EE3\u7801\u5F00\u53D1\u7ED3\u5408\u3002'
              )
            )
          );
        case 4:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u5206\u914D\u5E73\u53F0\u89D2\u8272'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u901A\u8FC7\u5E73\u53F0\u89D2\u8272\u5206\u914D\u60A8\u53EF\u4EE5\u5411\u6210\u5458\u5206\u914D\u5E73\u53F0\u5C42\u7684\u89D2\u8272\uFF0C\u4EE5\u4FBF\u4E8E\u6210\u5458\u6709\u6743\u9650\u5728\u5E73\u53F0\u5C42\u64CD\u4F5C\u3002'
            ),
            _react2['default'].createElement(
              _timeline2['default'],
              null,
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-person_add', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                        return _this2.handleCheck(dom);
                      } },
                    '\u5E73\u53F0\u89D2\u8272\u5206\u914D'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon-person_add', level: 2, siteLevel: 'site', className: 'no-border', mode: 'checkMask', onCheck: function onCheck(dom) {
                      return _this2.handleCheck(dom);
                    } },
                  this.getGuideCard('person_add', '平台角色分配')
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-arrow_drop_down', level: 3, idx: 1, siteLevel: 'site', route: '/iam/member-role' },
                    '\u6210\u5458\u7C7B\u578B\u9009\u62E9\u6846'
                  ),
                  '\uFF0C\u5207\u6362\u60A8\u8981\u8FDB\u884C\u89D2\u8272\u5206\u914D\u7684\u6210\u5458\u7C7B\u578B\u3002'
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB ',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-playlist_add', level: 1, siteLevel: 'site', route: '/iam/member-role' },
                    '\u6DFB\u52A0'
                  ),
                  '\u6309\u94AE\u3002 '
                ),
                _react2['default'].createElement(
                  'ul',
                  { className: 'ul1' },
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u9996\u5148\uFF0C\u9009\u62E9\u6210\u5458\u7C7B\u578B'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u8F93\u5165\u8981\u6DFB\u52A0\u89D2\u8272\u7684\u6210\u5458\u767B\u5F55\u540D\u3002'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u9009\u62E9\u5BF9\u5E94\u89D2\u8272'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u70B9\u51FB\u6DFB\u52A0\u6309\u94AE\u5B8C\u6210\u89D2\u8272\u5206\u914D'
                  )
                ),
                _react2['default'].createElement(_easyImg2['default'], { src: _siteRole2['default'] })
              )
            )
          );
        case 5:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u8BBE\u7F6Eroot\u7528\u6237'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'Root\u7528\u6237\u62E5\u6709\u7CFB\u7EDF\u7684\u6700\u9AD8\u6743\u9650\u3002\u4ED6\u53EF\u4EE5\u7BA1\u7406\u5E73\u53F0\u4EE5\u53CA\u5E73\u53F0\u4E0A\u7684\u6240\u6709\u7EC4\u7EC7\u548C\u9879\u76EE\u3002\u901A\u8FC7Root\u7528\u6237\u8BBE\u7F6E\u60A8\u53EF\u4EE5\u6DFB\u52A0\u6216\u79FB\u9664root\u7528\u6237\u3002'
            ),
            _react2['default'].createElement(
              _timeline2['default'],
              null,
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-root', level: 2, siteLevel: 'site', mode: 'checkMask', onCheck: function onCheck(dom) {
                        return _this2.handleCheck(dom);
                      } },
                    'Root\u7528\u6237\u8BBE\u7F6E'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon-root', level: 2, siteLevel: 'site', className: 'no-border', mode: 'checkMask', onCheck: function onCheck(dom) {
                      return _this2.handleCheck(dom);
                    } },
                  this.getGuideCard('root', 'Root用户设置')
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB ',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-playlist_add', level: 1, siteLevel: 'site', route: '/iam/root-user' },
                    '\u6DFB\u52A0'
                  ),
                  '\u6309\u94AE\u3002'
                ),
                _react2['default'].createElement(
                  'ul',
                  { className: 'ul1' },
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u8F93\u5165\u8981\u5206\u914DRoot\u6743\u9650\u7684\u6210\u5458\u767B\u5F55\u540D\u3002'
                  ),
                  _react2['default'].createElement(
                    'li',
                    null,
                    '\u70B9\u51FB\u6DFB\u52A0\u6309\u94AE\u5B8C\u6210Root\u7528\u6237\u8BBE\u7F6E\u3002'
                  )
                ),
                _react2['default'].createElement(_easyImg2['default'], { src: _rootRole2['default'] })
              )
            ),
            _react2['default'].createElement(
              'p',
              null,
              _react2['default'].createElement(_icon2['default'], { type: 'info', style: { color: '#f44336', marginBottom: '3px' } }),
              _react2['default'].createElement(
                'span',
                null,
                ' Root\u7528\u6237\u62E5\u6709\u7CFB\u7EDF\u7684\u6700\u9AD8\u6743\u9650\uFF0C\u8BF7\u8C28\u614E\u64CD\u4F5C\u3002'
              )
            )
          );
        case 6:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u5E73\u53F0\u81EA\u5B9A\u4E49\u8BBE\u7F6E'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u60A8\u53EF\u4EE5\u81EA\u5B9A\u4E49\u60A8\u7684\u83DC\u5355\uFF0C\u4EEA\u8868\u76D8\u4EE5\u53CA\u5E73\u53F0logo\u7B49\u6807\u5FD7\u6027\u914D\u7F6E\u3002'
            ),
            _react2['default'].createElement(
              _timeline2['default'],
              null,
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-view_list', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                        return _this2.handleCheck(dom);
                      } },
                    '\u83DC\u5355\u914D\u7F6E'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon-view_list', level: 2, className: 'no-border', mode: 'checkMask', onCheck: function onCheck(dom) {
                      return _this2.handleCheck(dom);
                    } },
                  this.getGuideCard('view_list', '菜单配置')
                ),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u62D6\u52A8\u76EE\u5F55/\u83DC\u5355\uFF0C\u8C03\u6574\u76EE\u5F55/\u83DC\u5355\u7684\u987A\u5E8F\u3002'
                ),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB ',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-playlist_add', level: 1, siteLevel: 'site', route: '/iam/menu-setting' },
                    '\u521B\u5EFA\u76EE\u5F55'
                  ),
                  '\u6309\u94AE\u3002\u5411\u5BF9\u5E94\u5C42\u7EA7\u6DFB\u52A0\u76EE\u5F55\u3002'
                ),
                _react2['default'].createElement(_easyImg2['default'], { src: _addMenu2['default'] }),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'ant-btn-primary', level: 0, siteLevel: 'site', route: '/iam/menu-setting' },
                    '\u4FDD\u5B58'
                  ),
                  '\u6309\u94AE\u5B8C\u6210\u83DC\u5355\u914D\u7F6E\u3002'
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-donut_small', level: 2, mode: 'checkMask', onCheck: function onCheck(dom) {
                        return _this2.handleCheck(dom);
                      } },
                    '\u4EEA\u8868\u76D8\u914D\u7F6E'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon-donut_small', level: 2, className: 'no-border', mode: 'checkMask', onCheck: function onCheck(dom) {
                      return _this2.handleCheck(dom);
                    } },
                  this.getGuideCard('donut_small', '仪表盘配置')
                ),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-mode_edit', level: 1, siteLevel: 'site', route: '/iam/dashboard-setting' },
                    '\u4FEE\u6539',
                    _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', style: { fontSize: 10 } })
                  ),
                  '\u56FE\u6807\uFF0C\u60A8\u53EF\u4EE5\u4FEE\u6539\u5361\u7247\u7684\u4FE1\u606F\uFF0C\u9009\u62E9\u662F\u5426\u5F00\u542F\u89D2\u8272\u63A7\u5236\u3002'
                ),
                _react2['default'].createElement(_easyImg2['default'], { src: _card2['default'] }),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-remove_circle_outline', level: 1, siteLevel: 'site', route: '/iam/dashboard-setting' },
                    '\u542F\u505C\u7528',
                    _react2['default'].createElement(_icon2['default'], { type: 'finished', style: { fontSize: 10 } })
                  ),
                  '\u6309\u94AE\uFF0C\u53EF\u4EE5\u63A7\u5236\u6B64\u5361\u7247\u662F\u5426\u542F\u505C\u7528\u3002'
                )
              ),
              _react2['default'].createElement(
                _timeline2['default'].Item,
                null,
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u9009\u62E9',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-settings', idx: 1, level: 2 },
                    '\u7CFB\u7EDF\u914D\u7F6E'
                  )
                ),
                _react2['default'].createElement(
                  _choerodonBootCombine.GuideMask,
                  { highLight: 'icon-settings', idx: 1, level: 2, className: 'no-border' },
                  this.getGuideCard('settings', '系统配置')
                ),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u60A8\u53EF\u4EE5\u4E0A\u4F20\u5E73\u53F0\u5FBD\u6807\u3001\u56FE\u5F62\u6807\uFF0C\u81EA\u5B9A\u4E49\u5E73\u53F0\u7B80\u79F0\u3001\u5168\u79F0\uFF0C\u66F4\u6539\u5E73\u53F0\u9ED8\u8BA4\u5BC6\u7801\u548C\u9ED8\u8BA4\u8BED\u8A00\u7684\u987A\u5E8F\u3002'
                ),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u70B9\u51FB',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'ant-btn-primary', level: 0, siteLevel: 'site', route: '/iam/system-setting' },
                    '\u4FDD\u5B58'
                  ),
                  '\u6309\u94AE\u5B8C\u6210\u7CFB\u7EDF\u914D\u7F6E\u3002'
                ),
                _react2['default'].createElement(
                  'p',
                  null,
                  '\u60A8\u53EF\u4EE5\u70B9\u51FB ',
                  _react2['default'].createElement(
                    _choerodonBootCombine.GuideMask,
                    { highLight: 'icon-swap_horiz', level: 1, siteLevel: 'site', route: '/iam/system-setting' },
                    '\u91CD\u7F6E'
                  ),
                  '\u6309\u94AE\uFF0C\u8FD8\u539F\u5230\u9ED8\u8BA4\u914D\u7F6E\u3002'
                )
              )
            )
          );
        default:
          return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })
            ),
            _react2['default'].createElement(
              'h2',
              null,
              '\u5B8C\u6210'
            ),
            _react2['default'].createElement('div', { className: 'icon-winner' }),
            _react2['default'].createElement(
              'p',
              null,
              '\u606D\u559C\uFF01'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u73B0\u5728\u60A8\u5DF2\u7ECF\u77E5\u9053\u4F5C\u4E3A\u5E73\u53F0\u7BA1\u7406\u5458\uFF0C\u8981\u5982\u4F55\u8FDB\u884C\u7CFB\u7EDF\u5E73\u53F0\u7684\u4E00\u4E9B\u5217\u914D\u7F6E\u548C\u8BBE\u7F6E\u3002'
            ),
            _react2['default'].createElement(
              'p',
              null,
              '\u60A8\u53EF\u4EE5\u70B9\u51FB\u8868\u5355\u9875\u9762\u7684\u201C',
              _react2['default'].createElement(
                'a',
                { href: 'http://choerodon.io', target: '_blank' },
                '\u4E86\u89E3\u66F4\u591A',
                _react2['default'].createElement(_icon2['default'], { type: 'open_in_new' })
              ),
              '\u201D\uFF0C\u4E86\u89E3\u7CFB\u7EDF\u914D\u7F6E\u7684\u66F4\u591A\u7528\u6237\u624B\u518C\u3002'
            ),
            _react2['default'].createElement(
              'p',
              null,
              _react2['default'].createElement(
                'a',
                { href: 'http://v0-10.choerodon.io/zh/docs/user-guide/system-configuration/platform/menu_configuration/', target: '_blank' },
                '\u83DC\u5355\u914D\u7F6E',
                _react2['default'].createElement(_icon2['default'], { type: 'open_in_new' })
              ),
              ' \u7528\u4E8E\u914D\u7F6E\u5E73\u53F0\u83DC\u5355'
            ),
            _react2['default'].createElement(
              'p',
              null,
              _react2['default'].createElement(
                'a',
                { href: 'http://v0-10.choerodon.io/zh/docs/user-guide/system-configuration/platform/dashboard-config/', target: '_blank' },
                '\u4EEA\u8868\u76D8\u914D\u7F6E',
                _react2['default'].createElement(_icon2['default'], { type: 'open_in_new' })
              ),
              ' \u7528\u4E8E\u9884\u7F6E\u7528\u6237\u53EF\u89C1\u7684\u4EEA\u8868\u76D8\u5361\u7247'
            ),
            _react2['default'].createElement(
              'p',
              null,
              _react2['default'].createElement(
                'a',
                { href: 'http://choerodon.io/zh/docs/user-guide/system-configuration/tenant/ldap/', target: '_blank' },
                'LDAP',
                _react2['default'].createElement(_icon2['default'], { type: 'open_in_new' })
              ),
              ' \u5BF9\u7EC4\u7EC7\u5E94\u7528\u7684LDAP\u4FE1\u606F\u8BBE\u7F6E\u7684\u7BA1\u7406'
            )
          );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var GuideStore = this.props.GuideStore;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-guide-site-basic' },
        _react2['default'].createElement(
          'div',
          { style: { width: '90%', margin: '0 auto' } },
          _react2['default'].createElement(_choerodonBootCombine.StepBar, { current: GuideStore.getCurrentStep, total: 7 }),
          this.renderStep(GuideStore.getCurrentStep)
        ),
        _react2['default'].createElement(_choerodonBootCombine.StepFooter, { total: 7 })
      );
    }
  }]);
  return SiteBasic;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = SiteBasic;
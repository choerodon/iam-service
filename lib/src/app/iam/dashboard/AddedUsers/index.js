'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/spin/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AddedUsers = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(AddedUsers, _Component);

  function AddedUsers(props) {
    (0, _classCallCheck3['default'])(this, AddedUsers);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (AddedUsers.__proto__ || Object.getPrototypeOf(AddedUsers)).call(this, props));

    _this.loadUserCount = function () {
      _choerodonBootCombine.axios.get('iam/v1/users/new').then(function (data) {
        if (!data.failed) {
          _this.setState({
            newUsers: data.newUsers,
            allUsers: data.allUsers,
            loading: false
          });
        } else {
          Choerodon.prompt(data.message);
        }
      });
    };

    _this.state = {
      newUsers: 0,
      allUsers: 100,
      loading: true
    };
    return _this;
  }

  (0, _createClass3['default'])(AddedUsers, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadUserCount();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          newUsers = _state.newUsers,
          allUsers = _state.allUsers,
          loading = _state.loading;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-dashboard-addedusers' },
        loading ? _react2['default'].createElement(_spin2['default'], { spinning: loading }) : _react2['default'].createElement(
          _react2['default'].Fragment,
          null,
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-addedusers-main' },
            _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                'span',
                null,
                newUsers
              ),
              _react2['default'].createElement(
                'span',
                null,
                '\u4EBA'
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'c7n-iam-dashboard-addedusers-bottom' },
            '\u7528\u6237\u603B\u6570: ',
            allUsers
          )
        )
      );
    }
  }]);
  return AddedUsers;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = AddedUsers;
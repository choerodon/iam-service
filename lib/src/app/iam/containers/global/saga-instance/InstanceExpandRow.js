'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _row = require('choerodon-ui/lib/row');

var _row2 = _interopRequireDefault(_row);

var _col = require('choerodon-ui/lib/col');

var _col2 = _interopRequireDefault(_col);

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/row/style');

require('choerodon-ui/lib/col/style');

require('choerodon-ui/lib/popover/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var InstanceExpandRow = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(InstanceExpandRow, _Component);

  function InstanceExpandRow() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, InstanceExpandRow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = InstanceExpandRow.__proto__ || Object.getPrototypeOf(InstanceExpandRow)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      detail: null
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(InstanceExpandRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          id = _props.record.id,
          apiGateWay = _props.apiGateWay;

      _choerodonBootCombine.axios.get(apiGateWay + 'instances/' + id + '/details').then(function (data) {
        _this2.setState({
          detail: data
        });
      });
    }
  }, {
    key: 'getCircle',
    value: function getCircle() {
      var _state$detail = this.state.detail,
          completed = _state$detail.completedCount,
          failed = _state$detail.failedCount,
          running = _state$detail.runningCount,
          waitToBePulled = _state$detail.waitToBePulledCount;
      var _props2 = this.props,
          intl = _props2.intl,
          expand = _props2.expand;

      var sum = completed + failed + running + waitToBePulled;
      var status = this.props.record.status;

      var completedCorrect = sum > 0 ? (completed + running + waitToBePulled) / sum * (Math.PI * 2 * 30) : 0;
      var runningCorrect = sum > 0 ? (running + waitToBePulled) / sum * (Math.PI * 2 * 30) : 0;
      var waitToBePulledCorrect = sum > 0 ? waitToBePulled / sum * (Math.PI * 2 * 30) : 0;
      return _react2['default'].createElement(
        'svg',
        { width: '80', height: '80', onClick: expand },
        _react2['default'].createElement(
          _popover2['default'],
          { placement: 'left', content: _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement('div', { className: 'c7n-saga-spot c7n-saga-spot-error' }),
              '\u5931\u8D25\u4EFB\u52A1\uFF1A' + failed
            ) },
          _react2['default'].createElement('circle', {
            cx: '40',
            cy: '40',
            r: '30',
            strokeWidth: 5,
            stroke: failed > 0 ? '#f44336' : '#f3f3f3',
            className: 'c7n-saga-circle-error'
          })
        ),
        _react2['default'].createElement(
          _popover2['default'],
          { placement: 'left', content: _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement('div', { className: 'c7n-saga-spot c7n-saga-spot-completed' }),
              '\u5B8C\u6210\u4EFB\u52A1\uFF1A' + completed
            ) },
          _react2['default'].createElement('circle', {
            cx: '40',
            cy: '40',
            r: '30',
            stroke: completed > 0 ? '#00bfa5' : '#f3f3f3',
            className: 'c7n-saga-circle',
            strokeDasharray: completedCorrect + ', 10000'
          })
        ),
        _react2['default'].createElement(
          _popover2['default'],
          { placement: 'left', content: _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement('div', { className: 'c7n-saga-spot c7n-saga-spot-running' }),
              '\u8FDB\u884C\u4E2D\u4EFB\u52A1\uFF1A' + running
            ) },
          _react2['default'].createElement('circle', {
            cx: '40',
            cy: '40',
            r: '30',
            stroke: running > 0 ? '#4d90fe' : '#f3f3f3',
            className: 'c7n-saga-circle-running',
            strokeDasharray: runningCorrect + ', 10000'
          })
        ),
        _react2['default'].createElement(
          _popover2['default'],
          { placement: 'left', content: _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement('div', { className: 'c7n-saga-spot c7n-saga-spot-queue' }),
              '\u7B49\u5F85\u88AB\u62C9\u53D6\uFF1A' + waitToBePulled
            ) },
          _react2['default'].createElement('circle', {
            cx: '40',
            cy: '40',
            r: '30',
            stroke: waitToBePulled > 0 ? '#ffb100' : '#f3f3f3',
            className: 'c7n-saga-circle-queue',
            strokeDasharray: waitToBePulledCorrect + ', 10000'
          })
        ),
        _react2['default'].createElement(
          'text',
          { x: '50%', y: '39.5', className: 'c7n-saga-circle-num' },
          completed + '/' + sum
        ),
        _react2['default'].createElement(
          'text',
          { x: '50%', y: '54', fontSize: '12', className: 'c7n-saga-circle-text' },
          intl.formatMessage({ id: status.toLowerCase() })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var detail = this.state.detail;
      var intl = this.props.intl;

      if (!detail) {
        return null;
      }
      var id = detail.id,
          sagaCode = detail.sagaCode,
          description = detail.description,
          service = detail.service,
          level = detail.level,
          startTime = detail.startTime,
          endTime = detail.endTime,
          refType = detail.refType,
          refId = detail.refId,
          completed = detail.completed,
          failed = detail.failed,
          running = detail.running;


      return _react2['default'].createElement(
        _react2['default'].Fragment,
        null,
        _react2['default'].createElement(
          _row2['default'],
          { style: { marginTop: 25 } },
          _react2['default'].createElement(
            _col2['default'],
            { span: 14 },
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                'ID:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                id
              )
            ),
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                '\u6240\u5C5E\u4E8B\u52A1\u5B9A\u4E49:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                sagaCode
              )
            ),
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                '\u63CF\u8FF0:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                description
              )
            ),
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                '\u6240\u5C5E\u5FAE\u670D\u52A1:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                service
              )
            ),
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                '\u89E6\u53D1\u5C42\u7EA7:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                level
              )
            )
          ),
          _react2['default'].createElement(
            _col2['default'],
            { span: 10 },
            _react2['default'].createElement(
              'div',
              { className: 'c7n-saga-expand-circle' },
              this.getCircle()
            )
          )
        ),
        _react2['default'].createElement(
          _row2['default'],
          { className: 'c7n-saga-expand-row' },
          _react2['default'].createElement(
            _col2['default'],
            { span: 4 },
            '\u5F00\u59CB\u65F6\u95F4:'
          ),
          _react2['default'].createElement(
            _col2['default'],
            { span: 5 },
            _react2['default'].createElement('div', { style: { width: 3, height: 1, display: 'inline-block' } }),
            startTime
          ),
          _react2['default'].createElement(
            _col2['default'],
            { span: 3 },
            '\u7ED3\u675F\u65F6\u95F4:'
          ),
          _react2['default'].createElement(
            _col2['default'],
            { span: 5 },
            endTime
          )
        ),
        _react2['default'].createElement(
          _row2['default'],
          { className: 'c7n-saga-expand-row-divider', span: 14 },
          '\u5173\u8054\u4E1A\u52A1'
        ),
        _react2['default'].createElement(
          _row2['default'],
          { style: { marginBottom: 24 } },
          _react2['default'].createElement(
            _col2['default'],
            { span: 14 },
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                '\u5173\u8054\u4E1A\u52A1\u7C7B\u578B:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                refType
              )
            ),
            _react2['default'].createElement(
              _row2['default'],
              { className: 'c7n-saga-expand-row' },
              _react2['default'].createElement(
                _col2['default'],
                { span: 7 },
                '\u5173\u8054\u4E1A\u52A1ID:'
              ),
              _react2['default'].createElement(
                _col2['default'],
                { span: 14 },
                refId
              )
            )
          )
        )
      );
    }
  }]);
  return InstanceExpandRow;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = InstanceExpandRow;
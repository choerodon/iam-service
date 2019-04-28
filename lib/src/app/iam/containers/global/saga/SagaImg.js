'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _class;

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _SagaInstanceStore = require('../../../stores/global/saga-instance/SagaInstanceStore');

var _SagaInstanceStore2 = _interopRequireDefault(_SagaInstanceStore);

var _jsonFormat = require('../../../common/json-format');

var _jsonFormat2 = _interopRequireDefault(_jsonFormat);

var _SagaStore = require('../../../stores/global/saga/SagaStore');

var _SagaStore2 = _interopRequireDefault(_SagaStore);

require('./style/saga-img.scss');

require('./style/saga.scss');

require('./style/json.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlPrefix = 'global.saga';
var TabPane = _tabs2['default'].TabPane;

var SagaImg = (0, _reactIntl.injectIntl)(_class = function (_Component) {
  (0, _inherits3['default'])(SagaImg, _Component);
  (0, _createClass3['default'])(SagaImg, [{
    key: 'getInitState',
    value: function getInitState() {
      var _props = this.props,
          instance = _props.instance,
          data = _props.data;

      return {
        showDetail: false,
        task: {},
        json: '',
        lineData: {},
        activeCode: '',
        activeTab: instance ? 'run' : '',
        jsonTitle: false, // 是否展示input output
        data: data,
        intervals: []
      };
    }
  }]);

  function SagaImg(props) {
    (0, _classCallCheck3['default'])(this, SagaImg);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (SagaImg.__proto__ || Object.getPrototypeOf(SagaImg)).call(this, props));

    _this.state = _this.getInitState();

    _this.handleScroll = function (container) {
      var imgDom = _this.taskImg.current;
      var detail = _this.taskDetail.current;
      if (!imgDom) {
        return;
      }
      var imgHeight = imgDom.scrollHeight;
      var top = imgDom.offsetTop;
      if (detail && imgHeight + top > container.clientHeight && imgHeight > detail.scrollHeight) {
        var detailHeight = detail.scrollHeight;
        var detailTop = container.scrollTop;
        if (detailTop > top) {
          if (detailHeight > container.clientHeight) {
            detailTop = Math.min(imgHeight - detailHeight + top, detailTop);
          }
          detail.style.cssText = 'top: ' + detailTop + 'px';
          detail.classList.add('autoscroll');
        } else {
          detail.classList.remove('autoscroll');
          detail.style.cssText = '';
        }
      } else if (detail) {
        detail.classList.remove('autoscroll');
        detail.style.cssText = '';
      }
    };

    _this.getLineData = function (tasks) {
      var lineData = {};
      var _this$state$task = _this.state.task,
          code = _this$state$task.code,
          taskCode = _this$state$task.taskCode;

      tasks.forEach(function (items) {
        return items.forEach(function (task) {
          lineData[task.code || task.taskCode] = task;
        });
      });
      var task = (0, _extends3['default'])({}, lineData[code || taskCode]);
      _this.setState({
        lineData: lineData,
        task: task
      });
    };

    _this.circleWrapper = function (code) {
      var activeCode = _this.state.activeCode;
      var instance = _this.props.instance;

      var clsNames = (0, _classnames3['default'])('c7n-saga-img-circle', {
        'c7n-saga-task-active': code.toLowerCase() === activeCode,
        output: !instance && code === 'Output'
      });
      return _react2['default'].createElement(
        'div',
        {
          className: clsNames,
          onClick: _this.showDetail.bind(_this, code.toLowerCase()),
          key: code
        },
        code
      );
    };

    _this.squareWrapper = function (node) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (typeof node === 'string') {
        var instance = _this.props.instance;
        var activeCode = _this.state.activeCode;

        var clsNames = (0, _classnames3['default'])('c7n-saga-img-square', (0, _defineProperty3['default'])({
          'c7n-saga-task-active': node === activeCode
        }, status.toLowerCase(), !!instance));
        return _react2['default'].createElement(
          'div',
          {
            className: clsNames,
            onClick: _this.showDetail.bind(_this, node),
            key: node
          },
          _react2['default'].createElement(
            'span',
            null,
            node
          )
        );
      }
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-saga-img-squares' },
        node
      );
    };

    _this.line = function () {
      return _react2['default'].createElement('div', { className: 'c7n-saga-img-line' });
    };

    _this.showDetail = function (code) {
      var instance = _this.props.instance;

      if (!instance && code === 'output') {
        return;
      }
      if (code === 'input' || code === 'output') {
        var formatMessage = _this.props.intl.formatMessage;
        var data = _this.state.data;

        _this.setState({
          showDetail: false,
          jsonTitle: formatMessage({ id: intlPrefix + '.task.' + code + '.title' }),
          json: data[code],
          activeCode: code
        }, function () {
          var container = _this.getSidebarContainer();
          _this.handleScroll(container);
        });
        return;
      }
      var lineData = _this.state.lineData;

      var task = (0, _extends3['default'])({}, lineData[code]);
      _this.setState({
        showDetail: true,
        jsonTitle: false,
        task: task,
        activeCode: code
      }, function () {
        var container = _this.getSidebarContainer();
        _this.handleScroll(container);
      });
    };

    _this.handleTabChange = function (activeTab) {
      var instance = _this.props.instance;


      _this.setState({
        activeTab: instance ? activeTab : ''
      });
    };

    _this.handleUnLock = function () {
      var id = _this.state.task.id;
      var formatMessage = _this.props.intl.formatMessage;

      _SagaInstanceStore2['default'].unLock(id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.reload();
          Choerodon.prompt(formatMessage({ id: intlPrefix + '.task.unlock.success' }));
        }
      });
    };

    _this.handleAbort = function () {
      var id = _this.state.task.id;

      _SagaInstanceStore2['default'].abort(id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          _this.reload();
        }
      });
    };

    _this.handleRetry = function () {
      var _this$state = _this.state,
          id = _this$state.task.id,
          intervals = _this$state.intervals;
      var formatMessage = _this.props.intl.formatMessage;

      _SagaInstanceStore2['default'].retry(id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          clearInterval(intervals);
          _this.setState({
            intervals: setInterval(function () {
              return _this.reload();
            }, 2000)
          });
          _this.reload();
          Choerodon.prompt(formatMessage({ id: intlPrefix + '.task.retry.success' }));
        }
      });
    };

    _this.handleCopy = function () {
      var formatMessage = _this.props.intl.formatMessage;
      var exceptionMessage = _this.state.task.exceptionMessage;

      var failed = document.getElementById('failed');
      failed.value = exceptionMessage;
      failed.select();
      document.execCommand('copy');
      Choerodon.prompt(formatMessage({ id: 'copy.success' }));
    };

    _this.handleTransObj = function (str) {
      var obj = null;
      if (!str) {
        return obj;
      }
      obj = JSON.parse(str);
      if (typeof obj === 'string') {
        /* eslint-disable-next-line */
        obj = eval(obj);
      }
      return obj;
    };

    _this.renderContent = function () {
      var tasks = _this.state.data.tasks;

      var line = _this.line();
      var content = [];
      if (tasks.length) {
        content.push(line);
        tasks.forEach(function (items) {
          var node = items.map(function (_ref) {
            var code = _ref.code,
                taskCode = _ref.taskCode,
                status = _ref.status;
            return _this.squareWrapper(code || taskCode, status);
          });
          if (node.length === 1) {
            content.push(node);
          } else {
            content.push(_this.squareWrapper(node));
          }
          content.push(line);
        });
        return content;
      }
      return line;
    };

    _this.renderTaskRunDetail = function () {
      var formatMessage = _this.props.intl.formatMessage;
      var _this$state$task2 = _this.state.task,
          code = _this$state$task2.code,
          taskCode = _this$state$task2.taskCode,
          status = _this$state$task2.status,
          seq = _this$state$task2.seq,
          maxRetryCount = _this$state$task2.maxRetryCount,
          retriedCount = _this$state$task2.retriedCount,
          instanceLock = _this$state$task2.instanceLock,
          exceptionMessage = _this$state$task2.exceptionMessage,
          output = _this$state$task2.output,
          plannedStartTime = _this$state$task2.plannedStartTime,
          actualStartTime = _this$state$task2.actualStartTime,
          actualEndTime = _this$state$task2.actualEndTime;

      var list = [{
        key: formatMessage({ id: intlPrefix + '.task.code' }),
        value: code || taskCode
      }, {
        key: formatMessage({ id: intlPrefix + '.task.run.status' }),
        value: _this.renderStatus(status)
      }, {
        key: formatMessage({ id: intlPrefix + '.task.seq' }),
        value: seq
      }, {
        key: formatMessage({ id: intlPrefix + '.task.run.service-instance' }),
        value: instanceLock
      }, {
        key: formatMessage({ id: intlPrefix + '.task.max-retry' }),
        value: maxRetryCount
      }, {
        key: formatMessage({ id: intlPrefix + '.task.run.retried' }),
        value: retriedCount
      }, {
        key: formatMessage({ id: intlPrefix + '.task.plannedstarttime' }),
        value: plannedStartTime
      }, {
        key: formatMessage({ id: intlPrefix + '.task.actualstarttime' }),
        value: actualStartTime
      }, {
        key: formatMessage({ id: intlPrefix + '.task.actualendtime' }),
        value: actualEndTime
      }];
      var failed = {
        key: formatMessage({ id: intlPrefix + '.task.run.exception.msg' }),
        value: exceptionMessage
      };

      var obj = _this.handleTransObj(output);
      var completed = {
        key: formatMessage({ id: intlPrefix + '.task.run.result.msg' }),
        value: obj ? (0, _jsonFormat2['default'])(obj) : formatMessage({ id: intlPrefix + '.json.nodata' })
      };
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-saga-task-run' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-task-btns' },
          instanceLock && (status === 'RUNNING' || status === 'FAILED') && _react2['default'].createElement(
            'span',
            { onClick: _this.handleUnLock },
            _react2['default'].createElement(_icon2['default'], { type: 'lock_open' }),
            formatMessage({ id: intlPrefix + '.task.unlock' })
          ),
          status === 'FAILED' && _react2['default'].createElement(
            'span',
            { onClick: _this.handleRetry },
            _react2['default'].createElement(_icon2['default'], { type: 'sync' }),
            formatMessage({ id: intlPrefix + '.task.retry' })
          ),
          (status === 'RUNNING' || status === 'WAIT_TO_BE_PULLED') && _react2['default'].createElement(
            'span',
            { onClick: _this.handleAbort, style: { color: '#f44336' } },
            _react2['default'].createElement(_icon2['default'], { type: 'power_settings_new' }),
            formatMessage({ id: intlPrefix + '.task.abort' })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-task-detail' },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-saga-task-detail-content' },
            list.map(function (_ref2) {
              var key = _ref2.key,
                  value = _ref2.value;
              return _react2['default'].createElement(
                'div',
                { key: 'task-run-' + key },
                key,
                ': ',
                value
              );
            }),
            status === 'FAILED' && _react2['default'].createElement(
              'div',
              null,
              failed.key,
              ':',
              _react2['default'].createElement(
                'div',
                { className: 'c7n-saga-detail-json' },
                _react2['default'].createElement(
                  'pre',
                  { style: { maxHeight: '350px' } },
                  _react2['default'].createElement(
                    'code',
                    null,
                    failed.value.trim()
                  )
                ),
                _react2['default'].createElement('textarea', { id: 'failed' }),
                failed.value && _react2['default'].createElement(_icon2['default'], {
                  type: 'library_books',
                  className: 'copy-icon',
                  onClick: _this.handleCopy
                })
              )
            ),
            status === 'COMPLETED' && _react2['default'].createElement(
              'div',
              null,
              completed.key,
              ':',
              _react2['default'].createElement(
                'div',
                { className: 'c7n-saga-detail-json' },
                _react2['default'].createElement(
                  'pre',
                  { style: { maxHeight: '350px' } },
                  _react2['default'].createElement(
                    'code',
                    null,
                    completed.value
                  )
                )
              )
            )
          )
        )
      );
    };

    _this.renderTaskDetail = function () {
      var _this$props = _this.props,
          formatMessage = _this$props.intl.formatMessage,
          instance = _this$props.instance;
      var _this$state$task3 = _this.state.task,
          code = _this$state$task3.code,
          taskCode = _this$state$task3.taskCode,
          description = _this$state$task3.description,
          seq = _this$state$task3.seq,
          maxRetryCount = _this$state$task3.maxRetryCount,
          timeoutSeconds = _this$state$task3.timeoutSeconds,
          timeoutPolicy = _this$state$task3.timeoutPolicy,
          service = _this$state$task3.service,
          concurrentLimitPolicy = _this$state$task3.concurrentLimitPolicy,
          concurrentLimitNum = _this$state$task3.concurrentLimitNum,
          inputSchema = _this$state$task3.inputSchema;

      var list = [{
        key: formatMessage({ id: intlPrefix + '.task.code' }),
        value: code || taskCode
      }, {
        key: formatMessage({ id: intlPrefix + '.task.desc' }),
        value: description
      }, {
        key: formatMessage({ id: intlPrefix + '.task.seq' }),
        value: seq
      }, {
        key: formatMessage({ id: intlPrefix + '.task.concurrentlimit.policy' }),
        value: concurrentLimitPolicy
      }, {
        key: formatMessage({ id: intlPrefix + '.task.concurrentlimit.num' }),
        value: concurrentLimitNum
      }, {
        key: formatMessage({ id: intlPrefix + '.task.max-retry' }),
        value: maxRetryCount
      }, {
        key: formatMessage({ id: intlPrefix + '.task.timeout.time' }),
        value: timeoutSeconds
      }, {
        key: formatMessage({ id: intlPrefix + '.task.timeout.policy' }),
        value: timeoutPolicy
      }, {
        key: formatMessage({ id: intlPrefix + '.task.service' }),
        value: service
      }];
      var input = {
        key: formatMessage({ id: intlPrefix + '.task.input.demo' }),
        value: inputSchema ? (0, _jsonFormat2['default'])(JSON.parse(inputSchema)) : formatMessage({ id: intlPrefix + '.json.nodata' })
      };
      return _react2['default'].createElement(
        'div',
        { className: 'c7n-saga-task-detail' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-task-detail-content' },
          list.map(function (_ref3) {
            var key = _ref3.key,
                value = _ref3.value;
            return _react2['default'].createElement(
              'div',
              { key: 'task-detail-' + key },
              key,
              ': ',
              value
            );
          }),
          !instance && _react2['default'].createElement(
            'div',
            null,
            input.key,
            ':',
            _react2['default'].createElement(
              'div',
              { className: 'c7n-saga-detail-json' },
              _react2['default'].createElement(
                'pre',
                { style: { maxHeight: '350px' } },
                _react2['default'].createElement(
                  'code',
                  null,
                  input.value
                )
              )
            )
          )
        )
      );
    };

    _this.taskDetail = _react2['default'].createRef();
    _this.taskImg = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(SagaImg, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var tasks = this.state.data.tasks;

      this.getLineData(tasks);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.addScrollEventListener();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var intervals = this.state.intervals;

      clearInterval(intervals);
    }
  }, {
    key: 'getSidebarContainer',
    value: function getSidebarContainer() {
      var content = document.body.getElementsByClassName('ant-modal-sidebar')[0];
      return content.getElementsByClassName('ant-modal-body')[0];
    }
  }, {
    key: 'addScrollEventListener',
    value: function addScrollEventListener() {
      var container = this.getSidebarContainer();
      container.addEventListener('scroll', this.handleScroll.bind(this, container));
    }

    // removeScrollEventListener() {
    //   const container = this.getSidebarContainer();
    //   container.removeEventListener('scroll', this.handleScroll);
    // }

    /**
     * 1. taskImg 超出 detail未超出屏幕高度
     * 2. taskImg 未超出 detail超出屏幕高度 (不做处理)
     * 3. taskImg 未超出 detail也没有超出 (不会有滚动)
     * 4. taskImg 超出 detail也超出  taskImg没有detail超出的多
     * 5. taskImg 超出 detail也超出  taskImg比detail超出的多
     */

  }, {
    key: 'reload',
    value: function reload() {
      var _this2 = this;

      var _state = this.state,
          id = _state.data.id,
          intervals = _state.intervals;
      var instance = this.props.instance;

      var store = instance ? _SagaInstanceStore2['default'] : _SagaStore2['default'];
      store.loadDetailData(id).then(function (data) {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          var tasks = data.tasks,
              status = data.status;

          _this2.setState({ data: data });
          _this2.getLineData(tasks);
          if (status !== 'RUNNING') {
            clearInterval(intervals);
          }
        }
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var tasks = nextProps.data.tasks;
      // const { data } = this.props;

      this.setState(this.getInitState(), function () {
        _this3.setState({ data: nextProps.data });
        _this3.getLineData(tasks);
      });
    }
  }, {
    key: 'renderStatus',
    value: function renderStatus(status) {
      var obj = {};
      switch (status) {
        case 'RUNNING':
          obj = {
            key: 'running',
            value: '运行中'
          };
          break;
        case 'FAILED':
          obj = {
            key: 'failed',
            value: '失败'
          };
          break;
        case 'WAIT_TO_BE_PULLED':
          obj = {
            key: 'queue',
            value: '等待被拉取'
          };
          break;
        case 'COMPLETED':
          obj = {
            key: 'completed',
            value: '完成'
          };
          break;
        default:
          break;
      }
      return _react2['default'].createElement(
        'span',
        { className: 'c7n-saga-status ' + obj.key },
        obj.value
      );
    }
  }, {
    key: 'renderJson',
    value: function renderJson() {
      var _state2 = this.state,
          jsonTitle = _state2.jsonTitle,
          json = _state2.json;
      var formatMessage = this.props.intl.formatMessage;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-saga-task-detail' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-task-detail-title' },
          jsonTitle
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-task-detail-content' },
          _react2['default'].createElement(
            'div',
            { className: 'c7n-saga-detail-json' },
            _react2['default'].createElement(
              'pre',
              { style: { maxHeight: '350px' } },
              _react2['default'].createElement(
                'code',
                { id: 'json' },
                json ? (0, _jsonFormat2['default'])(this.handleTransObj(json)) : formatMessage({ id: intlPrefix + '.json.nodata' })
              )
            )
          )
        )
      );
    }
  }, {
    key: 'renderWithoutInstance',
    value: function renderWithoutInstance() {
      var json = this.state.json;
      var formatMessage = this.props.intl.formatMessage;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-saga-task-detail' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-task-detail-title' },
          _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.detail.title' })
        ),
        this.renderTaskDetail()
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var instance = this.props.instance;
      var _state3 = this.state,
          showDetail = _state3.showDetail,
          jsonTitle = _state3.jsonTitle,
          activeTab = _state3.activeTab;

      var input = this.circleWrapper('Input');
      var output = this.circleWrapper('Output');
      var clsNames = (0, _classnames3['default'])('c7n-saga-img-detail-wrapper', {
        'c7n-saga-instance': !!instance
      });
      return _react2['default'].createElement(
        'div',
        { className: clsNames },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-img', ref: this.taskImg },
          input,
          this.renderContent(),
          output
        ),
        showDetail && _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-img-detail', ref: this.taskDetail },
          instance && _react2['default'].createElement(
            _tabs2['default'],
            { activeKey: activeTab, onChange: this.handleTabChange },
            _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.run.title' }), key: 'run' }),
            _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.task.detail.title' }), key: 'detail' })
          ),
          instance && activeTab === 'run' ? this.renderTaskRunDetail() : '',
          instance && activeTab !== 'run' ? this.renderTaskDetail() : '',
          instance ? '' : this.renderWithoutInstance()
        ),
        jsonTitle && _react2['default'].createElement(
          'div',
          { className: 'c7n-saga-img-detail', ref: this.taskDetail },
          this.renderJson()
        )
      );
    }
  }]);
  return SagaImg;
}(_react.Component)) || _class;

exports['default'] = SagaImg;
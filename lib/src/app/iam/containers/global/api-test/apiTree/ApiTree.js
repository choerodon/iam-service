'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

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

var _tree = require('choerodon-ui/lib/tree');

var _tree2 = _interopRequireDefault(_tree);

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _dec, _class;

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/tree/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

require('./ApiTree.scss');

var _apiTest = require('../../../../stores/global/api-test');

var _apiTest2 = _interopRequireDefault(_apiTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TreeNode = _tree2['default'].TreeNode;

var ApiTree = (_dec = (0, _mobxReact.inject)('AppState'), (0, _reactIntl.injectIntl)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(ApiTree, _Component);

  function ApiTree() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ApiTree);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ApiTree.__proto__ || Object.getPrototypeOf(ApiTree)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      searchValue: '',
      treeData: [],
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 200,
        total: 0
      },
      expandedKeys: [],
      autoExpandParent: false,
      eventKey: null, // 当前点击节点的key
      selectedKeys: []
    }, _this.loadInitData = function () {
      // APITestStore.setLoading(true);
      _apiTest2['default'].loadApis().then(function (res) {
        if (res.failed) {
          Choerodon.prompt(res.message);
          // APITestStore.setLoading(false);
        } else if (res.service.length) {
          _apiTest2['default'].setService(res.service);
          _apiTest2['default'].setPageLoading(false);
          _this.generateList(res.service);
          _this.setState({
            treeData: res.service
          });
        }
      });
    }, _this.generateList = function (data) {
      for (var i = 0; i < data.length; i += 1) {
        var node = data[i];
        var key = node.key;
        var title = node.title;
        _this.state.dataList.push({ key: key, title: title });
        if (node.children) {
          _this.generateList(node.children, node.key);
        }
      }
    }, _this.onExpand = function (newExpandedKeys) {
      _this.setState({
        expandedKeys: newExpandedKeys,
        autoExpandParent: false
      });
      // APITestStore.setExpandedKeys(expandedKeys);
      // const { expandedKeys } = this.state;
      // let newKey;
      // if (expanded) {
      //   // newKey = expandedKeys.filter(el => el !== newExpandedKeys[0]);
      //   this.setState({
      //     expandedKeys: newExpandedKeys,
      //     autoExpandParent: false,
      //   });
      // } else {
      //   window.console.log('test');
      // }
      // this.setState({ expandedKeys, autoExpandParent: false });
    }, _this.onSelect = function (selectedKey, info) {
      if (info.selectedNodes[0].props.children && !info.selectedNodes[0].props.children.length) {
        return;
      }

      if (!info.selectedNodes[0].props.children) {
        var getDetail = _this.props.getDetail;

        _apiTest2['default'].setCurrentNode(info.selectedNodes);
        getDetail(info.selectedNodes);
      } else {
        var expandedKeys = _this.state.expandedKeys;

        var index = expandedKeys.indexOf(selectedKey[0]);
        var newExpandedKey = void 0;
        if (index === -1) {
          newExpandedKey = expandedKeys;
          newExpandedKey.push(selectedKey[0]);
        } else {
          newExpandedKey = expandedKeys.filter(function (el) {
            return el !== selectedKey[0];
          });
        }
        _this.setState({
          expandedKeys: newExpandedKey
        }, function () {
          _apiTest2['default'].setDetailFlag('empty');
          _apiTest2['default'].setCurrentNode(null);
        });
      }
    }, _this.getParentKey = function (key, tree) {
      var parentKey = void 0;
      for (var i = 0; i < tree.length; i += 1) {
        var node = tree[i];
        if (node.children) {
          if (node.children.some(function (item) {
            return item.key === key;
          })) {
            parentKey = node.key;
          } else if (_this.getParentKey(key, node.children)) {
            parentKey = _this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    }, _this.filterApi = (0, _debounce3['default'])(function (value) {
      var expandedKeys = _this.state.dataList.map(function (item) {
        if (item.title.indexOf(value) > -1) {
          return _this.getParentKey(item.key, _this.state.treeData);
        }
        return null;
      }).filter(function (item, i, self) {
        return item && self.indexOf(item) === i;
      });
      // APITestStore.setExpandedKeys(expandedKeys);
      _this.setState({
        expandedKeys: value.length ? expandedKeys : [],
        searchValue: value,
        autoExpandParent: true
      });
    }, 1000), _this.renderTreeNodes = function (data) {
      var expandedKeys = _this.state.expandedKeys;
      var searchValue = _this.state.searchValue;

      var icon = _react2['default'].createElement(_icon2['default'], {
        style: { color: '#3F51B5' },
        type: 'folder_open'
      });

      return data.map(function (item) {
        var index = item.title.indexOf(searchValue);
        var beforeStr = item.title.substr(0, index);
        var afterStr = item.title.substr(index + searchValue.length);
        var titleLength = item.title.length;
        var splitNum = 24;
        var apiWrapper = void 0;
        if (titleLength < splitNum) {
          apiWrapper = 'c7n-iam-apitest-api-wrapper-1';
        } else if (titleLength >= splitNum && titleLength < splitNum * 2) {
          apiWrapper = 'c7n-iam-apitest-api-wrapper-2';
        } else if (titleLength >= splitNum * 2 && titleLength < splitNum * 3) {
          apiWrapper = 'c7n-iam-apitest-api-wrapper-3';
        } else if (titleLength >= splitNum * 3 && titleLength < splitNum * 4) {
          apiWrapper = 'c7n-iam-apitest-api-wrapper-4';
        } else {
          apiWrapper = 'c7n-iam-apitest-api-wrapper-5';
        }

        var title = index > -1 ? _react2['default'].createElement(
          'span',
          null,
          beforeStr,
          _react2['default'].createElement(
            'span',
            { style: { color: '#f50' } },
            searchValue
          ),
          afterStr
        ) : _react2['default'].createElement(
          'span',
          null,
          item.title
        );
        if (item.method) {
          icon = _react2['default'].createElement(
            'div',
            { className: (0, _classnames3['default'])('c7n-iam-apitest-tree-' + item.key, 'c7n-iam-apitest-tree-methodTag', 'c7n-iam-apitest-tree-methodTag-' + item.method) },
            _react2['default'].createElement(
              'div',
              null,
              item.method
            )
          );
        }

        if (item.children) {
          var icon2 = _react2['default'].createElement(_icon2['default'], {
            style: { color: '#3F51B5' },
            type: expandedKeys.includes(item.key) ? 'folder_open2' : 'folder_open',
            className: 'c7n-iam-apitest-tree-' + item.key
          });
          return _react2['default'].createElement(
            TreeNode,
            { title: _react2['default'].createElement(
                _tooltip2['default'],
                { title: title, getPopupContainer: function getPopupContainer() {
                    return document.getElementsByClassName('c7n-iam-apitest-tree-' + item.key)[0];
                  } },
                _react2['default'].createElement(
                  'div',
                  { className: 'ant-tree-title-ellipsis' },
                  title
                )
              ), key: item.key, dataRef: item, icon: icon2 },
            _this.renderTreeNodes(item.children)
          );
        }
        return _react2['default'].createElement(TreeNode, (0, _extends3['default'])({}, item, { title: _react2['default'].createElement(
            _tooltip2['default'],
            { title: item.description || title, getPopupContainer: function getPopupContainer() {
                return document.getElementsByClassName('c7n-iam-apitest-tree-' + item.key)[0].parentNode.parentNode;
              } },
            _react2['default'].createElement(
              'div',
              null,
              title
            )
          ), dataRef: item, icon: icon, className: (0, _classnames3['default'])((0, _defineProperty3['default'])({}, apiWrapper, item.method)) }));
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ApiTree, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadInitData();
    }

    // 展开或关闭树节点

    // const { getDetail } = this.props;
    // const eventKey = APITestStore.getEventKey;
    // if (eventKey !== node.props.eventKey) {
    //   APITestStore.setEventKey(node.props.eventKey);
    //   if (selectedNodes[0].props.method) {
    //     APITestStore.setCurrentNode(selectedNodes);
    //     getDetail(selectedNodes);
    //   } else {
    //     APITestStore.setDetailFlag('empty');
    //     APITestStore.setCurrentNode(null);
    //   }
    // }
    // }

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          onClose = _props.onClose,
          intl = _props.intl,
          getDetail = _props.getDetail;
      var autoExpandParent = this.state.autoExpandParent;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-apitest-tree-content' },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-apitest-tree-top' },
          _react2['default'].createElement(_input2['default'], {
            prefix: _react2['default'].createElement(_icon2['default'], { type: 'filter_list', style: { color: 'black' } }),
            placeholder: intl.formatMessage({ id: 'global.apitest.filter' }),
            onChange: function onChange(e) {
              return _this2.filterApi.call(null, e.target.value);
            }
          }),
          _react2['default'].createElement(
            'div',
            {
              role: 'none',
              className: 'c7n-iam-apitest-tree-top-button',
              onClick: onClose
            },
            _react2['default'].createElement(_icon2['default'], { type: 'navigate_before' })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-apitest-tree-main' },
          _react2['default'].createElement(
            _tree2['default'],
            {
              expandedKeys: this.state.expandedKeys,
              selectedKeys: this.state.selectedKeys,
              showIcon: true,
              onSelect: this.onSelect,
              onExpand: this.onExpand,
              autoExpandParent: autoExpandParent
            },
            this.renderTreeNodes(this.state.treeData)
          )
        )
      );
    }
  }]);
  return ApiTree;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = ApiTree;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _iconSelect = require('choerodon-ui/lib/icon-select');

var _iconSelect2 = _interopRequireDefault(_iconSelect);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _dec, _dec2, _class;

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/icon-select/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/tabs/style');

require('choerodon-ui/lib/form/style');

require('choerodon-ui/lib/modal/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _choerodonBootCombine = require('choerodon-boot-combine');

var _reactIntl = require('react-intl');

var _constants = require('choerodon-boot-combine/lib/containers/common/constants');

var _util = require('./util');

require('./MenuSetting.scss');

require('../../../common/ConfirmModal.scss');

var _mouseOverWrapper = require('../../../components/mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuStore = _choerodonBootCombine.stores.MenuStore;

var intlPrefix = 'global.menusetting';
var STRING_DEVIDER = '__@.@__';

var currentDropOverItem = void 0;
var currentDropSide = void 0;
var dropItem = void 0;
var edited = void 0;
var saved = void 0;

function dropSideClassName(side) {
  return 'drop-row-' + side;
}

function addDragClass(currentTarget, dropSide) {
  if (dropSide) {
    currentDropOverItem = currentTarget;
    currentDropSide = dropSide;
    currentDropOverItem.classList.add(dropSideClassName(currentDropSide));
  }
}

function removeDragClass() {
  if (currentDropOverItem && currentDropSide) {
    currentDropOverItem.classList.remove(dropSideClassName(currentDropSide));
  }
}

var Sidebar = _modal2['default'].Sidebar;

var FormItem = _form2['default'].Item;
var TabPane = _tabs2['default'].TabPane;

var inputWidth = 512;
var formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

function findFirstLevel() {
  return ['site', 'organization', 'project', 'user'].find(function (l) {
    return _constants.RESOURCES_LEVEL.indexOf(l) !== -1;
  });
}

function hasLevel(level) {
  return _constants.RESOURCES_LEVEL.indexOf(level) !== -1;
}

var MenuSetting = (_dec = _form2['default'].create({}), _dec2 = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _reactRouterDom.withRouter)(_class = (0, _reactIntl.injectIntl)(_class = _dec2(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MenuSetting, _Component);

  function MenuSetting(props, context) {
    (0, _classCallCheck3['default'])(this, MenuSetting);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (MenuSetting.__proto__ || Object.getPrototypeOf(MenuSetting)).call(this, props, context));

    _this.selectMenuType = function (type) {
      var _this$state = _this.state,
          currentType = _this$state.type,
          prevMenuGroup = _this$state.prevMenuGroup,
          menuGroup = _this$state.menuGroup;
      var intl = _this.props.intl;

      if (JSON.stringify(prevMenuGroup[currentType]) !== JSON.stringify(menuGroup[currentType])) {
        _modal2['default'].confirm({
          className: 'c7n-iam-confirm-modal',
          title: intl.formatMessage({ id: intlPrefix + '.prompt.inform.title' }),
          content: intl.formatMessage({ id: intlPrefix + '.prompt.inform.message' }),
          onOk: function onOk() {
            if (!_this.state.menuGroup[type]) {
              _this.initMenu(type);
            }
            _this.setState({
              type: type
            });
          }
        });
      } else {
        if (!_this.state.menuGroup[type]) {
          _this.initMenu(type);
        }
        _this.setState({
          type: type
        });
      }
    };

    _this.closeSidebar = function () {
      _this.setState({
        sidebar: false
      });
    };

    _this.addDir = function () {
      var resetFields = _this.props.form.resetFields;

      resetFields();
      _this.setState({
        selectType: 'create',
        sidebar: true,
        selectMenuDetail: {}
      });
      setTimeout(function () {
        _this.addDirFocusInput.input.focus();
      }, 10);
    };

    _this.detailMenu = function (record) {
      var resetFields = _this.props.form.resetFields;

      resetFields();
      _this.setState({
        selectType: 'detail',
        sidebar: true,
        selectMenuDetail: record
      });
    };

    _this.changeMenu = function (record) {
      var resetFields = _this.props.form.resetFields;

      resetFields();
      _this.setState({
        selectType: 'edit',
        sidebar: true,
        selectMenuDetail: record
      });
      setTimeout(function () {
        _this.changeMenuFocusInput.input.focus();
      }, 10);
    };

    _this.checkCode = function (rule, value, callback) {
      var intl = _this.props.intl;
      var _this$state2 = _this.state,
          type = _this$state2.type,
          tempDirs = _this$state2.tempDirs;

      var errorMsg = intl.formatMessage({ id: intlPrefix + '.directory.code.onlymsg' });
      if (tempDirs.find(function (_ref) {
        var code = _ref.code;
        return code === value;
      })) {
        callback(errorMsg);
      } else {
        _choerodonBootCombine.axios.post('/iam/v1/menus/check', JSON.stringify({ code: value, level: type, type: 'dir' })).then(function (mes) {
          if (mes.failed) {
            callback(errorMsg);
          } else {
            callback();
          }
        })['catch'](function (error) {
          Choerodon.handleResponseError(error);
          callback(false);
        });
      }
    };

    _this.deleteMenu = function (record) {
      var intl = _this.props.intl;
      var _this$state3 = _this.state,
          menuGroup = _this$state3.menuGroup,
          type = _this$state3.type,
          tempDirs = _this$state3.tempDirs;

      var index = tempDirs.findIndex(function (_ref2) {
        var code = _ref2.code;
        return code === record.code;
      });
      if (index !== -1) {
        tempDirs.splice(index, 1);
      }
      (0, _util.deleteNode)(menuGroup[type], record);
      _this.setState({
        menuGroup: menuGroup,
        tempDirs: tempDirs
      });
      Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.delete.success' }));
    };

    _this.handleDelete = function (record) {
      var intl = _this.props.intl;

      _modal2['default'].confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: intlPrefix + '.delete.owntitle' }),
        content: intl.formatMessage({
          id: record.subMenus && record.subMenus.length ? intlPrefix + '.delete.owncontent.hassub' : intlPrefix + '.delete.owncontent'
        }, {
          name: record.name
        }),
        onOk: function onOk() {
          _this.deleteMenu(record);
        }
      });
    };

    _this.handleRefresh = function () {
      var _this$state4 = _this.state,
          type = _this$state4.type,
          menuGroup = _this$state4.menuGroup;

      _this.setState({
        menuGroup: (0, _defineProperty3['default'])({}, type, menuGroup[type])
      }, function () {
        _this.initMenu();
      });
    };

    _this.handleOk = function (e) {
      e.preventDefault();
      var intl = _this.props.intl;

      _this.props.form.validateFields(function (err, _ref3) {
        var code = _ref3.code,
            name = _ref3.name,
            icon = _ref3.icon;

        if (!err) {
          var _this$state5 = _this.state,
              selectType = _this$state5.selectType,
              menuGroup = _this$state5.menuGroup,
              selectMenuDetail = _this$state5.selectMenuDetail,
              type = _this$state5.type,
              tempDirs = _this$state5.tempDirs;

          var menu = {};
          switch (selectType) {
            case 'create':
              menu = {
                code: code,
                icon: icon,
                name: name.trim(),
                'default': false,
                level: type,
                type: 'dir',
                parentId: 0,
                subMenus: null
              };
              (0, _util.defineLevel)(menu, 0);
              menuGroup[type].push(menu);
              tempDirs.push(menu);
              Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.create.success' }));
              break;
            case 'edit':
              selectMenuDetail.name = name.trim();
              selectMenuDetail.icon = icon;
              Choerodon.prompt(intl.formatMessage({ id: intlPrefix + '.modify.success' }));
              break;
            default:
              break;
          }
          _this.setState({
            sidebar: false,
            menuGroup: menuGroup,
            tempDirs: tempDirs
          });
        }
      });
    };

    _this.getSidebarTitle = function (selectType) {
      switch (selectType) {
        case 'create':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create.org' });
        case 'edit':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.modify.org' });
        case 'detail':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.detail' });
        default:
      }
    };

    _this.getRowKey = function (record) {
      return record.parentId + ' - ' + record.code;
    };

    _this.handleDragEnd = function () {
      removeDragClass();
      if (dropItem) {
        _this.handleDrop(dropItem);
      }
      _this.setState({
        dragData: null
      });
    };

    _this.handleRow = function (record) {
      var droppable = _this.checkDroppable(record);
      var rowProps = droppable ? {
        draggable: true,
        onDragLeave: _this.handleDragLeave,
        onDragOver: _this.handleDragOver.bind(_this, record),
        onDrop: _this.handleDrop.bind(_this, record)
      } : {};
      return rowProps;
    };

    _this.handleCell = function (record) {
      var draggable = _this.checkDraggable(record);
      var cellProps = {
        onDragEnd: _this.handleDragEnd
      };
      if (draggable) {
        (0, _extends3['default'])(cellProps, {
          draggable: true,
          onDragStart: _this.handleDragtStart.bind(_this, record),
          className: 'drag-cell'
        });
      }
      return cellProps;
    };

    _this.saveMenu = function () {
      var intl = _this.props.intl;
      var _this$state6 = _this.state,
          type = _this$state6.type,
          menuGroup = _this$state6.menuGroup,
          prevMenuGroup = _this$state6.prevMenuGroup;

      var newPrevMenuGroup = prevMenuGroup;
      if (JSON.stringify(prevMenuGroup) !== JSON.stringify(menuGroup)) {
        _this.setState({ submitting: true });
        _choerodonBootCombine.axios.post('/iam/v1/menus/menu_config?level=' + type, JSON.stringify((0, _util.adjustSort)(menuGroup[type]))).then(function (menus) {
          _this.setState({ submitting: false });
          if (menus.failed) {
            Choerodon.prompt(menus.message);
          } else {
            MenuStore.setMenuData((0, _cloneDeep3['default'])(menus), type);
            Choerodon.prompt(intl.formatMessage({
              id: 'save.success'
            }));
            saved = true;
            menuGroup[type] = (0, _util.normalizeMenus)(menus);
            newPrevMenuGroup[type] = JSON.parse(JSON.stringify(menuGroup))[type];
            _this.setState({
              menuGroup: menuGroup,
              prevMenuGroup: newPrevMenuGroup,
              tempDirs: []
            });
          }
        })['catch'](function (error) {
          Choerodon.handleResponseError(error);
          _this.setState({ submitting: false });
        });
      }
    };

    _this.getOkText = function (selectType) {
      switch (selectType) {
        case 'create':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'add' });
        case 'detail':
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'close' });
        default:
          return _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' });
      }
    };

    _this.state = {
      loading: false,
      submitting: false,
      menuGroup: {},
      prevMenuGroup: {},
      type: findFirstLevel(),
      selectType: 'create',
      sidebar: false,
      selectMenuDetail: {},
      dragData: null,
      tempDirs: []
    };
    _this.changeMenuFocusInput = _react2['default'].createRef();
    _this.addDirFocusInput = _react2['default'].createRef();
    return _this;
  }

  (0, _createClass3['default'])(MenuSetting, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initMenu();
      edited = null;
      saved = null;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (saved) {
        edited = false;
      } else if (JSON.stringify(nextState.prevMenuGroup) !== JSON.stringify(nextState.menuGroup)) {
        edited = true;
      } else {
        edited = false;
      }
    }

    // 初始化类型

  }, {
    key: 'initMenu',
    value: function initMenu(type) {
      var _this2 = this;

      var _state = this.state,
          menuGroup = _state.menuGroup,
          typeState = _state.type,
          prevMenuGroup = _state.prevMenuGroup;

      type = type || typeState;
      var newPrevMenuGroup = prevMenuGroup;
      this.setState({ loading: true });
      _choerodonBootCombine.axios.get('/iam/v1/menus/menu_config?level=' + type).then(function (value) {
        menuGroup[type] = (0, _util.normalizeMenus)(value);
        newPrevMenuGroup[type] = JSON.parse(JSON.stringify(menuGroup))[type];
        // 深拷贝
        _this2.setState({
          menuGroup: menuGroup,
          loading: false,
          prevMenuGroup: newPrevMenuGroup
        });
      })['catch'](function (error) {
        Choerodon.handleResponseError(error);
        _this2.setState({ loading: false });
      });
    }

    // 选择菜单类型


    // 关闭sidebar


    // 创建目录，弹出sidebar


    // 查看细节，弹出sidebar,设置选中的菜单或目录


    // 修改菜单,弹出sidebar,设置选中的菜单或目录


    // 删除菜单


    // 创建添加的状态请求


    // 创建目录的3个状态

  }, {
    key: 'getSidebarContent',


    // 创建3个状态的sidebar渲染
    value: function getSidebarContent(selectType) {
      var name = this.state.selectMenuDetail.name;
      var AppState = this.props.AppState;

      var formDom = void 0;
      var code = void 0;
      var values = void 0;
      switch (selectType) {
        case 'create':
          code = intlPrefix + '.create';
          values = { name: AppState.getSiteInfo.systemName || 'Choerodon' };
          formDom = this.getDirNameDom();
          break;
        case 'edit':
          code = intlPrefix + '.modify';
          values = { name: name };
          formDom = this.getDirNameDom();
          break;
        case 'detail':
          code = intlPrefix + '.detail';
          values = { name: name };
          formDom = this.getDetailDom();
          break;
        default:
          break;
      }
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            className: 'sidebar-content',
            code: code,
            values: values
          },
          formDom
        )
      );
    }

    // 查看详情

  }, {
    key: 'getDetailDom',
    value: function getDetailDom() {
      /* eslint-disable-next-line */
      var _state$selectMenuDeta = this.state.selectMenuDetail,
          name = _state$selectMenuDeta.name,
          code = _state$selectMenuDeta.code,
          level = _state$selectMenuDeta.level,
          permissions = _state$selectMenuDeta.permissions,
          __parent_name__ = _state$selectMenuDeta.__parent_name__;

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical' },
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            _react2['default'].createElement(_input2['default'], {
              value: name,
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.menu.name' }),
              disabled: true,
              style: { width: inputWidth }
            })
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            _react2['default'].createElement(_input2['default'], {
              value: code,
              autoComplete: 'off',
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.menu.code' }),
              disabled: true,
              style: { width: inputWidth }
            })
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            _react2['default'].createElement(_input2['default'], {
              value: level,
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.menu.level' }),
              autoComplete: 'off',
              disabled: true,
              style: { width: inputWidth }
            })
          ),
          _react2['default'].createElement(
            FormItem,
            formItemLayout,
            _react2['default'].createElement(_input2['default'], {
              /* eslint-disable-next-line */
              value: __parent_name__,
              label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.belong.root' }),
              disabled: true,
              autoComplete: 'off',
              style: { width: inputWidth }
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'permission-list', style: { width: inputWidth } },
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.menu.permission' })
          ),
          permissions && permissions.length > 0 ? permissions.map(function (_ref4) {
            var permissionCode = _ref4.code;
            return _react2['default'].createElement(
              'div',
              { key: permissionCode },
              _react2['default'].createElement(
                'span',
                null,
                permissionCode
              )
            );
          }) : _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.menu.withoutpermission' })
        )
      );
    }

    // created FormDom渲染

  }, {
    key: 'getDirNameDom',
    value: function getDirNameDom() {
      var _this3 = this;

      var intl = this.props.intl;
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var _state2 = this.state,
          selectType = _state2.selectType,
          _state2$selectMenuDet = _state2.selectMenuDetail,
          selectMenuDetail = _state2$selectMenuDet === undefined ? {} : _state2$selectMenuDet;

      var codeRules = selectType === 'create' && [{
        required: true,
        whitespace: true,
        message: intl.formatMessage({ id: intlPrefix + '.directory.code.require' })
      }, {
        pattern: /^[a-z]([-.a-z0-9]*[a-z0-9])?$/,
        message: intl.formatMessage({ id: intlPrefix + '.directory.code.pattern' })
      }, {
        validator: this.checkCode
      }];
      return _react2['default'].createElement(
        _form2['default'],
        { layout: 'vertical' },
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('code', {
            rules: codeRules || [],
            validateTrigger: 'onBlur',
            validateFirst: true,
            initialValue: selectMenuDetail.code
          })(_react2['default'].createElement(_input2['default'], {
            autoComplete: 'off',
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.directory.code' }),
            style: { width: inputWidth },
            disabled: selectType === 'edit',
            ref: function ref(e) {
              _this3.addDirFocusInput = e;
            },
            maxLength: 64,
            showLengthInfo: false
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: intlPrefix + '.directory.name.require' })
            }],
            validateTrigger: 'onBlur',
            initialValue: selectMenuDetail.name
          })(_react2['default'].createElement(_input2['default'], {
            autoComplete: 'off',
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.directory.name' }),
            style: { width: inputWidth },
            ref: function ref(e) {
              _this3.changeMenuFocusInput = e;
            },
            maxLength: 32,
            showLengthInfo: false
          }))
        ),
        _react2['default'].createElement(
          FormItem,
          formItemLayout,
          getFieldDecorator('icon', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: intlPrefix + '.icon.require' })
            }],
            validateTrigger: 'onChange',
            initialValue: selectMenuDetail.icon
          })(_react2['default'].createElement(_iconSelect2['default'], {
            label: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.icon' }),
            style: { width: inputWidth },
            showArrow: true,
            showAll: true
          }))
        )
      );
    }
  }, {
    key: 'checkDraggable',


    // 判断是否能拖拽
    value: function checkDraggable(record) {
      var dragData = this.state.dragData;

      return !dragData || dragData !== record && !(0, _util.isChild)(dragData, record);
    }

    // 判断是否能拖放

  }, {
    key: 'checkDroppable',
    value: function checkDroppable(record) {
      var dragData = this.state.dragData;

      return dragData && dragData !== record && (this.checkDropIn(record) || this.checkDropBesides(record)) && !(0, _util.isChild)(dragData, record);
    }

    // 判断是否能拖入

  }, {
    key: 'checkDropIn',
    value: function checkDropIn(record) {
      var dragData = this.state.dragData;

      return dragData && record.type !== 'menu' && dragData.type !== 'root' && !(0, _util.hasDirChild)(dragData)
      // eslint-disable-next-line no-underscore-dangle
      && record.__level__ < (dragData.type === 'dir' ? 1 : 2);
    }

    // 判断是否能插在前后

  }, {
    key: 'checkDropBesides',
    value: function checkDropBesides(record) {
      var dragData = this.state.dragData;

      return dragData && (
      /* eslint-disable-next-line */
      record.__level__ === 0 ? dragData.type !== 'menu' : dragData.type !== 'root' && !(0, _util.hasDirChild)(dragData));
    }

    // 拖拽离开目标

  }, {
    key: 'handleDragLeave',
    value: function handleDragLeave() {
      removeDragClass();
      dropItem = null;
    }

    // 拖拽开始

  }, {
    key: 'handleDragtStart',
    value: function handleDragtStart(dragData, e) {
      e.dataTransfer.setData('text', 'choerodon');
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.setState({
        dragData: dragData
      });
    }

    // 拖拽结束

  }, {
    key: 'handleDragOver',


    // 拖拽目标位置
    value: function handleDragOver(record, e) {
      e.preventDefault();
      var canAddIn = this.checkDropIn(record);
      var canAddBesides = this.checkDropBesides(record);
      if (canAddIn || canAddBesides) {
        dropItem = record;
        var currentTarget = e.currentTarget,
            pageY = e.pageY,
            dataTransfer = e.dataTransfer;

        var _currentTarget$getBou = currentTarget.getBoundingClientRect(),
            top = _currentTarget$getBou.top,
            height = _currentTarget$getBou.height;

        var before = height / 2;
        var after = before;
        var dropSide = void 0;
        if (canAddIn) {
          before = height / 3;
          after = before * 2;
          dropSide = 'in';
          dataTransfer.dropEffect = 'copy';
        }
        if (canAddBesides) {
          var y = pageY - top;
          if (y < before) {
            dropSide = 'before';
            dataTransfer.dropEffect = 'move';
          } else if (y >= after) {
            dropSide = 'after';
            dataTransfer.dropEffect = 'move';
          }
        }
        removeDragClass();
        addDragClass(currentTarget, dropSide);
      }
    }

    // 拖放

  }, {
    key: 'handleDrop',
    value: function handleDrop(record) {
      removeDragClass();
      var _state3 = this.state,
          dragData = _state3.dragData,
          menuGroup = _state3.menuGroup,
          type = _state3.type;

      var menuData = menuGroup[type];
      if (dragData && record) {
        (0, _util.deleteNode)(menuData, dragData);
        if (currentDropSide === 'in') {
          dragData.parentId = record.id;
          record.subMenus = record.subMenus || [];
          record.subMenus.unshift(dragData);
          /* eslint-disable-next-line */
          (0, _util.normalizeMenus)([dragData], record.__level__, record.name);
        } else {
          var _findParent = (0, _util.findParent)(menuData, record),
              parent = _findParent.parent,
              index = _findParent.index,
              _findParent$parentDat = _findParent.parentData;

          _findParent$parentDat = _findParent$parentDat === undefined ? {} : _findParent$parentDat;
          var _findParent$parentDat2 = _findParent$parentDat.id,
              id = _findParent$parentDat2 === undefined ? 0 : _findParent$parentDat2,
              __level__ = _findParent$parentDat.__level__,
              name = _findParent$parentDat.name;

          dragData.parentId = id;
          parent.splice(index + (currentDropSide === 'after' ? 1 : 0), 0, dragData);
          (0, _util.normalizeMenus)([dragData], __level__, name);
        }
        this.setState({
          menuGroup: menuGroup,
          dragData: null
        });
      }
    }

    // 储存菜单

  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          intl = _props.intl,
          AppState = _props.AppState;

      var menuType = this.props.AppState.currentMenuType.type;
      var _state4 = this.state,
          menuGroup = _state4.menuGroup,
          typeState = _state4.type,
          selectType = _state4.selectType,
          sidebar = _state4.sidebar,
          submitting = _state4.submitting,
          loading = _state4.loading;
      // Prompt 只能传单个字符串，所以用 STRING_DEVIDER 对 title 和 msg 进行了分离

      var promptMsg = intl.formatMessage({ id: intlPrefix + '.prompt.inform.title' }) + STRING_DEVIDER + intl.formatMessage({ id: intlPrefix + '.prompt.inform.message' });
      var columns = [{
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.directory' }),
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        render: function render(text, _ref5) {
          var type = _ref5.type,
              dft = _ref5['default'];

          var icon = '';
          if (type === 'menu') {
            icon = 'dehaze';
          } else if (!dft) {
            icon = 'folder';
          } else {
            icon = 'custom_Directory';
          }
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.2, className: 'c7n-iam-menusetting-name' },
            _react2['default'].createElement(_icon2['default'], { type: icon, style: { verticalAlign: 'text-bottom' } }),
            ' ',
            text
          );
        },
        onCell: this.handleCell
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.icon' }),
        dataIndex: 'icon',
        key: 'icon',
        width: '10%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.8 },
            _react2['default'].createElement(_icon2['default'], { type: text, style: { fontSize: 18 } })
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.code' }),
        dataIndex: 'code',
        key: 'code',
        width: '35%',
        render: function render(text) {
          return _react2['default'].createElement(
            _mouseOverWrapper2['default'],
            { text: text, width: 0.3 },
            text
          );
        }
      }, {
        title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.type' }),
        dataIndex: 'default',
        key: 'default',
        width: '15%',
        render: function render(text, _ref6) {
          var type = _ref6.type,
              dft = _ref6['default'];

          if (type === 'menu') {
            return _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.10 },
              _react2['default'].createElement(
                'span',
                { style: { cursor: 'default' } },
                '\u83DC\u5355'
              )
            );
          } else if (!dft) {
            return _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.10 },
              _react2['default'].createElement(
                'span',
                { style: { cursor: 'default' } },
                '\u81EA\u8BBE\u76EE\u5F55'
              )
            );
          } else {
            return _react2['default'].createElement(
              _mouseOverWrapper2['default'],
              { text: text, width: 0.10 },
              _react2['default'].createElement(
                'span',
                { style: { cursor: 'default' } },
                '\u9884\u7F6E\u76EE\u5F55'
              )
            );
          }
        }
      }, {
        title: '',
        width: '15%',
        key: 'action',
        align: 'right',
        render: function render(text, record) {
          var type = record.type,
              dft = record['default'];

          if (type === 'menu') {
            return _react2['default'].createElement(
              _choerodonBootCombine.Permission,
              { service: ['iam-service.menu.query'], type: menuType },
              _react2['default'].createElement(
                _tooltip2['default'],
                {
                  title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'detail' }),
                  placement: 'bottom'
                },
                _react2['default'].createElement(_button2['default'], {
                  shape: 'circle',
                  icon: 'find_in_page',
                  size: 'small',
                  onClick: _this4.detailMenu.bind(_this4, record)
                })
              )
            );
          } else if (!dft) {
            var canDel = (0, _util.canDelete)(record);
            return _react2['default'].createElement(
              'span',
              null,
              _react2['default'].createElement(
                _choerodonBootCombine.Permission,
                { service: ['iam-service.menu.update'], type: menuType },
                _react2['default'].createElement(
                  _tooltip2['default'],
                  {
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'modify' }),
                    placement: 'bottom'
                  },
                  _react2['default'].createElement(_button2['default'], {
                    shape: 'circle',
                    size: 'small',
                    onClick: _this4.changeMenu.bind(_this4, record),
                    icon: 'mode_edit'
                  })
                )
              ),
              _react2['default'].createElement(
                _choerodonBootCombine.Permission,
                { service: ['iam-service.menu.delete'], type: menuType },
                canDel ? _react2['default'].createElement(
                  _tooltip2['default'],
                  {
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'delete' }),
                    placement: 'bottom'
                  },
                  _react2['default'].createElement(_button2['default'], {
                    onClick: _this4.handleDelete.bind(_this4, record),
                    shape: 'circle',
                    size: 'small',
                    icon: 'delete_forever'
                  })
                ) : _react2['default'].createElement(
                  _tooltip2['default'],
                  {
                    title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.delete.disable.tooltip' }),
                    overlayStyle: { width: '200px' },
                    placement: 'bottomRight'
                  },
                  _react2['default'].createElement(_button2['default'], {
                    disabled: true,
                    shape: 'circle',
                    size: 'small',
                    icon: 'delete_forever'
                  })
                )
              )
            );
          }
        }
      }];
      return _react2['default'].createElement(
        _choerodonBootCombine.Page,
        {
          service: ['iam-service.menu.create', 'iam-service.menu.saveListTree', 'iam-service.menu.query', 'iam-service.menu.update', 'iam-service.menu.delete', 'iam-service.menu.queryMenusWithPermissions', 'iam-service.menu.listTree', 'iam-service.menu.listAfterTestPermission', 'iam-service.menu.listTreeMenusWithPermissions']
        },
        _react2['default'].createElement(
          _choerodonBootCombine.Header,
          { title: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.header.title' }) },
          _react2['default'].createElement(_reactRouterDom.Prompt, { message: promptMsg, wrapper: 'c7n-iam-confirm-modal', when: edited }),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.menu.create'] },
            _react2['default'].createElement(
              _button2['default'],
              {
                onClick: this.addDir,
                icon: 'playlist_add'
              },
              _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.create.org' })
            )
          ),
          _react2['default'].createElement(
            _button2['default'],
            {
              onClick: this.handleRefresh,
              icon: 'refresh'
            },
            _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'refresh' })
          )
        ),
        _react2['default'].createElement(
          _choerodonBootCombine.Content,
          {
            code: intlPrefix,
            values: { name: AppState.getSiteInfo.systemName || 'Choerodon' }
          },
          _react2['default'].createElement(
            _tabs2['default'],
            { defaultActiveKey: 'site', onChange: this.selectMenuType, activeKey: typeState },
            hasLevel('site') ? _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.global' }), key: 'site' }) : null,
            hasLevel('organization') ? _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.org' }), key: 'organization' }) : null,
            hasLevel('project') ? _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.pro' }), key: 'project' }) : null,
            hasLevel('user') ? _react2['default'].createElement(TabPane, { tab: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: intlPrefix + '.personcenter' }), key: 'user' }) : null
          ),
          _react2['default'].createElement(_table2['default'], {
            loading: loading,
            className: 'menu-table',
            filterBar: false,
            pagination: false,
            columns: columns,
            defaultExpandAllRows: false,
            dataSource: menuGroup[typeState],
            childrenColumnName: 'subMenus',
            rowKey: this.getRowKey,
            onRow: this.handleRow
          }),
          _react2['default'].createElement(
            Sidebar,
            {
              title: this.getSidebarTitle(selectType),
              onOk: selectType === 'detail' ? this.closeSidebar : this.handleOk,
              okText: this.getOkText(selectType),
              cancelText: _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' }),
              okCancel: selectType !== 'detail',
              onCancel: this.closeSidebar,
              visible: sidebar
            },
            this.getSidebarContent(selectType)
          ),
          _react2['default'].createElement(
            _choerodonBootCombine.Permission,
            { service: ['iam-service.menu.saveListTree'] },
            _react2['default'].createElement(
              'div',
              { style: { marginTop: 25 } },
              _react2['default'].createElement(
                _button2['default'],
                {
                  funcType: 'raised',
                  type: 'primary',
                  onClick: this.saveMenu,
                  loading: submitting
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'save' })
              ),
              _react2['default'].createElement(
                _button2['default'],
                {
                  funcType: 'raised',
                  onClick: this.handleRefresh,
                  style: { marginLeft: 16, color: '#3F51B5' },
                  disabled: submitting
                },
                _react2['default'].createElement(_reactIntl.FormattedMessage, { id: 'cancel' })
              )
            )
          )
        )
      );
    }
  }]);
  return MenuSetting;
}(_react.Component)) || _class) || _class) || _class) || _class) || _class);
exports['default'] = MenuSetting;
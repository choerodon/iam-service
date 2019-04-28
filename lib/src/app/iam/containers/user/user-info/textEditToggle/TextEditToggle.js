'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _form = require('choerodon-ui/lib/form');

var _form2 = _interopRequireDefault(_form);

var _class; /* eslint-disable react/no-find-dom-node */


require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mobxReact = require('mobx-react');

require('./TextEditToggle.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// 防止提交前变回原值
var Text = function Text(props) {
  return typeof props.children === 'function' ? props.children(props.newData || props.originData) : props.children;
};
var Edit = function Edit(props) {
  return props.children;
};
var FormItem = _form2['default'].Item;

var TextEditToggle = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(TextEditToggle, _Component);

  function TextEditToggle(props) {
    (0, _classCallCheck3['default'])(this, TextEditToggle);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (TextEditToggle.__proto__ || Object.getPrototypeOf(TextEditToggle)).call(this, props));

    _this.handleDone = function () {}
    // this.setState({
    //   newData: null,
    // });


    // 提交编辑
    ;

    _this.onSubmit = function () {
      try {
        _this.props.form.validateFields(function (err, values) {
          if (!err) {
            if (_this.props.formKey) {
              var newData = values[_this.props.formKey];
              if (newData !== _this.props.originData) {
                _this.setState({
                  // originData: newData,
                  newData: newData
                });
                // 传入一个done方法，用于防止父组件数据更新后的newData错误问题
                _this.props.onSubmit(_this.props.formKey ? newData : null, _this.handleDone);
              }
            } else {
              _this.props.onSubmit();
            }
            _this.setState({
              editing: false
            });
          }
        });
      } catch (err) {
        _this.setState({
          editing: false
        });
      }
    };

    _this.enterEditing = function () {
      // 如果禁用，将不进入编辑模式
      var disabled = _this.props.disabled;

      if (disabled) {
        return;
      }
      _this.setState({
        editing: true,
        originData: _this.props.originData,
        newData: null
      });
    };

    _this.leaveEditing = function () {
      _this.setState({
        editing: false
      });
      if (_this.props.onCancel) {
        _this.props.onCancel(_this.state.originData);
      }
    };

    _this.getEditOrTextChildren = function () {
      var editing = _this.state.editing;
      var children = _this.props.children;

      return editing ? children.filter(function (child) {
        return child.type === Edit;
      }) : children.filter(function (child) {
        return child.type === Text;
      });
    };

    _this.wrapChildren = function (children) {
      var childrenArray = _react2['default'].Children.toArray(children);
      // console.log(childrenArray);
      return childrenArray.map(function (child) {
        return _react2['default'].cloneElement(child, {
          getPopupContainer: function getPopupContainer() {
            return (0, _reactDom.findDOMNode)(_this);
          }
        });
      });
    };

    _this.renderTextChild = function (children) {
      var childrenArray = _react2['default'].Children.toArray(children);
      // console.log(childrenArray);
      return childrenArray.map(function (child) {
        return _react2['default'].cloneElement(child, {
          newData: _this.state.newData,
          originData: _this.props.originData
        });
      });
    };

    _this.renderChild = function () {
      var _this$state = _this.state,
          editing = _this$state.editing,
          newData = _this$state.newData;
      var disabled = _this.props.disabled;
      var _this$props = _this.props,
          originData = _this$props.originData,
          formKey = _this$props.formKey,
          rules = _this$props.rules,
          validate = _this$props.validate,
          formStyle = _this$props.formStyle;
      var getFieldDecorator = _this.props.form.getFieldDecorator;
      // 拿到不同模式下对应的子元素

      var children = _this.getEditOrTextChildren();
      // 根据不同模式对子元素进行包装
      return editing ? _react2['default'].createElement(
        'div',
        { className: 'c7n-iam-TextEditToggle-edit' },
        // 采用form模式就进行form包装,否则
        formKey ? _react2['default'].createElement(
          _form2['default'],
          { layout: 'vertical', style: _this.props.formStyle },
          children.map(function (child) {
            return _react2['default'].createElement(
              FormItem,
              null,
              getFieldDecorator(formKey, (0, _extends3['default'])({
                rules: rules,
                initialValue: originData
              }, validate))(_this.renderFormItemChild(_this.wrapChildren(child.props.children)))
            );
          })
        ) : children.map(function (child) {
          return _this.wrapChildren(child.props.children);
        }),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-iam-TextEditToggle-icon-container' },
          _react2['default'].createElement(_icon2['default'], { type: 'done', className: 'c7n-iam-TextEditToggle-edit-icon', onClick: _this.onSubmit }),
          _react2['default'].createElement(_icon2['default'], { type: 'close', className: 'c7n-iam-TextEditToggle-edit-icon', onClick: _this.leaveEditing })
        )
      ) : _react2['default'].createElement(
        'div',
        {
          className: disabled ? 'c7n-iam-TextEditToggle-text' : 'c7n-iam-TextEditToggle-text c7n-iam-TextEditToggle-text-active',
          onClick: _this.enterEditing,
          role: 'none'
        },
        _this.renderTextChild(children),
        _react2['default'].createElement(_icon2['default'], { type: 'mode_edit', className: 'c7n-iam-TextEditToggle-text-icon' })
      );
    };

    _this.state = {
      editing: false,
      originData: null,
      newData: null
    };
    return _this;
  }

  (0, _createClass3['default'])(TextEditToggle, [{
    key: 'renderFormItemChild',
    value: function renderFormItemChild(children) {
      // formItem只有一个组件起作用
      var childrenArray = _react2['default'].Children.toArray(children);
      var targetElement = childrenArray.filter(function (child) {
        return child.type && child.type.prototype instanceof _react.Component;
      })[0];
      if (!targetElement) {
        throw new Error('使用Form功能时，Edit的children必须是Component');
      }
      return targetElement;
    }

    // 为子元素加上getPopupContainer，因为默认getPopupContainer是body,点击时判断onDocumentClick会调用onSubmit方法

  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        this.props,
        this.renderChild()
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, state) {
      if (props.originData !== state.originData) {
        return {
          originData: props.originData,
          newData: null
        };
      }
      return null;
    }

    // 进入编辑状态


    // 取消编辑

  }]);
  return TextEditToggle;
}(_react.Component)) || _class;

TextEditToggle.Text = Text;
TextEditToggle.Edit = Edit;

Text.propTypes = {
  children: _propTypes2['default'].element.isRequired
};
Edit.propTypes = {
  children: _propTypes2['default'].element.isRequired
};
exports['default'] = _form2['default'].create({})(TextEditToggle);
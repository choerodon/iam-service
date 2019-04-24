/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Form, Icon } from 'choerodon-ui';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import './TextEditToggle.scss';
// 防止提交前变回原值
const Text = props => (typeof (props.children) === 'function' ? props.children(props.newData || props.originData) : props.children);
const Edit = props => props.children;
const FormItem = Form.Item;

@observer
class TextEditToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      originData: null,
      newData: null,
    };
  }


  static getDerivedStateFromProps(props, state) {
    if (props.originData !== state.originData) {
      return {
        originData: props.originData,
        newData: null,
      };      
    }
    return null;
  }


  handleDone=() => {
    // this.setState({
    //   newData: null,
    // });
  }

  // 提交编辑
  onSubmit = () => {
    try {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (this.props.formKey) {
            const newData = values[this.props.formKey];
            if (newData !== this.props.originData) {
              this.setState({
                // originData: newData,
                newData,
              });
              // 传入一个done方法，用于防止父组件数据更新后的newData错误问题
              this.props.onSubmit(this.props.formKey ? newData : null, this.handleDone);
            }
          } else {
            this.props.onSubmit();
          }
          this.setState({
            editing: false,
          });
        }
      });
    } catch (err) {
      this.setState({
        editing: false,
      });
    }
  }

  // 进入编辑状态
  enterEditing = () => {
    // 如果禁用，将不进入编辑模式
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.setState({
      editing: true,
      originData: this.props.originData,
      newData: null,
    });
  }

  // 取消编辑
  leaveEditing = () => {
    this.setState({
      editing: false,
    });
    if (this.props.onCancel) {
      this.props.onCancel(this.state.originData);
    }
  }

  getEditOrTextChildren = () => {
    const { editing } = this.state;
    const { children } = this.props;
    return editing
      ? children.filter(child => child.type === Edit)
      : children.filter(child => child.type === Text);
  }

  renderFormItemChild(children) {
    // formItem只有一个组件起作用
    const childrenArray = React.Children.toArray(children);
    const targetElement = childrenArray.filter(child => child.type
      && child.type.prototype instanceof Component)[0];
    if (!targetElement) {
      throw new Error('使用Form功能时，Edit的children必须是Component');
    }
    return targetElement;
  }

  // 为子元素加上getPopupContainer，因为默认getPopupContainer是body,点击时判断onDocumentClick会调用onSubmit方法
  wrapChildren = (children) => {
    const childrenArray = React.Children.toArray(children);
    // console.log(childrenArray);
    return childrenArray.map(child => React.cloneElement(child, {
      getPopupContainer: () => findDOMNode(this),
    }));
  }

  renderTextChild=(children) => {
    const childrenArray = React.Children.toArray(children);
    // console.log(childrenArray);
    return childrenArray.map(child => React.cloneElement(child, {
      newData: this.state.newData,
      originData: this.props.originData,
    }));
  }

  renderChild = () => {
    const { editing, newData } = this.state;
    const { disabled } = this.props;
    const { originData, formKey, rules, validate, formStyle } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 拿到不同模式下对应的子元素
    const children = this.getEditOrTextChildren();
    // 根据不同模式对子元素进行包装
    return editing ? (
      <div className="c7n-iam-TextEditToggle-edit">
        { // 采用form模式就进行form包装,否则
          formKey ? (
            <Form layout="vertical" style={this.props.formStyle}>
              {children.map(child => (
                <FormItem>
                  {getFieldDecorator(formKey, {
                    rules,
                    initialValue: originData,
                    ...validate,
                  })(
                    this.renderFormItemChild(this.wrapChildren(child.props.children)),
                  )}
                </FormItem>
              ))}
            </Form>
          ) : children.map(child => (this.wrapChildren(child.props.children)))
        }
        <div className="c7n-iam-TextEditToggle-icon-container">
          <Icon type="done" className="c7n-iam-TextEditToggle-edit-icon" onClick={this.onSubmit} />
          <Icon type="close" className="c7n-iam-TextEditToggle-edit-icon" onClick={this.leaveEditing} />
        </div>
      </div>
    ) : (
      <div
        className={disabled ? 'c7n-iam-TextEditToggle-text' : 'c7n-iam-TextEditToggle-text c7n-iam-TextEditToggle-text-active'}
        onClick={this.enterEditing}
        role="none"
      >
        {this.renderTextChild(children)}
        <Icon type="mode_edit" className="c7n-iam-TextEditToggle-text-icon" />
      </div>
    );
  }

  render() {
    return (
      <div {...this.props}>
        {this.renderChild()}
      </div>
    );
  }
}
TextEditToggle.Text = Text;
TextEditToggle.Edit = Edit;

Text.propTypes = {
  children: PropTypes.element.isRequired,
};
Edit.propTypes = {
  children: PropTypes.element.isRequired,
};
export default Form.create({})(TextEditToggle);

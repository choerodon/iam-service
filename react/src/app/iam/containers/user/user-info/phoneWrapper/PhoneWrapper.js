import React, { Component } from 'react';
import { Form, Icon, Input } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { findDOMNode } from 'react-dom';
import './PhoneWrapper.scss';

const FormItem = Form.Item;
const intlPrefix = 'user.userinfo';

@Form.create({})
@injectIntl
@inject('AppState')
@observer
export default class PhoneWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      internationalCode: null,
      phone: null,
      submitting: false,
    };
  }

  renderText() {
    const { initialPhone, initialCode } = this.props;
    let textContent;
    if (initialPhone) {
      textContent = (
        <div>
          <span style={{ display: initialCode ? 'inline' : 'none' }}>{initialCode}</span>
          <span>{initialPhone}</span>
        </div>
      );
    } else {
      textContent = (<div>
        <span>无</span>
      </div>);
    }

    return textContent;
  }

  // 进入编辑状态
  enterEditing = () => {
    const { internationalCode, phone } = this.props;
    this.setState({
      editing: true,
      internationalCode,
      phone,
    });
  }

  // 取消编辑
  leaveEditing = () => {
    const { resetFields } = this.props.form;
    this.setState({
      editing: false,
    });
    resetFields();
  }


  onSubmit = () => {
    this.props.form.validateFields((err, values, modify) => {
      if (!err) {
        if (!modify) {
          this.setState({
            editing: false,
          });
        } else {
          this.props.onSubmit(values);
          this.setState({
            editing: false,
          });
        }
      }
    });
  }

  checkCode = (rule, value, callback) => {
    const { intl: { formatMessage } } = this.props;
    const pattern = /^[0-9]*$/;
    const { validateFields } = this.props.form;
    if (value) {
      if (pattern.test(value)) {
        if (value === '86') {
          validateFields(['phone'], { force: true });
        }
        callback();
      } else {
        callback(formatMessage({ id: `${intlPrefix}.num.required` }));
      }
    } else {
      validateFields(['phone'], { force: true });
      callback();
    }
  }

  checkPhone = (rule, value, callback) => {
    const { intl: { formatMessage }, form: { getFieldValue } } = this.props;
    const code = getFieldValue('internationalTelCode');
    let pattern = /^[0-9]*$/;
    if (value) {
      if (pattern.test(value)) {
        if (code === '86') {
          pattern = /^1[3-9]\d{9}$/;
          if (pattern.test(value)) {
            callback();
          } else {
            callback(formatMessage({ id: `${intlPrefix}.phone.district.rule` }));
          }
        } else {
          callback();
        }
      } else {
        callback(formatMessage({ id: `${intlPrefix}.num.required` }));
      }
    } else if (code) {
      callback(formatMessage({ id: `${intlPrefix}.phone.pattern.msg` }));
    } else {
      callback();
    }
  }

  getInitialCode = (initialPhone, initialCode) => {
    let code;
    if (initialPhone && initialCode) {
      code = initialCode.split('+')[1];
    } else if (initialPhone && !initialCode) {
      code = '';
    } else if (!initialPhone && !initialCode) {
      code = '86';
    }
    return code;
  }


  render() {
    const { editing } = this.state;
    const { initialPhone, initialCode, form } = this.props;
    const { getFieldDecorator } = form;
    return editing ? (
      <Form layout="inline" className="c7n-iam-userinfo-phone-wrapper-edit">
        <FormItem
          style={{ marginRight: '4px' }}
        >
          {getFieldDecorator('internationalTelCode', {
            rules: [
              {
                validator: this.checkCode,
              }],
            initialValue: this.getInitialCode(initialPhone, initialCode),
          })(
            <Input
              prefix="+"
              autoComplete="off"
              style={{ width: '65px' }}
              minLength={0}
              maxLength={4}
              showLengthInfo={false}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('phone', {
            rules: [{
              validator: this.checkPhone,
            }],
            initialValue: initialPhone,
          })(
            <Input
              autoComplete="off"
              style={{ width: '220px' }}
            />,
          )}
        </FormItem>
        <div className="c7n-iam-userinfo-phone-wrapper-edit-icon-container">
          <Icon type="done" className="c7n-iam-userinfo-phone-wrapper-edit-icon" onClick={this.onSubmit} />
          <Icon type="close" className="c7n-iam-userinfo-phone-wrapper-edit-icon" onClick={this.leaveEditing} />
        </div>
      </Form>
    ) : (
      <div
        className="c7n-iam-userinfo-phone-wrapper-text c7n-iam-userinfo-phone-wrapper-text-active"
        onClick={this.enterEditing}
      >
        {this.renderText()}
        <Icon type="mode_edit" className="c7n-iam-userinfo-phone-wrapper-text-icon" />
      </div>
    );
  }
}

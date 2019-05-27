import React, { Component } from 'react';
import get from 'lodash/get';
import { Form, Modal, Tooltip, Select, Input } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import './Application.scss';
import ApplicationStore from '../../../stores/organization/application/ApplicationStore';

const { Option } = Select;
const FormItem = Form.Item;
const { Sidebar } = Modal;
const intlPrefix = 'organization.application';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@withRouter
@injectIntl
@inject('AppState')
@observer
@Form.create({})
export default class Application extends Component {
  /**
   * 校验应用名称唯一性
   * @param value 应用编码
   * @param callback 回调函数
   */
  checkName = (rule, value, callback) => {
    const { editData } = ApplicationStore;
    const { intl } = this.props;
    const params = { name: value };
    if (editData && editData.name === value) callback();
    ApplicationStore.checkApplicationCode(params)
      .then((mes) => {
        if (mes.failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.name.exist.msg` }));
        } else {
          callback();
        }
      }).catch((err) => {
        callback('校验超时');
        Choerodon.handleResponseError(err);
      });
  };

  handleOk = () => {
    const { onOk } = this.props;
    const { editData } = ApplicationStore;
    
    const { validateFields } = this.props.form;
    validateFields((err, validated) => {
      if (!err) {
        const data = {
          ...editData,
          name: validated.name.trim(),
          projectId: validated.projectId || undefined,
        };
        ApplicationStore.updateApplication(data, editData.id)
          .then((value) => {
            if (!value.failed) {
              Choerodon.prompt(this.props.intl.formatMessage({ id: 'save.success' }));
              if (onOk) {
                onOk();
              }
            } else {
              Choerodon.prompt(value.message);
            }
          }).catch((error) => {
            Choerodon.handleResponseError(error);
          });
      }
    });
  }

  renderContent() {
    const { intl, form } = this.props;
    const { getFieldDecorator } = form;
    const { projectData, editData } = ApplicationStore;
    const inputWidth = 512;
    const isCombina = get(editData, 'applicationCategory', undefined) === 'combination-application';
    return (
      <Form layout="vertical" className="rightForm" style={{ width: 512 }}>
        {
          !isCombina && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('applicationType', {
                initialValue: intl.formatMessage({ id: `${intlPrefix}.type.${editData.applicationType.toLowerCase()}` }),
              })(
                <Input
                  disabled
                  label={<FormattedMessage id={`${intlPrefix}.type`} />}
                  style={{ width: inputWidth }}
                  ref={(e) => { this.createFocusInput = e; }}
                />,
              )}
            </FormItem>
          )
        }
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('code', {
            initialValue: editData.code,
          })(
            <Input
              disabled
              label={<FormattedMessage id={`${intlPrefix}.code`} />}
              style={{ width: inputWidth }}
              ref={(e) => { this.createFocusInput = e; }}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: editData.name,
            rules: [{
              required: true,
              message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
            }, {
              pattern: /^[^\s]*$/,
              message: intl.formatMessage({ id: `${intlPrefix}.whitespace.msg` }),
            }, {
              validator: this.checkName,
            }],
            validateTrigger: 'onBlur',
            validateFirst: true,
          })(
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.name`} />}
              style={{ width: inputWidth }}
              ref={(e) => { this.editFocusInput = e; }}
              maxLength={14}
              showLengthInfo={false}
            />,
          )}
        </FormItem>
        {
          !isCombina && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('projectId', {
                initialValue: editData.projectId || undefined,
              })(
                <Select
                  label={<FormattedMessage id={`${intlPrefix}.assignment`} />}
                  className="c7n-iam-application-radiogroup"
                  getPopupContainer={that => that}
                  filterOption={(input, option) => {
                    const childNode = option.props.children;
                    if (childNode && React.isValidElement(childNode)) {
                      return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                  disabled={(editData && !!editData.projectId)}
                  allowClear
                  filter
                >
                  {
                    projectData.map(({ id, name, code }) => (
                      <Option value={id} key={id} title={name}>
                        <Tooltip title={code} placement="right" align={{ offset: [20, 0] }}>
                          <span style={{ display: 'inline-block', width: '100%' }}>{name}</span>
                        </Tooltip>
                      </Option>
                    ))
                  }
                </Select>,
              )}
            </FormItem>
          )
        }
      </Form>
    );
  }

  render() {
    const { onCancel } = this.props;
    const { editData } = ApplicationStore;
    const isCombina = get(editData, 'applicationCategory', undefined) === 'combination-application';
    return (
      <Sidebar
        visible
        title="修改应用"
        bodyStyle={{ padding: 0 }}
        onCancel={onCancel}
        onOk={this.handleOk}
        onText="保存"
      >
        <Content
          title={`修改${isCombina ? '组合' : '普通'}应用"${editData.name}"`}
          description="您可以在此修改应用名称。如果此应用是组合应用，您可以在此查看此组合应用下子应用的信息，同时您还可以在此添加或删除此组合应用下的子应用。"
          link="#"
        >
          {this.renderContent()}
        </Content>
      </Sidebar>
    );
  }
}

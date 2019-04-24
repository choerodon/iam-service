/**
 * Created by chenbinjie on 2018/8/6.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Input, Button, Select, Table, Tooltip, Form, Spin, Radio } from 'choerodon-ui';
import { axios, Content, Header, Page, Permission } from 'choerodon-boot-combine';
import { injectIntl, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import './MailSetting.scss';
import MailSettingStore from '../../../stores/global/mail-setting/index';

const intlPrefix = 'global.mailsetting';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
};

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class MailSetting extends Component {
  constructor(props) {
    super(props);
    this.loadMailSetting = this.loadMailSetting.bind(this);
    this.state = this.getInitState();
  }

  componentDidMount() {
    this.loadMailSetting();
  }

  getInitState() {
    return {
      loading: true,
      saving: false,
      isExchange: false, // 下拉框选中EXCHANGE时，控制SSL和端口号的显示
    };
  }

  /* 加载邮件配置 */
  loadMailSetting = () => {
    this.setState({ loading: true });
    MailSettingStore.loadData().then((data) => {
      if (!data.failed) {
        MailSettingStore.setSettingData(data);
        if (data.protocol === 'EXCHANGE') {
          this.setState({
            isExchange: true,
          });
        }
      } else {
        Choerodon.prompt(data.message);
      }
      this.setState({ loading: false });
    }).catch(Choerodon.handleResponseError);
  }


  handleRefresh = () => {
    this.loadMailSetting();
  }

  testContact = () => {
    const { intl, form } = this.props;
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const setting = {
      ...values,
      ssl: values.ssl === 'Y',
      port: Number(values.port),
      objectVersionNumber: MailSettingStore.getSettingData.objectVersionNumber,
    };
    MailSettingStore.testConnection(setting).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.connect.success` }));
      }
    }).catch((error) => {
      Choerodon.handleResponseError(error);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          saving: true,
        });
        const setting = {
          ...values,
          ssl: values.ssl === 'Y',
          port: Number(values.port),
          objectVersionNumber: MailSettingStore.getSettingData.objectVersionNumber,
        };
        MailSettingStore.updateData(setting).then((data) => {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
            MailSettingStore.setSettingData(data);
          }
          this.setState({
            saving: false,
          });
        }).catch((error) => {
          Choerodon.handleResponseError(error);
          this.setState({
            saving: false,
          });
        });
      }
    });
  }

  render() {
    const { intl, form, AppState } = this.props;
    const { loading, saving } = this.state;
    const { getFieldDecorator } = form;
    const inputWidth = '512px';
    const mainContent = (
      <div className={classnames('c7n-mailsetting-container', { 'c7n-mailsetting-loading-container': loading })}>
        {loading ? <Spin size="large" /> : (
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('account', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.account.required` }),
                }, {
                  type: 'email',
                  message: intl.formatMessage({ id: `${intlPrefix}.account.format` }),
                }],
                initialValue: MailSettingStore.getSettingData.account,
              })(
                <Input label={intl.formatMessage({ id: `${intlPrefix}.sending.mail` })} style={{ width: inputWidth }} autoComplete="off" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.password.required` }),
                }],
                initialValue: MailSettingStore.getSettingData.password,
              })(
                <Input type="password" label={intl.formatMessage({ id: `${intlPrefix}.sending.password` })} style={{ width: inputWidth }} autoComplete="off" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('sendName', {
                rules: [],
                initialValue: MailSettingStore.getSettingData.sendName,
              })(
                <Input label={intl.formatMessage({ id: `${intlPrefix}.sender` })} style={{ width: inputWidth }} autoComplete="off" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('protocol', {
                rules: [],
                initialValue: 'SMTP',
              })(
                <Input label={intl.formatMessage({ id: `${intlPrefix}.server.type` })} style={{ width: inputWidth }} disabled />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('host', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.host.required` }),
                }],
                initialValue: MailSettingStore.getSettingData.host,
              })(
                <Input label={intl.formatMessage({ id: `${intlPrefix}.server.address` })} style={{ width: inputWidth }} autoComplete="off" />,
              )}
            </FormItem>
            {
              !this.state.isExchange ? (
                <div>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ssl', {
                      initialValue: MailSettingStore.getSettingData.ssl ? 'Y' : 'N',
                    })(
                      <RadioGroup
                        className="sslRadioGroup"
                        label={intl.formatMessage({ id: `${intlPrefix}.ssl` })}
                      >
                        <Radio value={'Y'}><FormattedMessage id="yes" /></Radio>
                        <Radio value={'N'}><FormattedMessage id="no" /></Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('port', {
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: intl.formatMessage({ id: `${intlPrefix}.port.required` }),
                      }, {
                        pattern: /^[1-9]\d*$/,
                        message: intl.formatMessage({ id: `${intlPrefix}.port.pattern` }),
                      }],
                      initialValue: String(MailSettingStore.getSettingData.port),
                    })(
                      <Input label={intl.formatMessage({ id: `${intlPrefix}.port` })} style={{ width: inputWidth }} autoComplete="off" />,
                    )}
                  </FormItem>

                </div>
              ) : ''
            }
            <hr className="divider" />
            <Permission service={['notify-service.config.updateEmail']}>
              <div className="btnGroup">
                <Button
                  funcType="raised"
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                >
                  <FormattedMessage id="save" />
                </Button>
                <Button
                  funcType="raised"
                  onClick={() => {
                    const { resetFields } = this.props.form;
                    resetFields();
                  }}
                  style={{ color: '#3F51B5' }}
                  disabled={saving}
                >
                  <FormattedMessage id="cancel" />
                </Button>
              </div>
            </Permission>
          </Form>
        )}
      </div>
    );


    return (
      <Page
        service={[
          'notify-service.config.selectEmail',
          'notify-service.config.testEmailConnect',
          'notify-service.config.updateEmail',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Permission service={['notify-service.config.testEmailConnect']}>
            <Button
              onClick={this.testContact}
              icon="low_priority"
            >
              <FormattedMessage id={`${intlPrefix}.test.contact`} />
            </Button>
          </Permission>
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          {mainContent}
        </Content>
      </Page>
    );
  }
}

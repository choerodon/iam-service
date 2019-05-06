
import React, { Component } from 'react';
import { Form, Input, Icon, Spin, Button, Modal } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { axios, Content } from '@choerodon/boot';
import './TestLdap.scss';
import LDAPStore from '../../../stores/organization/ldap/LDAPStore';

const FormItem = Form.Item;
const inputWidth = 512; // input框的长度
const intlPrefix = 'organization.ldap';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
let timer = null;

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class TestConnect extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      organizationId: this.props.AppState.currentMenuType.id,
    };
  }

  componentWillMount() {
    this.props.onRef(this);
  }

  getSyncInfoOnce = () => {
    const ldapData = LDAPStore.getLDAPData;
    const { organizationId } = this.state;
    LDAPStore.getSyncInfo(organizationId, ldapData.id).then((data) => {
      if (data.syncEndTime) {
        window.clearInterval(timer);
        LDAPStore.setSyncData(data);
        LDAPStore.setIsSyncLoading(false);
        LDAPStore.setIsConfirmLoading(!data.syncEndTime);
      }
    });
  }

  getSpentTime = (startTime, endTime) => {
    const { intl } = this.props;
    const timeUnit = {
      day: intl.formatMessage({ id: 'day' }),
      hour: intl.formatMessage({ id: 'hour' }),
      minute: intl.formatMessage({ id: 'minute' }),
      second: intl.formatMessage({ id: 'second' }),
    };
    const spentTime = new Date(endTime).getTime() - new Date(startTime).getTime(); // 时间差的毫秒数
    // 天数
    const days = Math.floor(spentTime / (24 * 3600 * 1000));
    // 小时
    const leave1 = spentTime % (24 * 3600 * 1000); //  计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));
    // 分钟
    const leave2 = leave1 % (3600 * 1000); //  计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));
    // 秒数
    const leave3 = leave2 % (60 * 1000); //  计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000);
    const resultDays = days ? (days + timeUnit.day) : '';
    const resultHours = hours ? (hours + timeUnit.hour) : '';
    const resultMinutes = minutes ? (minutes + timeUnit.minute) : '';
    const resultSeconds = seconds ? (seconds + timeUnit.second) : '';
    return resultDays + resultHours + resultMinutes + resultSeconds;
  }

  loading() {
    const { intl } = this.props;
    window.clearInterval(timer);
    timer = window.setInterval(this.getSyncInfoOnce, 9000);
    const tip = intl.formatMessage({ id: `${intlPrefix}.sync.loading` });
    const syncTip = intl.formatMessage({ id: `${intlPrefix}.sync.loading.tip` });
    return this.renderLoading(tip, syncTip);
  }

  getTestResult() {
    const testData = LDAPStore.getTestData;
    const ldapData = LDAPStore.getLDAPData;
    const adminAccount = LDAPStore.getLDAPData.account;
    const adminPassword = LDAPStore.getLDAPData.password;
    const adminStatus = adminAccount && adminPassword;
    return (
      <div>
        <p className="testTitle">
          <FormattedMessage id={`${intlPrefix}.test.result`} />
        </p>
        <div className="resultContainer">
          <div className="resultInfo">
            <div>
              <Icon type={testData.canLogin ? 'check_circle' : 'cancel'} className={testData.canLogin ? 'successIcon' : 'failedIcon'} />
              <FormattedMessage id={`${intlPrefix}.test.login`} />
              <FormattedMessage id={testData.canLogin ? 'success' : 'error'} />
            </div>
            <div>
              <Icon type={testData.canConnectServer ? 'check_circle' : 'cancel'} className={testData.canConnectServer ? 'successIcon' : 'failedIcon'} />
              <FormattedMessage id={`${intlPrefix}.test.connect`} />
              <FormattedMessage id={testData.canConnectServer ? 'success' : 'error'} />
            </div>
            <div>
              <Icon type={testData.matchAttribute ? 'check_circle' : 'cancel'} className={testData.matchAttribute ? 'successIcon' : 'failedIcon'} />
              <FormattedMessage id={`${intlPrefix}.test.user`} />
              <FormattedMessage id={testData.matchAttribute ? 'success' : 'error'} />
            </div>
            <ul className="info">
              <li
                style={{ display: ldapData.loginNameField ? 'inline' : 'none' }}
                className={ldapData.loginNameField === testData.loginNameField ? 'toRed' : ''}
              >
                <FormattedMessage id={`${intlPrefix}.loginname`} />
                <span>{ldapData.loginNameField}</span>
              </li>
              <li
                style={{ display: ldapData.realNameField && adminStatus ? 'inline' : 'none' }}
                className={ldapData.realNameField === testData.realNameField ? 'toRed' : ''}
              >
                <FormattedMessage id={`${intlPrefix}.realname`} />
                <span>{ldapData.realNameField}</span>
              </li>
              <li
                style={{ display: ldapData.phoneField && adminStatus ? 'inline' : 'none' }}
                className={ldapData.phoneField === testData.phoneField ? 'toRed' : ''}
              >
                <FormattedMessage id={`${intlPrefix}.phone`} />
                <span>{ldapData.phoneField}</span>
              </li>
              <li
                style={{ display: ldapData.emailField ? 'inline' : 'none' }}
                className={ldapData.emailField === testData.emailField ? 'toRed' : ''}
              >
                <FormattedMessage id={`${intlPrefix}.email`} />
                <span>{ldapData.emailField}</span>
              </li>
              <li
                style={{ display: ldapData.uuidField ? 'inline' : 'none' }}
                className={ldapData.uuidField === testData.uuidField ? 'toRed' : ''}
              >
                <FormattedMessage id={`${intlPrefix}.uuid`} />
                <span>{ldapData.uuidField}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  getSyncInfo() {
    const syncData = LDAPStore.getSyncData || {};
    if (timer) {
      window.clearInterval(timer);
    }
    if (!Object.getOwnPropertyNames(syncData).length) {
      return (
        <div className="syncContainer">
          <p>
            <FormattedMessage id={`${intlPrefix}.sync.norecord`} />
          </p>
        </div>
      );
    } else if (syncData && syncData.syncEndTime) {
      return (
        <div className="syncContainer">
          <p><FormattedMessage id={`${intlPrefix}.sync.lasttime`} /> {syncData.syncEndTime}</p>
          <p>
            <FormattedMessage
              id={`${intlPrefix}.sync.time`}
              values={{
                time: this.getSpentTime(syncData.syncBeginTime, syncData.syncEndTime),
                count: syncData.updateUserCount + syncData.newUserCount,
              }}
            />
          </p>
        </div>
      );
    } else if (!syncData.syncEndTime) {
      return LDAPStore.setIsSyncLoading(true);
    }
  }

  getSidebarContent() {
    const { showWhich, intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const testData = LDAPStore.getTestData;
    const ldapData = LDAPStore.getLDAPData;
    const isSyncLoading = LDAPStore.getIsSyncLoading;
    if (showWhich === 'connect') {
      return (
        <div>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('ldapname', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
                }],
              })(
                <Input
                  autoComplete="off"
                  label={intl.formatMessage({ id: `${intlPrefix}.name` })}
                  style={{ width: inputWidth }}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('ldappwd', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.password.require.msg` }),
                }],
              })(
                <Input
                  autoComplete="off"
                  type="password"
                  label={intl.formatMessage({ id: `${intlPrefix}.password` })}
                  style={{ width: inputWidth }}
                />,
              )}
            </FormItem>
          </Form>
          <div style={{ width: '512px', display: LDAPStore.getIsShowResult ? 'block' : 'none' }}>
            {LDAPStore.getIsConnectLoading ? this.renderLoading(intl.formatMessage({ id: `${intlPrefix}.test.loading` })) : this.getTestResult()}
          </div>
        </div>
      );
    } else if (showWhich === 'adminConnect') {
      return (
        <div style={{ width: '512px' }}>
          {LDAPStore.getIsConnectLoading ? this.renderLoading(intl.formatMessage({ id: `${intlPrefix}.test.loading` })) : this.getTestResult()}
        </div>

      );
    } else {
      return (
        <div style={{ width: '512px' }}>
          {isSyncLoading ? this.loading() : this.getSyncInfo()}
        </div>
      );
    }
  }

  closeSyncSidebar = () => {
    window.clearInterval(timer);
    LDAPStore.setIsSyncLoading(false);
  }

  handleSubmit = (e) => {
    const { showWhich, intl } = this.props;
    const { organizationId } = this.state;
    e.preventDefault();
    if (showWhich === 'connect') {
      this.props.form.validateFieldsAndScroll((err, value) => {
        if (!err) {
          LDAPStore.setIsShowResult(true);
          LDAPStore.setIsConnectLoading(true);
          const ldapData = Object.assign({}, LDAPStore.getLDAPData);
          ldapData.account = value.ldapname;
          ldapData.password = value.ldappwd;
          LDAPStore.setIsConfirmLoading(true);
          LDAPStore.testConnect(organizationId, LDAPStore.getLDAPData.id, ldapData)
            .then((res) => {
              if (res) {
                LDAPStore.setTestData(res);
              }
              LDAPStore.setIsConnectLoading(false);
              LDAPStore.setIsConfirmLoading(false);
            });
        }
      });
    } else if (showWhich === 'adminConnect') {
      LDAPStore.setIsConnectLoading(true);
      LDAPStore.setIsConfirmLoading(true);
      const ldapData = LDAPStore.getLDAPData;
      LDAPStore.testConnect(organizationId, LDAPStore.getLDAPData.id, ldapData)
        .then((res) => {
          if (res) {
            LDAPStore.setTestData(res);
          }
          LDAPStore.setIsConnectLoading(false);
          LDAPStore.setIsConfirmLoading(false);
        });
    } else if (showWhich === 'sync') {
      LDAPStore.setIsConfirmLoading(true);
      LDAPStore.SyncUsers(organizationId, LDAPStore.getLDAPData.id).then((data) => {
        if (data.failed) {
          LDAPStore.setIsConfirmLoading(false);
          Choerodon.prompt(data.message);
        } else {
          LDAPStore.setIsSyncLoading(true);
        }
      });
    }
  }

  handleAbort = () => {
    const { intl, onAbort } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.abort.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.abort.content` }),
      onOk: () => axios.put(`iam/v1/organizations/${LDAPStore.ldapData.organizationId}/ldaps/${LDAPStore.ldapData.id}/stop`).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
          this.closeSyncSidebar();
        } else {
          Choerodon.prompt('终止成功');
          this.closeSyncSidebar();
        }
        if (onAbort) {
          onAbort();
        }
      }),
    });
  }

  renderAobrtButton = () => {
    const passTime = new Date() - new Date(LDAPStore.getSyncData && LDAPStore.getSyncData.syncBeginTime);
    if (LDAPStore.getSyncData && LDAPStore.getSyncData.syncEndTime === null && passTime / 1000 > 3600) {
      return (
        <Button
          funcType="raised"
          type="primary"
          style={{ backgroundColor: '#f44336', margin: '0 auto', display: 'inherit' }}
          onClick={this.handleAbort}
        >强制终止</Button>
      );
    }
    return null;
  };

  renderLoading(tip, syncTip = '') {
    return (
      <div className="loadingContainer">
        <div className="connectLoader">
          <Spin size="large" />
        </div>
        <p className="loadingText">{tip}</p>
        <p className="tipText">{syncTip}</p>
        {this.renderAobrtButton()}
      </div>
    );
  }

  render() {
    const { showWhich } = this.props;
    let code;
    if (showWhich === 'connect') {
      code = `${intlPrefix}.connect`;
    } else if (showWhich === 'adminConnect') {
      code = `${intlPrefix}.adminconnect`;
    } else if (showWhich === 'sync') {
      code = `${intlPrefix}.sync`;
    }
    return (
      <Content
        style={{ padding: 0 }}
        code={code}
      >
        {this.getSidebarContent()}
      </Content>
    );
  }
}

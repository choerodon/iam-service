
import React, { Component } from 'react';
import { Button, Form, Icon, Input, Modal, Popover, Radio, Select, Tooltip } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import TestLdap from './TestLdap';
import LoadingBar from '../../../components/loadingBar/index';
import './LDAP.scss';
import '../../../common/ConfirmModal.scss';

const Sidebar = Modal.Sidebar;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const intlPrefix = 'organization.ldap';
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
export default class LDAP extends Component {
  constructor(props) {
    super(props);
    this.loadLDAP = this.loadLDAP.bind(this);
    this.state = this.getInitState();
  }

  componentDidMount() {
    this.loadLDAP();
  }

  getInitState() {
    return {
      sidebar: false,
      open: false,
      saving: false,
      organizationId: this.props.AppState.currentMenuType.id,
      value: '',
      showServer: true,
      showUser: true,
      showAdminPwd: false,
      showWhich: '',
      ldapAdminData: '',
    };
  }

  /* 获取同步用户信息 */
  getSyncInfo() {
    const { LDAPStore } = this.props;
    const { organizationId } = this.state;
    const ldapData = LDAPStore.getLDAPData;
    LDAPStore.getSyncInfo(organizationId, ldapData.id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        LDAPStore.setIsConfirmLoading(data && !data.syncEndTime);
        LDAPStore.setSyncData(data);
      }
    });
  }

  /**
   * Input后缀提示
   * @param text
   */
  getSuffix(text) {
    return (
      <Popover
        overlayStyle={{ maxWidth: '180px', wordBreak: 'break-all' }}
        className="routePop"
        placement="right"
        trigger="hover"
        content={text}
      >
        <Icon type="help" />
      </Popover>
    );
  }

  /**
   * label后缀提示
   * @param label label文字
   * @param tip 提示文字
   */

  labelSuffix(label, tip) {
    return (
      <div className="labelSuffix">
        <span>
          {label}
        </span>
        <Popover
          overlayStyle={{ maxWidth: '180px' }}
          placement="right"
          trigger="hover"
          content={tip}
        >
          <Icon type="help" />
        </Popover>
      </div>
    );
  }

  /* 加载LDAP */
  loadLDAP = () => {
    const { LDAPStore, intl } = this.props;
    const { organizationId } = this.state;
    LDAPStore.loadLDAP(organizationId).catch((error) => {
      LDAPStore.cleanData();
      const response = error.response;
      if (response) {
        const status = response.status;
        const mess = response.data.message;
        switch (status) {
          case 400:
            Choerodon.prompt(mess);
            break;
          case 404:
            Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.notfound.msg` }));
            break;
          default:
            break;
        }
        LDAPStore.setIsLoading(false);
      }
    });
    this.setState({
      saving: false,
    });
  };

  /* 刷新 */
  reload = () => {
    this.loadLDAP();
  };

  redirectSyncRecord = () => {
    const { AppState, LDAPStore } = this.props;
    const ldapData = LDAPStore.getLDAPData;
    const menu = AppState.currentMenuType;
    const { type, id, name } = menu;
    this.props.history.push(`/iam/ldap/sync-record/${ldapData.id}?type=${type}&id=${id}&name=${name}&organizationId=${id}`);
  }

  /* 开启侧边栏 */
  openSidebar(status) {
    const { LDAPStore } = this.props;
    LDAPStore.setIsShowResult(false);
    LDAPStore.setIsSyncLoading(false);
    if (this.TestLdap) {
      const { resetFields } = this.TestLdap.props.form;
      resetFields();
    }

    this.setState({
      sidebar: true,
      showWhich: status,
    }, () => {
      if (status === 'connect') {
        LDAPStore.setIsConfirmLoading(false);
      } else if (status === 'sync') {
        this.getSyncInfo();
      }
    });
  }

  /* 关闭侧边栏 */
  closeSidebar = () => {
    this.setState({
      sidebar: false,
    }, () => {
      this.TestLdap.closeSyncSidebar();
    });
  };

  /* 是否显示服务器设置下拉面板 */
  isShowServerSetting = () => {
    this.setState({
      showServer: !this.state.showServer,
    });
  }

  /* 是否显示用户设置属性下拉面板 */
  isShowUserSetting = () => {
    this.setState({
      showUser: !this.state.showUser,
    });
  }

  /* ssl修改状态默认端口号更改 */
  changeSsl() {
    const { getFieldValue, setFieldsValue } = this.props.form;
    setFieldsValue({
      port: getFieldValue('useSSL') === 'Y' ? '389' : '636',
    });
  }

  enableLdap = () => {
    const { LDAPStore, intl } = this.props;
    const { organizationId } = this.state;
    const ldapData = LDAPStore.getLDAPData;
    if (ldapData.enabled) {
      Modal.confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: `${intlPrefix}.disable.title` }),
        content: intl.formatMessage({ id: `${intlPrefix}.disable.content` }),
        onOk: () => LDAPStore.disabledLdap(organizationId, ldapData.id).then((data) => {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'disable.success' }));
            LDAPStore.setLDAPData(data);
          }
        }),
      });
    } else {
      LDAPStore.enabledLdap(organizationId, ldapData.id).then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'enable.success' }));
          LDAPStore.setLDAPData(data);
        }
      });
    }
  }

  /* 表单提交 */
  handleSubmit = (e) => {
    e.preventDefault();
    const { AppState } = this.props;
    this.setState({
      showServer: true,
      showUser: true,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { LDAPStore, intl } = this.props;
        const original = LDAPStore.getLDAPData;
        const ldapStatus = values.useSSL === 'Y';
        const ladp = {
          ...values,
          id: original.id,
          objectVersionNumber: original.objectVersionNumber,
          realNameField: values.realNameField || null,
          phoneField: values.phoneField || null,
        };
        ladp.useSSL = ldapStatus;
        if (!ladp.port) {
          ladp.port = ladp.useSSL ? 636 : 389;
        }
        ladp.name = AppState.currentMenuType.name;
        ladp.organizationId = AppState.currentMenuType.organizationId;
        ladp.enabled = LDAPStore.getLDAPData.enabled;
        this.setState({
          saving: true,
        });
        LDAPStore.updateLDAP(this.state.organizationId, LDAPStore.getLDAPData.id, ladp)
          .then((data) => {
            if (!data.failed) {
              LDAPStore.setLDAPData(data);
              Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
              this.setState({
                saving: false,
              });
              if (LDAPStore.getLDAPData.enabled) {
                LDAPStore.setIsConnectLoading(true);
                LDAPStore.setIsConfirmLoading(true);
                this.openSidebar('adminConnect');
                LDAPStore.testConnect(this.state.organizationId, LDAPStore.getLDAPData.id, ladp)
                  .then((res) => {
                    if (res.failed) {
                      Choerodon.prompt(res.message);
                    } else {
                      LDAPStore.setTestData(res);
                      LDAPStore.setIsConnectLoading(false);
                      LDAPStore.setIsConfirmLoading(false);
                    }
                  });
              }
            } else {
              this.setState({
                saving: false,
              });
              Choerodon.prompt(data.message);
            }
          })
          .catch((error) => {
            Choerodon.handleResponseError(error);
            this.setState({
              saving: false,
            });
          });
      }
    });
  };

  /* 渲染侧边栏头部 */
  renderSidebarTitle() {
    const { intl } = this.props;
    const { showWhich } = this.state;
    if (showWhich === 'connect' || showWhich === 'adminConnect') {
      return intl.formatMessage({ id: `${intlPrefix}.connect` });
    } else {
      return intl.formatMessage({ id: `${intlPrefix}.syncuser` });
    }
  }

  /* 渲染侧边栏内容 */
  renderSidebarContent() {
    const { sidebar, showWhich } = this.state;
    return (
      <TestLdap
        sidebar={sidebar}
        showWhich={showWhich}
        onRef={(node) => {
          this.TestLdap = node;
        }}
        onAbort={() => { this.closeSidebar(); this.getSyncInfo(); }}
      />
    );
  }

  render() {
    const { LDAPStore, AppState, form, intl } = this.props;
    const { saving, sidebar, showWhich } = this.state;
    const menuType = AppState.currentMenuType;
    const organizationName = menuType.name;
    const ldapData = LDAPStore.getLDAPData;
    const { getFieldDecorator } = form;
    const inputWidth = 512;
    const tips = {
      hostname: intl.formatMessage({ id: `${intlPrefix}.hostname.tip` }),
      ssl: intl.formatMessage({ id: `${intlPrefix}.ssl.tip` }),
      basedn: intl.formatMessage({ id: `${intlPrefix}.basedn.tip` }),
      loginname: intl.formatMessage({ id: `${intlPrefix}.loginname.tip` }),
      username: intl.formatMessage({ id: `${intlPrefix}.username.tip` }),
      customFilter: intl.formatMessage({ id: `${intlPrefix}.custom-filter.tip` }),
      objectclass: intl.formatMessage({ id: `${intlPrefix}.objectclass.tip` }),
      uuid: intl.formatMessage({ id: `${intlPrefix}.uuid.tip` }),
    };
    const mainContent = LDAPStore.getIsLoading ? <LoadingBar /> : (<div>
      <div className="serverContainer">
        <Button
          shape="circle"
          funcType="raised"
          icon={this.state.showServer ? 'expand_more' : 'expand_less'}
          size="small"
          style={{ float: 'left' }}
          onClick={this.isShowServerSetting}
        />
        <FormattedMessage id={`${intlPrefix}.server.setting`} />
      </div>
      <Form onSubmit={this.handleSubmit} layout="vertical" className="ldapForm">
        <div style={{ display: this.state.showServer ? 'block' : 'none' }}>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('directoryType', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.directorytype.require.msg` }),
              }],
              initialValue: ldapData.directoryType ? ldapData.directoryType : undefined,
            })(
              <Select
                getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                label={intl.formatMessage({ id: `${intlPrefix}.directorytype` })}
                style={{ width: inputWidth }}
              >
                <Option value="Microsoft Active Directory">
                  <Tooltip
                    placement="right"
                    title={intl.formatMessage({ id: `${intlPrefix}.directorytype.mad.tip` })}
                    overlayStyle={{ maxWidth: '300px' }}
                  >
                    <span style={{ display: 'inline-block', width: '100%' }}>Microsoft Active Directory</span>
                  </Tooltip>
                </Option>
                <Option value="OpenLDAP">
                  <Tooltip
                    placement="right"
                    title={intl.formatMessage({ id: `${intlPrefix}.directorytype.openldap.tip` })}
                    overlayStyle={{ maxWidth: '300px' }}
                  >
                    <span style={{ display: 'inline-block', width: '100%' }}>OpenLDAP</span>
                  </Tooltip>
                </Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('serverAddress', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.serveraddress.require.msg` }),
              }],
              initialValue: ldapData.serverAddress || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.serveraddress` })} style={{ width: inputWidth }} suffix={this.getSuffix(tips.hostname)} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('useSSL', {
              initialValue: ldapData.useSSL ? 'Y' : 'N',
            })(
              <RadioGroup
                className="ldapRadioGroup"
                label={this.labelSuffix(intl.formatMessage({ id: `${intlPrefix}.usessl.suffix` }), tips.ssl)}
                onChange={this.changeSsl.bind(this)}
              >
                <Radio value={'Y'}><FormattedMessage id="yes" /></Radio>
                <Radio value={'N'}><FormattedMessage id="no" /></Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('sagaBatchSize', {
              rules: [{
                pattern: /^[1-9]\d*$/,
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.saga-batch-size.msg` }),
              }],
              initialValue: ldapData.sagaBatchSize || '500',
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.saga-batch-size` })} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('connectionTimeout', {
              rules: [{
                pattern: /^[1-9]\d*$/,
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.connection-timeout.msg` }),
              }],
              initialValue: ldapData.connectionTimeout || '10',
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.connection-timeout` })} style={{ width: inputWidth }} autoComplete="off" suffix={intl.formatMessage({ id: 'second' })} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('port', {
              rules: [{
                pattern: /^[1-9]\d*$/,
                message: intl.formatMessage({ id: `${intlPrefix}.port.pattern.msg` }),
              }],
              initialValue: ldapData.port || (ldapData.useSSL ? '636' : '389'),
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.port` })} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('baseDn', {
              initialValue: ldapData.baseDn || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.basedn` })} suffix={this.getSuffix(tips.basedn)} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('account', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.admin.loginname.msg` }),
              }],
              initialValue: ldapData.account || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.admin.loginname` })} suffix={this.getSuffix(tips.loginname)} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.admin.password.msg` }),
              }],
              initialValue: ldapData.password || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.admin.password` })} type="password" style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
        </div>
        <div className="serverContainer">
          <Button
            shape="circle"
            funcType="raised"
            icon={this.state.showUser ? 'expand_more' : 'expand_less'}
            size="small"
            style={{ float: 'left' }}
            onClick={this.isShowUserSetting}
          />
          <FormattedMessage id={`${intlPrefix}.user.setting`} />
        </div>
        <div style={{ display: this.state.showUser ? 'block' : 'none' }}>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('objectClass', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.objectclass.require.msg` }),
              }],
              initialValue: ldapData.objectClass || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.objectclass` })} suffix={this.getSuffix(tips.objectclass)} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('loginNameField', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.loginname.require.msg` }),
              }],
              initialValue: ldapData.loginNameField || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.loginname` })} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('emailField', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.email.require.msg` }),
              }],
              initialValue: ldapData.emailField || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.email` })} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('realNameField', {
              initialValue: ldapData.realNameField || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.realname` })} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('phoneField', {
              initialValue: ldapData.phoneField || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.phone` })} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('uuidField', {
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.uuid.required.msg` }),
              }],
              initialValue: ldapData.uuidField || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.uuid` })} suffix={this.getSuffix(tips.uuid)} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('customFilter', {
              rules: [{
                pattern: /^\(.*\)$/,
                message: intl.formatMessage({ id: `${intlPrefix}.custom-filter.msg` }),
              }],
              initialValue: ldapData.customFilter || undefined,
            })(
              <Input label={intl.formatMessage({ id: `${intlPrefix}.custom-filter` })} suffix={this.getSuffix(tips.customFilter)} style={{ width: inputWidth }} autoComplete="off" />,
            )}
          </FormItem>
        </div>
        <div className="divider" />
        <Permission service={['iam-service.ldap.update']}>
          <div className="btnGroup">
            <Button
              funcType="raised"
              type="primary"
              htmlType="submit"
              loading={saving}
            >
              <FormattedMessage id={ldapData.enabled ? `${intlPrefix}.saveandtest` : 'save'} />
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
    </div>);

    return (
      <Page
        service={[
          'iam-service.ldap.create',
          'iam-service.ldap.queryByOrgId',
          'iam-service.ldap.disableLdap',
          'iam-service.ldap.enableLdap',
          'iam-service.ldap.syncUsers',
          'iam-service.ldap.testConnect',
          'iam-service.ldap.update',
          'iam-service.ldap.pagingQueryHistories',
          'iam-service.ldap.pagingQueryErrorUsers',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Button
            icon={ldapData && ldapData.enabled ? 'remove_circle_outline' : 'finished'}
            onClick={this.enableLdap}
          >
            <FormattedMessage id={ldapData && ldapData.enabled ? 'disable' : 'enable'} />
          </Button>
          <Permission
            service={['iam-service.ldap.testConnect']}
          >
            <Button
              icon="low_priority"
              onClick={this.openSidebar.bind(this, 'connect')}
              disabled={!(ldapData && ldapData.enabled)}
            >
              <FormattedMessage id={`${intlPrefix}.connect`} />
            </Button>
          </Permission>
          <Permission
            service={['iam-service.ldap.syncUsers']}
          >
            <Button
              icon="sync_user"
              onClick={this.openSidebar.bind(this, 'sync')}
              disabled={!(ldapData && ldapData.enabled)}
            >
              <FormattedMessage id={`${intlPrefix}.syncuser`} />
            </Button>
          </Permission>
          <Permission
            service={['iam-service.ldap.pagingQueryHistories']}
          >
            <Button
              icon="sync_records"
              onClick={this.redirectSyncRecord}
            >
              <FormattedMessage id={`${intlPrefix}.record.header.title`} />
            </Button>
          </Permission>
          <Button
            onClick={this.reload}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: organizationName }}
        >
          <div className="ldapContainer">
            {mainContent}
          </div>
          <Sidebar
            className="connectContainer"
            title={this.renderSidebarTitle()}
            visible={sidebar}
            okText={<FormattedMessage id={showWhich === 'sync' ? `${intlPrefix}.sync` : `${intlPrefix}.test`} />}
            cancelText={<FormattedMessage id={showWhich === 'sync' ? 'return' : 'cancel'} />}
            onOk={e => this.TestLdap.handleSubmit(e)}
            onCancel={this.closeSidebar}
            confirmLoading={LDAPStore.confirmLoading}
            alwaysCanCancel
          >
            {this.renderSidebarContent()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

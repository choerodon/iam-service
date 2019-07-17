import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button,
  Form,
  TextField,
  TextArea,
  NumberField,
  SelectBox,
} from 'choerodon-ui/pro';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Page, Permission } from '@choerodon/boot';
import PasswordPolicyStore from '../../../../stores/organization/password-policy/index';
import LoadingBar from '../../../../components/loadingBar/index';
import './PasswordPolicy.scss';

const inputPrefix = 'organization.pwdpolicy';
const Option = SelectBox.Option;

@injectIntl
@inject('AppState')
@observer
export default class PasswordPolicy extends Component {
  passwordForm;
  securityForm;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showPwd: true, // 是否显示密码安全策略
      showLogin: true, // 是否显示登录安全策略
      lockStatus: false, // 登录安全策略是否开启锁定
      codeStatus: false, // 登录安全策略是否开启验证码
      submitting: false,
      organizationId: this.props.AppState.currentMenuType.id,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  /**
   * 刷新函数
   */
  reload = () => {
    this.loadData();
  };

  /**
   * 加载当前组织密码策略
   */
  loadData() {
    const { organizationId } = this.state;
    this.setState({
      loading: true,
    });
    PasswordPolicyStore.loadData(organizationId)
      .then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          PasswordPolicyStore.setPasswordPolicy(data);
          const codeStatus = data.enableCaptcha; // 登录安全策略是否开启验证码
          const lockStatus = data.enableLock; // 登录安全策略是否开启锁定
          this.setState({
            loading: false,
            codeStatus,
            lockStatus,
          });
        }
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
        this.setState({
          loading: false,
        });
      });
  }

  handleSubmit = async (e) => {
    const { AppState, intl } = this.props;
    const { passwordForm, securityForm } = this;
    const [result1, result2] = await Promise.all([
      passwordForm.checkValidity(),
      securityForm.checkValidity(),
    ]);
    const isBothFormValid = result1 && result2;
    if (isBothFormValid) {
      const oldPolicy = PasswordPolicyStore.passwordPolicy;
      this.setState({
        submitting: true,
        showPwd: true,
        showLogin: true,
      });
      PasswordPolicyStore.updatePasswordPolicy(
        AppState.currentMenuType.id,
        oldPolicy.id,
        {
          ...oldPolicy,
        }
      )
        .then((data) => {
          this.setState({ submitting: false });
          Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
          PasswordPolicyStore.setPasswordPolicy(data);
          this.loadData();
        })
        .catch((error) => {
          this.setState({ submitting: false });
          Choerodon.handleResponseError(error);
        });
    }
  };

  updatePasswordPolicyStoreField(fieldName, value) {
    const oldPolicy = PasswordPolicyStore.passwordPolicy;
    PasswordPolicyStore.setPasswordPolicy({
      ...oldPolicy,
      [fieldName]: value,
    });
  }

  fieldValueChangeHandlerMaker = (fieldName) => {
    return (value) => {
      this.updatePasswordPolicyStoreField(fieldName, value);
    };
  };

  handleEnablePasswordChange = (value) => {
    this.updatePasswordPolicyStoreField('enablePassword', value);
    this.setState((prevState) => ({
      showPwd: !prevState.showPwd,
    }));
  };

  handleEnableSecurityChange = (value) => {
    this.updatePasswordPolicyStoreField('enableSecurity', value);
    this.setState((prevState) => ({
      showLogin: !prevState.showLogin,
    }));
  };

  handleEnableLockChange = (value) => {
    this.updatePasswordPolicyStoreField('enableLock', value);
    this.setState((prevState) => ({
      lockStatus: !prevState.lockStatus,
    }));
  };

  handleEnableCaptchaChange = (value) => {
    this.updatePasswordPolicyStoreField('enableCaptcha', value);
    this.setState((prevState) => ({
      codeStatus: !prevState.codeStatus,
    }));
  };

  render() {
    const { AppState, form, intl } = this.props;
    // const { getFieldDecorator } = form;
    const { loading, submitting, showPwd, codeStatus, lockStatus } = this.state;
    const inputHalfWidth = '236px';
    const inputWidth = '512px';
    const passwordPolicy = PasswordPolicyStore.passwordPolicy || {};

    const {
      originalPassword,
      enablePassword,
      notUsername,
      enableSecurity,
      enableCaptcha,
      enableLock,
      minLength,
      maxLength,
      digitsCount,
      lowercaseCount,
      uppercaseCount,
      specialCharCount,
      notRecentCount,
      regularExpression,
      maxCheckCaptcha,
      maxErrorTime,
      lockedExpireTime,
    } = passwordPolicy;

    const mainContent = loading ? (
      <LoadingBar />
    ) : (
      <div>
        <div className="strategy-switch-container">
          <h3 className="strategy-switch-title">
            <FormattedMessage id={`${inputPrefix}.password`} />
          </h3>
          <div className="strategy-switch">
            <span className="strategy-switch-label">是否启用：</span>
            <SelectBox
              // label={<FormattedMessage id={`${inputPrefix}.enabled.password`} />}
              value={enablePassword}
              onChange={this.handleEnablePasswordChange}
              colSpan={6}
            >
              <Option value={true}>
                <FormattedMessage id="yes" />
              </Option>
              <Option value={false}>
                <FormattedMessage id="no" />
              </Option>
            </SelectBox>
          </div>
        </div>

        <Form
          labelLayout="float"
          className="strategy-form"
          onSubmit={this.handleSubmit}
          columns={6}
          style={{ display: showPwd ? 'block' : 'none' }}
          ref={(node) => (this.passwordForm = node)}
        >
          <SelectBox
            label={<FormattedMessage id={`${inputPrefix}.notusername`} />}
            value={notUsername}
            onChange={this.fieldValueChangeHandlerMaker('notUsername')}
            colSpan={6}
          >
            <Option value={true}>
              <FormattedMessage id="yes" />
            </Option>
            <Option value={false}>
              <FormattedMessage id="no" />
            </Option>
          </SelectBox>

          <TextField
            label={<FormattedMessage id={`${inputPrefix}.originalpassword`} />}
            value={originalPassword || ''}
            onChange={this.fieldValueChangeHandlerMaker('originalPassword')}
            colSpan={6}
          />

          <NumberField
            label={<FormattedMessage id={`${inputPrefix}.minlength`} />}
            min={0}
            value={minLength || 0}
            onChange={this.fieldValueChangeHandlerMaker('minLength')}
            colSpan={3}
            step={1}
          />

          <NumberField
            label={<FormattedMessage id={`${inputPrefix}.maxlength`} />}
            min={0}
            value={maxLength || 0}
            onChange={this.fieldValueChangeHandlerMaker('maxLength')}
            colSpan={3}
            step={1}
          />

          <NumberField
            min={0}
            label={<FormattedMessage id={`${inputPrefix}.digitscount`} />}
            value={digitsCount}
            onChange={this.fieldValueChangeHandlerMaker('digitsCount')}
            colSpan={2}
            step={1}
          />

          <NumberField
            label={<FormattedMessage id={`${inputPrefix}.lowercasecount`} />}
            min={0}
            value={lowercaseCount}
            onChange={this.fieldValueChangeHandlerMaker('lowercaseCount')}
            colSpan={2}
            step={1}
          />

          <NumberField
            label={<FormattedMessage id={`${inputPrefix}.uppercasecount`} />}
            min={0}
            value={uppercaseCount}
            onChange={this.fieldValueChangeHandlerMaker('uppercaseCount')}
            colSpan={2}
            step={1}
          />

          <NumberField
            label={<FormattedMessage id={`${inputPrefix}.specialcharcount`} />}
            min={0}
            value={specialCharCount}
            onChange={this.fieldValueChangeHandlerMaker('specialCharCount')}
            colSpan={3}
            step={1}
          />

          <NumberField
            label={<FormattedMessage id={`${inputPrefix}.notrecentcount`} />}
            min={0}
            value={notRecentCount}
            onChange={this.fieldValueChangeHandlerMaker('notRecentCount')}
            colSpan={3}
            step={1}
          />

          <TextArea
            label={<FormattedMessage id={`${inputPrefix}.regularexpression`} />}
            rows={2}
            value={regularExpression}
            onChange={this.fieldValueChangeHandlerMaker('regularExpression')}
            colSpan={6}
          />
        </Form>
        <div className="strategy-swtich-container">
          <h3 className="strategy-switch-title">
            <FormattedMessage id={`${inputPrefix}.login`} />
          </h3>
          <div className="strategy-switch">
            <span>是否启用：</span>
            <SelectBox
              // label={
              //   <FormattedMessage id={`${inputPrefix}.enabled.security`} />
              // }
              value={enableSecurity}
              onChange={this.handleEnableSecurityChange}
            >
              <Option value={true}>
                <FormattedMessage id="yes" />
              </Option>
              <Option value={false}>
                <FormattedMessage id="no" />
              </Option>
            </SelectBox>
          </div>
        </div>

        <Form
          labelLayout="float"
          columns={6}
          className="strategy-form"
          style={{
            display: enableSecurity ? 'block' : 'none',
          }}
          ref={(node) => (this.securityForm = node)}
        >
          <SelectBox
            label={<FormattedMessage id={`${inputPrefix}.enabled.captcha`} />}
            value={enableCaptcha}
            onChange={this.handleEnableCaptchaChange}
            colSpan={6}
          >
            <Option value={true}>
              <FormattedMessage id="yes" />
            </Option>
            <Option value={false}>
              <FormattedMessage id="no" />
            </Option>
          </SelectBox>
          {codeStatus ? (
            <NumberField
              label={<FormattedMessage id={`${inputPrefix}.maxerror.count`} />}
              min={0}
              value={enableCaptcha ? maxCheckCaptcha : 3}
              onChange={this.fieldValueChangeHandlerMaker('maxCheckCaptcha')}
              colSpan={6}
              step={1}
            />
          ) : (
            ''
          )}

          <SelectBox
            label={<FormattedMessage id={`${inputPrefix}.enabled.lock`} />}
            value={enableLock}
            onChange={this.handleEnableLockChange}
            colSpan={6}
          >
            <Option value={true}>
              <FormattedMessage id="yes" />
            </Option>
            <Option value={false}>
              <FormattedMessage id="no" />
            </Option>
          </SelectBox>
          {lockStatus
            ? [
                <NumberField
                  label={<FormattedMessage id={`${inputPrefix}.maxerror.count`} />}
                  min={0}
                  value={enableLock ? maxErrorTime : 5}
                  onChange={this.fieldValueChangeHandlerMaker('maxErrorTime')}
                  colSpan={6}
                  key="maxErrorTime"
                  step={1}
                />,

                <NumberField
                  label={<FormattedMessage id={`${inputPrefix}.locktime`} />}
                  min={0}
                  value={lockedExpireTime}
                  onChange={this.fieldValueChangeHandlerMaker('lockedExpireTime')}
                  colSpan={6}
                  key="lockExpireTime"
                  step={1}
                />,
              ]
            : ''}
        </Form>
        <div className="divider" />
        <div className="btnGroup">
          <Permission service={['iam-service.password-policy.update']}>
            <Button
              funcType="raised"
              type="submit"
              color="blue"
              loading={submitting}
              onClick={this.handleSubmit}
            >
              <FormattedMessage id="save" />
            </Button>
          </Permission>
          <Button
            funcType="raised"
            onClick={this.reload}
            disabled={submitting}
            style={{ color: '#3F51B5' }}
          >
            <FormattedMessage id="cancel" />
          </Button>
        </div>
      </div>
    );
    return (
      <Page
        className="PasswordPolicy"
        service={[
          'iam-service.password-policy.update',
          'iam-service.password-policy.queryByOrganizationId',
        ]}
      >
        <Content values={{ name: AppState.currentMenuType.name }}>
          <div className="policy-container">{mainContent}</div>
        </Content>
      </Page>
    );
  }
}

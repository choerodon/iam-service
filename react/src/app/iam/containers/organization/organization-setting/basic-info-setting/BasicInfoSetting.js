import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, TextField, Modal, Select, Icon } from 'choerodon-ui/pro';
import { Content, Header, Page, Permission, stores } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import './BasicInfoSetting.scss';
import OrganizationSettingStore from '../../../../stores/organization/organization-setting/OrganizationSettingStore';
import '../../../../common/ConfirmModal.scss';
import AvatarUploader from '../../../../components/avatarUploader';

const { HeaderStore } = stores;
const FormItem = Form.Item;
const { Option } = Select;
const intlPrefix = 'organization.info';
const ORGANIZATION_TYPE = 'organization';
const PROJECT_TYPE = 'project';

// @Form.create({})
@injectIntl
@inject('AppState')
@observer
export default class BasicInfoSetting extends Component {
  state = {
    submitting: false,
    isShowAvatar: false,
  };

  componentDidMount() {
    this.loadOrganization();
  }

  componentWillUnmount() {
    OrganizationSettingStore.setOrganizationInfo({});
    OrganizationSettingStore.setImageUrl(null);
  }

  loadOrganization = () => {
    const { AppState } = this.props;
    const { id } = AppState.currentMenuType;
    OrganizationSettingStore.axiosGetOrganizationInfo(id)
      .then((data) => {
        OrganizationSettingStore.setImageUrl(data.imageUrl);
        OrganizationSettingStore.setOrganizationInfo(data);
      })
      .catch(Choerodon.handleResponseError);
  };

  handleSave(e) {
    const oldInfo = OrganizationSettingStore.organizationInfo;
    const body = {
      ...oldInfo,
      imageUrl: OrganizationSettingStore.getImageUrl,
    };
    this.setState({ submitting: true });
    OrganizationSettingStore.axiosSaveProjectInfo(body)
      .then((data) => {
        this.setState({ submitting: false });
        Choerodon.prompt(this.props.intl.formatMessage({ id: 'save.success' }));
        OrganizationSettingStore.setImageUrl(data.imageUrl);
        OrganizationSettingStore.setOrganizationInfo(data);
        HeaderStore.updateOrg(data);
      })
      .catch((error) => {
        this.setState({ submitting: false });
        Choerodon.handleResponseError(error);
      });
  }

  cancelValue = () => {
    // const { resetFields } = this.props.form;
    // const { imageUrl } = OrganizationSettingStore.organizationInfo;
    // OrganizationSettingStore.setImageUrl(imageUrl);
    // resetFields();
    this.loadOrganization();
  };

  getAvatar() {
    const { isShowAvatar } = this.state;
    const { name } = OrganizationSettingStore.organizationInfo;
    const imageUrl = OrganizationSettingStore.getImageUrl;
    return (
      <div className="c7n-iam-organizationsetting-avatar">
        <div
          className="c7n-iam-organizationsetting-avatar-wrap"
          style={{
            backgroundColor: '#c5cbe8',
            backgroundImage: imageUrl ? `url(${Choerodon.fileServer(imageUrl)})` : '',
          }}
        >
          {!imageUrl && name && name.charAt(0)}
          <Button
            className={classnames(
              'c7n-iam-organizationsetting-avatar-button',
              'c7n-iam-organizationsetting-avatar-button-edit'
            )}
            onClick={this.openAvatarUploader}
          >
            <div className="c7n-iam-organizationsetting-avatar-button-icon">
              <Icon type="photo_camera" />
            </div>
          </Button>
          <AvatarUploader
            visible={isShowAvatar}
            intlPrefix="organization.project.avatar.edit"
            onVisibleChange={this.closeAvatarUploader}
            onUploadOk={this.handleUploadOk}
          />
        </div>
      </div>
    );
  }

  /**
   * 打开上传图片模态框
   */
  openAvatarUploader = () => {
    this.setState({
      isShowAvatar: true,
    });
  };

  /**
   * 关闭上传图片模态框
   * @param visible 模态框是否可见
   */
  closeAvatarUploader = (visible) => {
    this.setState({
      isShowAvatar: visible,
    });
  };

  handleUploadOk = (res) => {
    OrganizationSettingStore.setImageUrl(res);
    this.setState({
      // imgUrl: res,
      isShowAvatar: false,
    });
  };

  fieldValueChangeHandlerMaker(fieldName) {
    return function(value) {
      const oldInfo = OrganizationSettingStore.organizationInfo;
      OrganizationSettingStore.setOrganizationInfo({
        ...oldInfo,
        [fieldName]: value,
      });
      console.log(OrganizationSettingStore.organizationInfo.name);
    };
  }

  render() {
    const { submitting } = this.state;
    const { intl } = this.props;
    const {
      enabled,
      name,
      code,
      address,
      ownerRealName,
      homePage,
    } = OrganizationSettingStore.organizationInfo;
    return (
      <Page
        service={['iam-service.organization.queryOrgLevel']}
        style={{ position: 'static' }}
      >
        <Content values={{ name: enabled ? name : code }}>
          <div className="c7n-iam-organizationsetting">
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: 'rgba(0,0,0,.6)' }}>
                {intl.formatMessage({ id: `${intlPrefix}.avatar` })}
              </span>
              {this.getAvatar()}
            </div>
            <Form
              columns={2}
              labelLayout="float"
              onSubmit={this.handleSave.bind(this)}
              style={{ width: '5.12rem', marginLeft: '-0.05rem' }}
            >
              <TextField
                label={<FormattedMessage id={`${intlPrefix}.name`} />}
                pattern="^[-—\.\w\s\u4e00-\u9fa5]{1,32}$"
                required
                disabled={!enabled}
                maxLength={32}
                onChange={this.fieldValueChangeHandlerMaker('name')}
                value={name}
              />

              <TextField
                label={<FormattedMessage id={`${intlPrefix}.code`} />}
                disabled
                defaultValue={code}
              />

              <TextField
                label={<FormattedMessage id={`${intlPrefix}.address`} />}
                colSpan={2}
                value={address}
                onChange={this.fieldValueChangeHandlerMaker('address')}
              />

              <TextField
                colSpan={2}
                label={<FormattedMessage id={`${intlPrefix}.homePage`} />}
                value={homePage}
                onChange={this.fieldValueChangeHandlerMaker('homePage')}
              />
              <TextField
                colSpan={2}
                label={<FormattedMessage id={`${intlPrefix}.owner`} />}
                disabled
                defaultValue={ownerRealName}
              />
              <div colSpan={2} className="divider" />
              <Permission
                service={['iam-service.organization.updateOnOrganizationLevel']}
              >
                <div colSpan={2} className="btnGroup">
                  <Button
                    type="submit"
                    color="blue"
                    loading={submitting}
                    disabled={!enabled}
                  >
                    <FormattedMessage id="save" />
                  </Button>
                  <Button
                    funcType="raised"
                    onClick={this.cancelValue}
                    disabled={!enabled}
                  >
                    <FormattedMessage id="cancel" />
                  </Button>
                </div>
              </Permission>
            </Form>
          </div>
        </Content>
      </Page>
    );
  }
}

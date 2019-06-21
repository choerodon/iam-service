import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Input, Modal, Select, Icon } from 'choerodon-ui';
import { Content, Header, Page, Permission, stores } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import './OrganizationSetting.scss';
import OrganizationSettingStore from '../../../stores/organization/organization-setting/OrganizationSettingStore';
import '../../../common/ConfirmModal.scss';
import AvatarUploader from '../../../components/avatarUploader';


const { HeaderStore } = stores;
const FormItem = Form.Item;
const { Option } = Select;
const intlPrefix = 'organization.info';
const ORGANIZATION_TYPE = 'organization';
const PROJECT_TYPE = 'project';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class OrganizationSetting extends Component {
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
    OrganizationSettingStore.axiosGetOrganizationInfo(id).then((data) => {
      OrganizationSettingStore.setImageUrl(data.imageUrl);
      OrganizationSettingStore.setOrganizationInfo(data);
    }).catch(Choerodon.handleResponseError);
  };

  handleSave(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, value, modify) => {
      if (!err) {
        if (OrganizationSettingStore.getOrganizationInfo.imageUrl !== OrganizationSettingStore.getImageUrl) modify = true;
        if (!modify) {
          Choerodon.prompt(this.props.intl.formatMessage({ id: 'save.success' }));
          return;
        }
        const { id, objectVersionNumber } = OrganizationSettingStore.getOrganizationInfo;
        const body = {
          id,
          objectVersionNumber,
          ...value,
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
    });
  }

  cancelValue = () => {
    const { resetFields } = this.props.form;
    const { imageUrl } = OrganizationSettingStore.getOrganizationInfo;
    OrganizationSettingStore.setImageUrl(imageUrl);
    resetFields();
  };

  getAvatar() {
    const { isShowAvatar } = this.state;
    const { name } = OrganizationSettingStore.getOrganizationInfo;
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
          <Button className={classnames('c7n-iam-organizationsetting-avatar-button', 'c7n-iam-organizationsetting-avatar-button-edit')} onClick={this.openAvatarUploader}>
            <div className="c7n-iam-organizationsetting-avatar-button-icon">
              <Icon type="photo_camera" />
            </div>
          </Button>
          <AvatarUploader visible={isShowAvatar} intlPrefix="organization.project.avatar.edit" onVisibleChange={this.closeAvatarUploader} onUploadOk={this.handleUploadOk} />
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
  }

  /**
   * 关闭上传图片模态框
   * @param visible 模态框是否可见
   */
  closeAvatarUploader = (visible) => {
    this.setState({
      isShowAvatar: visible,
    });
  }

  handleUploadOk = (res) => {
    OrganizationSettingStore.setImageUrl(res);
    this.setState({
      // imgUrl: res,
      isShowAvatar: false,
    });
  }

  render() {
    const { submitting } = this.state;
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { enabled, name, code, address, ownerRealName, homePage } = OrganizationSettingStore.getOrganizationInfo;
    return (
        <Page
            service={[
              'iam-service.organization.queryOrgLevel',
            ]}
        >
          <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />} />
          <Content
              code={intlPrefix}
              values={{ name: enabled ? name : code }}
          >
            <div className="c7n-iam-organizationsetting">
              <Form onSubmit={this.handleSave.bind(this)}>
                <FormItem>
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage({ id: `${intlPrefix}.namerequiredmsg` }),
                    }, {
                      /* eslint-disable-next-line */
                      pattern: /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/,
                      message: intl.formatMessage({ id: `${intlPrefix}.name.pattern.msg` }),
                    }],
                    initialValue: name,
                  })(
                      <Input
                          style={{ width: 512 }}
                          autoComplete="off"
                          label={<FormattedMessage id={`${intlPrefix}.name`} />}
                          disabled={!enabled}
                          maxLength={32}
                          showLengthInfo={false}
                      />,
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('code', {
                    initialValue: code,
                  })(
                      <Input autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.code`} />} disabled style={{ width: 512 }} />,
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('address', {
                    initialValue: address,
                  })(
                      <Input autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.address`} />} style={{ width: 512 }} />,
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('ownerRealName', {
                    initialValue: ownerRealName,
                  })(
                      <Input autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.owner`} />} disabled style={{ width: 512 }} />,
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('homePage', {
                    initialValue: homePage,
                  })(
                      <Input autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.homePage`} />} style={{ width: 512 }} />,
                  )}
                </FormItem>
                <div>
                  <span style={{ color: 'rgba(0,0,0,.6)' }}>{intl.formatMessage({ id: `${intlPrefix}.avatar` })}</span>
                  {this.getAvatar()}
                </div>
                <div className="divider" />
                <Permission service={['iam-service.organization.updateOnOrganizationLevel']}>
                  <div className="btnGroup">
                    <Button
                        funcType="raised"
                        htmlType="submit"
                        type="primary"
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

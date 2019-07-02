import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Icon, Input, Modal, Select } from 'choerodon-ui';
import { axios, Content, Header, Page, Permission, stores } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import './ProjectSetting.scss';
import ProjectSettingStore from '../../../stores/project/project-setting/ProjectSettingStore';
import '../../../common/ConfirmModal.scss';
import AvatarUploader from '../../../components/avatarUploader';

const { HeaderStore } = stores;
const FormItem = Form.Item;
const Option = Select.Option;
const intlPrefix = 'project.info';
const ORGANIZATION_TYPE = 'organization';
const PROJECT_TYPE = 'project';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class ProjectSetting extends Component {
  state = {
    stopping: false,
    categoryEnabled: false,
    submitting: false,
    isShowAvatar: false,
  };

  componentDidMount() {
    this.loadEnableCategory();
    this.loadProject();
    this.loadProjectTypes();
  }

  componentWillUnmount() {
    ProjectSettingStore.setProjectInfo({});
    ProjectSettingStore.setImageUrl(null);
  }

  loadEnableCategory = () => {
    axios.get(`/iam/v1/system/setting/enable_category`)
      .then((response) => {
        this.setState({
          categoryEnabled: response,
        });
      });
  };

  loadProject = () => {
    const { AppState } = this.props;
    const id = AppState.currentMenuType.id;
    ProjectSettingStore.axiosGetProjectInfo(id).then((data) => {
      ProjectSettingStore.setImageUrl(data.imageUrl);
      ProjectSettingStore.setProjectInfo(data);
    }).catch(Choerodon.handleResponseError);
  };

  loadProjectTypes = () => {
    ProjectSettingStore.loadProjectTypes().then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        ProjectSettingStore.setProjectTypes(data);
      }
    }).catch((error) => {
      Choerodon.handleResponseError(error);
    });
  };


  handleSave(e) {
    e.preventDefault();
    const { form, location, history } = this.props;
    form.validateFields((err, value, modify) => {
      if (!err) {
        if (ProjectSettingStore.getProjectInfo.imageUrl !== ProjectSettingStore.getImageUrl) modify = true;
        if (!modify) {
          Choerodon.prompt(this.props.intl.formatMessage({ id: 'save.success' }));
          return;
        }
        const { id, organizationId, objectVersionNumber } = ProjectSettingStore.getProjectInfo;
        const body = {
          id,
          organizationId,
          objectVersionNumber,
          ...value,
          imageUrl: ProjectSettingStore.getImageUrl,
        };
        if (body.category) {
          body.category = null;
        }
        body.type = body.type === 'no' || undefined ? null : value.type;
        this.setState({ submitting: true });
        ProjectSettingStore.axiosSaveProjectInfo(body)
          .then((data) => {
            this.setState({ submitting: false });
            Choerodon.prompt(this.props.intl.formatMessage({ id: 'save.success' }));
            ProjectSettingStore.setImageUrl(data.imageUrl);
            ProjectSettingStore.setProjectInfo(data);
            HeaderStore.updateProject(data);
            history.replace(`${location.pathname}?type=project&id=${id}&name=${encodeURIComponent(data.name)}&organizationId=${organizationId}`);
          })
          .catch((error) => {
            this.setState({ submitting: false });
            Choerodon.handleResponseError(error);
          });
      }
    });
  }

  handleEnabled = (name) => {
    const { AppState, intl } = this.props;
    const userId = AppState.getUserId;
    this.setState({ stopping: true });
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.disable.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.disable.content` }, { name }),
      onOk: () => ProjectSettingStore.disableProject(AppState.currentMenuType.id)
        .then((data) => {
          this.setState({
            stopping: false,
          });
          Choerodon.prompt(this.props.intl.formatMessage({ id: 'disable.success' }));
          ProjectSettingStore.setProjectInfo(data);
          HeaderStore.updateProject(data);
          this.props.history.push('/');
          HeaderStore.axiosGetOrgAndPro(sessionStorage.userId || userId).then((org) => {
            org[0].forEach((value) => {
              value.type = ORGANIZATION_TYPE;
            });
            org[1].forEach((value) => {
              value.type = PROJECT_TYPE;
            });
            HeaderStore.setProData(org[0]);
            HeaderStore.setProData(org[1]);
          });
        })
        .catch((error) => {
          this.setState({
            stopping: false,
          });
          Choerodon.handleResponseError(error);
        }),
    });
  };

  cancelValue = () => {
    const { resetFields } = this.props.form;
    const { imageUrl } = ProjectSettingStore.getProjectInfo;
    ProjectSettingStore.setImageUrl(imageUrl);
    resetFields();
  };

  getAvatar() {
    const { isShowAvatar } = this.state;
    const { name } = ProjectSettingStore.getProjectInfo;
    const imageUrl = ProjectSettingStore.getImageUrl;
    return (
      <div className="c7n-iam-projectsetting-avatar">
        <div
          className="c7n-iam-projectsetting-avatar-wrap"
          style={{
            backgroundColor: '#c5cbe8',
            backgroundImage: imageUrl ? `url(${Choerodon.fileServer(imageUrl)})` : '',
          }}
        >
          {!imageUrl && name && name.charAt(0)}
          <Button className={classnames('c7n-iam-projectsetting-avatar-button', 'c7n-iam-projectsetting-avatar-button-edit')}
            onClick={this.openAvatarUploader}>
            <div className="c7n-iam-projectsetting-avatar-button-icon">
              <Icon type="photo_camera" />
            </div>
          </Button>
          <AvatarUploader visible={isShowAvatar}
            intlPrefix="organization.project.avatar.edit"
            onVisibleChange={this.closeAvatarUploader}
            onUploadOk={this.handleUploadOk} />
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
    ProjectSettingStore.setImageUrl(res);
    this.setState({
      // imgUrl: res,
      isShowAvatar: false,
    });
  };

  render() {
    const { submitting, categoryEnabled } = this.state;
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { enabled, name, code, categories } = ProjectSettingStore.getProjectInfo;
    const types = ProjectSettingStore.getProjectTypes;
    return (
      <Page
        service={[
          'iam-service.project.query',
          'iam-service.project.update',
          'iam-service.project.disableProject',
          'iam-service.project.list',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Permission service={['iam-service.project.disableProject']}>
            <div>
              <Button
                icon="remove_circle_outline"
                onClick={this.handleEnabled.bind(this, name)}
                disabled={!enabled}
              >
                <FormattedMessage id="disable" />
              </Button>
            </div>
          </Permission>
        </Header>
        <Content
          code={enabled ? intlPrefix : `${intlPrefix}.disabled`}
          values={{ name: enabled ? name : code }}
        >
          <div className="c7n-iam-projectsetting">
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
                  <Input autoComplete="off" label={<FormattedMessage id={`${intlPrefix}.code`} />} disabled
                    style={{ width: 512 }} />,
                )}
              </FormItem>
              {categoryEnabled && (
                <FormItem>
                  {getFieldDecorator('category', {
                    initialValue: categories && categories.map(value => value.name),
                  })(<Select
                      mode="multiple"
                      showArrow={false}
                      label={<FormattedMessage id={`${intlPrefix}.category`} />}
                      allowClear
                      disabled
                      style={{ width: 512 }}
                      loading={this.state.selectLoading}
                    >
                      {}
                    </Select>,
                  )}
                </FormItem>
              )}
              <div>
                <span style={{ color: 'rgba(0,0,0,.6)' }}>{intl.formatMessage({ id: `${intlPrefix}.avatar` })}</span>
                {this.getAvatar()}
              </div>
              <div className="divider" />
              <Permission service={['iam-service.project.update']}>
                <div className="btnGroup">
                  <Button
                    funcType="raised"
                    htmlType="submit"
                    type="primary"
                    loading={submitting}
                    disabled={!enabled}
                  ><FormattedMessage id="save" /></Button>
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

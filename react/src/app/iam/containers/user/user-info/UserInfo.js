import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Icon, Input, Select } from 'choerodon-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import UserInfoStore from '../../../stores/user/user-info/UserInfoStore';
import AvatarUploader from './AvatarUploader';
import './Userinfo.scss';
import TextEditToggle from './textEditToggle';
import PhoneWrapper from './phoneWrapper';

const { Text, Edit } = TextEditToggle;
const Option = Select.Option;
const intlPrefix = 'user.userinfo';

@Form.create({})
@injectIntl
@inject('AppState')
@observer
export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.editFocusInput = React.createRef();
  }

  state = {
    submitting: false,
    visible: false,
    phoneZone: UserInfoStore.getUserInfo.internationalTelCode ? UserInfoStore.getUserInfo.internationalTelCode.split('+')[1] : undefined,
    phone: UserInfoStore.getUserInfo.phone,
  };

  componentWillMount() {
    this.loadUserInfo();
  }

  loadUserInfo = () => {
    UserInfoStore.setUserInfo(this.props.AppState.getUserInfo);
  };

  checkEmailAddress = (rule, value, callback) => {
    const { edit, intl } = this.props;
    if (!edit || value !== this.state.userInfo.email) {
      UserInfoStore.checkEmailAddress(value).then(({ failed }) => {
        if (failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.email.used.msg` }));
        } else {
          callback();
        }
      }).catch(Choerodon.handleResponseError);
    } else {
      callback();
    }
  };

  openAvatorUploader = () => {
    this.setState({
      visible: true,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handleSubmitPhone = (value) => {
    const originUser = UserInfoStore.getUserInfo;
    const user = {
      ...originUser,
      ...value,
      imageUrl: UserInfoStore.getAvatar,
    };
    user.internationalTelCode = user.internationalTelCode ? `+${value.internationalTelCode}` : '';
    user.phone = user.phone || '';
    this.submitForm(user);
  }

  handleSubmit = (formKey, value) => {
    const originUser = UserInfoStore.getUserInfo;
    this.setState({
      submitting: true,
    });
    const user = {
      ...originUser,
      [formKey]: value,
      imageUrl: UserInfoStore.getAvatar,
    };
    this.submitForm(user);
  };


  submitForm = (user) => {
    const { AppState, intl } = this.props;
    user.loginName = null;
    UserInfoStore.updateUserInfo(user).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.props.form.resetFields();
        UserInfoStore.setUserInfo(data);
        Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
        this.setState({ submitting: false });
        AppState.setUserInfo(data);
      }
    }).catch(() => {
      Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
      this.setState({ submitting: false });
    });
  }

  getLanguageOptions() {
    let language;
    if (language) {
      return language.content.map(({ code, name }) => (<Option key={code} value={code}>{name}</Option>));
    } else {
      return [
        <Option key="zh_CN" value="zh_CN"><FormattedMessage id={`${intlPrefix}.language.zhcn`} /></Option>,
        // <Option key="en_US" value="en_US"><FormattedMessage id={`${intlPrefix}.language.enus`}/></Option>,
      ];
    }
  }

  getTimeZoneOptions() {
    const timeZone = [];
    if (timeZone.length > 0) {
      return timeZone.map(({ code, description }) => (<Option key={code} value={code}>{description}</Option>));
    } else {
      return [
        <Option key="CTT" value="CTT"><FormattedMessage id={`${intlPrefix}.timezone.ctt`} /></Option>,
        // <Option key="EST" value="EST"><FormattedMessage id={`${intlPrefix}.timezone.est`}/></Option>,
      ];
    }
  }

  getAvatar({ id, realName }) {
    const { visible } = this.state;
    const avatar = UserInfoStore.getAvatar;
    return (
      <div className="user-info-avatar-wrap">
        <div
          className="user-info-avatar"
          style={
            avatar && {
              backgroundImage: `url(${Choerodon.fileServer(avatar)})`,
            }
          }
        >
          {!avatar && realName && realName.charAt(0)}
          <Permission
            service={['iam-service.user.uploadPhoto']}
            type="site"
          >
            <Button className="user-info-avatar-button" onClick={this.openAvatorUploader}>
              <div className="user-info-avatar-button-icon">
                <Icon type="photo_camera" />
              </div>
            </Button>
            <AvatarUploader id={id} visible={visible} onVisibleChange={this.handleVisibleChange} />
          </Permission>
        </div>
      </div>
    );
  }

  renderForm(user) {
    const { intl } = this.props;
    const { loginName, realName, email, language, timeZone, phone, ldap, organizationName, organizationCode, internationalTelCode } = user;
    return (
      <Form layout="vertical" className="user-info">
        <div className="user-info-top-container">
          <div className="user-info-avatar-wrap-container">
            {this.getAvatar(user)}
          </div>
          <div className="user-info-login-info">
            <div>{loginName}</div>
            <div>{intl.formatMessage({ id: `${intlPrefix}.source` })}:{ldap ? intl.formatMessage({ id: `${intlPrefix}.ldap` }) : intl.formatMessage({ id: `${intlPrefix}.notldap` })}</div>
            <div>
              <span>{intl.formatMessage({ id: `${intlPrefix}.name` })}：</span>
              <TextEditToggle
                formKey="realName"
                formStyle={{ width: '80px' }}
                originData={realName}
                className="user-info-info-container-account-content-realName"
                onSubmit={value => this.handleSubmit('realName', value)}
                validate={{
                  validateFirst: true,
                }}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
                  },
                ]}
              >
                <Text style={{ fontSize: '13px' }}>
                  <span>{realName}</span>
                </Text>
                <Edit>
                  <Input autoComplete="off" />
                </Edit>
              </TextEditToggle>
            </div>
          </div>
        </div>
        <div className="user-info-info-container">
          <div className="user-info-info-container-account">
            <div>{intl.formatMessage({ id: `${intlPrefix}.account.info` })}</div>
            <div>
              <div>
                <Icon type="markunread" className="form-icon" />
                <span className="user-info-info-container-account-title">{intl.formatMessage({ id: `${intlPrefix}.email` })}:</span>
                <TextEditToggle
                  formStyle={{ width: '289px' }}
                  formKey="email"
                  originData={email}
                  className="user-info-info-container-account-content"
                  onSubmit={value => this.handleSubmit('email', value)}
                  validate={{
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                  }}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: intl.formatMessage({ id: `${intlPrefix}.email.require.msg` }),
                    },
                    {
                      type: 'email',
                      message: intl.formatMessage({ id: `${intlPrefix}.email.pattern.msg` }),
                    },
                    {
                      validator: this.checkEmailAddress,
                    },
                  ]}

                >
                  <Text>
                    <span style={{ width: '300px' }}>{email}</span>
                  </Text>
                  <Edit>
                    <Input autoComplete="off" />
                  </Edit>
                </TextEditToggle>
              </div>
              <div>
                <Icon type="phone_iphone" className="form-icon" />
                <span className="user-info-info-container-account-title">{intl.formatMessage({ id: `${intlPrefix}.phone` })}:</span>
                <PhoneWrapper
                  initialPhone={phone}
                  initialCode={internationalTelCode}
                  onSubmit={value => this.handleSubmitPhone(value)}
                />
              </div>
              <div>
                <Icon type="language" className="form-icon" />
                <span className="user-info-info-container-account-title">{intl.formatMessage({ id: `${intlPrefix}.language` })}:</span>
                <TextEditToggle
                  formKey="language"
                  originData={language}
                  className="user-info-info-container-account-content user-info-info-container-account-content-short"
                  formStyle={{ width: '80px' }}
                >
                  <Text>
                    <span>{'简体中文'}</span>
                  </Text>
                  <Edit>
                    <Select
                      getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                    >
                      {this.getLanguageOptions()}
                    </Select>,
                  </Edit>
                </TextEditToggle>
              </div>
              <div>
                <Icon type="location_city" className="form-icon" />
                <span className="user-info-info-container-account-title">{intl.formatMessage({ id: `${intlPrefix}.timezone` })}:</span>
                <TextEditToggle
                  formKey="timeZone"
                  originData={timeZone || 'CTT'}
                  className="user-info-info-container-account-content user-info-info-container-account-content-short"
                  formStyle={{ width: '80px' }}
                >
                  <Text>
                    <span>{'中国'}</span>
                  </Text>
                  <Edit>
                    <Select
                      getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                    >
                      {this.getTimeZoneOptions()}
                    </Select>,
                  </Edit>
                </TextEditToggle>
              </div>
            </div>
          </div>
          <div className="user-info-info-container-account">
            <div>{intl.formatMessage({ id: `${intlPrefix}.orginfo` })}</div>
            <div>
              <div>
                <Icon type="domain" className="form-icon" />
                <span className="user-info-info-container-account-title">{intl.formatMessage({ id: `${intlPrefix}.org.name` })}:</span>
                <span className="user-info-info-container-account-content">{organizationName}</span>
              </div>
              <div>
                <Icon type="copyright" className="form-icon" />
                <span className="user-info-info-container-account-title">{intl.formatMessage({ id: `${intlPrefix}.org.code` })}:</span>
                <span className="user-info-info-container-account-content">{organizationCode}</span>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const user = UserInfoStore.getUserInfo;
    return (
      <Page
        service={[
          'iam-service.user.query',
          'iam-service.user.check',
          'iam-service.user.querySelf',
          'iam-service.user.queryInfo',
          'iam-service.user.updateInfo',
          'iam-service.user.uploadPhoto',
          'iam-service.user.queryProjects',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          {/* <Button onClick={this.refresh} icon="refresh"> */}
          {/* <FormattedMessage id="refresh" /> */}
          {/* </Button> */}
        </Header>
        <Content className="user-info-container">
          {this.renderForm(user)}
        </Content>
      </Page>
    );
  }
}

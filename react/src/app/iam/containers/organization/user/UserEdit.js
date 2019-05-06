import React, { Component } from 'react';
import { Form, Input, Select } from 'choerodon-ui';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content } from '@choerodon/boot';
import CreateUserStore from '../../../stores/organization/user/CreateUserStore';

const FormItem = Form.Item;
const Option = Select.Option;
const intlPrefix = 'organization.user';

const inputWidth = 512; // input框的长度
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

function noop() {
}

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class UserEdit extends Component {
  state = this.getInitState();

  constructor(props) {
    super(props);
    this.editFocusInput = React.createRef();
    this.createFocusInput = React.createRef();
  }

  componentDidMount() {
    this.props.onRef(this);
    this.fetch(this.props);
    const { edit } = this.props;
    setTimeout(() => {
      this[edit ? 'editFocusInput' : 'createFocusInput'].input.focus();
    }, 10);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      nextProps.form.resetFields();
      this.setState(this.getInitState());
    } else if (!this.props.visible) {
      this.fetch(nextProps);
      const { edit } = nextProps;
      setTimeout(() => {
        this[edit ? 'editFocusInput' : 'createFocusInput'].input.focus();
      }, 10);
    }
  }

  getInitState() {
    return {
      rePasswordDirty: false,
      userInfo: {
        id: '',
        loginName: '',
        realName: '',
        email: '',
        language: 'zh_CN',
        timeZone: 'CTT',
        objectVersionNumber: '',
      },
    };
  }

  getUserInfoById(organizationId, id) {
    CreateUserStore.getUserInfoById(organizationId, id)
      .then((data) => {
        this.setState({
          userInfo: data,
        });
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
      });
  }

  loadPasswordPolicyById(id) {
    CreateUserStore.loadPasswordPolicyById(id)
      .catch((error) => {
        Choerodon.handleResponseError(error);
      });
  }

  fetch(props) {
    const { AppState, edit, id } = props;
    const { id: organizationId } = AppState.currentMenuType;
    if (edit) {
      this.getUserInfoById(organizationId, id);
    }
    this.loadPasswordPolicyById(organizationId);
  }

  checkUsernameAndPwd() {
    const { getFieldValue } = this.props.form;
    const { enablePassword, notUsername } = CreateUserStore.getPasswordPolicy || {};
    const password = getFieldValue('password');
    const loginName = getFieldValue('loginName');
    if (enablePassword && notUsername && password === loginName) {
      return true;
    }
    return false;
  }

  checkUsername = (rule, username, callback) => {
    const { edit, AppState, intl } = this.props;
    if (!edit || username !== this.state.userInfo.loginName) {
      if (/\s/.test(username)) {
        callback(intl.formatMessage({ id: `${intlPrefix}.name.space.msg` }));
      }
      if (username && this.checkUsernameAndPwd()) {
        callback(intl.formatMessage({ id: `${intlPrefix}.name.samepwd.msg` }));
      }

      const id = AppState.currentMenuType.id;
      CreateUserStore.checkUsername(id, username).then((data) => {
        if (data.failed) {
          callback(data.message);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };

  // validateToPassword = (rule, value, callback) => {
  //   const passwordPolicy = CreateUserStore.getPasswordPolicy;
  //   if(value && passwordPolicy && passwordPolicy.not)
  // }

  // 分别验证密码的最小长度，特殊字符和大写字母的情况和密码策略进行比对
  checkPassword = (rule, value, callback) => {
    const passwordPolicy = CreateUserStore.getPasswordPolicy;
    const { intl, form } = this.props;
    if (value && this.checkUsernameAndPwd()) {
      callback(intl.formatMessage({ id: `${intlPrefix}.name.samepwd.msg` }));
      return;
    }
    if (value && passwordPolicy && passwordPolicy.originalPassword !== value) {
      // const userName = this.state.userInfo.loginName;
      const userName = form.getFieldValue('loginName');
      Choerodon.checkPassword(passwordPolicy, value, callback, userName);
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    const { originalPassword } = CreateUserStore.getPasswordPolicy || {};
    if (value && (this.state.rePasswordDirty || originalPassword)) {
      form.validateFields(['rePassword'], { force: true });
    }
    callback();
  };

  handleRePasswordBlur = (e) => {
    const value = e.target.value;
    this.setState({ rePasswordDirty: this.state.rePasswordDirty || !!value });
  };

  checkRepassword = (rule, value, callback) => {
    const { intl, form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: `${intlPrefix}.password.unrepeat.msg` }));
    } else {
      callback();
    }
  };

  checkEmailAddress = (rule, value, callback) => {
    const { edit, AppState, intl } = this.props;
    if (!edit || value !== this.state.userInfo.email) {
      const id = AppState.currentMenuType.id;
      CreateUserStore.checkEmailAddress(id, value).then(({ failed }) => {
        if (failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.email.used.msg` }));
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, data, modify) => {
      data.realName = data.realName.trim();
      if (!err) {
        const { AppState, edit, onSubmit = noop, onSuccess = noop, onError = noop, OnUnchangedSuccess = noop, intl } = this.props;
        const menuType = AppState.currentMenuType;
        const organizationId = menuType.id;
        onSubmit();
        if (edit) {
          if (!modify) {
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            OnUnchangedSuccess();
            return;
          }
          const { id, objectVersionNumber } = this.state.userInfo;
          CreateUserStore.updateUser(organizationId, id, {
            ...data,
            objectVersionNumber,
            loginName: null,
          }).then(({ failed, message }) => {
            if (failed) {
              Choerodon.prompt(message);
              onError();
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
              onSuccess();
            }
          }).catch((error) => {
            Choerodon.handleResponseError(error);
          });
        } else {
          CreateUserStore.createUser(data, organizationId).then(({ failed, message }) => {
            if (failed) {
              Choerodon.prompt(message);
              onError();
            } else {
              Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
              onSuccess();
            }
          }).catch((error) => {
            onError();
            Choerodon.handleResponseError(error);
          });
        }
      }
    });
  };

  render() {
    const { AppState, edit, intl } = this.props;
    const menuType = AppState.currentMenuType;
    const organizationName = menuType.name;
    const { getFieldDecorator } = this.props.form;
    const { userInfo } = this.state;
    const { originalPassword, enablePassword } = CreateUserStore.getPasswordPolicy || {};
    return (
      <Content
        className="sidebar-content"
        code={edit ? `${intlPrefix}.modify` : `${intlPrefix}.create`}
        values={{ name: edit ? userInfo.loginName : organizationName }}
      >
        <Form onSubmit={this.handleSubmit.bind(this)} layout="vertical">
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('loginName', {
              rules: !edit ? [
                {
                  required: true,
                  whitespace: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.loginname.require.msg` }),
                }, {
                  validator: this.checkUsername,
                },
              ] : [],
              validateTrigger: 'onBlur',
              initialValue: userInfo.loginName,
              validateFirst: true,
            })(
              <Input
                autoComplete="off"
                label={intl.formatMessage({ id: `${intlPrefix}.loginname` })}
                disabled={edit}
                style={{ width: inputWidth }}
                ref={(e) => { this.createFocusInput = e; }}
                maxLength={32}
                showLengthInfo={false}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.realname.require.msg` }),
                  },
                ],
                initialValue: userInfo.realName,
                validateTrigger: 'onBlur',
              })(
                <Input
                  autoComplete="off"
                  label={intl.formatMessage({ id: `${intlPrefix}.realname` })}
                  type="text"
                  rows={1}
                  style={{ width: inputWidth }}
                  ref={(e) => { this.editFocusInput = e; }}
                  maxLength={32}
                  showLengthInfo={false}
                />,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('email', {
              rules: [
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
              ],
              validateTrigger: 'onBlur',
              initialValue: userInfo.email,
              validateFirst: true,
            })(
              <Input
                autoComplete="off"
                label={intl.formatMessage({ id: `${intlPrefix}.email` })}
                style={{ width: inputWidth }}
                maxLength={64}
                showLengthInfo={false}
              />,
            )}
          </FormItem>
          {!edit && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.password.require.msg` }),
                  },
                  {
                    validator: this.checkPassword,
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
                initialValue: (enablePassword && originalPassword) || AppState.getSiteInfo.defaultPassword || 'abcd1234',
                validateFirst: true,
              })(
                <Input
                  autoComplete="off"
                  label={intl.formatMessage({ id: `${intlPrefix}.password` })}
                  type="password"
                  style={{ width: inputWidth }}
                  showPasswordEye
                />,
              )}
            </FormItem>
          )}
          {!edit && (
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('rePassword', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.repassword.require.msg` }),
                  }, {
                    validator: this.checkRepassword,
                  }],
                initialValue: (enablePassword && originalPassword) || AppState.getSiteInfo.defaultPassword || 'abcd1234',
                validateFirst: true,
              })(
                <Input
                  autoComplete="off"
                  label={intl.formatMessage({ id: `${intlPrefix}.repassword` })}
                  type="password"
                  style={{ width: inputWidth }}
                  onBlur={this.handleRePasswordBlur}
                  showPasswordEye
                />,
              )}
            </FormItem>
          )}
          {
            edit && (
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('language', {
                  initialValue: this.state.userInfo.language,
                })(
                  <Select
                    getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                    label={intl.formatMessage({ id: `${intlPrefix}.language` })}
                    style={{ width: inputWidth }}
                  >
                    <Option value="zh_CN">简体中文</Option>
                    {/* <Option value="en_US">English</Option> */}
                  </Select>,
                )}
              </FormItem>
            )
          }
          {
            edit && (
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('timeZone', {
                  initialValue: this.state.userInfo.timeZone,
                })(
                  <Select
                    getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                    label={intl.formatMessage({ id: `${intlPrefix}.timezone` })}
                    style={{ width: inputWidth }}
                  >
                    <Option value="CTT">中国</Option>
                    {/* <Option value="EST">America</Option> */}
                  </Select>,
                )}
              </FormItem>
            )
          }
        </Form>
      </Content>
    );
  }
}

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { asyncLocaleProvider, asyncRouter, nomatch } from 'choerodon-boot-combine';

// global 对应目录
const announcement = asyncRouter(() => import('./src/iam/containers/global/announcement'));
const apiTest = asyncRouter(() => import('./src/iam/containers/global/api-test'));
const apiOverview = asyncRouter(() => import('./src/iam/containers/global/api-overview'));
const configuration = asyncRouter(() => import('./src/iam/containers/global/configuration'));
const instance = asyncRouter(() => import('./src/iam/containers/global/instance'));
const inmailTemplate = asyncRouter(() => import('./src/iam/containers/global/inmail-template'));
const mailTemplate = asyncRouter(() => import('./src/iam/containers/global/mail-template'));
const mailSetting = asyncRouter(() => import('./src/iam/containers/global/mail-setting'));
const systemSetting = asyncRouter(() => import('./src/iam/containers/global/system-setting'));
const memberRole = asyncRouter(() => import('./src/iam/containers/global/member-role'));
const menuSetting = asyncRouter(() => import('./src/iam/containers/global/menu-setting'));
const msgRecord = asyncRouter(() => import('./src/iam/containers/global/msg-record'));
const microService = asyncRouter(() => import('./src/iam/containers/global/microservice'));
const organization = asyncRouter(() => import('./src/iam/containers/global/organization'));
const role = asyncRouter(() => import('./src/iam/containers/global/role'));
const roleLabel = asyncRouter(() => import('./src/iam/containers/global/role-label'));
const rootUser = asyncRouter(() => import('./src/iam/containers/global/root-user'));
const route = asyncRouter(() => import('./src/iam/containers/global/route'));
const saga = asyncRouter(() => import('./src/iam/containers/global/saga'));
const sagaInstance = asyncRouter(() => import('./src/iam/containers/global/saga-instance'));
const siteStatistics = asyncRouter(() => import('./src/iam/containers/global/site-statistics'));
// const smsTemplate = asyncRouter(() => import('./global/sms-template'));
// const smsSetting = asyncRouter(() => import('./global/sms-setting'));
const dashboardSetting = asyncRouter(() => import('./src/iam/containers/global/dashboard-setting'));
const sendSetting = asyncRouter(() => import('./src/iam/containers/global/send-setting'));
const taskDetail = asyncRouter(() => import('./src/iam/containers/global/task-detail'));
const executionRecord = asyncRouter(() => import('./src/iam/containers/global/execution-record'));
const executableProgram = asyncRouter(() => import('./src/iam/containers/global/executable-program'));
const projectType = asyncRouter(() => import('./src/iam/containers/global/project-type'));


// organization
const client = asyncRouter(() => import('./src/iam/containers/organization/client'));
const ldap = asyncRouter(() => import('./src/iam/containers/organization/ldap'));
const passwordPolicy = asyncRouter(() => import('./src/iam/containers/organization/password-policy'));
const project = asyncRouter(() => import('./src/iam/containers/organization/project'));
const user = asyncRouter(() => import('./src/iam/containers/organization/user'));
const organizationSetting = asyncRouter(() => import('./src/iam/containers/organization/organization-setting'));
const application = asyncRouter(() => import('./src/iam/containers/organization/application'));

// project
const projectSetting = asyncRouter(() => import('./src/iam/containers/project/project-setting'));

// user
const password = asyncRouter(() => import('./src/iam/containers/user/password'));
const organizationInfo = asyncRouter(() => import('./src/iam/containers/user/organization-info'));
const projectInfo = asyncRouter(() => import('./src/iam/containers/user/project-info'));
const tokenManager = asyncRouter(() => import('./src/iam/containers/user/token-manager'));
const receiveSetting = asyncRouter(() => import('./src/iam/containers/user/receive-setting'));
const userInfo = asyncRouter(() => import('./src/iam/containers/user/user-info'));
const userMsg = asyncRouter(() => import('./src/iam/containers/user/user-msg'));
const permissionInfo = asyncRouter(() => import('./src/iam/containers/user/permission-info'));


@inject('AppState')
class IAMIndex extends React.Component {
  render() {
    const { match, AppState } = this.props;
    const langauge = AppState.currentLanguage;
    const IntlProviderAsync = asyncLocaleProvider(langauge, () => import(`src/iam/locale/${langauge}`));
    return (
      <IntlProviderAsync>
        <Switch>
          <Route path={`${match.url}/announcement`} component={announcement} />
          <Route path={`${match.url}/api-test`} component={apiTest} />
          <Route path={`${match.url}/api-overview`} component={apiOverview} />
          <Route path={`${match.url}/configuration`} component={configuration} />
          <Route path={`${match.url}/inmail-template`} component={inmailTemplate} />
          <Route path={`${match.url}/instance`} component={instance} />
          <Route path={`${match.url}/member-role`} component={memberRole} />
          <Route path={`${match.url}/menu-setting`} component={menuSetting} />
          <Route path={`${match.url}/msg-record`} component={msgRecord} />
          <Route path={`${match.url}/mail-template`} component={mailTemplate} />
          <Route path={`${match.url}/mail-setting`} component={mailSetting} />
          <Route path={`${match.url}/system-setting`} component={systemSetting} />
          <Route path={`${match.url}/send-setting`} component={sendSetting} />
          <Route path={`${match.url}/microservice`} component={microService} />
          <Route path={`${match.url}/organization`} component={organization} />
          <Route path={`${match.url}/role`} component={role} />
          <Route path={`${match.url}/role-label`} component={roleLabel} />
          <Route path={`${match.url}/root-user`} component={rootUser} />
          <Route path={`${match.url}/route`} component={route} />
          <Route path={`${match.url}/saga`} component={saga} />
          <Route path={`${match.url}/saga-instance`} component={sagaInstance} />
          <Route path={`${match.url}/task-detail`} component={taskDetail} />
          <Route path={`${match.url}/execution-record`} component={executionRecord} />
          <Route path={`${match.url}/executable-program`} component={executableProgram} />
          <Route path={`${match.url}/dashboard-setting`} component={dashboardSetting} />
          <Route path={`${match.url}/client`} component={client} />
          <Route path={`${match.url}/ldap`} component={ldap} />
          <Route path={`${match.url}/password-policy`} component={passwordPolicy} />
          <Route path={`${match.url}/project`} component={project} />
          <Route path={`${match.url}/user`} component={user} />
          <Route path={`${match.url}/project-setting`} component={projectSetting} />
          <Route path={`${match.url}/password`} component={password} />
          <Route path={`${match.url}/organization-info`} component={organizationInfo} />
          <Route path={`${match.url}/project-info`} component={projectInfo} />
          <Route path={`${match.url}/token-manager`} component={tokenManager} />
          <Route path={`${match.url}/receive-setting`} component={receiveSetting} />
          <Route path={`${match.url}/user-info`} component={userInfo} />
          <Route path={`${match.url}/user-msg`} component={userMsg} />
          <Route path={`${match.url}/permission-info`} component={permissionInfo} />
          <Route path={`${match.url}/site-statistics`} component={siteStatistics} />
          <Route path={`${match.url}/organization-setting`} component={organizationSetting} />
          <Route path={`${match.url}/project-type`} component={projectType} />
          <Route path={`${match.url}/application`} component={application} />
          <Route path="*" component={nomatch} />
        </Switch>
      </IntlProviderAsync>
    );
  }
}

export default IAMIndex;

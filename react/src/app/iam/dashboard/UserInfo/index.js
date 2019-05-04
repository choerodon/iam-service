import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { DashBoardNavBar, Permission } from '@choerodon/boot';
import { Spin } from 'choerodon-ui';
import UserInfoStore from '../../stores/user/user-info/UserInfoStore';
import './index.scss';

const intlPrefix = 'dashboard.userinfo';

@inject('AppState', 'HeaderStore')
@observer
export default class UserInfo extends Component {
  componentWillMount() {
    this.loadUserInfo();
  }

  loadUserInfo = () => {
    const { getUserInfo } = this.props.AppState;
    UserInfoStore.setUserInfo(getUserInfo);
  };

  render() {
    const { HeaderStore } = this.props;
    const { getUserInfo: { loginName, realName, email, ldap, organizationName } } = UserInfoStore;
    return (
      <div className="c7n-iam-dashboard-user-info">
        <dl>
          <dt><FormattedMessage id={`${intlPrefix}.realname`} /></dt>
          <dd>{realName}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.loginname`} /></dt>
          <dd>{loginName}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.email`} /></dt>
          <dd>{email}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.ldap`} /></dt>
          <dd><FormattedMessage id={`${intlPrefix}.ldap.${!!ldap}`} /></dd>
          <dt><FormattedMessage id={`${intlPrefix}.organization`} /></dt>
          <dd>{organizationName}</dd>
        </dl>
        <DashBoardNavBar>
          <Link to="/iam/user-info?type=site"><FormattedMessage id={`${intlPrefix}.redirect`} /></Link>
        </DashBoardNavBar>
      </div>
    );
  }
}

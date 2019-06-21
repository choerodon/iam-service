import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import OrganizationStore from '../../stores/global/organization/OrganizationStore';
import './index.scss';

const intlPrefix = 'dashboard.organizationinfo';

@inject('AppState')
@observer
export default class OrganizationInfo extends Component {
  componentWillMount() {
    this.loadOrganizationInfo();
  }

  loadOrganizationInfo = () => {
    const { AppState: { currentMenuType: { id }, getUserInfo: { id: userId } } } = this.props;
    OrganizationStore.loadMyData(id, userId);
  };

  render() {
    const { myOrg: { name, code, projectCount }, myRoles } = OrganizationStore;
    return (
        <div className="c7n-iam-dashboard-organization-info">
          <dl>
            <dt><FormattedMessage id={`${intlPrefix}.name`} /></dt>
            <dd>{name}</dd>
            <dt><FormattedMessage id={`${intlPrefix}.code`} /></dt>
            <dd>{code}</dd>
            <dt><FormattedMessage id={`${intlPrefix}.role`} /></dt>
            <dd>
              {myRoles.length ? myRoles.map(({ name }) => name).join(', ') : '无'}
            </dd>
            <dt><FormattedMessage id={`${intlPrefix}.projects`} /></dt>
            <dd>{projectCount}</dd>
          </dl>
        </div>
    );
  }
}

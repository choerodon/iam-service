import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { DashBoardNavBar } from 'choerodon-front-boot';
import { Spin } from 'choerodon-ui';
import ProjectStore from '../../stores/organization/project/ProjectStore';
import './index.scss';

const intlPrefix = 'dashboard.projectinfo';

@injectIntl
@inject('AppState', 'HeaderStore')
@observer
export default class ProjectInfo extends Component {
  componentWillMount() {
    this.loadProjectInfo();
  }

  loadProjectInfo = () => {
    const { AppState: { currentMenuType: { id }, getUserInfo: { id: userId } } } = this.props;
    ProjectStore.loadMyData(id, userId);
  };

  render() {
    const { HeaderStore, AppState, intl } = this.props;
    const { myRoles } = ProjectStore;
    const { id: projectId, organizationId, type } = AppState.currentMenuType;
    const projectData = HeaderStore.getProData || [];
    const orgData = HeaderStore.getOrgData || [];
    const { name, code, typeName } = projectData.find(({ id }) => String(id) === String(projectId)) || {};
    const { name: organizeName } = orgData.find(({ id }) => String(id) === String(organizationId)) || {};
    return (
      <div className="c7n-iam-dashboard-project">
        <dl>
          <dt><FormattedMessage id={`${intlPrefix}.name`} /></dt>
          <dd>{name}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.code`} /></dt>
          <dd>{code}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.type`} /></dt>
          <dd>{typeName || intl.formatMessage({ id: 'dashboard.empty' })}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.organization`} /></dt>
          <dd>{organizeName}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.role`} /></dt>
          <dd>
            {myRoles.length ? myRoles.map(({ name: roleName }) => roleName).join(', ') : intl.formatMessage({ id: 'dashboard.empty' })}
          </dd>
        </dl>
      </div>
    );
  }
}

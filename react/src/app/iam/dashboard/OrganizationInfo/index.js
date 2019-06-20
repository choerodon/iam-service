import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import OrganizationStore from '../../stores/global/organization/OrganizationStore';
import OrganizationSettingStore from '../../stores/organization/organization-setting/OrganizationSettingStore';
import './index.scss';
import {axios} from "@choerodon/boot";

const intlPrefix = 'dashboard.organizationinfo';

@inject('AppState')
@observer
export default class OrganizationInfo extends Component {
  state = {
    categoryEnabled: false,
  };

  componentWillMount() {
    this.loadOrganizationInfo();
  }
  componentDidMount() {
    this.loadEnableCategory();
    OrganizationSettingStore.loadOrganizationCategories({});
  }

  loadEnableCategory = () => {
    axios.get(`/iam/v1/system/setting/enable_category`)
        .then((response) => {
          this.setState({
            categoryEnabled: response,
          });
        });
  };
  loadOrganizationInfo = () => {
    const { AppState: { currentMenuType: { id }, getUserInfo: { id: userId } } } = this.props;
    OrganizationStore.loadMyData(id, userId);
  };

  render() {
    const { categoryEnabled } = this.state;
    const { myOrg: { name, code, projectCount,category }, myRoles } = OrganizationStore;
    const categories = OrganizationSettingStore.getOrgCategories;
    let find = categories && categories.find(item => item.code === category);
    return (
      <div className="c7n-iam-dashboard-organization-info">
        <dl>
          <dt><FormattedMessage id={`${intlPrefix}.name`} /></dt>
          <dd>{name}</dd>
          <dt><FormattedMessage id={`${intlPrefix}.code`} /></dt>
          <dd>{code}</dd>
          {
            categoryEnabled && (
                <div>
                  <dt><FormattedMessage id={`${intlPrefix}.category`} /></dt>
                  <dd>{ find && find.name}</dd>
                </div>
            )
          }
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

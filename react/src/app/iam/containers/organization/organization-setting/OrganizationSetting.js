import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Input, Modal, Select, Icon, Tabs } from 'choerodon-ui';
import { Content, Header, Page, Permission, stores } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import './OrganizationSetting.scss';
import OrganizationSettingStore from '../../../stores/organization/organization-setting/OrganizationSettingStore';
import '../../../common/ConfirmModal.scss';
import BasicInfoSetting from './basic-info-setting/BasicInfoSetting';
import PasswordPolicy from './password-policy/PasswordPolicy';

const { TabPane } = Tabs;

@withRouter
// @injectIntl
// @inject('AppState')
export default class OrganizationSetting extends Component {
  render() {
    return (
      <div className="c7n-organization-manager">
        <h1 className="header">组织设置</h1>
        <Tabs>
          <TabPane tab="基本信息">
            <BasicInfoSetting />
          </TabPane>
          <TabPane tab="密码策略">
            <PasswordPolicy />
          </TabPane>
          <TabPane tab="LDAP设置">3</TabPane>
          <TabPane tab="客户端">3</TabPane>
          <TabPane tab="工作日志">3</TabPane>
        </Tabs>
      </div>
    );
  }
}

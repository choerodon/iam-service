/**
 * Created by hulingfangzi on 2018/7/2.
 */
import React, { Component } from 'react';
import { runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Modal, Table, Tooltip } from 'choerodon-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import './OrganizationInfo.scss';
import PermissionInfo from '../permission-info';
import MouseOverWrapper from '../../../components/mouseOverWrapper';

const intlPrefix = 'user.orginfo';
const { Sidebar } = Modal;

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class ProjectInfo extends Component {
  componentWillMount() {
    this.loadInitData();
  }

  loadInitData(pagination, params) {
    const { OrganizationInfoStore, AppState: { getUserInfo: { id } } } = this.props;
    OrganizationInfoStore.loadData(id, pagination, params);
  }

  handlePageChange = (pagination, filters, sort, params) => {
    this.loadInitData(pagination, params);
  };

  getRowKey = (record, id) => {
    if ('roles' in record) {
      return record.id;
    } else {
      return `${id}-${record.id}`;
    }
  };

  /* 打开sidebar */
  openSidebar = (record) => {
    const { OrganizationInfoStore, PermissionInfoStore } = this.props;
    runInAction(() => {
      if (record.id !== PermissionInfoStore.role.id) {
        PermissionInfoStore.clear();
        PermissionInfoStore.setRole(record);
        PermissionInfoStore.loadData();
      }
      OrganizationInfoStore.showSideBar();
    });
  };

  // 关闭sidebar
  closeSidebar = () => {
    const { OrganizationInfoStore } = this.props;
    OrganizationInfoStore.hideSideBar();
  };

  handleRefresh = () => {
    const { OrganizationInfoStore, AppState: { getUserInfo: { id } } } = this.props;
    OrganizationInfoStore.refresh(id);
  };

  getTableColumns() {
    return [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text, record) => {
        let icon = '';
        if ('roles' in record) {
          icon = 'domain';
        } else {
          icon = 'person';
        }
        return (
          <MouseOverWrapper text={text} width={0.25} className={'c7n-org-info-orgname'}>
            <Icon type={icon} style={{ verticalAlign: 'text-bottom' }} />
            {text}
          </MouseOverWrapper>
        );
      },
    }, {
      title: <FormattedMessage id="code" />,
      dataIndex: 'code',
      key: 'code',
      className: 'c7n-org-info-code',
      width: '35%',
      render: text => (
        <MouseOverWrapper text={text} width={0.3}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="type" />,
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (text, record) => (
        'projects' in record ? '组织' : '角色'
      ),
    }, {
      title: '',
      width: '15%',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        if (!('projects' in record)) {
          return (
            <Permission service={['iam-service.role.listPermissionById']}>
              <Tooltip
                title={<FormattedMessage id="detail" />}
                placement="bottom"
              >
                <Button
                  shape="circle"
                  icon="find_in_page"
                  size="small"
                  onClick={this.openSidebar.bind(this, record)}
                />
              </Tooltip>
            </Permission>
          );
        } else {
          const { id, name } = record;
          return (
            <Tooltip
              title={<FormattedMessage id={`${intlPrefix}.organization.redirect`} values={{ name }} />}
              placement="bottomRight"
            >
              <Link to={`/?type=organization&id=${id}&name=${encodeURIComponent(name)}`}>
                <Button
                  shape="circle"
                  icon="exit_to_app"
                  size="small"
                />
              </Link>
            </Tooltip>
          );
        }
      },
    }];
  }

  render() {
    const {
      AppState: { getUserInfo: { realName: name } }, intl, PermissionInfoStore,
      OrganizationInfoStore: { organizationRolesData, sidebarVisible, pagination, loading, params },
    } = this.props;
    let proId;

    return (
      <Page
        service={[
          'iam-service.user.listOrganizationAndRoleById',
          'iam-service.role.listPermissionById',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <Table
            loading={loading}
            dataSource={organizationRolesData}
            pagination={pagination}
            columns={this.getTableColumns()}
            filters={params}
            childrenColumnName="roles"
            rowKey={(record) => {
              proId = this.getRowKey(record, proId);
              return proId;
            }}
            onChange={this.handlePageChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.detail.header.title`} />}
            visible={sidebarVisible}
            onOk={this.closeSidebar}
            okText={<FormattedMessage id="close" />}
            okCancel={false}
          >
            <PermissionInfo store={PermissionInfoStore} type={intlPrefix} />
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

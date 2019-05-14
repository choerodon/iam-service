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
import PermissionInfo from '../permission-info';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import './ProjectInfo.scss';

const intlPrefix = 'user.proinfo';
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
    const { ProjectInfoStore, AppState: { getUserInfo: { id } } } = this.props;
    ProjectInfoStore.loadData(id, pagination, params);
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
    const { ProjectInfoStore, PermissionInfoStore } = this.props;
    runInAction(() => {
      if (record.id !== PermissionInfoStore.role.id) {
        PermissionInfoStore.clear();
        PermissionInfoStore.setRole(record);
        PermissionInfoStore.loadData();
      }
      ProjectInfoStore.showSideBar();
    });
  };

  // 关闭sidebar
  closeSidebar = () => {
    const { ProjectInfoStore } = this.props;
    ProjectInfoStore.hideSideBar();
  };

  handleRefresh = () => {
    const { ProjectInfoStore, AppState: { getUserInfo: { id } } } = this.props;
    ProjectInfoStore.refresh(id);
  };

  getTableColumns() {
    return [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text, record) => {
        let icon = '';
        if ('organizationId' in record) {
          icon = 'project_line';
        } else {
          icon = 'person';
        }
        return (
          <MouseOverWrapper text={text} width={0.2} className={'c7n-pro-info-proname'}>
            <Icon type={icon} style={{ verticalAlign: 'text-bottom' }} /> {text}
          </MouseOverWrapper>
        );
      },
    }, {
      title: <FormattedMessage id="code" />,
      dataIndex: 'code',
      key: 'code',
      width: '30%',
      render: text => (
        <MouseOverWrapper text={text} width={0.25}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.belongorg`} />,
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: '25%',
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="type" />,
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (text, record) => (
        'organizationId' in record ? '项目' : '角色'
      ),
    }, {
      title: '',
      width: '10%',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        if (!('organizationId' in record)) {
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
          const { id, name, organizationId } = record;
          return (
            <Tooltip
              title={<FormattedMessage id={`${intlPrefix}.project.redirect`} values={{ name }} />}
              placement="bottomRight"
            >
              <Link to={`/?type=project&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`}>
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
      ProjectInfoStore: { projectRolesData, sidebarVisible, pagination, loading, params },
    } = this.props;
    let proId;

    return (
      <Page
        service={[
          'iam-service.user.listProjectAndRoleById',
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
            dataSource={projectRolesData}
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

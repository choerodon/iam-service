import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import querystring from 'query-string';
import { Button, Form, Icon, Table, Select, Menu, Dropdown } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Action, Content, Header, Page, Permission } from '@choerodon/boot';
import { RESOURCES_LEVEL } from '@choerodon/boot/lib/containers/common/constants';
import RoleStore from '../../../stores/organization/role/RoleStore';
import './Role.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';

const intlPrefix = 'organization.role';
const levels = RESOURCES_LEVEL.split(',');
@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Role extends Component {
  constructor(props) {
    super(props);
    const queryObj = querystring.parse(props.location.search);
    this.state = {
      selectedRoleIds: {},
      params: [],
      filters: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      sort: {
        columnKey: 'id',
        order: 'descend',
      },
      level: 'organization',
    };
  }

  // state = this.getInitState();

  componentDidMount() {
    this.loadRole();
  }

  getInitStat() {
    return {
      id: '',
      selectedRoleIds: {},
      params: [],
      filters: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      sort: {
        columnKey: 'id',
        order: 'descend',
      },
      selectedData: '',
      level: levels[0],
    };
  }

  getSelectedRowKeys() {
    return Object.keys(this.state.selectedRoleIds).map(id => Number(id));
  }

  showModal = (ids) => {
    const { AppState } = this.props;
    const menu = AppState.currentMenuType;
    const { type, id, name } = menu;
    this.props.history.push(`org-role/create?level=${this.state.level}&roleId=${ids}&type=${type}&id=${id}&name=${name}&organizationId=${id}`);
  }

  goCreate = () => {
    const { AppState } = this.props;
    const menu = AppState.currentMenuType;
    const { type, id, name } = menu;
    RoleStore.setChosenLevel('');
    RoleStore.setLabel([]);
    RoleStore.setSelectedRolesPermission([]);
    this.props.history.push(`org-role/create?level=${this.state.level}&type=${type}&id=${id}&name=${name}&organizationId=${id}`);
  };

  loadRole(paginationIn, sortIn, filtersIn, paramsIn) {
    const {
      pagination: paginationState,
      sort: sortState,
      filters: filtersState,
      params: paramsState,
      level,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const params = paramsIn || paramsState;
    const { AppState } = this.props;
    const { id } = AppState.currentMenuType;
    this.setState({ filters });
    RoleStore.loadRole(level, id, pagination, sort, filters, params)
      .then((data) => {
        RoleStore.setIsLoading(false);
        RoleStore.setRoles(data.list || []);
        this.setState({
          sort,
          filters,
          params,
          pagination: {
            current: data.pageNum,
            pageSize: data.pageSize,
            total: data.total,
          },
        });
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
      });
  }

  linkToChange = (url) => {
    const { AppState } = this.props;
    const menu = AppState.currentMenuType;
    const { type, id, name } = menu;
    this.props.history.push(`${url}&type=${type}&id=${id}&name=${name}&organizationId=${id}`);
  };

  handleRefresh = () => {
    // this.setState(this.getInitState(), () => {
    //   this.loadRole();
    // });
    this.loadRole();
  };

  handleEnable = (record) => {
    const { intl, AppState } = this.props;
    const { id } = AppState.currentMenuType;
    if (record.enabled) {
      RoleStore.disableRole(id, record.id).then(() => {
        Choerodon.prompt(intl.formatMessage({ id: 'disable.success' }));
        this.loadRole();
      });
    } else {
      RoleStore.enableRole(id, record.id).then(() => {
        Choerodon.prompt(intl.formatMessage({ id: 'enable.success' }));
        this.loadRole();
      });
    }
  };

  changeSelects = (selectedRowKeys, selectedRows) => {
    const { selectedRoleIds } = this.state;
    Object.keys(selectedRoleIds).forEach((id) => {
      if (selectedRowKeys.indexOf(Number(id)) === -1) {
        delete selectedRoleIds[id];
      }
    });
    selectedRows.forEach(({ id, level }) => {
      selectedRoleIds[id] = level;
    });
    this.setState({
      selectedRoleIds,
    });
  };

  handlePageChange = (pagination, filters, sort, params) => {
    this.loadRole(pagination, sort, filters, params);
  };

  // handleChangeLevel = ({ key }) => {
  //   const { level } = this.state;
  //   if (key !== level) {
  //     this.setState({
  //       level: key,
  //     }, () => this.loadRole());
  //   }
  // }

  createByThis(record) {
    this.linkToChange(`org-role/create?level=${this.state.level}&base=${record.id}`);
  }

  createByMultiple = () => {
    this.createBased();
  };

  createBased = () => {
    const ids = this.getSelectedRowKeys();
    this.linkToChange(`org-role/create?level=${this.state.level}&base=${ids.join(',')}`);
  };

  renderLevel(text) {
    if (text === 'organization') {
      return <FormattedMessage id="organization" />;
    } else if (text === 'project') {
      return <FormattedMessage id="project" />;
    } else {
      return <FormattedMessage id="global" />;
    }
  }

  // renderLevelSelect = () => {
  //   const menu = (
  //     <Menu onClick={this.handleChangeLevel}>
  //       {
  //         levels.filter(v => v !== 'user').map(level => (
  //           <Menu.Item key={level}>
  //             {this.renderLevel(level)}
  //           </Menu.Item>
  //         ))
  //       }
  //     </Menu>
  //   );
  //   return (
  //     <Dropdown overlay={menu} trigger={['click']} overlayClassName="c7n-role-popover">
  //       <a className="c7n-dropdown-link" href="#">
  //         {this.renderLevel(this.state.level)} <Icon type="arrow_drop_down" />
  //       </a>
  //     </Dropdown>
  //   );
  // }

  render() {
    const { intl, AppState: { currentMenuType } } = this.props;
    const { sort: { columnKey, order }, pagination, filters, params } = this.state;
    const { id: organizationId, name: organizationName } = currentMenuType;
    const selectedRowKeys = this.getSelectedRowKeys();
    const columns = [{
      dataIndex: 'id',
      key: 'id',
      hidden: true,
      sortOrder: columnKey === 'id' && order,
    }, {
      title: <FormattedMessage id="name" />,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      filters: [],
      sorter: true,
      sortOrder: columnKey === 'name' && order,
      filteredValue: filters.name || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="code" />,
      dataIndex: 'code',
      key: 'code',
      width: '25%',
      filters: [],
      // sorter: true,
      // sortOrder: columnKey === 'code' && order,
      filteredValue: filters.code || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    },
    {
      title: <FormattedMessage id="source" />,
      dataIndex: 'builtIn',
      key: 'builtIn',
      filters: [{
        text: intl.formatMessage({ id: `${intlPrefix}.builtin.predefined` }),
        value: 'true',
      }, {
        text: intl.formatMessage({ id: `${intlPrefix}.builtin.custom` }),
        value: 'false',
      }],
      render: (text, record) => (
        <StatusTag
          mode="icon"
          name={intl.formatMessage({ id: !record.organizationId ? '平台' : '本组织' })}
          colorCode={!record.organizationId ? 'PREDEFINE' : 'CUSTOM'}
        />
      ),
      sorter: true,
      sortOrder: columnKey === 'builtIn' && order,
      filteredValue: filters.builtIn || [],
    }, {
      title: <FormattedMessage id="status" />,
      dataIndex: 'enabled',
      key: 'enabled',
      filters: [{
        text: intl.formatMessage({ id: 'enable' }),
        value: 'true',
      }, {
        text: intl.formatMessage({ id: 'disable' }),
        value: 'false',
      }],
      render: enabled => (<StatusTag mode="icon" name={intl.formatMessage({ id: enabled ? 'enable' : 'disable' })} colorCode={enabled ? 'COMPLETED' : 'DISABLE'} />),
      // sorter: true,
      // sortOrder: columnKey === 'enabled' && order,
      filteredValue: filters.enabled || [],
    }, {
      title: '',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        const actionDatas = [{
          service: ['iam-service.role.createBaseOnRoles'],
          type: 'organization',
          icon: '',
          text: intl.formatMessage({ id: `${intlPrefix}.create.byone` }),
          action: this.createByThis.bind(this, record),
        }];
        if (record.organizationId) {
          actionDatas.push({
            service: ['iam-service.role.update'],
            icon: '',
            type: 'organization',
            text: intl.formatMessage({ id: 'modify' }),
            action: this.showModal.bind(this, record.id),
          });
          if (record.enabled) {
            actionDatas.push({
              service: ['iam-service.role.disableRole'],
              icon: '',
              type: 'organization',
              text: intl.formatMessage({ id: 'disable' }),
              action: this.handleEnable.bind(this, record),
            });
          } else {
            actionDatas.push({
              service: ['iam-service.role.enableRole'],
              icon: '',
              type: 'organization',
              text: intl.formatMessage({ id: 'enable' }),
              action: this.handleEnable.bind(this, record),
            });
          }
        }
        return <Action data={actionDatas} />;
      },
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.changeSelects,
    };
    return (
      <Page
        service={[
          // 'iam-service.role.createBaseOnRoles',
          // 'iam-service.role.update',
          // 'iam-service.role.disableRole',
          // 'iam-service.role.enableRole',
          // 'iam-service.role.create',
          // 'iam-service.role.check',
          // 'iam-service.role.listRolesWithUserCountOnOrganizationLevel',
          // 'iam-service.role.listRolesWithUserCountOnProjectLevel',
          // 'iam-service.role.list',
          // 'iam-service.role.listRolesWithUserCountOnSiteLevel',
          // 'iam-service.role.queryWithPermissionsAndLabels',
          // 'iam-service.role.pagingQueryUsersByRoleIdOnOrganizationLevel',
          // 'iam-service.role.pagingQueryUsersByRoleIdOnProjectLevel',
          // 'iam-service.role.pagingQueryUsersByRoleIdOnSiteLevel',

          'iam-service.organization-role.create',
          'iam-service.organization-role.check',
          'iam-service.organization-role.check',
          'iam-service.organization-role.pagingQuery',
          'iam-service.organization-role.queryById',
          'iam-service.organization-role.update',
          'iam-service.organization-role.disable',
          'iam-service.organization-role.enable',
          'iam-service.menu.orgMenuConfig',
          'iam-service.label.listByTypeAtOrg',
          'iam-service.permission.queryByRoleIdsAtOrg',

        ]}
        className="choerodon-role"
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          {/* {this.renderLevelSelect()} */}
          <Permission
            service={['iam-service.organization-role.create']}
          >
            <Button
              icon="playlist_add"
              onClick={this.goCreate}
            >
              <FormattedMessage id={`${intlPrefix}.create`} />
            </Button>
          </Permission>
          <Permission
            service={['iam-service.organization-role.create']}
          >
            <Button
              icon="content_copy"
              onClick={this.createByMultiple}
              disabled={!selectedRowKeys.length}
            >
              <FormattedMessage id={`${intlPrefix}.create.byselect`} />
            </Button>
          </Permission>
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: organizationName || 'Choerodon' }}
        >
          <Table
            columns={columns}
            dataSource={RoleStore.getRoles}
            pagination={pagination}
            rowSelection={rowSelection}
            rowKey={record => record.id}
            filters={params}
            onChange={this.handlePageChange}
            loading={RoleStore.getIsLoading}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
        </Content>
      </Page>
    );
  }
}

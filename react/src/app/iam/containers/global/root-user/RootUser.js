import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Modal, Table, Tooltip, Select } from 'choerodon-ui';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { handleFiltersParams } from '../../../common/util';
import RootUserStore from '../../../stores/global/root-user/RootUserStore';
import StatusTag from '../../../components/statusTag';
import '../../../common/ConfirmModal.scss';
import './RootUser.scss';

let timer;
const { Sidebar } = Modal;
const intlPrefix = 'global.rootuser';
const FormItem = Form.Item;
const Option = Select.Option;
const FormItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class RootUser extends Component {
  state = this.getInitState();
  getInitState() {
    return {
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      sort: {
        columnKey: 'id',
        order: 'descend',
      },
      filters: {},
      params: [],
      onlyRootUser: false,
      submitting: false,
      selectLoading: true,
    };
  }
  componentWillMount() {
    this.reload();
  }

  isEmptyFilters = ({ loginName, realName, enabled, locked }) => {
    if ((loginName && loginName.length) ||
      (realName && realName.length) ||
      (enabled && enabled.length) ||
      (locked && locked.length)
    ) {
      return false;
    }
    return true;
  }

  reload = (paginationIn, filtersIn, sortIn, paramsIn) => {
    const {
      pagination: paginationState,
      sort: sortState,
      filters: filtersState,
      params: paramsState,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const params = paramsIn || paramsState;
    this.setState({
      loading: true,
      filters,
    });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      RootUserStore.setRootUserData([]);
      this.setState({
        loading: false,
        sort,
        params,
        pagination: {
          total: 0,
        },
      });
      return;
    }

    RootUserStore.loadRootUserData(pagination, filters, sort, params).then((data) => {
      if (this.isEmptyFilters(filters) && !params.length) {
        this.setState({
          onlyRootUser: data.total <= 1,
        });
      }
      RootUserStore.setRootUserData(data.list || []);
      this.setState({
        pagination: {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        },
        loading: false,
        sort,
        params,
      });
    });
  }

  tableChange = (pagination, filters, sort, params) => {
    this.reload(pagination, filters, sort, params);
  }

  openSidebar = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      visible: true,
    });
  }
  closeSidebar = () => {
    this.setState({
      submitting: false,
      visible: false,
    });
  }

  handleDelete = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.remove.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.remove.content` }, {
        name: record.realName,
      }),
      onOk: () => RootUserStore.deleteRootUser(record.id).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'remove.success' }));
          this.reload();
        }
      }),
    });
  }

  handleOk = (e) => {
    const { intl } = this.props;
    const { validateFields } = this.props.form;
    e.preventDefault();
    validateFields((err, { member }) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        RootUserStore.addRootUser(member).then(({ failed, message }) => {
          if (failed) {
            Choerodon.prompt(message);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'add.success' }));
            this.closeSidebar();
            this.reload();
          }
        });
      }
    });
  };

  getUserOption = () => {
    const usersData = RootUserStore.getUsersData;
    return usersData && usersData.length > 0 ? (
      usersData.map(({ id, imageUrl, loginName, realName }) => (
        <Option key={id} value={id} label={`${loginName}${realName}`}>
          <div className="c7n-iam-rootuser-user-option">
            <div className="c7n-iam-rootuser-user-option-avatar">
              {
                imageUrl ? <img src={imageUrl} alt="userAvatar" style={{ width: '100%' }} /> :
                <span className="c7n-iam-rootuser-user-option-avatar-noavatar">{realName && realName.split('')[0]}</span>
              }
            </div>
            <span>{loginName}{realName}</span>
          </div>
        </Option>
      ))
    ) : null;
  }

  handleSelectFilter = (value) => {
    this.setState({
      selectLoading: true,
    });
    const queryObj = {
      param: value,
      sort: 'id',
      organization_id: 0,
    };

    if (timer) {
      clearTimeout(timer);
    }

    if (value) {
      timer = setTimeout(() => (this.loadUsers(queryObj)), 300);
    } else {
      return this.loadUsers(queryObj);
    }
  }

  // 加载全平台用户信息
  loadUsers = (queryObj) => {
    RootUserStore.loadUsers(queryObj).then((data) => {
      RootUserStore.setUsersData(data.list.slice());
      this.setState({
        selectLoading: false,
      });
    });
  }


  renderTable() {
    const { AppState, intl } = this.props;
    const { type } = AppState.currentMenuType;
    const { filters, sort: { columnKey, order } } = this.state;
    const rootUserData = RootUserStore.getRootUserData.slice();
    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.loginname`} />,
        key: 'loginName',
        dataIndex: 'loginName',
        filters: [],
        filteredValue: filters.loginName || [],
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.realname`} />,
        key: 'realName',
        dataIndex: 'realName',
        filters: [],
        filteredValue: filters.realName || [],
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.status.enabled`} />,
        key: 'enabled',
        dataIndex: 'enabled',
        render: enabled => (<StatusTag mode="icon" name={intl.formatMessage({ id: enabled ? 'enable' : 'disable' })} colorCode={enabled ? 'COMPLETED' : 'DISABLE'} />),
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true',
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false',
        }],
        filteredValue: filters.enabled || [],
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.status.locked`} />,
        key: 'locked',
        dataIndex: 'locked',
        filters: [{
          text: intl.formatMessage({ id: `${intlPrefix}.normal` }),
          value: 'false',
        }, {
          text: intl.formatMessage({ id: `${intlPrefix}.locked` }),
          value: 'true',
        }],
        filteredValue: filters.locked || [],
        render: lock => intl.formatMessage({ id: lock ? `${intlPrefix}.locked` : `${intlPrefix}.normal` }),
      },
      {
        title: '',
        width: 100,
        align: 'right',
        render: (text, record) => {
          const { onlyRootUser } = this.state;
          return (
            <div>
              <Permission
                service={['iam-service.user.deleteDefaultUser']}
                type={type}
              >
                <Tooltip
                  title={onlyRootUser ? <FormattedMessage id={`${intlPrefix}.remove.disable.tooltip`} /> : <FormattedMessage id="remove" />}
                  placement={onlyRootUser ? 'bottomRight' : 'bottom'}
                  overlayStyle={{ maxWidth: '300px' }}
                >
                  <Button
                    size="small"
                    disabled={onlyRootUser}
                    onClick={this.handleDelete.bind(this, record)}
                    shape="circle"
                    icon="delete_forever"
                  />
                </Tooltip>
              </Permission>
            </div>
          );
        },
      },
    ];
    return (
      <Table
        loading={this.state.loading}
        pagination={this.state.pagination}
        columns={columns}
        indentSize={0}
        dataSource={rootUserData}
        filters={this.state.params}
        rowKey="id"
        onChange={this.tableChange}
        filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
      />
    );
  }
  render() {
    const { AppState, form, intl } = this.props;
    const { type } = AppState.currentMenuType;
    const { getFieldDecorator } = form;
    return (
      <Page
        className="root-user-setting"
        service={[
          'iam-service.user.pagingQueryAdminUsers',
          'iam-service.user.addDefaultUsers',
          'iam-service.user.deleteDefaultUser',
          'iam-service.role-member.queryAllUsers',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Permission
            service={['iam-service.user.addDefaultUsers']}
            type={type}
          >
            <Button
              onClick={this.openSidebar}
              icon="playlist_add"
            >
              <FormattedMessage id="add" />
            </Button>
          </Permission>
          <Button
            icon="refresh"
            onClick={() => {
              this.setState(this.getInitState(), () => {
                this.reload();
              });
            }}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          {this.renderTable()}
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.add`} />}
            onOk={this.handleOk}
            okText={<FormattedMessage id="add" />}
            cancelText={<FormattedMessage id="cancel" />}
            onCancel={this.closeSidebar}
            visible={this.state.visible}
            confirmLoading={this.state.submitting}
          >
            <Content
              className="sidebar-content"
              code={`${intlPrefix}.add`}
              values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
            >
              <FormItem
                {...FormItemNumLayout}
              >
                {getFieldDecorator('member', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.require.msg` }),
                  }],
                  initialValue: [],
                })(
                  <Select
                    label={<FormattedMessage id={`${intlPrefix}.user`} />}
                    optionLabelProp="label"
                    allowClear
                    style={{ width: 512 }}
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={false}
                    filter
                    onFilterChange={this.handleSelectFilter}
                    notFoundContent={intl.formatMessage({ id: `${intlPrefix}.notfound.msg` })}
                    loading={this.state.selectLoading}
                  >
                    {this.getUserOption()}
                  </Select>,
                )}
              </FormItem>
            </Content>
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

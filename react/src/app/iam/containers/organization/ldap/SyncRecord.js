import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Select, Table, Tooltip, Modal, Form, Input, Popover, Icon } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { axios, Content, Header, Page, Permission, Action } from '@choerodon/boot';
import { withRouter } from 'react-router-dom';
import { handleFiltersParams } from '../../../common/util';

const intlPrefix = 'organization.ldap.record';
const { Sidebar } = Modal;

@withRouter
@injectIntl
@inject('AppState')

export default class SyncRecord extends Component {
  constructor(props) {
    super(props);
    this.ldapId = this.props.match.params.id;
  }

  state = this.getInitState();

  getInitState() {
    return {
      loading: true,
      detailLoading: true,
      recordId: null,
      isShowSidebar: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      sort: {
        columnKey: 'id',
        order: 'descend',
      },
      detailPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      detailSort: {
        columnKey: 'id',
        order: 'descend',
      },
      filters: {},
      params: [],
    };
  }

  componentWillMount() {
    this.loadSyncRecord();
  }

  componentWillUnmount() {
    const { LDAPStore } = this.props;
    LDAPStore.setSyncRecord([]);
  }

  loadSyncRecord(paginationIn, filtersIn, sortIn, paramsIn) {
    const { LDAPStore, AppState } = this.props;
    const organizationId = AppState.menuType.id;
    const {
      pagination: paginationState,
      sort: sortState,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    // 防止标签闪烁
    this.setState({ loading: true });
    LDAPStore.loadSyncRecord(pagination, sort, organizationId, this.ldapId).then((data) => {
      LDAPStore.setSyncRecord(data.list || []);
      this.setState({
        pagination: {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        },
        loading: false,
        sort,
      });
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      this.setState({
        loading: false,
      });
    });
  }

  handlePageChange = (pagination, filters, sort, params) => {
    this.loadSyncRecord(pagination, filters, sort, params);
  };

  loadDetail(paginationIn, filtersIn, sortIn, paramsIn) {
    const { LDAPStore } = this.props;
    const {
      detailPagination: paginationState,
      detailSort: sortState,
      filters: filtersState,
      params: paramsState,
      recordId,
    } = this.state;
    const detailPagination = paginationIn || paginationState;
    const detailSort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const params = paramsIn || paramsState;
    // 防止标签闪烁
    this.setState({ detailLoading: true, filters });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      LDAPStore.setDetailRecord([]);
      this.setState({
        detailPagination: {
          total: 0,
        },
        detailLoading: false,
        detailSort,
        params,
      });
      return;
    }

    LDAPStore.loadDetail(detailPagination, filters, detailSort, params, recordId).then((data) => {
      LDAPStore.setDetailRecord(data.list || []);
      this.setState({
        detailPagination: {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        },
        detailLoading: false,
        detailSort,
        params,
      });
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      this.setState({
        detailLoading: false,
      });
    });
  }

  handleDetailPageChange = (pagination, filters, sort, params) => {
    this.loadDetail(pagination, filters, sort, params);
  }

  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadSyncRecord();
    });
  };


  getBackPath = () => {
    const { currentMenuType } = this.props.AppState;
    const { type, name, id } = currentMenuType;
    const backPath = `/iam/ldap?type=${type}&id=${id}&name=${name}&organizationId=${id}`;
    return backPath;
  };

  renderSpendTime = (startTime, endTime) => {
    const { intl } = this.props;
    const timeUnit = {
      day: intl.formatMessage({ id: 'day' }),
      hour: intl.formatMessage({ id: 'hour' }),
      minute: intl.formatMessage({ id: 'minute' }),
      second: intl.formatMessage({ id: 'second' }),
    };
    const spentTime = new Date(endTime).getTime() - new Date(startTime).getTime(); // 时间差的毫秒数
    // 天数
    const days = Math.floor(spentTime / (24 * 3600 * 1000));
    // 小时
    const leave1 = spentTime % (24 * 3600 * 1000); //  计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));
    // 分钟
    const leave2 = leave1 % (3600 * 1000); //  计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));
    // 秒数
    const leave3 = leave2 % (60 * 1000); //  计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000);
    const resultDays = days ? (days + timeUnit.day) : '';
    const resultHours = hours ? (hours + timeUnit.hour) : '';
    const resultMinutes = minutes ? (minutes + timeUnit.minute) : '';
    const resultSeconds = seconds ? (seconds + timeUnit.second) : '';
    return resultDays + resultHours + resultMinutes + resultSeconds;
  }

  handleOpenSidebar(id) {
    const { LDAPStore } = this.props;
    LDAPStore.setDetailRecord([]);
    this.setState({
      isShowSidebar: true,
      recordId: id,
      detailPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      detailSort: {
        columnKey: 'id',
        order: 'descend',
      },
      filters: {},
      params: [],
    }, () => {
      this.loadDetail();
    });
  }

  // 关闭失败记录
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isShowSidebar: false,
    });
  }

  renderDetailContent() {
    const { detailLoading, detailPagination, filters, params } = this.state;
    const { AppState, LDAPStore, intl } = this.props;
    const detailRecord = LDAPStore.getDetailRecord;
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.failed.uuid`} />,
      dataIndex: 'uuid',
      key: 'uuid',
      filters: [],
      filteredValue: filters.uuid || [],
    }, {
      title: <FormattedMessage id={`${intlPrefix}.failed.loginname`} />,
      dataIndex: 'loginName',
      key: 'loginName',
      filters: [],
      filteredValue: filters.loginName || [],
    }, {
      title: <FormattedMessage id={`${intlPrefix}.failed.realname`} />,
      dataIndex: 'realName',
      key: 'realName',
      filters: [],
      filteredValue: filters.realName || [],
    }, {
      title: <FormattedMessage id={`${intlPrefix}.failed.email`} />,
      dataIndex: 'email',
      key: 'email',
      filters: [],
      filteredValue: filters.email || [],
    }, {
      title: <FormattedMessage id={`${intlPrefix}.failed.reason`} />,
      dataIndex: 'cause',
      key: 'cause',
    }];
    return (
      <Content
        className="sidebar-content"
        code={`${intlPrefix}.detail`}
      >
        <Table
          loading={detailLoading}
          columns={columns}
          filters={params}
          dataSource={detailRecord}
          pagination={detailPagination}
          onChange={this.handleDetailPageChange}
          rowKey="id"
          filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
        />
      </Content>
    );
  }


  render() {
    const { AppState, LDAPStore } = this.props;
    const syncRecord = LDAPStore.getSyncRecord;
    const { loading, pagination, isShowSidebar } = this.state;
    const organizationName = AppState.menuType.name;
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.sync.time`} />,
      dataIndex: 'syncBeginTime',
      key: 'syncBeginTime',
      width: '25%',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.success.count`} />,
      dataIndex: 'newUserCount',
      key: 'newUserCount',
      width: '20%',
      render: (text, { errorUserCount, updateUserCount }) => {
        if (text !== null && errorUserCount !== null && updateUserCount !== null) {
          const totalCount = text + errorUserCount + updateUserCount;
          const successCount = text + updateUserCount;
          return `${successCount}/${totalCount}`;
        } else {
          return 'null';
        }
      },
    }, {
      title: <FormattedMessage id={`${intlPrefix}.failed.count`} />,
      dataIndex: 'errorUserCount',
      key: 'errorUserCount',
      width: '20%',
      render: text => (text !== null ? text : 'null'),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.spend`} />,
      key: 'spendTime',
      render: (text, { syncBeginTime, syncEndTime, errorUserCount }) => {
        if (errorUserCount !== null) {
          return this.renderSpendTime(syncBeginTime, syncEndTime);
        } else {
          return '同步任务异常';
        }
      },
    }, {
      title: '',
      key: 'action',
      align: 'right',
      render: (text, record) =>
        (record.errorUserCount ? (
          <div>
            <Permission service={['iam-service.ldap.pagingQueryErrorUsers']}>
              <Tooltip
                title={<FormattedMessage id={`${intlPrefix}.detail`} />}
                placement="bottom"
              >
                <Button
                  size="small"
                  icon="find_in_page"
                  shape="circle"
                  onClick={this.handleOpenSidebar.bind(this, record.id)}
                />
              </Tooltip>
            </Permission>
          </div>
        ) : ''),
    }];

    return (
      <Page
        service={[
          'iam-service.ldap.pagingQueryHistories',
          'iam-service.ldap.pagingQueryErrorUsers',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
          backPath={this.getBackPath()}
        >
          <Button
            icon="refresh"
            onClick={this.handleRefresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: organizationName }}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={syncRecord}
            pagination={pagination}
            onChange={this.handlePageChange}
            rowKey="id"
            filterBar={false}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.failed.header.title`} />}
            visible={isShowSidebar}
            onOk={this.handleSubmit}
            okText={<FormattedMessage id="close" />}
            okCancel={false}
          >
            {this.renderDetailContent()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

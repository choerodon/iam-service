import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Tooltip, Input, Popover, Icon } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { axios, Content, Header, Page, Permission, Action } from 'choerodon-boot-combine';
import { withRouter } from 'react-router-dom';
import ExecutionRecordStore from '../../../stores/global/execution-record';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import { handleFiltersParams } from '../../../common/util';

const intlPrefix = 'execution';
const tablePrefix = 'taskdetail';

// 公用方法类
class ExecutionRecordType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    let codePrefix;
    switch (type) {
      case 'organization':
        codePrefix = 'organization';
        break;
      case 'project':
        codePrefix = 'project';
        break;
      case 'site':
        codePrefix = 'global';
        break;
      default:
        break;
    }
    this.code = `${codePrefix}.execution`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.type = type;
    this.id = id; // 项目或组织id
    this.name = name; // 项目或组织名称
  }
}

@withRouter
@injectIntl
@inject('AppState')
export default class ExecutionRecord extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      loading: true,
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
    };
  }

  componentWillMount() {
    this.initExecutionRecord();
    this.loadExecutionRecord();
  }

  initExecutionRecord() {
    this.executionRecord = new ExecutionRecordType(this);
  }

  loadExecutionRecord(paginationIn, filtersIn, sortIn, paramsIn) {
    const { type, id } = this.executionRecord;
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
    // 防止标签闪烁
    this.setState({ filters, loading: true });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      ExecutionRecordStore.setData([]);
      this.setState({
        pagination: {
          total: 0,
        },
        loading: false,
        sort,
        params,
      });
      return;
    }
    ExecutionRecordStore.loadData(pagination, filters, sort, params, type, id).then((data) => {
      ExecutionRecordStore.setData(data.content);
      this.setState({
        pagination: {
          current: data.number + 1,
          pageSize: data.size,
          total: data.totalElements,
        },
        loading: false,
        sort,
        params,
      });
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      this.setState({
        loading: false,
      });
    });
  }

  handlePageChange = (pagination, filters, sort, params) => {
    this.loadExecutionRecord(pagination, filters, sort, params);
  };

  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadExecutionRecord();
    });
  };

  render() {
    const { intl, AppState } = this.props;
    const { filters, params, pagination, loading } = this.state;
    const { code, values } = this.executionRecord;
    const recordData = ExecutionRecordStore.getData.slice();
    const columns = [{
      title: <FormattedMessage id="status" />,
      dataIndex: 'status',
      key: 'status',
      filters: [{
        value: 'RUNNING',
        text: '进行中',
      }, {
        value: 'FAILED',
        text: '失败',
      }, {
        value: 'COMPLETED',
        text: '完成',
      }],
      filteredValue: filters.status || [],
      render: text => (<StatusTag name={intl.formatMessage({ id: text.toLowerCase() })} colorCode={text} />),
    }, {
      title: <FormattedMessage id="name" />,
      dataIndex: 'taskName',
      key: 'taskName',
      width: '11%',
      filters: [],
      filteredValue: filters.taskName || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.failed.reason`} />,
      dataIndex: 'exceptionMessage',
      key: 'exceptionMessage',
      width: '11%',
      filters: [],
      filteredValue: filters.exceptionMessage || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${tablePrefix}.last.execution.time`} />,
      dataIndex: 'actualLastTime',
      key: 'actualLastTime',
    }, {
      title: <FormattedMessage id={`${tablePrefix}.plan.execution.time`} />,
      dataIndex: 'plannedStartTime',
      key: 'plannedStartTime',
    }, {
      title: <FormattedMessage id={`${tablePrefix}.next.execution.time`} />,
      dataIndex: 'plannedNextTime',
      key: 'plannedNextTime',
    }, {
      title: <FormattedMessage id={`${tablePrefix}.actual.execution.time`} />,
      dataIndex: 'actualStartTime',
      key: 'actualStartTime',
    }];
    return (
      <Page
        service={[
          'asgard-service.schedule-task-instance-site.pagingQuery',
          'asgard-service.schedule-task-instance-org.pagingQuery',
          'asgard-service.schedule-task-instance-project.pagingQuery',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Button
            icon="refresh"
            onClick={this.handleRefresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={code}
          values={{ name: `${values.name || 'Choerodon'}` }}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={recordData}
            pagination={pagination}
            filters={params}
            onChange={this.handlePageChange}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
        </Content>
      </Page>
    );
  }
}

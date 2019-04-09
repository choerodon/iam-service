import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Tooltip, Modal, Icon } from 'choerodon-ui';
import { Content, Header, Page } from 'choerodon-boot-combine';
import { injectIntl, FormattedMessage } from 'react-intl';
import SagaImg from '../saga/SagaImg';
import SagaInstanceStore from '../../../stores/global/saga-instance/SagaInstanceStore';
import './style/saga-instance.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import InstanceExpandRow from './InstanceExpandRow';
import StatusTag from '../../../components/statusTag';
import { handleFiltersParams } from '../../../common/util';

const intlPrefix = 'global.saga-instance';
const { Sidebar } = Modal;

class SagaInstanceType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    let apiGetway = `/asgard/v1/sagas/${type}s/${id}/`;
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
        apiGetway = '/asgard/v1/sagas/';
        break;
      default:
        break;
    }
    this.code = `${codePrefix}.saga-instance`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.roleId = id || 0;
    this.apiGetway = apiGetway;
  }
}

@injectIntl
@inject('AppState')
@observer
export default class SagaInstance extends Component {
  state = this.getInitState();

  componentWillMount() {
    this.sagaInstanceType = new SagaInstanceType(this);
    this.reload();
  }

  getInitState() {
    return {
      data: '',
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
      activeTab: 'instance',
    };
  }

  handleStatusClick = (status) => {
    const { pagination, filters, sort, params, activeTab } = this.state;
    const newFilters = filters;
    newFilters.status = [status];
    this.reload(pagination, newFilters, sort, params, activeTab);
  };

  reload = (paginationIn, filtersIn, sortIn, paramsIn, type) => {
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
      SagaInstanceStore.setData([]);
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
    SagaInstanceStore.loadData(pagination, filters, sort, params, this.sagaInstanceType, type).then((data) => {
      if (type === 'task') {
        SagaInstanceStore.setTaskData(data.content);
      } else {
        SagaInstanceStore.setData(data.content);
      }
      SagaInstanceStore.loadStatistics();
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
    });
  }

  tableChange = (pagination, filters, sort, params, type) => {
    this.reload(pagination, filters, sort, params, type);
  }

  loadTaskData = () => {
    const { activeTab } = this.state;
    if (activeTab === 'task') {
      return;
    }
    this.setState({
      ...this.getInitState(),
      activeTab: 'task',
    }, () => {
      this.reload(null, null, null, null, 'task');
    });
  }

  loadAllData = () => {
    const { activeTab } = this.state;
    if (activeTab === 'instance') {
      return;
    }
    this.refresh();
  }

  openSidebar = (id) => {
    SagaInstanceStore.loadDetailData(id).then((data) => {
      this.setState({
        data,
      }, () => {
        this.setState({
          visible: true,
        });
      });
    });
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  refresh = () => {
    this.setState(this.getInitState(), () => {
      this.reload();
    });
  }

  renderTaskTable() {
    const { intl } = this.props;
    const { filters, activeTab } = this.state;
    const dataSource = SagaInstanceStore.getTaskData;
    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.status`} />,
        key: 'status',
        dataIndex: 'status',
        width: '130px',
        render: status => (
          <StatusTag
            mode="icon"
            name={intl.formatMessage({ id: status.toLowerCase() })}
            colorCode={status === 'WAIT_TO_BE_PULLED' ? 'QUEUE' : status}
          />
        ),
        filters: [{
          value: 'RUNNING',
          text: '运行中',
        }, {
          value: 'FAILED',
          text: '失败',
        }, {
          value: 'COMPLETED' || 'NON_CONSUMER',
          text: '完成',
        }, {
          value: 'WAIT_TO_BE_PULLED',
          text: '等待被拉取',
        }],
        filteredValue: filters.status || [],
      },
      {
        title: <FormattedMessage id="global.saga.task.code" />,
        key: 'taskInstanceCode',
        dataIndex: 'taskInstanceCode',
        filters: [],
        filteredValue: filters.taskInstanceCode || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="global.saga-instance.saga" />,
        key: 'sagaInstanceCode',
        dataIndex: 'sagaInstanceCode',
        filters: [],
        filteredValue: filters.sagaInstanceCode || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="description" />,
        key: 'description',
        dataIndex: 'description',
        // filters: [],
        // filteredValue: filters.description || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="global.saga.task.actualstarttime" />,
        key: 'plannedStartTime',
        dataIndex: 'plannedStartTime',
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="global.saga.task.actualendtime" />,
        key: 'actualEndTime',
        dataIndex: 'actualEndTime',
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="saga-instance.task.retry-count" />,
        width: '85px',
        render: record => `${record.retriedCount}/${record.maxRetryCount}`,
      },
      {
        title: '',
        width: '50px',
        key: 'action',
        align: 'right',
        render: (text, record) => (
          <div>
            <Tooltip
              title={<FormattedMessage id="detail" />}
              placement="bottom"
            >
              <Button
                icon="find_in_page"
                size="small"
                shape="circle"
                onClick={this.openSidebar.bind(this, record.sagaInstanceId)}
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <Table
        className="c7n-saga-instance-table"
        loading={this.state.loading}
        pagination={this.state.pagination}
        columns={columns}
        dataSource={dataSource}
        filters={this.state.params}
        onChange={(pagination, filter, sort, params) => this.tableChange(pagination, filter, sort, params, 'task')}
        filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
      />
    );
  }

  renderTable() {
    const { intl } = this.props;
    const { filters } = this.state;
    const dataSource = SagaInstanceStore.getData;
    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.status`} />,
        key: 'status',
        dataIndex: 'status',
        render: status => (<StatusTag mode="icon" name={intl.formatMessage({ id: status.toLowerCase() })} colorCode={status} />),
        filters: [{
          value: 'RUNNING',
          text: '运行中',
        }, {
          value: 'FAILED',
          text: '失败',
        }, {
          value: 'COMPLETED' || 'NON_CONSUMER',
          text: '完成',
        }],
        filteredValue: filters.status || [],
      },
      {
        title: <FormattedMessage id={'saga-instance.saga.instance'} />,
        key: 'sagaCode',
        width: '25%',
        dataIndex: 'sagaCode',
        filters: [],
        filteredValue: filters.sagaCode || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.2}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.start.time`} />,
        key: 'startTime',
        dataIndex: 'startTime',
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.reftype`} />,
        key: 'refType',
        dataIndex: 'refType',
        filters: [],
        filteredValue: filters.refType || [],
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.refid`} />,
        key: 'refId',
        width: 150,
        dataIndex: 'refId',
        className: 'c7n-saga-instance-refid',
        filters: [],
        filteredValue: filters.refId || [],
      },
      {
        title: '',
        width: '50px',
        key: 'action',
        align: 'right',
        render: (text, record) => (
          <div>
            <Tooltip
              title={<FormattedMessage id="detail" />}
              placement="bottom"
            >
              <Button
                icon="find_in_page"
                size="small"
                shape="circle"
                onClick={this.openSidebar.bind(this, record.id)}
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <Table
        className="c7n-saga-instance-table"
        loading={this.state.loading}
        pagination={this.state.pagination}
        columns={columns}
        indentSize={0}
        dataSource={dataSource}
        filters={this.state.params}
        expandedRowRender={record => <InstanceExpandRow apiGateWay={this.sagaInstanceType.apiGetway} record={record} expand={this.openSidebar.bind(this, record.id)} />}
        rowKey="id"
        onChange={this.tableChange}
        filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
      />
    );
  }

  render() {
    const { data, activeTab } = this.state;
    const { AppState, intl: { formatMessage } } = this.props;
    const istStatusType = ['COMPLETED', 'RUNNING', 'FAILED'];
    return (
      <Page
        className="c7n-saga-instance"
        service={[
          'asgard-service.saga-instance.pagingQuery',
          'asgard-service.saga-instance.query',
          'asgard-service.saga-instance.statistics',
          'asgard-service.saga-instance.queryDetails',
          'asgard-service.saga-instance-org.pagingQuery',
          'asgard-service.saga-instance-org.statistics',
          'asgard-service.saga-instance-org.query',
          'asgard-service.saga-instance-org.queryDetails',
          'asgard-service.saga-instance-project.pagingQuery',
          'asgard-service.saga-instance-project.statistics',
          'asgard-service.saga-instance-project.query',
          'asgard-service.saga-instance-project.queryDetails',
        ]}
      >
        <Header title={<FormattedMessage id={`${this.sagaInstanceType.code}.header.title`} />}>
          <Button
            icon="refresh"
            onClick={this.refresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className="c7n-saga-status-wrap">
            <div style={{ width: 512 }}>
              <h2 className="c7n-space-first">
                <FormattedMessage
                  id={`${this.sagaInstanceType.code}.title`}
                  values={this.sagaInstanceType.values}
                />
              </h2>
              <p>
                <FormattedMessage
                  id={`${this.sagaInstanceType.code}.description`}
                />
                <a href={formatMessage({ id: `${this.sagaInstanceType.code}.link` })} rel="nofollow me noopener noreferrer" target="_blank" className="c7n-external-link">
                  <span className="c7n-external-link-content">
                    <FormattedMessage id="learnmore" />
                  </span>
                  <i className="icon icon-open_in_new c7n-iam-link-icon" />
                </a>
              </p>
            </div>
            <div className="c7n-saga-status-content">
              {null}
              <div>
                <div className="c7n-saga-status-text"><FormattedMessage id="saga-instance.overview" /></div>
                <div className="c7n-saga-status-wrap">
                  {istStatusType.map(item => (<div onClick={() => this.handleStatusClick(item)} key={item.toLowerCase()} className={`c7n-saga-status-num c7n-saga-status-${item.toLowerCase()}`}>
                    <div>{SagaInstanceStore.getStatistics[item] || 0}</div>
                    <div><FormattedMessage id={item.toLowerCase()} /></div>
                  </div>))}
                </div>
              </div>
            </div>
          </div>
          <div className="c7n-saga-instance-btns">
            <span className="text">
              <FormattedMessage id={`${intlPrefix}.view`} />：
            </span>
            <Button
              onClick={this.loadAllData}
              className={activeTab === 'instance' && 'active'}
              type="primary"
            ><FormattedMessage id={`${intlPrefix}.instance`} /></Button>
            <Button
              className={activeTab === 'task' && 'active'}
              onClick={this.loadTaskData}
              type="primary"
            ><FormattedMessage id={`${intlPrefix}.task`} /></Button>
          </div>
          {activeTab === 'instance' ? this.renderTable() : this.renderTaskTable()}
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.detail`} />}
            onOk={this.handleOk}
            okText={<FormattedMessage id="close" />}
            okCancel={false}
            className="c7n-saga-instance-sidebar"
            visible={this.state.visible}
            destroyOnClose
          >
            <Content
              className="sidebar-content"
              code={`${intlPrefix}.detail`}
              values={{ name: data.id }}
            >
              <SagaImg data={data} instance />
            </Content>
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

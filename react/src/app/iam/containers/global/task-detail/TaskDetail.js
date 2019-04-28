import React, { Component } from 'react';
import { observable, action, configure } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, Table, Tooltip, Modal, Tabs, Col, Row } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page, Permission } from 'choerodon-boot-combine';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import TaskDetailStore from '../../../stores/global/task-detail';
import StatusTag from '../../../components/statusTag';
import './TaskDetail.scss';
import '../../../common/ConfirmModal.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import { handleFiltersParams } from '../../../common/util';

const intlPrefix = 'taskdetail';
const { Sidebar } = Modal;
const { TabPane } = Tabs;

// 公用方法类
class TaskDetailType {
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
    this.code = `${codePrefix}.taskdetail`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.type = type;
    this.id = id; // 项目或组织id
    this.name = name; // 项目或组织名称
  }
}

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class TaskDetail extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      tempTaskId: null,
      isShowSidebar: false,
      isSubmitting: false,
      selectType: 'detail',
      loading: true,
      logLoading: true,
      showLog: false,
      currentRecord: {},
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
      logPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      logSort: {
        columnKey: 'id',
        order: 'descend',
      },
      logFilters: {},
      logParams: [],
      paramsData: [], // 参数列表的数据
      paramsLoading: false, // 创建任务参数列表Loading
    };
  }

  componentWillMount() {
    this.initTaskDetail();
    this.loadTaskDetail();
  }

  componentWillUnmount() {
    TaskDetailStore.setData([]);
  }

  initTaskDetail() {
    this.taskdetail = new TaskDetailType(this);
  }

  loadTaskDetail(paginationIn, filtersIn, sortIn, paramsIn) {
    const { type, id } = this.taskdetail;
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
      TaskDetailStore.setData([]);
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

    TaskDetailStore.loadData(pagination, filters, sort, params, type, id).then((data) => {
      TaskDetailStore.setData(data.list || []);
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
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      this.setState({
        loading: false,
      });
    });
  }

  handlePageChange = (pagination, filters, sort, params) => {
    this.loadTaskDetail(pagination, filters, sort, params);
  };

  /**
   * 任务信息
   * @param id 任务ID
   */
  loadInfo = (taskId) => {
    const { type, id } = this.taskdetail;
    TaskDetailStore.loadInfo(taskId, type, id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        TaskDetailStore.setInfo(data);
        this.setState({
          isShowSidebar: true,
        });
      }
    });
  }

  // 任务日志列表
  loadLog(paginationIn, filtersIn, sortIn, paramsIn) {
    const { type, id } = this.taskdetail;
    const {
      logPagination: paginationState,
      logSort: sortState,
      logFilters: filtersState,
      logParams: paramsState,
    } = this.state;
    const logPagination = paginationIn || paginationState;
    const logSort = sortIn || sortState;
    const logFilters = filtersIn || filtersState;
    const logParams = paramsIn || paramsState;
    // 防止标签闪烁
    this.setState({ logFilters, logLoading: true });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(logParams, logFilters);
    if (isIncludeSpecialCode) {
      TaskDetailStore.setLog([]);
      this.setState({
        logPagination: {
          total: 0,
        },
        logLoading: false,
        logSort,
        logParams,
        tempTaskId: TaskDetailStore.currentTask.id,
      });
      return;
    }

    TaskDetailStore.loadLogData(logPagination, logFilters, logSort, logParams, TaskDetailStore.currentTask.id, type, id).then((data) => {
      TaskDetailStore.setLog(data.list || []);
      this.setState({
        logPagination: {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        },
        logLoading: false,
        logSort,
        logParams,
        tempTaskId: TaskDetailStore.currentTask.id,
      });
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      this.setState({
        logLoading: false,
      });
    });
  }

  handleLogPageChange = (pagination, filters, sort, params) => {
    this.loadLog(pagination, filters, sort, params);
  }


  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadTaskDetail();
    });
  };

  /**
   * 渲染任务明细列表启停用按钮
   * @param record 表格行数据
   * @returns {*}
   */
  showActionButton(record) {
    const { enableService, disableService } = this.getPermission();
    if (record.status === 'ENABLE') {
      return (
        <Permission service={disableService}>
          <Tooltip
            title={<FormattedMessage id="disable" />}
            placement="bottom"
          >
            <Button
              size="small"
              icon="remove_circle_outline"
              shape="circle"
              onClick={this.handleAble.bind(this, record)}
            />
          </Tooltip>
        </Permission>
      );
    } else if (record.status === 'DISABLE') {
      return (
        <Permission service={enableService}>
          <Tooltip
            title={<FormattedMessage id="enable" />}
            placement="bottom"
          >
            <Button
              size="small"
              icon="finished"
              shape="circle"
              onClick={this.handleAble.bind(this, record)}
            />
          </Tooltip>
        </Permission>
      );
    } else {
      return (
        <Button
          disabled
          size="small"
          icon="finished"
          shape="circle"
        />
      );
    }
  }

  /**
   * 启停用任务
   * @param record 表格行数据
   */
  handleAble = (record) => {
    const { id, objectVersionNumber } = record;
    const { intl } = this.props;
    const status = record.status === 'ENABLE' ? 'disable' : 'enable';
    TaskDetailStore.ableTask(id, objectVersionNumber, status, this.taskdetail.type, this.taskdetail.id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        Choerodon.prompt(intl.formatMessage({ id: `${status}.success` }));
        this.loadTaskDetail();
      }
    }).catch(() => {
      Choerodon.prompt(intl.formatMessage({ id: `${status}.error` }));
    });
  }

  /**
   * 删除任务
   * @param record 表格行数据
   */
  handleDelete = (record) => {
    const { intl } = this.props;
    const { type, id } = this.taskdetail;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.delete.content` }, { name: record.name }),
      onOk: () => TaskDetailStore.deleteTask(record.id, type, id).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
          this.loadTaskDetail();
        }
      }).catch(() => {
        Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
      }),
    });
  }


  createTask() {
    const { type, id, name } = this.taskdetail;
    const { currentMenuType } = this.props.AppState;
    let organizationId;
    if (currentMenuType.type === 'project') {
      organizationId = currentMenuType.organizationId;
    }
    let createUrl;
    switch (type) {
      case 'organization':
        createUrl = `/iam/task-detail/create?type=${type}&id=${id}&name=${name}&organizationId=${id}`;
        break;
      case 'project':
        createUrl = `/iam/task-detail/create?type=${type}&id=${id}&name=${name}&organizationId=${organizationId}`;
        break;
      case 'site':
        createUrl = '/iam/task-detail/create';
        break;
      default:
        break;
    }
    this.props.history.push(createUrl);
  }


  /**
   * 开启侧边栏
   * @param selectType create/detail
   * @param record 列表行数据
   */
  handleOpen = (selectType, record = {}) => {
    if (selectType === 'detail') {
      this.setState({
        selectType,
        showLog: false,
        logPagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        logSort: {
          columnKey: 'id',
          order: 'descend',
        },
        logFilters: {},
        logParams: [],
      });
      this.loadInfo(record.id);
      TaskDetailStore.setCurrentTask(record);
    }
  }


  // 关闭侧边栏
  handleCancel = () => {
    this.setState({
      isShowSidebar: false,
    });
  }

  // 任务详情提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isShowSidebar: false,
      tempTaskId: null,
    }, () => {
      TaskDetailStore.setLog([]);
    });
  }


  /**
   * 侧边栏tab切换
   * @param showLog
   */
  handleTabChange = (showLog) => {
    if (showLog === 'log') {
      if (!this.state.tempTaskId) {
        this.loadLog();
      }
    }
    this.setState({
      showLog: showLog === 'log',
    });
  }


  // 渲染侧边栏成功按钮文字
  renderSidebarOkText() {
    const { selectType } = this.state;
    if (selectType === 'create') {
      return <FormattedMessage id="create" />;
    } else {
      return <FormattedMessage id="close" />;
    }
  }

  /**
   * 获取当前层级名称
   * @returns {*}
   */
  getLevelName = () => {
    const { intl } = this.props;
    let level;
    switch (this.taskdetail.type) {
      case 'site':
        level = intl.formatMessage({ id: `${intlPrefix}.site` });
        break;
      case 'organization':
        level = intl.formatMessage({ id: `${intlPrefix}.organization` });
        break;
      case 'project':
        level = intl.formatMessage({ id: `${intlPrefix}.project` });
        break;
      default:
        break;
    }
    return level;
  }

  // 渲染任务详情
  renderDetailContent() {
    const { intl: { formatMessage } } = this.props;
    const level = this.getLevelName();
    const { showLog, logFilters, logParams, logPagination, logLoading } = this.state;
    const info = TaskDetailStore.info;
    let unit;
    switch (info.simpleRepeatIntervalUnit) {
      case 'SECONDS':
        unit = '秒';
        break;
      case 'MINUTES':
        unit = '分钟';
        break;
      case 'HOURS':
        unit = '小时';
        break;
      case 'DAYS':
        unit = '天';
        break;
      default:
        break;
    }
    const infoList = [{
      key: formatMessage({ id: `${intlPrefix}.task.name` }),
      value: info.name,
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.description` }),
      value: info.description,
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.start.time` }),
      value: info.startTime,
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.end.time` }),
      value: info.endTime,
    }, {
      key: formatMessage({ id: `${intlPrefix}.trigger.type` }),
      value: info.triggerType === 'simple-trigger' ? formatMessage({ id: `${intlPrefix}.easy.task` }) : formatMessage({ id: `${intlPrefix}.cron.task` }),
    }, {
      key: formatMessage({ id: `${intlPrefix}.cron.expression` }),
      value: info.cronExpression,
    }, {
      key: formatMessage({ id: `${intlPrefix}.repeat.interval` }),
      value: info.triggerType === 'simple-trigger' ? `${info.simpleRepeatInterval}${unit}` : null,
    }, {
      key: formatMessage({ id: `${intlPrefix}.repeat.time` }),
      value: info.simpleRepeatCount,
    }, {
      key: formatMessage({ id: `${intlPrefix}.last.execution.time` }),
      value: info.lastExecTime,
    }, {
      key: formatMessage({ id: `${intlPrefix}.next.execution.time` }),
      value: info.nextExecTime,
    }, {
      key: formatMessage({ id: `${intlPrefix}.service.name` }),
      value: info.serviceName,
    }, {
      key: formatMessage({ id: `${intlPrefix}.execute-strategy` }),
      value: info.executeStrategy && formatMessage({ id: `${intlPrefix}.${info.executeStrategy.toLowerCase()}` }),
    }, {
      key: formatMessage({ id: `${intlPrefix}.task.class.name` }),
      value: info.methodDescription,
    }, {
      key: formatMessage({ id: `${intlPrefix}.params.data` }),
      value: '',
    }];

    const paramColumns = [{
      title: <FormattedMessage id={`${intlPrefix}.params.name`} />,
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      render: text => (
        <MouseOverWrapper text={text} width={0.4}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.params.value`} />,
      dataIndex: 'value',
      key: 'value',
      width: '50%',
      render: text => (
        <MouseOverWrapper text={text} width={0.4}>
          {text}
        </MouseOverWrapper>
      ),
    }];

    const logColumns = [{
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
      filteredValue: logFilters.status || [],
      render: text => (<StatusTag name={formatMessage({ id: text.toLowerCase() })} colorCode={text} />),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.instance.id`} />,
      dataIndex: 'serviceInstanceId',
      key: 'serviceInstanceId',
      filters: [],
      filteredValue: logFilters.serviceInstanceId || [],
    }, {
      title: <FormattedMessage id={`${intlPrefix}.plan.execution.time`} />,
      dataIndex: 'plannedStartTime',
      key: 'plannedStartTime',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.actual.execution.time`} />,
      dataIndex: 'actualStartTime',
      key: 'actualStartTime',
    }];

    return (
      <Content
        className="sidebar-content"
        code={`${this.taskdetail.code}.detail`}
        values={{ name: info.name }}
      >
        <Tabs activeKey={showLog ? 'log' : 'info'} onChange={this.handleTabChange}>
          <TabPane tab={<FormattedMessage id={`${intlPrefix}.task.info`} />} key="info" />
          <TabPane tab={<FormattedMessage id={`${intlPrefix}.task.log`} />} key="log" />
        </Tabs>
        {!showLog
          ? (<div>
            {
              infoList.map(({ key, value }) =>
                <Row key={key} className={classnames('c7n-task-detail-row', { 'c7n-task-detail-row-hide': value === null })}>
                  <Col span={3}>{key}:</Col>
                  <Col span={21}>{value}</Col>
                </Row>,
              )
            }
            <Table
              columns={paramColumns}
              style={{ width: '512px', marginBottom: '12px' }}
              pagination={false}
              filterBar={false}
              dataSource={info.params}
              rowKey="name"
            />
            <Row className={classnames({ 'c7n-task-detail-row': !info.notifyUser })}>
              <Col span={3}>{formatMessage({ id: `${intlPrefix}.inform.person` })}:</Col>
              <Col span={21}>
                {
                  info.notifyUser ? (<ul style={{ paddingLeft: '0' }}>
                    <li className={classnames('c7n-task-detail-row-inform-person', { 'c7n-task-detail-row-hide': !info.notifyUser.creator })}>
                      {formatMessage({ id: `${intlPrefix}.creator` })}:
                      <span style={{ marginLeft: '10px' }}>{info.notifyUser.creator ? info.notifyUser.creator.loginName : null}{info.notifyUser.creator ? info.notifyUser.creator.realName : null}</span>
                    </li>
                    <li className={classnames('c7n-task-detail-row-inform-person', { 'c7n-task-detail-row-hide': !info.notifyUser.administrator })}>
                      {level}{formatMessage({ id: `${intlPrefix}.manager` })}
                    </li>
                    <li className={classnames('c7n-task-detail-row-inform-person', { 'c7n-task-detail-row-hide': !info.notifyUser.assigner.length })}>
                      {formatMessage({ id: `${intlPrefix}.user` })}:
                      {info.notifyUser.assigner.length ? (
                        <div className={'c7n-task-detail-row-inform-person-informlist-name-container'}>{
                          info.notifyUser.assigner.map(item => (
                            <div key={item.loginName}>
                              <span>{item.loginName}{item.realName}</span>
                              <span>、</span>
                            </div>
                          ))
                        }</div>
                      ) : <div>{formatMessage({ id: `${intlPrefix}.empty` })}</div>}
                    </li>
                  </ul>) : (
                    <Col span={21} className={'c7n-task-detail-row-inform-person-empty'}>{formatMessage({ id: `${intlPrefix}.empty` })}</Col>
                  )
                }
              </Col>
            </Row>
          </div>)
          : (<Table
            loading={logLoading}
            columns={logColumns}
            filters={logParams}
            pagination={logPagination}
            dataSource={TaskDetailStore.getLog.slice()}
            onChange={this.handleLogPageChange}
            rowKey="id"
            filterBarPlaceholder={formatMessage({ id: 'filtertable' })}
          />)
        }
      </Content>
    );
  }

  // 页面权限
  getPermission() {
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    let createService = ['asgard-service.schedule-task-site.create'];
    let enableService = ['asgard-service.schedule-task-site.enable'];
    let disableService = ['asgard-service.schedule-task-site.disable'];
    let deleteService = ['asgard-service.schedule-task-site.delete'];
    let detailService = ['asgard-service.schedule-task-site.getTaskDetail'];
    if (type === 'organization') {
      createService = ['asgard-service.schedule-task-org.create'];
      enableService = ['asgard-service.schedule-task-org.enable'];
      disableService = ['asgard-service.schedule-task-org.disable'];
      deleteService = ['asgard-service.schedule-task-org.delete'];
      detailService = ['asgard-service.schedule-task-org.getTaskDetail'];
    } else if (type === 'project') {
      createService = ['asgard-service.schedule-task-project.create'];
      enableService = ['asgard-service.schedule-task-project.enable'];
      disableService = ['asgard-service.schedule-task-project.disable'];
      deleteService = ['asgard-service.schedule-task-project.delete'];
      detailService = ['asgard-service.schedule-task-project.getTaskDetail'];
    }
    return {
      createService,
      enableService,
      disableService,
      deleteService,
      detailService,
    };
  }

  render() {
    const { intl, AppState } = this.props;
    const { deleteService, detailService } = this.getPermission();
    const { filters, params, pagination, loading, isShowSidebar, selectType, isSubmitting } = this.state;
    const { createService } = this.getPermission();
    const TaskData = TaskDetailStore.getData.slice();
    const columns = [{
      title: <FormattedMessage id="name" />,
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      filters: [],
      filteredValue: filters.name || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="description" />,
      width: '20%',
      dataIndex: 'description',
      key: 'description',
      filters: [],
      filteredValue: filters.description || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.last.execution.time`} />,
      dataIndex: 'lastExecTime',
      key: 'lastExecTime',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.next.execution.time`} />,
      dataIndex: 'nextExecTime',
      key: 'nextExecTime',
    }, {
      title: <FormattedMessage id="status" />,
      dataIndex: 'status',
      key: 'status',
      filters: [{
        value: 'ENABLE',
        text: intl.formatMessage({ id: 'enable' }),
      }, {
        value: 'DISABLE',
        text: intl.formatMessage({ id: 'disable' }),
      }, {
        value: 'FINISHED',
        text: intl.formatMessage({ id: 'finished' }),
      }],
      filteredValue: filters.status || [],
      render: status => (<StatusTag mode="icon" name={intl.formatMessage({ id: status.toLowerCase() })} colorCode={status} />),
    }, {
      title: '',
      key: 'action',
      align: 'right',
      width: '130px',
      render: (text, record) => (
        <div>
          <Permission service={detailService}>
            <Tooltip
              title={<FormattedMessage id="detail" />}
              placement="bottom"
            >
              <Button
                size="small"
                icon="find_in_page"
                shape="circle"
                onClick={this.handleOpen.bind(this, 'detail', record)}
              />
            </Tooltip>
          </Permission>
          {this.showActionButton(record)}
          <Permission service={deleteService}>
            <Tooltip
              title={<FormattedMessage id="delete" />}
              placement="bottom"
            >
              <Button
                size="small"
                icon="delete_forever"
                shape="circle"
                onClick={this.handleDelete.bind(this, record)}
              />
            </Tooltip>
          </Permission>
        </div>
      ),
    }];
    return (
      <Page
        service={[
          'asgard-service.schedule-task-site.pagingQuery',
          'asgard-service.schedule-task-org.pagingQuery',
          'asgard-service.schedule-task-project.pagingQuery',
          'asgard-service.schedule-task-site.create',
          'asgard-service.schedule-task-org.create',
          'asgard-service.schedule-task-project.create',
          'asgard-service.schedule-task-site.enable',
          'asgard-service.schedule-task-org.enable',
          'asgard-service.schedule-task-project.enable',
          'asgard-service.schedule-task-site.disable',
          'asgard-service.schedule-task-org.disable',
          'asgard-service.schedule-task-project.disable',
          'asgard-service.schedule-task-site.delete',
          'asgard-service.schedule-task-org.delete',
          'asgard-service.schedule-task-project.delete',
          'asgard-service.schedule-task-site.getTaskDetail',
          'asgard-service.schedule-task-org.getTaskDetail',
          'asgard-service.schedule-task-project.getTaskDetail',
          'asgard-service.schedule-task-instance-site.pagingQueryByTaskId',
          'asgard-service.schedule-task-instance-org.pagingQueryByTaskId',
          'asgard-service.schedule-task-instance-project.pagingQueryByTaskId',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Permission service={createService}>
            <Button
              icon="playlist_add"
              onClick={this.createTask.bind(this)}
            >
              <FormattedMessage id={`${intlPrefix}.create`} />
            </Button>
          </Permission>
          <Button
            icon="refresh"
            onClick={this.handleRefresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={this.taskdetail.code}
          values={{ name: `${this.taskdetail.values.name || 'Choerodon'}` }}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={TaskData}
            pagination={pagination}
            filters={params}
            onChange={this.handlePageChange}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.${selectType}.header.title`} />}
            visible={isShowSidebar}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            okText={this.renderSidebarOkText()}
            okCancel={selectType !== 'detail'}
            confirmLoading={isSubmitting}
            className="c7n-task-detail-sidebar"
          >
            {this.renderDetailContent()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

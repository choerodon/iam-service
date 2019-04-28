import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Select, Table, Tooltip, Modal, Form, Input, Popover, Icon, Tabs } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { axios, Content, Header, Page, Permission, Action } from 'choerodon-boot-combine';
import { withRouter } from 'react-router-dom';
import ExecutableProgramStore from '../../../stores/global/executable-program';
import jsonFormat from '../../../common/json-format';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import './ExecutableProgram.scss';
import { handleFiltersParams } from '../../../common/util';

const { Sidebar } = Modal;
const { TabPane } = Tabs;
const intlPrefix = 'executable.program';

// 公用方法类
class ExecutableProgramType {
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
    this.code = `${codePrefix}.executable.program`;
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

export default class ExecutableProgram extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      isShowSidebar: false,
      loading: true,
      classLoading: true,
      showJson: false,
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
      programName: null,
    };
  }

  componentWillMount() {
    this.initExecutableProgram();
    this.loadTaskClassName();
  }

  initExecutableProgram() {
    this.executableProgram = new ExecutableProgramType(this);
  }

  loadTaskClassName(paginationIn, filtersIn, sortIn, paramsIn) {
    const { type, id } = this.executableProgram;
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
      ExecutableProgramStore.setData([]);
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

    ExecutableProgramStore.loadData(pagination, filters, sort, params, type, id).then((data) => {
      ExecutableProgramStore.setData(data.list || []);
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
    this.loadTaskClassName(pagination, filters, sort, params);
  };

  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadTaskClassName();
    });
  };


  // 开启侧边栏
  openSidebar = (record) => {
    this.setState({
      classLoading: true,
    });
    const { type, id } = this.executableProgram;
    ExecutableProgramStore.loadProgramDetail(record.id, type, id).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
        this.setState({
          classLoading: false,
        });
      } else {
        ExecutableProgramStore.setDetail(data);
        this.setState({
          isShowSidebar: true,
          programName: record.code,
          classLoading: false,
        });
      }
    });
  };

  handleDelete = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.delete.content` }, { name: record.code }),
      onOk: () => ExecutableProgramStore.deleteExecutableProgramById(record.id).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
          this.handleRefresh();
        }
      }),
    });
  };

  // 关闭侧边栏
  handleOk = () => {
    this.setState({
      isShowSidebar: false,
    }, () => {
      this.setState({
        showJson: false,
      });
    });
  }

  /**
   * 侧边栏选项卡切换
   * @param showJson 选项卡的key
   */
  handleTabChange = (showJson) => {
    this.setState({
      showJson: showJson === 'json',
    });
  }

  // 渲染侧边栏参数列表
  renderParamsTable() {
    const { intl } = this.props;
    const classColumns = [{
      title: <FormattedMessage id={`${intlPrefix}.params.name`} />,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.params.description`} />,
      dataIndex: 'description',
      key: 'description',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.params.type`} />,
      dataIndex: 'type',
      key: 'type',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.params.default`} />,
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      render: text => <span>{`${text}`}</span>,
    }];
    return (
      <Table
        loading={this.state.classLoading}
        columns={classColumns}
        dataSource={ExecutableProgramStore.getDetail.paramsList}
        pagination={false}
        filterBar={false}
        rowKey="name"

      />
    );
  }

  render() {
    const { intl, AppState } = this.props;
    const { sort: { columnKey, order }, filters, params, pagination, loading, isShowSidebar, showJson, programName } = this.state;
    const { code, values } = this.executableProgram;
    const data = ExecutableProgramStore.getData.slice();
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      filters: [],
      filteredValue: filters.code || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.belong.service`} />,
      dataIndex: 'service',
      key: 'service',
      width: '10%',
      filters: [],
      filteredValue: filters.service || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'method',
      key: 'method',
      width: '20%',
      filters: [],
      filteredValue: filters.method || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, this.executableProgram.type === 'site' ? {
      title: <FormattedMessage id="level" />,
      dataIndex: 'level',
      key: 'level',
      width: '5%',
      filters: [{
        value: 'site',
        text: '平台',
      }, {
        value: 'organization',
        text: '组织',
      }, {
        value: 'project',
        text: '项目',
      }],
      filteredValue: filters.level || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.05}>
          <FormattedMessage id={text} />
        </MouseOverWrapper>
      ),
    } : { hidden: true }, {
      title: <FormattedMessage id="description" />,
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      filters: [],
      filteredValue: filters.description || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.online.instance.count`} />,
      width: 65,
      dataIndex: 'onlineInstanceNum',
      key: 'onlineInstanceNum',
    }, {
      title: '',
      width: 60,
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <React.Fragment>
          <Permission
            service={[
              'asgard-service.schedule-method-site.getParams',
              'asgard-service.schedule-method-org.getParams',
              'asgard-service.schedule-method-project.getParams',
            ]}
          >
            <Button
              shape="circle"
              icon="find_in_page"
              size="small"
              onClick={this.openSidebar.bind(this, record)}
            />
          </Permission>
          {
            this.executableProgram.type === 'site' &&
            <Permission
              service={[
                'asgard-service.schedule-method-site.delete',
              ]}
            >
              <Button
                shape="circle"
                icon="delete_forever"
                size="small"
                onClick={() => this.handleDelete(record)}
              />
            </Permission>
          }
        </React.Fragment>
      ),
    }];
    return (
      <Page
        service={[
          'asgard-service.schedule-method-site.pagingQuery',
          'asgard-service.schedule-method-org.pagingQuery',
          'asgard-service.schedule-method-project.pagingQuery',
          'asgard-service.schedule-method-site.getParams',
          'asgard-service.schedule-method-org.getParams',
          'asgard-service.schedule-method-project.getParams',
          'asgard-service.schedule-method-site.delete',
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
            dataSource={data}
            pagination={pagination}
            filters={params}
            rowKey="id"
            onChange={this.handlePageChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.program.header.title`} />}
            visible={isShowSidebar}
            onOk={this.handleOk}
            okText={<FormattedMessage id="close" />}
            okCancel={false}
            className="c7n-executable-program-sidebar"
          >
            <Content
              className="sidebar-content"
              code={`${code}.class`}
              values={{ name: programName }}
            >
              <Tabs activeKey={showJson ? 'json' : 'table'} onChange={this.handleTabChange}>
                <TabPane tab={<FormattedMessage id={`${intlPrefix}.params.list`} />} key="table" />
                <TabPane tab={<FormattedMessage id={`${intlPrefix}.params.json`} />} key="json" />
              </Tabs>
              {showJson
                ? (<div className="c7n-executable-program-json" style={{ margin: 0 }}><pre><code id="json">{jsonFormat(ExecutableProgramStore.getDetail.paramsList)}</code></pre></div>)
                : (this.renderParamsTable())
              }
            </Content>
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

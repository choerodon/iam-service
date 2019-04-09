/**
 * Created by hulingfangzi on 2018/6/20.
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Select, Table, Tooltip } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Content, Header, Page, Permission } from 'choerodon-boot-combine';
import querystring from 'query-string';
import InstanceStore from '../../../stores/global/instance';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import { handleFiltersParams } from '../../../common/util';

const FormItem = Form.Item;
const { Option } = Select;
const intlPrefix = 'global.instance';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Instance extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      sort: {
        columnKey: 'service',
        order: 'asc',
      },
      filters: {},
      params: [],
      defaultService: 'total',
    };
  }

  componentDidMount() {
    this.loadInitData();
  }

  componentWillUnmount() {
    InstanceStore.setCurrentService([]);
  }

  loadInitData = () => {
    InstanceStore.setLoading(true);
    InstanceStore.loadService().then((res) => {
      if (res.failed) {
        Choerodon.prompt(res.message);
      } else {
        InstanceStore.setService(res || []);
        if (res.length) {
          const defaultService = { name: 'total' };
          InstanceStore.setCurrentService(defaultService);
          this.loadInstanceData();
        } else {
          InstanceStore.setLoading(false);
        }
      }
    });
  }

  loadInstanceData(paginationIn, sortIn, filtersIn, paramsIn) {
    InstanceStore.setLoading(true);
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
    const service = InstanceStore.getCurrentService.name === 'total' ? '' : InstanceStore.getCurrentService.name;
    // 防止标签闪烁
    this.setState({ filters });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      InstanceStore.setInstanceData([]);
      this.setState({
        pagination: {
          total: 0,
        },
        sort,
        params,
      });
      InstanceStore.setLoading(false);
      return;
    }
    this.fetch(service, pagination, sort, filters, params)
      .then((data) => {
        this.setState({
          sort,
          params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements,
          },
        });
        InstanceStore.setInstanceData(data.content.slice());
        InstanceStore.setLoading(false);
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
      });
  }

  fetch(serviceName, { current, pageSize }, { columnKey = 'service', order = 'asc' }, { instanceId, version }, params) {
    const queryObj = {
      page: current - 1,
      size: pageSize,
      instanceId,
      version,
      params,
      service: serviceName,
    };
    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'asc') {
        sorter.push('asc');
      }
      queryObj.sort = sorter.join(',');
    }
    return axios.get(`/manager/v1/instances?${querystring.stringify(queryObj)}`);
  }

  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadInstanceData(pagination, sorter, filters, params);
  };

  /* 刷新 */
  handleRefresh = () => {
    const defaultService = { name: 'total' };
    InstanceStore.setCurrentService(defaultService);
    this.setState(this.getInitState(), () => {
      this.loadInitData();
    });
  }


  /**
   * 微服务下拉框改变事件
   * @param serviceName 服务名称
   */
  handleChange(serviceName) {
    let currentService;
    if (serviceName !== 'total') {
      currentService = InstanceStore.service.find(service => service.name === serviceName);
    } else {
      currentService = { name: 'total' };
    }
    InstanceStore.setCurrentService(currentService);
    this.setState(this.getInitState(), () => {
      this.loadInstanceData();
    });
  }

  /* 微服务下拉框 */
  getOptionList() {
    const { service } = InstanceStore;
    return service && service.length > 0 ? [<Option key="total" value="total">所有微服务</Option>].concat(
      service.map(({ name }) => (
        <Option key={name} value={name}>{name}</Option>
      )),
    ) : <Option value="total">无服务</Option>;
  }

  /* 跳转详情页 */
  goDetail = (record) => {
    this.props.history.push(`/iam/instance/detail/${record.instanceId}`);
  }

  render() {
    const { sort: { columnKey, order }, filters, pagination, params } = this.state;
    const { intl, AppState } = this.props;
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.id`} />,
      dataIndex: 'instanceId',
      key: 'instanceId',
      width: '30%',
      filters: [],
      filteredValue: filters.instanceId || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.version`} />,
      dataIndex: 'version',
      key: 'version',
      width: '30%',
      filters: [],
      filteredValue: filters.version || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.port`} />,
      dataIndex: 'pod',
      key: 'pod',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.registertime`} />,
      dataIndex: 'registrationTime',
      key: 'registrationTime',
    }, {
      title: '',
      width: '100px',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <Permission service={['manager-service.instance.query']}>
          <Tooltip
            title={<FormattedMessage id="detail" />}
            placement="bottom"
          >
            <Button
              size="small"
              icon="find_in_page"
              shape="circle"
              onClick={this.goDetail.bind(this, record)}
            />
          </Tooltip>
        </Permission>
      ),
    }];
    return (
      <Page
        service={[
          'manager-service.instance.list',
          'manager-service.instance.query',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          <Select
            style={{ width: '512px', marginBottom: '32px' }}
            getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
            value={InstanceStore.currentService.name}
            label={<FormattedMessage id={`${intlPrefix}.service`} />}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filter
            onChange={this.handleChange.bind(this)}
          >
            {this.getOptionList()}
          </Select>
          <Table
            loading={InstanceStore.loading}
            columns={columns}
            dataSource={InstanceStore.getInstanceData.slice()}
            pagination={pagination}
            filters={params}
            onChange={this.handlePageChange}
            rowKey="instanceId"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
        </Content>
      </Page>
    );
  }
}

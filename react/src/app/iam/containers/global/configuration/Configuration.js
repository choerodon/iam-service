/**
 * Created by hulingfangzi on 2018/6/11.
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Modal, Select, Table } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Action, axios, Content, Header, Page, Permission } from '@choerodon/boot';
import querystring from 'query-string';
import ConfigurationStore from '../../../stores/global/configuration';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import './Configuration.scss';
import '../../../common/ConfirmModal.scss';
import { handleFiltersParams } from '../../../common/util';

const FormItem = Form.Item;
const Option = Select.Option;
const intlPrefix = 'global.configuration';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Configuration extends Component {
  state = this.getInitState();

  componentDidMount() {
    ConfigurationStore.setCurrentConfigId(null);
    this.loadInitData();
  }

  componentWillUnmount() {
    ConfigurationStore.setRelatedService({}); // 保存时的微服务信息
  }

  getInitState() {
    return {
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

  loadInitData = () => {
    ConfigurationStore.setCurrentService({});
    ConfigurationStore.setService([]);
    ConfigurationStore.setLoading(true);
    ConfigurationStore.loadService().then((res) => {
      if (res.failed) {
        Choerodon.prompt(res.message);
      } else {
        ConfigurationStore.setService(res || []);
        if (res.length) {
          const { name } = ConfigurationStore.getRelatedService;
          const defaultService = name ? ConfigurationStore.getRelatedService : res[0];
          ConfigurationStore.setCurrentService(defaultService);
          this.loadConfig();
        } else {
          ConfigurationStore.setLoading(false);
        }
      }
    });
  }

  loadConfig(paginationIn, sortIn, filtersIn, paramsIn) {
    ConfigurationStore.setConfigData([]);
    ConfigurationStore.setLoading(true);
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
    this.setState({ filters });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      ConfigurationStore.setConfigData([]);
      this.setState({
        pagination: {
          total: 0,
        },
        sort,
        params,
      });
      ConfigurationStore.setLoading(false);
      return;
    }

    this.fetch(ConfigurationStore.getCurrentService.name, pagination, sort, filters, params)
      .then((data) => {
        this.setState({
          sort,
          params,
          pagination: {
            current: data.pageNum,
            pageSize: data.pageSize,
            total: data.total,
          },
        });
        ConfigurationStore.setConfigData(data.content.slice());
        ConfigurationStore.setLoading(false);
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
      });
  }

  fetch(serviceName, { current, pageSize }, { columnKey = 'id', order = 'descend' }, { name, configVersion, isDefault }, params) {
    const queryObj = {
      page: current,
      size: pageSize,
      name,
      configVersion,
      isDefault,
      params,
    };
    if (columnKey) {
      const sorter = [];
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
      queryObj.sort = sorter.join(',');
    }
    return axios.get(`/manager/v1/services/${serviceName}/configs?${querystring.stringify(queryObj)}`);
  }

  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadConfig(pagination, sorter, filters, params);
  };


  /* 刷新 */
  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      ConfigurationStore.setLoading(true);
      const defaultService = ConfigurationStore.service[0];
      ConfigurationStore.setCurrentService(defaultService);
      this.loadConfig();
    });
  }

  /* 微服务下拉框 */
  get filterBar() {
    return (
      <div>
        <Select
          style={{ width: '512px', marginBottom: '32px' }}
          value={ConfigurationStore.currentService.name}
          getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
          label={<FormattedMessage id={`${intlPrefix}.service`} />}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          filter
          onChange={this.handleChange.bind(this)}
        >
          {
            ConfigurationStore.service.map(({ name }) => (
              <Option key={name}>{name}</Option>
            ))
          }
        </Select>
      </div>
    );
  }

  /**
   * 微服务下拉框改变事件
   * @param serviceName 服务名称
   */
  handleChange(serviceName) {
    const currentService = ConfigurationStore.service.find(service => service.name === serviceName);
    ConfigurationStore.setCurrentService(currentService);
    this.setState(this.getInitState(), () => {
      this.loadConfig();
    });
  }

  /**
   * 删除配置
   * @param record 当前行数据
   */
  deleteConfig = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.delete.content` }, { name: record.name }),
      onOk: () => {
        ConfigurationStore.deleteConfig(record.id).then(({ failed, message }) => {
          if (failed) {
            Choerodon.prompt(message);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
            this.loadConfig();
          }
        });
      },
    });
  }

  /**
   * 设置默认配置
   * @param configId 配置id
   */
  setDefaultConfig = (configId) => {
    const { intl } = this.props;
    ConfigurationStore.setDefaultConfig(configId).then(({ failed, message }) => {
      if (failed) {
        Choerodon.prompt(message);
      } else {
        Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
        this.loadConfig();
      }
    });
  }

  /* 创建配置 */
  creatConfig = () => {
    ConfigurationStore.setStatus('create');
    this.props.history.push('/iam/configuration/create');
  }


  /**
   * 基于此创建
   * @param record 当前行数据
   */
  createByThis = (record) => {
    ConfigurationStore.setCurrentConfigId(record.id);
    ConfigurationStore.setStatus('baseon');
    this.props.history.push('/iam/configuration/create');
  }

  /**
   * 修改
   * @param record 当前行数据
   */
  handleEdit = (record) => {
    this.props.history.push(`/iam/configuration/edit/${ConfigurationStore.getCurrentService.name}/${record.id}`);
  }

  render() {
    const { intl, AppState } = this.props;
    const { sort: { columnKey, order }, filters, pagination, params } = this.state;
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.id`} />,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      filters: [],
      filteredValue: filters.name || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.version`} />,
      dataIndex: 'configVersion',
      key: 'configVersion',
      width: '25%',
      filters: [],
      filteredValue: filters.configVersion || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.publictime`} />,
      dataIndex: 'publicTime',
      key: 'publicTime',
    },
    {
      title: <FormattedMessage id={`${intlPrefix}.modifytime`} />,
      dataIndex: 'lastUpdateDate',
      key: 'lastUpdateDate',
    },
    {
      title: <FormattedMessage id={`${intlPrefix}.isdefault`} />,
      dataIndex: 'isDefault',
      key: 'isDefault',
      filters: [{
        text: intl.formatMessage({ id: 'yes' }),
        value: 'true',
      }, {
        text: intl.formatMessage({ id: 'no' }),
        value: 'false',
      }],
      filteredValue: filters.isDefault || [],
      render: text => intl.formatMessage({ id: text ? 'yes' : 'no' }),
    }, {
      title: '',
      width: '100px',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        const actionsDatas = [{
          service: ['manager-service.config.create'],
          type: 'site',
          icon: '',
          text: intl.formatMessage({ id: `${intlPrefix}.create.base` }),
          action: this.createByThis.bind(this, record),
        }, {
          service: ['manager-service.config.updateConfig'],
          type: 'site',
          icon: '',
          text: intl.formatMessage({ id: 'modify' }),
          action: this.handleEdit.bind(this, record),
        }];
        if (!record.isDefault) {
          actionsDatas.push({
            service: ['manager-service.config.delete'],
            type: 'site',
            icon: '',
            text: intl.formatMessage({ id: 'delete' }),
            action: this.deleteConfig.bind(this, record),
          }, {
            service: ['manager-service.config.updateConfigDefault'],
            type: 'site',
            icon: '',
            text: intl.formatMessage({ id: `${intlPrefix}.setdefault` }),
            action: this.setDefaultConfig.bind(this, record.id),
          });
        }
        return <Action data={actionsDatas} getPopupContainer={() => document.getElementsByClassName('page-content')[0]} />;
      },
    }];
    return (
      <Page
        service={[
          'manager-service.config.create',
          'manager-service.config.query',
          'manager-service.config.updateConfig',
          'manager-service.config.updateConfigDefault',
        ]}
      >
        <Header
          title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
        >
          <Permission service={['manager-service.config.create']}>
            <Button
              icon="playlist_add"
              onClick={this.creatConfig}
            >
              <FormattedMessage id={`${intlPrefix}.create`} />
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
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          {this.filterBar}
          <Table
            loading={ConfigurationStore.loading}
            columns={columns}
            dataSource={ConfigurationStore.getConfigData.slice()}
            pagination={pagination}
            filters={params}
            onChange={this.handlePageChange}
            rowKey="id"
            className="c7n-configuration-table"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
        </Content>
      </Page>
    );
  }
}

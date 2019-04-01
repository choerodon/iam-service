/**
 * Created by hulingfangzi on 2018/8/24.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table, Tooltip, Icon } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Content, Header, Page, Permission } from 'choerodon-front-boot';
import MsgRecordStore from '../../../stores/global/msg-record';
import './MsgRecord.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import { handleFiltersParams } from '../../../common/util';

// 公用方法类
class MsgRecordType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    const codePrefix = type === 'organization' ? 'organization' : 'global';
    this.code = `${codePrefix}.msgrecord`;
    this.values = { name: name || 'Choerodon' };
    this.type = type;
    this.orgId = id;
  }
}

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class APITest extends Component {
  state = this.getInitState();

  componentWillMount() {
    this.initMsgRecord();
    this.loadMsgRecord();
  }

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

  initMsgRecord() {
    this.msgrecord = new MsgRecordType(this);
  }

  loadMsgRecord(paginationIn, sortIn, filtersIn, paramsIn) {
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
      MsgRecordStore.setData([]);
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

    MsgRecordStore.loadData(pagination, filters, sort, params, this.msgrecord.type, this.msgrecord.orgId).then((data) => {
      MsgRecordStore.setData(data.content);
      this.setState({
        pagination: {
          current: data.number + 1,
          pageSize: data.size,
          total: data.totalElements,
        },
        loading: false,
        sort,
        filters,
        params,
      });
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      this.setState({
        loading: false,
      });
    });
  }

  getPermission() {
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    let retryService = ['notify-service.send-setting-site.update'];
    if (type === 'organization') {
      retryService = ['notify-service.send-setting-org.update'];
    }
    return retryService;
  }

  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadMsgRecord(pagination, sorter, filters, params);
  };

  // 刷新
  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadMsgRecord();
    });
  };

  // 重发
  retry(record) {
    const { intl } = this.props;
    MsgRecordStore.retry(record.id, this.msgrecord.type, this.msgrecord.orgId).then((data) => {
      let msg = intl.formatMessage({ id: 'msgrecord.send.success' });
      if (data.failed) {
        msg = data.message;
      }
      Choerodon.prompt(msg);
      this.loadMsgRecord();
    }).catch(() => {
      Choerodon.prompt(intl.formatMessage({ id: 'msgrecord.send.failed' }));
    });
  }

  render() {
    const { intl, AppState } = this.props;
    const retryService = this.getPermission();
    const { sort: { columnKey, order }, filters, params, pagination, loading } = this.state;
    const columns = [{
      title: <FormattedMessage id="msgrecord.status" />,
      dataIndex: 'status',
      key: 'status',
      render: status => (<StatusTag mode="icon" name={intl.formatMessage({ id: status.toLowerCase() })} colorCode={status} />),
      filters: [{
        value: 'COMPLETED',
        text: '完成',
      }, {
        value: 'FAILED',
        text: '失败',
      }],
      filteredValue: filters.status || [],
    }, {
      title: <FormattedMessage id="msgrecord.email" />,
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      filters: [],
      filteredValue: filters.email || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="msgrecord.templateType" />,
      dataIndex: 'templateType',
      key: 'templateType',
      width: '15%',
      filters: [],
      filteredValue: filters.templateType || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="msgrecord.failedReason" />,
      dataIndex: 'failedReason',
      key: 'failedReason',
      width: '20%',
      filters: [],
      filteredValue: filters.failedReason || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="msgrecord.send.count" />,
      dataIndex: 'retryCount',
      key: 'retryCount',
    }, {
      title: <FormattedMessage id="msgrecord.creationDate" />,
      dataIndex: 'creationDate',
      key: 'creationDate',
    }, {
      title: '',
      width: '100px',
      key: 'action',
      align: 'right',
      render: (text, record) => (
        record.status === 'FAILED' && record.isManualRetry ?
          <Tooltip
            title={<FormattedMessage id="msgrecord.resend" />}
            placement="bottom"
          >
            <Button
              size="small"
              icon="redo"
              shape="circle"
              onClick={this.retry.bind(this, record)}
            />
          </Tooltip> : ''
      ),
    }];

    return (
      <Page
        className="c7n-msgrecord"
        service={[
          'notify-service.message-record-site.pageEmail',
          'notify-service.message-record-org.pageEmail',
        ]}
      >
        <Header
          title={<FormattedMessage id="msgrecord.header.title" />}
        >
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={this.msgrecord.code}
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          <Table
            columns={columns}
            dataSource={MsgRecordStore.getData}
            pagination={pagination}
            onChange={this.handlePageChange}
            filters={params}
            loading={loading}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
        </Content>
      </Page>
    );
  }
}

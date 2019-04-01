/**
 * Created by chenbinjie on 2018/8/6.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Table, Modal, Form, Icon,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
  axios, Content, Header, Page, Permission, Action,
} from 'choerodon-front-boot';
import MailTemplateStore from '../../../stores/global/mail-template';
import './MailTemplate.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import '../../../common/ConfirmModal.scss';
import { handleFiltersParams } from '../../../common/util';


// 公用方法类
class MailTemplateType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    const codePrefix = type === 'organization' ? 'organization' : 'global';
    this.code = `${codePrefix}.mailtemplate`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.type = type;
    this.orgId = id;
    this.orgName = name;
  }
}

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class MailTemplate extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      selectType: 'create',
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
    this.initMailTemplate();
    this.loadTemplate();
  }

  componentWillUnmount() {
    MailTemplateStore.setTemplateType([]);
  }

  initMailTemplate() {
    this.mail = new MailTemplateType(this);
  }

  // 邮件类型
  loadTemplateType = (type, orgId) => {
    MailTemplateStore.loadTemplateType(type, orgId).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        MailTemplateStore.setTemplateType(data);
      }
    });
  }

  handleRefresh = () => {
    this.loadTemplate();
  };

  loadTemplate(paginationIn, filtersIn, sortIn, paramsIn) {
    MailTemplateStore.setLoading(true);
    this.loadTemplateType(this.mail.type, this.mail.orgId);
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
      MailTemplateStore.setMailTemplate([]);
      this.setState({
        sort,
        params,
        pagination: {
          total: 0,
        },
      });
      MailTemplateStore.setLoading(false);
      return;
    }

    MailTemplateStore.loadMailTemplate(pagination, filters, sort, params,
      this.mail.type, this.mail.orgId)
      .then((data) => {
        MailTemplateStore.setMailTemplate(data.content);
        this.setState({
          sort,
          params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements,
          },
        });
        MailTemplateStore.setLoading(false);
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
        MailTemplateStore.setLoading(false);
      });
  }


  handlePageChange = (pagination, filters, sort, params) => {
    this.loadTemplate(pagination, filters, sort, params);
  };

  reload = () => {
    this.setState(this.getInitState(), () => {
      this.loadTemplate();
    });
  };

  /**
   * 创建/基于此创建/修改
   * @param selectType selectType create/modify/baseon
   * @param record 当前行记录
   */
  handleOpen = (selectType, record = {}) => {
    MailTemplateStore.setSelectType(selectType);
    if (selectType !== 'create') {
      MailTemplateStore.getTemplateDetail(record.id, this.mail.type, this.mail.orgId).then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          MailTemplateStore.setCurrentDetail(data);
          MailTemplateStore.setSelectType(selectType);
          if (selectType === 'baseon') {
            this.createMailTemplate();
          } else {
            this.modifyMailTemplate(record.id);
          }
        }
      });
    }
  }


  // 删除
  handleDelete(record) {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: 'mailtemplate.delete.owntitle' }),
      content: intl.formatMessage({ id: 'mailtemplate.delete.owncontent' }, {
        name: record.name,
      }),
      onOk: () => {
        MailTemplateStore.deleteMailTemplate(record.id, this.mail.type, this.mail.orgId).then((data) => {
          if (data.failed) {
            Choerodon.prompt(data.message);
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
            this.reload();
          }
        }).catch((error) => {
          if (error) {
            Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
          }
        });
      },
    });
  }

  // 跳转至创建页
  createMailTemplate() {
    const { type, orgId, orgName } = this.mail;
    let createUrl;
    if (type === 'organization') {
      createUrl = `/iam/mail-template/create?type=${type}&id=${orgId}&name=${orgName}&organizationId=${orgId}`;
    } else {
      createUrl = '/iam/mail-template/create';
    }
    this.props.history.push(createUrl);
  }

  // 跳转至修改页
  modifyMailTemplate = (id) => {
    const { type, orgId, orgName } = this.mail;
    let createUrl;
    if (type === 'organization') {
      createUrl = `/iam/mail-template/modify/${id}?type=${type}&id=${orgId}&name=${orgName}&organizationId=${orgId}`;
    } else {
      createUrl = `/iam/mail-template/modify/${id}`;
    }
    this.props.history.push(createUrl);
  }

  getPermission() {
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    let createService = ['notify-service.email-template-site.create'];
    let modifyService = ['notify-service.email-template-site.update'];
    let deleteService = ['notify-service.email-template-site.delete'];
    if (type === 'organization') {
      createService = ['notify-service.email-template-org.create'];
      modifyService = ['notify-service.email-template-org.update'];
      deleteService = ['notify-service.email-template-org.delete'];
    }
    return {
      createService,
      modifyService,
      deleteService,
    };
  }

  render() {
    const { intl } = this.props;
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    const { createService, modifyService, deleteService } = this.getPermission();
    const { filters, pagination, params } = this.state;
    const mailTemplateData = MailTemplateStore.getMailTemplate();
    const columns = [{
      title: <FormattedMessage id="mailtemplate.table.name" />,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      filters: [],
      filteredValue: filters.name || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="mailtemplate.table.code" />,
      dataIndex: 'code',
      key: 'code',
      width: '25%',
      filters: [],
      filteredValue: filters.code || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="mailtemplate.table.mailtype" />,
      dataIndex: 'type',
      key: 'type',
      width: '30%',
      filters: MailTemplateStore.getTemplateType.map(({ name }) => ({ text: name, value: name })),
      filteredValue: filters.type || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    },
    {
      title: <FormattedMessage id="mailtemplate.table.fromtype" />,
      dataIndex: 'isPredefined',
      key: 'isPredefined',
      width: '30%',
      render: isPredefined => (
        <StatusTag
          mode="icon"
          name={intl.formatMessage({ id: isPredefined ? 'predefined' : 'custom' })}
          colorCode={isPredefined ? 'PREDEFINE' : 'CUSTOM'}
        />),
      filteredValue: filters.isPredefined || [],
      filters: [{
        text: intl.formatMessage({ id: 'mailtemplate.predefined' }),
        value: 'true',
      }, {
        text: intl.formatMessage({ id: 'mailtemplate.selfdefined' }),
        value: 'false',
      }],
    },
    {
      title: '',
      width: '100px',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        const actionsDatas = [{
          service: createService,
          type,
          icon: '',
          text: intl.formatMessage({ id: 'baseon' }),
          action: this.handleOpen.bind(this, 'baseon', record),
        }, {
          service: modifyService,
          type,
          icon: '',
          text: intl.formatMessage({ id: 'modify' }),
          action: this.handleOpen.bind(this, 'modify', record),
        }];
          // 根据来源类型判断
        if (!record.isPredefined) {
          actionsDatas.push({
            service: deleteService,
            type,
            icon: '',
            text: intl.formatMessage({ id: 'delete' }),
            action: this.handleDelete.bind(this, record),
          });
        }
        return <Action data={actionsDatas} getPopupContainer={() => document.getElementsByClassName('page-content')[0]} />;
      },
    }];

    return (
      <Page
        service={[
          'notify-service.email-template-site.pageSite',
          'notify-service.email-template-org.pageOrganization',
          'notify-service.email-template-site.create',
          'notify-service.email-template-org.create',
          'notify-service.email-template-site.update',
          'notify-service.email-template-org.update',
          'notify-service.email-template-site.delete',
          'notify-service.email-template-org.delete',
        ]}
      >
        <Header
          title={<FormattedMessage id="mailtemplate.header.title" />}
        >
          <Permission service={createService}>
            <Button
              icon="playlist_add"
              onClick={this.createMailTemplate.bind(this)}
            >
              <FormattedMessage id="mailtemplate.create" />
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
          code={this.mail.code}
          values={{ name: `${this.mail.values.name || 'Choerodon'}` }}
        >
          <Table
            loading={MailTemplateStore.loading}
            columns={columns}
            dataSource={mailTemplateData}
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

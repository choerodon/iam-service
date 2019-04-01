/**
 * Created by chenbinjie on 2018/8/6.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Select, Table, Modal, Input, Icon,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
  axios, Content, Header, Page, Permission, Action,
} from 'choerodon-front-boot';
import { handleFiltersParams } from '../../../common/util';
import InMailTemplateStore from '../../../stores/global/inmail-template';
import './InMailTemplate.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import '../../../common/ConfirmModal.scss';

// 公用方法类
class MailTemplateType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    const codePrefix = type === 'organization' ? 'organization' : 'global';
    this.code = `${codePrefix}.inmailtemplate`;
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
export default class InMailTemplate extends Component {
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
    InMailTemplateStore.setTemplateType([]);
  }

  initMailTemplate() {
    this.mail = new MailTemplateType(this);
  }

  // 邮件类型
  loadTemplateType = (type, orgId) => {
    InMailTemplateStore.loadTemplateType(type, orgId).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        InMailTemplateStore.setTemplateType(data);
      }
    });
  };

  handleRefresh = () => {
    this.loadTemplate();
  };

  loadTemplate(paginationIn, filtersIn, sortIn, paramsIn) {
    InMailTemplateStore.setLoading(true);
    this.loadTemplateType(this.mail.type, this.mail.orgId);
    const {
      pagination: paginationState,
      sort: sortState,
      filters: filtersState,
      params: paramsState,
    } = this.state;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const params = paramsIn || paramsState;
    const filters = filtersIn || filtersState;
    // 防止标签闪烁
    this.setState({ filters });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      InMailTemplateStore.setMailTemplate([]);
      InMailTemplateStore.setLoading(false);
      this.setState({
        sort,
        params,
        pagination: {
          total: 0,
        },
      });
      return;
    }

    InMailTemplateStore.loadMailTemplate(pagination, filters, sort, params,
      this.mail.type, this.mail.orgId)
      .then((data) => {
        InMailTemplateStore.setLoading(false);
        InMailTemplateStore.setMailTemplate(data.content);
        this.setState({
          sort,
          params,
          pagination: {
            current: data.number + 1,
            pageSize: data.size,
            total: data.totalElements,
          },
        });
        InMailTemplateStore.setLoading(false);
      })
      .catch((error) => {
        Choerodon.handleResponseError(error);
        InMailTemplateStore.setLoading(false);
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
    InMailTemplateStore.setSelectType(selectType);
    if (selectType !== 'create') {
      InMailTemplateStore.getTemplateDetail(record.id, this.mail.type, this.mail.orgId).then((data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
        } else {
          InMailTemplateStore.setCurrentDetail(data);
          InMailTemplateStore.setSelectType(selectType);
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
      title: intl.formatMessage({ id: 'inmailtemplate.delete.owntitle' }),
      content: intl.formatMessage({ id: 'inmailtemplate.delete.owncontent' }, {
        name: record.name,
      }),
      onOk: () => {
        InMailTemplateStore.deleteMailTemplate(record.id, this.mail.type, this.mail.orgId).then((data) => {
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


  /**
   * 模板编码校验
   * @param rule 表单校验规则
   * @param value 模板编码
   * @param callback 回调函数
   */
  // checkCode = (rule, value, callback) => {
  //   const { intl } = this.props;
  //   const path = this.mail.type === 'site' ? '' : `/organizations/${this.mail.orgId}`;
  //   axios.get(`notify/v1/notices/letters/templates/check${path}?code=${value}`).then((mes) => {
  //     if (mes.failed) {
  //       callback(intl.formatMessage({ id: 'inmailtemplate.code.exist' }));
  //     } else {
  //       callback();
  //     }
  //   });
  // };


  renderBuiltIn = (isPredefined) => {
    if (isPredefined) {
      return (
        <div>
          <Icon type="settings" style={{ verticalAlign: 'text-bottom' }} />
          <FormattedMessage id="inmailtemplate.predefined" />
        </div>
      );
    } else {
      return (
        <div>
          <Icon type="av_timer" style={{ verticalAlign: 'text-bottom' }} />
          <FormattedMessage id="inmailtemplate.selfdefined" />
        </div>
      );
    }
  };

  // 跳转至创建页
  createMailTemplate() {
    const { type, orgId, orgName } = this.mail;
    let createUrl;
    if (type === 'organization') {
      createUrl = `/iam/inmail-template/create?type=${type}&id=${orgId}&name=${orgName}&organizationId=${orgId}`;
    } else {
      createUrl = '/iam/inmail-template/create';
    }
    this.props.history.push(createUrl);
  }

  // 跳转至修改页
  modifyMailTemplate = (id) => {
    const { type, orgId, orgName } = this.mail;
    let createUrl;
    if (type === 'organization') {
      createUrl = `/iam/inmail-template/modify/${id}?type=${type}&id=${orgId}&name=${orgName}&organizationId=${orgId}`;
    } else {
      createUrl = `/iam/inmail-template/modify/${id}`;
    }
    this.props.history.push(createUrl);
  }

  getPermission() {
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    let createService = ['notify-service.pm-template-site.create'];
    let modifyService = ['notify-service.pm-template-site.update'];
    let deleteService = ['notify-service.pm-template-site.delete'];
    if (type === 'organization') {
      createService = ['notify-service.pm-template-org.create'];
      modifyService = ['notify-service.pm-template-org.update'];
      deleteService = ['notify-service.pm-template-org.delete'];
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
    const mailTemplateData = InMailTemplateStore.getMailTemplate();
    const columns = [{
      title: <FormattedMessage id="inmailtemplate.table.name" />,
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
      title: <FormattedMessage id="inmailtemplate.table.code" />,
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
      title: <FormattedMessage id="inmailtemplate.table.mailtype" />,
      dataIndex: 'type',
      key: 'type',
      width: '30%',
      filters: InMailTemplateStore.getTemplateType.map(({ name }) => ({ text: name, value: name })),
      filteredValue: filters.type || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    },
    {
      title: <FormattedMessage id="inmailtemplate.table.fromtype" />,
      dataIndex: 'isPredefined',
      key: 'isPredefined',
      width: '30%',
      filters: [{
        text: intl.formatMessage({ id: 'inmailtemplate.predefined' }),
        value: 'true',
      }, {
        text: intl.formatMessage({ id: 'inmailtemplate.selfdefined' }),
        value: 'false',
      }],
      filteredValue: filters.isPredefined || [],
      render: isPredefined => this.renderBuiltIn(isPredefined),
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
          'notify-service.pm-template-site.pageSite',
          'notify-service.pm-template-site.create',
          'notify-service.pm-template-site.update',
          'notify-service.pm-template-site.delete',
        ]}
      >
        <Header
          title={<FormattedMessage id="inmailtemplate.header.title" />}
        >
          <Permission service={createService}>
            <Button
              icon="playlist_add"
              onClick={this.createMailTemplate.bind(this)}
            >
              <FormattedMessage id="inmailtemplate.create" />
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
            loading={InMailTemplateStore.loading}
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

/**
 * Created by hulingfangzi on 2018/8/20.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Select, Table, Tooltip, Form, Modal, Radio, InputNumber } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Content, Header, Page, Permission } from 'choerodon-boot-combine';
import SendSettingStore from '../../../stores/global/send-setting';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import './SendSetting.scss';
import { handleFiltersParams } from '../../../common/util';

const { Sidebar } = Modal;
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const intlPrefix = 'global.sendsetting';

// 公用方法类
class SendSettingType {
  constructor(context) {
    this.context = context;
    const { AppState } = this.context.props;
    this.data = AppState.currentMenuType;
    const { type, id, name } = this.data;
    const codePrefix = type === 'organization' ? 'organization' : 'global';
    this.code = `${codePrefix}.sendsetting`;
    this.values = { name: name || AppState.getSiteInfo.systemName || 'Choerodon' };
    this.type = type;
    this.orgId = id;
  }
}


@Form.create()
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class SendSetting extends Component {
  state = this.getInitState();

  componentWillMount() {
    this.initSendSetting();
    this.loadSettingList();
  }

  componentWillUnmount() {
    SendSettingStore.setTemplate([]);
    SendSettingStore.setPmTemplate([]);
  }

  getInitState() {
    return {
      loading: true,
      visible: false, // 侧边栏是否可见
      submitting: false, // 侧边栏提交按钮状态
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

  initSendSetting() {
    this.setting = new SendSettingType(this);
  }

  loadSettingList(paginationIn, sortIn, filtersIn, paramsIn) {
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
      SendSettingStore.setData([]);
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

    SendSettingStore.loadData(pagination, filters, sort, params, this.setting.type, this.setting.orgId).then((data) => {
      SendSettingStore.setData(data.content);
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

  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadSettingList(pagination, sorter, filters, params);
  };

  // 刷新
  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadSettingList();
    });
  };

  // 打开侧边栏
  handleModify = (record) => {
    const { type, orgId } = this.setting;
    this.props.form.resetFields();
    SendSettingStore.loadTemplate(type, orgId, record.code);
    SendSettingStore.loadPmTemplate(type, orgId, record.code);
    SendSettingStore.loadCurrentRecord(record.id, type, orgId).then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        SendSettingStore.setCurrentRecord(data);
        this.setState({
          visible: true,
        });
      }
    });
  };

  handleDelete = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.delete.content${(!record.pmTemplateCode && !record.emailTemplateCode && !record.smsTemplateCode) ? '' : '.has-template'}` }, { name: record.name }),
      onOk: () => SendSettingStore.deleteSettingById(record.id).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
          this.handleRefresh();
        }
      }),
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { intl } = this.props;
    const { type, orgId } = this.setting;
    this.props.form.validateFieldsAndScroll((err, values, modify) => {
      if (!err) {
        if (!modify) {
          this.setState({
            visible: false,
          });
          Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          return;
        }

        this.setState({
          submitting: true,
        });
        const body = {
          objectVersionNumber: SendSettingStore.getCurrentRecord.objectVersionNumber,
          id: SendSettingStore.getCurrentRecord.id,
          emailTemplateId: values.emailTemplateId === 'empty' ? null : values.emailTemplateId,
          retryCount: Number(values.retryCount),
          isSendInstantly: values.sendnow === 'instant',
          isManualRetry: values.manual === 'allow',
          pmTemplateId: values.pmTemplateId === 'empty' ? null : values.pmTemplateId,
          pmType: values.pmType,
          allowConfig: values.allowConfig === 'allow',
        };
        SendSettingStore.modifySetting(SendSettingStore.getCurrentRecord.id, body, type, orgId).then((data) => {
          if (data.failed) {
            Choerodon.prompt(data.message);
            this.setState({
              submitting: false,
            });
          } else {
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            this.setState({
              submitting: false,
              visible: false,
            });
            this.loadSettingList();
          }
        }).catch((error) => {
          Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
          this.setState({
            submitting: false,
          });
        });
      }
    });
  }

  // 关闭侧边栏
  handleCancelFun = () => {
    this.setState({
      visible: false,
    });
  };

  // 侧边栏
  getHeader() {
    const { code } = this.setting;
    const selectCode = `${code}.modify`;
    const modifyValues = {
      name: SendSettingStore.getCurrentRecord.name,
    };
    return {
      code: selectCode,
      values: modifyValues,
    };
  }

  getPermission() {
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    let modifyService = ['notify-service.send-setting-site.update'];
    const deleteService = ['notify-service.send-setting-site.delSendSetting'];
    if (type === 'organization') {
      modifyService = ['notify-service.send-setting-org.update'];
    }
    return { modifyService, deleteService };
  }


  renderSidebarContent() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const header = this.getHeader();
    const { getCurrentRecord } = SendSettingStore;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const inputWidth = 512;
    return (
      <Content
        className="sidebar-content"
        {...header}
      >
        <Form className="c7n-sendsetting-form">
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('emailTemplateId', {
                rules: [],
                initialValue: !getCurrentRecord.emailTemplateId ? 'empty' : getCurrentRecord.emailTemplateId,
              })(
                <Select
                  className="c7n-email-template-select"
                  style={{ width: inputWidth }}
                  label={<FormattedMessage id="sendsetting.template" />}
                  getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                >
                  {
                    SendSettingStore.getTemplate.length > 0 ? [<Option key="empty" value="empty">无</Option>].concat(
                      SendSettingStore.getTemplate.map(({ name, id, code }) => (
                        <Option key={id} value={id} title={name}>
                          <Tooltip title={code} placement="right" align={{ offset: [20, 0] }}>
                            <span style={{ display: 'inline-block', width: '100%' }}>{name}</span>
                          </Tooltip>
                        </Option>
                      )),
                    ) : <Option key="empty" value="empty">无</Option>
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('retryCount', {
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'sendsetting.retrycount.required' }),
                  }, {
                    pattern: /^\d$|^10$/,
                    message: intl.formatMessage({ id: 'sendsetting.retrycount.pattern' }),
                  }],
                initialValue: String(getCurrentRecord.retryCount),
              })(
                <InputNumber
                  autoComplete="off"
                  min={0}
                  max={10}
                  label={<FormattedMessage id="sendsetting.retrycount" />}
                  style={{ width: inputWidth }}
                />,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('sendnow', {
                rules: [],
                initialValue: getCurrentRecord.isSendInstantly ? 'instant' : 'notinstant',
              })(
                <RadioGroup
                  label={<FormattedMessage id="sendsetting.sendinstantly" />}
                  className="radioGroup"
                >
                  <Radio value="instant">{intl.formatMessage({ id: 'yes' })}</Radio>
                  <Radio value="notinstant">{intl.formatMessage({ id: 'no' })}</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('manual', {
                rules: [],
                initialValue: getCurrentRecord.isManualRetry ? 'allow' : 'notallow',
              })(
                <RadioGroup
                  label={<FormattedMessage id="sendsetting.alllow.manual" />}
                  className="radioGroup"
                >
                  <Radio value="allow">{intl.formatMessage({ id: 'yes' })}</Radio>
                  <Radio value="notallow">{intl.formatMessage({ id: 'no' })}</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('pmTemplateId', {
                rules: [],
                initialValue: !getCurrentRecord.pmTemplateId ? 'empty' : getCurrentRecord.pmTemplateId,
              })(
                <Select
                  className="c7n-email-template-select"
                  style={{ width: inputWidth }}
                  label={<FormattedMessage id="sendsetting.pmtemplate" />}
                  getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                >
                  {

                    SendSettingStore.getPmTemplate.length > 0 ? [<Option key="empty" value="empty">无</Option>].concat(
                      SendSettingStore.getPmTemplate.map(({ name, id, code }) => (
                        <Option key={id} value={id} title={name}>
                          <Tooltip title={code} placement="right" align={{ offset: [20, 0] }}>
                            <span style={{ display: 'inline-block', width: '100%' }}>{name}</span>
                          </Tooltip>
                        </Option>
                      )),
                    ) : <Option key="empty" value="empty">无</Option>
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('pmType', {
                rules: [],
                initialValue: getCurrentRecord.pmType,
              })(
                <RadioGroup
                  label={<FormattedMessage id="sendsetting.pmtemplate.type" />}
                  className="radioGroup"
                >
                  <Radio value="msg">{intl.formatMessage({ id: 'sendsetting.pmtemplate.msg' })}</Radio>
                  <Radio value="notice">{intl.formatMessage({ id: 'sendsetting.pmtemplate.notice' })}</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('allowConfig', {
                rules: [],
                initialValue: getCurrentRecord.allowConfig ? 'allow' : 'notallow',
              })(
                <RadioGroup
                  label={<FormattedMessage id="sendsetting.pmtemplate.receive" />}
                  className="radioGroup"
                >
                  <Radio value="allow">{intl.formatMessage({ id: 'yes' })}</Radio>
                  <Radio value="notallow">{intl.formatMessage({ id: 'no' })}</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
        </Form>
      </Content>
    );
  }

  render() {
    const { intl, AppState } = this.props;
    const { modifyService, deleteService } = this.getPermission();
    const { sort: { columnKey, order }, filters, params, pagination, loading, visible, submitting } = this.state;
    const columns = [{
      title: <FormattedMessage id="sendsetting.trigger.type" />,
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      filters: [],
      filteredValue: filters.name || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>),
    }, {
      title: <FormattedMessage id="sendsetting.code" />,
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      filters: [],
      filteredValue: filters.code || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>),
    }, {
      title: <FormattedMessage id="sendsetting.description" />,
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
      title: <FormattedMessage id="level" />,
      dataIndex: 'level',
      key: 'level',
      width: '5%',
      filters: [{
        text: intl.formatMessage({ id: 'site' }),
        value: 'site',
      }, {
        text: intl.formatMessage({ id: 'organization' }),
        value: 'organization',
      }, {
        text: intl.formatMessage({ id: 'project' }),
        value: 'project',
      }],
      filteredValue: filters.level || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.05}>
          <FormattedMessage id={text} />
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="sendsetting.template" />,
      dataIndex: 'emailTemplateCode',
      key: 'emailTemplateCode',
      width: '15%',
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="sendsetting.pmtemplate" />,
      dataIndex: 'pmTemplateCode',
      key: 'pmTemplateCode',
      width: '15%',
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: '',
      width: 150,
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <React.Fragment>
          <Permission service={modifyService}>
            <Tooltip
              title={<FormattedMessage id="modify" />}
              placement="bottom"
            >
              <Button
                size="small"
                icon="mode_edit"
                shape="circle"
                onClick={this.handleModify.bind(this, record)}
              />
            </Tooltip>
          </Permission>
          <Permission service={deleteService}>
            <Tooltip
              title={<FormattedMessage id="delete" />}
              placement="bottom"
            >
              <Button
                size="small"
                icon="delete_forever"
                shape="circle"
                onClick={() => this.handleDelete(record)}
              />
            </Tooltip>
          </Permission>
        </React.Fragment>
      ),
    }];
    return (
      <Page
        service={[
          'notify-service.send-setting-site.pageSite',
          'notify-service.send-setting-org.pageOrganization',
          'notify-service.send-setting-site.query',
          'notify-service.send-setting-org.query',
          'notify-service.send-setting-site.update',
          'notify-service.send-setting-org.update',
          'notify-service.email-template-site.listNames',
          'notify-service.email-template-org.listNames',
          'notify-service.send-setting-site.delSendSetting',
        ]}
      >
        <Header title={<FormattedMessage id="sendsetting.header.title" />}>
          <Button
            onClick={this.handleRefresh}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={this.setting.code}
          values={{ name: `${this.setting.values.name || 'Choerodon'}` }}
        >
          <Table
            columns={columns}
            dataSource={SendSettingStore.getData}
            pagination={pagination}
            onChange={this.handlePageChange}
            filters={params}
            loading={loading}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id="sendsetting.modify" />}
            visible={visible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancelFun}
            okText={<FormattedMessage id="save" />}
            confirmLoading={submitting}
          >
            {this.renderSidebarContent()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, Form, Icon, IconSelect, Input, Modal, Select, Table, Tooltip, Radio } from 'choerodon-ui';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import './DashboardSetting.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import RoleStore from '../../../stores/global/role/RoleStore';
import StatusTag from '../../../components/statusTag';

const RadioGroup = Radio.Group;
const { Sidebar } = Modal;
const { Option } = Select;

const intlPrefix = 'global.dashboard-setting';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const inputWidth = 512;

@Form.create({})
@injectIntl
@inject('AppState')
@observer
class DashboardSetting extends Component {
  constructor(props) {
    super(props);
    this.editFocusInput = React.createRef();
  }

  componentWillMount() {
    this.fetchData();
  }

  handleDisable = (record) => {
    const { intl, DashboardSettingStore } = this.props;
    DashboardSettingStore.dashboardDisable(record)
      .then(() => {
        Choerodon.prompt(intl.formatMessage({ id: record.enabled ? 'disable.success' : 'enable.success' }));
      })
      .catch(Choerodon.handleResponseError);
  };

  handleRoleClick = () => {
    const { DashboardSettingStore } = this.props;
    DashboardSettingStore.setNeedUpdateRoles(true);
    DashboardSettingStore.setNeedRoles(!DashboardSettingStore.needRoles);
  };

  handleRefresh = () => {
    this.props.DashboardSettingStore.refresh();
  };

  handleOk = () => {
    const { form, intl, DashboardStore, DashboardSettingStore } = this.props;
    form.validateFields((error, values, modify) => {
      Object.keys(values).forEach((key) => {
        // 去除form提交的数据中的全部前后空格
        if (typeof values[key] === 'string') values[key] = values[key].trim();
      });
      if (!error) {
        if (modify || DashboardSettingStore.needUpdateRoles) {
          DashboardSettingStore.updateData(values).then((data) => {
            if (DashboardStore) {
              DashboardStore.updateCachedData(data);
            }
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          });
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
        }
      }
    });
  };

  handleCancel = () => {
    this.props.DashboardSettingStore.hideSideBar();
  };

  handleTableChange = (pagination, filters, sort, params) => {
    this.fetchData(pagination, filters, sort, params);
  };

  fetchData(pagination, filters, sort, params) {
    this.props.DashboardSettingStore.loadData(pagination, filters, sort, params);
  }

  editCard(record) {
    const { DashboardSettingStore, form } = this.props;
    DashboardSettingStore.setNeedRoles(record.needRoles);
    RoleStore.loadRole(record.level, { pageSize: 999 }, {}, {}).then((data) => {
      RoleStore.setRoles(data.list || []);
    });
    DashboardSettingStore.setEditData(record);
    DashboardSettingStore.showSideBar();
    form.resetFields();
    setTimeout(() => {
      this.editFocusInput.input.focus();
    }, 10);
  }

  getTableColumns() {
    const { intl, DashboardSettingStore: { sort: { columnKey, order }, filters } } = this.props;
    return [
      {
        title: <FormattedMessage id={`${intlPrefix}.name`} />,
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        filteredValue: filters.name || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      }, {
        title: <FormattedMessage id={`${intlPrefix}.namespace`} />,
        dataIndex: 'namespace',
        key: 'namespace',
        width: '13%',
        filters: [],
        filteredValue: filters.namespace || [],
      }, {
        title: <FormattedMessage id={`${intlPrefix}.code`} />,
        dataIndex: 'code',
        key: 'code',
        width: '13%',
        filters: [],
        filteredValue: filters.code || [],
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.card.title`} />,
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div>
            <Icon type={record.icon} style={{ fontSize: 20, marginRight: '6px' }} />
            <MouseOverWrapper text={text} width={0.1} style={{ display: 'inline' }}>
              {text}
            </MouseOverWrapper>
          </div>
        ),
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.level`} />,
        dataIndex: 'level',
        key: 'level',
        filters: [
          {
            text: intl.formatMessage({ id: `${intlPrefix}.level.site` }),
            value: 'site',
          }, {
            text: intl.formatMessage({ id: `${intlPrefix}.level.organization` }),
            value: 'organization',
          }, {
            text: intl.formatMessage({ id: `${intlPrefix}.level.project` }),
            value: 'project',
          },
        ],
        filteredValue: filters.level || [],
        render: text => (
          <FormattedMessage id={`${intlPrefix}.level.${text}`} />
        ),
      }, {
        title: <FormattedMessage id={`${intlPrefix}.needRoles`} />,
        dataIndex: 'needRoles',
        key: 'needRoles',
        width: '9%',
        filters: [
          {
            text: intl.formatMessage({ id: 'global.dashboard-setting.needRoles.enable' }),
            value: true,
          }, {
            text: intl.formatMessage({ id: 'global.dashboard-setting.needRoles.disable' }),
            value: false,
          },
        ],
        filteredValue: filters.needRoles || [],
        render: needRoles => intl.formatMessage({ id: `global.dashboard-setting.needRoles.${needRoles ? 'enable' : 'disable'}` }),
      },
      {
        title: <FormattedMessage id="status" />,
        dataIndex: 'enabled',
        key: 'enabled',
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true',
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false',
        }],
        filteredValue: filters.enabled || [],
        render: enabled => (<StatusTag mode="icon" name={intl.formatMessage({ id: enabled ? 'enable' : 'disable' })} colorCode={enabled ? 'COMPLETED' : 'DISABLE'} />),
      },
      {
        title: '',
        width: 100,
        key: 'action',
        align: 'right',
        render: (text, record) => (
          <Permission service={['iam-service.dashboard.update']}>
            <Tooltip
              title={<FormattedMessage id="edit" />}
              placement="bottom"
            >
              <Button
                shape="circle"
                icon="mode_edit"
                size="small"
                onClick={() => this.editCard(record)}
              />
            </Tooltip>
            <Tooltip
              title={<FormattedMessage id={record.enabled ? 'disable' : 'enable'} />}
              placement="bottom"
            >
              <Button
                size="small"
                icon={record.enabled ? 'remove_circle_outline' : 'finished'}
                shape="circle"
                onClick={() => this.handleDisable(record)}
              />
            </Tooltip>
          </Permission>
        ),
      },
    ];
  }

  renderRoleSelect = () => {
    const roles = RoleStore.getRoles;
    return roles.map(item =>
      <Option key={item.code} value={item.code}>{item.name}</Option>);
  };

  renderForm() {
    const roles = RoleStore.getRoles;
    const {
      form: { getFieldDecorator }, intl,
      DashboardSettingStore: { editData: { code, name, level, icon, title, namespace, roleCodes }, needRoles },
    } = this.props;
    return (
      <Content
        className="dashboard-setting-siderbar-content"
        code={`${intlPrefix}.modify`}
        values={{ name }}
      >
        <Form>
          {
            getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                },
              ],
              initialValue: code,
            })(
              <input type="hidden" />,
            )
          }
          <FormItem {...formItemLayout} className="is-required">
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.code`} />}
              style={{ width: inputWidth }}
              value={`${namespace}-${code}`}
              disabled
            />
          </FormItem>
          <FormItem {...formItemLayout}>
            {
              getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.name.required` }),
                  },
                ],
                initialValue: name,
              })(
                <Input
                  autoComplete="off"
                  label={<FormattedMessage id={`${intlPrefix}.name`} />}
                  style={{ width: inputWidth }}
                  ref={(e) => {
                    this.editFocusInput = e;
                  }}
                  maxLength={32}
                  showLengthInfo={false}
                />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout}>
            {
              getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.card.title.required` }),
                  },
                ],
                initialValue: title,
              })(
                <Input
                  autoComplete="off"
                  label={<FormattedMessage id={`${intlPrefix}.card.title`} />}
                  style={{ width: inputWidth }}
                  maxLength={32}
                  showLengthInfo={false}
                />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout}>
            {
              getFieldDecorator('icon', {
                initialValue: icon,
              })(
                <IconSelect
                  label={<FormattedMessage id={`${intlPrefix}.icon`} />}
                  // getPopupContainer={() => document.getElementsByClassName('ant-modal-body')[document.getElementsByClassName('ant-modal-body').length - 1]}
                  style={{ width: inputWidth }}
                  showArrow
                />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout}>
            <RadioGroup onChange={this.handleRoleClick} value={needRoles}>
              <Radio value><FormattedMessage id={`${intlPrefix}.open-role`} /></Radio>
              <Radio value={false}><FormattedMessage id={`${intlPrefix}.close-role`} /></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('roleCodes', {
              valuePropName: 'value',
              initialValue: roleCodes && roleCodes.slice(),
            })(
              <Select
                mode="multiple"
                label={<FormattedMessage id={`${intlPrefix}.role`} />}
                size="default"
                // getPopupContainer={() => document.getElementsByClassName('ant-modal-body')[document.getElementsByClassName('ant-modal-body').length - 1]}
                style={{
                  width: '512px',
                  display: needRoles ? 'inline-block' : 'none',
                }}
              >
                {this.renderRoleSelect()}
              </Select>,
            )}
          </FormItem>
        </Form>
      </Content>
    );
  }

  render() {
    const { AppState, DashboardSettingStore, intl } = this.props;
    const { pagination, params, loading, dashboardData, sidebarVisible } = DashboardSettingStore;
    return (
      <Page
        service={[
          'iam-service.dashboard.list',
          'iam-service.dashboard.query',
          'iam-service.dashboard.update',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
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
          <Table
            loading={loading}
            className="dashboard-table"
            columns={this.getTableColumns()}
            dataSource={dashboardData.slice()}
            pagination={pagination}
            filters={params}
            onChange={this.handleTableChange}
            rowKey={({ code, namespace }) => `${namespace}-${code}`}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.sidebar.title`} />}
            onOk={this.handleOk}
            okText={<FormattedMessage id="save" />}
            cancelText={<FormattedMessage id="cancel" />}
            onCancel={this.handleCancel}
            visible={sidebarVisible}
          >
            {this.renderForm()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

export default Choerodon.dashboard ? inject('DashboardStore')(DashboardSetting) : DashboardSetting;

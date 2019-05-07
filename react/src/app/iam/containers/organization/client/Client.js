import React, { Component } from 'react';
import { Button, Form, Input, Modal, Select, Table, Tooltip, InputNumber, Icon, Popover } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import LoadingBar from '../../../components/loadingBar/index';
import ClientStore from '../../../stores/organization/client/ClientStore';
import './Client.scss';
import '../../../common/ConfirmModal.scss';
import { handleFiltersParams } from '../../../common/util';

const { Sidebar } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const intlPrefix = 'organization.client';
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
const formItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Client extends Component {
  constructor(props) {
    super(props);
    this.editFocusInput = React.createRef();
  }

  state = this.getInitState();
  getInitState() {
    return {
      submitting: false,
      page: 1,
      open: false,
      id: null,
      params: [],
      filters: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: '',
      },
      sort: {
        columnKey: 'id',
        order: 'descend',
      },
      visible: false,
      status: '',
      selectData: {},
      initName: undefined, // 创建时客户端名称
      initSecret: undefined, // 创建时客户端秘钥
    };
  }

  componentDidMount() {
    this.loadClient();
  }

  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadClient();
    });
  }
  getSidebarContentInfo = () => {
    const menuType = this.props.AppState.currentMenuType;
    const organizationName = menuType.name;
    const client = ClientStore.getClient;
    const { status } = this.state;
    switch (status) {
      case 'create':
        return {
          code: `${intlPrefix}.create`,
          values: {
            name: organizationName,
          },
        };
      case 'edit':
        return {
          code: `${intlPrefix}.modify`,
          values: {
            name: client && client.name,
          },
        };
      default:
        return {};
    }
  }
  /**
   * 加载客户端数据
   * @param pages 分页参数
   * @param state 当前search参数
   */
  loadClient = (paginationIn, sortIn, filtersIn, paramsIn) => {
    const { AppState } = this.props;
    const { pagination: paginationState, sort: sortState, filters: filtersState, params: paramsState } = this.state;
    const { id: organizationId } = AppState.currentMenuType;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const params = paramsIn || paramsState;
    // 防止标签闪烁
    this.setState({ filters });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      ClientStore.setClients([]);
      this.setState({
        pagination: {
          total: 0,
        },
        sort,
        params,
      });
      ClientStore.changeLoading(false);
      return;
    }

    ClientStore.loadClients(organizationId, pagination, sort, filters, params)
      .then((data) => {
        ClientStore.setClients(data.list || []);
        this.setState({
          pagination: {
            current: data.pageNum,
            pageSize: data.pageSize,
            total: data.total,
          },
          sort,
          params,
        });
        ClientStore.changeLoading(false);
      });
  };

  /**
   * 分页加载数据
   * @param page
   * @returns {*}
   */
  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadClient(pagination, sorter, filters, params);
  };

  /**
   * 删除客户端
   */
  handleDelete = (record) => {
    const { intl } = this.props;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.delete.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.delete.content` }, { name: record.name }),
      onOk: () => ClientStore.deleteClientById(record.organizationId, record.id).then((status) => {
        if (status) {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
          this.loadClient();
        } else {
          Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
        }
      }).catch(() => {
        Choerodon.prompt(intl.formatMessage({ id: 'delete.error' }));
      }),
    });
  };

  openSidebar = (status, record = {}) => {
    const { resetFields } = this.props.form;
    resetFields();
    ClientStore.setClientById([]);
    if (record.organizationId && record.id) {
      ClientStore.getClientById(record.organizationId, record.id)
        .subscribe((data) => {
          ClientStore.setClientById(data);
          this.setState({
            status,
            visible: true,
            selectData: record,
          });
        });
      setTimeout(() => {
        this.editFocusInput.input.focus();
      }, 100);
    } else {
      const { AppState } = this.props;
      ClientStore.getCreateClientInitValue(AppState.currentMenuType.id).then(({ name, secret }) => {
        this.setState({
          initName: name,
          initSecret: secret,
          status,
          visible: true,
        });
      });
    }
  };

  closeSidebar = () => {
    this.setState({
      visible: false,
      submitting: false,
    });
  };

  /**
   * 校验客户端名称
   * @param rule
   * @param value
   * @param callback
   */
  checkName = (rule, value, callback) => {
    const { AppState, intl } = this.props;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    ClientStore.checkName(organizationId, {
      name: value,
    }).then((mes) => {
      if (mes.failed) {
        callback(intl.formatMessage({ id: `${intlPrefix}.name.exist.msg` }));
      } else {
        callback();
      }
    });
  };

  isJson = (string) => {
    try {
      if (typeof JSON.parse(string) === 'object') {
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  saveSelectRef = (node, name) => {
    if (node) {
      this[name] = node.rcSelect;
    }
  };
  /**
   * 编辑客户端form表单提交
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, AppState, intl } = this.props;
    const { status, selectData } = this.state;
    form.validateFieldsAndScroll((err, data, modify) => {
      Object.keys(data).forEach((key) => {
        // 去除form提交的数据中的全部前后空格
        if (typeof data[key] === 'string') data[key] = data[key].trim();
      });
      if (!err) {
        const organizationId = AppState.currentMenuType.id;
        const dataType = data;
        if (dataType.authorizedGrantTypes) {
          dataType.authorizedGrantTypes = dataType.authorizedGrantTypes.join(',');
        }
        if (status === 'create') {
          dataType.organizationId = organizationId;
          this.setState({
            submitting: true,
          });
          ClientStore.createClient(organizationId, { ...dataType })
            .then((value) => {
              if (value.failed) {
                Choerodon.prompt(value.message);
                this.setState({
                  submitting: false,
                });
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                this.closeSidebar();
                this.handleRefresh();
              }
            }).catch(() => {
              Choerodon.prompt(intl.formatMessage({ id: 'create.error' }));
              this.setState({
                submitting: false,
              });
            });
        } else if (status === 'edit') {
          if (!modify) {
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
            this.closeSidebar();
            return;
          }
          if (dataType.scope) {
            dataType.scope = dataType.scope.join(',');
          }
          if (dataType.autoApprove) {
            dataType.autoApprove = dataType.autoApprove.join(',');
          }
          const client = ClientStore.getClient;
          this.setState({
            submitting: true,
          });
          if (dataType.additionalInformation === '') {
            dataType.additionalInformation = undefined;
          }

          const body = {
            ...data,
            authorizedGrantTypes: dataType.authorizedGrantTypes,
            objectVersionNumber: client.objectVersionNumber,
            organizationId,
          };

          ClientStore.updateClient(selectData.organizationId, body, selectData.id)
            .then((value) => {
              if (value.failed) {
                Choerodon.prompt(value.message);
                this.setState({
                  submitting: false,
                });
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                this.closeSidebar();
                this.loadClient();
              }
            }).catch(() => {
              this.setState({
                submitting: false,
              });
              Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
            });
        }
      }
    });
  };
  handleChoiceRender = (liNode, value) => {
    const valid = /^[A-Za-z]+$/.test(value);
    return React.cloneElement(liNode, {
      className: classnames(liNode.props.className, {
        'choice-has-error': !valid,
      }),
    });
  };

  handleInputKeyDown = (e, name) => {
    const { value } = e.target;
    if (e.keyCode === 13 && !e.isDefaultPrevented() && value) {
      this.setValueInSelect(value, name);
    }
  };

  setValueInSelect(value, name) {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const values = getFieldValue(name) || [];
    if (values.length < 6 && values.indexOf(value) === -1) {
      values.push(value);
      this[name].fireChange(values);
    }
    if (this[name]) {
      this[name].setState({
        inputValue: '',
      });
    }
  }
  validateSelect = (rule, value, callback, name) => {
    const { intl } = this.props;
    const length = value && value.length;
    if (length) {
      const reg = new RegExp(/^[A-Za-z]+$/);
      if (!reg.test(value[length - 1])) {
        callback(intl.formatMessage({ id: `${intlPrefix}.${name}.pattern.msg` }));
        return;
      }
    }
    callback();
  }

  getAuthorizedGrantTypes() {
    const { status } = this.state;
    const client = ClientStore.getClient || {};
    if (status === 'create') {
      return ['password', 'implicit', 'client_credentials', 'authorization_code', 'refresh_token'];
    } else {
      return client.authorizedGrantTypes ? client.authorizedGrantTypes.split(',') : [];
    }
  }

  renderSidebarContent() {
    const { intl } = this.props;
    const client = ClientStore.getClient || {};
    const { getFieldDecorator } = this.props.form;
    const { status, initName, initSecret } = this.state;
    const mainContent = client ? (<div className="client-detail">
      <Form layout="vertical" style={{ width: 512 }}>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: status === 'create' ? initName : client.name,
            rules: status === 'create' ? [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
            }, {
              pattern: /^[0-9a-zA-Z]+$/,
              message: intl.formatMessage({ id: `${intlPrefix}.name.pattern.msg` }),
            }, {
              max: 12,
              message: intl.formatMessage({ id: `${intlPrefix}.name.pattern.msg` }),
            }, {
              validator: status === 'create' && this.checkName,
            }] : [],
            validateTrigger: 'onBlur',
            validateFirst: true,
          })(
            <Input
              autoComplete="off"
              label={intl.formatMessage({ id: `${intlPrefix}.name` })}
              disabled={status === 'edit'}
              maxLength={32}
              showLengthInfo={false}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('secret', {
            initialValue: status === 'create' ? initSecret : client.secret,
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: `${intlPrefix}.secret.require.msg` }),
            }, {
              pattern: /^[0-9a-zA-Z]+$/,
              message: intl.formatMessage({ id: `${intlPrefix}.secret.pattern.msg` }),
            }, {
              min: 6,
              message: intl.formatMessage({ id: `${intlPrefix}.secret.pattern.msg` }),
            }, {
              max: 16,
              message: intl.formatMessage({ id: `${intlPrefix}.secret.pattern.msg` }),
            }],
            validateTrigger: 'onBlur',
            validateFirst: true,
          })(
            <Input
              autoComplete="off"
              type="password"
              label={intl.formatMessage({ id: `${intlPrefix}.secret` })}
              ref={(e) => { this.editFocusInput = e; }}
              showPasswordEye
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('authorizedGrantTypes', {
            initialValue: this.getAuthorizedGrantTypes(),
            rules: [
              {
                type: 'array',
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.granttypes.require.msg` }),
              },
            ],
          })(
            <Select
              mode="multiple"
              getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
              label={intl.formatMessage({ id: `${intlPrefix}.granttypes` })}
              size="default"
            >
              <Option value="password">password</Option>
              <Option value="implicit">implicit</Option>
              <Option value="client_credentials">client_credentials</Option>
              <Option value="authorization_code">authorization_code</Option>
              <Option value="refresh_token">refresh_token</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem
          {...formItemNumLayout}
        >
          {getFieldDecorator('accessTokenValidity', {
            initialValue: status === 'create' ? 3600 : client.accessTokenValidity ?
              parseInt(client.accessTokenValidity, 10) : undefined,
          })(
            <InputNumber
              autoComplete="off"
              label={intl.formatMessage({ id: `${intlPrefix}.accesstokenvalidity` })}
              style={{ width: 300 }}
              size="default"
              min={60}
            />,
          )}
          <span style={{ position: 'absolute', bottom: '-10px', right: '-20px' }}>
            {intl.formatMessage({ id: 'second' })}
          </span>
        </FormItem>
        <FormItem
          {...formItemNumLayout}
        >
          {getFieldDecorator('refreshTokenValidity', {
            initialValue: status === 'create' ? 3600 : client.refreshTokenValidity ?
              parseInt(client.refreshTokenValidity, 10) : undefined,
          })(
            <InputNumber
              autoComplete="off"
              label={intl.formatMessage({ id: `${intlPrefix}.tokenvalidity` })}
              style={{ width: 300 }}
              size="default"
              min={60}
            />,
          )}
          <span style={{ position: 'absolute', bottom: '-10px', right: '-20px' }}>
            {intl.formatMessage({ id: 'second' })}
          </span>
        </FormItem>
        { status === 'edit' &&
        <div>
          <FormItem
            {...formItemNumLayout}
          >
            {getFieldDecorator('scope', {
              rules: [{
                validator: (rule, value, callback) => this.validateSelect(rule, value, callback, 'scope'),
              }],
              validateTrigger: 'onChange',
              initialValue: client.scope ? client.scope.split(',') : [],
            })(
              <Select
                label={intl.formatMessage({ id: `${intlPrefix}.scope` })}
                mode="tags"
                filterOption={false}
                onInputKeyDown={e => this.handleInputKeyDown(e, 'scope')}
                ref={(node) => { this.saveSelectRef(node, 'scope'); }}
                notFoundContent={false}
                showNotFindSelectedItem={false}
                showNotFindInputItem={false}
                choiceRender={this.handleChoiceRender}
                allowClear={false}
              />,
            )}
            <Popover
              getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
              overlayStyle={{ maxWidth: '180px' }}
              placement="right"
              trigger="hover"
              content={intl.formatMessage({ id: `${intlPrefix}.scope.help.msg` })}
            >
              <Icon type="help" style={{ position: 'absolute', bottom: '2px', right: '0', color: 'rgba(0, 0, 0, 0.26)' }} />
            </Popover>
          </FormItem>
          <FormItem
            {...formItemNumLayout}
          >
            {getFieldDecorator('autoApprove', {
              rules: [{
                validator: (rule, value, callback) => this.validateSelect(rule, value, callback, 'autoApprove'),
              }],
              validateTrigger: 'onChange',
              initialValue: client.autoApprove ? client.autoApprove.split(',') : [],
            })(
              <Select
                label={intl.formatMessage({ id: `${intlPrefix}.autoApprove` })}
                mode="tags"
                filterOption={false}
                onInputKeyDown={e => this.handleInputKeyDown(e, 'autoApprove')}
                ref={node => this.saveSelectRef(node, 'autoApprove')}
                choiceRender={this.handleChoiceRender}
                notFoundContent={false}
                showNotFindSelectedItem={false}
                showNotFindInputItem={false}
                allowClear={false}
              />,
            )}
            <Popover
              getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
              overlayStyle={{ maxWidth: '180px' }}
              placement="right"
              trigger="hover"
              content={intl.formatMessage({ id: `${intlPrefix}.autoApprove.help.msg` })}
            >
              <Icon type="help" style={{ position: 'absolute', bottom: '2px', right: '0', color: 'rgba(0, 0, 0, 0.26)' }} />
            </Popover>
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('webServerRedirectUri', {
              initialValue: client.webServerRedirectUri || undefined,
            })(
              <Input autoComplete="off" label={intl.formatMessage({ id: `${intlPrefix}.redirect` })} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('additionalInformation', {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (!value || this.isJson(value)) {
                      callback();
                    } else {
                      callback(intl.formatMessage({ id: `${intlPrefix}.additional.pattern.msg` }));
                    }
                  },
                },
              ],
              validateTrigger: 'onBlur',
              initialValue: client.additionalInformation || undefined,
            })(
              <TextArea
                autoComplete="off"
                label={intl.formatMessage({ id: `${intlPrefix}.additional` })}
                rows={3}
              />,
            )}
          </FormItem>
          </div>}
      </Form>
    </div>) : <LoadingBar />;
    return (
      <div>
        <Content className="sidebar-content" {...this.getSidebarContentInfo()}>
          {mainContent}
        </Content>
      </div>
    );
  }

  render() {
    const { AppState, intl } = this.props;
    const { submitting, status, pagination, visible, filters, params } = this.state;
    const menuType = AppState.currentMenuType;
    const organizationName = menuType.name;
    const clientData = ClientStore.getClients;
    const columns = [
      {
        title: intl.formatMessage({ id: 'name' }),
        dataIndex: 'name',
        key: 'name',
        filters: [],
        filteredValue: filters.name || [],
      },
      {
        title: intl.formatMessage({ id: `${intlPrefix}.granttypes` }),
        dataIndex: 'authorizedGrantTypes',
        key: 'authorizedGrantTypes',
        render: (text) => {
          if (!text) {
            return '';
          }
          const grantTypes = text && text.split(',');
          return grantTypes.map(grantType => (
            <div key={grantType} className="client-granttype-item">
              {grantType}
            </div>
          ));
        },
      },
      {
        title: '',
        width: 100,
        align: 'right',
        render: (text, record) => (
          <div>
            <Permission
              service={['iam-service.client.update']}
            >
              <Tooltip
                title={<FormattedMessage id="modify" />}
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    this.openSidebar('edit', record);
                  }}
                  size="small"
                  shape="circle"
                  icon="mode_edit"
                />
              </Tooltip>
            </Permission>
            <Permission
              service={['iam-service.client.delete']}
            >
              <Tooltip
                title={<FormattedMessage id="delete" />}
                placement="bottom"
              >
                <Button
                  shape="circle"
                  size="small"
                  onClick={this.handleDelete.bind(this, record)}
                  icon="delete_forever"
                />
              </Tooltip>
            </Permission>
          </div>),
      },
    ];
    return (
      <Page
        service={[
          'iam-service.client.create',
          'iam-service.client.update',
          'iam-service.client.delete',
          'iam-service.client.list',
          'iam-service.client.check',
          'iam-service.client.queryByName',
          'iam-service.client.query',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Permission
            service={['iam-service.client.create']}
          >
            <Button
              onClick={() => this.openSidebar('create')}
              icon="playlist_add"
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
          values={{ name: organizationName }}
        >
          <Table
            size="middle"
            pagination={pagination}
            columns={columns}
            filters={params}
            dataSource={clientData}
            rowKey="id"
            onChange={this.handlePageChange}
            loading={ClientStore.isLoading}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={status === 'create' ? `${intlPrefix}.create` : `${intlPrefix}.modify`} />}
            onOk={this.handleSubmit}
            onCancel={this.closeSidebar}
            visible={visible}
            okText={<FormattedMessage id={status === 'create' ? 'create' : 'save'} />}
            cancelText={<FormattedMessage id="cancel" />}
            confirmLoading={submitting}
          >
            {this.renderSidebarContent()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

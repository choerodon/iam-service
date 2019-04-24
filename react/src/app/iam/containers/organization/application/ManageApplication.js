import React, { Component } from 'react';
import { Button, Form, Modal, Table, Tooltip, Radio, Select, Input } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page, Permission, stores } from 'choerodon-boot-combine';
import { injectIntl, FormattedMessage } from 'react-intl';
import './Application.scss';
import { Tabs } from 'choerodon-ui';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Sidebar } = Modal;
const intlPrefix = 'organization.application';
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
const isNum = /^\d+$/;

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  componentDidMount() {
    this.refresh();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { ApplicationStore: { operation, editData }, ApplicationStore } = this.props;
    const { AppState } = this.props;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    const orgName = menuType.name;
    let data;
    if (operation === 'create') {
      const { validateFields } = this.props.form;
      validateFields((err, { applicationCategory, applicationType, code, name, projectId }) => {
        if (!err) {
          data = {
            applicationCategory,
            applicationType,
            code,
            name: name.trim(),
            projectId,
            // enabled: true,
          };
          ApplicationStore.setSubmitting(true);
          ApplicationStore.createApplication(data)
            .then((value) => {
              ApplicationStore.setSubmitting(false);
              if (!value.failed) {
                this.props.history.push(`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(orgName)}`);
                Choerodon.prompt(this.props.intl.formatMessage({ id: 'create.success' }));
                ApplicationStore.loadData();
              } else {
                Choerodon.prompt(value.message);
              }
            }).catch((error) => {
              ApplicationStore.setSubmitting(false);
              Choerodon.handleResponseError(error);
            });
        }
      });
    } else if (operation === 'edit') {
      const { validateFields } = this.props.form;
      validateFields((err, validated) => {
        if (!err) {
          if (this.shouldShowProjectsSelect()) {
            data = {
              ...editData,
              name: validated.name.trim(),
              projectId: validated.projectId || null,
            };
          } else {
            data = {
              ...editData,
              name: validated.name.trim(),
            };
          }
          ApplicationStore.updateApplication(data, editData.id)
            .then((value) => {
              ApplicationStore.setSubmitting(false);
              if (!value.failed) {
                this.props.history.push(`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(orgName)}`);
                Choerodon.prompt(this.props.intl.formatMessage({ id: 'save.success' }));
                this.handleTabClose();
                ApplicationStore.loadData();
              } else {
                Choerodon.prompt(value.message);
              }
            }).catch((error) => {
              this.handleTabClose();
              Choerodon.handleResponseError(error);
            });
        }
      });
    }
  };

  handleAddApplication = () => {
    const { ApplicationStore } = this.props;
    const { editData } = ApplicationStore;
    ApplicationStore.showSidebar();
    ApplicationStore.loadAddListData(editData.id);
  };

  refresh = () => {
    const { ApplicationStore: { operation }, ApplicationStore, history } = this.props;
    const editId = history.location.pathname.split('/').pop();
    if (editId === '0') {
      ApplicationStore.setOperation('create');
    } else {
      ApplicationStore.getDetailById(history.location.pathname.split('/').pop()).then((data) => {
        if (!data.failed) {
          ApplicationStore.setEditData(data);
          ApplicationStore.setOperation('edit');
          ApplicationStore.loadTreeData(editId);
          ApplicationStore.loadListData(editId);
        } else {
          Choerodon.prompt(data.message);
        }
      });
    }
  };

  renderSideTitle() {
    switch (this.props.ApplicationStore.operation) {
      case 'create': return <FormattedMessage id={`${intlPrefix}.create`} />;
      case 'edit': return <FormattedMessage id={`${intlPrefix}.modify`} />;
      default: return <FormattedMessage id={`${intlPrefix}.create`} />;
    }
  }

  /**
   * 校验应用编码唯一性
   * @param value 应用编码
   * @param callback 回调函数
   */
  checkCode = (rule, value, callback) => {
    const { ApplicationStore, intl, ApplicationStore: { editData } } = this.props;
    const params = { code: value };
    if (editData && editData.code === value) callback();
    if (ApplicationStore.operation === 'edit') callback();
    ApplicationStore.checkApplicationCode(params)
      .then((mes) => {
        if (mes.failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.code.exist.msg` }));
        } else {
          callback();
        }
      }).catch((err) => {
        callback('校验超时');
        Choerodon.handleResponseError(err);
      });
  };

  /**
   * 校验应用名称唯一性
   * @param value 应用编码
   * @param callback 回调函数
   */
  checkName = (rule, value, callback) => {
    const { ApplicationStore, intl, ApplicationStore: { editData } } = this.props;
    const params = { name: value };
    if (editData && editData.name === value) callback();
    ApplicationStore.checkApplicationCode(params)
      .then((mes) => {
        if (mes.failed) {
          callback(intl.formatMessage({ id: `${intlPrefix}.name.exist.msg` }));
        } else {
          callback();
        }
      }).catch((err) => {
        callback('校验超时');
        Choerodon.handleResponseError(err);
      });
  };

  getSidebarContentInfo(operation) {
    const { AppState, ApplicationStore, intl } = this.props;
    const { editData } = ApplicationStore;
    const menuType = AppState.currentMenuType;
    const orgname = menuType.name;
    switch (operation) {
      case 'create':
        return {
          code: `${intlPrefix}.create`,
          values: {
            name: orgname,
          },
        };
      case 'edit':
        return {
          code: `${intlPrefix}.edit`,
          values: {
            name: ApplicationStore.editData && ApplicationStore.editData.name,
            app: intl.formatMessage({ id: `${intlPrefix}.category.${editData.applicationCategory.toLowerCase()}` }),
          },
        };
      default:
        return {
          code: `${intlPrefix}.create`,
        };
    }
  }

  /**
   * 返回是否显示选择分配项目的选择框
   * @returns {boolean}
   */
  shouldShowProjectsSelect() {
    // 历史遗留问题，从前这里是有处理逻辑的，现在无论何时都显示
    return true;
  }

  renderContent() {
    const { intl, ApplicationStore, form } = this.props;
    const { getFieldDecorator } = form;
    const { operation, projectData, editData, submitting } = ApplicationStore;
    const inputWidth = 512;
    return (
      <React.Fragment>
        <Form layout="vertical" className="rightForm" style={{ width: 512 }}>
          {operation === 'create' && !editData &&
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('applicationCategory', {
              initialValue: 'application',
            })(
              <RadioGroup label={<FormattedMessage id={`${intlPrefix}.category`} />} className="c7n-iam-application-radiogroup">
                {
                  ['application', 'combination-application'].map(value => <Radio value={value} key={value}>{intl.formatMessage({ id: `${intlPrefix}.category.${value.toLowerCase()}` })}</Radio>)
                }
              </RadioGroup>,
            )}
          </FormItem>
          }
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('applicationType', {
              initialValue: editData ? editData.applicationType : 'normal',
            })(
              <Select disabled={operation === 'edit'} getPopupContainer={that => that} label={<FormattedMessage id={`${intlPrefix}.type`} />} className="c7n-iam-application-radiogroup">
                {
                  ['normal', 'test'].map(value => <Option value={value} key={value}>{intl.formatMessage({ id: `${intlPrefix}.type.${value.toLowerCase()}` })}</Option>)
                }
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('code', {
              initialValue: editData ? editData.code : null,
              rules: [{
                required: true,
                whitespace: true,
                message: intl.formatMessage({ id: `${intlPrefix}.code.require.msg` }),
              }, {
                pattern: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
                message: intl.formatMessage({ id: `${intlPrefix}.code.format.msg` }),
              }, {
                validator: this.checkCode,
              }],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                disabled={operation === 'edit'}
                autoComplete="off"
                label={<FormattedMessage id={`${intlPrefix}.code`} />}
                style={{ width: inputWidth }}
                ref={(e) => { this.createFocusInput = e; }}
                maxLength={14}
                showLengthInfo={false}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              initialValue: editData ? editData.name : null,
              rules: [{
                required: true,
                message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
              }, {
                pattern: /^[^\s]*$/,
                message: intl.formatMessage({ id: `${intlPrefix}.whitespace.msg` }),
              }, {
                validator: this.checkName,
              }],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                autoComplete="off"
                label={<FormattedMessage id={`${intlPrefix}.name`} />}
                style={{ width: inputWidth }}
                ref={(e) => { this.editFocusInput = e; }}
                maxLength={14}
                showLengthInfo={false}
              />,
            )}
          </FormItem>
          {this.shouldShowProjectsSelect() && <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('projectId', {
              initialValue: editData && editData.projectId !== 0 && editData.projectId,
            })(
              <Select
                label={<FormattedMessage id={`${intlPrefix}.assignment`} />}
                className="c7n-iam-application-radiogroup"
                getPopupContainer={that => that}
                filterOption={(input, option) => {
                  const childNode = option.props.children;
                  if (childNode && React.isValidElement(childNode)) {
                    return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }
                  return false;
                }}
                disabled={(editData && !!editData.projectId)}
                allowClear
                filter
              >
                {
                  projectData.map(({ id, name, code }) => <Option value={id} key={id} title={name}>
                    <Tooltip title={code} placement="right" align={{ offset: [20, 0] }}>
                      <span style={{ display: 'inline-block', width: '100%' }}>{name}</span>
                    </Tooltip>
                  </Option>)
                }
              </Select>,
            )}
          </FormItem>}
        </Form>
      </React.Fragment>
    );
  }

  getTreeTableColumns = () => {
    const { intl } = this.props;
    return [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'applicationName',
      width: '30%',
      render: (text, record) => (<StatusTag mode="icon" name={text} iconType={record.applicationCategory === 'application' ? 'application_-general' : 'grain'} />),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'applicationCode',
      key: 'applicationCode',
      width: '15%',
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.application-type`} />,
      dataIndex: 'applicationType',
      // filters: [],
      // filteredValue: filters.name || [],
      width: '20%',
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {intl.formatMessage({ id: `${intlPrefix}.type.${text}` })}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.project-name`} />,
      dataIndex: 'projectName',
      // width: '15%',
      render: (text, record) => (
        <div>
          { text && <div className="c7n-iam-application-name-avatar">
            {
              record.projectImageUrl ? <img src={record.projectImageUrl} alt="avatar" style={{ width: '100%' }} /> :
              <React.Fragment>{text.split('')[0]}</React.Fragment>
            }
          </div>
          }

          <MouseOverWrapper text={text} width={0.2}>
            {text}
          </MouseOverWrapper>
        </div>
      ),
    }, {
      title: <FormattedMessage id="status" />,
      dataIndex: 'applicationEnabled',
      width: '15%',
      key: 'applicationEnabled',
      render: applicationEnabled => (<StatusTag mode="icon" name={intl.formatMessage({ id: applicationEnabled ? 'enable' : 'disable' })} colorCode={applicationEnabled ? 'COMPLETED' : 'DISABLE'} />),
    }];
  };

  getListTableColumns = () => [{
    title: <FormattedMessage id={`${intlPrefix}.name`} />,
    dataIndex: 'name',
    width: '15%',
    render: text => (
      <MouseOverWrapper text={text} width={0.1}>
        {text}
      </MouseOverWrapper>
    ),
  }, {
    title: <FormattedMessage id={`${intlPrefix}.code`} />,
    dataIndex: 'code',
    width: '15%',
    render: text => (
      <MouseOverWrapper text={text} width={0.1}>
        {text}
      </MouseOverWrapper>
    ),
  }, {
    title: <FormattedMessage id={`${intlPrefix}.count`} />,
    dataIndex: 'appCount',
    width: '15%',
  }];

  getAddTableColumns = () => {
    const { intl } = this.props;
    return [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      width: '20%',
      render: text => (
        <MouseOverWrapper text={text} width={0.15}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'code',
      width: '15%',
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.application-type`} />,
      dataIndex: 'applicationType',
      // filters: [],
      // filteredValue: filters.name || [],
      width: '20%',
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {intl.formatMessage({ id: `${intlPrefix}.type.${text}` })}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.project-name`} />,
      dataIndex: 'projectName',
      // width: '15%',
      render: (text, record) => (
        <div>
          { text && <div className="c7n-iam-application-name-avatar">
            {
              record.imageUrl ? <img src={record.imageUrl} alt="avatar" style={{ width: '100%' }} /> :
              <React.Fragment>{text.split('')[0]}</React.Fragment>
            }
          </div>
          }

          <MouseOverWrapper text={text} width={0.2}>
            {text}
          </MouseOverWrapper>
        </div>
      ),
    }];
  };


  handleListPageChange = (pagination, filters, sorter, params) => {
    this.props.ApplicationStore.loadListData(pagination, filters, sorter, params);
  };

  renderApplicationTreeTable = () => {
    const columns = this.getTreeTableColumns();
    const { ApplicationStore, intl } = this.props;
    const { listParams, listLoading, applicationTreeData } = ApplicationStore;
    return <Table
      pagination={false}
      columns={columns}
      dataSource={applicationTreeData}
      rowKey="path"
      className="c7n-iam-application-tree-table"
      filters={false}
      filterBar={false}
      loading={listLoading}
      filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
    />;
  };

  renderApplicationListTable = () => {
    const columns = this.getListTableColumns();
    const { ApplicationStore, intl } = this.props;
    const { listPagination, listParams, listLoading, applicationListData } = ApplicationStore;
    return <Table
      pagination={listPagination}
      columns={columns}
      dataSource={applicationListData}
      rowKey="id"
      filters={listParams}
      onChange={this.handleListPageChange}
      loading={listLoading}
      filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
    />;
  };

  renderTableTab = () => {
    const { operation, editData } = this.props.ApplicationStore;
    if (operation === 'edit' && editData.applicationCategory === 'combination-application') {
      return <Tabs defaultActiveKey="1" animated={false} style={{ marginBottom: 24 }}>
        <TabPane tab="应用树" key="1">{this.renderApplicationTreeTable()}</TabPane>
        <TabPane tab="应用清单" key="2">{this.renderApplicationListTable()}</TabPane>
      </Tabs>;
    }
    return null;
  };

  handleSidebarClose = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.closeSidebar();
  };

  handleAddSubmit = () => {
    const { ApplicationStore: { selectedRowKeys, editData }, ApplicationStore } = this.props;
    ApplicationStore.setSubmitting(true);
    ApplicationStore.addToCombination(editData.id, selectedRowKeys).then((data) => {
      ApplicationStore.setSubmitting(false);
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.refresh();
        ApplicationStore.closeSidebar();
        Choerodon.prompt('添加成功');
      }
    }).catch((err) => {
      ApplicationStore.setSubmitting(false);
      Choerodon.handleResponseError(err);
    });
  };

  renderSidebar = () => {
    const { ApplicationStore } = this.props;
    const { sidebarVisible, submitting } = ApplicationStore;
    return <Sidebar
      title={<FormattedMessage id={`${intlPrefix}.sidebar.title`} />}
      visible={sidebarVisible}
      onCancel={this.handleSidebarClose}
      onOk={this.handleAddSubmit}
      okText={<FormattedMessage id="add" />}
      className="c7n-iam-project-sidebar"
      confirmLoading={submitting}
    >
      {this.renderSidebarContent()}
    </Sidebar>;
  };

  changeSelects = (selectedRowKeys) => {
    const { ApplicationStore } = this.props;
    ApplicationStore.setSelectedRowKeys(selectedRowKeys);
  };

  handleAddListPageChange = (id, pagination) => {
    this.props.ApplicationStore.loadAddListData(id, pagination);
  };

  renderSidebarContent = () => {
    const { ApplicationStore: { selectedRowKeys, editData, addListLoading, addListPagination, getAddListDataSource }, intl } = this.props;
    const columns = this.getAddTableColumns();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.changeSelects,
    };
    return (
      <Content
        code={`${intlPrefix}.add`}
        className="sidebar-content"
        values={{
          name: editData && editData.name,
        }}
      >
        <Table
          pagination={false}
          columns={columns}
          dataSource={getAddListDataSource}
          rowKey={record => record.id}
          // filters={listParams}
          rowSelection={rowSelection}
          // onChange={this.handleAddListPageChange}
          loading={addListLoading}
          filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
        />
      </Content>
    );
  };

  render() {
    const { AppState, ApplicationStore: { operation, submitting, editData } } = this.props;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    const contentInfo = this.getSidebarContentInfo(operation);
    const type = menuType.type;
    return (
      <Page
        service={[
          'iam-service.application.pagingQuery',
          'iam-service.application.create',
          'iam-service.application.types',
          'iam-service.application.update',
          'iam-service.application.disable',
          'iam-service.application.enabled',
        ]}
      >
        <Header
          title={operation === 'create' ? '创建应用' : '修改应用'}
          backPath={`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(menuType.name)}&organizationId=${orgId}`}
        >
          {
            editData && editData.applicationCategory === 'combination-application' &&
            <Permission
              service={['iam-service.application.update']}
              type={type}
              organizationId={orgId}
            >
              <Button
                onClick={this.handleAddApplication}
                icon="playlist_add"
              >
                添加应用
              </Button>
            </Permission>
          }
        </Header>
        <Content
          {...contentInfo}
          className="c7n-iam-application"
        >
          {this.renderContent()}
          {this.renderTableTab()}
          <Button style={{ marginRight: 10 }} loading={submitting} onClick={this.handleSubmit} type="primary" funcType="raised"><FormattedMessage id={operation === 'create' ? 'create' : 'save'} /></Button>
          <Button onClick={() => this.props.history.push(`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(menuType.name)}&organizationId=${orgId}`)} funcType="raised">取消</Button>
          {this.renderSidebar()}
        </Content>
      </Page>
    );
  }
}

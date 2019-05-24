import React, { Component } from 'react';
import remove from 'lodash/remove';
import { Button, Form, Table, Tooltip, Radio, Select, Input } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import './Application.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import AddSider from './AddSider';

const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;
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

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.loadApplications();
  };

  checkCode = (rule, value, callback) => {
    const { ApplicationStore, intl } = this.props;
    const params = { code: value };
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

  checkName = (rule, value, callback) => {
    const { ApplicationStore, intl, ApplicationStore: { editData } } = this.props;
    const params = { name: value };
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

  handleSubmit = (e) => {
    e.preventDefault();
    const { ApplicationStore, AppState: { currentMenuType } } = this.props;
    const orgId = currentMenuType.id;
    const orgName = currentMenuType.name;
    
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (!err) {
        const { ApplicationStore: { selectedRowKeys }, history, intl } = this.props;
        const { applicationCategory, code, name, applicationType, projectId } = value;
        const isCombine = applicationCategory === 'combination-application';
        const data = {
          applicationCategory,
          code,
          name: name.trim(),
          applicationType: !isCombine ? applicationType : undefined,
          projectId: !isCombine ? projectId : undefined,
          descendantIds: isCombine ? selectedRowKeys : undefined,
        };
        ApplicationStore.setSubmitting(true);
        ApplicationStore.createApplication(data)
          .then((res) => {
            ApplicationStore.setSubmitting(false);
            if (!res.failed) {
              history.push(`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(orgName)}`);
              Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
              ApplicationStore.loadData();
            } else {
              Choerodon.prompt(res.message);
            }
          }).catch((error) => {
            ApplicationStore.setSubmitting(false);
            Choerodon.handleResponseError(error);
          });
      }
    });
  };

  handleAddApplication = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.showSidebar();
  };

  handleSiderOk = (selections) => {
    const { ApplicationStore } = this.props;
    ApplicationStore.setSelectedRowKeys(selections);
    ApplicationStore.closeSidebar();
  }

  handleSiderCancel = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.closeSidebar();
  }

  handleDelete = (record) => {
    const { ApplicationStore } = this.props;
    const { selectedRowKeys } = ApplicationStore;
    remove(selectedRowKeys, v => v === record.id);
    ApplicationStore.setSelectedRowKeys(selectedRowKeys);
  }

  renderForm() {
    const { intl, ApplicationStore, form } = this.props;
    const { getFieldDecorator } = form;
    const { projectData, editData, submitting } = ApplicationStore;
    const inputWidth = 512;
    return (
      <React.Fragment>
        <Form layout="vertical" className="rightForm" style={{ width: 512 }}>
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
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('code', {
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
          {
            this.props.form.getFieldValue('applicationCategory') !== 'combination-application' && (
              <React.Fragment>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('applicationType', {
                    initialValue: 'normal',
                  })(
                    <RadioGroup label={<FormattedMessage id={`${intlPrefix}.type`} />} className="c7n-iam-application-radiogroup">
                      {
                        ['normal', 'test'].map(value => <Radio value={value} key={value}>{intl.formatMessage({ id: `${intlPrefix}.type.${value.toLowerCase()}` })}</Radio>)
                      }
                    </RadioGroup>,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('projectId', {
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
                      allowClear
                      filter
                    >
                      {
                        projectData.map(({ id, name, code }) => (
                          <Option value={id} key={id} title={name}>
                            <Tooltip title={code} placement="right" align={{ offset: [20, 0] }}>
                              <span style={{ display: 'inline-block', width: '100%' }}>{name}</span>
                            </Tooltip>
                          </Option>
                        ))
                      }
                    </Select>,
                  )}
                </FormItem>
              </React.Fragment>
            )
          }
        </Form>
      </React.Fragment>
    );
  }

  renderTable = () => {
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      width: '160px',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'code',
      key: 'applicationCode',
      render: text => (
        <MouseOverWrapper text={text} width={0.1}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      dataIndex: 'id',
      width: '50px',
      key: 'id',
      render: (text, record) => (
        <div>
          <Tooltip
            title={<FormattedMessage id="delete" />}
            placement="bottom"
          >
            <Button
              shape="circle"
              size="small"
              onClick={e => this.handleDelete(record)}
              icon="delete"
            />
          </Tooltip>
        </div>
      ),
    }];
    const { ApplicationStore, intl } = this.props;
    const { listParams, listLoading, applicationTreeData, getAddListDataSource, selectedRowKeys } = ApplicationStore;
    const data = getAddListDataSource;
    const filteredData = data.filter(v => selectedRowKeys.includes(v.id));
    return (
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="path"
        className="c7n-iam-application-tree-table"
        filters={false}
        filterBar={false}
        loading={listLoading}
        filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
      />
    );
  };

  renderTableBlock = () => {
    if (this.props.form.getFieldValue('applicationCategory') === 'combination-application') {
      return (
        <div style={{ width: 512, paddingBottom: 42, marginBottom: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <h3 style={{ marginTop: 24, marginBottom: 10 }}>子应用</h3>
          {this.renderTable()}
        </div>
      );
    }
    return null;
  };

  renderSider = () => {
    const { ApplicationStore } = this.props;
    const { sidebarVisible, submitting, getAddListDataSource, selectedRowKeys } = ApplicationStore;
    if (!sidebarVisible) return null;
    return (
      <AddSider
        data={getAddListDataSource}
        selections={selectedRowKeys.slice()}
        onOk={this.handleSiderOk}
        onCancel={this.handleSiderCancel}
      />
    );
  };

  render() {
    const { AppState, ApplicationStore: { submitting } } = this.props;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    return (
      <Page>
        <Header
          title="创建应用"
          backPath={`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(menuType.name)}&organizationId=${orgId}`}
        />
        <Content
          title="创建应用"
          description="请在此输入应用的名称、编码，选择项目类型。同时您可以为应用分配开发项目，平台会为您在对应项目下创建git代码库。注意：一旦您分配了开发项目就不能再次修改开发项目，请谨慎操作。"
          link="#"
          className="c7n-iam-application"
        >
          {this.renderForm()}
          {
            this.props.form.getFieldValue('applicationCategory') === 'combination-application' && (
              <Button
                onClick={this.handleAddApplication}
                icon="playlist_add"
                funcType="raised"
                style={{ color: '#3f51b5' }}
              >
                添加子应用
              </Button>
            )
          }
          {this.renderTableBlock()}
          <Button style={{ marginRight: 10 }} loading={submitting} onClick={this.handleSubmit} type="primary" funcType="raised"><FormattedMessage id="create" /></Button>
          <Button onClick={() => this.props.history.push(`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(menuType.name)}&organizationId=${orgId}`)} funcType="raised">取消</Button>
          {this.renderSider()}
        </Content>
      </Page>
    );
  }
}

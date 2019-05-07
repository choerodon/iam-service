import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Table, Tooltip, Modal, Input } from 'choerodon-ui';
import { axios, Content, Header, Page, Permission } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import './ProjectType.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';

const intlPrefix = 'global.project-type';

const { Sidebar } = Modal;

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
export default class ProjectType extends Component {
  handleRefresh = () => {
    const { ProjectTypeStore } = this.props;
    ProjectTypeStore.loadData();
  };

  handleTableChange = (pagination, filters, sort, params) => {
    this.fetchData(pagination, filters, sort, params);
  };

  handleCancel = () => {
    this.props.ProjectTypeStore.hideSideBar();
  };

  handleOk = () => {
    const { form, intl, ProjectTypeStore: { sidebarType }, ProjectTypeStore } = this.props;
    form.validateFields((error, values, modify) => {
      Object.keys(values).forEach((key) => {
        // 去除form提交的数据中的全部前后空格
        if (typeof values[key] === 'string') values[key] = values[key].trim();
      });
      if (!error) {
        if (modify && sidebarType === 'edit') {
          ProjectTypeStore.updateData(values).then((data) => {
            this.handleRefresh();
            Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          });
        } else if (sidebarType === 'create') {
          ProjectTypeStore.createType(values).then((data) => {
            this.handleRefresh();
            Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
          });
        }
        ProjectTypeStore.hideSideBar();
      }
    });
  };

  editCard(record) {
    const { ProjectTypeStore, form } = this.props;
    ProjectTypeStore.setEditData(record);
    ProjectTypeStore.setSidebarType('edit');
    ProjectTypeStore.showSideBar();
    form.resetFields();
    setTimeout(() => {
      this.editFocusInput.input.focus();
    }, 10);
  }

  fetchData(pagination, filters, sort, params) {
    this.props.ProjectTypeStore.loadData(pagination, filters, sort, params);
  }

  componentDidMount() {
    const { ProjectTypeStore } = this.props;
    ProjectTypeStore.loadData();
  }

  checkCode = (rule, value, callback) => {
    const { ProjectTypeStore: { editData } } = this.props;
    const validValue = this.props.form.getFieldValue('code');
    const params = { code: validValue };
    if (validValue === editData.code) callback();
    axios.post('/iam/v1/projects/types/check', JSON.stringify(params)).then((mes) => {
      if (mes.failed) {
        const { intl } = this.props;
        callback(intl.formatMessage({ id: `${intlPrefix}.code.exist.msg` }));
      } else {
        callback();
      }
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator }, intl,
      ProjectTypeStore: { editData: { code, name, description }, sidebarType },
    } = this.props;
    return (
      <Content
        className="project-type-siderbar-content"
        code={`${intlPrefix}.${sidebarType}`}
        values={{ name }}
      >
        <Form>
          <FormItem {...formItemLayout}>
            {
              getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.code.required` }),
                  }, {
                    pattern: /^[a-zA-Z]([-_/a-zA-Z0-9.])*$/,
                    message: intl.formatMessage({ id: `${intlPrefix}.code.pattern.msg` }),
                  }, {
                    validator: this.checkCode,
                  },
                ],
                validateTrigger: 'onBlur',
                initialValue: sidebarType === 'edit' ? code : null,
              })(
                <Input
                  autoComplete="off"
                  label={<FormattedMessage id={`${intlPrefix}.table.code`} />}
                  style={{ width: inputWidth }}
                  ref={(e) => {
                    this.editFocusInput = e;
                  }}
                  disabled={sidebarType === 'edit'}
                  maxLength={30}
                  showLengthInfo={false}
                />,
              )
            }
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
                initialValue: sidebarType === 'edit' ? name : null,
              })(
                <Input
                  autoComplete="off"
                  label={<FormattedMessage id={`${intlPrefix}.table.name`} />}
                  style={{ width: inputWidth }}
                  ref={(e) => {
                    this.editFocusInput = e;
                  }}
                  maxLength={30}
                  showLengthInfo={false}
                />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout}>
            {
              getFieldDecorator('description', {
                initialValue: sidebarType === 'edit' ? description : null,
              })(
                <Input
                  autoComplete="off"
                  label={<FormattedMessage id={`${intlPrefix}.table.description`} />}
                  style={{ width: inputWidth }}
                  maxLength={30}
                  showLengthInfo={false}
                />,
              )
            }
          </FormItem>
        </Form>
      </Content>
    );
  }

  getTableColumns() {
    const { intl, ProjectTypeStore: { filters } } = this.props;
    return [
      {
        title: <FormattedMessage id={`${intlPrefix}.table.name`} />,
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        filters: [],
        filteredValue: filters.name || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.18}>
            {text}
          </MouseOverWrapper>
        ),
      }, {
        title: <FormattedMessage id={`${intlPrefix}.table.code`} />,
        dataIndex: 'code',
        key: 'code',
        width: '20%',
        filters: [],
        filteredValue: filters.code || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.18}>
            {text}
          </MouseOverWrapper>
        ),
      }, {
        title: <FormattedMessage id={`${intlPrefix}.table.description`} />,
        dataIndex: 'description',
        key: 'description',
        render: text => (
          <MouseOverWrapper text={text} width={0.45}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: '',
        width: 100,
        key: 'action',
        align: 'right',
        render: (text, record) => (
          <Permission service={['iam-service.project-type.update']}>
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
          </Permission>
        ),
      },
    ];
  }

  handleCreateType = () => {
    const { ProjectTypeStore, form } = this.props;
    form.resetFields();
    ProjectTypeStore.setSidebarType('create');
    ProjectTypeStore.showSideBar();
  };

  render() {
    const { AppState, ProjectTypeStore, intl } = this.props;
    const { pagination, params, loading, projectTypeData, sidebarVisible, sidebarType } = ProjectTypeStore;
    return (
      <Page
        service={[
          'iam-service.project-type.update',
          'iam-service.project-type.create',
          'iam-service.project-type.pagingQuery',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Permission service={['iam-service.project-type.create']}>
            <Button
              onClick={this.handleCreateType}
              icon="playlist_add"
            >
              <FormattedMessage id="global.project-type.create" />
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
          <Table
            loading={loading}
            columns={this.getTableColumns()}
            dataSource={projectTypeData}
            pagination={pagination}
            filters={params}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={<FormattedMessage id={`${intlPrefix}.sidebar.${sidebarType}.title`} />}
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

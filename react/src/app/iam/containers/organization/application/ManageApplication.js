import React, { Component } from 'react';
import get from 'lodash/get';
import { Button, Form, Table, Tooltip, Icon } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page, axios } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import './Application.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import AddSider from './AddSider';

const intlPrefix = 'organization.application';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  constructor(props) {
    super(props);
    this.id = get(props, 'match.params.applicationId', undefined);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    if (!this.id) return;
    const { ApplicationStore } = this.props;
    ApplicationStore.getDetailById(this.id);
  }

  handleClickAddApplication = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.showSidebar();
  }

  handleopenTab = (record, operation) => {
    const { ApplicationStore } = this.props;
    ApplicationStore.setEditData(record);
    ApplicationStore.showSidebar();
  };

  handleEnable = (record) => {
    const { ApplicationStore } = this.props;
    if (record.enabled) {
      ApplicationStore.disableApplication(record.id).then(() => {
        ApplicationStore.loadData();
      });
    } else {
      ApplicationStore.enableApplication(record.id).then(() => {
        ApplicationStore.loadData();
      });
    }
  };

  handlePageChange = (pagination, filters, sorter, params) => {
    const { ApplicationStore } = this.props;
    ApplicationStore.loadData(pagination, filters, sorter, params);
  };

  handleSaveMsg = (selections) => {
    const { ApplicationStore } = this.props;
    const { AppState: { currentMenuType: { organizationId } } } = this.props;
    const unHandleData = ApplicationStore.applicationData.slice();
    const originSelections = unHandleData.map(v => v.id);
    const needDelete = originSelections.filter(v => !selections.includes(v));
    const needAdd = selections.filter(v => !originSelections.includes(v));
    if (needAdd.length && needDelete.length) {
      Promise.all([ApplicationStore.addToCombination(this.id, needAdd), axios.post(`/iam/v1/organizations/${organizationId}/applications/${this.id}/delete_combination`, needDelete)])
        .then(([res1, res2]) => {
          ApplicationStore.closeSidebar();
          this.forceUpdate();
          this.refresh();
        });
    } else if (needAdd.length && !needDelete.length) {
      ApplicationStore.addToCombination(this.id, selections)
        .then(() => {
          ApplicationStore.closeSidebar();
          this.forceUpdate();
          this.refresh();
        });
    } else if (!needAdd.length && needDelete.length) {
      axios.post(`/iam/v1/organizations/${organizationId}/applications/${this.id}/delete_combination`, needDelete)
        .then(() => {
          ApplicationStore.closeSidebar();
          this.forceUpdate();
          this.refresh();
        });
    } else {
      ApplicationStore.closeSidebar();
    }
  }

  handleCancelSider = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.closeSidebar();
  }

  handleManage = (record) => {
    const { AppState: { currentMenuType: { name, id } }, history } = this.props;
    history.push(`/iam/application/manage/${record.id}?type=organization&id=${id}&name=${encodeURIComponent(name)}`);
  }

  handleDelete = (idArr) => {
    const { AppState: { currentMenuType: { organizationId } } } = this.props;
    axios.post(`/iam/v1/organizations/${organizationId}/applications/${this.id}/delete_combination`, idArr)
      .then(() => {
        this.refresh();
      });
  }

  render() {
    const { ApplicationStore: { filters, pagination, params, data }, AppState, intl, ApplicationStore, ApplicationStore: { applicationData } } = this.props;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    const unHandleData = ApplicationStore.applicationData.slice();
    const selections = unHandleData.map(v => v.id);
    const hasChild = unHandleData.some(v => v.applicationCategory === 'combination-application' && v.descendants && v.descendants.length);
    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.name`} />,
        dataIndex: 'name',
        filters: [],
        filteredValue: filters.name || [],
        render: (text, record) => (
          <span
            style={{
              borderLeft: record.isFirst && hasChild ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
              paddingLeft: hasChild ? 20 : 'auto',
            }}
          >
            <Icon type={record.applicationCategory === 'combination-application' ? 'grain' : 'predefine'} style={{ marginRight: 5, verticalAlign: 'text-top' }} />
            {text}
          </span>
        ),
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.code`} />,
        dataIndex: 'code',
        key: 'code',
        width: '15%',
        filters: [],
        filteredValue: filters.code || [],
        render: (text, record) => {
          if (!record.isFirst) return null;
          return <span>{text}</span>;
        },
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.category`} />,
        dataIndex: 'applicationCategory',
        width: '10%',
        render: (category, record) => (!record.isFirst ? null : <FormattedMessage id={`${intlPrefix}.category.${category.toLowerCase()}`} />),
        filters: [{
          text: '组合应用',
          value: 'combination-application',
        }, {
          text: '普通应用',
          value: 'application',
        }],
        filteredValue: filters.applicationCategory || [],
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.application-type`} />,
        dataIndex: 'applicationType',
        filters: [{
          text: '开发应用',
          value: 'normal',
        }, {
          text: '测试应用',
          value: 'test',
        }],
        filteredValue: filters.applicationType || [],
        width: '10%',
        render: (text, record) => (
          !record.isFirst ? null
            : (
              <MouseOverWrapper text={text} width={0.2}>
                {text ? intl.formatMessage({ id: `${intlPrefix}.type.${text}` }) : ''}
              </MouseOverWrapper>
            )
        ),
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.project-name`} />,
        dataIndex: 'projectName',
        filters: [],
        filteredValue: filters.projectName || [],
        width: '20%',
        render: (text, record) => (
          !record.isFirst ? null
            : (
              <div>
                {
                  text && (
                    <div className="c7n-iam-application-name-avatar">
                      {
                        record.imageUrl ? (
                          <img src={record.imageUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                          <React.Fragment>{text.split('')[0]}</React.Fragment>
                        )
                      }
                    </div>
                  )
                }

                <MouseOverWrapper text={text} width={0.2}>
                  {text}
                </MouseOverWrapper>
              </div>
            )
        ),
      },
      {
        title: <FormattedMessage id="status" />,
        dataIndex: 'enabled',
        width: '10%',
        filters: [{
          text: intl.formatMessage({ id: 'enable' }),
          value: 'true',
        }, {
          text: intl.formatMessage({ id: 'disable' }),
          value: 'false',
        }],
        filteredValue: filters.enabled || [],
        key: 'enabled',
        render: (enabled, record) => (
          !record.isFirst ? null
            : (
              <span style={{ marginRight: 8, fontSize: '12px', lineHeight: '18px', padding: '2px 6px', background: record.enabled ? 'rgba(0, 191, 165, 0.1)' : 'rgba(244, 67, 54, 0.1)', color: record.enabled ? '#009688' : '#D50000', borderRadius: '2px', border: '1px solid', borderColor: record.enabled ? '#009688' : '#D50000' }}>
                {record.enabled ? '启用' : '停用'}
              </span>
            )
        ),
      },
      {
        title: '',
        key: 'action',
        width: '120px',
        align: 'right',
        render: (text, record) => (
          !record.isFirst ? null
            : (
              <Tooltip
                title={<FormattedMessage id="delete" />}
                placement="bottom"
              >
                <Button
                  shape="circle"
                  size="small"
                  onClick={e => this.handleDelete([record.id])}
                  icon="delete"
                />
              </Tooltip>
            )
        ),
      },
    ];

    return (
      <Page>
        <Header
          title="应用配置"
          backPath={`/iam/application?type=organization&id=${orgId}&name=${encodeURIComponent(menuType.name)}&organizationId=${orgId}`}
        >
          <Button
            onClick={this.handleClickAddApplication}
            icon="playlist_add"
          >
            添加子应用
          </Button>
          <Button
            icon="refresh"
            onClick={this.refresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          title={`组合应用"${data.name || ''}"的子应用`}
          description="您可以在此修改应用名称。如果此应用是组合应用，您可以在此查看此组合应用下子应用的信息，同时您还可以在此添加或删除此组合应用下的子应用。"
          link="#"
        >
          <Table
            pagination={pagination}
            columns={columns}
            dataSource={unHandleData}
            rowKey={record => record.id}
            filters={params.slice()}
            onChange={this.handlePageChange}
            loading={ApplicationStore.loading}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
            childrenColumnName="descendants"
          />
        </Content>
        {
          ApplicationStore.sidebarVisible ? (
            <AddSider
              onCancel={this.handleCancelSider}
              onOk={this.handleSaveMsg}
              id={this.id}
              selections={selections}
            />
          ) : null
        }
      </Page>
    );
  }
}

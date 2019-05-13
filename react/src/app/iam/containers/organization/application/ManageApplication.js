import React, { Component } from 'react';
import get from 'lodash/get';
import { Button, Form, Modal, Table, Tooltip, Radio, Select, Input } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page, Permission, stores } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import './Application.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import EditSider from './EditSider';

const intlPrefix = 'organization.application';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  constructor() {
    super();
    this.id = get(this, 'props.match.params.id', undefined);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { ApplicationStore } = this.props;
    const { id } = this;
    ApplicationStore.refresh();
  }

  handleopenTab = (record, operation) => {
    const { ApplicationStore, AppState: { currentMenuType: { name, id } } } = this.props;
    ApplicationStore.setEditData(record);
    ApplicationStore.setOperation(operation);
    // this.props.history.push(`/iam/application/manage/${operation === 'create' ? 0 : record.id}?type=organization&id=${id}&name=${encodeURIComponent(name)}`);
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
    this.props.ApplicationStore.loadData(pagination, filters, sorter, params);
  };

  handleSaveMsg = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.closeSidebar();
    ApplicationStore.loadData();
  }

  handleCancelSider = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.closeSidebar();
  }

  handleManage = (record) => {
    const { AppState: { currentMenuType: { name, id } } } = this.props;
    this.props.history.push(`/iam/application/manage/${record.id}?type=organization&id=${id}&name=${encodeURIComponent(name)}`);
  }

  render() {
    const { ApplicationStore: { filters, pagination, params }, AppState, intl, ApplicationStore, ApplicationStore: { applicationData } } = this.props;
    const menuType = AppState.currentMenuType;
    const orgId = menuType.id;
    const type = menuType.type;
    const columns = [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      // width: '10%',
      filters: [],
      filteredValue: filters.name || [],
      // render: text => (
      //   <MouseOverWrapper text={text} width={0.1}>
      //     {text}
      //   </MouseOverWrapper>
      // ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      filters: [],
      filteredValue: filters.code || [],
      // render: text => (
      //   <MouseOverWrapper text={text} width={0.1}>
      //     {text}
      //   </MouseOverWrapper>
      // ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.category`} />,
      dataIndex: 'applicationCategory',
      // width: '25%',
      render: category => (<StatusTag mode="icon" name={intl.formatMessage({ id: `${intlPrefix}.category.${category.toLowerCase()}` })} iconType={category === 'application' ? 'application_-general' : 'grain'} />),
      filters: [{
        text: '组合应用',
        value: 'combination-application',
      }, {
        text: '普通应用',
        value: 'application',
      }],
      filteredValue: filters.applicationCategory || [],
    }, {
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
      render: text => (
        <MouseOverWrapper text={text} width={0.2}>
          {intl.formatMessage({ id: `${intlPrefix}.type.${text}` })}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id={`${intlPrefix}.project-name`} />,
      dataIndex: 'projectName',
      filters: [],
      filteredValue: filters.projectName || [],
      width: '20%',
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
    }, {
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
      render: enabled => (<StatusTag mode="icon" name={intl.formatMessage({ id: enabled ? 'enable' : 'disable' })} colorCode={enabled ? 'COMPLETED' : 'DISABLE'} />),
    }, {
      title: '',
      key: 'action',
      width: '120px',
      align: 'right',
      render: () => (
        <Tooltip
          title={<FormattedMessage id="delete" />}
          placement="bottom"
        >
          <Button
            shape="circle"
            size="small"
            // onClick={e => this.handleopenTab(record, 'edit')}
            icon="delete"
          />
        </Tooltip>
      ),
    }];

    return (
      <Page>
        <Header title="应用配置">
          <Button
            onClick={this.handleOpenSider}
            icon="playlist_add"
          >
            创建子应用
          </Button>
        </Header>
        <Content
          title={`组合应用"deploy前端”的子应用`}
          description="您可以在此修改应用名称。如果此应用是组合应用，您可以在此查看此组合应用下子应用的信息，同时您还可以在此添加或删除此组合应用下的子应用。"
          link="#"
        >
          <Table
            pagination={pagination}
            columns={columns}
            dataSource={[]}
            rowKey={record => record.id}
            filters={params}
            onChange={this.handlePageChange}
            loading={ApplicationStore.loading}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
            expandedRowRender={this.renderExpandRowRender}
          />
        </Content>
      </Page>
    );
  }
}

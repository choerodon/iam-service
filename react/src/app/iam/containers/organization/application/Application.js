import React, { Component } from 'react';
import { Button, Form, Table, Tooltip, Icon, Modal, Spin, Input } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Action, Content, Header, Page, axios } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import './Application.scss';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import EditSider from './EditSider';
import { callbackify } from 'util';

const intlPrefix = 'organization.application';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  state = {
    curToken: '',
    createToken: false,
    hasToken: false,
    interfaceName: '',
    showTokenModal: false,
  };

  componentDidMount() {
    this.setState({
      curToken: '',
      hasToken: false,
      createToken: false,
      interfaceName: '',
      showTokenModal: false,
    });
    this.refresh();
  }

  refresh = () => {
    const { ApplicationStore } = this.props;
    ApplicationStore.refresh();
  }

  handleClickAddApplication = () => {
    const { AppState: { currentMenuType: { name, id } }, history } = this.props;
    history.push(`/iam/application/add?type=organization&id=${id}&name=${encodeURIComponent(name)}`);
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
    const { AppState: { currentMenuType: { name, id } }, history } = this.props;
    history.push(`/iam/application/manage/${record.id}?type=organization&id=${id}&name=${encodeURIComponent(name)}`);
  }

  handleToken = (record, hasToken) => {
    this.setState({ showTokenModal: true, interfaceName: record.name, hasToken });
    const { organizationId, id } = record;
    if (!hasToken) {
      axios.post(`/iam/v1/organizations/${organizationId}/applications/${id}/token`).then(res => {
        console.log('get token: ', res);
        this.setState({
          hasToken: true,
          curToken: res,
          createToken: true,
        })
      })
    } else {
      this.setState({
        hasToken: true,
        createToken: false,
        curToken: record.applicationToken,
      })
    }
  };


  render() {
    const { showTokenModal, interfaceName, hasToken, curToken, createToken } = this.state;
    const { ApplicationStore: { filters, pagination, params }, AppState, intl, ApplicationStore, ApplicationStore: { applicationData } } = this.props;
    const unHandleData = ApplicationStore.applicationData.slice();
    const hasChild = unHandleData.some(v => v.applicationCategory === 'combination-application' && v.descendants && v.descendants.length);
    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.name`} />,
        dataIndex: 'name',
        width: '25%',
        filters: [],
        filteredValue: filters.name || [],
        render: (text, record) => (
          <span
            style={{
              borderLeft: record.isFirst && hasChild ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
              paddingLeft: hasChild ? 20 : 'auto',
              display: 'inline-block',
              maxWidth: hasChild ? 'calc(100% - 50px)' : '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
        width: '10%',
        align: 'right',
        render: (text, record) => {
          if (!record.isFirst) {
            return null
          }
          const curRecordhasToken = record.applicationToken !== null;
          const actionDatas = [{
            icon: '',
            type: 'site',
            text: intl.formatMessage({id: 'modify'}),
            action: () => this.handleopenTab(record, 'edit'),
          }];
          if (record.applicationCategory === 'combination-application') {
            actionDatas.push({
              icon: '',
              type: 'site',
              text: intl.formatMessage({id: 'edit'}),
              action: () => this.handleManage(record),
            })
          }
          if (record.enabled) {
            actionDatas.push({
              icon: '',
              type: 'site',
              text: intl.formatMessage({id: 'disable'}),
              action: () => this.handleEnable(record),
            });
          } else {
            actionDatas.push({
              icon: '',
              type: 'site',
              text: intl.formatMessage({id: 'enable'}),
              action: () => this.handleEnable(record),
            });
          }
          actionDatas.push({
            icon: '',
            type: 'site',
            text: intl.formatMessage(
              {
                id: curRecordhasToken
                  ? `${intlPrefix}.view.token`
                  : `${intlPrefix}.create.and.view.token`
              }
            ),
            action: () => this.handleToken(record, curRecordhasToken),
          });
          return <Action data={actionDatas} />;
        }
      }
    ];

    
    // if (unHandleData.length) {
    //   unHandleData[0].descendants = [{ ...unHandleData[1], id: 1001, isFirst: false }, { ...unHandleData[1], id: 1002, isFirst: false }];
    // }

    return (
      <Page className="c7n-iam-application">
        <Header title="应用管理">
          <Button
            onClick={this.handleClickAddApplication}
            icon="playlist_add"
          >
            <FormattedMessage id={`${intlPrefix}.create`} />
          </Button>
          <Button
            icon="refresh"
            onClick={this.refresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={intlPrefix}
        >
          <Table
            pagination={pagination}
            columns={columns}
            dataSource={unHandleData}
            rowKey={record => record.__uuid__}
            filters={params.slice()}
            onChange={this.handlePageChange}
            loading={ApplicationStore.loading}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
            childrenColumnName="descendants"
            scroll={{ x: true }}
          />
          <Modal
            className='c7n-iam-application-token-modal'
            title={intl.formatMessage({ id: `${intlPrefix}.view.interface.token` }, {interfaceName})}
            visible={showTokenModal}
            okText={intl.formatMessage({ id: 'close' })}
            onCancel={() => {
              this.setState({ showTokenModal: false });
              if (createToken) {
                this.refresh();
              }
            }}
            onOk={() => {
              this.setState({ showTokenModal: false });
              if (createToken) {
                this.refresh();
              }
            }}
            center
          >
            <Spin spinning={!hasToken}>
              <Input
                copy
                readOnly={true}
                value={curToken}
                label="AccessToken"
              />
            </Spin>
          </Modal>
        </Content>
        {
          ApplicationStore.sidebarVisible ? (
            <EditSider
              onCancel={this.handleCancelSider}
              onOk={this.handleSaveMsg}
            />
          ) : null
        }
      </Page>
    );
  }
}

import React, { Component } from 'react';
import { Button, Modal, Table, Tooltip, Upload, Spin } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Action, axios, Content, Header, Page, Permission } from '@choerodon/boot';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import UserEdit from './UserEdit';
import './User.scss';
import StatusTag from '../../../components/statusTag';
import { handleFiltersParams } from '../../../common/util';

const { Sidebar } = Modal;
const intlPrefix = 'organization.user';

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class User extends Component {
  state = this.getInitState();

  getInitState() {
    return {
      submitting: false,
      open: false,
      status: 'create', // 'create' 'edit' 'upload'
      id: '',
      page: 1,
      isLoading: true,
      params: [],
      filters: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: '',
      },
      sort: 'id,desc',
      visible: false,
      fileLoading: false,
      selectedData: '',
    };
  }

  componentDidMount() {
    this.loadUser();
  }

  componentWillUnmount() {
    this.timer = 0;
  }

  handleRefresh = () => {
    this.setState(this.getInitState(), () => {
      this.loadUser();
    });
  };

  onEdit = (id) => {
    this.setState({
      visible: true,
      status: 'modify',
      selectedData: id,
    });
  };

  loadUser = (paginationIn, sortIn, filtersIn, paramsIn) => {
    const { AppState, UserStore } = this.props;
    const {
      pagination: paginationState,
      sort: sortState,
      filters: filtersState,
      params: paramsState,
    } = this.state;
    const { id } = AppState.currentMenuType;
    const pagination = paginationIn || paginationState;
    const sort = sortIn || sortState;
    const filters = filtersIn || filtersState;
    const params = paramsIn || paramsState;
    // 防止标签闪烁
    this.setState({ filters });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      UserStore.setUsers([]);
      this.setState({
        pagination: {
          total: 0,
        },
        params,
        sort,
      });
      return;
    }

    UserStore.loadUsers(
      id,
      pagination,
      sort,
      filters,
      params,
    ).then((data) => {
      UserStore.setUsers(data.list || []);
      this.setState({
        pagination: {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        },
        params,
        sort,
      });
    })
      .catch(error => Choerodon.handleResponseError(error));
  };

  handleCreate = () => {
    this.setState({
      visible: true,
      status: 'create',
    });
  };

  /*
  * 解锁
  * */
  handleUnLock = (record) => {
    const { AppState, UserStore, intl } = this.props;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    UserStore.unLockUser(organizationId, record.id).then(() => {
      Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.unlock.success` }));
      this.loadUser();
    }).catch((error) => {
      Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.unlock.failed` }));
    });
  };

  /*
  * 启用停用
  * */
  handleAble = (record) => {
    const { UserStore, AppState, intl } = this.props;
    const menuType = AppState.currentMenuType;
    const organizationId = menuType.id;
    if (record.enabled) {
      // 禁用
      UserStore.UnenableUser(organizationId, record.id, !record.enabled).then(() => {
        Choerodon.prompt(intl.formatMessage({ id: 'disable.success' }));
        this.loadUser();
      }).catch((error) => {
        Choerodon.prompt(intl.formatMessage({ id: 'disable.error' }));
      });
    } else {
      UserStore.EnableUser(organizationId, record.id, !record.enabled).then(() => {
        Choerodon.prompt(intl.formatMessage({ id: 'enable.success' }));
        this.loadUser();
      }).catch((error) => {
        Choerodon.prompt(intl.formatMessage({ id: 'enable.error' }));
      });
    }
  };

  /**
   * 重置用户密码
   * @param record
   */
  handleReset = (record) => {
    const { intl } = this.props;
    const { loginName } = record;
    const { UserStore, AppState } = this.props;
    const organizationId = AppState.currentMenuType.id;
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: intl.formatMessage({ id: `${intlPrefix}.reset.title` }),
      content: intl.formatMessage({ id: `${intlPrefix}.reset.content` }, { loginName }),
      onOk: () => UserStore.resetUserPwd(organizationId, record.id).then(({ failed, message }) => {
        if (failed) {
          Choerodon.prompt(message);
        } else {
          Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.reset.success` }));
        }
      }).catch(() => {
        Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.reset.failed` }));
      }),
    });
  }

  changeLanguage = (code) => {
    if (code === 'zh_CN') {
      return '简体中文';
    } else if (code === 'en_US') {
      return 'English';
    }
    return null;
  };

  handlePageChange(pagination, filters, { field, order }, params) {
    const sorter = [];
    if (field) {
      sorter.push(field);
      if (order === 'descend') {
        sorter.push('desc');
      }
    }
    this.loadUser(pagination, sorter.join(','), filters, params);
  }

  handleDownLoad = (organizationId) => {
    const { UserStore } = this.props;
    UserStore.downloadTemplate(organizationId).then((result) => {
      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const linkElement = document.getElementById('c7n-user-download-template');
      linkElement.setAttribute('href', url);
      linkElement.click();
    });
  };

  upload = (e) => {
    e.stopPropagation();
    const { UserStore } = this.props;
    const uploading = UserStore.getUploading;
    const { fileLoading } = this.state;
    if (uploading || fileLoading) {
      return;
    }
    const uploadElement = document.getElementsByClassName('c7n-user-upload-hidden')[0];
    uploadElement.click();
  };

  handleUpload = () => {
    this.handleUploadInfo(true);
    this.setState({
      visible: true,
      status: 'upload',
    });
  };

  /**
   *  application/vnd.ms-excel 2003-2007
   *  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 2010
   */
  getUploadProps = (organizationId) => {
    const { intl } = this.props;
    return {
      multiple: false,
      name: 'file',
      accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      action: organizationId && `${process.env.API_HOST}/iam/v1/organizations/${organizationId}/users/batch_import`,
      headers: {
        Authorization: `bearer ${Choerodon.getCookie('access_token')}`,
      },
      showUploadList: false,
      onChange: ({ file }) => {
        const { status, response } = file;
        const { fileLoading } = this.state;
        if (status === 'done') {
          this.handleUploadInfo(true);
        } else if (status === 'error') {
          Choerodon.prompt(`${response.message}`);
          this.setState({
            fileLoading: false,
          });
        }
        if (response && response.failed === true) {
          Choerodon.prompt(`${response.message}`);
          this.setState({
            fileLoading: false,
          });
        }
        if (!fileLoading) {
          this.setState({
            fileLoading: status === 'uploading',
          });
        }
      },
    };
  }

  handleSubmit = (e) => {
    this.editUser.handleSubmit(e);
  }

  handleUploadInfo = (immediately) => {
    const { UserStore, AppState: { currentMenuType, getUserId: userId } } = this.props;
    const { id: organizationId } = currentMenuType;

    const { fileLoading } = this.state;
    const uploadInfo = UserStore.getUploadInfo || {};
    if (uploadInfo.finished !== null && fileLoading) {
      this.setState({
        fileLoading: false,
      });
    }
    if (immediately) {
      UserStore.handleUploadInfo(organizationId, userId);
      return;
    }
    if (uploadInfo.finished !== null) {
      clearInterval(this.timer);
      return;
    }
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      UserStore.handleUploadInfo(organizationId, userId);
      this.loadUser();
    }, 2000);
  }

  getSidebarText() {
    const { submitting, status, fileLoading } = this.state;
    const { UserStore } = this.props;
    const uploading = UserStore.getUploading;
    if (submitting) {
      return <FormattedMessage id="loading" />;
    } else if (uploading) {
      return <FormattedMessage id="uploading" />;
    } else if (fileLoading) {
      return <FormattedMessage id={`${intlPrefix}.fileloading`} />;
    }
    return <FormattedMessage id={status} />;
  }

  getSpentTime = (startTime, endTime) => {
    const { intl } = this.props;
    const timeUnit = {
      day: intl.formatMessage({ id: 'day' }),
      hour: intl.formatMessage({ id: 'hour' }),
      minute: intl.formatMessage({ id: 'minute' }),
      second: intl.formatMessage({ id: 'second' }),
    };
    const spentTime = new Date(endTime).getTime() - new Date(startTime).getTime(); // 时间差的毫秒数
    // 天数
    const days = Math.floor(spentTime / (24 * 3600 * 1000));
    // 小时
    const leave1 = spentTime % (24 * 3600 * 1000); //  计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));
    // 分钟
    const leave2 = leave1 % (3600 * 1000); //  计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));
    // 秒数
    const leave3 = leave2 % (60 * 1000); //  计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000);
    const resultDays = days ? (days + timeUnit.day) : '';
    const resultHours = hours ? (hours + timeUnit.hour) : '';
    const resultMinutes = minutes ? (minutes + timeUnit.minute) : '';
    const resultSeconds = seconds ? (seconds + timeUnit.second) : '';
    return resultDays + resultHours + resultMinutes + resultSeconds;
  }

  getUploadInfo = () => {
    const { UserStore } = this.props;
    const { fileLoading } = this.state;
    const uploadInfo = UserStore.getUploadInfo || {};
    const uploading = UserStore.getUploading;
    const container = [];
    if (uploading) {
      container.push(this.renderLoading());
      this.handleUploadInfo();
      if (fileLoading) {
        this.setState({
          fileLoading: false,
        });
      }
    } else if (fileLoading) {
      container.push(this.renderLoading());
    } else if (!uploadInfo.noData) {
      const failedStatus = uploadInfo.finished ? 'detail' : 'error';
      container.push(
        <p key={`${intlPrefix}.upload.lasttime`}>
          <FormattedMessage id={`${intlPrefix}.upload.lasttime`} />
          {uploadInfo.beginTime}
          （<FormattedMessage id={`${intlPrefix}.upload.spendtime`} />
          {this.getSpentTime(uploadInfo.beginTime, uploadInfo.endTime)}）
        </p>,
        <p key={`${intlPrefix}.upload.time`}>
          <FormattedMessage
            id={`${intlPrefix}.upload.time`}
            values={{
              successCount: <span className="success-count">{uploadInfo.successfulCount || 0}</span>,
              failedCount: <span className="failed-count">{uploadInfo.failedCount || 0}</span>,
            }}
          />
          {uploadInfo.url && (
            <span className={`download-failed-${failedStatus}`}>
              <a href={uploadInfo.url}>
                <FormattedMessage id={`${intlPrefix}.download.failed.${failedStatus}`} />
              </a>
            </span>
          )}
        </p>,
      );
    } else {
      container.push(<p key={`${intlPrefix}.upload.norecord`}><FormattedMessage id={`${intlPrefix}.upload.norecord`} /></p>);
    }
    return (
      <div className="c7n-user-upload-container">
        {container}
      </div>
    );
  };

  renderLoading() {
    const { intl: { formatMessage } } = this.props;
    const { fileLoading } = this.state;
    return (
      <div className="c7n-user-uploading-container" key="c7n-user-uploading-container">
        <div className="loading">
          <Spin size="large" />
        </div>
        <p className="text">{formatMessage({
          id: `${intlPrefix}.${fileLoading ? 'fileloading' : 'uploading'}.text` })}
        </p>
        {!fileLoading && (<p className="tip">{formatMessage({ id: `${intlPrefix}.uploading.tip` })}</p>)}
      </div>
    );
  }

  renderUpload(organizationId, organizationName) {
    return (
      <Content
        code={`${intlPrefix}.upload`}
        values={{
          name: organizationName,
        }}
        className="sidebar-content"
      >
        <div style={{ width: '512px' }}>
          {this.getUploadInfo()}
        </div>
        <div style={{ display: 'none' }}>
          <Upload {...this.getUploadProps(organizationId)}>
            <Button className="c7n-user-upload-hidden" />
          </Upload>
        </div>
      </Content>);
  }


  renderSideTitle() {
    const { status } = this.state;
    switch (status) {
      case 'create':
        return <FormattedMessage id={`${intlPrefix}.create`} />;
      case 'modify':
        return <FormattedMessage id={`${intlPrefix}.modify`} />;
      case 'upload':
        return <FormattedMessage id={`${intlPrefix}.upload`} />;
      default:
        return '';
    }
  }

  renderSideBar() {
    const { selectedData, status, visible } = this.state;
    return (
      <UserEdit
        id={selectedData}
        visible={visible}
        edit={status === 'modify'}
        onRef={(node) => {
          this.editUser = node;
        }}
        OnUnchangedSuccess={() => {
          this.setState({
            visible: false,
            submitting: false,
          });
        }}
        onSubmit={() => {
          this.setState({
            submitting: true,
          });
        }}
        onSuccess={() => {
          this.setState({
            visible: false,
            submitting: false,
          });
          this.loadUser();
        }}
        onError={() => {
          this.setState({
            submitting: false,
          });
        }}
      />
    );
  }

  render() {
    const {
      UserStore: { getUsers, isLoading },
      AppState: { currentMenuType, getType },
      intl } = this.props;
    const { filters, pagination, visible, status, submitting, params } = this.state;
    const { id: organizationId, name: organizationName, type: menuType } = currentMenuType;

    let type;
    if (getType) {
      type = getType;
    } else if (sessionStorage.type) {
      type = sessionStorage.type;
    } else {
      type = menuType;
    }
    const data = getUsers.slice() || [];

    const columns = [
      {
        title: <FormattedMessage id={`${intlPrefix}.loginname`} />,
        dataIndex: 'loginName',
        key: 'loginName',
        width: '20%',
        filters: [],
        filteredValue: filters.loginName || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.15}>
            {text}
          </MouseOverWrapper>
        ),
      }, {
        title: <FormattedMessage id={`${intlPrefix}.realname`} />,
        key: 'realName',
        dataIndex: 'realName',
        width: '20%',
        filters: [],
        filteredValue: filters.realName || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.15}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id={`${intlPrefix}.source`} />,
        key: 'ldap',
        width: '20%',
        render: (text, record) => (
          record.ldap
            ? <FormattedMessage id={`${intlPrefix}.ldap`} />
            : <FormattedMessage id={`${intlPrefix}.notldap`} />
        ),
        filters: [
          {
            text: intl.formatMessage({ id: `${intlPrefix}.ldap` }),
            value: 'true',
          }, {
            text: intl.formatMessage({ id: `${intlPrefix}.notldap` }),
            value: 'false',
          },
        ],
        filteredValue: filters.ldap || [],
      },
      // {
      //   title: <FormattedMessage id={`${intlPrefix}.language`} />,
      //   dataIndex: 'language',
      //   key: 'language',
      //   width: '17%',
      //   render: (text, record) => (
      //     this.changeLanguage(record.language)
      //   ),
      //   filters: [
      //     {
      //       text: '简体中文',
      //       value: 'zh_CN',
      //     }, {
      //       text: 'English',
      //       value: 'en_US',
      //     },
      //   ],
      //   filteredValue: filters.language || [],
      // },
      {
        title: <FormattedMessage id={`${intlPrefix}.enabled`} />,
        key: 'enabled',
        dataIndex: 'enabled',
        width: '15%',
        render: text => (<StatusTag mode="icon" name={intl.formatMessage({ id: text ? 'enable' : 'disable' })} colorCode={text ? 'COMPLETED' : 'DISABLE'} />),
        filters: [
          {
            text: intl.formatMessage({ id: 'enable' }),
            value: 'true',
          }, {
            text: intl.formatMessage({ id: 'disable' }),
            value: 'false',
          },
        ],
        filteredValue: filters.enabled || [],
      }, {
        title: <FormattedMessage id={`${intlPrefix}.locked`} />,
        key: 'locked',
        width: '15%',
        render: (text, record) => (
          record.locked
            ? <FormattedMessage id={`${intlPrefix}.lock`} />
            : <FormattedMessage id={`${intlPrefix}.normal`} />
        ),
        filters: [
          {
            text: intl.formatMessage({ id: `${intlPrefix}.normal` }),
            value: 'false',
          },
          {
            text: intl.formatMessage({ id: `${intlPrefix}.lock` }),
            value: 'true',
          },
        ],
        filteredValue: filters.locked || [],
      }, {
        title: '',
        key: 'action',
        align: 'right',
        render: (text, record) => {
          const actionDatas = [{
            service: ['iam-service.organization-user.update'],
            icon: '',
            text: intl.formatMessage({ id: 'modify' }),
            action: this.onEdit.bind(this, record.id),
          }];
          if (record.enabled) {
            actionDatas.push({
              service: ['iam-service.organization-user.disableUser'],
              icon: '',
              text: intl.formatMessage({ id: 'disable' }),
              action: this.handleAble.bind(this, record),
            });
          } else {
            actionDatas.push({
              service: ['iam-service.organization-user.enableUser'],
              icon: '',
              text: intl.formatMessage({ id: 'enable' }),
              action: this.handleAble.bind(this, record),
            });
          }
          if (record.locked) {
            actionDatas.push({
              service: ['iam-service.organization-user.unlock'],
              icon: '',
              text: intl.formatMessage({ id: `${intlPrefix}.unlock` }),
              action: this.handleUnLock.bind(this, record),
            });
          }
          actionDatas.push({
            service: ['iam-service.organization-user.resetUserPassword'],
            icon: '',
            text: intl.formatMessage({ id: `${intlPrefix}.reset` }),
            action: this.handleReset.bind(this, record),
          });
          return <Action data={actionDatas} getPopupContainer={() => document.getElementsByClassName('page-content')[0]} />;
        },
      }];
    return (
      <Page
        service={[
          'iam-service.organization-user.create',
          'iam-service.organization-user.list',
          'iam-service.organization-user.query',
          'iam-service.organization-user.update',
          'iam-service.organization-user.delete',
          'iam-service.organization-user.disableUser',
          'iam-service.organization-user.enableUser',
          'iam-service.organization-user.unlock',
          'iam-service.organization-user.check',
          'iam-service.organization-user.resetUserPassword',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Permission
            service={['iam-service.organization-user.create']}
            type={type}
            organizationId={organizationId}
          >
            <Button
              onClick={this.handleCreate}
              icon="playlist_add"
            >
              <FormattedMessage id={`${intlPrefix}.create`} />
            </Button>
          </Permission>
          <Button
            onClick={this.handleDownLoad.bind(this, organizationId)}
            icon="get_app"
          >
            <FormattedMessage id={`${intlPrefix}.download.template`} />
            <a id="c7n-user-download-template" href="" onClick={(event) => { event.stopPropagation(); }} download="userTemplate.xlsx" />
          </Button>
          <Button
            icon="file_upload"
            onClick={this.handleUpload}
          >
            <FormattedMessage id={`${intlPrefix}.upload.file`} />
          </Button>
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
            dataSource={data}
            rowKey="id"
            onChange={this.handlePageChange.bind(this)}
            loading={isLoading}
            filters={params}
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
          />
          <Sidebar
            title={this.renderSideTitle()}
            visible={visible}
            okText={this.getSidebarText()}
            cancelText={<FormattedMessage id={status === 'upload' ? 'close' : 'cancel'} />}
            onOk={status === 'upload' ? this.upload : this.handleSubmit}
            onCancel={() => {
              this.setState({
                visible: false,
                selectedData: '',
              });
            }}
            confirmLoading={submitting}
          >
            {status === 'upload'
              ? this.renderUpload(organizationId, organizationName)
              : this.renderSideBar()
            }
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

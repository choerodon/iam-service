import React, { Component } from 'react';
import { runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Input, Modal, Table, Tooltip, Row, Col, Select, Icon } from 'choerodon-ui';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import StatusTag from '../../../components/statusTag';
import './Organization.scss';
import AvatarUploader from '../../../components/avatarUploader';

const ORGANIZATION_TYPE = 'organization';
const PROJECT_TYPE = 'project';
const { Sidebar } = Modal;
const Option = Select.Option;
const FormItem = Form.Item;
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
const intlPrefix = 'global.organization';
let timer;

@Form.create()
@withRouter
@injectIntl
@inject('AppState', 'HeaderStore')
@observer
export default class Organization extends Component {
  constructor(props) {
    super(props);
    this.editOrgFocusInput = React.createRef();
    this.creatOrgFocusInput = React.createRef();
    this.state = {
      selectLoading: true,
      isShowAvatar: false,
      imgUrl: null,
    };
  }

  componentWillMount() {
    this.loadOrganizations();
  }

  componentWillUnmount() {
    const { OrganizationStore } = this.props;
    clearTimeout(timer);
    OrganizationStore.setFilters();
    OrganizationStore.setParams();
  }

  handleRefresh = () => {
    const { OrganizationStore } = this.props;
    OrganizationStore.refresh();
  };

  loadOrganizations(pagination, filters, sort, params) {
    const { OrganizationStore } = this.props;
    OrganizationStore.loadData(pagination, filters, sort, params);
  }

  // 创建组织侧边
  createOrg = () => {
    const { form, OrganizationStore } = this.props;
    form.resetFields();
    this.setState({
      imgUrl: null,
    });
    runInAction(() => {
      OrganizationStore.setEditData({});
      OrganizationStore.show = 'create';
      OrganizationStore.showSideBar();
    });
    setTimeout(() => {
      this.creatOrgFocusInput.input.focus();
    }, 10);
  };

  handleEdit = (data) => {
    const { form, OrganizationStore } = this.props;
    form.resetFields();
    this.setState({
      imgUrl: data.imageUrl,
    });
    runInAction(() => {
      OrganizationStore.show = 'edit';
      OrganizationStore.setEditData(data);
      OrganizationStore.showSideBar();
    });
    setTimeout(() => {
      this.editOrgFocusInput.input.focus();
    }, 10);
  };

  showDetail = (data) => {
    const { OrganizationStore } = this.props;
    runInAction(() => {
      OrganizationStore.setEditData(data);
      OrganizationStore.loadOrgDetail(data.id).then((message) => {
        if (message) {
          Choerodon.prompt(message);
        }
      });
      OrganizationStore.show = 'detail';
    });
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { form, intl, OrganizationStore, HeaderStore, AppState } = this.props;
    if (OrganizationStore.show !== 'detail') {
      form.validateFields((err, values, modify) => {
        Object.keys(values).forEach((key) => {
          // 去除form提交的数据中的全部前后空格
          if (typeof values[key] === 'string') values[key] = values[key].trim();
        });
        const { loginName, realName, id } = AppState.getUserInfo;
        if (values.userId === `${loginName}${realName}`) values.userId = false;
        if (OrganizationStore.editData.imageUrl !== this.state.imgUrl) modify = true;
        if (!err) {
          OrganizationStore.createOrUpdateOrg(values, modify, this.state.imgUrl, HeaderStore)
            .then((message) => {
              OrganizationStore.hideSideBar();
              Choerodon.prompt(intl.formatMessage({ id: message }));
            });
        }
      });
    } else {
      OrganizationStore.hideSideBar();
    }
  };

  handleCancelFun = () => {
    const { OrganizationStore } = this.props;
    OrganizationStore.hideSideBar();
  };

  handleDisable = ({ enabled, id }) => {
    const { intl, OrganizationStore, HeaderStore, AppState } = this.props;
    const userId = AppState.getUserId;
    OrganizationStore.toggleDisable(id, enabled)
      .then(() => {
        Choerodon.prompt(intl.formatMessage({ id: enabled ? 'disable.success' : 'enable.success' }));
        HeaderStore.axiosGetOrgAndPro(sessionStorage.userId || userId);
      }).catch(Choerodon.handleResponseError);
  };

  /**
   * 组织编码校验
   * @param rule 表单校验规则
   * @param value 组织编码
   * @param callback 回调函数
   */
  checkCode = (rule, value, callback) => {
    const { intl, OrganizationStore } = this.props;
    OrganizationStore.checkCode(value)
      .then(({ failed }) => {
        if (failed) {
          callback(intl.formatMessage({ id: 'global.organization.onlymsg' }));
        } else {
          callback();
        }
      });
  };

  handleSelectFilter = (value) => {
    this.setState({
      selectLoading: true,
    });

    const queryObj = {
      param: value,
      sort: 'id',
      organization_id: 0,
    };

    if (timer) {
      clearTimeout(timer);
    }

    if (value) {
      timer = setTimeout(() => this.loadUsers(queryObj), 300);
    } else {
      return this.loadUsers(queryObj);
    }
  }

  // 加载全平台用户信息
  loadUsers = (queryObj) => {
    const { OrganizationStore } = this.props;
    OrganizationStore.loadUsers(queryObj).then((data) => {
      OrganizationStore.setUsersData((data.list || []).slice());
      this.setState({
        selectLoading: false,
      });
    });
  }

  /**
   * 获取组织所有者下拉选项
   * @returns {any[]}
   */
  getOption() {
    const { OrganizationStore } = this.props;
    const usersData = OrganizationStore.getUsersData;
    return usersData && usersData.length > 0 ? (
      usersData.map(({ id, loginName, realName }) => (
        <Option key={id} value={id}>{loginName}{realName}</Option>
      ))
    ) : null;
  }

  renderSidebarTitle() {
    const { show } = this.props.OrganizationStore;
    switch (show) {
      case 'create':
        return 'global.organization.create';
      case 'edit':
        return 'global.organization.modify';
      case 'detail':
        return 'global.organization.detail';
      default:
        return '';
    }
  }

  // 渲染侧边栏成功按钮文字
  renderSidebarOkText() {
    const { OrganizationStore: { show } } = this.props;
    if (show === 'create') {
      return <FormattedMessage id="create" />;
    } else if (show === 'edit') {
      return <FormattedMessage id="save" />;
    } else {
      return <FormattedMessage id="close" />;
    }
  }

  renderSidebarDetail() {
    const { intl: { formatMessage }, OrganizationStore: { editData, partDetail } } = this.props;
    const infoList = [{
      key: formatMessage({ id: `${intlPrefix}.name` }),
      value: editData.name,
    }, {
      key: formatMessage({ id: `${intlPrefix}.code` }),
      value: editData.code,
    }, {
      key: formatMessage({ id: `${intlPrefix}.region` }),
      value: editData.address ? editData.address : '无',
    }, {
      key: formatMessage({ id: `${intlPrefix}.project.creationDate` }),
      value: editData.creationDate,
    }, {
      key: formatMessage({ id: `${intlPrefix}.owner.login.name` }),
      value: partDetail.ownerLoginName,
    }, {
      key: formatMessage({ id: `${intlPrefix}.owner.user.name` }),
      value: partDetail.ownerRealName,
    }, {
      key: formatMessage({ id: `${intlPrefix}.home.page` }),
      value: partDetail.homePage,
    }, {
      key: formatMessage({ id: `${intlPrefix}.phone` }),
      value: partDetail.ownerPhone ? partDetail.ownerPhone : '无',
    }, {
      key: formatMessage({ id: `${intlPrefix}.mailbox` }),
      value: partDetail.ownerEmail,
    }, {
      key: formatMessage({ id: `${intlPrefix}.avatar` }),
      value: {
        imgUrl: editData.imageUrl,
        name: editData.name.charAt(0),
      },
    }];
    return (
      <Content
        className="sidebar-content"
        code="global.organization.detail"
        values={{ name: `${editData.code}` }}
      >
        {
          infoList.map(({ key, value }) => (
            <Row
              key={key}
              className={classnames('c7n-organization-detail-row', { 'c7n-organization-detail-row-hide': value === null })}
            >
              <Col span={3}>{key}:</Col>
              {
                key === formatMessage({ id: `${intlPrefix}.avatar` }) ? (
                  <div className="c7n-iam-organization-avatar">
                    <div
                      className="c7n-iam-organization-avatar-wrap"
                      style={{
                        backgroundColor: '#c5cbe8',
                        backgroundImage: value.imgUrl ? `url(${Choerodon.fileServer(value.imgUrl)})` : '',
                      }}
                    >
                      {!value.imgUrl && value.name}
                    </div>
                  </div>
                ) : (
                  <Col span={21}>{value}</Col>
                )
              }
            </Row>
          ))
        }
      </Content>
    );
  }

  renderSidebarContent() {
    const { intl, form: { getFieldDecorator }, OrganizationStore: { show, editData }, AppState } = this.props;
    const { loginName, realName } = AppState.getUserInfo;
    return (
      <Content
        className="sidebar-content"
        code={show === 'create' ? 'global.organization.create' : 'global.organization.modify'}
        values={{ name: show === 'create' ? `${AppState.getSiteInfo.systemName || 'Choerodon'}` : `${editData.code}` }}
      >
        <Form>
          {
            show === 'create' && (
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: 'global.organization.coderequiredmsg' }),
                  }, {
                    max: 15,
                    message: intl.formatMessage({ id: 'global.organization.codemaxmsg' }),
                  }, {
                    pattern: /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/,
                    message: intl.formatMessage({ id: 'global.organization.codepatternmsg' }),
                  }, {
                    validator: this.checkCode,
                  }],
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                })(
                  <Input
                    ref={(e) => {
                      this.creatOrgFocusInput = e;
                    }}
                    label={<FormattedMessage id="global.organization.code" />}
                    autoComplete="off"
                    style={{ width: inputWidth }}
                    maxLength={15}
                    showLengthInfo={false}
                  />,
                )}
              </FormItem>
            )
          }
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: intl.formatMessage({ id: 'global.organization.namerequiredmsg' }), whitespace: true }],
              validateTrigger: 'onBlur',
              initialValue: show === 'create' ? undefined : editData.name,
            })(
              <Input
                ref={(e) => {
                  this.editOrgFocusInput = e;
                }}
                label={<FormattedMessage id="global.organization.name" />}
                autoComplete="off"
                style={{ width: inputWidth }}
                maxLength={32}
                showLengthInfo={false}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('address', {
                rules: [],
                initialValue: show === 'create' ? undefined : editData.address,
              })(
                <Input
                  label={<FormattedMessage id="global.organization.region" />}
                  autoComplete="off"
                  style={{ width: inputWidth }}
                />,
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            {
              getFieldDecorator('homePage', {
                rules: [
                  {
                    pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
                    message: intl.formatMessage({ id: `${intlPrefix}.homepage.pattern.msg` }),
                  },
                ],
                validateTrigger: 'onBlur',
                initialValue: show === 'create' ? undefined : editData.homePage,
              })(
                <Input
                  label={<FormattedMessage id="global.organization.home.page" />}
                  autoComplete="off"
                  style={{ width: inputWidth }}
                />,
              )}
          </FormItem>
          {
            show === 'create' && (
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('userId', {
                  initialValue: `${loginName}${realName}`,
                })(
                  <Select
                    style={{ width: 300 }}
                    label={<FormattedMessage id={`${intlPrefix}.owner`} />}
                    notFoundContent={intl.formatMessage({ id: 'memberrole.notfound.msg' })}
                    onFilterChange={this.handleSelectFilter}
                    getPopupContainer={() => document.getElementsByClassName('sidebar-content')[0].parentNode}
                    filterOption={false}
                    optionFilterProp="children"
                    loading={this.state.selectLoading}
                    filter
                  >
                    {this.getOption()}
                  </Select>,
                )}
              </FormItem>
            )
          }
          <div>
            <span style={{ color: 'rgba(0,0,0,.6)' }}>{intl.formatMessage({ id: `${intlPrefix}.avatar` })}</span>
            {this.getAvatar(editData)}
          </div>
        </Form>
      </Content>
    );
  }

  getAvatar(data = {}) {
    const { isShowAvatar, imgUrl } = this.state;
    return (
      <div className="c7n-iam-organization-avatar">
        <div
          className="c7n-iam-organization-avatar-wrap"
          style={{
            backgroundColor: data.name ? ' #c5cbe8' : '#ccc',
            backgroundImage: imgUrl ? `url(${Choerodon.fileServer(imgUrl)})` : '',
          }}
        >
          {!imgUrl && data.name && data.name.charAt(0)}
          <Button className={classnames('c7n-iam-organization-avatar-button', { 'c7n-iam-organization-avatar-button-create': !data.name, 'c7n-iam-organization-avatar-button-edit': data.name })} onClick={this.openAvatarUploader}>
            <div className="c7n-iam-organization-avatar-button-icon">
              <Icon type="photo_camera" />
            </div>
          </Button>
          <AvatarUploader visible={isShowAvatar} intlPrefix="global.organization.avatar.edit" onVisibleChange={this.closeAvatarUploader} onUploadOk={this.handleUploadOk} />
        </div>
      </div>
    );
  }

  /**
   * 打开上传图片模态框
   */
  openAvatarUploader = () => {
    this.setState({
      isShowAvatar: true,
    });
  }

  closeAvatarUploader = (visible) => {
    this.setState({
      isShowAvatar: visible,
    });
  };

  handleUploadOk = (res) => {
    this.setState({
      imgUrl: res,
      isShowAvatar: false,
    });
  }


  handlePageChange = (pagination, filters, sorter, params) => {
    this.loadOrganizations(pagination, filters, sorter, params);
  };

  getTableColumns() {
    const { intl, OrganizationStore: { sort: { columnKey, order }, filters } } = this.props;
    return [{
      title: <FormattedMessage id="name" />,
      dataIndex: 'name',
      key: 'name',
      filters: [],
      width: '20%',
      render: (text, record) => (
        <React.Fragment>
          <div className="c7n-iam-organization-name-avatar">
            {
              record.imageUrl ? <img src={record.imageUrl} alt="avatar" style={{ width: '100%' }} />
                : <React.Fragment>{text.split('')[0]}</React.Fragment>
            }
          </div>
          <MouseOverWrapper text={text} width={0.3}>
            {text}
          </MouseOverWrapper>
        </React.Fragment>
      ),
      sortOrder: columnKey === 'name' && order,
      filteredValue: filters.name || [],
    }, {
      key: 'homePage',
      // width: '20%',
      title: <FormattedMessage id="global.organization.home.page" />,
      dataIndex: 'homePage',
      // filters: [],
      sortOrder: columnKey === 'homePage' && order,
      // filteredValue: filters.homePage || [],
      render: text => (
        <MouseOverWrapper text={text} width={0.3}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="code" />,
      dataIndex: 'code',
      key: 'code',
      filters: [],
      sortOrder: columnKey === 'code' && order,
      filteredValue: filters.code || [],
      width: '15%',
      render: text => (
        <MouseOverWrapper text={text} width={0.3}>
          {text}
        </MouseOverWrapper>
      ),
    }, {
      title: <FormattedMessage id="global.organization.project.count" />,
      width: '10%',
      dataIndex: 'projectCount',
      key: 'projectCount',
      align: 'center',
    }, {
      title: <FormattedMessage id="status" />,
      width: '15%',
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
    }, {
      title: <FormattedMessage id="global.organization.project.creationDate" />,
      width: '15%',
      dataIndex: 'creationDate',
      key: 'creationDate',
    }, {
      title: '',
      width: 120,
      key: 'action',
      align: 'right',
      render: (text, record) => (
        <div className="operation">
          <Permission service={['iam-service.organization.update']}>
            <Tooltip
              title={<FormattedMessage id="modify" />}
              placement="bottom"
            >
              <Button
                size="small"
                icon="mode_edit"
                shape="circle"
                onClick={this.handleEdit.bind(this, record)}
              />
            </Tooltip>
          </Permission>
          <Permission service={['iam-service.organization.disableOrganization', 'iam-service.organization.enableOrganization']}>
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
          <Permission service={['iam-service.organization.query']}>
            <Tooltip
              title={<FormattedMessage id="detail" />}
              placement="bottom"
            >
              <Button
                shape="circle"
                icon="find_in_page"
                size="small"
                onClick={this.showDetail.bind(this, record)}
              />
            </Tooltip>
          </Permission>
        </div>
      ),
    }];
  }

  render() {
    const {
      intl, OrganizationStore: {
        params, loading, pagination, sidebarVisible, submitting, show, orgData,
      },
      AppState,
    } = this.props;

    return (
      <Page
        service={[
          'iam-service.organization.list',
          'iam-service.organization.query',
          'organization-service.organization.create',
          'iam-service.organization.update',
          'iam-service.organization.disableOrganization',
          'iam-service.organization.enableOrganization',
          'iam-service.role-member.queryAllUsers',
        ]}
      >
        <Header title={<FormattedMessage id="global.organization.header.title" />}>
          <Permission service={['organization-service.organization.create']}>
            <Button
              onClick={this.createOrg}
              icon="playlist_add"
            >
              <FormattedMessage id="global.organization.create" />
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
          code="global.organization"
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
          className="c7n-iam-organization"
        >
          <Table
            columns={this.getTableColumns()}
            dataSource={orgData.slice()}
            pagination={pagination}
            onChange={this.handlePageChange}
            filters={params.slice()}
            loading={loading}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
            scroll={{ x: true }}
          />
          <Sidebar
            title={<FormattedMessage id={this.renderSidebarTitle()} />}
            visible={sidebarVisible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancelFun}
            okCancel={show !== 'detail'}
            okText={this.renderSidebarOkText()}
            cancelText={<FormattedMessage id="cancel" />}
            confirmLoading={submitting}
            className={classnames('c7n-iam-organization-sidebar', { 'c7n-iam-organization-sidebar-create': show === 'create' })}
          >
            {show !== 'detail' ? this.renderSidebarContent() : this.renderSidebarDetail()}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

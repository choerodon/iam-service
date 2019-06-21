import React, { Component } from 'react';
import get from 'lodash/get';
import { findDOMNode } from 'react-dom';
import { inject, observer } from 'mobx-react';
import { Button, Form, Modal, Progress, Select, Table, Tooltip, Upload, Spin, Radio } from 'choerodon-ui';
import { withRouter } from 'react-router-dom';
import { Content, Header, Page, Permission } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';
import MemberRoleType, { pageSize } from './MemberRoleType';
import './MemberRole.scss';
import '../../../common/ConfirmModal.scss';

let timer;
let selectFilterEmpty = true;
const { Sidebar } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItemNumLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const intlPrefix = 'memberrole';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class MemberRole extends Component {
  state = this.getInitState();

  getInitState() {
    const { MemberRoleStore, AppState } = this.props;
    MemberRoleStore.loadCurrentMenuType(AppState.currentMenuType, AppState.getUserId);
    return {
      selectLoading: true,
      loading: true,
      submitting: false,
      sidebar: false,
      selectType: '',
      showMember: true,
      expandedKeys: [], // 角色展开
      roleIds: [],
      overflow: false,
      fileLoading: false,
      createMode: 'user',
      selectRoleMemberKeys: [],
      roleData: MemberRoleStore.getRoleData, // 所有角色
      roleMemberDatas: MemberRoleStore.getRoleMemberDatas, // 用户-角色表数据源
      memberDatas: [], // 用户-成员表数据源
      currentMemberData: [], // 当前成员的角色分配信息
      selectMemberRoles: {},
      selectRoleMembers: [],
      roleMemberFilters: {}, // 用户-角色表格过滤
      roleMemberParams: [], // 用户-角色表格参数
      memberRoleFilters: {}, // 用户-成员表格过滤
      params: [], // 用户-成员表格参数
      memberRolePageInfo: { // 用户-成员表格分页信息
        current: 1,
        total: 0,
        pageSize,
      },
      roleMemberFilterRole: [],
      clientMemberDatas: [],
      cilentRoleMemberDatas: MemberRoleStore.getClientRoleMemberDatas,
      clientMemberRolePageInfo: { // 客户端-成员表格分页信息
        current: 1,
        total: 0,
        pageSize,
      },
      clientMemberRoleFilters: {},
      clientMemberParams: [],
      clientRoleMemberFilters: {},
      clientParams: [],
      clientRoleMemberParams: [],
      selectClientMemberRoles: {},
      selectClientRoleMembers: [],
      clientRoleMemberFilterRole: [],
    };
  }

  init() {
    const { MemberRoleStore } = this.props;
    this.initMemberRole();
    if (MemberRoleStore.currentMode === 'user') {
      this.roles.fetch();
    } else {
      this.roles.fetchClient();
    }
  }

  // 第一次渲染前获得数据
  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    this.updateSelectContainer();
  }

  componentDidUpdate() {
    const { MemberRoleStore } = this.props;
    this.updateSelectContainer();
    MemberRoleStore.setRoleMemberDatas(this.state.roleMemberDatas);
    MemberRoleStore.setRoleData(this.state.roleData);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(timer);
    const { MemberRoleStore } = this.props;
    MemberRoleStore.setRoleMemberDatas([]);
    MemberRoleStore.setRoleData([]);
    MemberRoleStore.setCurrentMode('user');
  }

  initMemberRole() {
    this.roles = new MemberRoleType(this);
  }

  /**
   * 更改模式
   * @param value 模式
   */
  changeMode = (value) => {
    const { MemberRoleStore } = this.props;
    MemberRoleStore.setCurrentMode(value);
    this.reload();
  }

  updateSelectContainer() {
    const body = this.sidebarBody;
    if (body) {
      const { overflow } = this.state;
      const bodyOverflow = body.clientHeight < body.scrollHeight;
      if (bodyOverflow !== overflow) {
        this.setState({
          overflow: bodyOverflow,
        });
      }
    }
  }

  reload = () => {
    this.setState(this.getInitState(), () => {
      this.init();
    });
  };

  formatMessage = (id, values = {}) => {
    const { intl } = this.props;
    return intl.formatMessage({
      id,
    }, values);
  };

  openSidebar = () => {
    this.props.form.resetFields();
    this.setState({
      roleIds: this.initFormRoleIds(),
      sidebar: true,
    });
  };

  closeSidebar = () => {
    this.setState({ sidebar: false });
  };

  initFormRoleIds() {
    const { selectType, currentMemberData } = this.state;
    let roleIds = [undefined];
    if (selectType === 'edit') {
      roleIds = currentMemberData.roles.map(({ id }) => id);
    }
    return roleIds;
  }

  /**
   * 批量移除角色
   */
  deleteRoleByMultiple = () => {
    const { selectMemberRoles, showMember, selectRoleMembers } = this.state;
    const { MemberRoleStore } = this.props;
    let content;
    if (MemberRoleStore.currentMode === 'user' && showMember) {
      content = 'memberrole.remove.select.all.content';
    } else if (MemberRoleStore.currentMode === 'user' && !showMember) {
      content = 'memberrole.remove.select.content';
    } else if (MemberRoleStore.currentMode === 'client' && showMember) {
      content = 'memberrole.remove.select.all.client.content';
    } else {
      content = 'memberrole.remove.select.client.content';
    }
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: this.formatMessage('memberrole.remove.title'),
      content: this.formatMessage(content),
      onOk: () => {
        if (showMember) {
          return this.deleteRolesByIds(selectMemberRoles);
        } else {
          const data = {};
          selectRoleMembers.forEach(({ id, roleId }) => {
            if (!data[roleId]) {
              data[roleId] = [];
            }
            data[roleId].push(id);
          });
          return this.deleteRolesByIds(data);
        }
      },
    });
  };

  /**
   * 删除单个成员或客户端
   * @param record
   */
  handleDelete = (record) => {
    const { MemberRoleStore } = this.props;
    const isUsersMode = MemberRoleStore.currentMode === 'user';
    let content;
    if (isUsersMode) {
      content = this.formatMessage('memberrole.remove.all.content', { name: record.loginName });
    } else {
      content = this.formatMessage('memberrole.remove.all.client.content', { name: record.name });
    }
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: this.formatMessage('memberrole.remove.title'),
      content,
      onOk: () => this.deleteRolesByIds({
        [record.id]: record.roles.map(({ id }) => id),
      }),
    });
  };

  deleteRoleByRole = (record) => {
    const { MemberRoleStore } = this.props;
    const isUsersMode = MemberRoleStore.currentMode === 'user';
    let content;
    if (isUsersMode) {
      content = this.formatMessage('memberrole.remove.content', {
        member: record.loginName,
        role: record.roleName,
      });
    } else {
      content = this.formatMessage('memberrole.remove.client.content', {
        member: record.name,
        role: record.roleName,
      });
    }
    Modal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: this.formatMessage('memberrole.remove.title'),
      content,
      onOk: () => this.deleteRolesByIds({ [record.roleId]: [record.id] }),
    });
  };

  deleteRolesByIds = (data) => {
    const { showMember } = this.state;
    const { MemberRoleStore } = this.props;
    const isUsersMode = MemberRoleStore.currentMode === 'user';
    const body = {
      view: showMember ? 'userView' : 'roleView',
      memberType: isUsersMode ? 'user' : 'client',
      data,
    };
    return this.roles.deleteRoleMember(body).then(({ failed, message }) => {
      if (failed) {
        Choerodon.prompt(message);
      } else {
        Choerodon.prompt(this.formatMessage('remove.success'));
        this.setState({
          selectRoleMemberKeys: [],
          selectMemberRoles: {},
        });
        if (isUsersMode) {
          this.roles.fetch();
        } else {
          this.roles.fetchClient();
        }
      }
    });
  };

  getSidebarTitle() {
    const { selectType } = this.state;
    if (selectType === 'create') {
      return <FormattedMessage id="memberrole.add" />;
    } else if (selectType === 'edit') {
      return <FormattedMessage id="memberrole.modify" />;
    } else if (selectType === 'upload') {
      return <FormattedMessage id="memberrole.upload" />;
    }
  }

  getUploadOkText = () => {
    const { fileLoading } = this.state;
    const { MemberRoleStore } = this.props;
    const uploading = MemberRoleStore.getUploading;
    if (fileLoading === true) {
      return '上传中';
    } else if (uploading) {
      return '导入中';
    } else {
      return '上传';
    }
  };

  renderUpload = () => (
    <Content
      {...this.getHeader()}
    >
      <div>
        <div style={{ width: '512px' }}>
          {this.getUploadInfo()}
        </div>
        <div style={{ display: 'none' }}>
          <Upload {...this.getUploadProps()}>
            <Button className="c7n-user-upload-hidden" />
          </Upload>
        </div>
      </div>
    </Content>
  );

  getSidebarContent() {
    const { roleData = [], roleIds, selectType } = this.state;
    const disabled = roleIds.findIndex((id, index) => id === undefined) !== -1
      || !roleData.filter(({ enabled, id }) => enabled && roleIds.indexOf(id) === -1).length;
    return (
      <Content
        {...this.getHeader()}
      >
        {this.getForm()}
        {this.getAddOtherBtn(disabled)}
      </Content>);
  }

  getHeader() {
    const { selectType, currentMemberData } = this.state;
    const { values } = this.roles;
    const modify = selectType === 'edit';
    return {
      className: 'sidebar-content',
      ref: this.saveSideBarRef,
      code: this.getHeaderCode(),
      values: modify ? { name: currentMemberData.loginName || currentMemberData.name } : values,
    };
  }

  getHeaderCode = () => {
    const { selectType } = this.state;
    const { code, clientCode } = this.roles;
    const { MemberRoleStore } = this.props;
    let codeType = '';
    switch (selectType) {
      case 'edit':
        codeType = 'modify';
        break;
      case 'create':
        codeType = 'add';
        break;
      default:
        codeType = 'upload';
        break;
    }
    if (selectType !== 'edit') {
      return `${code}.${codeType}`;
    } else {
      return MemberRoleStore.currentMode === 'user' ? `${code}.${codeType}` : `${code}.${codeType}.client`;
    }
  };

  saveSideBarRef = (node) => {
    if (node) {
      /* eslint-disable-next-line */
      this.sidebarBody = findDOMNode(node).parentNode;
    }
  };

  /**
   * 渲染创建及修改的表单
   * @returns {*}
   */
  getForm = () => {
    const { selectType } = this.state;
    return selectType === 'create' ? (
      <Form layout="vertical">
        {this.getModeDom()}
        {this.getProjectNameDom()}
        {this.getRoleFormItems()}
      </Form>
    ) : (
      <Form layout="vertical">
        {this.getRoleFormItems()}
      </Form>
    );
  };

  /**
   * 渲染表单选择成员类型的节点
   * @returns {null}
   */
  getModeDom() {
    const { selectType } = this.state;
    const { form, MemberRoleStore, intl } = this.props;
    const { getFieldDecorator } = form;
    return selectType === 'create' ? (
      <FormItem
        {...FormItemNumLayout}
      >
        {getFieldDecorator('mode', {
          initialValue: MemberRoleStore.currentMode,
        })(
          <RadioGroup label={<FormattedMessage id="memberrole.member.type" />} className="c7n-iam-memberrole-radiogroup" onChange={this.changeCreateMode}>
            <Radio value={'user'}>{intl.formatMessage({ id: 'memberrole.type.user' })}</Radio>
            <Radio value={'client'}>{intl.formatMessage({ id: 'memberrole.client' })}</Radio>
          </RadioGroup>,
        )}
      </FormItem>
    ) : null;
  }


  /**
   * 渲染表单客户端或用户下拉框的节点
   * @returns {*}
   */
  getProjectNameDom() {
    const { selectType, currentMemberData, createMode, overflow } = this.state;
    const { form, MemberRoleStore, intl } = this.props;
    const { getFieldDecorator } = form;
    const member = [];
    const style = {
      marginTop: '-15px',
    };
    if (selectType === 'edit') {
      member.push(MemberRoleStore.currentMode === 'user' ? currentMemberData.loginName : currentMemberData.id);
      style.display = 'none';
      return null;
    }

    if (createMode === 'user') {
      return (
        selectType === 'create' && <FormItem
          {...FormItemNumLayout}
        >
          {getFieldDecorator('member', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: 'memberrole.user.require.msg' }),
            }],
            initialValue: selectType === 'create' ? [] : member,
          })(
            <Select
              label={<FormattedMessage id="memberrole.type.user" />}
              optionLabelProp="label"
              allowClear
              style={{ width: 512 }}
              mode="multiple"
              optionFilterProp="children"
              filterOption={false}
              filter
              getPopupContainer={() => (overflow ? this.sidebarBody : document.body)}
              onFilterChange={this.handleSelectFilter}
              notFoundContent={selectFilterEmpty ? intl.formatMessage({ id: 'memberrole.noFilter.msg' }) : intl.formatMessage({ id: 'memberrole.notfound.msg' })}
              loading={this.state.selectLoading}
            >
              {this.getUserOption()}
            </Select>,
          )}
        </FormItem>
      );
    } else {
      return (
        selectType === 'create' && <FormItem
          {...FormItemNumLayout}
        >
          {getFieldDecorator('member', {
            rules: [{
              required: true,
              message: intl.formatMessage({ id: 'memberrole.client.require.msg' }),
            }],
            initialValue: selectType === 'create' ? [] : member,
          })(
            <Select
              label={<FormattedMessage id="memberrole.client" />}
              allowClear
              style={{ width: 512 }}
              mode="multiple"
              optionFilterProp="children"
              filterOption={false}
              filter
              getPopupContainer={() => (overflow ? this.sidebarBody : document.body)}
              onFilterChange={this.handleSelectFilter}
              notFoundContent={selectFilterEmpty ? intl.formatMessage({ id: 'memberrole.noFilter.msg' }) : intl.formatMessage({ id: 'memberrole.notfound.msg' })}
              loading={this.state.selectLoading}
            >
              {this.getClientOption()}
            </Select>,
          )}
        </FormItem>
      );
    }
  }

  /**
   * 渲染表单增删角色的节点
   * @returns {any[]}
   */
  getRoleFormItems = () => {
    const { selectType, roleIds, overflow } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItems = roleIds.map((id, index) => {
      const key = id === undefined ? `role-index-${index}` : String(id);
      return (<FormItem
        {...FormItemNumLayout}
        key={key}
      >
        {getFieldDecorator(key, {
          rules: [
            {
              required: roleIds.length === 1 && selectType === 'create',
              message: this.formatMessage('memberrole.role.require.msg'),
            },
          ],
          initialValue: id,
        })(
          <Select
            className="member-role-select"
            style={{ width: 300 }}
            label={<FormattedMessage id="memberrole.role.label" />}
            getPopupContainer={() => (overflow ? this.sidebarBody : document.body)}
            filterOption={(input, option) => {
              const childNode = option.props.children;
              if (childNode && React.isValidElement(childNode)) {
                return childNode.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }
              return false;
            }}
            onChange={(value) => {
              roleIds[index] = value;
            }}
            filter
          >
            {this.getOption(id)}
          </Select>,
        )}
        <Button
          size="small"
          icon="delete"
          shape="circle"
          onClick={() => this.removeRole(index)}
          disabled={roleIds.length === 1 && selectType === 'create'}
          className={'delete-role'}
        />
      </FormItem>);
    });
    return formItems;
  };

  changeCreateMode = (e) => {
    const { form } = this.props;
    this.setState({
      createMode: e.target.value,
      selectLoading: true,
      roleIds: [undefined],
    });
    form.setFields({
      member: {
        values: [],
      },
      'role-index-0': {
        values: undefined,
      },
    });
  }

  handleSelectFilter = (value) => {
    selectFilterEmpty = !value;
    this.setState({
      selectLoading: true,
    });
    const { createMode } = this.state;
    const queryObj = {
      param: value,
      sort: 'id',
      organization_id: get(this.props.AppState, 'currentMenuType.organizationId', 0),
    };

    if (timer) {
      clearTimeout(timer);
    }

    if (value) {
      timer = setTimeout(() => (createMode === 'user' ? this.loadUsers(queryObj) : this.loadClients(queryObj)), 300);
    } else {
      return createMode === 'user' ? this.loadUsers(queryObj) : this.loadClients(queryObj);
    }
  }

  // 加载全平台用户信息
  loadUsers = (queryObj) => {
    const { MemberRoleStore } = this.props;
    MemberRoleStore.loadUsers(queryObj).then((data) => {
      MemberRoleStore.setUsersData(data.list.slice());
      this.setState({
        selectLoading: false,
      });
    });
  }

  // 加载全平台客户端信息
  loadClients = (queryObj) => {
    const { MemberRoleStore } = this.props;
    MemberRoleStore.loadClients(queryObj).then((data) => {
      MemberRoleStore.setClientsData(data.list.slice());
      this.setState({
        selectLoading: false,
      });
    });
  }

  getUserOption = () => {
    const { MemberRoleStore } = this.props;
    const usersData = MemberRoleStore.getUsersData;
    return usersData && usersData.length > 0 ? (
      usersData.map(({ id, imageUrl, loginName, realName }) => (
        <Option key={id} value={id} label={`${loginName}${realName}`}>
          <Tooltip title={`${loginName}${realName}`} placement="topLeft">
            <div className="c7n-iam-memberrole-user-option">
              <div className="c7n-iam-memberrole-user-option-avatar">
                {
                  imageUrl ? <img src={imageUrl} alt="userAvatar" style={{ width: '100%' }} /> :
                  <span className="c7n-iam-memberrole-user-option-avatar-noavatar">{realName && realName.split('')[0]}</span>
                }
              </div>
              <span>{realName}</span>
            </div>
          </Tooltip>
        </Option>
      ))
    ) : null;
  }

  getClientOption = () => {
    const { MemberRoleStore } = this.props;
    const clientsData = MemberRoleStore.getClientsData;
    return clientsData && clientsData.length > 0 ? (
      clientsData.map(({ id, clientName }) => (
        <Option key={id} value={id}>{clientName}</Option>
      ))
    ) : null;
  }

  // 创建/编辑角色 下拉框的option
  getOption = (current) => {
    const { roleData = [], roleIds } = this.state;
    return roleData.reduce((options, { id, name, enabled, code }) => {
      if (roleIds.indexOf(id) === -1 || id === current) {
        if (enabled === false) {
          options.push(<Option style={{ display: 'none' }} disabled value={id} key={id}>{name}</Option>);
        } else {
          options.push(
            <Option value={id} key={id} title={name}>
              <Tooltip title={code} placement="right" align={{ offset: [20, 0] }}>
                <span style={{ display: 'inline-block', width: '100%' }}>{name}</span>
              </Tooltip>
            </Option>,
          );
        }
      }
      return options;
    }, []);
  };

  // sidebar 删除角色
  removeRole = (index) => {
    const { roleIds } = this.state;
    roleIds.splice(index, 1);
    this.setState({ roleIds });
  };

  getAddOtherBtn(disabled) {
    return (
      <Button type="primary" disabled={disabled} className="add-other-role" icon="add" onClick={this.addRoleList}>
        <FormattedMessage id="memberrole.add.other" />
      </Button>
    );
  }

  addRoleList = () => {
    const { roleIds } = this.state;
    roleIds.push(undefined);
    this.setState({ roleIds });
  };

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
  };


  getUploadInfo = () => {
    const { MemberRoleStore } = this.props;
    const { fileLoading } = this.state;
    const uploadInfo = MemberRoleStore.getUploadInfo || {};
    const uploading = MemberRoleStore.getUploading;
    const container = [];

    if (uploading) { // 如果正在导入
      container.push(this.renderLoading());
      this.handleUploadInfo();
      if (fileLoading) {
        this.setState({
          fileLoading: false,
        });
      }
    } else if (fileLoading) { // 如果还在上传
      container.push(this.renderLoading());
    } else if (!uploadInfo.noData) {
      const failedStatus = uploadInfo.finished ? 'detail' : 'error';
      container.push(
        <p key={'upload.lasttime'}>
          <FormattedMessage id={'upload.lasttime'} />
          {uploadInfo.beginTime}
          （<FormattedMessage id={'upload.spendtime'} />
          {this.getSpentTime(uploadInfo.beginTime, uploadInfo.endTime)}）
        </p>,
        <p key={'upload.time'}>
          <FormattedMessage
            id={'upload.time'}
            values={{
              successCount: <span className="success-count">{uploadInfo.successfulCount || 0}</span>,
              failedCount: <span className="failed-count">{uploadInfo.failedCount || 0}</span>,
            }}
          />
          {uploadInfo.url && (
            <span className={`download-failed-${failedStatus}`}>
              <a href={uploadInfo.url}>
                <FormattedMessage id={`download.failed.${failedStatus}`} />
              </a>
            </span>
          )}
        </p>,
      );
    } else {
      container.push(<p key={'upload.norecord'}><FormattedMessage id={'upload.norecord'} /></p>);
    }
    return (
      <div className="c7n-user-upload-container">
        {container}
      </div>
    );
  };

  /**
   *  application/vnd.ms-excel 2003-2007
   *  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 2010
   */
  getUploadProps = () => {
    const { intl, MemberRoleStore } = this.props;
    return {
      multiple: false,
      name: 'file',
      accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      action: `${process.env.API_HOST}${MemberRoleStore.urlRoleMember}/batch_import`,
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
  };

  isModify = () => {
    const { roleIds, currentMemberData } = this.state;
    const roles = currentMemberData.roles;
    if (roles.length !== roleIds.length) {
      return true;
    }
    for (let i = 0; i < roles.length; i += 1) {
      if (!roleIds.includes(roles[i].id)) {
        return true;
      }
    }
    return false;
  };

  handleDownLoad = () => {
    const { MemberRoleStore } = this.props;
    MemberRoleStore.downloadTemplate().then((result) => {
      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const linkElement = document.getElementById('c7n-user-download-template');
      linkElement.setAttribute('href', url);
      linkElement.click();
    });
  };

  // ok 按钮保存
  handleOk = (e) => {
    const { selectType, roleIds } = this.state;
    const { MemberRoleStore } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const memberType = selectType === 'create' ? values.mode : MemberRoleStore.currentMode;
      if (!err) {
        const body = roleIds.filter(roleId => roleId).map((roleId, index) => ({
          memberType,
          roleId,
          sourceId: sessionStorage.selectData.id || 0,
          sourceType: sessionStorage.type,
        }));
        const pageInfo = {
          current: 1,
          total: 0,
          pageSize,
        };
        this.setState({ submitting: true });
        if (selectType === 'create') {
          this.roles.fetchRoleMember(values.member, body, memberType)
            .then(({ failed, message }) => {
              this.setState({ submitting: false });
              if (failed) {
                Choerodon.prompt(message);
              } else {
                Choerodon.prompt(this.formatMessage('add.success'));
                this.closeSidebar();
                if (MemberRoleStore.currentMode === 'user') {
                  this.setState({
                    memberRolePageInfo: pageInfo,
                  }, () => {
                    this.roles.fetch();
                  });
                } else {
                  this.setState({
                    clientMemberRolePageInfo: pageInfo,
                  }, () => {
                    this.roles.fetchClient();
                  });
                }
              }
            })
            .catch((error) => {
              this.setState({ submitting: false });
              Choerodon.handleResponseError(error);
            });
        } else if (selectType === 'edit') {
          if (!this.isModify()) {
            this.setState({ submitting: false });
            Choerodon.prompt(this.formatMessage('modify.success'));
            this.closeSidebar();
            return;
          }
          const { currentMemberData } = this.state;
          const memberIds = [currentMemberData.id];
          this.roles.fetchRoleMember(memberIds, body, memberType, true)
            .then(({ failed, message }) => {
              this.setState({ submitting: false });
              if (failed) {
                Choerodon.prompt(message);
              } else {
                Choerodon.prompt(this.formatMessage('modify.success'));
                this.closeSidebar();
                if (MemberRoleStore.currentMode === 'user') {
                  if (body.length) {
                    this.setState({
                      memberRolePageInfo: pageInfo,
                    }, () => {
                      this.roles.fetch();
                    });
                  } else {
                    this.roles.fetch();
                  }
                } else if (MemberRoleStore.currentMode === 'client') {
                  if (body.length) {
                    this.setState({
                      clientMemberRolePageInfo: pageInfo,
                    }, () => {
                      this.roles.fetchClient();
                    });
                  } else {
                    this.roles.fetchClient();
                  }
                }
              }
            })
            .catch((error) => {
              this.setState({ submitting: false });
              Choerodon.handleResponseError(error);
            });
        }
      }
    });
  };

  createRole = () => {
    const { MemberRoleStore } = this.props;
    this.setState({ selectType: 'create', createMode: MemberRoleStore.currentMode }, () => {
      this.openSidebar();
    });
  };

  editRole = (memberData) => {
    this.setState({
      selectType: 'edit',
      currentMemberData: memberData,
    }, () => this.openSidebar());
  };

  handleEditRole = ({ id: memberId, loginName }) => {
    const member = this.state.memberDatas.find(({ id }) => id === memberId);
    if (!member) {
      this.roles.loadMemberDatas({
        current: 1,
        pageSize,
      }, {
        loginName: [loginName],
      }).then(({ list }) => {
        this.editRole(list.find(memberData => memberData.loginName === loginName));
      });
    } else {
      this.editRole(member);
    }
  };

  handleEditClientRole = ({ id: memberId, clientName }) => {
    const member = this.state.clientMemberDatas.find(({ id }) => id === memberId);
    if (!member) {
      this.roles.loadClientMemberDatas({
        current: 1,
        pageSize,
      }, {
        clientName,
      }).then(({ list }) => {
        this.editRole(list.find(memberData => memberData.name === clientName));
      });
    } else {
      this.editRole(member);
    }
  };

  showMemberTable(show) {
    this.reload();
    this.setState({
      showMember: show,
    });
  }

  memberRoleTableChange = (memberRolePageInfo, memberRoleFilters, sort, params) => {
    this.setState({
      memberRolePageInfo,
      memberRoleFilters,
      params,
      loading: true,
    });
    this.roles.loadMemberDatas(memberRolePageInfo, memberRoleFilters, params).then(({ list, total, pageNum, pageSize }) => {
      this.setState({
        loading: false,
        memberDatas: list,
        memberRolePageInfo: {
          current: pageNum,
          total,
          pageSize,
        },
        params,
        memberRoleFilters,
      });
    });
  };

  clientMemberRoleTableChange = (clientMemberRolePageInfo, clientMemberRoleFilters, sort, clientParams) => {
    this.setState({
      clientMemberRolePageInfo,
      clientMemberRoleFilters,
      clientParams,
      loading: true,
    });
    this.roles.loadClientMemberDatas(clientMemberRolePageInfo, clientMemberRoleFilters, clientParams).then(({ list, total, pageNum, pageSize }) => {
      this.setState({
        loading: false,
        clientMemberDatas: list,
        clientMemberRolePageInfo: {
          current: pageNum,
          total,
          pageSize,
        },
        clientParams,
        clientMemberRoleFilters,
      });
    });
  }

  roleMemberTableChange = (pageInfo, { name, ...roleMemberFilters }, sort, params) => {
    const newState = {
      roleMemberFilterRole: name,
      roleMemberFilters,
      roleMemberParams: params,
    };
    newState.loading = true;
    const { expandedKeys } = this.state;
    this.roles.loadRoleMemberDatas({ ...roleMemberFilters }, params)
      .then((roleData) => {
        const roleMemberDatas = roleData.filter((role) => {
          role.users = role.users || [];
          if (role.userCount > 0) {
            if (expandedKeys.find(expandedKey => expandedKey.split('-')[1] === String(role.id))) {
              this.roles.loadRoleMemberData(role, {
                current: 1,
                pageSize,
              }, roleMemberFilters, params);
            }
            return true;
          }
          return false;
        });
        this.setState({
          loading: false,
          expandedKeys,
          roleMemberDatas,
        });
      });
    this.setState(newState);
  };

  clientRoleMemberTableChange = (pageInfo, { name, ...clientRoleMemberFilters }, sort, params) => {
    const newState = {
      clientRoleMemberFilterRole: name,
      clientRoleMemberFilters,
      clientRoleMemberParams: params,
    };
    newState.loading = true;
    const { expandedKeys } = this.state;
    this.roles.loadClientRoleMemberDatas({ name: params, ...clientRoleMemberFilters })
      .then((roleData) => {
        const cilentRoleMemberDatas = roleData.filter((role) => {
          role.users = role.users || [];
          if (role.userCount > 0) {
            if (expandedKeys.find(expandedKey => expandedKey.split('-')[1] === String(role.id))) {
              this.roles.loadClientRoleMemberData(role, {
                current: 1,
                pageSize,
              }, clientRoleMemberFilters);
            }
            return true;
          }
          return false;
        });
        this.setState({
          loading: false,
          expandedKeys,
          cilentRoleMemberDatas,
        });
      });
    this.setState(newState);
  }


  renderSimpleColumn = (text, { enabled }) => {
    if (enabled === false) {
      return (
        <Tooltip title={<FormattedMessage id="memberrole.member.disabled.tip" />}>
          <span className="text-disabled">
            {text}
          </span>
        </Tooltip>
      );
    }
    return text;
  };

  renderRoleColumn = text => text.map(({ id, name, enabled }) => {
    let item = <span className={classnames('role-wrapper', { 'role-wrapper-enabled': enabled, 'role-wrapper-disabled': !enabled })} key={id}>{name}</span>;
    if (enabled === false) {
      item = (
        <Tooltip title={<FormattedMessage id="memberrole.role.disabled.tip" />}>
          {item}
        </Tooltip>
      );
    }
    return item;
  });

  renderRoleLoginNameColumn = (text, data) => {
    const { roleMemberFilters, roleMemberParams } = this.state;
    const { loginName, name } = data;
    if (loginName) {
      return loginName;
    } else if (name) {
      const { userCount, users: { length }, loading: isLoading, enabled } = data;
      const more = isLoading ? (<Progress type="loading" width={12} />) : (length > 0 && userCount > length && (
        <a onClick={() => {
          this.roles.loadRoleMemberData(data, {
            current: Math.floor(length / pageSize) + 1,
            pageSize,
          }, roleMemberFilters, roleMemberParams);
          this.forceUpdate();
        }}
        >更多</a>
      ));
      const item = <span className={classnames({ 'text-disabled': !enabled })}>{name} ({userCount}) {more}</span>;
      return enabled ? item : (<Tooltip title={<FormattedMessage id="memberrole.role.disabled.tip" />}>{item}</Tooltip>);
    }
  };

  renderRoleClientNameColumn = (text, data) => {
    const { clientRoleMemberFilters } = this.state;
    const { clientName, name } = data;
    if (clientName) {
      return clientName;
    } else if (name) {
      const { userCount, users: { length }, loading: isLoading, enabled } = data;
      const more = isLoading ? (<Progress type="loading" width={12} />) : (length > 0 && userCount > length && (
        <a onClick={() => {
          this.roles.loadClientRoleMemberData(data, {
            current: (length / pageSize),
            pageSize,
          }, clientRoleMemberFilters);
          this.forceUpdate();
        }}
        >更多</a>
      ));
      const item = <span className={classnames({ 'text-disabled': !enabled })}>{name} ({userCount}) {more}</span>;
      return enabled ? item : (<Tooltip title={<FormattedMessage id="memberrole.role.disabled.tip" />}>{item}</Tooltip>);
    }
  }

  /**
   * 渲染操作列
   * @param text
   * @param record
   * @returns {*}
   */
  renderActionColumn = (text, record) => {
    const { organizationId, projectId, createService, deleteService, type } = this.getPermission();
    const { MemberRoleStore } = this.props;
    if ('roleId' in record || 'email' in record || 'secret' in record) {
      return (
        <div>
          <Permission
            service={createService}
          >
            <Tooltip
              title={<FormattedMessage id="modify" />}
              placement="bottom"
            >
              {
                MemberRoleStore.currentMode === 'user' ? (
                  <Button
                    onClick={() => {
                      this.handleEditRole(record);
                    }}
                    size="small"
                    shape="circle"
                    icon="mode_edit"
                  />
                ) : (
                  <Button
                    onClick={() => {
                      this.handleEditClientRole(record);
                    }}
                    size="small"
                    shape="circle"
                    icon="mode_edit"
                  />
                )
              }
            </Tooltip>
          </Permission>
          <Permission
            service={deleteService}
            type={type}
            organizationId={organizationId}
            projectId={projectId}
          >
            <Tooltip
              title={<FormattedMessage id="remove" />}
              placement="bottom"
            >
              <Button
                size="small"
                shape="circle"
                onClick={this.state.showMember ? this.handleDelete.bind(this, record) : this.deleteRoleByRole.bind(this, record)}
                icon="delete"
              />
            </Tooltip>
          </Permission>
        </div>
      );
    }
  };

  renderMemberTable() {
    const { selectMemberRoles, roleMemberDatas, memberRolePageInfo, memberDatas, memberRoleFilters, loading } = this.state;
    const filtersRole = [...new Set(roleMemberDatas.map(({ name }) => (name)))].map(value => ({ value, text: value }));
    const columns = [
      {
        title: <FormattedMessage id="memberrole.loginname" />,
        dataIndex: 'loginName',
        key: 'loginName',
        width: '15%',
        filters: [],
        filteredValue: memberRoleFilters.loginName || [],
        render: this.renderSimpleColumn,
      },
      {
        title: <FormattedMessage id="memberrole.realname" />,
        dataIndex: 'realName',
        key: 'realName',
        width: '15%',
        filters: [],
        filteredValue: memberRoleFilters.realName || [],
        render: this.renderSimpleColumn,
      },
      {
        title: <FormattedMessage id="memberrole.role" />,
        dataIndex: 'roles',
        key: 'roles',
        filters: filtersRole,
        filteredValue: memberRoleFilters.roles || [],
        className: 'memberrole-roles',
        width: '50%',
        render: this.renderRoleColumn,
      },
      {
        title: '',
        width: '20%',
        align: 'right',
        render: this.renderActionColumn,
      },
    ];
    const rowSelection = {
      selectedRowKeys: Object.keys(selectMemberRoles).map(key => Number(key)),
      onChange: (selectedRowkeys, selectedRecords) => {
        this.setState({
          selectMemberRoles: selectedRowkeys.reduce((data, key, index) => {
            const currentRecord = selectedRecords.find(r => r.id === key) || { roles: [] };
            data[key] = currentRecord.roles.map(({ id }) => id);
            return data;
          }, {}),
        });
      },
    };
    return (
      <Table
        key="member-role"
        className="member-role-table"
        loading={loading}
        rowSelection={rowSelection}
        pagination={memberRolePageInfo}
        columns={columns}
        filters={this.state.params}
        onChange={this.memberRoleTableChange}
        dataSource={memberDatas}
        filterBarPlaceholder={this.formatMessage('filtertable')}
        rowKey={({ id }) => id}
        noFilter
      />
    );
  }

  renderRoleTable() {
    const { roleMemberDatas, roleMemberFilterRole, selectRoleMemberKeys, expandedKeys, roleMemberParams, roleMemberFilters, loading } = this.state;
    const filtersData = [...new Set(roleMemberDatas.map(({ name }) => (name)))].map(value => ({ value, text: value }));
    let dataSource = roleMemberDatas;
    if (roleMemberFilterRole && roleMemberFilterRole.length) {
      dataSource = roleMemberDatas.filter(({ name }) => roleMemberFilterRole.some(role => name.indexOf(role) !== -1));
    }
    const columns = [
      {
        title: <FormattedMessage id="memberrole.loginname" />,
        key: 'loginName',
        hidden: true,
        filters: [],
        filteredValue: roleMemberFilters.loginName || [],
      },
      {
        title: <FormattedMessage id="memberrole.rolemember" />,
        filterTitle: <FormattedMessage id="memberrole.role" />,
        key: 'name',
        dataIndex: 'name',
        filters: filtersData,
        filteredValue: roleMemberFilterRole || [],
        render: this.renderRoleLoginNameColumn,
      },
      {
        title: <FormattedMessage id="memberrole.realname" />,
        key: 'realName',
        dataIndex: 'realName',
        filteredValue: roleMemberFilters.realName || [],
        filters: [],
      },
      {
        title: '',
        width: 100,
        align: 'right',
        render: this.renderActionColumn,
      },
    ];
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: selectRoleMemberKeys,
      getCheckboxProps: ({ loginName }) => ({
        disabled: !loginName,
      }),
      onChange: (newSelectRoleMemberKeys, newSelectRoleMembers) => {
        this.setState({
          selectRoleMemberKeys: newSelectRoleMemberKeys,
          selectRoleMembers: newSelectRoleMembers,
        });
      },
    };
    return (
      <Table
        key="role-member"
        loading={loading}
        rowSelection={rowSelection}
        expandedRowKeys={expandedKeys}
        className="role-member-table"
        pagination={false}
        columns={columns}
        filters={roleMemberParams}
        indentSize={0}
        dataSource={dataSource}
        rowKey={({ roleId = '', id }) => [roleId, id].join('-')}
        childrenColumnName="users"
        onChange={this.roleMemberTableChange}
        onExpand={this.handleExpand}
        onExpandedRowsChange={this.handleExpandedRowsChange}
        filterBarPlaceholder={this.formatMessage('filtertable')}
        noFilter

      />
    );
  }

  renderClientMemberTable() {
    const { selectMemberRoles, cilentRoleMemberDatas, clientMemberRolePageInfo, clientMemberDatas, clientMemberRoleFilters, loading } = this.state;
    const filtersRole = [...new Set(cilentRoleMemberDatas.map(({ name }) => (name)))].map(value => ({ value, text: value }));
    const columns = [
      {
        title: <FormattedMessage id="memberrole.client" />,
        dataIndex: 'name',
        key: 'name',
        filters: [],
        filteredValue: clientMemberRoleFilters.name || [],
      },
      {
        title: <FormattedMessage id="memberrole.role" />,
        dataIndex: 'roles',
        key: 'roles',
        filters: filtersRole,
        filteredValue: clientMemberRoleFilters.roles || [],
        className: 'memberrole-roles',
        width: '60%',
        render: this.renderRoleColumn,
      },
      {
        title: '',
        width: 100,
        align: 'right',
        render: this.renderActionColumn,
      },
    ];
    const rowSelection = {
      selectedRowKeys: Object.keys(selectMemberRoles).map(key => Number(key)),
      onChange: (selectedRowkeys, selectedRecords) => {
        this.setState({
          selectMemberRoles: selectedRowkeys.reduce((data, key, index) => {
            // data[key] = selectedRecords[index].roles.map(({ id }) => id);
            const currentRecord = selectedRecords.find(r => r.id === key) || { roles: [] };
            data[key] = currentRecord.roles.map(({ id }) => id);
            return data;
          }, {}),
        });
      },
    };
    return (
      <Table
        key="client-member-role"
        className="member-role-table"
        loading={loading}
        rowSelection={rowSelection}
        pagination={clientMemberRolePageInfo}
        columns={columns}
        filters={this.state.clientParams}
        onChange={this.clientMemberRoleTableChange}
        dataSource={clientMemberDatas}
        filterBarPlaceholder={this.formatMessage('filtertable')}
        rowKey={({ id }) => id}
        noFilter
      />
    );
  }

  renderClientRoleTable() {
    const { cilentRoleMemberDatas, clientRoleMemberFilterRole, selectRoleMemberKeys, expandedKeys, clientRoleMemberParams, clientRoleMemberFilters, loading } = this.state;
    const filtersData = [...new Set(cilentRoleMemberDatas.map(({ name }) => (name)))].map(value => ({ value, text: value }));
    let dataSource = cilentRoleMemberDatas;
    if (clientRoleMemberFilterRole && clientRoleMemberFilterRole.length) {
      dataSource = cilentRoleMemberDatas.filter(({ name }) => clientRoleMemberFilterRole.some(role => name.indexOf(role) !== -1));
    }
    const columns = [
      {
        title: <FormattedMessage id="memberrole.client" />,
        key: 'clientName',
        hidden: true,
        filters: [],
        filteredValue: clientRoleMemberFilters.clientName || [],
      },
      {
        title: <FormattedMessage id="memberrole.roleclient" />,
        filterTitle: <FormattedMessage id="memberrole.role" />,
        key: 'name',
        dataIndex: 'name',
        filters: filtersData,
        filteredValue: clientRoleMemberFilterRole || [],
        render: this.renderRoleClientNameColumn,
      },
      {
        title: '',
        width: 100,
        align: 'right',
        render: this.renderActionColumn,
      },
    ];

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: selectRoleMemberKeys,
      getCheckboxProps: ({ secret }) => ({
        disabled: !secret,
      }),
      onChange: (newSelectRoleMemberKeys, newSelectRoleMembers) => {
        this.setState({
          selectRoleMemberKeys: newSelectRoleMemberKeys,
          selectRoleMembers: newSelectRoleMembers,
        });
      },
    };
    return (
      <Table
        key="client-role-member"
        loading={loading}
        rowSelection={rowSelection}
        className="role-member-table"
        pagination={false}
        columns={columns}
        filters={clientRoleMemberParams}
        indentSize={0}
        dataSource={dataSource}
        rowKey={({ roleId = '', id }) => [roleId, id].join('-')}
        childrenColumnName="users"
        onChange={this.clientRoleMemberTableChange}
        onExpand={this.handleExpand}
        onExpandedRowsChange={this.handleExpandedRowsChange}
        filterBarPlaceholder={this.formatMessage('filtertable')}
        noFilter
      />
    );
  }

  handleExpandedRowsChange = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
  };

  /**
   * 角色表格展开控制
   * @param expand Boolean 是否展开
   * @param data 展开行数据
   */
  handleExpand = (expand, data) => {
    const { users = [], id } = data;
    const { MemberRoleStore } = this.props;
    if (expand && !users.length) {
      if (MemberRoleStore.currentMode === 'user') {
        this.roles.loadRoleMemberData(data, {
          current: 1,
          pageSize,
        }, this.state.roleMemberFilters, this.state.roleMemberParams);
      } else {
        this.roles.loadClientRoleMemberData(data, {
          current: 1,
          pageSize,
        }, this.state.clientRoleMemberFilters, this.state.clientRoleMemberParams);
      }
    }
  };


  /**
   * 上传按钮点击时触发
   */
  handleUpload = () => {
    this.handleUploadInfo(true);
    this.setState({
      sidebar: true,
      selectType: 'upload',
    });
  };

  /**
   * immediately为false时设置2秒查询一次接口，若有更新删除定时器并更新列表
   * @param immediately
   */
  handleUploadInfo = (immediately) => {
    const { MemberRoleStore } = this.props;
    const { fileLoading } = this.state;
    const uploadInfo = MemberRoleStore.getUploadInfo || {};
    if (uploadInfo.finished !== null && fileLoading) {
      this.setState({
        fileLoading: false,
      });
    }
    if (immediately) {
      MemberRoleStore.handleUploadInfo();
      return;
    }
    if (uploadInfo.finished !== null) {
      clearInterval(this.timer);
      return;
    }
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      MemberRoleStore.handleUploadInfo();
      this.init();
    }, 2000);
  };

  upload = (e) => {
    e.stopPropagation();
    const { MemberRoleStore } = this.props;
    const uploading = MemberRoleStore.getUploading;
    const { fileLoading } = this.state;
    if (uploading || fileLoading) {
      return;
    }
    const uploadElement = document.getElementsByClassName('c7n-user-upload-hidden')[0];
    uploadElement.click();
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

  getMemberRoleClass(name) {
    const { showMember } = this.state;
    return classnames({ active: name === 'role' ^ showMember });
  }

  getPermission() {
    const { AppState } = this.props;
    const { type } = AppState.currentMenuType;
    let createService = ['iam-service.role-member.createOrUpdateOnSiteLevel'];
    let deleteService = ['iam-service.role-member.deleteOnSiteLevel'];
    let importService = ['iam-service.role-member.import2MemberRoleOnSite'];
    if (type === 'organization') {
      createService = ['iam-service.role-member.createOrUpdateOnOrganizationLevel'];
      deleteService = ['iam-service.role-member.deleteOnOrganizationLevel'];
      importService = ['iam-service.role-member.import2MemberRoleOnOrganization'];
    } else if (type === 'project') {
      createService = ['iam-service.role-member.createOrUpdateOnProjectLevel'];
      deleteService = ['iam-service.role-member.deleteOnProjectLevel'];
      importService = ['iam-service.role-member.import2MemberRoleOnProject'];
    }
    return {
      createService,
      deleteService,
      importService,
    };
  }

  renderTable = () => {
    const { showMember } = this.state;
    const { MemberRoleStore: { currentMode } } = this.props;
    let showTable;
    if (showMember && currentMode === 'user') {
      showTable = this.renderMemberTable();
    } else if (showMember && currentMode === 'client') {
      showTable = this.renderClientMemberTable();
    } else if (!showMember && currentMode === 'user') {
      showTable = this.renderRoleTable();
    } else {
      showTable = this.renderClientRoleTable();
    }
    return showTable;
  };

  render() {
    const { MemberRoleStore, intl } = this.props;
    const { sidebar, selectType, roleData, showMember, selectMemberRoles, selectRoleMemberKeys, submitting, fileLoading } = this.state;
    const uploading = MemberRoleStore.getUploading;
    const okText = selectType === 'create' ? this.formatMessage('add') : this.formatMessage('save');
    const { createService, deleteService, importService } = this.getPermission();
    return (
      <Page
        service={[
          'iam-service.role-member.createOrUpdateOnSiteLevel',
          'iam-service.role-member.deleteOnSiteLevel',
          'iam-service.role-member.createOrUpdateOnOrganizationLevel',
          'iam-service.role-member.deleteOnOrganizationLevel',
          'iam-service.role-member.createOrUpdateOnProjectLevel',
          'iam-service.role-member.deleteOnProjectLevel',
          'iam-service.role-member.pagingQueryUsersByRoleIdOnOrganizationLevel',
          'iam-service.role-member.listRolesWithUserCountOnOrganizationLevel',
          'iam-service.role-member.pagingQueryUsersWithOrganizationLevelRoles',
          'iam-service.role-member.pagingQueryUsersByRoleIdOnProjectLevel',
          'iam-service.role-member.listRolesWithUserCountOnProjectLevel',
          'iam-service.role-member.pagingQueryUsersWithProjectLevelRoles',
          'iam-service.role-member.pagingQueryUsersByRoleIdOnSiteLevel',
          'iam-service.role-member.listRolesWithUserCountOnSiteLevel',
          'iam-service.role-member.pagingQueryUsersWithSiteLevelRoles',
          'iam-service.role-member.listRolesWithClientCountOnSiteLevel',
          'iam-service.role-member.listRolesWithClientCountOnSiteLevel',
          'iam-service.role-member.pagingQueryClientsWithSiteLevelRoles',
          'iam-service.role-member.listRolesWithClientCountOnOrganizationLevel',
          'iam-service.role-member.pagingQueryClientsByRoleIdOnOrganizationLevel',
          'iam-service.role-member.pagingQueryClientsWithOrganizationLevelRoles',
          'iam-service.role-member.listRolesWithClientCountOnProjectLevel',
          'iam-service.role-member.pagingQueryClientsWithProjectLevelRoles',
          'iam-service.role-member.pagingQueryClientsByRoleIdOnProjectLevel',
          'iam-service.role-member.queryAllUsers',
          'iam-service.role-member.queryAllClients',
        ]}
      >
        <Header title={<FormattedMessage id={`${this.roles.code}.header.title`} />}>
          <Select
            value={MemberRoleStore.currentMode}
            dropdownClassName="c7n-memberrole-select-dropdown"
            className="c7n-memberrole-select"
            onChange={this.changeMode}
          >
            <Option value="user" key="user">{intl.formatMessage({ id: 'memberrole.type.user' })}</Option>
            <Option value="client" key="client">{intl.formatMessage({ id: 'memberrole.client' })}</Option>
          </Select>
          <Permission
            service={createService}
          >
            <Button
              onClick={this.createRole}
              icon="playlist_add"
            >
              <FormattedMessage id="add" />
            </Button>
          </Permission>
          <Permission
            service={importService}
          >
            <Button
              icon="get_app"
              style={{ display: MemberRoleStore.currentMode === 'user' ? 'inline' : 'none' }}
              onClick={this.handleDownLoad}
            >
              <FormattedMessage id={'download.template'} />
              <a id="c7n-user-download-template" href="" onClick={(event) => { event.stopPropagation(); }} download="roleAssignment.xlsx" />
            </Button>
            <Button
              icon="file_upload"
              style={{ display: MemberRoleStore.currentMode === 'user' ? 'inline' : 'none' }}
              onClick={this.handleUpload}
            >
              <FormattedMessage id={'upload.file'} />
            </Button>
          </Permission>
          <Permission
            service={deleteService}
          >
            <Button
              onClick={this.deleteRoleByMultiple}
              icon="delete"
              disabled={!(showMember ? Object.keys(selectMemberRoles) : selectRoleMemberKeys).length}
            >
              <FormattedMessage id="remove" />
            </Button>
          </Permission>
          <Button
            onClick={this.reload}
            icon="refresh"
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          code={this.roles.code}
          values={this.roles.values}
        >
          <div className="member-role-btns">
            <span className="text">
              <FormattedMessage id="memberrole.view" />：
            </span>
            <Button
              className={this.getMemberRoleClass('member')}
              onClick={() => {
                this.showMemberTable(true);
              }}
              type="primary"
            ><FormattedMessage id="memberrole.member" /></Button>
            <Button
              className={this.getMemberRoleClass('role')}
              onClick={() => {
                this.showMemberTable(false);
              }}
              type="primary"
            ><FormattedMessage id="memberrole.role" /></Button>
          </div>
          {this.renderTable()}
          <Sidebar
            title={this.getSidebarTitle()}
            visible={sidebar}
            okText={selectType === 'upload' ? this.getUploadOkText() : okText}
            confirmLoading={uploading || fileLoading || submitting}
            cancelText={<FormattedMessage id={selectType === 'upload' ? 'close' : 'cancel'} />}
            onOk={selectType === 'upload' ? this.upload : this.handleOk}
            onCancel={this.closeSidebar}
          >
            {roleData.length && this.state.selectType !== 'upload' ? this.getSidebarContent() : null}
            {this.state.selectType === 'upload' ? this.renderUpload() : null}
          </Sidebar>
        </Content>
      </Page>
    );
  }
}

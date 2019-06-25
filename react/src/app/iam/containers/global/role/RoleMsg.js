import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import querystring from 'query-string';
import remove from 'lodash/remove';
import { Observable } from 'rxjs';
import _ from 'lodash';
import { Icon, Button, Col, Form, Input, Modal, Row, Select, Table, Tooltip, Tabs, Checkbox } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page, axios } from '@choerodon/boot';
import { RESOURCES_LEVEL } from '@choerodon/boot/lib/containers/common/constants';
import RoleStore from '../../../stores/global/role/RoleStore';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import { handleFiltersParams } from '../../../common/util';
import './Role.scss';
import Sider from './Sider';
import { set, get } from 'mobx';

const { Option } = Select;
const { TabPane } = Tabs;
const { confirm, Sidebar } = Modal;
const FormItem = Form.Item;
const intlPrefix = 'global.role';
const LEVEL_NAME = {
  site: '全局层',
  organization: '组织层',
  project: '项目层',
  user: '个人中心',
};

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    const queryObj = querystring.parse(props.location.search);
    this.level = queryObj.level || undefined;
    this.base = queryObj.base ? queryObj.base.split(',') : [];
    this.roleId = queryObj.roleId || undefined;
    this.isEdit = !!this.roleId;
    this.tabLevel = queryObj.level;
    this.state = {
      submitLoading: false,
    };
  }

  componentDidMount() {
    RoleStore.setSelectedPermissions([]);
    this.loadLabelsAndMenus();
  }

  loadLabelsAndMenus = () => {
    const { level, tabLevel, base } = this;
    RoleStore.setTabLevel(tabLevel);
    this.loadMenu(RoleStore.tabLevel || tabLevel);
    RoleStore.loadRoleLabel(level);
    if (base.length) {
      RoleStore.getSelectedRolePermissions(base)
        .then((res) => {
          RoleStore.setSelectedPermissions(res.map(p => p.id));
        });
    }
    if (this.isEdit) {
      RoleStore.getRoleById(this.roleId)
        .then((res) => {
          this.props.form.resetFields();
          RoleStore.setRoleMsg(res);
          RoleStore.setSelectedPermissions(res.permissions.map(p => p.id));
        });
    }
  }

  loadMenu = (tabLevel) => {
    RoleStore.loadMenu(tabLevel)
      .then((menus) => {
        set(RoleStore.menus, tabLevel, menus.subMenus);
        set(RoleStore.expandedRowKeys, tabLevel, this.getAllIdByLevel(tabLevel));
        if (!RoleStore.tabLevel) {
          RoleStore.setTabLevel(tabLevel);
        }
      });
  }

  check = (selectedPermissions, menu, sign, type) => {
    if (menu.subMenus) {
      menu.subMenus.map(menuItem => this.check(selectedPermissions, menuItem, sign, type));
    }
    this.checkOne(selectedPermissions, menu, sign, type);
  }

  checkOne = (selectedPermissions, menu, sign, type) => {
    if (type === 'all') {
      if (menu.permissions.map(p => p.id).some(pid => selectedPermissions.findIndex(v => v === pid) === -1)) {
        sign.sign = false;
      }
    } else if (type === 'none') {
      if (menu.permissions.map(p => p.id).some(pid => selectedPermissions.findIndex(v => v === pid) !== -1)) {
        sign.sign = false;
      }
    }
  }

  getTabCodes = () => {
    const LEVEL_OBJ = {
      site: ['site', 'user'],
      project: ['project'],
      organization: ['organization'],
    };
    return LEVEL_OBJ[this.level] || [];
  }

  getIds = (menu, res) => {
    res.push(menu.id);
    if (menu.subMenus) {
      menu.subMenus.map(menuItem => this.getIds(menuItem, res));
    }
  }

  getAllIdByLevel = (level) => {
    const menus = get(RoleStore.menus, level) || [];
    const res = [];
    menus.map(menu => this.getIds(menu, res));
    return res;
  }

  getOneMenuPermissons = (menu, res) => {
    res.res = res.res.concat(menu.permissions.map(p => p.id));
  }

  getPermissions = (menu, res) => {
    if (menu.subMenus) {
      menu.subMenus.map(menuItem => this.getPermissions(menuItem, res));
    }
    this.getOneMenuPermissons(menu, res);
  }

  getAllPermissionsByRecord = (record, originRes) => {
    const res = originRes || { res: [] };
    this.getPermissions(record, res);
    if (!originRes) {
      res.res = [...new Set(res.res)];
      return res.res;
    }
  }

  getAllPermissionsByLevel = (level) => {
    const menus = get(RoleStore.menus, level) || [];
    const res = { res: [] };
    menus.map(menu => this.getAllPermissionsByRecord(menu, res));
    res.res = [...new Set(res.res)];
    return res.res;
  }

  getCheckState = (type, selectedPermissions, record) => {
    const sign = { sign: true };
    this.check(selectedPermissions, record, sign, type);
    return sign.sign;
  }

  checkCode = (rule, value, callback) => {
    const { isEdit, level } = this;
    if (isEdit) {
      callback();
    }
    const validValue = `role/${level}/custom/${value}`;
    const params = { code: validValue };
    axios.post('/iam/v1/roles/check', JSON.stringify(params)).then((mes) => {
      if (mes.failed) {
        const { intl } = this.props;
        callback(intl.formatMessage({ id: `${intlPrefix}.code.exist.msg` }));
      } else {
        callback();
      }
    });
  };

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleExpand = (expanded, record) => {
    const expandedRowKeys = get(RoleStore.expandedRowKeys, RoleStore.tabLevel) || [];
    if (expanded) {
      expandedRowKeys.push(record.id);
    } else {
      remove(expandedRowKeys, v => v === record.id);
    }
    set(RoleStore.expandedRowKeys, RoleStore.tabLevel, expandedRowKeys);
  }

  handleCheckboxAllClick = (checkedAll, checkedNone, checkedSome, e) => {
    const allPermissionsByRecord = this.getAllPermissionsByLevel(RoleStore.tabLevel);
    const { selectedPermissions } = RoleStore;
    let sp = selectedPermissions.slice();
    if (checkedNone || checkedSome) {
      sp = sp.concat(allPermissionsByRecord);
      sp = [...new Set(sp)];
    } else {
      remove(sp, p => allPermissionsByRecord.includes(p));
    }
    RoleStore.setSelectedPermissions(sp);
  }

  handleCheckboxClick = (record, checkedAll, checkedNone, checkedSome, e) => {
    const allPermissionsByRecord = this.getAllPermissionsByRecord(record);
    const { selectedPermissions } = RoleStore;
    let sp = selectedPermissions.slice();
    if (checkedNone || checkedSome) {
      sp = sp.concat(allPermissionsByRecord);
      sp = [...new Set(sp)];
    } else {
      remove(sp, p => allPermissionsByRecord.includes(p));
    }
    RoleStore.setSelectedPermissions(sp);
  }

  handleCreate = (e) => {
    const { level, isEdit } = this;
    const isDefault = isEdit && (RoleStore.roleMsg.code || '').startsWith(`role/${level}/default/`);
    const codePrefix = isDefault
      ? `role/${level}/default/`
      : `role/${level}/custom/`;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.setState({ submitLoading: true });
        const labelValues = this.props.form.getFieldValue('label');
        const labelIds = labelValues && labelValues.map(labelId => ({ id: labelId }));
        const role = {
          name: this.props.form.getFieldValue('name').trim(),
          code: `${codePrefix}${this.props.form.getFieldValue('code').trim()}`,
          level: this.level,
          permissions: RoleStore.selectedPermissions.slice().map(p => ({ id: p })),
          labels: labelIds,
          objectVersionNumber: RoleStore.roleMsg.objectVersionNumber,
        };
        const { intl } = this.props;
        if (this.isEdit) {
          RoleStore.editRoleByid(this.roleId, role)
            .then((data) => {
              if (!data.failed) {
                Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                this.setState({ submitLoading: false });
                this.linkToChange(`/iam/role?level=${this.level}`);
              } else {
                Choerodon.prompt(data.message);
                this.setState({ submitLoading: false });
              }
            });
        } else {
          RoleStore.createRole(role)
            .then((data) => {
              if (data && !data.failed) {
                Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                this.setState({ submitLoading: false });
                this.linkToChange(`/iam/role?level=${this.level}`);
              } else {
                Choerodon.prompt(data.message);
                this.setState({ submitLoading: false });
              }
            })
            .catch((errors) => {
              if (errors.response.data.message === 'error.role.roleNameExist') {
                Choerodon.prompt(intl.formatMessage({ id: `${intlPrefix}.name.exist.msg` }));
              } else {
                Choerodon.prompt(intl.formatMessage({ id: 'create.error' }));
              }
            });
        }
      }
    });
  };

  handleReset = () => {
    this.linkToChange(`/iam/role?level=${this.level}`);
  };

  handleChangeTabLevel = (key) => {
    RoleStore.setTabLevel(key);
    if (!get(RoleStore.menus, key)) {
      this.loadMenu(key);
    }
  }

  handleOpenSider = (record) => {
    RoleStore.setCurrentMenu(record);
    RoleStore.setSiderVisible(true);
  }

  handleSiderOk = (selectedPermissions) => {
    const { level, isEdit } = this;
    const isDefault = isEdit && (RoleStore.roleMsg.code || '').startsWith(`role/${level}/default/`);
    if (isDefault) {
      RoleStore.setSiderVisible(false);
      return;
    }
    RoleStore.setSelectedPermissions(selectedPermissions);
    RoleStore.setSiderVisible(false);
  }

  handleSiderCancel = () => {
    RoleStore.setSiderVisible(false);
  }

  handleClickExpandBtn = () => {
    const tabLevel = RoleStore.tabLevel || this.tabLevel;
    const expand = get(RoleStore.expand, tabLevel);
    if (expand) {
      // 需要展开
      set(RoleStore.expandedRowKeys, tabLevel, this.getAllIdByLevel(tabLevel));
    } else {
      // 需要收起
      set(RoleStore.expandedRowKeys, tabLevel, []);
    }
    set(RoleStore.expand, tabLevel, !expand);
  }

  renderCheckbox = (isDefault) => {
    const { selectedPermissions } = RoleStore;
    const allPermissionsByLevel = this.getAllPermissionsByLevel(RoleStore.tabLevel);
    const checkedAll = allPermissionsByLevel.every(p => selectedPermissions.includes(p));
    const checkedNone = allPermissionsByLevel.every(p => !selectedPermissions.includes(p));
    const checkedSome = !checkedAll && !checkedNone;
    return (
      <Checkbox
        indeterminate={checkedSome}
        onChange={this.handleCheckboxAllClick.bind(this, checkedAll, checkedNone, checkedSome)}
        checked={!checkedNone}
        disabled={isDefault}
      />
    );
  }

  renderRoleLabel = () => {
    const labels = RoleStore.getLabel;
    return labels.map(({ id, name }) => (
      <Option key={id} value={id}>{name}</Option>
    ));
  };

  renderForm = () => {
    const { level, props: { intl, form: { getFieldDecorator } }, isEdit } = this;
    const isDefault = isEdit && (RoleStore.roleMsg.code || '').startsWith(`role/${level}/default/`);
    const codePrefix = isDefault
      ? `role/${level}/default/`
      : `role/${level}/custom/`;
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

    return (
      <Form layout="vertical">
        <FormItem {...formItemLayout} style={{ display: 'inline-block', marginRight: 12 }}>
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: `${intlPrefix}.code.require.msg` }),
            }, {
              pattern: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
              message: intl.formatMessage({ id: `${intlPrefix}.code.pattern.msg` }),
            }, {
              validator: this.checkCode,
            }],
            validateFirst: true,
            initialValue: isEdit ? (RoleStore.roleMsg.code || '').slice(codePrefix.length) : undefined,
          })(
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.code`} />}
              prefix={codePrefix}
              size="default"
              style={{ width: 250 }}
              disabled={isEdit}
              maxLength={64}
              showLengthInfo={false}
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} style={{ display: 'inline-block' }}>
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
            }],
            initialValue: isEdit ? RoleStore.roleMsg.name : undefined,
          })(
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.name`} />}
              style={{ width: 250 }}
              maxLength={64}
              showLengthInfo={false}
              disabled={isDefault}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('label', {
            initialValue: isEdit ? (RoleStore.roleMsg.labels || []).map(l => l.id) : [],
          })(
            <Select
              mode="multiple"
              label={<FormattedMessage id={`${intlPrefix}.label`} />}
              size="default"
              style={{ width: 512 }}
              disabled={false}
            >
              {this.renderRoleLabel()}
            </Select>,
          )}
        </FormItem>
      </Form>
    );
  }

  renderTable = (level) => {
    const data = get(RoleStore.menus, level);
    const expandedRowKeys = get(RoleStore.expandedRowKeys, level) || [];
    const { isEdit } = this;
    const isDefault = isEdit && (RoleStore.roleMsg.code || '').startsWith(`role/${this.level}/default/`);
    const columns = [{
      title: '菜单',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text, record) => (
        <span>
          <Icon type={record.icon} style={{ marginRight: 8, verticalAlign: 'top' }} />
          {text}
        </span>
      ),
    }, {
      title: this.renderCheckbox(isDefault),
      dataIndex: 'id',
      key: 'id',
      width: '36px',
      render: (text, record) => {
        const { selectedPermissions } = RoleStore;
        const checkedAll = this.getCheckState('all', selectedPermissions, record);
        const checkedNone = this.getCheckState('none', selectedPermissions, record);
        const checkedSome = !checkedAll && !checkedNone;
        return (
          <Checkbox
            indeterminate={checkedSome}
            onChange={this.handleCheckboxClick.bind(this, record, checkedAll, checkedNone, checkedSome)}
            checked={!checkedNone}
            disabled={isDefault}
          />
        );
      },
    }, {
      title: '页面入口',
      dataIndex: 'route',
      key: 'route',
    }, {
      title: '',
      width: '50px',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        const { subMenus } = record;
        if (!subMenus || !subMenus.length) {
          return (
            <Tooltip
              title="配置"
              placement="bottom"
            >
              <Button
                shape="circle"
                icon="predefine"
                size="small"
                onClick={this.handleOpenSider.bind(this, record)}
              />
            </Tooltip>
          );
        }
        return null;
      },
    }];
    return (
      <Table
        loading={false}
        filterBar={false}
        pagination={false}
        columns={columns}
        defaultExpandAllRows
        dataSource={data ? data.slice() : []}
        childrenColumnName="subMenus"
        rowKey={record => record.id}
        expandedRowKeys={expandedRowKeys.slice()}
        onExpand={this.handleExpand}
        indentSize={25}
      />
    );
  }

  renderBtns = () => {
    return (
      <div style={{ marginTop: 32 }}>
        <Button
          funcType="raised"
          type="primary"
          onClick={this.handleCreate}
          style={{ marginRight: 12 }}
          loading={this.state.submitLoading}
        >
          <FormattedMessage id={!this.isEdit ? 'create' : 'save'} />
        </Button>
        <Button
          funcType="raised"
          onClick={this.handleReset}
          style={{ color: '#3F51B5' }}
        >
          <FormattedMessage id="cancel" />
        </Button>
      </div>
    );
  }

  renderSider = () => {
    const { siderVisible, currentMenu, selectedPermissions } = RoleStore;
    const { isEdit } = this;
    const isDefault = isEdit && (RoleStore.roleMsg.code || '').startsWith(`role/${this.level}/default/`);
    if (siderVisible) {
      return (
        <Sider
          selectedPermissions={selectedPermissions}
          menu={currentMenu}
          onOk={this.handleSiderOk}
          onCancel={this.handleSiderCancel}
          disabled={isDefault}
        />
      );
    }
    return null;
  }

  renderTab = () => {
    const tabLevel = RoleStore.tabLevel || this.tabLevel;
    const expand = get(RoleStore.expand, tabLevel);
    return (
      <React.Fragment>
        <div>
          <span style={{ marginRight: 80, fontSize: '16px' }}>菜单分配</span>
          <Button
            type="primary"
            funcType="flat"
            icon={expand ? 'expand_more' : 'expand_less'}
            onClick={this.handleClickExpandBtn}
          >
            全部{expand ? '展开' : '收起'}
          </Button>
        </div>
        <Tabs onChange={this.handleChangeTabLevel} activeKey={tabLevel}>
          {this.getTabCodes().map(level => (
            <TabPane tab={LEVEL_NAME[level] || level} key={level}>
              {this.renderTable(level)}
            </TabPane>
          ))}
        </Tabs>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Page className="c7n-roleMsg">
        <Header
          title={`${!this.isEdit ? '创建' : '修改'}${LEVEL_NAME[this.level]}角色`}
          backPath={`/iam/role?level=${this.level}`}
        />
        <Content>
          {this.renderForm()}
          {this.renderTab()}
          {this.renderBtns()}
          {this.renderSider()}
        </Content>
      </Page>
    );
  }
}

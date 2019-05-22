import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Observable } from 'rxjs';
import _ from 'lodash';
import { Button, Col, Form, Input, Modal, Row, Select, Table, Tooltip } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page, axios } from '@choerodon/boot';
import RoleStore from '../../../stores/global/role/RoleStore';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import { handleFiltersParams } from '../../../common/util';
import './Role.scss';

const { Option } = Select;
const { confirm, Sidebar } = Modal;
const FormItem = Form.Item;
const intlPrefix = 'global.role';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    const level = RoleStore.getChosenLevel !== '';
    this.state = {
      visible: false,
      selectedLevel: 'site',
      code: '',
      description: '',
      page: 1,
      pageSize: 10,
      alreadyPage: 1,
      errorName: '',
      errorDescription: '',
      submitting: false,
      selectedRowKeys: [],
      selectedSideBar: [],
      currentPermission: [],
      firstLoad: true,
      initLevel: level,
      permissionParams: [],
    };
  }

  componentWillMount() {
    this.setCanPermissionCanSee();
    const permissions = RoleStore.getSelectedRolesPermission || [];
    this.setState({
      currentPermission: permissions.map(item => item.id),
    });
  }

  componentWillUnmount() {
    RoleStore.setCanChosePermission('site', []);
    RoleStore.setCanChosePermission('organization', []);
    RoleStore.setCanChosePermission('project', []);
    RoleStore.setChosenLevel('');
    RoleStore.setSelectedRolesPermission([]);
  }

  // 获取权限管理数据
  setCanPermissionCanSee() {
    const levels = ['organization', 'project', 'site'];
    for (let c = 0; c < levels.length; c += 1) {
      Observable.fromPromise(axios.get(`iam/v1/permissions?level=${levels[c]}`))
        .subscribe((data) => {
          RoleStore.handleCanChosePermission(levels[c], data);
        });
    }
  }

  checkCode = (rule, value, callback) => {
    const validValue = `role/${RoleStore.getChosenLevel}/custom/${value}`;
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

  showModal = () => {
    const { currentPermission } = this.state;
    RoleStore.setPermissionPage(RoleStore.getChosenLevel, {
      current: 1,
      pageSize: 10,
      total: '',
    });
    this.setState({
      permissionParams: [],
    }, () => {
      this.setCanPermissionCanSee(RoleStore.getChosenLevel);
      const selected = RoleStore.getSelectedRolesPermission
        .filter(item => currentPermission.indexOf(item.id) !== -1);
      RoleStore.setInitSelectedPermission(selected);
      this.setState({
        visible: true,
      });
    });
  };

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleChangePermission = (selected, ids, permissions) => {
    const initPermission = RoleStore.getInitSelectedPermission;
    if (selected) {
      const newPermission = initPermission.concat(permissions);
      RoleStore.setInitSelectedPermission(_.uniqBy(newPermission, 'code'));
    } else {
      const centerPermission = initPermission.slice();
      _.remove(centerPermission, item => ids.indexOf(item.id) !== -1);
      RoleStore.setInitSelectedPermission(centerPermission);
    }
  };

  handleOk = () => {
    const selected = RoleStore.getInitSelectedPermission;
    const selectedIds = selected.map(item => item.id);
    RoleStore.setSelectedRolesPermission(_.uniqBy(selected));
    this.setState({
      currentPermission: selectedIds,
      visible: false,
      alreadyPage: 1,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      firstLoad: false,
    });
  };

  handleCreate = (e) => {
    e.preventDefault();
    this.setState({
      firstLoad: false,
    });
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        const { intl } = this.props;
        const { currentPermission } = this.state;
        const rolePermissionss = [];
        currentPermission.forEach(id =>
          rolePermissionss.push({ id }));
        if (rolePermissionss.length > 0) {
          const labelValues = this.props.form.getFieldValue('label');
          const labelIds = labelValues && labelValues.map(labelId => ({ id: labelId }));
          const role = {
            name: this.props.form.getFieldValue('name').trim(),
            modified: this.props.form.getFieldValue('modified'),
            enabled: this.props.form.getFieldValue('enabled'),
            code: `role/${RoleStore.getChosenLevel}/custom/${this.props.form.getFieldValue('code').trim()}`,
            level: RoleStore.getChosenLevel,
            permissions: rolePermissionss,
            labels: labelIds,
          };
          this.setState({ submitting: true });
          RoleStore.createRole(role)
            .then((data) => {
              this.setState({ submitting: false });
              if (data && !data.failed) {
                Choerodon.prompt(intl.formatMessage({ id: 'create.success' }));
                this.linkToChange('/iam/role');
              } else {
                Choerodon.prompt(data.message);
              }
            })
            .catch((errors) => {
              this.setState({ submitting: false });
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
    this.linkToChange('/iam/role');
  };

  handleModal = (value) => {
    const { form, intl } = this.props;
    const that = this;
    const { getFieldValue, setFieldsValue } = form;
    const { currentPermission } = this.state;
    const level = getFieldValue('level');
    const code = getFieldValue('code');
    const label = getFieldValue('label');

    if (level && (currentPermission.length || code || label.length)) {
      confirm({
        title: intl.formatMessage({ id: `${intlPrefix}.modify.level.title` }),
        content: intl.formatMessage({ id: `${intlPrefix}.modify.level.content` }),
        onOk() {
          RoleStore.setChosenLevel(value);
          RoleStore.setSelectedRolesPermission([]);
          RoleStore.loadRoleLabel(value);
          setFieldsValue({ code: '', label: [] });
          that.setState({
            currentPermission: [],
          });
        },
        onCancel() {
          setFieldsValue({ level });
        },
      });
    } else {
      RoleStore.setChosenLevel(value);
      RoleStore.setSelectedRolesPermission([]);
      RoleStore.loadRoleLabel(value);
      setFieldsValue({ code: '', label: [] });
      this.setState({
        currentPermission: [],
      });
    }
  };

  handlePageChange = (pagination, filters, sorter, params) => {
    const level = RoleStore.getChosenLevel;
    this.setState({
      permissionParams: params,
    });
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      RoleStore.setCanChosePermission(level, []);
      RoleStore.setPermissionPage(level, {
        current: 1,
        total: 0,
        size: 10,
      });
      return;
    }

    const newFilters = {
      params: (params && params.join(',')) || '',
    };
    RoleStore.getWholePermission(level, pagination, newFilters).subscribe((data) => {
      RoleStore.handleCanChosePermission(level, data);
    });
  };

  renderRoleLabel = () => {
    const labels = RoleStore.getLabel;
    return labels.map(item =>
      <Option key={item.id} value={`${item.id}`}>{item.name}</Option>);
  };

  render() {
    const { currentPermission, firstLoad, submitting, initLevel } = this.state;
    const { intl, AppState } = this.props;
    const { getFieldDecorator } = this.props.form;
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
    const origin = RoleStore.getCanChosePermission;
    const data = RoleStore.getChosenLevel !== '' ? origin[RoleStore.getChosenLevel].slice() : [];
    const pagination = RoleStore.getPermissionPage[RoleStore.getChosenLevel];
    const selectedPermission = RoleStore.getSelectedRolesPermission || [];
    const changePermission = RoleStore.getInitSelectedPermission || [];
    const level = RoleStore.getChosenLevel;
    const codePrefix = `role/${level || 'level'}/custom/`;
    return (
      <Page className="choerodon-roleCreate">
        <Header
          title={<FormattedMessage id={`${intlPrefix}.create`} />}
          backPath="/iam/role"
        />
        <Content
          code={`${intlPrefix}.create`}
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          <div>
            <Form layout="vertical">
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('level', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.level.require.msg` }),
                  }],
                  initialValue: level !== '' ? level : undefined,
                })(
                  <Select
                    label={<FormattedMessage id={`${intlPrefix}.level`} />}
                    ref={this.saveSelectRef}
                    size="default"
                    style={{
                      width: '512px',
                    }}
                    getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                    onChange={this.handleModal}
                    disabled={initLevel}
                  >
                    <Option value="site">{intl.formatMessage({ id: 'global' })}</Option>
                    <Option value="organization">{intl.formatMessage({ id: 'organization' })}</Option>
                    <Option value="project">{intl.formatMessage({ id: 'project' })}</Option>
                  </Select>,
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
                    message: intl.formatMessage({ id: `${intlPrefix}.code.pattern.msg` }),
                  }, {
                    validator: this.checkCode,
                  }],
                  validateFirst: true,
                  initialValue: this.state.roleName,
                })(
                  <Input
                    autoComplete="off"
                    label={<FormattedMessage id={`${intlPrefix}.code`} />}
                    prefix={codePrefix}
                    size="default"
                    style={{
                      width: '512px',
                    }}
                    disabled={level === ''}
                    maxLength={64}
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
                    whitespace: true,
                    message: intl.formatMessage({ id: `${intlPrefix}.name.require.msg` }),
                  }],
                  initialValue: this.state.name,
                })(
                  <Input
                    autoComplete="off"
                    label={<FormattedMessage id={`${intlPrefix}.name`} />}
                    type="textarea"
                    rows={1}
                    style={{
                      width: '512px',
                    }}
                    maxLength={64}
                    showLengthInfo={false}
                  />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('label')(
                  <Select
                    mode="multiple"
                    label={<FormattedMessage id={`${intlPrefix}.label`} />}
                    size="default"
                    getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                    style={{
                      width: '512px',
                    }}
                    disabled={RoleStore.getChosenLevel === ''}
                  >
                    {this.renderRoleLabel()}
                  </Select>,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
              >
                <Tooltip
                  placement="top"
                  title={<FormattedMessage id={RoleStore.getChosenLevel ? `${intlPrefix}.add.permission` : `${intlPrefix}.level.nothing.msg`} />}
                >
                  <Button
                    funcType="raised"
                    onClick={this.showModal.bind(this)}
                    disabled={RoleStore.getChosenLevel === ''}
                    className="addPermission"
                    icon="add"
                  >
                    <FormattedMessage id={`${intlPrefix}.add.permission`} />
                  </Button>
                </Tooltip>
              </FormItem>
              <FormItem>
                {currentPermission.length > 0 ? (
                  <span className="alreadyDes">
                    <FormattedMessage id={`${intlPrefix}.permission.count.msg`} values={{ count: currentPermission.length }} />
                  </span>
                ) : (
                  <span className="alreadyDes">
                    <FormattedMessage id={`${intlPrefix}.permission.nothing.msg`} />
                  </span>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
              >
                <Table
                  className="c7n-role-permission-table"
                  columns={[{
                    title: <FormattedMessage id={`${intlPrefix}.permission.code`} />,
                    width: '50%',
                    dataIndex: 'code',
                    key: 'code',
                    render: text => (
                      <MouseOverWrapper text={text} width={0.5}>
                        {text}
                      </MouseOverWrapper>
                    ),
                  }, {
                    title: <FormattedMessage id={`${intlPrefix}.permission.desc`} />,
                    width: '50%',
                    dataIndex: 'description',
                    key: 'description',
                    render: text => (
                      <MouseOverWrapper text={text} width={0.5}>
                        {text}
                      </MouseOverWrapper>
                    ),
                  }]}
                  dataSource={selectedPermission || []}
                  filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
                  rowSelection={{
                    selectedRowKeys: currentPermission,
                    onChange: (selectedRowKeys, selectedRows) => {
                      this.setState({
                        currentPermission: selectedRowKeys,
                      });
                    },
                  }}
                  rowKey="id"
                />
                {!firstLoad && !currentPermission.length ? (
                  <div style={{ color: '#d50000' }} className="c7n-form-explain">
                    <FormattedMessage id={`${intlPrefix}.permission.require.msg`} />
                  </div>
                ) : null}
              </FormItem>
              <FormItem>
                <Row className="mt-md">
                  <Col className="choerodon-btn-create">
                    <Button
                      funcType="raised"
                      type="primary"
                      onClick={this.handleCreate}
                      loading={submitting}
                    >
                      <FormattedMessage id="create" />
                    </Button>
                  </Col>
                  <Col span={5}>
                    <Button
                      funcType="raised"
                      onClick={this.handleReset}
                      disabled={submitting}
                      style={{ color: '#3F51B5' }}
                    >
                      <FormattedMessage id="cancel" />
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
            <Sidebar
              title={<FormattedMessage id={`${intlPrefix}.add.permission`} />}
              visible={this.state.visible}
              onOk={this.handleOk.bind(this)}
              onCancel={this.handleCancel.bind(this)}
              okText={intl.formatMessage({ id: 'ok' })}
              cancelText={intl.formatMessage({ id: 'cancel' })}
            >
              <Content
                className="sidebar-content"
                code={`${intlPrefix}.create.addpermission`}
              >
                <Table
                  className="c7n-role-permission-table"
                  columns={[{
                    title: <FormattedMessage id={`${intlPrefix}.permission.code`} />,
                    width: '50%',
                    dataIndex: 'code',
                    key: 'code',
                    render: text => (
                      <MouseOverWrapper text={text} width={0.4}>
                        {text}
                      </MouseOverWrapper>
                    ),
                  }, {
                    title: <FormattedMessage id={`${intlPrefix}.permission.desc`} />,
                    width: '50%',
                    dataIndex: 'description',
                    key: 'description',
                    render: text => (
                      <MouseOverWrapper text={text} width={0.4}>
                        {text}
                      </MouseOverWrapper>
                    ),
                  }]}
                  rowKey="id"
                  dataSource={data}
                  pagination={pagination}
                  onChange={this.handlePageChange}
                  filters={this.state.permissionParams}
                  filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
                  rowSelection={{
                    selectedRowKeys: (changePermission
                      && changePermission.map(item => item.id)) || [],
                    onSelect: (record, selected, selectedRows) => {
                      this.handleChangePermission(selected, [record.id], selectedRows);
                    },
                    onSelectAll: (selected, selectedRows, changeRows) => {
                      const ids = _.map(changeRows, item => item.id);
                      this.handleChangePermission(selected, ids, selectedRows);
                    },
                  }}
                />
              </Content>
            </Sidebar>
          </div>
        </Content>
      </Page>
    );
  }
}

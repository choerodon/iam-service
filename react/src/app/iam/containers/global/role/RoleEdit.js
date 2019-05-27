import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Col, Form, Input, Modal, Row, Select, Table } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page } from '@choerodon/boot';
import _ from 'lodash';
import RoleStore from '../../../stores/global/role/RoleStore';
import MouseOverWrapper from '../../../components/mouseOverWrapper';
import './Role.scss';

const { Option } = Select;
const { Sidebar } = Modal;
const FormItem = Form.Item;
const intlPrefix = 'global.role';

@Form.create({})
@withRouter
@injectIntl
@inject('AppState')
@observer
export default class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleData: {},
      visible: false,
      selectedLevel: 'site',
      submitting: false,
      id: this.props.match.params.id,
      currentPermission: [],
      selectPermission: [],
      permissionParams: [],
    };
  }

  componentWillMount() {
    RoleStore.getRoleById(this.state.id).then((data) => {
      this.setState({
        roleData: data,
        currentPermission: data.permissions.map(item => item.id),
      });
      RoleStore.setSelectedRolesPermission(data.permissions);
      this.setCanPermissionCanSee(data.level);
      RoleStore.setChosenLevel(data.level);
      RoleStore.loadRoleLabel(data.level);
    }).catch((error) => {
      const message = this.props.intl.formatMessage({ id: `${intlPrefix}.getinfo.error.msg` });
      Choerodon.prompt(`${message}: ${error}`);
    });
  }

  componentWillUnmount() {
    RoleStore.setCanChosePermission('site', []);
    RoleStore.setCanChosePermission('organization', []);
    RoleStore.setCanChosePermission('project', []);
    RoleStore.setSelectedRolesPermission([]);
  }

  // 获取权限管理数据
  setCanPermissionCanSee(level) {
    RoleStore.getWholePermission(level,
      RoleStore.getPermissionPage[level]).subscribe((data) => {
      RoleStore.handleCanChosePermission(level, data);
    });
  }

  getCurrentLabelValue() {
    const { roleData } = this.state;
    return roleData.labels.map(value => `${value.id}`);
  }

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleOk = () => {
    const selected = RoleStore.getInitSelectedPermission;
    const selectedIds = selected.map(item => item.id);
    RoleStore.setSelectedRolesPermission(_.uniqBy(selected));
    this.setState({
      visible: false,
      currentPermission: selectedIds,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    const { currentPermission, roleData } = this.state;
    RoleStore.setPermissionPage(RoleStore.getChosenLevel, {
      current: 1,
      pageSize: 10,
      total: '',
    });
    this.setState({
      permissionParams: [],
    }, () => {
      this.setCanPermissionCanSee(roleData.level);
      const selected = RoleStore.getSelectedRolesPermission
        .filter(item => currentPermission.indexOf(item.id) !== -1);
      RoleStore.setInitSelectedPermission(selected);
      this.setState({
        visible: true,
      });
    });
  };

  isModify = () => {
    const { currentPermission, roleData } = this.state;
    const permissions = roleData.permissions.map(item => item.id);
    const currents = currentPermission.map(item => item.id);
    if (currents.length !== permissions.length) {
      return true;
    }
    for (let i = 0; i < permissions.length; i += 1) {
      if (!currents.includes(permissions[i].id)) {
        return true;
      }
    }
    return false;
  };

  handleEdit = () => {
    const { intl } = this.props;
    this.props.form.validateFieldsAndScroll((err, values, modify) => {
      if (!err) {
        if (!modify && !this.isModify()) {
          Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
          this.linkToChange('/iam/role');
          return;
        }
        const { currentPermission } = this.state;
        const rolePermissionss = [];
        currentPermission.forEach(id =>
          rolePermissionss.push({ id }));
        if (rolePermissionss.length) {
          const labelValues = this.props.form.getFieldValue('label');
          const labelIds = labelValues && labelValues.map(labelId => ({ id: labelId }));
          const role = {
            name: this.props.form.getFieldValue('name').trim(),
            editable: this.props.form.getFieldValue('isEdit'),
            enabled: this.props.form.getFieldValue('isEnable'),
            code: this.props.form.getFieldValue('code'),
            level: this.state.roleData.level,
            permissions: rolePermissionss,
            labels: labelIds,
            objectVersionNumber: this.state.roleData.objectVersionNumber,
          };
          this.setState({ submitting: true });
          RoleStore.editRoleByid(this.state.id, role)
            .then((data) => {
              this.setState({ submitting: false });
              if (data) {
                Choerodon.prompt(intl.formatMessage({ id: 'modify.success' }));
                this.linkToChange('/iam/role');
              }
            })
            .catch((errors) => {
              this.setState({ submitting: false });
              Choerodon.prompt(intl.formatMessage({ id: 'modify.error' }));
            });
        }
      }
    });
  };

  handlePageChange = (pagination, filters, sorter, params) => {
    const { roleData } = this.state;
    const newFilters = {
      params: (params && params.join(',')) || '',
    };
    this.setState({
      permissionParams: params,
    });
    RoleStore.getWholePermission(roleData.level, pagination, newFilters).subscribe((data) => {
      RoleStore.handleCanChosePermission(roleData.level, data);
    });
  };


  handleReset = () => {
    this.props.history.goBack();
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

  renderRoleLabel = () => {
    const labels = RoleStore.getLabel;
    const result = labels.map(item =>
      <Option key={item.id} value={`${item.id}`}>{item.name}</Option>);
    return result;
  };

  renderLevel() {
    const { intl } = this.props;
    if (this.state.roleData.level === 'site') {
      return intl.formatMessage({ id: 'global' });
    } else if (this.state.roleData.level === 'organization') {
      return intl.formatMessage({ id: 'organization' });
    } else {
      return intl.formatMessage({ id: 'project' });
    }
  }

  render() {
    const {
      roleData = {},
      chosenLevel,
      visible,
      currentPermission,
      submitting,
    } = this.state;
    const { intl, AppState } = this.props;
    const { level, name, code, labels, builtIn } = roleData;
    const origin = RoleStore.getCanChosePermission;
    const data = level ? origin[level].slice() : [];
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
    const pagination = RoleStore.getPermissionPage[level];
    const selectedPermission = _.uniqBy(RoleStore.getSelectedRolesPermission, 'code') || [];
    const changePermission = RoleStore.getInitSelectedPermission || [];
    return (
      <div>
        <Page>
          <Header
            title={<FormattedMessage id={`${intlPrefix}.modify`} />}
            backPath="/iam/role"
          />
          <Content
            code={`${intlPrefix}.modify`}
            values={{ name }}
          >
            <Form layout="vertical">
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('level', {
                  initialValue: this.renderLevel(),
                })(
                  <Input
                    size="default"
                    label={<FormattedMessage id={`${intlPrefix}.level`} />}
                    autoComplete="off"
                    style={{
                      width: '512px',
                    }}
                    disabled
                  />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    whitespace: true,
                  }],
                  initialValue: code,
                })(
                  <Input
                    size="default"
                    label={<FormattedMessage id={`${intlPrefix}.code`} />}
                    autoComplete="off"
                    style={{
                      width: '512px',
                    }}
                    disabled
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
                    whitespace: true,
                  }],
                  initialValue: name,
                })(
                  <Input
                    rows={1}
                    label={<FormattedMessage id={`${intlPrefix}.name`} />}
                    autoComplete="off"
                    style={{
                      width: '512px',
                    }}
                    disabled={builtIn}
                  />,
                )}
              </FormItem>
              {labels ? (
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('label', {
                    valuePropName: 'value',
                    initialValue: this.getCurrentLabelValue(),
                  })(
                    <Select
                      mode="multiple"
                      size="default"
                      // disabled={!RoleStore.getLabel.length}
                      label={<FormattedMessage id={`${intlPrefix}.label`} />}
                      getPopupContainer={() => document.getElementsByClassName('page-content')[0]}
                      style={{
                        width: '512px',
                      }}
                    >
                      {this.renderRoleLabel()}
                    </Select>,
                  )}
                </FormItem>
              ) : null}
              <FormItem
                {...formItemLayout}
              >
                <Button
                  funcType="raised"
                  onClick={this.showModal.bind(this)}
                  disabled={chosenLevel === '' || builtIn}
                  className="addPermission"
                  icon="add"
                >
                  <FormattedMessage id={`${intlPrefix}.add.permission`} />
                </Button>
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
                  rowKey="id"
                  dataSource={selectedPermission || []}
                  filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
                  rowSelection={{
                    selectedRowKeys: currentPermission,
                    onChange: (selectedRowKeys, selectedRows) => {
                      this.setState({
                        currentPermission: selectedRowKeys,
                      });
                    },
                    getCheckboxProps: () => ({ disabled: builtIn }),
                  }}
                />
                {currentPermission.length === 0 ? (
                  <div style={{ color: '#d50000' }} className="c7n-form-explain">
                    <FormattedMessage id={`${intlPrefix}.permission.require.msg`} />
                  </div>
                ) : ''}
              </FormItem>
              <FormItem>
                <Row style={{ marginTop: '2rem' }}>
                  <Col style={{ float: 'left', marginRight: '10px' }}>
                    <Button
                      funcType="raised"
                      type="primary"
                      onClick={this.handleEdit}
                      loading={submitting}
                    >
                      <FormattedMessage id="save" />
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
          </Content>
        </Page>
        <Sidebar
          title={<FormattedMessage id={`${intlPrefix}.add.permission`} />}
          visible={visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText={intl.formatMessage({ id: 'ok' })}
          cancelText={intl.formatMessage({ id: 'cancel' })}
        >
          <Content
            className="sidebar-content"
            code={`${intlPrefix}.modify.addpermission`}
            values={{ name }}
          >
            <Table
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
    );
  }
}

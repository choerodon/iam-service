import React, { Component } from 'react';
import remove from 'lodash/remove';
import { Form, Modal, Tooltip, Radio, Select, Input, Table } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Content, Permission } from '@choerodon/boot';
import { injectIntl, FormattedMessage } from 'react-intl';

const { Sidebar } = Modal;
const intlPrefix = 'organization.application';

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: props.selectedPermissions,
    };
  }

  handleSelect = (record, selected, selectedRows) => {
    const { selections } = this.state;
    if (selected) {
      if (!selections.includes(record.id)) {
        selections.push(record.id);
      }
    } else {
      remove(selections, p => p === record.id);
    }
    this.setState({
      selections,
    });
  }

  handleSelectAll = (selected, selectedRows, changeRows) => {
    let { selections } = this.state;
    if (selected) {
      selections = selections.concat(selectedRows.map(r => r.id));
      selections = [...new Set(selections)];
    } else {
      remove(selections, p => changeRows.map(r => r.id).includes(p));
    }
    this.setState({
      selections,
    });
  }

  handleOk = () => {
    const { onOk } = this.props;
    const { selections } = this.state;
    if (onOk) {
      onOk(selections);
    }
  }

  renderContent() {
    const { menu: { permissions = [] }, disabled } = this.props;
    const { selections } = this.state;
    const columns = [{
      title: '权限',
      dataIndex: 'code',
      key: 'code',
      width: '40%',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }];
    const rowSelection = {
      selectedRowKeys: selections,
      onSelect: (record, selected, selectedRows) => {
        this.handleSelect(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.handleSelectAll(selected, selectedRows, changeRows);
      },
      getCheckboxProps: record => ({
        disabled,
        // name: record.name,
      }),
    };
    return (
      <Table
        loading={false}
        filterBar={false}
        pagination={false}
        columns={columns}
        defaultExpandAllRows
        dataSource={permissions.slice()}
        rowKey={record => record.id}
        rowSelection={rowSelection}
      />
    );
  }

  render() {
    const { onCancel, menu = {} } = this.props;
    return (
      <Sidebar
        visible
        title="菜单权限配置"
        bodyStyle={{ padding: 0 }}
        onCancel={onCancel}
        onOk={this.handleOk}
      >
        <Content
          title={`配置菜单“${menu.name}”的权限`}
          description="您可以在此配置当前角色所分配菜单下的权限。"
          link="#"
        >
          {this.renderContent()}
        </Content>
      </Sidebar>
    );
  }
}

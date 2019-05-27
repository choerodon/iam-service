import React, { Component } from 'react';
import { Modal, Table } from 'choerodon-ui';
import { Content, axios } from '@choerodon/boot';
import remove from 'lodash/remove';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';

const { Sidebar } = Modal;
const intlPrefix = 'organization.application';

@injectIntl
@inject('AppState')
@observer
export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: props.selections || [],
    };
    this.data = props.data || [];
  }

  componentDidMount() {
    this.loadChildApp();
  }

  loadChildApp = () => {
    const { data, AppState: { currentMenuType: { organizationId } }, id } = this.props;
    if (!data) {
      // 根据接口获得全部可以给添加的应用
      axios.get(`/iam/v1/organizations/${organizationId}/applications/${id}/enabled_app`)
        .then((res) => {
          if (!res.failed) {
            this.data = res;
            this.forceUpdate();
          } else {
            Choerodon.prompt(data.message);
          }
        });
    }
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
    const { intl } = this.props;
    const { data, state: { selections } } = this;
    const columns = [
      {
        title: '应用名称',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: '应用编码',
        dataIndex: 'code',
        width: '15%',
      },
      {
        title: '应用分类',
        dataIndex: 'applicationType',
        width: '20%',
        render: text => (
          <span>
            {text ? intl.formatMessage({ id: `${intlPrefix}.type.${text}` }) : ''}
          </span>
        ),
      },
      {
        title: '开发项目',
        dataIndex: 'projectName',
      },
    ];
    const rowSelection = {
      selectedRowKeys: selections,
      onSelect: (record, selected, selectedRows) => {
        this.handleSelect(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.handleSelectAll(selected, selectedRows, changeRows);
      },
    };
    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey={record => record.id}
        rowSelection={rowSelection}
        filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
      />
    );
  }

  render() {
    const { onCancel } = this.props;
    return (
      <Sidebar
        visible
        title="添加子应用"
        bodyStyle={{ padding: 0 }}
        onCancel={onCancel}
        onOk={this.handleOk}
        onText="添加"
      >
        <Content
          title="向组合应用添加子应用"
          description="您可以在此修改组合应用下的子应用信息。"
          link="#"
        >
          {this.renderContent()}
        </Content>
      </Sidebar>
    );
  }
}

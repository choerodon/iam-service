import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Content, Header, Page } from 'choerodon-front-boot';
import { Table, Button, Checkbox, Modal, Tooltip } from 'choerodon-ui';
import { Prompt } from 'react-router-dom';
import ReceiveSettingStore from '../../../stores/user/receive-setting/ReceiveSettingStore';

const intlPrefix = 'user.receive-setting';

@inject('AppState')
@injectIntl
@observer
export default class ReceiveSetting extends Component {
  componentWillMount() {
    this.refresh();
  }

  refresh = () => {
    const { AppState } = this.props;

    ReceiveSettingStore.setLoading(true);
    Promise.all([
      ReceiveSettingStore.loadReceiveTypeData(AppState.getUserInfo.id),
      ReceiveSettingStore.loadReceiveSettingData(),
      ReceiveSettingStore.loadAllowConfigData(),
    ]).then(() => {
      ReceiveSettingStore.setLoading(false);
      ReceiveSettingStore.setDirty(false);
    }).catch((error) => {
      // Choerodon.prompt(`${error.response.status} ${error.response.statusText}`);
      Choerodon.handleResponseError(error);
      ReceiveSettingStore.setLoading(false);
    });
  };

  handleCheckAllChange = (type) => {
    const { intl } = this.props;
    if (ReceiveSettingStore.isAllSelected(type)) {
      Modal.confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: `${intlPrefix}.uncheck-all.title` }, { name: intl.formatMessage({ id: type }) }),
        content: intl.formatMessage({ id: `${intlPrefix}.uncheck-all.content` }),
        onOk: () => { ReceiveSettingStore.unCheckAll(type); },
      });
    } else {
      ReceiveSettingStore.checkAll(type);
    }
  };

  handleCheckChange = (e, id, type) => {
    ReceiveSettingStore.check(id, type);
    this.forceUpdate();
  };

  saveSettings = () => {
    const { intl } = this.props;
    if (ReceiveSettingStore.getDirty) {
      ReceiveSettingStore.saveData().then((data) => {
        if (!data.fail) {
          Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
          ReceiveSettingStore.setDirty(false);
        }
      });
    } else {
      Choerodon.prompt(intl.formatMessage({ id: 'save.success' }));
    }
  };

  isCheckDisabled = (record, type) => {
    const level = record.id.split('-')[0];
    if ('settings' in record) {
      let allDisable = true;
      ReceiveSettingStore.getAllowConfigData.forEach((value, key) => {
        if (value.type === level) {
          const allowConfigData = ReceiveSettingStore.getAllowConfigData.get(key);
          if (allowConfigData && allowConfigData.disabled && !allowConfigData.disabled[type]) {
            allDisable = false;
          }
        }
      });
      return allDisable;
    }
    const allowConfigData = ReceiveSettingStore.getAllowConfigData.get(parseInt(record.id.split('-')[2], 10));
    return allowConfigData && allowConfigData.disabled && allowConfigData.disabled[type];
  };

  getCheckbox = (record, type) => {
    if (this.isCheckDisabled(record, type)) {
      return (
        <Checkbox
          key={record.id ? record.id : `${record.id}-${record.sendSettingId}`}
          disabled
        />
      );
    } else {
      return (
        <Checkbox
          key={record.id ? record.id : `${record.id}-${record.sendSettingId}`}
          indeterminate={record.id ? (type === 'pm' ? record.pmIndeterminate : record.mailIndeterminate) : false}
          onChange={e => this.handleCheckChange(e, record.id, type)}
          checked={type === 'pm' ? record.pmChecked : record.mailChecked}
        />
      );
    }
  };

  getTitleCheckbox = (type) => {
    const { intl } = this.props;
    return (
      <Checkbox
        key={type}
        indeterminate={!ReceiveSettingStore.isAllSelected(type) && !ReceiveSettingStore.isAllUnSelected(type)}
        checked={ReceiveSettingStore.isAllSelected(type) && !ReceiveSettingStore.getDataSource.every(record => this.isCheckDisabled(record, type))}
        onChange={() => this.handleCheckAllChange(type)}
        disabled={ReceiveSettingStore.getDataSource.every(record => this.isCheckDisabled(record, type))}
      >
        {intl.formatMessage({ id: type })}
      </Checkbox>
    );
  };

  render() {
    const { intl } = this.props;
    const promptMsg = intl.formatMessage({ id: 'global.menusetting.prompt.inform.title' }) + Choerodon.STRING_DEVIDER + intl.formatMessage({ id: 'global.menusetting.prompt.inform.message' });
    const columns = [{
      title: '信息类型',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: intl.formatMessage({ id: 'level' }),
      width: '20%',
      render: (text, record) => intl.formatMessage({ id: record.id.split('-')[0] }),
    }, {
      title: this.getTitleCheckbox('pm'),
      width: '15%',
      render: (text, record) => this.getCheckbox(record, 'pm'),
    }, {
      title: this.getTitleCheckbox('email'),
      width: '15%',
      render: (text, record) => this.getCheckbox(record, 'email'),
    }];

    return (
      <Page
        service={[
          'notify-service.receive-setting.update',
          'notify-service.receive-setting.updateByUserId',
          'notify-service.receive-setting.queryByUserId',
        ]}
      >
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <Button onClick={this.refresh} icon="refresh">
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          className="c7n-iam-receive-setting"
          code={intlPrefix}
        >
          <Prompt message={promptMsg} wrapper="c7n-iam-confirm-modal" when={ReceiveSettingStore.getDirty} />
          <Table
            loading={ReceiveSettingStore.getLoading}
            filterBar={false}
            columns={columns}
            pagination={false}
            dataSource={ReceiveSettingStore.getDataSource}
            childrenColumnName="settings"
            rowKey="id"
            fixed
            className="c7n-permission-info-table"
          />
          <div style={{ marginTop: 25 }}>
            <Button
              funcType="raised"
              type="primary"
              onClick={this.saveSettings}
            ><FormattedMessage id="save" /></Button>
            <Button
              funcType="raised"
              onClick={this.refresh}
              style={{ marginLeft: 16, color: '#3F51B5' }}
            ><FormattedMessage id="cancel" /></Button>
          </div>
        </Content>
      </Page>
    );
  }
}

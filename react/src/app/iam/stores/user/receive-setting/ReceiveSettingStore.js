import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('ReceiveSettingStore')
class ReceiveSettingStore {
  /**
   * 信息类型
   * @type {Array}
   */
  @observable receiveTypeData = [];

  /**
   * 接收设置的数据，只存放接收设置中被关闭的消息的数据
   * @type {Array}
   */
  @observable receiveSettingData = [];

  /**
   * 允许被设置的通知的数据
   * @type {Map<any, Object>} id => {name, type, pmType}的映射
   */
  @observable allowConfigData = new Map();

  /**
   * 表格是否正在加载中
   * @type {boolean}
   */
  @observable loading = false;

  @observable dirty = false;

  @computed get getAllowConfigData() {
    return this.allowConfigData;
  }

  @computed get getDirty() {
    return this.dirty;
  }

  @computed get getReceiveTypeData() {
    return this.receiveTypeData;
  }

  @computed get getLoading() {
    return this.loading;
  }

  @computed get getDataSource() {
    const ds = this.receiveTypeData;
    ds.forEach((v) => {
      const allowConfig = new Map();
      [...this.allowConfigData.keys()].forEach((value) => {
        if (this.allowConfigData.get(value).type === v.type) {
          allowConfig.set(value, this.allowConfigData.get(value));
        }
      });
      v.pmChecked = this.isChecked(`${v.id}`, 'pm');
      v.pmIndeterminate = this.isGroupIndeterminate(`${v.id}`, 'pm');
      v.mailChecked = this.isChecked(`${v.id}`, 'email');
      v.mailIndeterminate = this.isGroupIndeterminate(`${v.id}`, 'email');
      v.settings = [...allowConfig.keys()].map(k => (
        {
          id: `${v.id}-${k}`,
          name: allowConfig.get(k).name,
          pmChecked: this.isChecked(`${v.id}-${k}`, 'pm'),
          mailChecked: this.isChecked(`${v.id}-${k}`, 'email'),
        }));
    });
    return ds;
  }

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setDirty(flag) {
    this.dirty = flag;
  }

  @action loadReceiveTypeData(id) {
    const newData = [];
    return axios.get(`iam/v1/users/${id}/organization_project`).then(action(
      (data) => {
        if (data.failed) {
          return data.message;
        } else {
          newData.push({ id: 'site-0', name: '平台设置', code: 'site-0', type: 'site' }); // 需要在表格里添加一个平台设置的选项，code和id不能和已有的组织和项目重复
          this.receiveTypeData = newData.concat(data.organizationList.map(v => ({ ...v, id: `organization-${v.id}`, type: 'organization' })), data.projectList.map(v => ({ ...v, id: `project-${v.id}`, type: 'project' }))); // 这一行是格式化数据
          return this.receiveTypeData;
        }
      },
    ));
  }

  @action loadAllowConfigData() {
    return axios.get('notify/v1/notices/send_settings/list/allow_config').then(action(
      (data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
          return data.message;
        } else {
          data.forEach((v) => {
            this.allowConfigData.set(v.id, { name: v.name, type: v.level, pmType: v.pmType, disabled: { pm: v.pmTemplateId === null, email: v.emailTemplateId === null } });
          });
          this.allowConfigData = new Map(this.allowConfigData);
        }
      },
    ));
  }

  @action loadReceiveSettingData() {
    return axios.get('notify/v1/notices/receive_setting').then(action(
      (data) => {
        if (data.failed) {
          Choerodon.prompt(data.message);
          return data.message;
        } else {
          this.receiveSettingData = data;
        }
      },
    ));
  }

  @action check(id, type) {
    this.dirty = true;
    if (id.split('-').length === 2) { // 当使用-分割然后id有2部分时，这是一个项目或组织或site的id，处理成组check的逻辑
      if (!this.isGroupAllSelected(id, type)) {
        this.receiveSettingData.filter(v => v.messageType === type && id === `${v.sourceType}-${v.sourceId}`).forEach((v) => {
          this.check(`${id}-${v.sendSettingId}`, type);
        });
      } else {
        [...this.allowConfigData.keys()].forEach((v) => {
          if (id.split('-')[0] === this.allowConfigData.get(v).type) {
            this.check(`${id}-${v}`, type);
          }
        });
      }
    } else if (this.receiveSettingData.some(v => v.messageType === type && id === `${v.sourceType}-${v.sourceId}-${v.sendSettingId}` && !this.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type])) {
      this.receiveSettingData = this.receiveSettingData.filter(v => v.messageType !== type || (v.messageType === type && id !== `${v.sourceType}-${v.sourceId}-${v.sendSettingId}`));
    } else if (!this.allowConfigData.get(parseInt(id.split('-')[2], 10)).disabled[type]) {
      const temp = id.split('-');
      this.receiveSettingData.push({
        messageType: type,
        disable: true,
        sourceType: temp[0],
        sourceId: temp[1],
        sendSettingId: temp[2],
      });
    }
  }

  /**
   * 根据type全选
   * @param type
   */
  @action checkAll(type) {
    this.dirty = true;
    this.receiveSettingData = this.receiveSettingData.filter(v => v.messageType !== type || (this.allowConfigData.get(parseInt(v.sendSettingId, 10)) && this.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type]));
  }

  /**
   * 根据type全否
   * @param type
   */
  @action unCheckAll(type) {
    this.receiveTypeData.forEach(v => this.check(v.id, type));
  }

  /**
   * 判断某个元素是否选中
   * @param id 元素的id
   * @param type type 有'pm'、'email'、'sms' 三种对应表中的站内信列、邮件列和短信列
   * @returns {boolean} 这个元素是否是选中的
   */
  isChecked(id, type) {
    if (id.split('-').length === 2) {
      return this.isGroupAllSelected(id, type);
    }
    return !this.receiveSettingData.some(v => v.messageType === type && id === `${v.sourceType}-${v.sourceId}-${v.sendSettingId}`);
  }

  /**
   * 判断是否某组全选
   * @param id type-sourceId
   * @param type 有'pm'、'email'、'sms' 三种对应表中的站内信列、邮件列和短信列
   * @returns {boolean} 这个组是否是全选中的
   */
  isGroupAllSelected(id, type) {
    return !this.receiveSettingData.filter(v => v.messageType === type
      && id === `${v.sourceType}-${v.sourceId}` && this.allowConfigData.get(parseInt(v.sendSettingId, 10)) && !this.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type])
      .some(v => !this.isChecked(`${id}-${v.sendSettingId}`, type));
  }

  /**
   * 根据type判断是否全选
   * @param type type有'pm'、'email'、'sms' 三种对应表中的站内信列、邮件列和短信列
   * @returns {boolean}
   */
  isAllSelected(type) {
    return this.receiveSettingData.filter(v => v.messageType === type && this.allowConfigData.get(parseInt(v.sendSettingId, 10)) && !this.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type]).length === 0;
  }

  /**
   * 根据type判断全选框是否为全不选
   * @param type
   * @returns {boolean}
   */
  isAllUnSelected(type) {
    const maxLength = this.receiveTypeData.length;
    let unSelectedLength;
    switch (type) {
      case 'pm':
        unSelectedLength = this.getDataSource.reduce((previousValue, currentValue) => previousValue + (currentValue.pmChecked || currentValue.pmIndeterminate ? 0 : 1), 0);
        break;
      case 'email':
        unSelectedLength = this.getDataSource.reduce((previousValue, currentValue) => previousValue + (currentValue.mailChecked || currentValue.mailIndeterminate ? 0 : 1), 0);
        break;
      default:
        unSelectedLength = this.getDataSource.reduce((previousValue, currentValue) => previousValue + (currentValue.pmChecked || currentValue.pmIndeterminate ? 0 : 1), 0);
    }
    return maxLength === unSelectedLength;
  }

  /**
   * 判断某组的indeterminate
   * @param id
   * @param type
   * @returns {boolean}
   */
  isGroupIndeterminate(id, type) {
    // if (this.isGroupAllSelected(id, type)) return false;
    const selectLength = this.receiveSettingData.filter(v => v.messageType === type && id === `${v.sourceType}-${v.sourceId}` && this.allowConfigData.get(parseInt(v.sendSettingId, 10)) && !this.allowConfigData.get(parseInt(v.sendSettingId, 10)).disabled[type]).length;
    const checkAbleLength = [...this.allowConfigData.keys()].filter(value => this.allowConfigData.get(value).type === id.split('-')[0] && !this.allowConfigData.get(value).disabled[type]).length;
    return selectLength > 0 && selectLength < checkAbleLength;
  }

  saveData = () => axios.put('/notify/v1/notices/receive_setting/all', JSON.stringify(this.receiveSettingData));
}

export default new ReceiveSettingStore();

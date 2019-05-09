import { action, computed, observable, toJS } from 'mobx';
import { Observable } from 'rxjs';
import { axios, store } from '@choerodon/boot';
import _ from 'lodash';

@store('RoleStore')
class RoleStore {
  @observable roles = [];
  @observable isLoading = true;
  @observable totalPage;
  @observable totalSize;
  @observable canChosePermission = {
    site: [],
    organization: [],
    project: [],
  };
  @observable wholeServerAndType = [];
  @observable selectedRolesPermission = [];
  @observable allRoleLabel = [];
  @observable chosenLevel = '';
  @observable permissionPage = {
    site: {
      current: 1,
      pageSize: 10,
      total: '',
    },
    organization: {
      current: 1,
      pageSize: 10,
      total: '',
    },
    project: {
      current: 1,
      pageSize: 10,
      total: '',
    },
  };

  @observable menus = {};

  @observable tabLevel = undefined;

  @observable selectedPermissions = [];

  @observable initSelectedPermission = [];

  @observable currentMenu = {};

  @observable siderVisible = false;

  @observable expand = {};

  @observable expandedRowKeys = {};

  @observable roleMsg = {}

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action
  setRoleMsg(data) {
    this.roleMsg = data;
  }

  @action
  setSelectedPermissions(data) {
    this.selectedPermissions = data;
  }

  @action
  setCurrentMenu(data) {
    this.currentMenu = data;
  }

  @action
  setSiderVisible(data) {
    this.siderVisible = data;
  }

  @action
  setTabLevel(level) {
    this.tabLevel = level;
  }

  @action
  setInitSelectedPermission(permission) {
    this.initSelectedPermission = permission;
  }

  @computed
  get getInitSelectedPermission() {
    return this.initSelectedPermission;
  }


  @action
  setChosenLevel(data) {
    this.chosenLevel = data;
  }

  @computed
  get getChosenLevel() {
    return this.chosenLevel;
  }

  getSelectedRolePermissionByLevel(level) {
    return this.selectedRolesPermission[level];
  }

  @computed
  get getSelectedRolesPermission() {
    return this.selectedRolesPermission;
  }

  @action
  setSelectedRolesPermission(data) {
    this.selectedRolesPermission = data;
  }

  @action
  pushSelectedRolesPermission(level, data) {
    this.selectedRolesPermission[level].push(data);
  }

  @computed
  get getRoles() {
    return this.roles.slice();
  }

  @action
  setRoles(data) {
    this.roles = data || [];
  }

  @computed
  get getIsLoading() {
    return this.isLoading;
  }

  @action
  setIsLoading(flag) {
    this.isLoading = flag;
  }

  @computed
  get getTotalPage() {
    return this.totalPage;
  }

  @action
  setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  @computed
  get getTotalSize() {
    return this.totalSize;
  }

  @action
  setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @computed
  get getCanChosePermission() {
    return this.canChosePermission;
  }

  @action
  setPermissionPage(level, page) {
    this.permissionPage[level] = page;
  }

  @computed
  get getPermissionPage() {
    return this.permissionPage;
  }

  checkUserName(name) {
    return axios.get(`/iam/v1/public/role/name?name=${name}`);
  }

  @action
  handleCanChosePermission(level, data) {
    this.setCanChosePermission(level, data.list);
    this.setPermissionPage(level, {
      current: data.pageNum,
      total: data.total,
      size: data.pageSize,
    });
  }

  @action
  setCanChosePermission(level, data) {
    this.canChosePermission[level] = data;
  }


  @action
  changePermissionCheckAllFalse(level, item) {
    const data = this.canChosePermission;
    const data2 = _.difference(['site', 'organization', 'project'], [level]);
    for (let a = 0; a < data2.length; a += 1) {
      for (let b = 0; b < data[data2[a]].length; b += 1) {
        // if (level === 'site') {
        //   if (data2[a] !== 'site') {
        //     data[data2[a]][b].check = false;
        //   }
        // } else if (data2[a] === 'site') {
        //   data[data2[a]][b].check = false;
        // }
        data[data2[a]][b].check = false;
      }
    }
    this.setCanChosePermission(data);
    // this.changePermissionCheck(level, item);
  }

  @action
  changePermissionCheckAllFalse2(level, item) {
    const data = this.canChosePermission;
    const data2 = ['site', 'organization', 'project'];
    for (let a = 0; a < data2.length; a += 1) {
      for (let b = 0; b < data[data2[a]].length; b += 1) {
        if (level === 'site') {
          if (data2[a] !== 'site') {
            data[data2[a]][b].check = false;
          }
        } else if (data2[a] === 'site') {
          data[data2[a]][b].check = false;
        }
      }
    }
    this.setCanChosePermission(data);
    for (let c = 0; c < item.length; c += 1) {
      this.changePermissionCheck(level, item[c]);
    }
  }

  @action
  changePermissionCheckByValue(level, item, value) {
    const data = this.canChosePermission[level];
    for (let a = 0; a < data.length; a += 1) {
      if (data[a].name === item.name) {
        data[a].check = value;
      }
    }
    this.setCanChosePermission(level, data);
  }

  @action
  changePermissionClear() {
    const data = this.canChosePermission;
    const levels = ['organization', 'project', 'site'];
    _.forEach(levels, (item) => {
      _.forEach(data[item], (item2, index) => {
        data[item][index].check = false;
      });
    });
    this.canChosePermission = data;
  }

  @action
  changeChosenPermission(level, chosen) {
    const data = toJS(this.canChosePermission[level]);
    _.forEach(data, (item, index) => {
      let flag = 0;
      _.forEach(chosen, (item2) => {
        if (item.code === item2.code) {
          flag = 1;
        }
      });
      if (flag === 1) {
        data[index].check = true;
      } else {
        data[index].check = false;
      }
    });
    const datas = JSON.parse(JSON.stringify(data));
    this.setCanChosePermission(level, datas);
  }

  @action
  changePermissionCheck(level, item) {
    const data = this.canChosePermission[level];
    for (let a = 0; a < data.length; a += 1) {
      if (data[a].code === item.code) {
        data[a].check = !data[a].check;
      }
    }
    this.setCanChosePermission(level, data);
  }

  @computed
  get getWholeService() {
    return this.wholeServerAndType;
  }

  @action
  setWholeService(data) {
    this.wholeServerAndType = data;
  }

  @computed
  get getLabel() {
    return this.allRoleLabel;
  }

  @action
  setLabel(data) {
    this.allRoleLabel = data;
  }

  getWholePermission(level, page, filters = {
    code: '',
    params: '',
  }) {
    return Observable.fromPromise(axios.get(`iam/v1/permissions?level=${level}&page=${page.current}&size=${page.pageSize}&code=${filters.code}&params=${filters.params}`));
  }

  loadRoleLabel = (level) => {
    axios.get(`iam/v1/labels?type=role&level=${level}`).then((data) => {
      this.setLabel(data);
    }).catch((error) => {
      Choerodon.prompt(error);
    });
  }

  loadRole(level, { current = 1, pageSize },
    { columnKey, order },
    { name, code, enabled, builtIn }, params = []) {
    const body = {
      name: name && name[0],
      code: code && code[0],
      level,
      enabled: enabled && enabled[0],
      builtIn: builtIn && builtIn[0],
      params,
    };
    const sorter = [];
    if (columnKey) {
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
    }
    this.setIsLoading(true);
    return axios.post(
      `/iam/v1/roles/search?page=${current}&size=${pageSize}&sort=${sorter.join(',')}`,
      JSON.stringify(body),
    );
  }

  queryRole = (state) => {
    if (state.code === '') {
      axios.get(`iam/v1/roles?param=${state.input}&page=1&size=10`).then((data) => {
        this.setRoles(data.list);
      });
    } else {
      axios.get(`iam/v1/roles?${state.code}=${state.input}&page=1&size=10`).then((data) => {
        this.setRoles(data.list);
      });
    }
  };
  getSelectedRolePermissions = ids => axios.post('/iam/v1/permissions', ids);

  createRole = role => axios.post('iam/v1/roles', role);

  getRoleById = id => axios.get(`iam/v1/roles/${id}`);

  updateRoleById = (id, role) => axios.put(`/iam/v1/roles/${id}`, JSON.stringify(role));

  deleteRoleById = id => axios.delete(`/iam/v1/roles/${id}`);

  editRoleByid = (id, data) => axios.put(`/iam/v1/roles/${id}`, data);
  enableRole = id => axios.put(`/iam/v1/roles/${id}/enable`);
  disableRole = id => axios.put(`/iam/v1/roles/${id}/disable`);

  queryDatas([page, size], value) {
    let url = '';
    if (typeof value === 'string') {
      url = `&param=${value}`;
    } else if (typeof value === 'object') {
      for (let i = 0; i < value.length; i += 1) {
        url += `&${value[i].key}=${value[i].values}`;
      }
    }
    this.setIsLoading(true);
    return axios.get(`/iam/v1/roles?page=${page}&size=${size}${url}`).then((data) => {
      if (data) {
        this.setRoles(data.list);
        this.setTotalPage(data.totalPages);
        this.setTotalSize(data.total);
      }
      this.setIsLoading(false);
    });
  }

  loadMenu = level => axios.get(`/iam/v1/menus/menu_config?code=choerodon.code.top.${level}`);
}

const roleStore = new RoleStore();

export default roleStore;

/**
 * Created by hulingfangzi on 2018/7/9.
 */
import { action, computed, observable, toJS } from 'mobx';
import { axios, store } from 'choerodon-boot-combine';

@store('ApitestStore')
class ApitestStore {
  @observable service = [];
  @observable currentService = [];
  @observable currentVersion = [];
  @observable versions = ['asdasd', 'asd'];
  @observable apiData = [];
  @observable isShowModal = false;
  @observable apitoken = null;
  @observable loading = true;
  @observable modalSaving = false;
  @observable userInfo = null;
  @observable isShowResult = null;
  @observable isExpand = new Set();
  @observable apiDetail = {
    description: '[]',
    responses: [],
  };
  @observable initData = null; // 用来缓存APITest列表页的state实现打开新的page然后返回仍在离开时的分页
  @observable needReload = true; // 只有跳转到api详情界面然后回到api列表才不需要reload
  @observable filters = [];
  @observable isShowTree = true; // 是否显示树形结构
  @observable controllers = []; //
  @observable paths = [];
  @observable expandedKeys = [];
  @observable pageLoading = true;
  @observable totalData = [];
  @observable detailFlag = 'empty';
  @observable currentNode = null;
  @observable eventKey = null;

  @action setEventKey(key) {
    this.eventKey = key;
  }

  @computed get getEventKey() {
    return this.eventKey;
  }

  @action setCurrentNode(node) {
    this.currentNode = node;
  }

  @computed get getCurrentNode() {
    return this.currentNode;
  }

  @action setDetailFlag(flag) {
    this.detailFlag = flag;
  }

  @computed get getDetailFlag() {
    return toJS(this.detailFlag);
  }

  @action setTotalData(data) {
    this.totalData = data;
  }

  @computed get getTotalData() {
    return this.totalData;
  }

  @action setIsShowTree(flag) {
    this.isShowTree = flag;
  }

  @action setControllers(controllers) {
    this.controllers = controllers;
  }

  @action setPaths(paths) {
    this.paths = paths;
  }

  @action setExpandedKeys(expandedKeys) {
    // window.console.log(expandedKeys);
    this.expandedKeys = expandedKeys;
  }

  @computed get getExpandedKeys() {
    return toJS(this.expandedKeys);
  }

  @action setPageLoading(flag) {
    this.pageLoading = flag;
  }

  @action setFilters(filters) {
    this.filters = filters;
  }

  @computed get getFilters() {
    return this.filters;
  }

  @computed get getFilteredData() {
    const a = this.apiData;
    if (this.filters.length === 0) return a;
    const filteredController = a.slice().filter((controller) => {
      const matchAPI = controller.paths && controller.paths.slice().filter(api => (
        this.filters.some(str => api.url.indexOf(str) !== -1 || controller.name.indexOf(str) !== -1)
      ));
      return matchAPI.length > 0;
    });
    if (filteredController.length > 0) {
      const ret = [];
      toJS(filteredController).forEach((v, i) => {
        ret.push({ description: v.description, name: v.name });
        const matchAPI = v.paths && v.paths.slice().filter(api => this.filters.some(str => api.url.indexOf(str) !== -1));
        if (v.name.indexOf(this.filters) !== -1) {
          ret[i].paths = v.paths;
        } else {
          ret[i].paths = matchAPI.slice();
        }
      });
      return ret;
    } else {
      return [];
    }
  }


  @action setNeedReload(flag) {
    this.needReload = flag;
  }

  // @action setDetailFlag(flag) {
  //   this.detailFlag = flag;
  // }

  @action setIsExpand(name) {
    if (this.isExpand.has(name)) {
      this.isExpand.delete(name);
    } else {
      this.isExpand.add(name);
    }
  }

  @action clearIsExpand() {
    this.isExpand.clear();
  }

  @action setVersions(data) {
    this.versions = data;
  }

  @action setLoading(flag) {
    this.loading = flag;
  }

  @action setModalSaving(flag) {
    this.modalSaving = flag;
  }

  @action setIsShowResult(flag) {
    this.isShowResult = flag;
  }

  @action setUserInfo(data) {
    this.userInfo = data;
  }

  @action setInitData(data) {
    this.initData = data;
  }

  @computed get getNeedReload() {
    return this.needReload;
  }

  @computed get getInitData() {
    return this.initData;
  }

  @computed get getUserInfo() {
    return this.userInfo;
  }

  @computed get getIsExpand() {
    return this.isExpand;
  }

  @computed get getExpandKeys() {
    return [...this.isExpand];
  }

  @action setIsShowModal(flag) {
    this.isShowModal = flag;
  }

  @computed get getIsShowModal() {
    return this.isShowModal;
  }

  @action setService(data) {
    this.service = data;
  }

  @action setCurrentService(data) {
    this.currentService = data;
  }

  @action setCurrentVersion(data) {
    this.currentVersion = data;
  }

  @computed get getCurrentService() {
    return this.currentService;
  }

  @computed get getCurrentVersion() {
    return this.currentVersion;
  }

  @action setApiToken(data) {
    this.apitoken = data;
  }

  @computed get getApiToken() {
    return this.apitoken;
  }

  @action setApiData(data) {
    this.apiData = data;
  }

  @computed get getApiData() {
    return this.apiData;
  }

  @action setApiDetail(data) {
    this.apiDetail = data;
  }

  @computed get getApiDetail() {
    return this.apiDetail;
  }

  loadApis = () => axios.get('/manager/v1/swaggers/tree');
}

const apitestStore = new ApitestStore();
export default apitestStore;

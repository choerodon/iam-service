import { action, computed, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';
import queryString from 'query-string';
import { handleFiltersParams } from '../../../common/util';

const imgPartten = /<img(.*?)>/g;
const htmlTagParttrn = /<[^>]*>/g;

function htmlDecode(str) {
  let s = '';
  if (str.length === 0) return '';
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, '\'');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/<br>/g, '\n');
  return s;
}

@store('AnnouncementStore')
class AnnouncementStore {
  @observable announcementData = [];
  @observable editorContent = null;
  @observable loading = false;
  @observable submitting = false;
  @observable sidebarVisible = false;
  @observable currentRecord = {};
  @observable pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  @observable params = [];
  @observable filters = {};
  @observable sort = { columnKey: 'id', order: 'descend' };
  @observable announcementType = null;
  @observable selectType = 'create';

  @action
  setSelectType(type) {
    this.selectType = type;
  }

  @action
  setAnnouncementType(type) {
    this.announcementType = type;
  }

  refresh() {
    this.loadData({ current: 1, pageSize: 10, total: 0 }, {}, { columnKey: 'id', order: 'descend' }, []);
  }

  @action
  setSubmitting(flag) {
    this.submitting = flag;
  }

  @action
  setCurrentRecord(record) {
    this.currentRecord = record;
  }

  @action
  showSideBar() {
    this.sidebarVisible = true;
  }

  @action
  hideSideBar() {
    this.sidebarVisible = false;
  }

  @action
  setEditorContent(data) {
    this.editorContent = data;
  }

  @action
  loadData(pagination = this.pagination, filters = this.filters, sort = this.sort, params = this.params) {
    const { columnKey, order } = sort;
    const sorter = [];
    if (columnKey) {
      sorter.push(columnKey);
      if (order === 'descend') {
        sorter.push('desc');
      }
    }
    this.loading = true;
    this.filters = filters;
    this.sort = sort;
    this.params = params;
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(params, filters);
    if (isIncludeSpecialCode) {
      this.announcementData.length = 0;
      this.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.loading = false;
      return;
    }
    return axios.get(`${this.announcementType.apiPrefix}/all?${queryString.stringify({
      page: pagination.current,
      size: pagination.pageSize,
      content: filters.content && filters.content[0],
      status: filters.status && filters.status[0],
      title: filters.title && filters.title[0],
      params: params.join(','),
      sort: sorter.join(','),
    })}`)
      .then(action(({ failed, content, total }) => {
        if (!failed) {
          this.announcementData = content;
          this.announcementData.forEach((data) => {
            data.textContent = htmlDecode(data.content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, ''));
          });
          // this.announcementData.content = content.content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, '');
          this.pagination = {
            ...pagination,
            total,
          };
        }
        this.loading = false;
      }))
      .catch(action((error) => {
        Choerodon.handleResponseError(error);
        this.loading = false;
      }));
  }

  deleteAnnouncementById = id => axios.delete(`${this.announcementType.apiPrefix}/${id}`);

  createAnnouncement = data => axios.post(`${this.announcementType.apiPrefix}/create`, JSON.stringify(data));

  modifyAnnouncement = data => axios.put(`${this.announcementType.apiPrefix}/update`, JSON.stringify(data));
}

export default new AnnouncementStore();

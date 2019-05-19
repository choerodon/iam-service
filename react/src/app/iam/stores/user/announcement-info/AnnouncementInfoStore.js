import { action, observable } from 'mobx';
import { axios, store } from '@choerodon/boot';

@store('AnnouncementInfoStore')
class AnnouncementInfoStore {
  @observable announcementData = [];
  
  @observable visible = false;

  @observable title= '';

  @observable content= '';

  @action showDetail({ title, content }) {
    this.title = title;
    this.content = content;
    this.visible = true;
  }

  @action closeDetail() {
    this.visible = false;
  }

  @action
  loadData() {
    return axios.get('notify/v1/system_notice/completed?size=30').then(action(
      (data) => {
        if (!data.failed) {
          this.announcementData = data.list;
        }
      },
    ));
  }
}

export default new AnnouncementInfoStore();

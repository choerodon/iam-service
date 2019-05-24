import React, { Component } from 'react';
import { Modal, Timeline, Button } from 'choerodon-ui';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { DashBoardNavBar } from '@choerodon/boot';
import AnnouncementInfoStore from '../../stores/user/announcement-info';
import './index.scss';

const Item = Timeline.Item;

@withRouter
@inject('AppState', 'HeaderStore')
@observer
export default class Announcement extends Component {
  componentWillMount() {
    AnnouncementInfoStore.loadData();
  }

  handleCancel = () => {
    AnnouncementInfoStore.closeDetail();
  };

  render() {
    const { visible, title, content, announcementData } = AnnouncementInfoStore;
    let containerStyle = {
      display: 'block',
    };

    if (announcementData.length !== 0) {
      containerStyle = {
        display: 'flex',
        justifyContent: 'center',
      };
    }
    return (
      <div className="c7n-iam-dashboard-announcement" style={containerStyle}>
        {announcementData.length === 0 ? (
          <React.Fragment>
            <div className="c7n-iam-dashboard-announcement-empty" />
            <div className="c7n-iam-dashboard-announcement-empty-text">暂无公告</div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Timeline className="c7n-iam-dashboard-announcement-timeline">
              {announcementData.map(data => (
                <Item className="item" key={`${data.id}`}>
                  <div className="time"><p>{data.sendDate.split(' ')[0]}</p><p>{data.sendDate.split(' ')[1]}</p></div>
                  <div className="title"><a onClick={() => AnnouncementInfoStore.showDetail(data)}>{data.title}</a></div>
                </Item>
              ))}
              <Item>null</Item>
            </Timeline>
          </React.Fragment>
        )}
        <Modal
          visible={visible}
          width={800}
          title={title}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>返回</Button>,
          ]}
        >
          <div
            className="c7n-iam-dashboard-announcement-detail-content"
            dangerouslySetInnerHTML={{ __html: `${content}` }}
          />
        </Modal>
        <DashBoardNavBar>
          <Link to="/notify/user-msg?type=site&msgType=announcement">转至所有公告</Link>
        </DashBoardNavBar>
      </div>
    );
  }
}

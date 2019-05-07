import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, List, Tabs, Collapse, Modal, Icon, Checkbox, Avatar, Tooltip } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { axios, Content, Header, Page, Permission } from '@choerodon/boot';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import './UserMsg.scss';
import UserMsgStore from '../../../stores/user/user-msg/UserMsgStore';
import '../../../common/ConfirmModal.scss';

const intlPrefix = 'user.usermsg';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

function timestampFormat(timestamp) {
  function zeroize(num) {
    return (String(num).length === 1 ? '0' : '') + num;
  }
  
  const curTimestamp = parseInt(new Date().getTime() / 1000, 10); // 当前时间戳
  const timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  const curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  const tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

  const Y = tmDate.getFullYear();
  const m = tmDate.getMonth() + 1;
  const d = tmDate.getDate();
  const H = tmDate.getHours();
  const i = tmDate.getMinutes();
  const s = tmDate.getSeconds();

  if (timestampDiff < 60) { // 一分钟以内
    return '刚刚';
  } else if (timestampDiff < 3600) { // 一小时前之内
    return `${Math.floor(timestampDiff / 60)}分钟前`;
  } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
    return `今天${zeroize(H)}:${zeroize(i)}`;
  } else {
    const newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
      return `昨天${zeroize(H)}:${zeroize(i)}`;
    } else if (curDate.getFullYear() === Y) {
      return `${zeroize(m)}月${zeroize(d)}日 ${zeroize(H)}:${zeroize(i)}`;
    } else {
      return `${Y}年${zeroize(m)}月${zeroize(d)}日 ${zeroize(H)}:${zeroize(i)}`;
    }
  }
}

@withRouter
@injectIntl
@inject('AppState')
@observer
export default class UserMsg extends Component {
  state = {
    showAll: false,
    needExpand: true,
  };

  componentDidMount() {
    this.loadUserInfo();
    const matchId = this.props.location.search.match(/msgId=(\d+)/g);
    const matchType = this.props.location.search.match(/(msgType=)(.+)/g); // 火狐浏览器不兼容js正则表达式的环视，只能改成这样了
    if (matchType) {
      UserMsgStore.setCurrentType(matchType[0].substring(8));
    }
    if (matchId) {
      const id = Number(matchId[0].match(/\d+/g)[0]);
      UserMsgStore.loadData({ current: 1, pageSize: 10 }, {}, {}, [], this.state.showAll, false);
    } else UserMsgStore.loadData({ current: 1, pageSize: 10 }, {}, {}, [], this.state.showAll, false);
  }

  refresh = () => {
    UserMsgStore.loadData({ current: 1, pageSize: 10 }, {}, {}, [], this.state.showAll);
    UserMsgStore.selectMsg.clear();
    UserMsgStore.expandMsg.clear();
    UserMsgStore.initPagination();
  };

  getUserMsgClass(name) {
    const { showAll } = this.state;
    if (name === 'unRead') {
      return classnames({
        active: !showAll,
      });
    } else if (name === 'all') {
      return classnames({
        active: showAll,
      });
    }
  }

  showUserMsg(show) {
    this.setState({ showAll: show }, () => this.refresh());
  }

  renderMsgTitle = (title, id, read, sendTime, isChecked, avatar) => (
    <div className="c7n-iam-user-msg-collapse-title">
      <Checkbox
        style={{ verticalAlign: 'text-bottom' }}
        onChange={e => this.handleCheckboxChange(e, id)}
        checked={isChecked}
      />
      {avatar}
      <span style={{ color: '#000' }}>{title}</span>
      <Tooltip
        title={sendTime}
        placement="top"
      >
        <span className="c7n-iam-user-msg-unread">{timestampFormat(new Date(sendTime.replace(/-/g, '/')).getTime() / 1000)}</span>
      </Tooltip>
      <Icon type={read ? 'drafts' : 'markunread'} onClick={() => { this.handleReadIconClick(id); }} />
    </div>
  );

  renderAnnoucenmentTitle = (title, id, sendDate, avatar) => (
    <div className="c7n-iam-user-msg-collapse-title">
      {avatar}
      <span style={{ color: '#000' }}>{title}</span>
      <Tooltip
        title={sendDate}
        placement="top"
      >
        <span className="c7n-iam-user-msg-unread">{timestampFormat(new Date(sendDate.replace(/-/g, '/')).getTime() / 1000)}</span>
      </Tooltip>
    </div>
  )

  handleBatchRead = () => {
    if (UserMsgStore.getSelectMsg.size > 0) {
      UserMsgStore.readMsg(UserMsgStore.getSelectMsg).then(() => this.refresh());
    }
  };

  handleDelete = () => {
    const { intl } = this.props;
    if (UserMsgStore.getSelectMsg.size > 0) {
      Modal.confirm({
        className: 'c7n-iam-confirm-modal',
        title: intl.formatMessage({ id: `${intlPrefix}.delete.owntitle` }),
        content: intl.formatMessage({ id: `${intlPrefix}.delete.owncontent` }, {
          count: UserMsgStore.selectMsg.size,
        }),
        onOk: () => {
          UserMsgStore.deleteMsg().then(() => {
            Choerodon.prompt(intl.formatMessage({ id: 'delete.success' }));
            this.refresh();
          });
        },
      });
    }
  };

  handleTabsChange = (key) => {
    UserMsgStore.setCurrentType(key);
    if (/&msgType=.+/g.test(window.location.hash)) {
      window.location.hash = window.location.hash.replace(/&msgType=.+/g, `&msgType=${key}`);
    } else {
      window.location.hash = `${window.location.hash}&msgType=${key}`;
    }
    this.refresh();
  };

  handleCheckboxChange = (e, id) => {
    if (UserMsgStore.getSelectMsg.has(id)) {
      UserMsgStore.deleteSelectMsgById(id);
    } else {
      UserMsgStore.addSelectMsgById(id);
    }
    this.setState({ needExpand: false });
  };

  handleReadIconClick = (id) => {
    UserMsgStore.setReadLocal(id);
    UserMsgStore.readMsg([id]);
    this.setState({ needExpand: false });
  };

  handleCollapseChange = (item) => {
    setTimeout(() => {
      if (this.state.needExpand && UserMsgStore.getExpandMsg.has(item.id)) {
        UserMsgStore.unExpandMsgById(item.id);
      } else if (this.state.needExpand) {
        UserMsgStore.expandMsgById(item.id);
      }
      this.setState({ needExpand: true });
    }, 10);
  };

  loadUserInfo = () => UserMsgStore.setUserInfo(this.props.AppState.getUserInfo);

  selectAllMsg = () => {
    if (!UserMsgStore.isAllSelected) {
      UserMsgStore.selectAllMsg();
    } else {
      UserMsgStore.unSelectAllMsg();
    }
  };

  renderUserMsgCard(item) {
    const { AppState } = this.props;
    const currentType = UserMsgStore.getCurrentType;
    const isAnnouncement = currentType === 'announcement';
    const innerStyle = {
      userSelect: 'none', verticalAlign: 'top', marginRight: '8px', marginLeft: isAnnouncement ? '0' : '12px', fontSize: '16px', color: 'rgba(0,0,0,0.65)',
    };

    const systemAvatar = (
      <Tooltip title={AppState.siteInfo.systemName || 'Choerodon'}>
        <Avatar size="small" src={AppState.siteInfo.favicon || './favicon.ico'} style={innerStyle}>
          {(AppState.siteInfo.systemName && AppState.siteInfo.systemName[0]) || 'Choerodon'}
        </Avatar>
      </Tooltip>
    );

    let innerHTML;

    if (!isAnnouncement) {
      const { id, title, read, sendTime, content, sendByUser } = item;
      let avatar;
      if (sendByUser !== null) {
        const { imageUrl, loginName, realName } = sendByUser;
        avatar = (
          <Tooltip title={`${loginName} ${realName}`}>
            <Avatar size="small" src={imageUrl} style={innerStyle}>
              {realName[0].toUpperCase()}
            </Avatar>
          </Tooltip>
        );
      } else {
        avatar = systemAvatar;
      }
      innerHTML = (
        <List.Item>
          <Collapse
            onChange={() => this.handleCollapseChange(item)}
            className="c7n-iam-user-msg-collapse"
            activeKey={UserMsgStore.getExpandMsg.has(id) ? [id.toString()] : []}
            style={UserMsgStore.getExpandMsg.has(id) ? null : { backgroundColor: '#fff' }}
          >
            <Panel header={this.renderMsgTitle(title, id, read, sendTime, UserMsgStore.getSelectMsg.has(id), avatar)} key={id.toString()} className="c7n-iam-user-msg-collapse-panel">
              {<div>
                <div style={{ width: 'calc(100% - 72px)', margin: '0 36px', display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: `${content}` }} />
              </div> }
            </Panel>
          </Collapse>

        </List.Item>
      );
    } else {
      const { id, title, sendDate, content } = item;
      innerHTML = (
        <List.Item>
          <Collapse
            onChange={() => this.handleCollapseChange(item)}
            className="c7n-iam-user-msg-collapse"
            activeKey={UserMsgStore.getExpandMsg.has(id) ? [id.toString()] : []}
            style={UserMsgStore.getExpandMsg.has(id) ? null : { backgroundColor: '#fff' }}
          >
            <Panel header={this.renderAnnoucenmentTitle(title, id, sendDate, systemAvatar)} key={id.toString()} className="c7n-iam-user-msg-collapse-panel">
              {<div>
                <div style={{ width: 'calc(100% - 72px)', margin: '0 36px', display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: `${content}` }} />
              </div> }
            </Panel>
          </Collapse>

        </List.Item>
      );
    }
    return innerHTML;
  }


  renderEmpty = (type) => {
    const currentType = UserMsgStore.getCurrentType;
    const isAnnounceMent = currentType === 'announcement';
    return isAnnounceMent ? (
      <div>
        <div className="c7n-iam-user-msg-empty-icon" />
        <div className="c7n-iam-user-msg-empty-icon-text"><FormattedMessage id="user.usermsg.allempty" />公告</div>
      </div>
    ) : (
      <div>
        <div className="c7n-iam-user-msg-empty-icon" />
        <div className="c7n-iam-user-msg-empty-icon-text"><FormattedMessage id={this.state.showAll ? 'user.usermsg.allempty' : 'user.usermsg.empty'} />{type}</div>
      </div>
    );
  };

  render() {
    const { intl } = this.props;
    const pagination = UserMsgStore.getPagination;
    const userMsg = UserMsgStore.getUserMsg;
    const announceMsg = UserMsgStore.getAnnounceMsg;
    const currentType = UserMsgStore.getCurrentType;
    const isAnnounceMent = currentType === 'announcement';
    const currentMsg = isAnnounceMent ? announceMsg : userMsg;
    return (
      <Page
        service={[
          'notify-service.site-msg-record.pagingQuery',
          'notify-service.site-msg-record.batchDeleted',
          'notify-service.site-msg-record.batchRead',
          'notify-service.system-announcement.pagingQueryCompleted',
        ]}
      >
        <Header
          title={<FormattedMessage id="user.usermsg.header.title" />}
        >
          <Button
            icon="playlist_add_check"
            onClick={this.selectAllMsg}
            style={{ width: '93px' }}
            disabled={isAnnounceMent}
          >
            <FormattedMessage id={UserMsgStore.getUserMsg.length > 0 && UserMsgStore.isAllSelected ? 'selectnone' : 'selectall'} />
          </Button>
          <Permission
            service={['notify-service.site-msg-record.batchRead']}
          >
            <Button
              icon="all_read"
              disabled={UserMsgStore.getSelectMsg.size === 0 || isAnnounceMent}
              onClick={this.handleBatchRead}
            >
              <FormattedMessage id={`${intlPrefix}.markreadall`} />
            </Button>
          </Permission>
          <Permission
            service={['notify-service.site-msg-record.batchDeleted']}
          >
            <Button
              icon="delete"
              disabled={UserMsgStore.getSelectMsg.size === 0 || isAnnounceMent}
              onClick={this.handleDelete}
            >
              <FormattedMessage id={'remove'} />
            </Button>
          </Permission>
          <Button
            icon="refresh"
            onClick={this.refresh}
          >
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <Tabs defaultActiveKey="msg" onChange={this.handleTabsChange} activeKey={currentType} animated={false} className="c7n-iam-user-msg-tab-container">
            {[{ key: 'msg', value: '消息' }, { key: 'notice', value: '通知' }, { key: 'announcement', value: '公告' }].map(panelItem => (
              <TabPane tab={panelItem.value} key={panelItem.key} className="c7n-iam-user-msg-tab">
                <div className={classnames('c7n-iam-user-msg-btns', { 'c7n-iam-user-msg-btns-hidden': currentType === 'announcement' })}>
                  <Button
                    className={this.getUserMsgClass('unRead')}
                    onClick={() => { this.showUserMsg(false); }}
                    type="primary"
                  ><FormattedMessage id="user.usermsg.unread" /></Button>
                  <Button
                    className={this.getUserMsgClass('all')}
                    onClick={() => { this.showUserMsg(true); }}
                    type="primary"
                  ><FormattedMessage id="user.usermsg.all" /></Button>
                </div>
                <List
                  style={{ width: isAnnounceMent ? '100%' : 'calc(100% - 113px)' }}
                  className="c7n-iam-user-msg-list"
                  loading={UserMsgStore.getLoading}
                  itemLayout="horizontal"
                  pagination={currentMsg.length > 0 ? pagination : false}
                  dataSource={isAnnounceMent ? announceMsg : userMsg}
                  renderItem={item => (this.renderUserMsgCard(item))}
                  split={false}
                  empty={this.renderEmpty(panelItem.value)}
                />
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Page>
    );
  }
}

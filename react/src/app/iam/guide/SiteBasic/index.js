import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import { Button, Icon, Timeline } from 'choerodon-ui';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { StepFooter, StepBar, GuideMask, AutoGuide } from '@choerodon/boot';
import EasyImg from '../../components/easyImg';
import picSiteRole from './image/site-role.png';
import picRootRole from './image/root-role.png';
import picAddMenu from './image/add-menu.png';
import picCard from './image/card.png';

@inject('GuideStore', 'AppState')
@injectIntl
@observer
export default class SiteBasic extends Component {
  getGuideCard(iconType, name) {
    return (
      <div className="guide-card">
        <Icon type={iconType} style={{ color: 'rgba(0,0,0,0.65)', fontSize: '24px' }} />
        <span style={{ color: '#000', fontSize: '16px' }}>{name}</span>
      </div>
    );
  }

  handleCheck = dom => dom.children[0].className !== 'guide-card'

  renderStep(current) {
    const { AppState, GuideStore, intl } = this.props;
    switch (current) {
      case 0:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>概览</h2>
            <p className="text">在平台层您可以管理组织，管理角色对应的权限，给成员分配平台层角色，设置root用户，自定义平台菜单、仪表盘、标志等基本配置。
当然，您想进行这些操作，您需是平台管理员及其以上的权限角色。</p>
            <p>在此教程，您将学习以下操作：</p>
            <ul className="step-dire">
              <li>管理组织</li>
              <li>创建角色</li>
              <li>分配平台角色</li>
              <li>设置Root用户</li>
              <li>平台自定义设置</li>
            </ul>
           
          </div>
        );
      case 1:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>导航至平台设置页面</h2>
            <Timeline style={{ height: '100px' }}>
              <Timeline.Item>
                <p>
                点击<GuideMask highLight="icon-settings" level={1}>管理</GuideMask>按钮
                </p>
              </Timeline.Item>
              <Timeline.Item>
                <p>
                打开平台左侧的<GuideMask highLight="c7n-boot-header-logo-menu-icon" level={0}>菜单</GuideMask>
                </p>
              </Timeline.Item>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon-IAM" level={2}>平台设置</GuideMask>部分</p>
              </Timeline.Item>
            </Timeline>
            <AutoGuide
              highLight={['icon-settings', 'icon-settings', 'c7n-boot-header-logo-menu-icon', 'c7n-boot-header-logo-menu-icon', 'icon-IAM']}
              idx={[0, 0, 0, 0, 0]}
              level={[1, 1, 0, 0, 2]}
              mode={['mask', 'click', 'mask', 'click', 'mask']}
              onStart={() => AppState.setMenuExpanded(false)}
            >
              <div className="guide-card">
                <Icon type="IAM" style={{ color: 'rgba(0,0,0,0.65)', fontSize: '24px' }} />
                <span style={{ color: '#000', fontSize: '16px' }}>平台设置</span>
                <Icon type="play_circle_filled" style={{ marginLeft: 'calc(100% - 199.5px)', fontSize: '15px' }} />
                <span style={{ marginRight: '16px' }}>互动演示</span>
              </div>
            </AutoGuide>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>管理组织</h2>
            <p>组织是项目的上一个层级，用户必须属于一个组织。通过组织管理您可以修改组织或者查看组织详情。</p>
            <Timeline>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon icon-manage_organization" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>组织管理</GuideMask></p>
                <GuideMask highLight="icon icon-manage_organization" className="no-border" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>
                  {this.getGuideCard('manage_organization', '组织管理')}
                </GuideMask>
              </Timeline.Item>
              <Timeline.Item>
                <p>
                  点击
                  <GuideMask highLight="icon-mode_edit" level={1} siteLevel="site" route="/iam/organization">
                    修改
                    <Icon type="mode_edit" style={{ fontSize: 10 }} />
                  </GuideMask>图标，您可以修改组织信息。
                </p>
              </Timeline.Item>
              <Timeline.Item>
                <p>
                  点击
                  <GuideMask highLight="icon-find_in_page" level={1} siteLevel="site" route="/iam/organization">
                    详情
                    <Icon type="find_in_page" style={{ fontSize: 10 }} />
                  </GuideMask>图标，您可以查看组织信息。
                </p>
              </Timeline.Item>
            </Timeline>
            <div />
          </div>
        );
      
      case 3:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>创建角色</h2>
            <p>角色是您可分配给成员的一组权限。通过角色管理您可以创建、启停用角色，为角色添加权限。</p>
            <Timeline>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon-assignment_ind" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>角色管理</GuideMask></p>
                <GuideMask highLight="icon-assignment_ind" className="no-border" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>
                  {this.getGuideCard('assignment_ind', '角色管理')}
                </GuideMask>
              </Timeline.Item>
              <Timeline.Item>
                <p>点击 <GuideMask highLight="icon-playlist_add" level={1} siteLevel="site" route="/iam/role">创建角色</GuideMask>按钮。</p>
                <ul className="ul1">
                  <li>选择角色层级，输入角色编码、角色名称。</li>
                  <li>选择角色标签。（选填）</li>
                  <li>点击
                    <GuideMask highLight="icon-add" level={1} siteLevel="site" route="/iam/role/create">添加权限</GuideMask>,选择要给角色添加的权限.</li>
                  <li>点击创建按钮完成角色创建</li>
                </ul>
              </Timeline.Item>
            </Timeline>
            <p><Icon type="info" style={{ color: '#ffb100', marginBottom: '3px' }} /><span> 角色标签用于定义角色的特定逻辑的功能，需与代码开发结合。</span></p>
          </div>
        );
      case 4:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>分配平台角色</h2>
            <p>通过平台角色分配您可以向成员分配平台层的角色，以便于成员有权限在平台层操作。</p>
            <Timeline>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon-person_add" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>平台角色分配</GuideMask></p>
                <GuideMask highLight="icon-person_add" level={2} siteLevel="site" className="no-border" mode="checkMask" onCheck={dom => this.handleCheck(dom)}>
                  {this.getGuideCard('person_add', '平台角色分配')}
                </GuideMask>
              </Timeline.Item>
              <Timeline.Item>
                <p>点击<GuideMask highLight="icon-arrow_drop_down" level={3} idx={1} siteLevel="site" route="/iam/member-role">成员类型选择框</GuideMask>，切换您要进行角色分配的成员类型。</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>点击 <GuideMask highLight="icon-playlist_add" level={1} siteLevel="site" route="/iam/member-role">添加</GuideMask>按钮。 </p>
                <ul className="ul1">
                  <li>首先，选择成员类型</li>
                  <li>输入要添加角色的成员登录名。</li>
                  <li>选择对应角色</li>
                  <li>点击添加按钮完成角色分配</li>
                </ul>
                <EasyImg src={picSiteRole} />
              </Timeline.Item>
            </Timeline>
           
          </div>
        );
      case 5:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>设置root用户</h2>
            <p>Root用户拥有系统的最高权限。他可以管理平台以及平台上的所有组织和项目。通过Root用户设置您可以添加或移除root用户。</p>
            <Timeline>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon-root" level={2} siteLevel="site" mode="checkMask" onCheck={dom => this.handleCheck(dom)}>Root用户设置</GuideMask></p>
                <GuideMask highLight="icon-root" level={2} siteLevel="site" className="no-border" mode="checkMask" onCheck={dom => this.handleCheck(dom)}>{this.getGuideCard('root', 'Root用户设置')}</GuideMask>
              </Timeline.Item>
              <Timeline.Item>
                <p>点击 <GuideMask highLight="icon-playlist_add" level={1} siteLevel="site" route="/iam/root-user">添加</GuideMask>按钮。</p>
                <ul className="ul1">
                  <li>输入要分配Root权限的成员登录名。</li>
                  <li>点击添加按钮完成Root用户设置。</li>
                </ul>
                <EasyImg src={picRootRole} />
              </Timeline.Item>
            </Timeline>
            <p><Icon type="info" style={{ color: '#f44336', marginBottom: '3px' }} /><span> Root用户拥有系统的最高权限，请谨慎操作。</span></p>
          </div>
        );
      case 6:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>平台自定义设置</h2>
            <p>您可以自定义您的菜单，仪表盘以及平台logo等标志性配置。</p>
            <Timeline>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon-view_list" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>菜单配置</GuideMask></p>
                <GuideMask highLight="icon-view_list" level={2} className="no-border" mode="checkMask" onCheck={dom => this.handleCheck(dom)}>
                  {this.getGuideCard('view_list', '菜单配置')}
                </GuideMask>
                <p>拖动目录/菜单，调整目录/菜单的顺序。</p>
                <p>点击 <GuideMask highLight="icon-playlist_add" level={1} siteLevel="site" route="/iam/menu-setting">创建目录</GuideMask>按钮。向对应层级添加目录。</p>
                <EasyImg src={picAddMenu} />
                <p>点击<GuideMask highLight="c7n-btn-primary" level={0} siteLevel="site" route="/iam/menu-setting">保存</GuideMask>按钮完成菜单配置。</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>
                  选择
                  <GuideMask highLight="icon-donut_small" level={2} mode="checkMask" onCheck={dom => this.handleCheck(dom)}>仪表盘配置</GuideMask>
                </p>
                <GuideMask highLight="icon-donut_small" level={2} className="no-border" mode="checkMask" onCheck={dom => this.handleCheck(dom)}>
                  {this.getGuideCard('donut_small', '仪表盘配置')}
                </GuideMask>
                <p>
                  点击
                  <GuideMask highLight="icon-mode_edit" level={1} siteLevel="site" route="/iam/dashboard-setting">
                    修改
                    <Icon type="mode_edit" style={{ fontSize: 10 }} />
                  </GuideMask>图标，您可以修改卡片的信息，选择是否开启角色控制。
                </p>
                <EasyImg src={picCard} />
                <p>点击
                  <GuideMask highLight="icon-remove_circle_outline" level={1} siteLevel="site" route="/iam/dashboard-setting">
                    启停用
                    <Icon type="finished" style={{ fontSize: 10 }} />
                  </GuideMask>按钮，可以控制此卡片是否启停用。
                </p>
              </Timeline.Item>
              <Timeline.Item>
                <p>选择<GuideMask highLight="icon-settings" idx={1} level={2}>系统配置</GuideMask></p>
                <GuideMask highLight="icon-settings" idx={1} level={2} className="no-border">
                  {this.getGuideCard('settings', '系统配置')}
                </GuideMask>
                <p>您可以上传平台徽标、图形标，自定义平台简称、全称，更改平台默认密码和默认语言的顺序。</p>
                <p>点击<GuideMask highLight="c7n-btn-primary" level={0} siteLevel="site" route="/iam/system-setting">保存</GuideMask>按钮完成系统配置。</p>
                <p>您可以点击 <GuideMask highLight="icon-swap_horiz" level={1} siteLevel="site" route="/iam/system-setting">重置</GuideMask>按钮，还原到默认配置。</p>
              </Timeline.Item>
            </Timeline>
          </div>
        );
      default:
        return (
          <div>
            <h1>{intl.formatMessage({ id: 'guide.iam.sitebasic.h1' })}</h1>
            <h2>完成</h2>
            <div className="icon-winner" />
            <p>恭喜！</p>
            <p>现在您已经知道作为平台管理员，要如何进行系统平台的一些列配置和设置。</p>
            <p>您可以点击表单页面的“<a href="http://choerodon.io" target="_blank">了解更多<Icon type="open_in_new" /></a>”，了解系统配置的更多用户手册。</p>
            <p><a href="http://v0-10.choerodon.io/zh/docs/user-guide/system-configuration/platform/menu_configuration/" target="_blank">菜单配置<Icon type="open_in_new" /></a> 用于配置平台菜单</p>
            <p><a href="http://v0-10.choerodon.io/zh/docs/user-guide/system-configuration/platform/dashboard-config/" target="_blank">仪表盘配置<Icon type="open_in_new" /></a> 用于预置用户可见的仪表盘卡片</p>
            <p><a href="http://choerodon.io/zh/docs/user-guide/system-configuration/tenant/ldap/" target="_blank">LDAP<Icon type="open_in_new" /></a> 对组织应用的LDAP信息设置的管理</p>
          </div>
        );
    }
  }

  render() {
    const { GuideStore } = this.props;
    return (
      <div className="c7n-iam-guide-site-basic">
        <div style={{ width: '90%', margin: '0 auto' }}>
          <StepBar current={GuideStore.getCurrentStep} total={7} />
          {this.renderStep(GuideStore.getCurrentStep)}
        </div>
        <StepFooter total={7} />
      </div>
    );
  }
}

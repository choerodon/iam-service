import React, { Component } from 'react';
import { DashBoardNavBar } from '@choerodon/boot';
import './index.scss';

export default class Document extends Component {
  render() {
    return (
      <div className="c7n-iam-dashboard-document">
        <ul>
          <li>
            <a target="choerodon" href="http://choerodon.io/zh/docs/concept/choerodon-concept/">Choerodon 是什么？</a>
          </li>
          <li>
            <a target="choerodon" href="http://choerodon.io/zh/docs/concept/platform-concept/">平台概念</a>
          </li>
          <li>
            <a target="choerodon" href="http://choerodon.io/zh/docs/concept/choerodon-system-architecture/">系统架构</a>
          </li>
          <li>
            <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/">用户手册</a>
          </li>
          <li>
            <a target="choerodon" href="http://choerodon.io/zh/docs/development-guide/">开发手册</a>
          </li>
        </ul>
        <DashBoardNavBar>
          <a target="choerodon" href="http://choerodon.io/zh/docs/">转至所有文档</a>
        </DashBoardNavBar>
      </div>
    );
  }
}

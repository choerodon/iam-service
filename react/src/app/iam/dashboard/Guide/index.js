import React, { Component } from 'react';
import { DashBoardNavBar } from '@choerodon/boot';
import './index.scss';

export default class Guide extends Component {
  render() {
    return (
      <div className="c7n-iam-dashboard-guide">
        <ul>
          <li>
            <a target="choerodon" href="http://v0-10.choerodon.io/zh/docs/quick-start/admin/project/">创建一个项目</a>
          </li>
          <li>
            <a target="choerodon" href="http://v0-10.choerodon.io/zh/docs/quick-start/project-member/nginx-demo/">创建一个nginx示例</a>
          </li>
          <li>
            <a target="choerodon" href="http://v0-10.choerodon.io/zh/docs/quick-start/project-manager/microservice-front/">创建一个前端应用</a>
          </li>
          <li>
            <a target="choerodon" href="http://v0-10.choerodon.io/zh/docs/quick-start/project-manager/microservice-backend/">创建一个后端应用</a>
          </li>
          <li>
            <a target="choerodon" href="http://v0-10.choerodon.io/zh/docs/quick-start/project-member/agile-management-tools-member/">使用敏捷管理工具</a>
          </li>
        </ul>
        <DashBoardNavBar>
          <a target="choerodon" href="http://choerodon.io/zh/docs/quick-start/">转至所有新手指引</a>
        </DashBoardNavBar>
      </div>
    );
  }
}

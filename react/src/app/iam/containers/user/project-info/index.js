import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';

const index = asyncRouter(() => import('./ProjectInfo'), {
  ProjectInfoStore: () => import('../../../stores/user/project-info'),
  PermissionInfoStore: () => import('../../../stores/user/permission-info'),
});

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default Index;

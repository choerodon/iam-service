
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';

const index = asyncRouter(
  () => import('./Organization'),
  () => import('../../../stores/global/organization'),
);

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default Index;

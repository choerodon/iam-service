/**
 * Created by hulingfangzi on 2018/6/20.
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const index = asyncRouter(() => (import('./Instance')), () => import('../../../stores/global/instance'));
const detail = asyncRouter(() => import('./InstanceDetail'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={`${match.url}/detail/:id`} component={detail} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default Index;

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';

const index = asyncRouter(() => (import('./Configuration')), () => import('../../../stores/global/configuration'));
const create = asyncRouter(() => import('./ConfigurationCreate'));
const edit = asyncRouter(() => import('./ConfigurationEdit'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={`${match.url}/create`} component={create} />
    <Route path={`${match.url}/edit/:name/:id`} component={edit} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default Index;

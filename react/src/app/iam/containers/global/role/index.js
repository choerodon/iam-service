import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';

const index = asyncRouter(() => import('./Role'), () => import('../../../stores/global/role'));
const edit = asyncRouter(() => import('./RoleEdit'), () => import('../../../stores/global/role'));
const create = asyncRouter(() => import('./RoleMsg'), () => import('../../../stores/global/role'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={`${match.url}/create`} component={create} />
    <Route path={`${match.url}/edit/:id`} component={edit} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

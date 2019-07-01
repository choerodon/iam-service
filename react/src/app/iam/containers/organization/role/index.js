import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';

const index = asyncRouter(() => import('./Role'), () => import('../../../stores/organization/role'));
const edit = asyncRouter(() => import('./RoleEdit'), () => import('../../../stores/organization/role'));
const create = asyncRouter(() => import('./RoleMsg'), () => import('../../../stores/organization/role'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={`${match.url}/create`} component={create} />
    <Route path={`${match.url}/edit/:id`} component={edit} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

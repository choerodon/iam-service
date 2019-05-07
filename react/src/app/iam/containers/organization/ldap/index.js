import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';

const index = asyncRouter(() => import('./LDAP'), () => import('../../../stores/organization/ldap'));
const syncRecord = asyncRouter(() => import('./SyncRecord'), () => import('../../../stores/organization/ldap'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route exact path={`${match.url}/sync-record/:id?`} component={syncRecord} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default Index;

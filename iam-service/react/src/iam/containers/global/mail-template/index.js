import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const index = asyncRouter(() => (import('./MailTemplate')), () => import('../../../stores/global/mail-template'));
const create = asyncRouter(() => import('./MailTemplateCreate'));
const modify = asyncRouter(() => import('./MailTemplateModify'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={index} />
    <Route path={`${match.url}/create`} component={create} />
    <Route path={`${match.url}/modify/:id`} component={modify} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

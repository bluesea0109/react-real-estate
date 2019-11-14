import React from 'react';
import { Route, Switch } from 'react-router';

import IndexPage from './containers/IndexPage';
import Callback from './containers/Callback';
import EmptyPage from './components/EmptyPage';

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route exact path="/callback" component={Callback} />
      <Route exact path="/dashboard" component={EmptyPage} />
    </Switch>
  );
};

import React from 'react';
import { Route, Switch } from 'react-router';

import PrivateRoute from './containers/PrivateRoute';
import IndexPage from './containers/IndexPage';
import Callback from './containers/Callback';
import DashboardPage from './pages/DashboardPage';
import CustomizationPage from './pages/CustomizationPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import EmptyPage from './pages/EmptyPage';

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route path="/callback" component={Callback} />
      <PrivateRoute path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/customization" component={CustomizationPage} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <PrivateRoute path="/settings" component={SettingsPage} />
      <Route path="*" component={EmptyPage} />
    </Switch>
  );
};

import React from 'react';
import { Route, Switch } from 'react-router';

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
      <Route exact path="/callback" component={Callback} />
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route exact path="/customization" component={CustomizationPage} />
      <Route exact path="/profile" component={ProfilePage} />
      <Route exact path="/settings" component={SettingsPage} />
      <Route exact path="*" component={EmptyPage} />
    </Switch>
  );
};

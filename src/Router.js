import React from 'react';
import { Route, Switch } from 'react-router';

import PrivateRoute from './containers/PrivateRoute';
import IndexPage from './containers/IndexPage';
import Callback from './containers/Callback';
import DashboardPage from './pages/DashboardPage';
import MailoutDetails from './pages/MailoutDetailsPage';
import CustomizationPage from './pages/CustomizationPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import EmptyPage from './pages/EmptyPage';

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route path="/callback" component={Callback} />
      <PrivateRoute exact path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/dashboard/:mailoutId" component={MailoutDetails} />
      <PrivateRoute path="/customization" component={CustomizationPage} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <PrivateRoute path="/settings" component={SettingsPage} />
      <Route path="*" component={EmptyPage} />
    </Switch>
  );
};

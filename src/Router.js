import React from 'react';
import { Route, Switch } from 'react-router';

import PrivateRoute from './containers/PrivateRoute';
import IndexPage from './containers/IndexPage';
import Callback from './containers/Callback';
import DashboardPage from './pages/DashboardPage';
import MailoutDetails from './pages/MailoutDetailsPage';
import CustomizationPage from './pages/CustomizationPage';
import CustomizationTeamPage from './pages/CustomizationTeamPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import EmptyPage from './pages/EmptyPage';
// import onRouteChanges from './onRouteChange';
//
// onRouteChanges(route => {
//   console.log(`route changed to "${route}"`);
// });

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route path="/callback" component={Callback} />
      <PrivateRoute exact path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/dashboard/:mailoutId" component={MailoutDetails} />
      <PrivateRoute exact path="/customization" component={CustomizationPage} />
      <PrivateRoute path="/customization/team" component={CustomizationTeamPage} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <PrivateRoute path="/settings" component={SettingsPage} />
      <Route path="*" component={EmptyPage} />
    </Switch>
  );
};

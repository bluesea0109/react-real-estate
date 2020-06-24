import React from 'react';
import { Route, Switch } from 'react-router';

import PrivateRoute from './containers/PrivateRoute';
import IndexPage from './containers/IndexPage';
import SignUpPage from './containers/SignUpPage';
import EmailVerifiedPage from './containers/EmailVerifiedPage';
import LoginPage from './containers/LoginPage';
import CallbackPage from './containers/CallbackPage';
import OnboardPage from './pages/OnboardPage';
import DashboardPage from './pages/DashboardPage';
import MailoutDetailsPage from './pages/MailoutDetailsPage';
import MailoutEditPage from './pages/MailoutEditPage';
import MailoutDestinationsPage from './pages/MailoutDestinationsPage';
import CustomizationPage from './pages/CustomizationPage';
import CustomizationTeamPage from './pages/CustomizationTeamPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import EmptyPage from './pages/EmptyPage';
import ArchivedPage from './pages/ArchivedPage';
// import onRouteChanges from './onRouteChange';
//
// onRouteChanges(route => {
//   console.log(`route changed to "${route}"`);
// });

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/emailverified" component={EmailVerifiedPage} />
      <Route path="/callback" component={CallbackPage} />
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/onboard" component={OnboardPage} />
      <PrivateRoute exact path="/dashboard" component={DashboardPage} />
      <PrivateRoute exact path="/dashboard/archived" component={ArchivedPage} />
      <PrivateRoute exact path="/dashboard/:mailoutId" component={MailoutDetailsPage} />
      <PrivateRoute exact path="/dashboard/edit/:mailoutId" component={MailoutEditPage} />
      <PrivateRoute exact path="/dashboard/edit/:mailoutId/destinations" component={MailoutDestinationsPage} />

      <PrivateRoute exact path="/customization" component={CustomizationPage} />
      <PrivateRoute path="/customization/team" component={CustomizationTeamPage} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <PrivateRoute path="/settings" component={SettingsPage} />
      <PrivateRoute path="/billing" component={BillingPage} />
      <Route path="*" component={EmptyPage} />
    </Switch>
  );
};

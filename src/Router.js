import React from 'react';
import { Route, Switch } from 'react-router';

import PrivateRoute from './containers/PrivateRoute';
import IndexPage from './containers/IndexPage';
import CallbackPage from './containers/CallbackPage';
import OnboardPage from './pages/OnboardPage';
import OnboardPageProfile from './pages/OnboardPageProfile';
import OnboardPageCustomizeTeam from './pages/OnboardPageCustomizeTeam';
import OnboardPageCustomize from './pages/OnboardPageCustomize';
import OnboardPageInviteTeammates from './pages/OnboardPageInviteTeammates';
import DashboardPage from './pages/DashboardPage';
import MailoutDetailsPage from './pages/MailoutDetailsPage';
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
      <Route path="/callback" component={CallbackPage} />
      <PrivateRoute exact path="/onboard" component={OnboardPage} />
      <PrivateRoute path="/onboard/profile" component={OnboardPageProfile} />
      <PrivateRoute path="/onboard/customization/team" component={OnboardPageCustomizeTeam} />
      <PrivateRoute exact path="/onboard/customization" component={OnboardPageCustomize} />
      <PrivateRoute path="/onboard/invite" component={OnboardPageInviteTeammates} />
      <PrivateRoute exact path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/dashboard/:mailoutId" component={MailoutDetailsPage} />
      <PrivateRoute exact path="/customization" component={CustomizationPage} />
      <PrivateRoute path="/customization/team" component={CustomizationTeamPage} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <PrivateRoute path="/settings" component={SettingsPage} />
      <Route path="*" component={EmptyPage} />
    </Switch>
  );
};

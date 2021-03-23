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
import ListingsPage from './pages/ListingsPage';
import PostcardsPage from './pages/PostcardsPage';
import AdsPage from './pages/AdsPage';
import Editor from './pages/Editor/Editor';
import MailoutDetailsPage from './pages/MailoutDetailsPage/MailoutDetailsPage';
import MailoutDestinationsPage from './pages/MailoutDestinationsPage';
import CustomizationPage from './pages/CustomizationPage';
import CustomizationTeamPage from './pages/CustomizationTeamPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import EmptyPage from './pages/EmptyPage';
import ArchivedPage from './pages/ArchivedPage';
import ReadyMadeDesignPage from './pages/ReadyMadeDesignPage';
import MicroListingsPage from './pages/MicroListingsPage';
import { CreatePostcard } from './pages/CreatePostcard';

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
      <PrivateRoute exact path="/listings" component={ListingsPage} />
      <PrivateRoute exact path="/ads" component={AdsPage} />
      <PrivateRoute exact path="/postcards" component={PostcardsPage} />
      <PrivateRoute exact path="/postcards/archived" component={ArchivedPage} />
      <PrivateRoute exact path="/postcards/:mailoutId" component={MailoutDetailsPage} />
      <PrivateRoute exact path="/postcards/edit/:mailoutId" component={Editor} />
      <PrivateRoute
        exact
        path="/postcards/edit/:mailoutId/destinations"
        component={MailoutDestinationsPage}
      />
      <PrivateRoute exact path="/dashboard/archived" component={ArchivedPage} />
      <PrivateRoute exact path="/dashboard/:mailoutId" component={MailoutDetailsPage} />
      <PrivateRoute exact path="/dashboard/edit/:mailoutId" component={Editor} />
      <PrivateRoute
        exact
        path="/dashboard/edit/:mailoutId/destinations"
        component={MailoutDestinationsPage}
      />

      <PrivateRoute exact path="/customization" component={CustomizationPage} />
      <PrivateRoute path="/customization/team" component={CustomizationTeamPage} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <PrivateRoute path="/settings" component={SettingsPage} />
      <PrivateRoute path="/billing" component={BillingPage} />
      <PrivateRoute exact path="/ready-made-designs" component={ReadyMadeDesignPage} />
      <PrivateRoute exact path="/create-postcard" component={CreatePostcard} />
      <PrivateRoute exact path="/micro/listings" component={MicroListingsPage} />
      <Route path="*" component={EmptyPage} />
    </Switch>
  );
};

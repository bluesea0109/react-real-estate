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
import MicroListingsPage from './pages/MicroListingsPage';
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
import { CreatePostcard } from './pages/CreatePostcard';

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/emailverified" component={EmailVerifiedPage} />
      <Route path="/callback" component={CallbackPage} />
      <Route path="/login" component={LoginPage} />
      <PrivateRoute
        path="/onboard"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={OnboardPage}
      />
      <PrivateRoute
        exact
        path="/dashboard"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={DashboardPage}
      />
      <PrivateRoute
        exact
        path="/listings"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={ListingsPage}
      />
      <PrivateRoute
        exact
        path="/ads"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={AdsPage}
      />
      <PrivateRoute
        exact
        path="/postcards"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={PostcardsPage}
      />
      <PrivateRoute
        exact
        path="/postcards/archived"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={ArchivedPage}
      />
      <PrivateRoute
        exact
        path="/postcards/:mailoutId"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={MailoutDetailsPage}
      />
      <PrivateRoute
        exact
        path="/postcards/edit/:mailoutId"
        middleware={['showTopbar']}
        auth={true}
        component={Editor}
      />
      <PrivateRoute
        exact
        path="/postcards/edit/:mailoutId/destinations"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={MailoutDestinationsPage}
      />
      <PrivateRoute
        exact
        path="/dashboard/archived"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={ArchivedPage}
      />
      <PrivateRoute
        exact
        path="/dashboard/:mailoutId"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={MailoutDetailsPage}
      />
      <PrivateRoute
        exact
        path="/dashboard/edit/:mailoutId"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={Editor}
      />
      <PrivateRoute
        exact
        path="/dashboard/edit/:mailoutId/destinations"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={MailoutDestinationsPage}
      />

      <PrivateRoute
        exact
        path="/customization"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={CustomizationPage}
      />
      <PrivateRoute
        path="/customization/team"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={CustomizationTeamPage}
      />
      <PrivateRoute
        path="/profile"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={ProfilePage}
      />
      <PrivateRoute
        path="/settings"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={SettingsPage}
      />
      <PrivateRoute
        path="/billing"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={BillingPage}
      />
      <PrivateRoute
        exact
        path="/ready-made-designs"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={ReadyMadeDesignPage}
      />
      <PrivateRoute
        exact
        path="/create-postcard"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={CreatePostcard}
      />
      <Route exact path="/micro/listings" component={MicroListingsPage} />
      <PrivateRoute
        path="*"
        middleware={['showSidebar', 'showTopbar']}
        auth={true}
        component={EmptyPage}
      />
    </Switch>
  );
};

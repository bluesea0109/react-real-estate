import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';

import Loading from '../components/Loading';
import { ContentTopHeaderLayout } from '../layouts';
import { Message, Page, Segment } from '../components/Base';
import AuthService from '../services/auth';
import { authenticate, showBars } from '../store/modules/auth0/actions';

const PrivateRoute = ({
  component: Component,
  path,
  auth0,
  onLogin,
  templates,
  middleware = false,
  auth = false,
  states,
  boards,
  ...rest
}) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const showBarsArray = useSelector(store => store.auth0.showBars);

  useEffect(() => {
    if (!middleware && middleware !== !!showBarsArray.length) {
      dispatch(showBars([]));
    }
    if (middleware && JSON.stringify(middleware) !== JSON.stringify(showBarsArray)) {
      dispatch(showBars(middleware));
    }
  }, [middleware, dispatch, showBarsArray]);

  useEffect(() => {
    if (auth) {
      const fn = async () => {
        if (
          history.location.pathname !== '/callback' &&
          history.location.pathname !== '/dashboard' &&
          history.location.pathname !== '/onboard' &&
          history.location.pathname !== '/'
        ) {
          localStorage.setItem('routerDestination', history.location.pathname);
        }
        const localToken = localStorage.getItem('localToken');
        if (!auth0.authenticated && !auth0.error && !localToken) {
          history.push('/');
        } else if (localToken && !auth0.authenticated) {
          AuthService.cookieLogin(localToken);
          dispatch(authenticate());
        } else {
          if (!onLogin.pending && !onLogin.error) {
            if (
              !onLogin.teamProfile ||
              !onLogin.teamBranding ||
              !onLogin.userProfile ||
              !onLogin.userBranding ||
              (onLogin.userProfile && !onLogin.userProfile.setupComplete) ||
              (onLogin.userBranding && !onLogin.userBranding.onboardingComplete)
            ) {
              return history.push('/onboard');
            }
          }
          if (localStorage.getItem('routerDestination')) {
            const routerDestination = await localStorage.getItem('routerDestination');
            localStorage.removeItem('routerDestination');
            return history.push(routerDestination);
          }
        }
      };
      fn();
    }
  }, [auth0, history, onLogin, dispatch, auth]);

  const render = props => {
    const isReady =
      auth0.authenticated &&
      !onLogin.pending &&
      !onLogin.error &&
      !templates.pending &&
      !states.pending &&
      !boards.pending &&
      !!templates.available &&
      !!states.available &&
      !!boards.available &&
      auth;

    return isReady ? (
      <Component {...props} />
    ) : onLogin.error ? (
      <Segment basic>
        <Message>
          <Message.Header>{onLogin.error.message}</Message.Header>
          <p>
            The login process has failed, please contact the Brivity Marketer Technical Support to
            resolve this issue!
          </p>
        </Message>
      </Segment>
    ) : (
      <Page basic>
        <ContentTopHeaderLayout>
          <Loading />
        </ContentTopHeaderLayout>
      </Page>
    );
  };
  return auth ? (
    <Route path={path} render={render} {...rest} />
  ) : (
    <Route path={path} component={Component} {...rest} />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};

const mapStateToProps = state => {
  return {
    auth0: state.auth0,
    onLogin: state.onLogin,
    templates: state.templates,
    states: state.states,
    boards: state.boards,
  };
};

export default connect(mapStateToProps)(PrivateRoute);

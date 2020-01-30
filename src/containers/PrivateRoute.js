import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';

import Loading from '../components/Loading';
import { Message, Segment } from '../components/Base';

const PrivateRoute = ({ component: Component, path, auth0, onLogin, templates, states, boards, ...rest }) => {
  let history = useHistory();

  useEffect(() => {
    const fn = async () => {
      if (history.location.pathname !== '/callback' && history.location.pathname !== '/dashboard' && history.location.pathname !== '/') {
        await localStorage.setItem('routerDestination', history.location.pathname);
      }

      if (!auth0.authenticated && !auth0.error) {
        await history.push('/');
      } else {
        if (
          (!onLogin.pending && !onLogin.error && !onLogin.userProfile) ||
          (!onLogin.pending && !onLogin.error && onLogin.userProfile && !onLogin.userProfile.setupComplete) ||
          (!onLogin.pending && !onLogin.error && onLogin.userBranding && !onLogin.userBranding.onboardingComplete)
        ) {
          history.push('/onboard');
        }

        if (localStorage.getItem('routerDestination')) {
          const routerDestination = await localStorage.getItem('routerDestination');
          await localStorage.removeItem('routerDestination');
          await history.push(routerDestination);
        }
      }
    };
    fn();
  }, [auth0, history, onLogin]);

  const render = props => {
    const isReady =
      auth0.authenticated &&
      !auth0.error &&
      !onLogin.pending &&
      !onLogin.error &&
      !templates.pending &&
      !states.pending &&
      !boards.pending &&
      !!templates.available &&
      !!states.available &&
      !!boards.available;

    return isReady ? (
      <Component {...props} />
    ) : onLogin.error || auth0.error ? (
      <Segment basic>
        <Message>
          <Message.Header>{onLogin.error.message || auth0.error.message}</Message.Header>
          <p>The login process has failed, please contact the Brivity Marketer Technical Support to resolve this issue!</p>
        </Message>
      </Segment>
    ) : (
      <Loading />
    );
  };
  return <Route path={path} render={render} {...rest} />;
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

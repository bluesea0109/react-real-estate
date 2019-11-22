import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';

import Loading from '../components/Loading';

const PrivateRoute = ({ component: Component, path, auth0, ...rest }) => {
  let history = useHistory();

  useEffect(() => {
    const fn = async () => {
      if (history.location.pathname !== '/callback' && history.location.pathname !== '/dashboard' && history.location.pathname !== '/') {
        await localStorage.setItem('routerDestination', history.location.pathname);
      }

      if (!auth0.authenticated) {
        await history.push('/');
      } else if (localStorage.getItem('routerDestination')) {
        const routerDestination = await localStorage.getItem('routerDestination');
        await localStorage.removeItem('routerDestination');
        await history.push(routerDestination);
      }
    };
    fn();
  }, [auth0, history]);

  const render = props => (auth0.authenticated ? <Component {...props} /> : <Loading />);

  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};

const mapStateToProps = state => {
  return {
    auth0: state.auth0,
  };
};

export default connect(mapStateToProps)(PrivateRoute);

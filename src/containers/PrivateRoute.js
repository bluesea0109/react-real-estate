import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';

import Loading from '../components/Loading';

const PrivateRoute = ({ component: Component, path, user, ...rest }) => {
  let history = useHistory();

  useEffect(() => {
    const fn = async () => {
      if (!user) await history.push('/');
    };
    fn();
  }, [user, history]);

  const render = props => (user && user.authenticated === true ? <Component {...props} /> : <Loading />);

  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(PrivateRoute);
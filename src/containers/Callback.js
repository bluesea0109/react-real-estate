import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { authenticate } from '../store/modules/auth0/actions';
import Loading from '../components/Loading';

const mapStateToProps = state => {
  return {
    auth0: state.auth0,
  };
};

let Callback = ({ dispatch, auth0 }) => {
  if (auth0.authenticated) return <Redirect to="/dashboard" />;

  if (!auth0.pending) dispatch(authenticate());

  return <Loading />;
};
Callback = connect(mapStateToProps)(Callback);

export default Callback;

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { handleAuthenticationCallback } from '../store/actions';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

let Callback = ({ dispatch, user }) => {
  if (user) return <Redirect to="/dashboard" />;
  dispatch(handleAuthenticationCallback());

  return <div className="text-center">Loading user profile...</div>;
};
Callback = connect(mapStateToProps)(Callback);

export default Callback;

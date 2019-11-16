import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import AuthService from '../services/auth';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

let IndexPage = ({ user }) => {
  if (user && user.authenticated) return <Redirect to="/dashboard" />;

  return <div>{AuthService.signIn()}</div>;
};
IndexPage = connect(mapStateToProps)(IndexPage);

export default IndexPage;

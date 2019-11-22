import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import AuthService from '../services/auth';

const mapStateToProps = state => {
  return {
    auth0: state.auth0,
  };
};

let IndexPage = ({ auth0 }) => {
  if (auth0.authenticated) return <Redirect to="/dashboard" />;

  return <div>{AuthService.signIn()}</div>;
};
IndexPage = connect(mapStateToProps)(IndexPage);

export default IndexPage;

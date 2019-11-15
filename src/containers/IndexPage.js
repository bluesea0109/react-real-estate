import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { signIn } from '../services/Auth0';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

let IndexPage = ({ user }) => {
  if (user) return <Redirect to="/dashboard" />;

  return <div>{signIn()}</div>;
};
IndexPage = connect(mapStateToProps)(IndexPage);

export default IndexPage;

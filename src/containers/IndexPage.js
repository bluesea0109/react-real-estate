import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import AuthService from '../services/auth';

const IndexPage = () => {
  const auth0 = useSelector(store => store.auth0);

  if (auth0.authenticated) return <Redirect to="/dashboard" />;

  return <div>{AuthService.signIn()}</div>;
};

export default IndexPage;

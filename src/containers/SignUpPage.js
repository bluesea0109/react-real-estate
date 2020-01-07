import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import AuthService from '../services/auth';

const SignUpPage = () => {
  const auth0 = useSelector(store => store.auth0);

  if (auth0.authenticated) return <Redirect to="/dashboard" />;

  return <div>{AuthService.signUp()}</div>;
};

export default SignUpPage;

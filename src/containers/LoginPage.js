import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useDispatch } from 'react-redux';

import { cookieAuthentication } from '../store/modules/auth0/actions';
import AuthService from '../services/auth';

const LoginPage = () => {
  const [cookie] = useState(Cookies.get('idToken'));
  const dispatch = useDispatch();

  if (cookie) {
    AuthService.cookieLogin(cookie);
    dispatch(cookieAuthentication(cookie));

    return <Redirect to="/dashboard" />;
  } else {
    return <Redirect to="/" />;
  }
};

export default LoginPage;

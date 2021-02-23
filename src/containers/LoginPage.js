import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useDispatch } from 'react-redux';
import { cookieAuthentication } from '../store/modules/auth0/actions';
import AuthService from '../services/auth';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [cookie] = useState(Cookies.get('idToken'));

  if (cookie) {
    AuthService.cookieLogin(cookie);
    dispatch(cookieAuthentication(cookie));
    localStorage.setItem('localToken', cookie);
    return <Redirect to="/dashboard" />;
  } else {
    return <Redirect to="/" />;
  }
};

export default LoginPage;

import React from 'react';
import { Redirect, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { authenticate } from '../store/modules/auth0/actions';
import Loading from '../components/Loading';

const EmailVerifiedPage = () => {
  const dispatch = useDispatch();
  const { supportSignUp, supportForgotPassword, email, message, success, code } = useParams();

  console.log('EmailVerifiedPage');
  console.log('supportSignUp        : ', supportSignUp);
  console.log('supportForgotPassword: ', supportForgotPassword);
  console.log('email                : ', email);
  console.log('message              : ', message);
  console.log('success              : ', success);
  console.log('code                 : ', code);

  const auth0 = useSelector(store => store.auth0);

  if (auth0.authenticated) {
    console.log('EmailVerifiedPage auth0.authenticated redirect');
    return <Redirect to="/dashboard" />;
  }

  if (!auth0.pending) {
    console.log('EmailVerifiedPage !auth0.pending dispatch');
    dispatch(authenticate());
  }

  return <Loading />;
};

export default EmailVerifiedPage;

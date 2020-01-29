import React from 'react';
import { Redirect } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { authenticate } from '../store/modules/auth0/actions';
import Loading from '../components/Loading';

const CallbackPage = () => {
  const dispatch = useDispatch();
  const auth0 = useSelector(store => store.auth0);

  if (auth0.authenticated) return <Redirect to="/dashboard" />;

  if (!auth0.pending && !auth0.error) dispatch(authenticate());

  return <Loading />;
};

export default CallbackPage;

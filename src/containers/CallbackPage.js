import React from 'react';
import { Redirect } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { authenticate } from '../store/modules/auth0/actions';
import { Message, Segment } from '../components/Base';
import Loading from '../components/Loading';

const CallbackPage = () => {
  const dispatch = useDispatch();
  const auth0 = useSelector(store => store.auth0);

  if (auth0.authenticated) return <Redirect to="/dashboard" />;

  if (!auth0.pending && !auth0.error) dispatch(authenticate());

  if (!auth0.pending && auth0.error) {
    return (
      <Segment basic>
        <Message>
          <Message.Header>Error: {auth0.error.message || auth0.error.error}</Message.Header>
          <p>The authentication process has failed, please contact the Brivity Marketer Technical Support to resolve this issue!</p>
          <pre>{JSON.stringify(auth0.error)}</pre>
        </Message>
      </Segment>
    );
  }

  return <Loading />;
};

export default CallbackPage;

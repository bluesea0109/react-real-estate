import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import { Page, Segment } from '../components/Base';
import Loading from '../components/Loading';

const CustomizationTeamPage = () => {
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const peerSelected = useSelector(store => store.peer.peerId);
  const isLoading = useSelector(store => store.onLogin.pending);

  if (isLoading) return <Loading />;

  if (isAdmin && peerSelected) {
    return <Redirect to="/customization" />;
  }

  if (!isAdmin) {
    return <Redirect to="/customization" />;
  }

  return (
    <Page basic>
      <Segment>
        <h1>Customization Team Page</h1>
      </Segment>
    </Page>
  );
};

export default CustomizationTeamPage;

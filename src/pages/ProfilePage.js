import React from 'react';
import { useSelector } from 'react-redux';

import { Page, Segment } from '../components/Base';

const ProfilePage = () => {
  const peerId = useSelector(store => store.peer.peerId);

  return (
    <Page basic>
      <Segment>
        <h1>Profile Page</h1>
        <h2>{peerId ? 'Peer profile go here' : 'Logged in user profile go here'}</h2>
      </Segment>
    </Page>
  );
};

export default ProfilePage;

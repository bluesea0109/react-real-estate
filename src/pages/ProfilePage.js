import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import { getProfilePending } from '../store/modules/profile/actions';
import { getTeamProfilePending } from '../store/modules/teamProfile/actions';
import { Page, Segment } from '../components/Base';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [currentPeerState, setCurrentPeerState] = useState(null);

  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const profileAvailable = useSelector(store => store.profile.available);
  const teamProfileAvailable = useSelector(store => store.teamProfile.available);
  const peerId = useSelector(store => store.peer.peerId);

  useEffect(() => {
    if (currentPeerState !== peerId) {
      setCurrentPeerState(peerId);
      dispatch(getProfilePending());
      if (isAdmin) dispatch(getTeamProfilePending());
    }
  }, [isAdmin, dispatch, peerId, currentPeerState, setCurrentPeerState]);

  useEffect(() => {
    dispatch(getProfilePending());
    if (isAdmin) dispatch(getTeamProfilePending());
  }, [isAdmin, dispatch]);

  return (
    <Page basic>
      <Segment>
        <h1>Profile Page</h1>
        <h2>{peerId ? 'Peer profile go here' : 'Logged in user profile go here'}</h2>
        <pre>{JSON.stringify(profileAvailable, 0, 2)}</pre>
        {isAdmin && (
          <div>
            <h2>As an Admin, you always have access to team profile</h2>
            <pre>{JSON.stringify(teamProfileAvailable, 0, 2)}</pre>
          </div>
        )}
      </Segment>
    </Page>
  );
};

export default ProfilePage;

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Page, Segment } from '../components/Base';
import { getUserSettingsPending, getPeerSettingsPending } from '../store/modules/settings/actions';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const peerId = useSelector(store => store.peer.peerId);
  const currentSettings = useSelector(store => store.settings);

  useEffect(() => {
    peerId ? dispatch(getPeerSettingsPending()) : dispatch(getUserSettingsPending());
  }, [peerId, dispatch]);

  const str = JSON.stringify(currentSettings, undefined, 4);

  return (
    <Page basic>
      <Segment>
        <h1>Settings Page</h1>
        <h2>{peerId ? 'Peer settings go here' : 'Logged in user settings go here'}</h2>
        <pre>{str}</pre>
      </Segment>
    </Page>
  );
};

export default SettingsPage;

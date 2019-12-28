import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCustomizationPending } from '../store/modules/customization/actions';
import NewCustomizeForm from '../components/Forms/NewCustomizeForm';
import { Page, Segment } from '../components/Base';

const CustomizationPage = () => {
  const dispatch = useDispatch();
  const [currentPeerState, setCurrentPeerState] = useState(null);
  const customizationError = useSelector(store => store.customization.error);
  const customizationAvailable = useSelector(store => store.customization.available);
  const peerId = useSelector(store => store.peer.peerId);

  useEffect(() => {
    if (currentPeerState !== peerId) {
      setCurrentPeerState(peerId);
      dispatch(getCustomizationPending());
    }
  }, [dispatch, peerId, currentPeerState, setCurrentPeerState]);

  useEffect(() => {
    dispatch(getCustomizationPending());
  }, [dispatch]);

  return (
    <Page basic>
      <Segment basic>
        <h2>{peerId ? 'Peer profile go here' : 'Logged in user profile go here'}</h2>
        {customizationAvailable && <pre>{JSON.stringify(customizationAvailable, 0, 2)}</pre>}
        {customizationError && <pre>{JSON.stringify(customizationError, 0, 2)}</pre>}
        <NewCustomizeForm />
      </Segment>
    </Page>
  );
};

export default CustomizationPage;

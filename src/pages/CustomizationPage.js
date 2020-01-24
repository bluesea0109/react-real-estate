import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCustomizationPending } from '../store/modules/customization/actions';
import NewCustomizeForm from '../components/Forms/NewCustomizeForm';
import { Message } from '../components/Base';
import Loading from '../components/Loading';

const CustomizationPage = () => {
  const dispatch = useDispatch();
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const singleuser = onLoginMode === 'singleuser';

  const customizationPending = useSelector(store => store.customization.pending);
  const customizationError = useSelector(store => store.customization.error && store.customization.error.message);
  const customizationAvailable = useSelector(store => store.customization.available);

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error && store.teamCustomization.error.message);
  const teamCustomizationAvailable = useSelector(store => store.teamCustomization.available);

  const peerId = useSelector(store => store.peer.peerId);

  const [currentPeerState, setCurrentPeerState] = useState(null);

  useEffect(() => {
    if (currentPeerState !== peerId) {
      setCurrentPeerState(peerId);
      dispatch(getCustomizationPending());
    }
  }, [dispatch, peerId, currentPeerState, setCurrentPeerState]);

  useEffect(() => {
    dispatch(getCustomizationPending());
  }, [dispatch]);

  if (singleuser) {
    return (
      <Fragment>
        {!customizationError && <NewCustomizeForm customizationData={customizationAvailable} />}
        {customizationPending && !customizationError && <Loading />}
        {customizationError && <Message error>Oh snap! {customizationError}.</Message>}
      </Fragment>
    );
  }

  if (multiUser) {
    return (
      <Fragment>
        {!teamCustomizationError && <NewCustomizeForm customizationData={customizationAvailable || {}} teamCustomizationData={teamCustomizationAvailable} />}
        {customizationPending && !customizationError && teamCustomizationPending && !teamCustomizationError && <Loading />}
        {teamCustomizationError && <Message error>Oh snap! {teamCustomizationError}.</Message>}
      </Fragment>
    );
  }
};

export default CustomizationPage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCustomizationPending } from '../store/modules/customization/actions';
import CustomizeForm from '../components/Forms/CustomizeForm';
import { initialValues } from '../components/utils/helpers';
import { ContentTopHeaderLayout } from '../layouts';
import { Message, Page } from '../components/Base';
import Loading from '../components/Loading';

const CustomizationPage = () => {
  const dispatch = useDispatch();
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';
  const singleuser = onLoginMode === 'singleuser';

  const customizationPending = useSelector(store => store.customization.pending);
  const customizationError = useSelector(store => store.customization.error?.message);
  const customizationAvailable = useSelector(store => store.customization.available);

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error?.message);
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
    if (customizationPending && !customizationError) {
      return (
        <Page basic>
          <ContentTopHeaderLayout>
            <Loading />
          </ContentTopHeaderLayout>
        </Page>
      );
    } else {
      if (!customizationError) return <CustomizeForm customizationData={customizationAvailable} initialValues={initialValues} />;
      if (customizationError) return <Message error>Oh snap! {customizationError}.</Message>;
    }
  }

  if (multiUser) {
    if (customizationPending && !customizationError && teamCustomizationPending && !teamCustomizationError) {
      return (
        <Page basic>
          <ContentTopHeaderLayout>
            <Loading />
          </ContentTopHeaderLayout>
        </Page>
      );
    } else {
      if (!teamCustomizationError)
        return <CustomizeForm customizationData={customizationAvailable} initialValues={teamCustomizationAvailable || initialValues} />;
      if (teamCustomizationError) return <Message error>Oh snap! {teamCustomizationError}.</Message>;
    }
  }
};

export default CustomizationPage;

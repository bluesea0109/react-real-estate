import { Redirect } from 'react-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTeamCustomizationPending } from '../store/modules/teamCustomization/actions';
import NewTeamCustomizeForm from '../components/Forms/NewTeamCustomizeForm';
import { Message, Page } from '../components/Base';
import Loading from '../components/Loading';

const CustomizationTeamPage = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const peerId = useSelector(store => store.peer.peerId);

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error);
  const teamCustomizationAvailable = useSelector(store => store.teamCustomization.available);

  useEffect(() => {
    dispatch(getTeamCustomizationPending());
  }, [dispatch]);

  if (isAdmin && peerId) {
    return <Redirect to="/customization" />;
  }

  if (!isAdmin) {
    return <Redirect to="/customization" />;
  }

  return (
    <Page basic>
      {!teamCustomizationError && <NewTeamCustomizeForm teamCustomizationData={teamCustomizationAvailable} />}
      {teamCustomizationPending && !teamCustomizationError && <Loading />}
      {teamCustomizationError && <Message error>Oh snap! {teamCustomizationError}.</Message>}
    </Page>
  );
};

export default CustomizationTeamPage;

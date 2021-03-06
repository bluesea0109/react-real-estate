import { Redirect } from 'react-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTeamCustomizationPending } from '../store/modules/teamCustomization/actions';
import TeamCustomizeForm from '../components/Forms/TeamCustomizeForm';
import { initialValues } from '../components/utils/helpers';
import { ContentTopHeaderLayout } from '../layouts';
import { Message, Page } from '../components/Base';
import Loading from '../components/Loading';

const CustomizationTeamPage = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const peerId = useSelector(store => store.peer.peerId);

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error?.message);
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

  if (teamCustomizationPending && !teamCustomizationError) {
    return (
      <Page basic>
        <ContentTopHeaderLayout>
          <Loading />
        </ContentTopHeaderLayout>
      </Page>
    );
  } else {
    if (!teamCustomizationError)
      return (
        <TeamCustomizeForm
          teamCustomizationData={teamCustomizationAvailable}
          initialValues={initialValues}
        />
      );
    if (teamCustomizationError) return <Message error>Oh snap! {teamCustomizationError}.</Message>;
  }
};

export default CustomizationTeamPage;

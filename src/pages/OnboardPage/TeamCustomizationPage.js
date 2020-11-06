import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTeamCustomizationPending } from '../../store/modules/teamCustomization/actions';
import TeamCustomizeForm from '../../components/Forms/Onboard/TeamCustomizeForm';
import { initialValues } from '../../components/utils/helpers';
import { ContentTopHeaderLayout } from '../../layouts';
import Loading from '../../components/Loading';
import { Page } from '../../components/Base';

const TeamCustomizationPage = () => {
  const dispatch = useDispatch();

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error?.message);
  const teamCustomizationAvailable = useSelector(store => store.teamCustomization.available);

  useEffect(() => {
    dispatch(getTeamCustomizationPending());
  }, [dispatch]);

  if (teamCustomizationPending && !teamCustomizationError) {
    return (
      <Page basic>
        <ContentTopHeaderLayout>
          <Loading />
        </ContentTopHeaderLayout>
      </Page>
    );
  } else {
    return <TeamCustomizeForm teamCustomizationData={teamCustomizationAvailable} initialValues={initialValues} />;
  }
};

export default TeamCustomizationPage;

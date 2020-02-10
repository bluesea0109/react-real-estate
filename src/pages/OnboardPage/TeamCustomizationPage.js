import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTeamCustomizationPending } from '../../store/modules/teamCustomization/actions';
import TeamCustomizeForm from '../../components/Forms/Onboard/TeamCustomizeForm';
import { ContentTopHeaderLayout } from '../../layouts';
import Loading from '../../components/Loading';
import { Page } from '../../components/Base';
import { colors } from '../../components/Forms/Onboard/helpers';

const initialValues = {
  listed: {
    createMailoutsOfThisType: true,
    defaultDisplayAgent: {
      userId: null,
      first: null,
      last: null,
    },
    mailoutSize: 300,
    mailoutSizeMin: 100,
    mailoutSizeMax: 1000,
    templateTheme: 'bookmark',
    brandColor: colors[0],
    frontHeadline: 'Just Listed!',
    cta: '',
    shortenCTA: false,
    kwkly: 'Text KEYWORD to 59559 for details!',
  },
  sold: {
    createMailoutsOfThisType: true,
    defaultDisplayAgent: {
      userId: null,
      first: null,
      last: null,
    },
    mailoutSize: 300,
    mailoutSizeMin: 100,
    mailoutSizeMax: 1000,
    templateTheme: 'bookmark',
    brandColor: colors[0],
    frontHeadline: 'Just Sold!',
    cta: '',
    shortenCTA: false,
    kwkly: 'Text KEYWORD to 59559 for details!',
  },
};

const TeamCustomizationPage = () => {
  const dispatch = useDispatch();

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error && store.teamCustomization.error.message);
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
    const patchedTeamCustomizationAvailable = teamCustomizationAvailable;
    if (patchedTeamCustomizationAvailable && !patchedTeamCustomizationAvailable.listed.kwkly)
      patchedTeamCustomizationAvailable.listed.kwkly = 'Text KEYWORD to 59559 for details!';
    if (patchedTeamCustomizationAvailable && !patchedTeamCustomizationAvailable.sold.kwkly)
      patchedTeamCustomizationAvailable.sold.kwkly = 'Text KEYWORD to 59559 for details!';

    return <TeamCustomizeForm teamCustomizationData={patchedTeamCustomizationAvailable || initialValues} initialRun={!teamCustomizationAvailable} />;
  }
};

export default TeamCustomizationPage;

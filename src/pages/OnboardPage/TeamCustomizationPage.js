import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTeamCustomizationPending } from '../../store/modules/teamCustomization/actions';
import TeamCustomizeForm from '../../components/Forms/Onboard/TeamCustomizeForm';
import { ContentTopHeaderLayout } from '../../layouts';
import { colors } from '../../components/helpers';
import Loading from '../../components/Loading';
import { Page } from '../../components/Base';

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
    kwkly: 'KEYWORD',
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
    kwkly: 'KEYWORD',
  },
};

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
    const patchedTeamCustomizationAvailable = teamCustomizationAvailable ? Object.assign({}, teamCustomizationAvailable) : null;

    if (patchedTeamCustomizationAvailable) {
      if (patchedTeamCustomizationAvailable.sold.kwkly) {
        if (patchedTeamCustomizationAvailable.sold.kwkly.includes('to 59559 for details!')) {
          patchedTeamCustomizationAvailable.sold.kwkly = patchedTeamCustomizationAvailable.sold.kwkly.split(' ')[1];
        }
      }

      if (patchedTeamCustomizationAvailable.listed.kwkly) {
        if (patchedTeamCustomizationAvailable.listed.kwkly.includes('to 59559 for details!')) {
          patchedTeamCustomizationAvailable.listed.kwkly = patchedTeamCustomizationAvailable.listed.kwkly.split(' ')[1];
        }
      }

      if (!patchedTeamCustomizationAvailable.listed.kwkly) {
        patchedTeamCustomizationAvailable.listed.kwkly = 'KEYWORD';
      }

      if (!patchedTeamCustomizationAvailable.sold.kwkly) {
        patchedTeamCustomizationAvailable.sold.kwkly = 'KEYWORD';
      }
    }

    return <TeamCustomizeForm teamCustomizationData={patchedTeamCustomizationAvailable || initialValues} initialRun={!teamCustomizationAvailable} />;
  }
};

export default TeamCustomizationPage;

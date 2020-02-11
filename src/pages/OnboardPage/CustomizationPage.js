import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCustomizationPending } from '../../store/modules/customization/actions';
import CustomizeForm from '../../components/Forms/Onboard/CustomizeForm';
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
      const patchedCustomizationAvailable = customizationAvailable;
      if (patchedCustomizationAvailable && !patchedCustomizationAvailable.listed.kwkly)
        patchedCustomizationAvailable.listed.kwkly = 'Text KEYWORD to 59559 for details!';
      if (patchedCustomizationAvailable && !patchedCustomizationAvailable.sold.kwkly)
        patchedCustomizationAvailable.sold.kwkly = 'Text KEYWORD to 59559 for details!';

      return <CustomizeForm customizationData={patchedCustomizationAvailable || initialValues} />;
    }
  }

  if (multiUser) {
    if ((customizationPending && !customizationError) || (teamCustomizationPending && !teamCustomizationError)) {
      return (
        <Page basic>
          <ContentTopHeaderLayout>
            <Loading />
          </ContentTopHeaderLayout>
        </Page>
      );
    } else {
      const patchedCustomizationAvailable = customizationAvailable;
      if (patchedCustomizationAvailable && !patchedCustomizationAvailable.listed.kwkly) {
        patchedCustomizationAvailable.listed.kwkly = 'Text KEYWORD to 59559 for details!';
      }
      if (patchedCustomizationAvailable && !patchedCustomizationAvailable.sold.kwkly) {
        patchedCustomizationAvailable.sold.kwkly = 'Text KEYWORD to 59559 for details!';
      }

      const patchedTeamCustomizationAvailable = teamCustomizationAvailable;
      if (patchedTeamCustomizationAvailable && !patchedTeamCustomizationAvailable.listed.kwkly) {
        patchedTeamCustomizationAvailable.listed.kwkly = 'Text KEYWORD to 59559 for details!';
      }
      if (patchedTeamCustomizationAvailable && !patchedTeamCustomizationAvailable.sold.kwkly) {
        patchedTeamCustomizationAvailable.sold.kwkly = 'Text KEYWORD to 59559 for details!';
      }

      return (
        <CustomizeForm
          customizationData={patchedCustomizationAvailable || patchedTeamCustomizationAvailable || initialValues}
          teamCustomizationData={teamCustomizationAvailable}
        />
      );
    }
  }
};

export default CustomizationPage;

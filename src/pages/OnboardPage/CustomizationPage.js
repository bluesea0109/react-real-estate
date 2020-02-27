import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCustomizationPending } from '../../store/modules/customization/actions';
import CustomizeForm from '../../components/Forms/Onboard/CustomizeForm';
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

const CustomizationPage = () => {
  const dispatch = useDispatch();
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const singleuser = onLoginMode === 'singleuser';

  const customizationPending = useSelector(store => store.customization.pending);
  const customizationError = useSelector(store => store.customization.error?.message);
  const customizationAvailable = useSelector(store => store.customization.available);

  const teamCustomizationPending = useSelector(store => store.teamCustomization.pending);
  const teamCustomizationError = useSelector(store => store.teamCustomization.error?.message);
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
      const patchedCustomizationAvailable = customizationAvailable ? Object.assign({}, customizationAvailable) : null;

      if (patchedCustomizationAvailable) {
        if (patchedCustomizationAvailable.sold.kwkly) {
          if (patchedCustomizationAvailable.sold.kwkly.includes('to 59559 for details!')) {
            patchedCustomizationAvailable.sold.kwkly = patchedCustomizationAvailable.sold.kwkly.split(' ')[1];
          }
        }

        if (patchedCustomizationAvailable.listed.kwkly) {
          if (patchedCustomizationAvailable.listed.kwkly.includes('to 59559 for details!')) {
            patchedCustomizationAvailable.listed.kwkly = patchedCustomizationAvailable.listed.kwkly.split(' ')[1];
          }
        }

        if (!patchedCustomizationAvailable.listed.kwkly) {
          patchedCustomizationAvailable.listed.kwkly = 'KEYWORD';
        }

        if (!patchedCustomizationAvailable.sold.kwkly) {
          patchedCustomizationAvailable.sold.kwkly = 'KEYWORD';
        }
      }

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
      const patchedCustomizationAvailable = customizationAvailable ? Object.assign({}, customizationAvailable) : null;

      if (patchedCustomizationAvailable) {
        if (patchedCustomizationAvailable.sold.kwkly) {
          if (patchedCustomizationAvailable.sold.kwkly.includes('to 59559 for details!')) {
            patchedCustomizationAvailable.sold.kwkly = patchedCustomizationAvailable.sold.kwkly.split(' ')[1];
          }
        }

        if (patchedCustomizationAvailable.listed.kwkly) {
          if (patchedCustomizationAvailable.listed.kwkly.includes('to 59559 for details!')) {
            patchedCustomizationAvailable.listed.kwkly = patchedCustomizationAvailable.listed.kwkly.split(' ')[1];
          }
        }

        if (!patchedCustomizationAvailable.listed.kwkly) {
          patchedCustomizationAvailable.listed.kwkly = 'KEYWORD';
        }

        if (!patchedCustomizationAvailable.sold.kwkly) {
          patchedCustomizationAvailable.sold.kwkly = 'KEYWORD';
        }
      }

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

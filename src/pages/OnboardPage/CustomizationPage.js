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
      userId: '',
      first: '',
      last: '',
    },
    mailoutSize: 300,
    mailoutSizeMin: 100,
    mailoutSizeMax: 1000,
    templateTheme: 'bookmark',
    brandColor: colors[0],
    frontHeadline: 'Just Listed!',
    cta: '',
    shortenCTA: true,
    kwkly: 'KEYWORD',
  },
  sold: {
    createMailoutsOfThisType: true,
    defaultDisplayAgent: {
      userId: '',
      first: '',
      last: '',
    },
    mailoutSize: 300,
    mailoutSizeMin: 100,
    mailoutSizeMax: 1000,
    templateTheme: 'bookmark',
    brandColor: colors[0],
    frontHeadline: 'Just Sold!',
    cta: '',
    shortenCTA: true,
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
      return <CustomizeForm customizationData={customizationAvailable} initialValues={initialValues} />;
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
      return <CustomizeForm customizationData={customizationAvailable} initialValues={teamCustomizationAvailable || initialValues} />;
    }
  }
};

export default CustomizationPage;

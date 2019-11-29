import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Header, Menu, /*Message,*/ Page, Segment } from '../components/Base';
import { incrementStep, setOnboardedStatus } from '../store/modules/onboarded/actions';
import Loading from '../components/Loading';

import ProfileForm from '../components/Forms/ProfileForm';
// import CustomizeNewListingForm from '../components/Forms/CustomizeNewListingForm';
// import CustomizeSoldListingForm from '../components/Forms/CustomizeSoldListingForm';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [listingNewOrSold, setListingNewOrSold] = useState('new');
  const step = useSelector(store => store.onboarded.step);
  const profileSuppliedOnLogin = useSelector(store => store.onLogin && store.onLogin.userProfile);
  const profileAvailable = useSelector(store => store.profile && store.profile.available);
  const isLoadingOnLogin = useSelector(store => store.onLogin && store.profile.pending);
  const isLoadingProfile = useSelector(store => store.profile && store.profile.pending);

  useEffect(() => {
    if (profileAvailable || profileSuppliedOnLogin) {
      if (step <= 1) {
        dispatch(incrementStep(1));
      }
    }

    if (step === 3) {
      dispatch(setOnboardedStatus(true));
      history.push('/dashboard');
    }
  }, [step, profileAvailable, profileSuppliedOnLogin, dispatch, history]);

  const handleListingToggle = (e, { name }) => setListingNewOrSold(name);

  const renderFillInYourProfile = () => {
    if (isLoadingOnLogin || isLoadingProfile) return Loading;

    return (
      <Segment basic>
        <ProfileForm />
      </Segment>
    );
  };

  const renderCustomize = () => {
    return (
      <Segment>
        <Header as="h1">Customize</Header>
        <Menu pointing secondary>
          <Menu.Item name="new" active={listingNewOrSold === 'new'} onClick={handleListingToggle} />
          <Menu.Item name="sold" active={listingNewOrSold === 'sold'} onClick={handleListingToggle} />
        </Menu>

        {/*{listingNewOrSold === 'new' && (*/}
        {/*  <Segment>*/}
        {/*    <CustomizeNewListingForm onSubmit={() => console.log('CustomizeNewListingForm was submitted')} />*/}
        {/*    <Message>*/}
        {/*      <Message.Header>Form data:</Message.Header>*/}
        {/*      <pre>{JSON.stringify(newListingFormValues, null, 2)}</pre>*/}
        {/*      Submit Succeeded: <pre>{JSON.stringify(newListingFormSubmitSucceeded, null, 2)}</pre>*/}
        {/*    </Message>*/}
        {/*  </Segment>*/}
        {/*)}*/}
        {/*{listingNewOrSold === 'sold' && (*/}
        {/*  <Segment>*/}
        {/*    <CustomizeSoldListingForm onSubmit={() => console.log('CustomizeSoldListingForm was submitted')} />*/}
        {/*    <Message>*/}
        {/*      <Message.Header>Form data:</Message.Header>*/}
        {/*      <pre>{JSON.stringify(soldListingFormValues, null, 2)}</pre>*/}
        {/*      Submit Succeeded: <pre>{JSON.stringify(soldListingFormSubmitSucceeded, null, 2)}</pre>*/}
        {/*    </Message>*/}
        {/*  </Segment>*/}
        {/*)}*/}

        <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
      </Segment>
    );
  };

  const renderAutomationAndBilling = () => {
    return (
      <Segment>
        <Header as="h1">Automation & Billing</Header>
        <Button onClick={() => dispatch(incrementStep(3))}>Stage 3 Completed</Button>
      </Segment>
    );
  };

  return (
    <Page basic>
      {step === 0 && renderFillInYourProfile()}
      {step === 1 && renderCustomize()}
      {step === 2 && renderAutomationAndBilling()}
    </Page>
  );
};

export default OnboardPage;

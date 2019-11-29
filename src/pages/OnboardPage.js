import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Header, Menu, /*Message,*/ Page, Segment } from '../components/Base';
import { incrementStep, setOnboardedStatus } from '../store/modules/onboarded/actions';

import ProfileForm from '../components/Forms/ProfileForm';
// import CustomizeNewListingForm from '../components/Forms/CustomizeNewListingForm';
// import CustomizeSoldListingForm from '../components/Forms/CustomizeSoldListingForm';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [listingNewOrSold, setListingNewOrSold] = useState('new');
  const step = useSelector(store => store.onboarded.step);

  // const profileFormValues = useSelector(store => store.form.profile && store.form.profile.values);
  // const profileFormSubmitSucceeded = useSelector(store => store.form.profile && store.form.profile.submitSucceeded);
  // const newListingFormValues = useSelector(store => store.form.customizeNewListing && store.form.customizeNewListing.values);
  // const newListingFormSubmitSucceeded = useSelector(store => store.form.customizeNewListing && store.form.customizeNewListing.submitSucceeded);
  // const soldListingFormValues = useSelector(store => store.form.customizeSoldListing && store.form.customizeSoldListing.values);
  // const soldListingFormSubmitSucceeded = useSelector(store => store.form.customizeSoldListing && store.form.customizeSoldListing.submitSucceeded);

  useEffect(() => {
    if (step === 3) {
      dispatch(setOnboardedStatus(true));
      history.push('/dashboard');
    }
  }, [step, dispatch, history]);

  const handleListingToggle = (e, { name }) => setListingNewOrSold(name);

  const renderFillInYourProfile = () => {
    return (
      <Segment basic>
        <ProfileForm onSubmit={() => console.log('ProfileForm was submitted')} validate={() => console.log('Validate ProfileForm')} />

        <Button onClick={() => dispatch(incrementStep(1))}>Stage 1 Completed</Button>
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

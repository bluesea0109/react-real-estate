import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Header, Menu, Message, Page, Segment } from '../components/Base';
import { incrementStep, setOnboardedStatus } from '../store/modules/onboarded/actions';

import CustomizeNewListingForm from '../components/Forms/CustomizeNewListingForm';
import CustomizeSoldListingForm from '../components/Forms/CustomizeSoldListingForm';

const OnboardPage = props => {
  const { newListingFormValues, newListingFormSubmitSucceeded, soldListingFormValues, soldListingFormSubmitSucceeded } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const [listingNewOrSold, setListingNewOrSold] = useState('new');
  const step = useSelector(store => store.onboarded.step);

  useEffect(() => {
    if (step === 3) {
      dispatch(setOnboardedStatus(true));
      history.push('/dashboard');
    }
  }, [step, dispatch, history]);

  const handleListingToggle = (e, { name }) => setListingNewOrSold(name);

  const renderFillInYourProfile = () => {
    return (
      <Segment>
        <Header as="h1">Profile</Header>
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

        {listingNewOrSold === 'new' && (
          <Segment>
            <CustomizeNewListingForm onSubmit={() => console.log('CustomizeNewListingForm was submitted')} />
            <Message>
              <Message.Header>Form data:</Message.Header>
              <pre>{JSON.stringify(newListingFormValues, null, 2)}</pre>
            </Message>
          </Segment>
        )}
        {listingNewOrSold === 'sold' && (
          <Segment>
            <CustomizeSoldListingForm onSubmit={() => console.log('CustomizeSoldListingForm was submitted')} />
            <Message>
              <Message.Header>Form data:</Message.Header>
              <pre>{JSON.stringify(soldListingFormValues, null, 2)}</pre>
            </Message>
          </Segment>
        )}

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

export default connect(
  state => ({
    newListingFormValues: state.form.customizeNewListing ? state.form.customizeNewListing.values : {},
    newListingFormSubmitSucceeded: state.form.customizeNewListing ? state.form.customizeNewListing.submitSucceeded : {},
    soldListingFormValues: state.form.customizeSoldListing ? state.form.customizeSoldListing.values : {},
    soldListingFormSubmitSucceeded: state.form.customizeSoldListing ? state.form.customizeSoldListing.submitSucceeded : {},
  }),
  dispatch => ({})
)(OnboardPage);

/*
state.form.customizeNewListing
    ? {
        values: state.form.customizeNewListing.values,
        submitSucceeded: state.form.customizeNewListing.submitSucceeded,
      }
    : state.form.customizeSoldListing
    ? {
      values: state.form.customizeSoldListing.values,
      submitSucceeded: state.form.customizeSoldListing.submitSucceeded,
    }
    : {}
 */

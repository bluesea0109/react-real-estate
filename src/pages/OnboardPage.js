import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Header, Page, Segment } from '../components/Base';
import { incrementStep, setOnboardedStatus } from '../store/modules/onboarded/actions';

const OnboardPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const step = useSelector(store => store.onboarded.step);

  useEffect(() => {
    if (step === 3) {
      dispatch(setOnboardedStatus(true));
      history.push('/dashboard');
    }
  }, [step, dispatch, history]);

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

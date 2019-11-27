import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Page, Segment } from '../components/Base';
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

  return (
    <Page basic>
      <Segment>
        <h1>Onboarding Page</h1>
        <Button onClick={() => dispatch(incrementStep(1))}>Stage 1 Completed</Button>
        <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
        <Button onClick={() => dispatch(incrementStep(3))}>Stage 3 Completed</Button>
      </Segment>
    </Page>
  );
};

export default OnboardPage;

import React from 'react';
import { useDispatch } from 'react-redux';

import { incrementStep } from '../../store/modules/onboarded/actions';
import { Button, Page, Segment } from '../../components/Base';
import ProfileForm from '../../components/Forms/ProfileForm';

const OnboardPage = () => {
  const dispatch = useDispatch();

  return (
    <Page basic>
      <Segment basic>
        <ProfileForm />

        <Button onClick={() => dispatch(incrementStep(1))}>Stage 1 Completed</Button>
      </Segment>
    </Page>
  );
};

export default OnboardPage;

import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Header, Page, Segment } from '../../components/Base';
import { incrementStep } from '../../store/modules/onboarded/actions';

const OnboardPage = () => {
  const dispatch = useDispatch();

  return (
    <Page basic>
      <Segment>
        <Header as="h1">Invite Teammates</Header>
        <Button onClick={() => dispatch(incrementStep(4))}>Stage 4 Completed</Button>
      </Segment>
    </Page>
  );
};

export default OnboardPage;

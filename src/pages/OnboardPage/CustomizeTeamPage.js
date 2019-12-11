import React from 'react';
import { useDispatch } from 'react-redux';

import { incrementStep } from '../../store/modules/onboarded/actions';
import CustomizeForm from '../../components/Forms/CustomizeForm';
import { Button, Page, Segment } from '../../components/Base';

const CustomizeTeamPage = () => {
  const dispatch = useDispatch();

  return (
    <Page basic>
      <Segment basic>
        <CustomizeForm />

        <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
      </Segment>
    </Page>
  );
};

export default CustomizeTeamPage;

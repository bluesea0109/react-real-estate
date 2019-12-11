import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { incrementStep } from '../../store/modules/onboarded/actions';
import CustomizeForm from '../../components/Forms/CustomizeForm';
import { Button, Page, Segment } from '../../components/Base';

const CustomizePage = () => {
  const dispatch = useDispatch();
  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');

  return (
    <Page basic>
      <Segment basic>
        <CustomizeForm />

        {isMultimode ? (
          <Button onClick={() => dispatch(incrementStep(3))}>Stage 3 Completed</Button>
        ) : (
          <Button onClick={() => dispatch(incrementStep(2))}>Stage 2 Completed</Button>
        )}
      </Segment>
    </Page>
  );
};

export default CustomizePage;

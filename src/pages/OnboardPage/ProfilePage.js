import React from 'react';

import { Page, Segment } from '../../components/Base';
import ProfileForm from '../../components/Forms/ProfileForm';

const OnboardPage = () => {
  return (
    <Page basic>
      <Segment basic>
        <ProfileForm />
      </Segment>
    </Page>
  );
};

export default OnboardPage;

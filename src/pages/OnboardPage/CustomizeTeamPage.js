import React from 'react';

import CustomizeTeamForm from '../../components/Forms/CustomizeTeamForm';
import { Page, Segment } from '../../components/Base';

const CustomizeTeamPage = () => {
  return (
    <Page basic>
      <Segment basic>
        <CustomizeTeamForm />
      </Segment>
    </Page>
  );
};

export default CustomizeTeamPage;

import React from 'react';

import CustomizeForm from '../../components/Forms/CustomizeForm';
import { Page, Segment } from '../../components/Base';

const CustomizePage = () => {
  return (
    <Page basic>
      <Segment basic>
        <CustomizeForm />
      </Segment>
    </Page>
  );
};

export default CustomizePage;

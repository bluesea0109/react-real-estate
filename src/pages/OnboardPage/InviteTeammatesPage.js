import React from 'react';

import InviteTeammatesForm from '../../components/Forms/InviteTeammatesForm';
import { Page, Segment } from '../../components/Base';

const InviteTeammatesPage = () => {
  return (
    <Page basic>
      <Segment basic>
        <InviteTeammatesForm />
      </Segment>
    </Page>
  );
};

export default InviteTeammatesPage;

import React from 'react';

import { Header, Icon, Segment } from './Base';

const EmptyItem = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="file outline" />
        No Mailouts found.
      </Header>
    </Segment>
  );
};

export default EmptyItem;

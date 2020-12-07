import React from 'react';
import { Header } from 'semantic-ui-react';

import { Card, Image, Segment } from './Base';

const Loading = ({ message = 'Loading, please wait...', whiteBg }) => (
  <Segment basic style={{ margin: '6em auto' }}>
    <Card centered style={{ backgroundColor: whiteBg ? '#fff' : '#f9f8f7', minWidth: '380px', boxShadow: 'none' }}>
      <Image centered size="tiny" src={require('../assets/loading.gif')} style={{ background: 'unset', marginTop: '1em' }} />
      <Card.Content style={{ borderTop: 'none' }}>
        <Header as="h2" textAlign="center">
          <Header.Content>{message}</Header.Content>
        </Header>
      </Card.Content>
    </Card>
  </Segment>
);

export default Loading;

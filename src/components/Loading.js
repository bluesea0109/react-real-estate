import React from 'react';
import { Header } from 'semantic-ui-react';

import { Dimmer, Icon, Segment } from './Base';

import './Loading.css';

const Loading = () => (
  <Dimmer active inverted>
    <Segment loading padded="very" textAlign="center">
      <Header as="h2" icon textAlign="center">
        <Icon name="hourglass half" circular />
        <Header.Content>Loading, please wait...</Header.Content>
      </Header>
    </Segment>
  </Dimmer>
);

export default Loading;

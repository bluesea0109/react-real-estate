import React from 'react';
import { Header } from 'semantic-ui-react';

import { Dimmer, Icon, Segment } from './Base';

import './Loading.css';

const LoadingWithMessage = ({ message }) => (
  <Dimmer active inverted>
    <Segment loading padded="very" textAlign="center">
      <Header as="h2" icon textAlign="center">
        <Icon name="hourglass half" circular />
        <Header.Content>{message}</Header.Content>
      </Header>
    </Segment>
  </Dimmer>
);

export default LoadingWithMessage;

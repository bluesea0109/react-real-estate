import React from 'react';

import { Dimmer, Loader } from './Base';

const Loading = () => (
  <Dimmer active inverted>
    <Loader>Loading...</Loader>
  </Dimmer>
);

export default Loading;

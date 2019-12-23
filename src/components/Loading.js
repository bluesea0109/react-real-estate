import React from 'react';

import { Dimmer, Loader } from './Base';

const Loading = ({ msg = 'Loading...' }) => (
  <Dimmer active inverted>
    <Loader>{msg}</Loader>
  </Dimmer>
);

export default Loading;

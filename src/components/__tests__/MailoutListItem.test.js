import mailoutsData from '../../__mocks__/mailouts';

import React from 'react';
import { render } from '../../test-utils';
import MailoutListItem from '../MailoutListItem';

const data = mailoutsData[0];

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<MailoutListItem data={data} />, div);
});

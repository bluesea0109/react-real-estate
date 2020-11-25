import mailoutsData from '../../../__mocks__/mailouts';

import React from 'react';
import { render } from '../../../test-utils';
import MailoutListItem from '../';

const data = mailoutsData[0];

it('renders correctly', () => {
  render(<MailoutListItem data={data} />);
});

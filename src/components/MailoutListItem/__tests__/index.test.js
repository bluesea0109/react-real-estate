'use strict';

import matchMedia from '../../../__mocks__/matchMedia';
import mailoutsData from '../../../__mocks__/mailouts';

import React from 'react';
import { MemoryRouter } from 'react-router';
import MailoutListItem from '../';
import renderer from 'react-test-renderer';

const data = mailoutsData[0];

it('renders correctly', () => {
  const tree = renderer.create(<MemoryRouter>{MailoutListItem(data)}</MemoryRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});

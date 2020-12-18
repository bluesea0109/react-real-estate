import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Message } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Message />);
  expect(tree).toMatchSnapshot();
});

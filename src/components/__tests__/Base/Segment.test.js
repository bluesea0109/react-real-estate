import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Segment } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Segment />);
  expect(tree).toMatchSnapshot();
});

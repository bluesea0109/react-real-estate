import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Responsive } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Responsive />);
  expect(tree).toMatchSnapshot();
});

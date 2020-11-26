import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Header } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Header />);
  expect(tree).toMatchSnapshot();
});

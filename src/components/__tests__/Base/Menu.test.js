import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Menu } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Menu />);
  expect(tree).toMatchSnapshot();
});

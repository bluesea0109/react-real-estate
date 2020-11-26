import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Input } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Input />);
  expect(tree).toMatchSnapshot();
});

import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { List } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<List />);
  expect(tree).toMatchSnapshot();
});

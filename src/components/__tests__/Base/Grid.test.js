import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Grid } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Grid />);
  expect(tree).toMatchSnapshot();
});

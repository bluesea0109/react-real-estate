import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Snackbar } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Snackbar />);
  expect(tree).toMatchSnapshot();
});

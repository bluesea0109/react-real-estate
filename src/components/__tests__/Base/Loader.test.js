import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Loader } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Loader />);
  expect(tree).toMatchSnapshot();
});

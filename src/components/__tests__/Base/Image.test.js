import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Image } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Image />);
  expect(tree).toMatchSnapshot();
});

import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import LogoImage from '../LogoImage';

test('renders correctly', () => {
  const tree = renderer.create(<LogoImage />);
  expect(tree).toMatchSnapshot();
});

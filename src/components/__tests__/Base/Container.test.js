import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Container } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Container />);
  expect(tree).toMatchSnapshot();
});

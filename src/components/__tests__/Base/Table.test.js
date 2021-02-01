import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Table } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Table />);
  expect(tree).toMatchSnapshot();
});

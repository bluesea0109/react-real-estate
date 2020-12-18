import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Pagination } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Pagination totalPages={1} />);
  expect(tree).toMatchSnapshot();
});

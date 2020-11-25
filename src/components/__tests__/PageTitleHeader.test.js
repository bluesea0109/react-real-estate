import React from 'react';
import renderer from 'react-test-renderer';
import PageTitleHeader from '../PageTitleHeader';
import 'jest-styled-components';

it('renders correctly', () => {
  const tree = renderer.create(<PageTitleHeader />).toJSON();
  expect(tree).toMatchSnapshot();
});

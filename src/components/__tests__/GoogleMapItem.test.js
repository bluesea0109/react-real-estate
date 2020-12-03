import React from 'react';
import renderer from 'react-test-renderer';
import GoogleMapItem from '../GoogleMapItem';
import 'jest-styled-components';

it('renders correctly', () => {
  const tree = renderer.create(<GoogleMapItem />).toJSON();
  expect(tree).toMatchSnapshot();
});

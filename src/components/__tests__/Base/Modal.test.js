import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Modal } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Modal />);
  expect(tree).toMatchSnapshot();
});

import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { ModalLoader } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<ModalLoader />);
  expect(tree).toMatchSnapshot();
});

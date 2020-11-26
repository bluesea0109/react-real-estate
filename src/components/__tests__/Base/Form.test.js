import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Form } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Form />);
  expect(tree).toMatchSnapshot();
});

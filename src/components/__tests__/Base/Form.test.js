import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Form } from '../../Base';
import { fireEvent, render, screen } from '@testing-library/react';

it('renders correctly', () => {
  const tree = renderer.create(<Form />);
  expect(tree).toMatchSnapshot();
});

it('Runs function on click', () => {
  const onSubmit = jest.fn();
  render(<Form data-testid="form" onSubmit={onSubmit} />);
  fireEvent.submit(screen.getByTestId('form'));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

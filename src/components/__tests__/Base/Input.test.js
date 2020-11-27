import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Input } from '../../Base';
import { fireEvent, render, screen } from '@testing-library/react';

it('renders correctly', () => {
  const tree = renderer.create(<Input />);
  expect(tree).toMatchSnapshot();
});

it('Runs function on change', () => {
  const onChange = jest.fn();
  render(<Input data-testid="input" onChange={onChange} />);
  const el = screen.getByTestId('input').children[0];
  fireEvent.change(el, { target: { value: 'changed text' } });
  expect(onChange).toHaveReturnedTimes(1);
  expect(el.value).toBe('changed text');
});

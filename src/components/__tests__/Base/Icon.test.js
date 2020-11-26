import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Icon } from '../../Base';
import { fireEvent, render, screen } from '@testing-library/react';

it('renders correctly', () => {
  const tree = renderer.create(<Icon />);
  expect(tree).toMatchSnapshot();
});

it('Runs function on click', () => {
  const onClick = jest.fn();
  render(<Icon data-testid="icon" onClick={onClick} />);
  fireEvent.click(screen.getByTestId('icon'));
  expect(onClick).toHaveBeenCalledTimes(1);
});

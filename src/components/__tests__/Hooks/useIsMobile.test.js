import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { useIsMobile } from '../../Hooks/useIsMobile';

const TestComponent = () => {
  const isMobile = useIsMobile();
  return <>{`${isMobile}`}</>;
};

it('returns false for window width > 600px', () => {
  global.innerWidth = 620;
  const { result } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
});

it('returns true for window width < 600px', () => {
  global.innerWidth = 580;
  const { result } = renderHook(() => useIsMobile());
  expect(result.current).toBe(true);
});

it('updates on page resize', () => {
  const { container } = render(<TestComponent />);
  expect(container.innerHTML).toEqual('true');
  global.innerWidth = 620;
  fireEvent(global, new Event('resize'));
  expect(container.innerHTML).toEqual('false');
});

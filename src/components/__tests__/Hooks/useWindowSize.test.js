import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import { useWindowSize } from '../../Hooks/useWindowSize';

it('returns correct window sizes on load and update', () => {
  const { result } = renderHook(() => useWindowSize());
  expect(result.current.width).toBe(1024);
  expect(result.current.height).toBe(768);

  act(() => {
    window.innerWidth = 500;
    window.innerHeight = 500;

    fireEvent(window, new Event('resize'));
  });

  expect(result.current.height).toBe(500);
  expect(result.current.width).toBe(500);
});

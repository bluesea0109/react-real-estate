import { useEffect } from 'react';

export function useClickOutside(node, onClickOutside) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (!node?.contains(event.target)) {
        onClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [node, onClickOutside]);
}

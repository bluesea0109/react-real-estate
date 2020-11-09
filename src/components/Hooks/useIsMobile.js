import { useLayoutEffect, useState } from 'react';

export function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    function updateWidth() {
      window.innerWidth < 600 ? setMobile(true) : setMobile(false);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return mobile;
}

import React from 'react';

// Matches the 'lg' breakpoint (1024px) used in Tailwind/theme config.
// Returns true when viewport is below the lg breakpoint.
const LG_BREAKPOINT = 1024;

export default function useIsMobile(_ssr = false) {
  const [ isMobile, setIsMobile ] = React.useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < LG_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${ LG_BREAKPOINT - 1 }px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

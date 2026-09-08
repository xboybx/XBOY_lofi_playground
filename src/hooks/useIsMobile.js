import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile viewport reactively.
 * Handles resize events and matchMedia listeners cleanly.
 * @param {number} breakpoint - Max width in pixels for mobile (default 768)
 * @returns {boolean}
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    // Set initial value based on matchMedia
    setIsMobile(mediaQuery.matches);

    // Modern API with fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function CuelinksUpdater() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let attempts = 0;
    const maxAttempts = 10; // Max time to wait: ~3 seconds

    const checkAndScan = () => {
      const clkEngine = (window as any).CLK;

      if (clkEngine && typeof clkEngine.Processfn === 'function') {
        try {
          clkEngine.Processfn();
          console.log(`[Cuelinks Router Core] Successfully parsed links for: ${pathname}`);
        } catch (error) {
          console.error('Cuelinks dynamic execution runtime error:', error);
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        // Retry scanning after 300ms if engine is still hydrating
        setTimeout(checkAndScan, 300);
      } else {
        console.warn('[Cuelinks] Core engine failed to initialize after maximum wait time. Check network block.');
      }
    };

    // Trigger initial scan execution buffer delay
    const initialTimer = setTimeout(checkAndScan, 200);

    return () => clearTimeout(initialTimer);
  }, [pathname, searchParams]);

  return null;
}

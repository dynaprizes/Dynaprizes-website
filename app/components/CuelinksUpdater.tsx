'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function CuelinksUpdater() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      // ✅ Updated to look inside the modern window.CLK object
      const clkEngine = (window as any).CLK;

      if (clkEngine && typeof clkEngine.Processfn === 'function') {
        try {
          clkEngine.Processfn();
          console.log(`[Cuelinks Router Core] Scanned links for path: ${pathname}`);
        } catch (error) {
          console.error('Cuelinks dynamic runtime scan failed:', error);
        }
      } else {
        console.warn('Cuelinks CLK core engine is not fully initialized yet.');
      }
    }, 200); // 200ms gives your Node.js/Next.js UI plenty of time to render completely

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

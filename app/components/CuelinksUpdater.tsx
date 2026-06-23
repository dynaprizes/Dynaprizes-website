'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function CuelinksUpdater() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      if (typeof (window as any).Processfn === 'function') {
        try {
          (window as any).Processfn();
          console.log(`Cuelinks scanned links for: ${pathname}`);
        } catch (error) {
          console.error('Cuelinks scan failed:', error);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
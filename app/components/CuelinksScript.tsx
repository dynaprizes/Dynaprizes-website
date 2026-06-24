'use client';

import { useEffect } from 'react';

export default function CuelinksScript() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Force the globally expected fields onto the browser execution context
    (window as any).cueLinks = true;
    (window as any).cId = '298456';

    // 2. Fallback check: If CLK isn't injected, build the script tag manually
    const existingScript = document.querySelector('script[src*="cuelinks.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://cuelinks.com';
      
      // Inject it right at the top of head to beat Next.js page rendering execution 
      document.head.appendChild(script);
      console.log('[Cuelinks Core] Script manually appended to document.head');
    }
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function CuelinksScript() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ✅ Update for dynaprizes.shop
    (window as any).cId = '298456';

    // Remove old script if exists
    const oldScript = document.getElementById('cuelinks-engine');
    if (oldScript) oldScript.remove();

    // Create fresh script
    const script = document.createElement('script');
    script.id = 'cuelinks-engine';
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cdn0.cuelinks.com/js/cuelinksv2.js';
    document.body.appendChild(script);
    
    console.log('Cuelinks script injected for path:', pathname);
  }, [pathname]);

  return null;
}
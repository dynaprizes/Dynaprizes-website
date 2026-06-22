'use client';

import { useEffect } from 'react';

export default function CuelinkLoader() {
  useEffect(() => {
    window.cId = '226073';
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = (document.location.protocol === 'https:' ? 'https://cdn0.cuelinks.com/js/' : 'http://cdn0.cuelinks.com/js/') + 'cuelinksv2.js';
    document.getElementsByTagName('body')[0].appendChild(script);
    
    return () => {};
  }, []);

  return null;
}
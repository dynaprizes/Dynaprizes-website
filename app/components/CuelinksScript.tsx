'use client';

import { useEffect } from 'react';

export default function CuelinksScript() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).cueLinks = true;
      (window as any).cId = '298456';
    }
  }, []);

  return null;
}

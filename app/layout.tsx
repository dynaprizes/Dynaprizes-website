import { Suspense } from 'react';
import Script from 'next/script';
import CuelinksUpdater from './components/CuelinksUpdater';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Force bind the tracking metadata context onto the main layout window frame */}
        <Script id="cuelinks-config" strategy="beforeInteractive">
          {`
            window.cueLinks = true;
            window.cId = '298456';
          `}
        </Script>

        {/* ✅ CORRECTED PATH: Fetching the script logic, not the HTML homepage */}
        <Script 
          src="https://cuelinks.com" 
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
        <Suspense fallback={null}>
          <CuelinksUpdater />
        </Suspense>
      </body>
    </html>
  );
}

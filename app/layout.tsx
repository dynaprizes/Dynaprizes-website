import { Suspense } from 'react';
import Script from 'next/script'; // Import the Next.js script optimizer
import CuelinksUpdater from './components/CuelinksUpdater';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Step 1: Force bind variables globally before any scripts run */}
        <Script id="cuelinks-config" strategy="beforeInteractive">
          {`
            window.cueLinks = true;
            window.cId = '298456';
          `}
        </Script>

        {/* Step 2: Load the modern Cuelinks engine that provides window.CLK */}
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

import { Suspense } from 'react';
import CuelinksUpdater from './components/CuelinksUpdater';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Cuelink for dynaprizes.shop - Publisher ID: 298456 */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var cId = '298456';
              window.cId = '298456';
              (function() {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn0.cuelinks.com/js/cuelinksv2.js';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
              })();
            `
          }}
        />

        <Suspense fallback={null}>
          <CuelinksUpdater />
        </Suspense>
      </body>
    </html>
  );
}
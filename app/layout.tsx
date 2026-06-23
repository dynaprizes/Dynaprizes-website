import { Suspense } from 'react';
import CuelinksScript from './components/CuelinksScript';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        <Suspense fallback={null}>
          <CuelinksScript />
        </Suspense>
      </body>
    </html>
  );
}
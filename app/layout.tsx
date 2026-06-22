import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DynaPrizes - Compare Prices & Save",
  description: "India's first shopping super-app. Compare prices across 100+ stores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </head>
      <body>
        {children}
        
        {/* Cuelink Integration */}
        <Script
          id="cuelink-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var cId = '226073';
              (function(d, t) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = (document.location.protocol == 'https:' ? 'https://cdn0.cuelinks.com/js/' : 'http://cdn0.cuelinks.com/js/') + 'cuelinksv2.js';
                document.getElementsByTagName('body')[0].appendChild(s);
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
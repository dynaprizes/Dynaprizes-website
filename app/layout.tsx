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
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Cuelink - Correct Implementation */}
        <Script id="cuelinks-config" strategy="beforeInteractive">
          {`window.cId = '226073';`}
        </Script>

        <Script
          src="https://cdn0.cuelinks.com/js/cuelinksv2.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
// Portfolio Of LunarcatOwO
// Copyright (C) 2025  LunarcatOwO

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Script from "next/script";

// Fonts are preconfigured with CSS variables:
// `--font-geist-sans` and `--font-geist-mono`

export const metadata: Metadata = {
  title: "LunarcatOwO.space",
  description: "Just doing things.",
  keywords: ["developer", "programming", "dev"],
  authors: [{ name: "LunarcatOwO" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans h-full`}
      >
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'var(--font-geist-mono), monospace'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              maxWidth: '500px'
            }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>JavaScript Required</h1>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                This website requires JavaScript to be enabled to function properly.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#888' }}>
                Please enable JavaScript in your browser settings and reload the page.
              </p>
            </div>
          </div>
        </noscript>
        <div className="min-h-full flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1 min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
        {/* Ensure on first load we are scrolled to the very top so the footer starts out of view */}
        <Script id="scroll-top-on-load" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && 'scrollTo' in window) {
              window.scrollTo(0, 0);
            }
          `}
        </Script>
      </body>
    </html>
  );
}

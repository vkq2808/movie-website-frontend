import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header, LoadingOverlay } from "@/components/common";
import TokenWatcher from "@/components/common/TokenWatcher";
import React from "react";
import { LanguageProvider } from "@/contexts/language.context";
import { SettingsProvider } from "@/contexts/settings.context";
import { ToastProvider } from "@/contexts/toast.context";
import ChatBot from "@/components/common/ChatBot";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieStream - Discover, Watch & Enjoy Movies",
  description: "Discover the latest movies, watch trailers, and enjoy your favorite films on MovieStream. Browse by genre, language, and get personalized recommendations.",
  keywords: ["movies", "cinema", "entertainment", "streaming", "trailers", "film reviews", "movie database"],
  authors: [{ name: "MovieStream Team" }],
  creator: "MovieStream",
  publisher: "MovieStream",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "MovieStream - Discover, Watch & Enjoy Movies",
    description: "Discover the latest movies, watch trailers, and enjoy your favorite films on MovieStream. Browse by genre, language, and get personalized recommendations.",
    url: '/',
    siteName: 'MovieStream',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MovieStream - Your Ultimate Movie Destination',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MovieStream - Discover, Watch & Enjoy Movies",
    description: "Discover the latest movies, watch trailers, and enjoy your favorite films on MovieStream.",
    images: ['/og-image.jpg'],
    creator: '@moviestream',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only show ChatBot if not on admin page
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdmin = pathname.startsWith('/admin');
  return (
    <html lang="en" className={`hide-scrollbar ${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MovieStream",
              "description": "Discover the latest movies, watch trailers, and enjoy your favorite films",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/moviestream",
                "https://facebook.com/moviestream"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <SettingsProvider>
          <LanguageProvider>
            <ToastProvider>
              <LoadingOverlay />
              <TokenWatcher />
              <Header />
              <main className="flex-1 bg-gray-900 text-gray-100">
                {children}
              </main>
              {!isAdmin && <ChatBot />}
              <Footer />
            </ToastProvider>
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

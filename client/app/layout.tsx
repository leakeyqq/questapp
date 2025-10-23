import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from '@/providers/AppProvider';
import { Metadata } from "next";

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

import {CurrencyProvider} from "../contexts/CurrencyContext"
import { frameEmbed } from "@/lib/fcFrameMeta"

import { Analytics } from '@vercel/analytics/next';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // Path must start with /
    shortcut: '/favicon.ico',
    apple: '/icon-192x192.png', // Add apple touch icon for PWA
  },
  title: "Questpanda - Create content and earn",
  description: "Connecting brands that need digital marketing with content creators",
  manifest: '/manifest.json', // Add manifest for PWA
  themeColor: '#000000', // Add theme color for PWA
  appleWebApp: {
    capable: true, // Enable Apple PWA
    statusBarStyle: 'default',
    title: 'Questpanda',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Better for PWA
  },
  openGraph: {
    title: "Questpanda - Create content and earn",
    description: "Connecting brands that need digital marketing with content creators",
    images: [
      {
        url: "/dancing-panda.webp", // Or full URL like https://yourdomain.com/your-image.jpg
        width: 1200,
        height: 630,
        alt: "Questpanda Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Questpanda - Create content and earn",
    description: "Connecting brands that need digital marketing with content creators",
    images: ["/dancing-panda.webp"], // again can be full URL
  },
  other: {
    'fc:frame': JSON.stringify(frameEmbed),
    'mobile-web-app-capable': 'yes', // Additional PWA support
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add PWA meta tags that aren't covered by Metadata API */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Questpanda" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="dark"> */}
          <CurrencyProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          {/* </ThemeProvider> */}
          </CurrencyProvider>
        </AppProvider>
        {/* Add the PWA install prompt */}
        <PWAInstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}


import './globals.css'
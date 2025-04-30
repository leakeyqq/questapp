import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from '@/providers/AppProvider';
import { Metadata } from "next";

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // Path must start with /
    shortcut: '/favicon.ico',
  },
  title: "QuestPanda - Create content and earn",
  description: "Connecting brands that need digital marketing with content creators",
  openGraph: {
    title: "QuestPanda - Create content and earn",
    description: "Connecting brands that need digital marketing with content creators",
    images: [
      {
        url: "/dancing-panda.webp", // Or full URL like https://yourdomain.com/your-image.jpg
        width: 1200,
        height: 630,
        alt: "QuestPanda Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestPanda - Create content and earn",
    description: "Connecting brands that need digital marketing with content creators",
    images: ["/dancing-panda.webp"], // again can be full URL
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="dark"> */}
            <Navbar />
            <main>{children}</main>
            <Footer />
          {/* </ThemeProvider> */}
        </AppProvider>
      </body>
    </html>
  )
}


import './globals.css'
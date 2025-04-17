import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from '@/providers/AppProvider';

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "QuestPanda - Create videos, post and earn",
  description: "A social media platform for content creators to complete quests and earn USD",
    generator: 'v0.dev'
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
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/components/supabase-provider"
import { AuthDebug } from "@/components/auth-debug"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobSwipe - Find Your Perfect Match",
  description: "A Tinder-like platform for job matching",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <SupabaseProvider>
          <Header />
          {children}
          <Toaster />
          <AuthDebug />
        </SupabaseProvider>
      </body>
    </html>
  )
}


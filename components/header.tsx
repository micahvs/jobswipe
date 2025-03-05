"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { getSupabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Only run on client side
  useEffect(() => {
    setMounted(true)

    // Get initial session
    const getInitialUser = async () => {
      try {
        const supabase = getSupabase()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("Header - Current session:", session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session in header:", error)
      }
    }

    getInitialUser()

    // Listen for auth changes
    const supabase = getSupabase()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      console.log("User signed out")
      // Force a hard navigation to home
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Don't render anything on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            JobSwipe
          </Link>
          <div></div>
        </div>
      </header>
    )
  }

  // Get user metadata
  const isEmployer = user?.user_metadata?.isEmployer
  const userEmail = user?.email
  const dashboardUrl = isEmployer ? "/employer/dashboard" : "/dashboard"

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href={user ? dashboardUrl : "/"} className="text-xl font-bold">
          JobSwipe
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline">{userEmail}</span>

              {/* Add direct dashboard link */}
              <Button variant="outline" size="sm" asChild>
                <Link href={dashboardUrl}>Dashboard</Link>
              </Button>

              {isEmployer ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/employer/post-job">Post Job</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/jobs">Find Jobs</Link>
                </Button>
              )}
              <Button variant="link" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


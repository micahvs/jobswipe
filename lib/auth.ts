"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabaseClient } from "./supabaseClient"
import type { User, Session } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const supabase = getSupabaseClient()

      // Initial session check
      const getInitialSession = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          setSession(session)
          setUser(session?.user ?? null)
        } catch (error) {
          console.error("Error getting session:", error)
        } finally {
          setLoading(false)
        }
      }

      getInitialSession()

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle redirects based on auth state
        if (!session) {
          // Skip auth check on auth pages
          const isAuthPage =
            pathname === "/login" ||
            pathname === "/signup" ||
            pathname === "/employer/login" ||
            pathname === "/employer/signup" ||
            pathname === "/"

          if (!isAuthPage) {
            router.push("/login")
          }
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signup = async (email: string, password: string, metadata?: any) => {
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const logout = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return { user, session, loading, login, signup, logout }
}

// Login function that works reliably
export async function loginUser(email: string, password: string, isEmployer = false) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      throw new Error("Supabase client not available")
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Check if user is an employer when that's expected
    if (isEmployer && !data.user.user_metadata?.isEmployer) {
      await supabase.auth.signOut()
      throw new Error("This login is for employers only")
    }

    return { success: true, user: data.user }
  } catch (error: any) {
    console.error("Login error:", error)
    return { success: false, error: error.message }
  }
}


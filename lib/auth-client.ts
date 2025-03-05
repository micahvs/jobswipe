"use client"

import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

// Create a singleton Supabase client
let supabaseInstance: any = null

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    return null // Return null during SSR
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return null
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: "jobswipe-auth",
      },
    })
  }

  return supabaseInstance
}

// Simple local storage fallback
export const AuthStore = {
  setUser: (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobswipe-user", JSON.stringify(user))
    }
  },

  getUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("jobswipe-user")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jobswipe-user")
    }
  },
}

// Hook for authentication
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Function to get the current user
    const getCurrentUser = async () => {
      try {
        const supabase = getSupabaseClient()
        if (!supabase) {
          // Try fallback if Supabase client isn't available
          const fallbackUser = AuthStore.getUser()
          setUser(fallbackUser)
          setLoading(false)
          return
        }

        // Get user from Supabase
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          // Try fallback if Supabase auth fails
          const fallbackUser = AuthStore.getUser()
          setUser(fallbackUser)
        } else {
          // Store user in local storage as fallback
          AuthStore.setUser(data.user)
          setUser(data.user)
        }
      } catch (error) {
        console.error("Auth error:", error)
        // Try fallback on error
        const fallbackUser = AuthStore.getUser()
        setUser(fallbackUser)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()

    // Set up auth state listener
    const supabase = getSupabaseClient()
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          AuthStore.setUser(session.user)
          setUser(session.user)
        } else if (event === "SIGNED_OUT") {
          AuthStore.clearUser()
          setUser(null)
        }
      })

      return () => {
        data?.subscription.unsubscribe()
      }
    }
  }, [])

  return { user, loading }
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

    // Store user in local storage as fallback
    AuthStore.setUser(data.user)

    return { success: true, user: data.user }
  } catch (error: any) {
    console.error("Login error:", error)
    return { success: false, error: error.message }
  }
}

// Logout function
export async function logoutUser() {
  try {
    const supabase = getSupabaseClient()
    if (supabase) {
      await supabase.auth.signOut()
    }

    // Clear local storage regardless of Supabase success
    AuthStore.clearUser()

    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    return { success: false, error: error.message }
  }
}


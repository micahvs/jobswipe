"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabase as getSupabaseClient, AuthStore, AUTH_STORAGE_KEY } from "@/lib/supabaseClient"

// Re-export the getSupabase function to maintain backward compatibility with existing imports
export const getSupabase = getSupabaseClient

// Hook for authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Function to get the current user
    const getCurrentUser = async () => {
      try {
        const supabase = getSupabase()
        
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
    const supabase = getSupabase()
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        console.log("Auth state change:", event, "User:", session.user.email)
        AuthStore.setUser(session.user)
        setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        console.log("Auth state change: SIGNED_OUT")
        AuthStore.clearUser()
        setUser(null)
      }
    })

    return () => {
      data?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

// Login function that works reliably
export async function loginUser(email: string, password: string, isEmployer = false) {
  try {
    console.log(`Attempting login for: ${email}`)
    const supabase = getSupabase()
    
    // Don't clear existing storage as it might cause issues
    // localStorage.removeItem(AUTH_STORAGE_KEY)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    console.log("Login successful for:", email)

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
    const supabase = getSupabase()
    await supabase.auth.signOut()

    // Clear local storage regardless of Supabase success
    AuthStore.clearUser()

    // For extra measure, remove any auth cookies/storage
    localStorage.removeItem(AUTH_STORAGE_KEY)

    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    return { success: false, error: error.message }
  }
}

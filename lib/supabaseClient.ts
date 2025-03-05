import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Global variable to store the Supabase client instance
let supabaseInstance: SupabaseClient | null = null

// Function to get the Supabase client (singleton pattern)
export function getSupabase(): SupabaseClient {
  // For client-side only
  if (typeof window !== "undefined") {
    if (supabaseInstance) {
      return supabaseInstance
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    console.log("Creating new Supabase client instance")

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "jobswipe-auth-token",
      },
    })

    return supabaseInstance
  } else {
    // For server-side, create a new instance each time
    // This avoids issues with server components
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

// Alias for backward compatibility
export const getSupabaseClient = getSupabase

// Simple local storage fallback
export const AuthStore = {
  // Store user info in localStorage as a fallback
  setUser: (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobswipe-user-fallback", JSON.stringify(user))
    }
  },

  // Get user info from localStorage
  getUser: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("jobswipe-user-fallback")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  // Clear user info from localStorage
  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jobswipe-user-fallback")
    }
  },
}

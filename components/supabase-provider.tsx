"use client"

import { createContext, useContext, type ReactNode } from "react"
import { getSupabase } from "@/lib/supabaseClient"
import type { SupabaseClient } from "@supabase/supabase-js"

// Create a context for the Supabase client
const SupabaseContext = createContext<SupabaseClient | undefined>(undefined)

// Provider component that wraps your app and makes Supabase client available
export function SupabaseProvider({ children }: { children: ReactNode }) {
  // Get the Supabase client
  const supabase = getSupabase()

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}

// Hook to use the Supabase client
export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}


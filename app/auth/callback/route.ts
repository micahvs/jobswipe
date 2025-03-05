import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  // Handle authentication errors
  if (error) {
    console.error("Auth error:", error, error_description)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    )
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/login?error=missing_env_vars", request.url))
    }

    try {
      // Create a new Supabase client specifically for this server component
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        throw exchangeError
      }

      // Get the user to determine the correct dashboard
      const { data: { user } } = await supabase.auth.getUser()
      
      // Redirect based on user role
      if (user?.user_metadata?.isEmployer) {
        return NextResponse.redirect(new URL("/employer/dashboard", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (err: any) {
      console.error("Auth callback error:", err)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(err.message || "Authentication failed")}`, request.url)
      )
    }
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(new URL("/login?error=no_code", request.url))
}


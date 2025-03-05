import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/login?error=missing_env_vars", request.url))
    }

    // Create a new Supabase client specifically for this server component
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes - go to dashboard instead of login
  return NextResponse.redirect(new URL("/dashboard", request.url))
}


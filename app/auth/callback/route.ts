import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This route is called by Supabase Auth when a user completes the auth flow
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    // Create a Supabase client for server-side authentication
    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange the auth code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Get the authenticated user to determine where to redirect
    const { data: { user } } = await supabase.auth.getUser()
    
    // Redirect to the appropriate dashboard based on user role
    if (user?.user_metadata?.isEmployer) {
      return NextResponse.redirect(new URL('/employer/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // If no code is present, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}
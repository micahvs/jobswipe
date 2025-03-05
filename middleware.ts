import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip auth for auth callback routes
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return NextResponse.next()
  }

  // Create a response to modify
  const res = NextResponse.next()
  
  // Create middleware client
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // Public routes that don't require auth
    const isPublicRoute =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup") ||
      req.nextUrl.pathname.startsWith("/auth/") ||
      req.nextUrl.pathname === "/"
    
    // Employee specific routes
    const isEmployerRoute = req.nextUrl.pathname.startsWith("/employer/")
    
    // Handle routes that need authentication
    if (!session && !isPublicRoute) {
      // User is not authenticated and trying to access protected route
      return NextResponse.redirect(new URL("/login", req.url))
    }
    
    // User is authenticated
    if (session) {
      // Store user info in request headers for client components
      res.headers.set("x-user-id", session.user.id)
      res.headers.set("x-user-email", session.user.email || "")
      res.headers.set("x-user-role", session.user.user_metadata?.isEmployer ? "employer" : "jobseeker")
      
      // Redirect employers trying to access job seeker routes
      const isEmployer = session.user.user_metadata?.isEmployer
      
      if (isEmployer && !isEmployerRoute && !isPublicRoute) {
        return NextResponse.redirect(new URL("/employer/dashboard", req.url))
      }
      
      // Redirect job seekers trying to access employer routes
      if (!isEmployer && isEmployerRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      
      // Redirect authenticated users away from login/signup
      if (isPublicRoute && req.nextUrl.pathname !== "/" && 
         !req.nextUrl.pathname.startsWith("/auth/")) {
        const redirectUrl = isEmployer ? "/employer/dashboard" : "/dashboard"
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
    }
    
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}


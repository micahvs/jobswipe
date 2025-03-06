import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Skip auth checks for static assets and API routes
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.includes(".") ||
    req.nextUrl.pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // Skip auth for auth-related routes
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  // Create a response to modify
  const res = NextResponse.next()
  
  // Create middleware client
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Get session
    const { data } = await supabase.auth.getSession()
    const session = data.session
    
    // Public routes that don't require auth
    const isPublicRoute =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup") ||
      req.nextUrl.pathname === "/"
    
    // Debugging routes - always allow access
    const isDebugRoute = 
      req.nextUrl.pathname === "/dashboard" || 
      req.nextUrl.pathname === "/employer/dashboard" ||
      req.nextUrl.pathname === "/profile" || 
      req.nextUrl.pathname === "/jobs" || 
      req.nextUrl.pathname === "/matches" ||
      req.nextUrl.pathname === "/employer/post-job" ||
      req.nextUrl.pathname.startsWith("/chat/")
    
    // Employer specific routes
    const isEmployerRoute = req.nextUrl.pathname.startsWith("/employer/")
    
    // TEMPORARY: Allow access to all app routes for debugging
    if (isDebugRoute) {
      console.log("Middleware: Debug route access allowed:", req.nextUrl.pathname)
      return res
    }
    
    // Handle unauthenticated users
    if (!session && !isPublicRoute) {
      console.log("Middleware: No session, redirecting to login")
      // Redirect to login
      return NextResponse.redirect(new URL("/login", req.url))
    }
    
    // Handle authenticated users
    if (session) {
      console.log("Middleware: Session found for", session.user.email)
      const isEmployer = session.user.user_metadata?.isEmployer
      
      // Redirect employers trying to access job seeker routes
      if (isEmployer && !isEmployerRoute && !isPublicRoute) {
        return NextResponse.redirect(new URL("/employer/dashboard", req.url))
      }
      
      // Redirect job seekers trying to access employer routes
      if (!isEmployer && isEmployerRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      
      // Redirect authenticated users away from login/signup
      if (isPublicRoute && req.nextUrl.pathname !== "/") {
        const redirectUrl = isEmployer ? "/employer/dashboard" : "/dashboard"
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
    }
    
    return res
  } catch (error) {
    console.error("Auth middleware error:", error)
    // On error, still allow the request to proceed
    return res
  }
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
}


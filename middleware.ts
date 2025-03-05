import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup") ||
    req.nextUrl.pathname === "/"

  // If accessing protected route without session, redirect to login
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If accessing auth route with session, redirect to dashboard
  if (session && isAuthRoute && req.nextUrl.pathname !== "/") {
    // Check if user is employer
    const isEmployer = session.user.user_metadata.isEmployer

    if (isEmployer) {
      return NextResponse.redirect(new URL("/employer/dashboard", req.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}


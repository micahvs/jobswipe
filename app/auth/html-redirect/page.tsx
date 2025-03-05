"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabase } from "@/lib/supabaseClient"

export default function HtmlRedirect() {
  const [status, setStatus] = useState("Authenticating...")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleAuth() {
      try {
        const code = searchParams?.get("code")
        const errorParam = searchParams?.get("error")
        const errorDescription = searchParams?.get("error_description")

        if (errorParam) {
          setError(errorDescription || errorParam)
          setTimeout(() => {
            router.push(`/login?error=${encodeURIComponent(errorDescription || errorParam)}`)
          }, 1500)
          return
        }

        if (!code) {
          setError("No authentication code provided")
          setTimeout(() => {
            router.push("/login?error=no_code")
          }, 1500)
          return
        }

        const supabase = getSupabase()
        setStatus("Exchanging authentication token...")
        
        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          throw exchangeError
        }

        setStatus("Getting user details...")
        
        // Get the user to determine the correct dashboard
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }
        
        if (!user) {
          throw new Error("Authentication succeeded but no user was found")
        }

        setStatus("Authentication successful. Redirecting...")
        
        // Redirect based on user role
        if (user.user_metadata?.isEmployer) {
          setTimeout(() => {
            router.push("/employer/dashboard")
          }, 500)
        } else {
          setTimeout(() => {
            router.push("/dashboard")
          }, 500)
        }
      } catch (err: any) {
        console.error("Auth error:", err)
        setError(err.message || "Authentication failed")
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(err.message || "Authentication failed")}`)
        }, 1500)
      }
    }

    handleAuth()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication in Progress</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 mb-4">
            <p className="font-medium">Authentication Error</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            <p className="text-gray-600 mb-2">{status}</p>
            <p className="text-sm text-gray-500">Please wait while we complete the authentication process.</p>
          </>
        )}
      </div>
    </div>
  )
}
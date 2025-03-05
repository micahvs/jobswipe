"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabaseClient"

export default function HtmlRedirectPage() {
  const [destination, setDestination] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const determineRedirect = async () => {
      try {
        console.log("HTML Redirect page: Checking user authentication")
        const supabase = getSupabase()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          console.log("HTML Redirect page: No user found, will redirect to login")
          setDestination("/login")
          return
        }

        // Check if user is an employer
        const isEmployer = user.user_metadata?.isEmployer
        const redirectUrl = isEmployer ? "/employer/dashboard" : "/dashboard"

        console.log(
          `HTML Redirect page: User authenticated as ${isEmployer ? "employer" : "job seeker"}, will redirect to ${redirectUrl}`,
        )
        setDestination(redirectUrl)
      } catch (error: any) {
        console.error("HTML Redirect page: Error checking user:", error)
        setError(error.message)
        setDestination("/login")
      }
    }

    determineRedirect()
  }, [])

  if (!destination) {
    return <div>Determining where to redirect you...</div>
  }

  // This uses HTML meta refresh as a fallback redirection method
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <div>
        <h1>Redirecting...</h1>
        <p>
          If you are not redirected automatically, <a href={destination}>click here</a>.
        </p>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>
    </>
  )
}


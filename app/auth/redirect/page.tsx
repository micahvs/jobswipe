"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabaseClient"

// Content component that will be wrapped in Suspense
function RedirectContent() {
  const [destination, setDestination] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const determineRedirect = async () => {
      try {
        console.log("Redirect page: Checking user authentication")
        const supabase = getSupabase()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          console.log("Redirect page: No user found, will redirect to login")
          setDestination("/login")
          return
        }

        // Check if user is an employer
        const isEmployer = user.user_metadata?.isEmployer
        const redirectUrl = isEmployer ? "/employer/dashboard" : "/dashboard"

        console.log(
          `Redirect page: User authenticated as ${isEmployer ? "employer" : "job seeker"}, will redirect to ${redirectUrl}`,
        )
        setDestination(redirectUrl)
      } catch (error: any) {
        console.error("Redirect page: Error checking user:", error)
        setError(error.message)
        setDestination("/login")
      }
    }

    determineRedirect()

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Perform the actual redirect after countdown
  useEffect(() => {
    if (countdown === 0 && destination) {
      console.log(`Redirect page: Redirecting NOW to ${destination}`)

      // Try multiple redirection methods
      try {
        // Method 1: window.location.replace
        window.location.replace(destination)

        // Method 2: If Method 1 fails, try this after a short delay
        setTimeout(() => {
          console.log("Trying fallback redirect method...")
          window.location.href = destination
        }, 100)
      } catch (e) {
        console.error("Error during redirect:", e)
      }
    }
  }, [countdown, destination])

  const handleManualRedirect = () => {
    if (destination) {
      console.log(`Manual redirect to: ${destination}`)
      window.location.href = destination
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Redirecting...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
              <p className="font-medium">Error during redirect</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : destination ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-blue-800">
              <p className="font-medium">Redirecting you to {destination}</p>
              <p className="mt-1">You will be redirected in {countdown} seconds...</p>
              <div className="w-full bg-blue-200 h-2 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 3) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4">Determining where to redirect you...</p>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <Button onClick={handleManualRedirect} disabled={!destination}>
              Click here if you are not redirected automatically
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>Debug info:</p>
            <p>Destination: {destination || "Determining..."}</p>
            <p>Countdown: {countdown}</p>
            <p>Current URL: {typeof window !== "undefined" ? window.location.href : "Server rendering"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Loading Redirect...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4">Preparing redirection...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main export that wraps the content in Suspense
export default function RedirectPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RedirectContent />
    </Suspense>
  )
}


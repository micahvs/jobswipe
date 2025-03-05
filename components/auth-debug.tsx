"use client"

import { useEffect, useState, useCallback } from "react"
import { getSupabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"

export function AuthDebug() {
  const [sessionInfo, setSessionInfo] = useState<string>("Loading...")
  const [isVisible, setIsVisible] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  
  const checkSession = useCallback(async () => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setSessionInfo(JSON.stringify({
          user: {
            id: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata,
            emailConfirmed: session.user.email_confirmed_at,
            lastSignIn: session.user.last_sign_in_at
          },
          expires_at: session.expires_at,
          current_url: window.location.href,
          timestamp: new Date().toISOString()
        }, null, 2))
      } else {
        setSessionInfo(JSON.stringify({
          session: "No active session",
          current_url: window.location.href,
          timestamp: new Date().toISOString()
        }, null, 2))
      }
    } catch (error) {
      setSessionInfo(`Error: ${error}`)
    }
  }, [])
  
  useEffect(() => {
    if (isVisible) {
      checkSession()
    }
  }, [isVisible, checkSession])
  
  const handleManualRedirect = () => {
    const supabase = getSupabase()
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      if (user) {
        const isEmployer = user.user_metadata?.isEmployer
        const redirectUrl = isEmployer ? '/employer/dashboard' : '/dashboard'
        console.log("Manual redirect to:", redirectUrl)
        window.location.href = redirectUrl
      } else {
        console.log("No user found for manual redirect")
        alert("No authenticated user found")
      }
    })
  }
  
  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="bg-gray-100 hover:bg-gray-200"
        >
          Debug Auth
        </Button>
      </div>
    )
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white border rounded-lg shadow-lg max-w-md z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Auth Debug Info</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsVisible(false)}
        >
          Close
        </Button>
      </div>
      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
        {sessionInfo}
      </pre>
      <div className="flex gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setRefreshCount(c => c + 1)}
        >
          Refresh Info
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRedirect}
        >
          Manual Redirect
        </Button>
      </div>
    </div>
  )
}

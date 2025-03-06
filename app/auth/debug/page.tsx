"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabaseClient"
import { useAuth, logoutUser } from "@/lib/auth"

export default function AuthDebugPage() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        setSessionInfo(JSON.stringify({
          session: data.session,
          user: user,
          timestamp: new Date().toISOString(),
          localStorage: typeof window !== 'undefined' ? Object.keys(localStorage) : null
        }, null, 2))
      } catch (err: any) {
        console.error("Error checking session:", err)
        setError(err.message || "Error checking session")
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [user, refreshCount])
  
  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1)
  }
  
  const handleClearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      setRefreshCount(prev => prev + 1)
    }
  }
  
  const handleLogout = async () => {
    try {
      await logoutUser()
      window.location.href = '/login'
    } catch (err: any) {
      setError(err.message || "Error during logout")
    }
  }
  
  const handleFixSession = async () => {
    try {
      const supabase = getSupabase()
      // Force refresh the session
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) throw error
      
      setSessionInfo(JSON.stringify({
        session: data.session,
        user: data.user,
        message: "Session refreshed successfully",
        timestamp: new Date().toISOString()
      }, null, 2))
      
      setRefreshCount(prev => prev + 1)
    } catch (err: any) {
      setError(err.message || "Error fixing session")
    }
  }
  
  const handleGoToDashboard = () => {
    if (user?.user_metadata?.isEmployer) {
      window.location.href = '/employer/dashboard'
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>
            Use this page to diagnose authentication issues
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Status</h3>
              <div className="p-4 rounded bg-muted">
                <p><strong>Loading:</strong> {loading ? "True" : "False"}</p>
                <p><strong>User:</strong> {user ? "Authenticated" : "Not authenticated"}</p>
                <p><strong>Email:</strong> {user?.email || "None"}</p>
                <p><strong>User ID:</strong> {user?.id || "None"}</p>
                <p><strong>User type:</strong> {user?.user_metadata?.isEmployer ? "Employer" : "Job seeker"}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Actions</h3>
              <div className="space-y-2">
                <Button onClick={handleRefresh} className="w-full" variant="outline">
                  Refresh Session Info
                </Button>
                <Button onClick={handleFixSession} className="w-full" variant="outline">
                  Fix Session
                </Button>
                <Button onClick={handleClearStorage} className="w-full" variant="outline">
                  Clear Local Storage
                </Button>
                <Button onClick={handleGoToDashboard} className="w-full" variant="default">
                  Go to Dashboard
                </Button>
                <Button onClick={handleLogout} className="w-full" variant="destructive">
                  Logout
                </Button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium mb-2">Session Details</h3>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <pre className="p-4 rounded bg-zinc-900 text-zinc-100 text-sm overflow-auto max-h-96">
                {sessionInfo || "No session data available"}
              </pre>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
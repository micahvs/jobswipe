"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getSupabase, AuthFallback } from "@/lib/supabaseClient"

export default function EmployerLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { toast } = useToast()

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`)
    window.location.href = path
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email || !password) {
        toast({
          title: "Missing information",
          description: "Please enter both email and password",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      console.log(`Attempting employer login with: ${email}`)

      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Check if the error is about email confirmation
        if (
          error.message.includes("Email not confirmed") ||
          error.message.toLowerCase().includes("email confirmation")
        ) {
          setNeedsEmailVerification(true)
          throw new Error("Your email has not been verified. Please check your inbox or click 'Resend Email' below.")
        }
        throw error
      }

      // Check if user is an employer
      const isEmployer = data.user?.user_metadata?.isEmployer

      if (!isEmployer) {
        // Sign out if not an employer
        await supabase.auth.signOut()
        throw new Error("This login is for employers only. Please use the regular login for job seekers.")
      }

      console.log("Employer login successful")

      // Store user info in localStorage as a fallback
      AuthFallback.storeUserInfo({
        id: data.user.id,
        email: data.user.email,
        isEmployer: true,
      })

      toast({
        title: "Login successful",
        description: "You are now logged in. Please use the navigation links below.",
        type: "success",
      })

      setLoginSuccess(true)
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        type: "error",
      })
      return
    }

    setIsResendingEmail(true)

    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) throw error

      toast({
        title: "Verification email sent",
        description: "Please check your inbox and follow the link to verify your email",
        type: "success",
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message || "An error occurred",
        type: "error",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Employer Login</CardTitle>
          <CardDescription>Access your employer account to post jobs and find candidates</CardDescription>
        </CardHeader>

        {loginSuccess ? (
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-800">
              <p className="font-medium">Login Successful!</p>
              <p className="mt-1">You are now logged in. Please use one of the links below to navigate.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Navigation:</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={() => handleNavigation("/employer/dashboard")} className="w-full">
                  Go to Employer Dashboard
                </Button>
                <Button onClick={() => handleNavigation("/employer/post-job")} variant="outline" className="w-full">
                  Post a Job
                </Button>
                <Button onClick={() => handleNavigation("/employer/profile")} variant="outline" className="w-full">
                  Update Company Profile
                </Button>
                <Button onClick={() => handleNavigation("/auth/debug")} variant="secondary" className="w-full">
                  Auth Debug Page
                </Button>
              </div>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {needsEmailVerification && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-sm">
                  <p className="font-medium">Email verification required</p>
                  <p className="mt-1">Please check your inbox and verify your email before logging in.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-amber-100 hover:bg-amber-200 border-amber-300"
                    onClick={handleResendVerificationEmail}
                    disabled={isResendingEmail}
                  >
                    {isResendingEmail ? "Sending..." : "Resend verification email"}
                  </Button>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>
                  Having trouble logging in? Try our{" "}
                  <Link href="/auth/debug" className="text-primary hover:underline">
                    Auth Debug Page
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an employer account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}


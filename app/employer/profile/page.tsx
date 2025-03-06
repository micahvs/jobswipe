"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function EmployerProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  
  const [profile, setProfile] = useState({
    companyName: "Acme Inc",
    industry: "Technology",
    website: "https://acme.example.com",
    location: "San Francisco, CA",
    about: "Acme Inc is a leading technology company specializing in cutting-edge solutions.",
    size: "50-100",
    founded: "2010",
    logo: "/placeholder.svg"
  })
  
  // Client-side only effect to check auth and prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Get auth data from session storage as a fallback
    const sessionEmail = sessionStorage.getItem('auth_user_email')
    const sessionId = sessionStorage.getItem('auth_user_id')
    const isEmployer = sessionStorage.getItem('auth_user_is_employer') === 'true'
    
    if ((!user && !sessionEmail && !loading && mounted) || 
        (user && !user.user_metadata?.isEmployer && !isEmployer)) {
      console.log("Employer profile page - Not authenticated as employer, redirecting to login")
      router.push('/employer/login')
    }
  }, [user, loading, mounted, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile Updated",
      description: "Your company profile has been successfully updated.",
      type: "success",
      duration: 3000
    })
  }

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Loading company profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Company Profile</h1>
      
      {user && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <p className="font-medium text-green-800">Editing profile for {user.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Input
                  id="size"
                  value={profile.size}
                  onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded">Founded Year</Label>
                <Input
                  id="founded"
                  value={profile.founded}
                  onChange={(e) => setProfile({ ...profile, founded: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Company</Label>
              <Textarea
                id="about"
                rows={4}
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
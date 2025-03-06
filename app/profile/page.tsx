"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface JobPreferences {
  remote: boolean
  fullTime: boolean
  contract: boolean
  relocation: boolean
}

interface ProfileData {
  name: string
  title: string
  location: string
  about: string
  skills: string[]
  newSkill: string
  jobPreferences: JobPreferences
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "David Smith",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    about: "Passionate developer with 5 years of experience in web technologies.",
    skills: ["JavaScript", "React", "TypeScript", "CSS"],
    newSkill: "",
    jobPreferences: {
      remote: true,
      fullTime: true,
      contract: false,
      relocation: false,
    },
  })

  const { toast } = useToast()
  
  // Client-side only effect to check auth and prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Get auth data from session storage as a fallback
    const sessionEmail = sessionStorage.getItem('auth_user_email')
    const sessionId = sessionStorage.getItem('auth_user_id')
    
    if (!user && !sessionEmail && !loading && mounted) {
      console.log("Profile page - Not authenticated, redirecting to login")
      router.push('/login')
    }
  }, [user, loading, mounted, router])

  const handleSkillAdd = () => {
    if (profile.newSkill && !profile.skills.includes(profile.newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, profile.newSkill],
        newSkill: "",
      })
    }
  }

  const handleSkillRemove = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    })
  }

  // Properly type the checked parameter
  const handlePreferenceChange = (key: keyof JobPreferences, checked: boolean | "indeterminate") => {
    setProfile((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        [key]: checked === true,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      type: "success",
    })
  }

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      {user && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <p className="font-medium text-green-800">Editing profile for {user.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                rows={4}
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => handleSkillRemove(skill)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={profile.newSkill}
                onChange={(e) => setProfile({ ...profile, newSkill: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSkillAdd()
                  }
                }}
              />
              <Button type="button" onClick={handleSkillAdd}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={profile.jobPreferences.remote}
                  onCheckedChange={(checked: boolean | "indeterminate") => handlePreferenceChange("remote", checked)}
                />
                <Label htmlFor="remote">Open to remote work</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fullTime"
                  checked={profile.jobPreferences.fullTime}
                  onCheckedChange={(checked: boolean | "indeterminate") => handlePreferenceChange("fullTime", checked)}
                />
                <Label htmlFor="fullTime">Full-time positions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contract"
                  checked={profile.jobPreferences.contract}
                  onCheckedChange={(checked: boolean | "indeterminate") => handlePreferenceChange("contract", checked)}
                />
                <Label htmlFor="contract">Contract work</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relocation"
                  checked={profile.jobPreferences.relocation}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    handlePreferenceChange("relocation", checked)
                  }
                />
                <Label htmlFor="relocation">Willing to relocate</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Profile</Button>
        </div>
      </form>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { UserIcon, BriefcaseIcon, BarChartIcon } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-client"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is an employer
    if (user && user.user_metadata?.isEmployer) {
      setError("This dashboard is for job seekers. Please use the employer dashboard.")
    }
  }, [user])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 mb-4">
          <p className="font-medium">Authentication Error</p>
          <p className="mt-1">{error}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/employer/dashboard">Go to Employer Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 mb-4">
          <p className="font-medium">Not Authenticated</p>
          <p className="mt-1">You need to log in to access this page.</p>
        </div>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 p-4 rounded-md">
        <p className="font-medium text-green-800">Successfully logged in as {user.email || "a job seeker"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard icon={<UserIcon className="h-6 w-6 text-primary" />} title="Complete Your Profile">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/profile">Update Profile</Link>
          </Button>
        </DashboardCard>

        <DashboardCard
          icon={<BriefcaseIcon className="h-6 w-6 text-primary" />}
          title="Start Job Search"
          description="Find your perfect match"
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </DashboardCard>

        <DashboardCard
          icon={<BarChartIcon className="h-6 w-6 text-primary" />}
          title="Your Matches"
          description="See who liked your profile"
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/matches">View Matches</Link>
          </Button>
        </DashboardCard>
      </div>
    </div>
  )
}


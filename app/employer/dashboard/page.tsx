"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { UserIcon, BriefcaseIcon, BarChartIcon, UsersIcon } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/lib/auth"

export default function EmployerDashboard() {
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)
    
    // Check if user is NOT an employer
    if (user && !user.user_metadata?.isEmployer) {
      setError("This dashboard is for employers. Please use the job seeker dashboard.")
    }
  }, [user])

  // Don't render anything on server to prevent hydration mismatch
  if (!mounted) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }

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
            <Link href="/employer/login">Go to Employer Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to Job Seeker Dashboard</Link>
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
          <p className="mt-1">You need to log in as an employer to access this page.</p>
        </div>
        <Button asChild>
          <Link href="/employer/login">Go to Employer Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 p-4 rounded-md">
        <p className="font-medium text-green-800">Successfully logged in as {user.email || "an employer"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard icon={<UserIcon className="h-6 w-6 text-primary" />} title="Company Profile">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/employer/profile">Update Profile</Link>
          </Button>
        </DashboardCard>

        <DashboardCard
          icon={<BriefcaseIcon className="h-6 w-6 text-primary" />}
          title="Post a New Job"
          description="Find the perfect candidate"
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/employer/post-job">Post Job</Link>
          </Button>
        </DashboardCard>

        <DashboardCard
          icon={<UsersIcon className="h-6 w-6 text-primary" />}
          title="Candidate Matches"
          description="See who matched with your jobs"
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/employer/candidates">View Candidates</Link>
          </Button>
        </DashboardCard>

        <DashboardCard
          icon={<BarChartIcon className="h-6 w-6 text-primary" />}
          title="Job Analytics"
          description="Track your job performance"
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/employer/analytics">View Analytics</Link>
          </Button>
        </DashboardCard>
      </div>
    </div>
  )
}

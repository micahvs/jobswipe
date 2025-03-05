"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { UserIcon, BriefcaseIcon, BarChartIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"

export default function EmployerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Employer Dashboard: Checking user authentication")
        const supabase = getSupabase()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          console.log("Employer Dashboard: No user found, redirecting to login")
          window.location.replace("/employer/login")
          return
        }

        // Check if user is an employer
        if (!user.user_metadata?.isEmployer) {
          console.log("Employer Dashboard: User is not an employer, redirecting to job seeker dashboard")
          window.location.replace("/dashboard")
          return
        }

        console.log("Employer Dashboard: Employer authenticated:", user.email)
        setUser(user)
      } catch (error: any) {
        console.error("Employer Dashboard: Error checking user:", error)
        setError(error.message)
        // Don't redirect on error, show the error instead
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

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
        <Button asChild>
          <Link href="/employer/login">Go to Employer Login</Link>
        </Button>
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
  )
}


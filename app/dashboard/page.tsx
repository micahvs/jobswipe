"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { UserIcon, BriefcaseIcon, BarChartIcon } from "lucide-react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = getSupabase()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          // Not logged in, redirect to login
          console.log("No user found, redirecting to login")
          router.push("/login")
          return
        }

        // Check if user is an employer
        if (user.user_metadata?.isEmployer) {
          console.log("User is an employer, redirecting to employer dashboard")
          router.push("/employer/dashboard")
          return
        }

        console.log("User authenticated:", user)
        setUser(user)
      } catch (error) {
        console.error("Error checking user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!user) {
    return <div className="p-8 text-center">Redirecting to login...</div>
  }

  return (
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
  )
}


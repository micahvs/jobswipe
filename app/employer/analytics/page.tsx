"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface JobStats {
  id: number
  title: string
  views: number
  likes: number
  matches: number
  daysActive: number
}

// Sample analytics data
const SAMPLE_JOB_STATS: JobStats[] = [
  {
    id: 1,
    title: "Frontend Developer",
    views: 125,
    likes: 42,
    matches: 8,
    daysActive: 7,
  },
  {
    id: 2,
    title: "Backend Engineer",
    views: 98,
    likes: 33,
    matches: 5,
    daysActive: 5,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    views: 156,
    likes: 51,
    matches: 12,
    daysActive: 10,
  },
]

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  // Client-side only effect to check auth and prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Get auth data from session storage as a fallback
    const sessionEmail = sessionStorage.getItem('auth_user_email')
    const sessionId = sessionStorage.getItem('auth_user_id')
    const isEmployer = sessionStorage.getItem('auth_user_is_employer') === 'true'
    
    if ((!user && !sessionEmail && !loading && mounted) || 
        (user && !user.user_metadata?.isEmployer && !isEmployer)) {
      console.log("Employer analytics page - Not authenticated as employer, redirecting to login")
      router.push('/employer/login')
    }
  }, [user, loading, mounted, router])

  const getTotalStats = () => {
    return SAMPLE_JOB_STATS.reduce(
      (acc, job) => {
        acc.views += job.views
        acc.likes += job.likes
        acc.matches += job.matches
        return acc
      },
      { views: 0, likes: 0, matches: 0 }
    )
  }

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Loading analytics...</p>
      </div>
    )
  }

  const totalStats = getTotalStats()

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Job Analytics</h1>
      
      {user && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <p className="font-medium text-green-800 text-sm text-center">Logged in as {user.email}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStats.views}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Profile views across all jobs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStats.likes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Candidates who liked your jobs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStats.matches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mutual matches ready for contact
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-4">Job Performance</h2>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left font-medium">Job Title</th>
              <th className="py-3 px-4 text-center font-medium">Days Active</th>
              <th className="py-3 px-4 text-center font-medium">Views</th>
              <th className="py-3 px-4 text-center font-medium">Likes</th>
              <th className="py-3 px-4 text-center font-medium">Matches</th>
              <th className="py-3 px-4 text-center font-medium">Match Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {SAMPLE_JOB_STATS.map((job) => (
              <tr key={job.id} className="hover:bg-muted/25">
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4 text-center">{job.daysActive}</td>
                <td className="py-3 px-4 text-center">{job.views}</td>
                <td className="py-3 px-4 text-center">{job.likes}</td>
                <td className="py-3 px-4 text-center">{job.matches}</td>
                <td className="py-3 px-4 text-center">
                  {((job.matches / job.views) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4 text-center">
        Data shown is for demonstration purposes only
      </div>
    </div>
  )
}
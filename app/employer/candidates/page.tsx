"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircleIcon, UserIcon, CheckIcon, XIcon } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Candidate {
  id: number
  name: string
  title: string
  location: string
  skills: string[]
  matchScore: number
  hasChat: boolean
  lastMessage?: string
  unread?: boolean
}

// Sample candidates data
const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    skills: ["React", "TypeScript", "CSS", "HTML"],
    matchScore: 95,
    hasChat: true,
    lastMessage: "Hi, I'm interested in learning more about the position.",
    unread: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Backend Engineer",
    location: "Remote",
    skills: ["Node.js", "PostgreSQL", "Express", "API Design"],
    matchScore: 87,
    hasChat: true,
    lastMessage: "Thanks for reaching out!",
    unread: false,
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    location: "New York, NY",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    matchScore: 82,
    hasChat: false,
  },
]

export default function CandidatesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>(SAMPLE_CANDIDATES)
  const { toast } = useToast()
  
  // Client-side only effect to check auth and prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Get auth data from session storage as a fallback
    const sessionEmail = sessionStorage.getItem('auth_user_email')
    const sessionId = sessionStorage.getItem('auth_user_id')
    const isEmployer = sessionStorage.getItem('auth_user_is_employer') === 'true'
    
    if ((!user && !sessionEmail && !loading && mounted) || 
        (user && !user.user_metadata?.isEmployer && !isEmployer)) {
      console.log("Employer candidates page - Not authenticated as employer, redirecting to login")
      router.push('/employer/login')
    }
  }, [user, loading, mounted, router])

  const handleCandidateAction = (id: number, approved: boolean) => {
    setCandidates(candidates.filter(c => c.id !== id))
    
    toast({
      title: approved ? "Candidate Approved" : "Candidate Declined",
      description: `You have ${approved ? 'approved' : 'declined'} this candidate.`,
      type: approved ? "success" : "info",
      duration: 2000
    })
  }

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Loading candidates...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Candidate Matches</h1>
      
      {user && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <p className="font-medium text-green-800 text-sm text-center">Logged in as {user.email}</p>
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any candidate matches yet.</p>
          <Button 
            onClick={() => setCandidates(SAMPLE_CANDIDATES)}
            className="bg-primary hover:bg-primary/90"
          >
            Reset Demo
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <div className="flex">
                <div className="p-6 flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Location: {candidate.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {candidate.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {candidate.hasChat && candidate.lastMessage && (
                    <div className="text-sm mb-3 border-l-2 pl-3 border-muted">
                      <p className={candidate.unread ? "font-medium" : ""}>
                        <span className="text-xs text-muted-foreground">Message: </span>
                        {candidate.lastMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                      onClick={() => handleCandidateAction(candidate.id, true)}
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={() => handleCandidateAction(candidate.id, false)}
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    
                    <Button 
                      variant={candidate.unread ? "default" : "outline"} 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Chat opened",
                          description: "This feature is not implemented in the demo.",
                          type: "info",
                          duration: 2000
                        })
                      }}
                    >
                      <MessageCircleIcon className="h-4 w-4 mr-1" />
                      {candidate.hasChat ? "Continue Chat" : "Start Chat"}
                      {candidate.unread && (
                        <span className="ml-1 bg-primary-foreground text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          1
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {candidate.unread && <div className="w-2 bg-primary" />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
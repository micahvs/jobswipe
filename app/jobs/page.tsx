"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon, XIcon } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  description: string
  skills: string[]
}

// Sample job data
const SAMPLE_JOBS: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000",
    description: "We're looking for a skilled Frontend Developer with experience in React and TypeScript.",
    skills: ["React", "TypeScript", "CSS", "HTML"],
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "Remote",
    salary: "$130,000 - $160,000",
    description: "Join our team as a Backend Engineer working with Node.js and PostgreSQL.",
    skills: ["Node.js", "PostgreSQL", "Express", "API Design"],
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupX",
    location: "New York, NY",
    salary: "$140,000 - $170,000",
    description: "Looking for a Full Stack Developer to help build our next-generation platform.",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
  },
]

export default function JobsPage() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [swipedJobs, setSwipedJobs] = useState<number[]>([])
  const [likedJobs, setLikedJobs] = useState<number[]>([])
  const { toast } = useToast()

  const currentJob = SAMPLE_JOBS[currentJobIndex]
  const isLastJob = currentJobIndex === SAMPLE_JOBS.length - 1

  const handleSwipe = (liked: boolean) => {
    const jobId = currentJob.id

    setSwipedJobs([...swipedJobs, jobId])

    if (liked) {
      setLikedJobs([...likedJobs, jobId])
      toast({
        title: "Job Liked!",
        description: `You liked ${currentJob.title} at ${currentJob.company}`,
        type: "success"
      })
    }

    if (isLastJob) {
      toast({
        title: "No more jobs",
        description: "You've viewed all available jobs.",
        type: "info"
      })
    } else {
      setCurrentJobIndex(currentJobIndex + 1)
    }
  }

  if (swipedJobs.length === SAMPLE_JOBS.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-4">
        <h2 className="text-2xl font-bold mb-4">No More Jobs</h2>
        <p className="text-muted-foreground mb-6">You've viewed all available jobs.</p>
        {likedJobs.length > 0 && (
          <div className="text-center">
            <h3 className="font-medium mb-2">Jobs you liked:</h3>
            <ul className="list-disc list-inside">
              {likedJobs.map((id) => {
                const job = SAMPLE_JOBS.find((j) => j.id === id)
                return (
                  job && (
                    <li key={id} className="mb-1">
                      {job.title} at {job.company}
                    </li>
                  )
                )
              })}
            </ul>
          </div>
        )}
        <Button
          onClick={() => {
            setCurrentJobIndex(0)
            setSwipedJobs([])
            setLikedJobs([])
          }}
          className="mt-6"
        >
          Start Over
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Find Your Match</h1>

      <div className="relative">
        <Card className="p-6 shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-bold">{currentJob.title}</h2>
            <p className="text-muted-foreground">{currentJob.company}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm mb-1">
              <strong>Location:</strong> {currentJob.location}
            </p>
            <p className="text-sm mb-1">
              <strong>Salary:</strong> {currentJob.salary}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm">{currentJob.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {currentJob.skills.map((skill, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-destructive"
            onClick={() => handleSwipe(false)}
          >
            <XIcon className="h-6 w-6 text-destructive" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-primary"
            onClick={() => handleSwipe(true)}
          >
            <CheckIcon className="h-6 w-6 text-primary" />
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {currentJobIndex + 1} of {SAMPLE_JOBS.length} jobs
        </div>
      </div>
    </div>
  )
}

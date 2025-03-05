"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function PostJobPage() {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    skills: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!jobData.title || !jobData.company || !jobData.description) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      // In a real app, you would send this data to your backend
      // For demo purposes, we'll just simulate a successful job posting

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now visible to candidates",
        type: "success",
      })

      // Redirect to employer dashboard
      router.push("/employer/dashboard")
    } catch (error) {
      toast({
        title: "Failed to post job",
        description: "An error occurred while posting your job",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Inc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="e.g. $80,000 - $100,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                placeholder="List education, experience, and other requirements..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input
                id="skills"
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                placeholder="e.g. React, TypeScript, Node.js (comma separated)"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </form>
    </div>
  )
}


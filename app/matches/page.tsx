"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircleIcon, UserIcon } from "lucide-react"
import Link from "next/link"

interface Match {
  id: number
  company: string
  position: string
  matchedOn: string
  logo: string
  hasChat: boolean
  lastMessage?: string
  unread?: boolean
}

// Sample matches data
const SAMPLE_MATCHES: Match[] = [
  {
    id: 1,
    company: "TechCorp",
    position: "Frontend Developer",
    matchedOn: "2025-03-01",
    logo: "/placeholder.svg?height=40&width=40",
    hasChat: true,
    lastMessage: "Hi David, we'd love to schedule an interview with you.",
    unread: true,
  },
  {
    id: 2,
    company: "StartupX",
    position: "Full Stack Developer",
    matchedOn: "2025-02-28",
    logo: "/placeholder.svg?height=40&width=40",
    hasChat: true,
    lastMessage: "Thanks for your interest in our position!",
    unread: false,
  },
  {
    id: 3,
    company: "DataSystems",
    position: "Backend Engineer",
    matchedOn: "2025-02-25",
    logo: "/placeholder.svg?height=40&width=40",
    hasChat: false,
  },
]

export default function MatchesPage() {
  const [matches] = useState<Match[]>(SAMPLE_MATCHES)

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any matches yet.</p>
          <Button asChild>
            <Link href="/jobs">Start Swiping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <div className="flex">
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={match.logo || "/placeholder.svg"}
                        alt={match.company}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{match.company}</h3>
                      <p className="text-sm text-muted-foreground">{match.position}</p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    Matched on {new Date(match.matchedOn).toLocaleDateString()}
                  </div>

                  {match.hasChat && match.lastMessage && (
                    <div className="text-sm mb-3 border-l-2 pl-3 border-muted">
                      <p className={match.unread ? "font-medium" : ""}>{match.lastMessage}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/company/${match.id}`}>
                        <UserIcon className="h-4 w-4 mr-1" />
                        View Profile
                      </Link>
                    </Button>

                    <Button variant={match.unread ? "default" : "outline"} size="sm" asChild>
                      <Link href={`/chat/${match.id}`}>
                        <MessageCircleIcon className="h-4 w-4 mr-1" />
                        {match.hasChat ? "Continue Chat" : "Start Chat"}
                        {match.unread && (
                          <span className="ml-1 bg-primary-foreground text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                            1
                          </span>
                        )}
                      </Link>
                    </Button>
                  </div>
                </div>

                {match.unread && <div className="w-2 bg-primary" />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


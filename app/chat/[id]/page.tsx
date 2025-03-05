"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon } from "lucide-react"

type MessageSender = "user" | "company"

interface Company {
  id: number
  name: string
  position: string
  logo: string
}

interface ChatMessage {
  id: number
  sender: MessageSender
  text: string
  timestamp: string
}

// Sample company data
const COMPANIES: Record<number, Company> = {
  1: {
    id: 1,
    name: "TechCorp",
    position: "Frontend Developer",
    logo: "/placeholder.svg?height=40&width=40",
  },
  2: {
    id: 2,
    name: "StartupX",
    position: "Full Stack Developer",
    logo: "/placeholder.svg?height=40&width=40",
  },
  3: {
    id: 3,
    name: "DataSystems",
    position: "Backend Engineer",
    logo: "/placeholder.svg?height=40&width=40",
  },
}

// Sample chat messages
const INITIAL_CHATS: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "company",
      text: "Hi David, we'd love to schedule an interview with you.",
      timestamp: "2025-03-04T14:30:00",
    },
  ],
  2: [
    {
      id: 1,
      sender: "company",
      text: "Thanks for your interest in our position!",
      timestamp: "2025-03-03T10:15:00",
    },
  ],
  3: [],
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const companyId = Number.parseInt(params.id)
  const company = COMPANIES[companyId]

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHATS[companyId] || [])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]) //Fixed useEffect dependency

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate company response after a delay
    if (messages.length === 0) {
      setTimeout(() => {
        const response: ChatMessage = {
          id: messages.length + 2,
          sender: "company",
          text: `Thanks for reaching out! We're excited about your interest in the ${company.position} position.`,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, response])
      }, 1500)
    }
  }

  if (!company) {
    return <div className="p-4">Company not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-12rem)] flex flex-col p-4">
      <div className="flex items-center gap-3 mb-4 p-4 border-b">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          <img src={company.logo || "/placeholder.svg"} alt={company.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="font-medium">{company.name}</h2>
          <p className="text-sm text-muted-foreground">{company.position}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}


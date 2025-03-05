import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
}

export function DashboardCard({ icon, title, description, children }: DashboardCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {icon}
        <h2 className="text-lg font-medium">{title}</h2>
      </CardHeader>
      <CardContent>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        {children}
      </CardContent>
    </Card>
  )
}


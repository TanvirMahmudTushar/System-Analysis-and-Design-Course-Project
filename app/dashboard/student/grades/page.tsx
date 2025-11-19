"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { Star, MessageSquare } from "lucide-react"

export default function GradesPage() {
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app would fetch from API
    setGrades([
      {
        id: 1,
        subject: "Mathematics",
        assignment: "Algebra Basics",
        marks: 85,
        maxMarks: 100,
        percentage: 85,
        date: "2025-11-08",
        feedback:
          "Great effort on the algebraic expressions! Your understanding of polynomial equations is solid. Work on simplifying complex fractions for next time.",
        status: "excellent",
      },
      {
        id: 2,
        subject: "English",
        assignment: "Essay Writing",
        marks: 78,
        maxMarks: 100,
        percentage: 78,
        date: "2025-11-05",
        feedback:
          "Good narrative flow and structure. Your arguments are well-supported with examples. Try to reduce wordiness in some paragraphs.",
        status: "good",
      },
      {
        id: 3,
        subject: "Science",
        assignment: "Physics Lab Report",
        marks: 92,
        maxMarks: 100,
        percentage: 92,
        date: "2025-11-01",
        feedback:
          "Excellent experimental design and data analysis. Your conclusions are well-reasoned and supported by evidence. Outstanding work!",
        status: "excellent",
      },
      {
        id: 4,
        subject: "History",
        assignment: "Project Presentation",
        marks: 88,
        maxMarks: 100,
        percentage: 88,
        date: "2025-10-28",
        feedback: "Comprehensive research and engaging presentation. Include more primary sources in future projects.",
        status: "excellent",
      },
    ])
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-accent text-accent-foreground"
      case "good":
        return "bg-primary text-primary-foreground"
      case "average":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return "text-accent"
    if (percentage >= 80) return "text-primary"
    if (percentage >= 70) return "text-secondary"
    return "text-destructive"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Student" }} onLogout={() => {}} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Grades & Feedback</h1>
          <p className="text-muted-foreground">Review your performance and AI-generated feedback</p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {grades.map((grade) => (
              <Card key={grade.id} className="bg-card border-border hover:border-primary/50 transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{grade.assignment}</h3>
                        <Badge className={getStatusColor(grade.status)}>
                          {grade.status.charAt(0).toUpperCase() + grade.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {grade.subject} • {grade.date}
                      </p>

                      <div className="p-4 bg-background rounded border border-border mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-primary mb-1">AI Feedback</p>
                            <p className="text-sm text-foreground leading-relaxed">{grade.feedback}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className={`text-4xl font-bold ${getPercentageColor(grade.percentage)}`}>
                          {grade.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {grade.marks}/{grade.maxMarks}
                      </p>

                      <div className="mt-4 flex gap-1 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(grade.percentage / 20) ? "fill-accent text-accent" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

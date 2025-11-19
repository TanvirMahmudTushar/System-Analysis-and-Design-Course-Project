"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { BookOpen, CheckCircle2 } from "lucide-react"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock enrolled courses
    setCourses([
      {
        id: 1,
        title: "Mathematics 101",
        teacher: "Dr. Smith",
        progress: 65,
        grade: "A-",
        assignments: { completed: 6, total: 8 },
        status: "active",
      },
      {
        id: 2,
        title: "English Literature",
        teacher: "Prof. Johnson",
        progress: 72,
        grade: "B+",
        assignments: { completed: 5, total: 6 },
        status: "active",
      },
      {
        id: 3,
        title: "Physics Advanced",
        teacher: "Dr. Wilson",
        progress: 58,
        grade: "B",
        assignments: { completed: 5, total: 10 },
        status: "active",
      },
      {
        id: 4,
        title: "Chemistry Basics",
        teacher: "Prof. Davis",
        progress: 80,
        grade: "A",
        assignments: { completed: 7, total: 7 },
        status: "completed",
      },
    ])
    setLoading(false)
  }, [])

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-accent"
    if (progress >= 60) return "bg-primary"
    return "bg-secondary"
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-accent text-accent-foreground"
    if (grade.startsWith("B")) return "bg-primary text-primary-foreground"
    if (grade.startsWith("C")) return "bg-secondary text-secondary-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Student" }} onLogout={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground">Track your enrollment and progress</p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="bg-card border-border hover:border-primary/50 transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">Instructor: {course.teacher}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-foreground">Course Progress</span>
                          <span className="text-sm font-bold text-foreground">{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-background rounded-full">
                          <div
                            className={`h-full ${getProgressColor(course.progress)} rounded-full transition-all`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {course.assignments.completed}/{course.assignments.total} assignments
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge className={getGradeColor(course.grade)}>Grade: {course.grade}</Badge>
                      <Badge variant="outline" className="border-border">
                        {course.status === "completed" ? "Completed" : "Active"}
                      </Badge>
                      <Button className="bg-primary hover:bg-primary/90">View Course</Button>
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

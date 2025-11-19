"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { BookOpen, Plus, Users, Calendar } from "lucide-react"

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock courses data
    setCourses([
      {
        id: 1,
        title: "Mathematics 101",
        description: "Introduction to Algebra and Geometry",
        students: 32,
        assignments: 8,
        createdDate: "2025-09-01",
        status: "active",
      },
      {
        id: 2,
        title: "English Literature",
        description: "Classic and Modern Literature Analysis",
        students: 28,
        assignments: 6,
        createdDate: "2025-09-05",
        status: "active",
      },
      {
        id: 3,
        title: "Physics Advanced",
        description: "Advanced Mechanics and Electromagnetism",
        students: 24,
        assignments: 10,
        createdDate: "2025-09-10",
        status: "active",
      },
      {
        id: 4,
        title: "Chemistry Basics",
        description: "Fundamental Concepts of Chemistry",
        students: 30,
        assignments: 7,
        createdDate: "2025-09-15",
        status: "active",
      },
    ])
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCourse = {
      id: courses.length + 1,
      ...formData,
      students: 0,
      assignments: 0,
      createdDate: new Date().toISOString().split("T")[0],
      status: "active",
    }
    setCourses([...courses, newCourse])
    setFormData({ title: "", description: "" })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Teacher" }} onLogout={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground">Create and manage your courses</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        </div>

        {showForm && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Mathematics 101"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Course description and objectives..."
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Create Course
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-card border-border hover:border-primary/50 transition">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="mt-1">{course.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className="ml-2 bg-accent text-accent-foreground">{course.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Students Enrolled</span>
                      </div>
                      <span className="font-semibold text-foreground">{course.students}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Created</span>
                      </div>
                      <span className="font-semibold text-foreground">{course.createdDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                      View Details
                    </Button>
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

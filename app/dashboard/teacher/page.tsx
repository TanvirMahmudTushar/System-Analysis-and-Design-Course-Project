"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, PlusCircle, BarChart3 } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"

export default function TeacherDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userData || !token) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage courses, students, and assessments</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">48</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Active Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">5</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Avg Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">82%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Manage your active courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Mathematics 101", "Physics Advanced", "Chemistry Basics", "Biology Lab", "English Literature"].map(
                  (course, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-background rounded border border-border"
                    >
                      <span className="font-medium text-foreground">{course}</span>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </div>
                  ),
                )}
              </div>
              <Button className="w-full mt-4 gap-2 bg-primary hover:bg-primary/90">
                <PlusCircle className="w-4 h-4" />
                Create Course
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Pending student submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Alice - Math Assignment",
                  "Bob - Physics Lab",
                  "Carol - Essay Submission",
                  "David - Project Work",
                ].map((submission, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-background rounded border border-border"
                  >
                    <span className="text-sm text-foreground">{submission}</span>
                    <Button variant="outline" size="sm">
                      Grade
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Student performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Class 10-A", avg: 85 },
                { name: "Class 10-B", avg: 78 },
                { name: "Class 11-A", avg: 88 },
              ].map((cls, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{cls.name}</span>
                    <span className="text-sm font-bold text-primary">{cls.avg}%</span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${cls.avg}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

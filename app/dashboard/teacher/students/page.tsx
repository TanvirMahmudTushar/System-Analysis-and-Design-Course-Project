"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DashboardNav from "@/components/dashboard-nav"
import { Search, Mail } from "lucide-react"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock student data
    setStudents([
      {
        id: 1,
        name: "Alice Johnson",
        rollNumber: "101",
        email: "alice@school.com",
        grade: "Grade 10",
        attendance: 92,
        avgScore: 85,
      },
      {
        id: 2,
        name: "Bob Smith",
        rollNumber: "102",
        email: "bob@school.com",
        grade: "Grade 10",
        attendance: 88,
        avgScore: 78,
      },
      {
        id: 3,
        name: "Carol Davis",
        rollNumber: "103",
        email: "carol@school.com",
        grade: "Grade 10",
        attendance: 95,
        avgScore: 92,
      },
      {
        id: 4,
        name: "David Wilson",
        rollNumber: "104",
        email: "david@school.com",
        grade: "Grade 10",
        attendance: 75,
        avgScore: 72,
      },
    ])
    setLoading(false)
  }, [])

  const filteredStudents = students.filter(
    (student) => student.name.toLowerCase().includes(search.toLowerCase()) || student.rollNumber.includes(search),
  )

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-accent"
    if (attendance >= 80) return "text-primary"
    return "text-secondary"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Teacher" }} onLogout={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Students</h1>
          <p className="text-muted-foreground">View and track your students' academic progress</p>
        </div>

        <Card className="bg-card border-border mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Search className="w-5 h-5 text-muted-foreground mt-2.5" />
              <Input
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-card border-border hover:border-primary/50 transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Roll: {student.rollNumber}</span>
                        <span>•</span>
                        <span>{student.grade}</span>
                      </div>
                      <div className="flex gap-4 mt-3">
                        <a
                          href={`mailto:${student.email}`}
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 lg:text-right">
                      <div>
                        <p className={`text-2xl font-bold ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Attendance</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{student.avgScore}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          View Grades
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Grade
                        </Button>
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

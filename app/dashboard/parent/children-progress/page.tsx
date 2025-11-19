"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import DashboardNav from "@/components/dashboard-nav"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ChildrenProgressPage() {
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock children progress data
    setChildren([
      {
        id: 1,
        name: "Alex Johnson",
        grade: "Grade 10",
        progressData: [
          { date: "Nov 1", score: 75, attendance: 90 },
          { date: "Nov 5", score: 78, attendance: 92 },
          { date: "Nov 8", score: 82, attendance: 95 },
          { date: "Nov 10", score: 85, attendance: 96 },
        ],
        subjects: [
          { name: "Mathematics", score: 85, trend: "up" },
          { name: "English", score: 78, trend: "stable" },
          { name: "Science", score: 92, trend: "up" },
          { name: "History", score: 88, trend: "up" },
        ],
        alerts: ["Missing assignment in Science", "Good improvement in Math"],
      },
      {
        id: 2,
        name: "Sam Johnson",
        grade: "Grade 8",
        progressData: [
          { date: "Nov 1", score: 70, attendance: 85 },
          { date: "Nov 5", score: 72, attendance: 87 },
          { date: "Nov 8", score: 75, attendance: 88 },
          { date: "Nov 10", score: 78, attendance: 90 },
        ],
        subjects: [
          { name: "Mathematics", score: 78, trend: "up" },
          { name: "English", score: 72, trend: "down" },
          { name: "Science", score: 80, trend: "stable" },
          { name: "History", score: 75, trend: "up" },
        ],
        alerts: ["Needs support in English Literature"],
      },
    ])
    setLoading(false)
  }, [])

  const child = children[selectedChild]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↑"
    if (trend === "down") return "↓"
    return "→"
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-accent"
    if (trend === "down") return "text-destructive"
    return "text-secondary"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Parent" }} onLogout={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Children's Progress</h1>
          <p className="text-muted-foreground">Comprehensive academic performance tracking</p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Child Selection */}
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {children.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChild(idx)}
                  className={`px-6 py-2 rounded whitespace-nowrap transition ${
                    selectedChild === idx
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border hover:border-primary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {child && (
              <>
                {/* Progress Chart */}
                <Card className="bg-card border-border mb-8">
                  <CardHeader>
                    <CardTitle>Academic Performance Trend</CardTitle>
                    <CardDescription>Last 10 days progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={child.progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Average Score" strokeWidth={2} />
                        <Line
                          type="monotone"
                          dataKey="attendance"
                          stroke="#8b5cf6"
                          name="Attendance %"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Subject Performance */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle>Subject Performance</CardTitle>
                      <CardDescription>Current scores and trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {child.subjects.map((subject, idx) => (
                          <div key={idx} className="p-3 bg-background rounded border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">{subject.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">{subject.score}%</span>
                                <span className={`text-lg font-bold ${getTrendColor(subject.trend)}`}>
                                  {getTrendIcon(subject.trend)}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-input rounded-full">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${subject.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts & Notifications */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle>Updates & Alerts</CardTitle>
                      <CardDescription>Important notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {child.alerts.map((alert, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-background rounded border border-border">
                            {alert.includes("Missing") || alert.includes("support") ? (
                              <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm text-foreground">{alert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Overall Statistics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Average</p>
                        <p className="text-3xl font-bold text-primary mt-2">
                          {Math.round(child.subjects.reduce((a, b) => a + b.score, 0) / child.subjects.length)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance</p>
                        <p className="text-3xl font-bold text-accent mt-2">
                          {child.progressData[child.progressData.length - 1].attendance}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Best Subject</p>
                        <p className="text-lg font-bold text-secondary mt-2">
                          {child.subjects.reduce((a, b) => (a.score > b.score ? a : b)).name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

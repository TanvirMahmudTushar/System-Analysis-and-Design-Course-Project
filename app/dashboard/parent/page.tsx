"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, AlertCircle } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"

export default function ParentDashboard() {
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
          <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your child's academic progress</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Children Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">2</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">86%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle>Your Children</CardTitle>
            <CardDescription>View and track your children's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alex Johnson", class: "Grade 10", avg: 85, status: "good" },
                { name: "Sam Johnson", class: "Grade 8", avg: 78, status: "fair" },
              ].map((child, i) => (
                <div key={i} className="p-4 bg-background rounded border border-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{child.name}</h4>
                      <p className="text-sm text-muted-foreground">{child.class}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{child.avg}%</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-secondary" />
              Attention Items
            </CardTitle>
            <CardDescription>Issues that may need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Alex has pending Math assignment due tomorrow",
                "Sam missed Science class on 15th November",
                "Parent-teacher meeting scheduled for 20th November",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-background rounded border border-border">
                  <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

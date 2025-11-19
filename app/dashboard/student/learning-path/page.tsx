"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import DashboardNav from "@/components/dashboard-nav"
import { Lightbulb, Brain, Target, TrendingUp } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function LearningPathPage() {
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState("")

  useEffect(() => {
    // Simulate fetching adaptive learning recommendations from Groq
    const timer = setTimeout(() => {
      setRecommendations(`
1. **Focus on Problem-Solving Fundamentals**
   - Review basic algebra concepts before proceeding to advanced topics
   - Practice with 5-10 problems daily for better retention
   
2. **Engage with Interactive Quizzes**
   - Take adaptive quizzes that adjust difficulty based on your performance
   - Aim for 80% accuracy before moving to the next topic
   
3. **Strengthen Weak Areas in Mathematics**
   - Your recent tests show challenges with trigonometric functions
   - Complete 3 additional practice modules this week
   
4. **Participate in Peer Learning**
   - Join study groups focusing on advanced concepts
   - Help classmates with basic topics to reinforce your own understanding
   
5. **Use Spaced Repetition**
   - Review previously learned concepts every 3 days
   - The system will remind you of topics that need reinforcement
      `)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Student" }} onLogout={() => {}} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Adaptive Learning Path</h1>
          <p className="text-muted-foreground">Personalized recommendations based on your performance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">72%</p>
              <p className="text-sm text-muted-foreground mt-2">Course completion</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Topics Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">8/12</p>
              <p className="text-sm text-muted-foreground mt-2">Core concepts</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>Generated based on your learning analytics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                {recommendations.split("\n\n").map((section, idx) => (
                  <div key={idx} className="mb-6 p-4 bg-background rounded border border-border">
                    {section.split("\n").map((line, lineIdx) => (
                      <div key={lineIdx} className="text-foreground mb-2">
                        {line.startsWith("**") ? (
                          <p className="font-semibold text-primary">{line.replace(/\*\*/g, "")}</p>
                        ) : (
                          <p className="text-muted-foreground text-sm">{line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-foreground">
              <li>✓ Complete trigonometry module</li>
              <li>✓ Take diagnostic quiz on calculus basics</li>
              <li>✓ Join the peer study group meeting tomorrow</li>
              <li>✓ Review spaced repetition reminders</li>
            </ul>
            <Button className="mt-6 bg-primary hover:bg-primary/90">Start Next Topic</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

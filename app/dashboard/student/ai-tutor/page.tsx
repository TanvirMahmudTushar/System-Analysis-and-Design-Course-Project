"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import DashboardNav from "@/components/dashboard-nav"
import { Brain, Zap, BookOpen } from "lucide-react"

export default function AITutorPage() {
  const [activeTab, setActiveTab] = useState<"quiz" | "essay" | "help">("quiz")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [essay, setEssay] = useState("")
  const [rubric, setRubric] = useState("")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  const generateQuiz = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/ai/quiz-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions: 5 }),
      })
      const data = await response.json()
      setResult(data.quiz)
    } catch (error) {
      setResult("Failed to generate quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const evaluateEssay = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/ai/essay-evaluator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, topic, rubric }),
      })
      const data = await response.json()
      setResult(data.evaluation)
    } catch (error) {
      setResult("Failed to evaluate essay. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getHelp = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentPerformance: "average",
          weakAreas: question.split(",").slice(0, 3),
          strongAreas: [],
          averageScore: 75,
        }),
      })
      const data = await response.json()
      setResult(data.recommendations)
    } catch (error) {
      setResult("Failed to get help. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Student" }} onLogout={() => {}} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            AI Tutor
          </h1>
          <p className="text-muted-foreground">Get personalized learning support powered by Groq AI</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quiz Generator */}
          <Card className={`bg-card border-border ${activeTab !== "quiz" && "opacity-50"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Quiz Generator
              </CardTitle>
              <CardDescription>Generate practice quizzes on any topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quiz-topic">Topic</Label>
                <Input
                  id="quiz-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis"
                  className="bg-background border-border"
                  disabled={activeTab !== "quiz"}
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  disabled={activeTab !== "quiz"}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <Button
                onClick={generateQuiz}
                disabled={!topic || loading || activeTab !== "quiz"}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loading ? <Spinner /> : "Generate Quiz"}
              </Button>
            </CardContent>
          </Card>

          {/* Essay Evaluator */}
          <Card className={`bg-card border-border ${activeTab !== "essay" && "opacity-50"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Essay Evaluator
              </CardTitle>
              <CardDescription>Get AI feedback on your essay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="essay">Your Essay</Label>
                <Textarea
                  id="essay"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Paste your essay here..."
                  className="bg-background border-border h-24"
                  disabled={activeTab !== "essay"}
                />
              </div>
              <Button
                onClick={evaluateEssay}
                disabled={!essay || loading || activeTab !== "essay"}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loading ? <Spinner /> : "Evaluate Essay"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <CardTitle>AI Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed p-4 bg-background rounded border border-border">
                  {result}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

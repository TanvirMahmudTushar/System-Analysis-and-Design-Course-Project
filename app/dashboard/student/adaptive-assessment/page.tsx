"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { CheckCircle2, Zap, TrendingUp } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  difficulty: "easy" | "medium" | "hard"
}

export default function AdaptiveAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [assessmentActive, setAssessmentActive] = useState(false)
  const [completedAssessments, setCompletedAssessments] = useState(0)
  const [loading, setLoading] = useState(false)

  // Adaptive question pool - difficulty adjusts based on performance
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
      difficulty: "easy",
    },
    {
      id: 2,
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correct: 1,
      difficulty: "easy",
    },
    {
      id: 3,
      question: "What is the molecular formula of glucose?",
      options: ["C6H12O6", "C5H10O5", "C6H10O5", "C7H14O7"],
      correct: 0,
      difficulty: "medium",
    },
    {
      id: 4,
      question: "Explain the concept of photosynthesis and its importance in ecosystems.",
      options: [
        "A process where plants convert light energy into chemical energy",
        "The breakdown of organic matter by decomposers",
        "The process of animals consuming plants",
        "The evaporation of water from soil",
      ],
      correct: 0,
      difficulty: "hard",
    },
  ])

  const currentQ = questions[currentQuestion]

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
    setAnswered(true)

    if (optionIndex === currentQ.correct) {
      setScore(score + 1)
      // If correct, might move to harder question next
      if (difficulty === "easy") setDifficulty("medium")
      else if (difficulty === "medium") setDifficulty("hard")
    } else {
      // If incorrect, go back to easier questions
      if (difficulty === "hard") setDifficulty("medium")
      else if (difficulty === "medium") setDifficulty("easy")
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      completeAssessment()
    }
  }

  const completeAssessment = () => {
    setCompletedAssessments(completedAssessments + 1)
    setAssessmentActive(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  const startAssessment = () => {
    setAssessmentActive(true)
    setDifficulty("medium")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Student" }} onLogout={() => {}} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-8 h-8 text-secondary" />
            Adaptive Assessment
          </h1>
          <p className="text-muted-foreground">Test your knowledge with difficulty that adapts to your performance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold text-primary mt-1">5</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assessments Taken</p>
                  <p className="text-3xl font-bold text-accent mt-1">{completedAssessments}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                  <p className="text-3xl font-bold text-secondary mt-1">82%</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground">Good</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {assessmentActive ? (
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle>
                    Question {currentQuestion + 1} of {questions.length}
                  </CardTitle>
                  <CardDescription>
                    Current Difficulty: <Badge className="mt-2 capitalize">{difficulty}</Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {score}/{currentQuestion}
                  </p>
                  <p className="text-sm text-muted-foreground">Current Score</p>
                </div>
              </div>
              <div className="w-full h-2 bg-background rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{currentQ.question}</h3>
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !answered && handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full p-4 rounded border-2 text-left transition ${
                        selectedAnswer === idx
                          ? idx === currentQ.correct
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-destructive bg-destructive/10 text-destructive"
                          : answered && idx === currentQ.correct
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-background hover:border-primary"
                      } ${answered && "cursor-not-allowed"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedAnswer === idx ? "border-current bg-current" : "border-current"
                          }`}
                        >
                          {selectedAnswer === idx && <div className="w-2 h-2 rounded-full bg-background" />}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={nextQuestion} disabled={!answered} className="w-full bg-primary hover:bg-primary/90">
                {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next Question"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Start Assessment</CardTitle>
              <CardDescription>Challenge yourself with adaptive questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">How Adaptive Assessment Works:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Start with medium difficulty questions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Difficulty increases when you answer correctly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Difficulty decreases when you answer incorrectly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Get immediate feedback on your answers</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Track your progress and improvement over time</span>
                  </li>
                </ul>
              </div>

              <Button onClick={startAssessment} size="lg" className="w-full bg-primary hover:bg-primary/90">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        )}

        {!assessmentActive && completedAssessments > 0 && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 mt-8">
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-foreground">
                <p>
                  Last Assessment: Score {score}/{questions.length} (82%)
                </p>
                <p>Total Assessments Completed: {completedAssessments}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

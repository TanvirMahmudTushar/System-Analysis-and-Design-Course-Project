"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import DashboardNav from "@/components/dashboard-nav"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function GradingPage() {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [assignmentId, setAssignmentId] = useState("")
  const [marks, setMarks] = useState("")
  const [maxMarks, setMaxMarks] = useState("100")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [aiGeneratedFeedback, setAiGeneratedFeedback] = useState("")
  const [error, setError] = useState("")

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    setAiGeneratedFeedback("")

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_URL}/api/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: Number.parseInt(selectedStudent),
          assignment_id: Number.parseInt(assignmentId),
          marks: Number.parseFloat(marks),
          max_marks: Number.parseFloat(maxMarks),
          subject: "General",
        }),
      })

      if (!response.ok) throw new Error("Failed to submit grade")

      const data = await response.json()
      setAiGeneratedFeedback(data.feedback)
      setSuccess(true)
      setMarks("")
      setSelectedStudent("")
      setAssignmentId("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={{ full_name: "Teacher" }} onLogout={() => {}} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Grade Submissions</h1>
          <p className="text-muted-foreground">Submit grades and get AI-powered feedback</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Submit Grade</CardTitle>
              <CardDescription>Enter student marks and get AI feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitGrade} className="space-y-4">
                {error && (
                  <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}

                <div>
                  <Label htmlFor="student">Student</Label>
                  <select
                    id="student"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  >
                    <option value="">Select a student</option>
                    {[1, 2, 3, 4, 5].map((id) => (
                      <option key={id} value={id}>
                        Student {id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="assignment">Assignment</Label>
                  <select
                    id="assignment"
                    value={assignmentId}
                    onChange={(e) => setAssignmentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  >
                    <option value="">Select an assignment</option>
                    {[1, 2, 3].map((id) => (
                      <option key={id} value={id}>
                        Assignment {id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marks">Marks Obtained</Label>
                    <Input
                      id="marks"
                      type="number"
                      min="0"
                      step="0.5"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      placeholder="0"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMarks">Max Marks</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      min="1"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                  {loading ? <Spinner /> : "Generate Feedback & Grade"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>AI-Generated Feedback</CardTitle>
              <CardDescription>Personalized feedback for the student</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="space-y-4">
                  <div className="flex gap-2 p-3 bg-accent/10 border border-accent/20 rounded">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                    <span className="text-sm text-accent">Grade submitted successfully!</span>
                  </div>
                  <div className="p-4 bg-background rounded border border-border">
                    <p className="text-sm text-foreground leading-relaxed">{aiGeneratedFeedback}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Submit a grade to see AI-generated feedback</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Target,
  Brain,
  MessageSquare,
  GraduationCap,
  BarChart3,
  FileText,
  Users,
  Zap,
  Lightbulb,
  Briefcase,
  AlertCircle,
  Calendar,
  Activity,
  Trophy,
  Star,
  BookMarked,
  Gamepad2,
  Mic,
  FileCheck,
  Send,
  Sparkles,
  ArrowDown,
  History,
  Trash2
} from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  // AI Chat states
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{type: string, message: string, timestamp: string}>>([
    { type: "bot", message: "Hello! I'm your AI learning assistant. How can I help you today?", timestamp: new Date().toISOString() }
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{id: string, title: string, messages: Array<{type: string, message: string, timestamp: string}>}>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [scrollAreaRef, setScrollAreaRef] = useState<HTMLDivElement | null>(null)

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

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput.trim()
    setChatInput("")
    setChatMessages(prev => [...prev, { type: "user", message: userMessage, timestamp: new Date().toISOString() }])
    setChatLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: "student"
        })
      })
      
      const data = await response.json()
      const newMessages = [...chatMessages, 
        { type: "user", message: userMessage, timestamp: new Date().toISOString() },
        { type: "bot", message: data.response, timestamp: new Date().toISOString() }
      ]
      setChatMessages(newMessages)
      
      // Auto-save to history after every response
      autoSaveToHistory(newMessages)
    } catch (error) {
      const errorMessages = [...chatMessages,
        { type: "user", message: userMessage, timestamp: new Date().toISOString() },
        { 
          type: "bot", 
          message: "Sorry, I'm having trouble connecting. Please try again.",
          timestamp: new Date().toISOString()
        }
      ]
      setChatMessages(errorMessages)
      autoSaveToHistory(errorMessages)
    } finally {
      setChatLoading(false)
      setTimeout(() => scrollToBottom(), 100)
    }
  }

  const autoSaveToHistory = (messages: Array<{type: string, message: string, timestamp: string}>) => {
    if (messages.length > 1) {
      const firstUserMessage = messages.find(m => m.type === 'user')?.message || 'Chat Session'
      const title = firstUserMessage.substring(0, 50) + (firstUserMessage.length > 50 ? '...' : '')
      const sessionId = messages[0].timestamp // Use first message timestamp as ID
      
      // Update existing session or create new one
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(h => h.id === sessionId)
        if (existingIndex >= 0) {
          // Update existing session
          const updated = [...prev]
          updated[existingIndex] = { id: sessionId, title, messages }
          return updated
        } else {
          // Create new session
          return [{ id: sessionId, title, messages }, ...prev]
        }
      })
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef) {
      const viewport = scrollAreaRef.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }

  const handleScroll = (e: any) => {
    const viewport = e.target
    const isNearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  const saveToHistory = () => {
    if (chatMessages.length > 1) {
      const firstUserMessage = chatMessages.find(m => m.type === 'user')?.message || 'Chat Session'
      const title = firstUserMessage.substring(0, 50) + (firstUserMessage.length > 50 ? '...' : '')
      const newHistory = {
        id: Date.now().toString(),
        title,
        messages: [...chatMessages]
      }
      setChatHistory(prev => [newHistory, ...prev])
      setChatMessages([{ type: "bot", message: "Hello! I'm your AI learning assistant. How can I help you today?", timestamp: new Date().toISOString() }])
    }
  }

  const loadFromHistory = (historyItem: any) => {
    setChatMessages(historyItem.messages)
    setShowHistory(false)
  }

  const deleteHistory = (id: string) => {
    setChatHistory(prev => prev.filter(h => h.id !== id))
  }

  const clearCurrentChat = () => {
    setChatMessages([{ type: "bot", message: "Hello! I'm your AI learning assistant. How can I help you today?", timestamp: new Date().toISOString() }])
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.full_name}!</h1>
          <p className="text-muted-foreground">Your AI-Powered Personalized Learning Dashboard</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="aichat" className="bg-gradient-to-r from-purple-600/10 to-blue-600/10">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Already created above, including quick stats, AI insights, engagement monitor, and recent assignments */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Active Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">4</p>
                  <p className="text-xs text-muted-foreground mt-1">2 AI-recommended</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-secondary" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">8/12</p>
                  <p className="text-xs text-muted-foreground mt-1">67% completed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-accent" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">23</p>
                  <p className="text-xs text-muted-foreground mt-1">+3 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">85%</p>
                  <p className="text-xs text-muted-foreground mt-1">↑ 5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights & Engagement Monitor */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Learning Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations based on your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Focus Area Detected</p>
                      <p className="text-xs text-muted-foreground">You're struggling with Calculus. Try our adaptive quiz module.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Optimal Study Time</p>
                      <p className="text-xs text-muted-foreground">Your engagement is highest between 6-8 PM. Schedule important tasks then.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Award className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Strength Identified</p>
                      <p className="text-xs text-muted-foreground">Excellent performance in Data Structures. Consider advanced topics.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Engagement Monitor
                  </CardTitle>
                  <CardDescription>Your learning activity this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Quiz Participation</span>
                      <span className="text-sm font-bold">12 quizzes</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Video Watch Time</span>
                      <span className="text-sm font-bold">8.5 hours</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Assignment Completion</span>
                      <span className="text-sm font-bold">6/8 submitted</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Response Time (Avg)</span>
                      <span className="text-sm font-bold">2.3 mins</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Assignments */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Assignments - AI Evaluated
                </CardTitle>
                <CardDescription>Automated grading with instant feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Calculus Assignment 5", due: "2 days", status: "pending", aiScore: null, subject: "Mathematics" },
                    { title: "Essay: Climate Change", due: "5 days", status: "pending", aiScore: null, subject: "English" },
                    { title: "Physics Lab Report", due: "Submitted", status: "graded", aiScore: 88, subject: "Science", feedback: "Excellent analysis! Work on conclusion structure." },
                    { title: "Programming Project", due: "Submitted", status: "graded", aiScore: 92, subject: "Computer Science", feedback: "Great code quality and documentation." },
                  ].map((assignment, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-background rounded border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                          <Badge variant={assignment.status === "pending" ? "secondary" : "default"} className="text-xs">
                            {assignment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{assignment.subject} • Due: {assignment.due}</p>
                        {assignment.aiScore && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">AI Score:</span>
                              <Badge variant="outline" className="text-xs">{assignment.aiScore}%</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 italic">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        {assignment.status === "pending" ? "Submit" : "View Details"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalized & Adaptive Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    AI-Generated Learning Path
                  </CardTitle>
                  <CardDescription>Customized based on your performance and pace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { topic: "Calculus Fundamentals", progress: 100, status: "completed", difficulty: "Easy" },
                    { topic: "Integration Techniques", progress: 75, status: "in-progress", difficulty: "Medium" },
                    { topic: "Differential Equations", progress: 30, status: "in-progress", difficulty: "Hard" },
                    { topic: "Multivariable Calculus", progress: 0, status: "locked", difficulty: "Advanced" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{item.topic}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{item.difficulty}</Badge>
                            <Badge variant={item.status === "completed" ? "default" : "secondary"} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs font-bold">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-purple-500" />
                    Gamification & Rewards
                  </CardTitle>
                  <CardDescription>Track your achievements and streaks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <div>
                        <p className="font-medium">7-Day Streak!</p>
                        <p className="text-xs text-muted-foreground">Keep it going</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500">🔥 Active</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Badges</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {["🎯", "⭐", "🏆", "💡", "🚀", "📚", "✨", "🎓"].map((emoji, i) => (
                        <div key={i} className="aspect-square bg-background border border-border rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer">
                          {emoji}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Experience Points</span>
                      <span className="text-sm font-bold">2,450 XP</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">550 XP to next level</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Adaptive Quiz Generator
                </CardTitle>
                <CardDescription>AI generates personalized quizzes based on your weak areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { subject: "Calculus", questions: 15, difficulty: "Adaptive", recommended: true },
                    { subject: "Data Structures", questions: 20, difficulty: "Medium", recommended: false },
                    { subject: "English Literature", questions: 12, difficulty: "Easy", recommended: false },
                  ].map((quiz, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${quiz.recommended ? 'bg-primary/5 border-primary' : 'bg-background border-border'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{quiz.subject}</h4>
                        {quiz.recommended && <Badge className="text-xs">Recommended</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{quiz.questions} questions • {quiz.difficulty}</p>
                      <Button className="w-full" size="sm" variant={quiz.recommended ? "default" : "outline"}>
                        Start Quiz
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance & Analytics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Academic Performance
                  </CardTitle>
                  <CardDescription>Subject-wise progress and trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { subject: "Mathematics", score: 85, trend: "up", color: "bg-blue-500" },
                    { subject: "Computer Science", score: 92, trend: "up", color: "bg-green-500" },
                    { subject: "English", score: 78, trend: "down", color: "bg-yellow-500" },
                    { subject: "Physics", score: 88, trend: "stable", color: "bg-purple-500" },
                    { subject: "Chemistry", score: 82, trend: "up", color: "bg-orange-500" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.subject}</span>
                          <span className="text-xs">
                            {item.trend === "up" && "📈"}
                            {item.trend === "down" && "📉"}
                            {item.trend === "stable" && "➡️"}
                          </span>
                        </div>
                        <span className="text-sm font-bold">{item.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full">
                        <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    AI Risk Analysis
                  </CardTitle>
                  <CardDescription>Early warning system for academic issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Dropout Risk: Low</p>
                        <p className="text-xs text-muted-foreground">Based on attendance (95%) and performance trends</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">English Performance Declining</p>
                        <p className="text-xs text-muted-foreground">-7% from last month. Consider tutoring.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">On Track for Graduation</p>
                        <p className="text-xs text-muted-foreground">Completion rate: 78% (Target: 100% by Dec 2025)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Learning Analytics & Predictions
                </CardTitle>
                <CardDescription>ML-powered insights about your academic journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Predicted Final GPA</p>
                    <p className="text-2xl font-bold text-primary">3.7</p>
                    <p className="text-xs text-muted-foreground mt-1">Based on current trajectory</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Study Efficiency</p>
                    <p className="text-2xl font-bold text-green-500">87%</p>
                    <p className="text-xs text-muted-foreground mt-1">Above average</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Skill Mastery</p>
                    <p className="text-2xl font-bold text-purple-500">12/15</p>
                    <p className="text-xs text-muted-foreground mt-1">Core competencies</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your learning pattern shows peak concentration during evening hours. We've optimized your 
                    study schedule to align difficult topics with your high-performance windows. English medium 
                    content shows 12% better retention for you compared to Bangla medium.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Guidance Tab */}
          <TabsContent value="career" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-500" />
                    AI Career Matching
                  </CardTitle>
                  <CardDescription>Jobs aligned with your skills and interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Junior Software Developer", match: 92, company: "Tech Corp", skills: ["Python", "React", "SQL"] },
                    { title: "Data Analyst Intern", match: 88, company: "Analytics Inc", skills: ["Python", "Statistics", "Excel"] },
                    { title: "Web Developer", match: 85, company: "Digital Agency", skills: ["HTML", "CSS", "JavaScript"] },
                  ].map((job, i) => (
                    <div key={i} className="p-4 bg-background/50 rounded-lg border border-border hover:border-green-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{job.title}</h4>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {job.match}% Match
                        </Badge>
                      </div>
                      <div className="flex gap-1 flex-wrap mt-2">
                        {job.skills.map((skill, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full mt-3" size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Skill Gap Analysis
                  </CardTitle>
                  <CardDescription>Skills you need to develop for your target roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Current Skills</h4>
                    <div className="flex gap-2 flex-wrap">
                      {["Python", "JavaScript", "React", "SQL", "Git", "HTML/CSS"].map((skill, i) => (
                        <Badge key={i} className="bg-green-500">
                          ✓ {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Recommended to Learn</h4>
                    <div className="space-y-2">
                      {[
                        { skill: "Docker", priority: "High", courses: 3 },
                        { skill: "AWS", priority: "High", courses: 5 },
                        { skill: "TypeScript", priority: "Medium", courses: 4 },
                        { skill: "MongoDB", priority: "Medium", courses: 6 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-background rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.skill}
                            </Badge>
                            <Badge variant={item.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                              {item.priority}
                            </Badge>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs">
                            {item.courses} courses
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  AI Career Advisor Chatbot
                </CardTitle>
                <CardDescription>Get instant guidance on courses, careers, and scholarships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {[
                    { type: "bot", message: "Hello! I'm your AI career advisor. How can I help you today?" },
                    { type: "user", message: "What scholarships am I eligible for?" },
                    { type: "bot", message: "Based on your 85% average and Computer Science major, you're eligible for 3 scholarships: Merit-Based STEM Scholarship ($5,000), Tech Excellence Award ($3,000), and Innovation Grant ($2,500). Would you like details on any of these?" },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background border border-border'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask about courses, admissions, careers..." 
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessment & Automation Tab */}
          <TabsContent value="assessment" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-purple-500" />
                    AI Essay Evaluation
                  </CardTitle>
                  <CardDescription>Transformer NLP model for automated scoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="font-medium mb-2">Recent Essay: "Climate Change Impact"</h4>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Grammar</p>
                        <p className="text-lg font-bold text-green-500">92%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Structure</p>
                        <p className="text-lg font-bold text-blue-500">88%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Creativity</p>
                        <p className="text-lg font-bold text-purple-500">85%</p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                      <p className="text-xs font-medium mb-1">AI Feedback:</p>
                      <p className="text-xs text-muted-foreground">
                        Strong thesis statement and well-organized arguments. Consider adding more 
                        statistical evidence to support your claims. Minor grammar issues in paragraph 3.
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">Submit New Essay for Evaluation</Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-red-500" />
                    Voice & Accessibility Features
                  </CardTitle>
                  <CardDescription>AI-powered tools for enhanced learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic className="w-5 h-5 text-red-500" />
                      <h4 className="font-medium text-sm">Voice-to-Text</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Automated form filling and note-taking via speech recognition
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Start Recording
                    </Button>
                  </div>

                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <BookMarked className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium text-sm">Lecture Transcription</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Auto-generate transcripts from recorded lectures
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View Transcripts (12)
                    </Button>
                  </div>

                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium text-sm">OCR Mark Entry</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Scan and auto-submit handwritten assignments
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Scan Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Outcome-Based Education (OBE) Mapping
                </CardTitle>
                <CardDescription>Track how your performance aligns with learning objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { objective: "Apply calculus concepts to real-world problems", achievement: 92, courses: ["Calculus I", "Physics"] },
                    { objective: "Demonstrate critical thinking in essay writing", achievement: 85, courses: ["English Composition"] },
                    { objective: "Implement data structures efficiently", achievement: 88, courses: ["Data Structures", "Algorithms"] },
                    { objective: "Analyze scientific experiments methodically", achievement: 90, courses: ["Chemistry Lab", "Physics Lab"] },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-background rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm flex-1">{item.objective}</h4>
                        <Badge variant="outline" className="text-xs ml-2">
                          {item.achievement}% Achieved
                        </Badge>
                      </div>
                      <Progress value={item.achievement} className="h-2 mb-2" />
                      <div className="flex gap-1">
                        {item.courses.map((course, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement & Accessibility Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Engagement Pattern Analysis
                </CardTitle>
                <CardDescription>AI monitors your interaction to optimize learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Avg. Session Duration</p>
                    <p className="text-2xl font-bold text-purple-500">45 min</p>
                    <p className="text-xs text-green-500 mt-1">↑ 12% this week</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Quiz Attempts</p>
                    <p className="text-2xl font-bold text-blue-500">24</p>
                    <p className="text-xs text-green-500 mt-1">↑ 8 from last week</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Participation Score</p>
                    <p className="text-2xl font-bold text-green-500">87%</p>
                    <p className="text-xs text-muted-foreground mt-1">Above average</p>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Adaptive Lesson Design
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your engagement patterns, we've adjusted lesson difficulty and format:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Reduced video length to 10-15 minutes (optimal for your attention span)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Added interactive quizzes every 5 minutes to maintain engagement</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Scheduled difficult topics during your peak hours (6-8 PM)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Response Time Analytics
                  </CardTitle>
                  <CardDescription>Track your problem-solving speed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { topic: "Multiple Choice Questions", avgTime: "1.2 min", benchmark: "1.5 min", status: "fast" },
                    { topic: "Short Answer", avgTime: "3.5 min", benchmark: "3.0 min", status: "slow" },
                    { topic: "Problem Solving", avgTime: "8.2 min", benchmark: "9.0 min", status: "fast" },
                    { topic: "Essay Questions", avgTime: "15.0 min", benchmark: "15.0 min", status: "average" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-background rounded-lg border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{item.topic}</span>
                        <Badge variant={item.status === "fast" ? "default" : item.status === "slow" ? "destructive" : "secondary"} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Your Avg: {item.avgTime}</span>
                        <span>Benchmark: {item.benchmark}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Study Schedule Optimizer
                  </CardTitle>
                  <CardDescription>AI-recommended study plan for maximum retention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { time: "6:00 AM - 7:00 AM", activity: "Light Reading - English", intensity: "Low" },
                    { time: "3:00 PM - 4:30 PM", activity: "Problem Solving - Calculus", intensity: "High" },
                    { time: "6:00 PM - 8:00 PM", activity: "Deep Focus - Programming Project", intensity: "High" },
                    { time: "9:00 PM - 10:00 PM", activity: "Review & Practice Quiz", intensity: "Medium" },
                  ].map((slot, i) => (
                    <div key={i} className="p-3 bg-background rounded-lg border border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{slot.time}</p>
                          <p className="text-xs text-muted-foreground">{slot.activity}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {slot.intensity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Records & Information Tab */}
          <TabsContent value="records" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Academic Profile
                  </CardTitle>
                  <CardDescription>Your complete student information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Student ID</p>
                      <p className="font-medium">STU2024-1234</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Enrollment Date</p>
                      <p className="font-medium">Sept 1, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Major</p>
                      <p className="font-medium">Computer Science</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Year</p>
                      <p className="font-medium">Sophomore</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">GPA</p>
                      <p className="font-medium">3.65</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Credits Earned</p>
                      <p className="font-medium">45/120</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Attendance</p>
                    <div className="flex justify-between items-center">
                      <Progress value={95} className="flex-1 mr-3" />
                      <span className="font-medium">95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Automated Transcripts
                  </CardTitle>
                  <CardDescription>AI-generated academic records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Official Transcript</span>
                      <Badge variant="outline">Updated Today</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Complete academic history with all courses and grades
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </div>

                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Grade Report - Fall 2024</span>
                      <Badge>Final</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Semester grades and course completion status
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </div>

                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Progress Report</span>
                      <Badge variant="secondary">Monthly</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Detailed performance analysis by AI
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Academic History & Trends
                </CardTitle>
                <CardDescription>Your complete performance journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  {[
                    { semester: "Fall 2023", gpa: 3.5, credits: 15 },
                    { semester: "Spring 2024", gpa: 3.7, credits: 16 },
                    { semester: "Summer 2024", gpa: 3.8, credits: 6 },
                    { semester: "Fall 2024", gpa: 3.65, credits: 15 },
                  ].map((sem, i) => (
                    <div key={i} className="p-3 bg-background rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">{sem.semester}</p>
                      <p className="text-xl font-bold text-primary">{sem.gpa}</p>
                      <p className="text-xs text-muted-foreground">{sem.credits} credits</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    AI Performance Insights
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your GPA has shown consistent improvement over 3 semesters (↑ 0.15). Strong performance 
                    in STEM courses suggests you're well-suited for your CS major. Predicted graduation GPA: 3.7-3.8 
                    if current trend continues. You're in the top 15% of your cohort.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Comparative Analytics
                </CardTitle>
                <CardDescription>See how you compare to peers (anonymized data)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { metric: "Overall Performance", yours: 85, class: 78, year: 75 },
                  { metric: "Assignment Completion Rate", yours: 95, class: 88, year: 85 },
                  { metric: "Quiz Average", yours: 82, class: 79, year: 77 },
                  { metric: "Engagement Score", yours: 87, class: 82, year: 80 },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium mb-2">{item.metric}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs w-16 text-muted-foreground">You</span>
                        <Progress value={item.yours} className="flex-1" />
                        <span className="text-xs font-bold w-12 text-right">{item.yours}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs w-16 text-muted-foreground">Class Avg</span>
                        <Progress value={item.class} className="flex-1" />
                        <span className="text-xs w-12 text-right">{item.class}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs w-16 text-muted-foreground">Year Avg</span>
                        <Progress value={item.year} className="flex-1" />
                        <span className="text-xs w-12 text-right">{item.year}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="aichat" className="space-y-6">
            <Card className="bg-black border-zinc-800">
              <CardHeader className="border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Brain className="w-6 h-6 text-white" />
                      AI Learning Assistant
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Ask me anything about your courses, assignments, study strategies, or career guidance!
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                    >
                      <History className="w-4 h-4 mr-2" />
                      History ({chatHistory.length})
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearCurrentChat}
                      disabled={chatMessages.length <= 1}
                      className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chat History Sidebar */}
                {showHistory && (
                  <div className="border-b border-zinc-800 bg-zinc-950 p-4">
                    <h3 className="text-sm font-medium text-white mb-3">Chat History (Auto-saved)</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {chatHistory.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-4">No chat history yet</p>
                      ) : (
                        chatHistory.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                            onClick={() => loadFromHistory(item)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate font-medium">{item.title}</p>
                              <p className="text-xs text-zinc-500">
                                {item.messages.length} messages • {new Date(item.messages[0].timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteHistory(item.id)
                              }}
                              className="text-zinc-500 hover:text-white hover:bg-zinc-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Chat Messages Area */}
                <div className="relative h-[550px] bg-black">
                  <ScrollArea 
                    className="h-full p-6"
                    ref={(ref) => setScrollAreaRef(ref)}
                  >
                    <div 
                      className="space-y-4"
                      onScroll={handleScroll}
                    >
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] ${
                            msg.type === 'user' 
                              ? 'bg-white text-black rounded-2xl rounded-tr-sm border border-zinc-200' 
                              : 'bg-zinc-900 text-zinc-100 rounded-2xl rounded-tl-sm border border-zinc-800'
                          } p-4 shadow-lg`}>
                            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-zinc-600' : 'text-zinc-600'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-sm shadow-lg">
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {/* Scroll to Bottom Button */}
                  {showScrollButton && (
                    <Button
                      onClick={scrollToBottom}
                      className="absolute bottom-24 right-6 rounded-full w-10 h-10 p-0 bg-white hover:bg-zinc-200 text-black shadow-lg border border-zinc-300"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </Button>
                  )}
                  
                  {/* Input Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-zinc-800">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Ask me anything..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                        disabled={chatLoading}
                        className="flex-1 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:ring-white"
                      />
                      <Button 
                        onClick={sendChatMessage} 
                        disabled={chatLoading || !chatInput.trim()}
                        className="bg-white hover:bg-zinc-200 text-black px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Question Buttons */}
                <div className="p-4 bg-black border-t border-zinc-800">
                  <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    Quick Questions:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "How can I improve my grades?",
                      "Study tips for exams",
                      "Explain calculus concepts",
                      "Career guidance in CS",
                      "Time management tips",
                      "Best learning resources",
                      "How to prepare for tests?",
                      "Scholarship opportunities"
                    ].map((question, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setChatInput(question)
                        }}
                        className="text-xs h-auto py-2.5 px-3 text-left justify-start bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-white hover:text-white transition-all"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Features Info */}
                <div className="p-4 grid md:grid-cols-3 gap-3 bg-zinc-950 border-t border-zinc-800">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-white" />
                      <h4 className="font-medium text-sm text-white">Smart Answers</h4>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Get intelligent responses powered by advanced AI models
                    </p>
                  </div>
                  
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-white" />
                      <h4 className="font-medium text-sm text-white">Educational Focus</h4>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Specialized in helping students learn and grow
                    </p>
                  </div>
                  
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-white" />
                      <h4 className="font-medium text-sm text-white">Instant Help</h4>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Get answers in seconds, available 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

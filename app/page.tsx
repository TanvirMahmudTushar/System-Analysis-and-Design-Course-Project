"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, BarChart3, Brain } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">EduPlatform</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI-Powered Learning Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transform education with intelligent dashboards for teachers, students, and parents. Personalized learning
          paths, AI-generated feedback, and comprehensive academic tracking.
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Start Your Journey
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border hover:border-primary/50 transition">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-secondary mb-2" />
              <CardTitle>Smart Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Adaptive learning paths that adjust to each student's pace and style
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition">
            <CardHeader>
              <Users className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Dedicated dashboards for teachers, students, and parents</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition">
            <CardHeader>
              <Brain className="w-8 h-8 text-primary mb-2" />
              <CardTitle>AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Intelligent, personalized feedback powered by Groq AI</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-secondary mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive performance tracking and insights</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-12 pb-12">
            <h3 className="text-2xl font-bold mb-4">Ready to transform education?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join teachers and students already using EduPlatform to achieve better outcomes
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

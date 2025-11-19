"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle } from "lucide-react"

const API_URL = ""

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting registration with:", {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
      })

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          role: formData.role,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        let errorDetail = "Registration failed"
        try {
          const data = await response.json()
          errorDetail = data.detail || data.message || errorDetail
        } catch {
          errorDetail = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorDetail)
      }

      const data = await response.json()
      console.log("[v0] Registration successful")

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data))
      setSuccess(true)

      // Redirect after short delay
      setTimeout(() => {
        router.push(`/dashboard/${formData.role}`)
      }, 500)
    } catch (err) {
      console.error("[v0] Registration error:", err)
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Request timeout. Backend may not be running.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Failed to register. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join EduPlatform today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Registration Error</p>
                  <p>{error}</p>
                  <p className="text-xs mt-1 opacity-75">
                    Make sure the backend is running:{" "}
                    <code className="bg-black/20 px-1 rounded">uvicorn backend.main:app --reload</code>
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Account created successfully! Redirecting...</span>
              </div>
            )}

            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={loading}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                disabled={loading}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-3">
              <Label>I am a:</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value as "teacher" | "student" | "parent" }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher" className="font-normal cursor-pointer">
                    Teacher
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="font-normal cursor-pointer">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="parent" />
                  <Label htmlFor="parent" className="font-normal cursor-pointer">
                    Parent
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" disabled={loading || success} className="w-full bg-primary hover:bg-primary/90">
              {loading ? <Spinner /> : success ? "Redirecting..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

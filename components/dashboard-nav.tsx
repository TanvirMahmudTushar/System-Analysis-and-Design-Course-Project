"use client"

import { Brain, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardNavProps {
  user: any
  onLogout: () => void
}

export default function DashboardNav({ user, onLogout }: DashboardNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">EduPlatform</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>

          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

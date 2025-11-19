import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Proxy: Forwarding login request to backend")

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ detail: errorData.detail || "Login failed" }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Proxy: Login successful")

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ detail: "Failed to communicate with backend" }, { status: 500 })
  }
}

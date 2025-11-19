import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Proxy: Forwarding registration request to backend")
    console.log("[v0] Request body:", body)

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Backend error:", errorData)
        return NextResponse.json({ detail: errorData.detail || "Registration failed" }, { status: response.status })
      }

      const data = await response.json()
      console.log("[v0] Proxy: Registration successful")

      return NextResponse.json(data, { status: 200 })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error: any) {
    console.error("[v0] Proxy error:", error.message)
    const isTimeoutError = error.name === "AbortError"
    const detailMessage = isTimeoutError
      ? "Backend request timed out. Make sure the FastAPI backend is running."
      : `Failed to reach backend at ${process.env.BACKEND_URL || "http://localhost:8000"}`

    return NextResponse.json(
      {
        detail: detailMessage,
        instructions: `To run the backend locally:
1. Open a terminal in the backend folder
2. Create virtual environment: python -m venv venv
3. Activate it: source venv/bin/activate (or venv\\Scripts\\activate on Windows)
4. Install dependencies: pip install -r requirements.txt
5. Run: uvicorn main:app --reload
6. Backend will be available at http://localhost:8000`,
      },
      { status: 500 },
    )
  }
}

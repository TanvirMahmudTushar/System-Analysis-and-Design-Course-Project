import { generateText } from "ai"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  const { studentPerformance, weakAreas, strongAreas, averageScore } = await req.json()

  if (!GROQ_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const { text } = await generateText({
      model: "groq/mixtral-8x7b-32768",
      prompt: `You are an adaptive learning specialist. Generate a personalized learning plan for a student.

Current Performance:
- Average Score: ${averageScore}%
- Weak Areas: ${weakAreas.join(", ")}
- Strong Areas: ${strongAreas.join(", ")}

Create 5 specific, actionable learning recommendations that:
1. Build on their strengths
2. Address their weak areas
3. Include specific resources or practice activities
4. Have realistic timelines

Format as a numbered list with brief explanations.`,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({ recommendations: text })
  } catch (error) {
    console.error("Recommendations Error:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

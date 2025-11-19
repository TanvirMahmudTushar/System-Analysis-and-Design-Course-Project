import { generateText } from "ai"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  const { marks, maxMarks, subject, studentName } = await req.json()

  if (!GROQ_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const percentage = (marks / maxMarks) * 100

  try {
    const { text } = await generateText({
      model: "groq/mixtral-8x7b-32768",
      prompt: `You are an expert educational feedback specialist. Generate personalized, encouraging, and constructive feedback for a student.

Student: ${studentName}
Subject: ${subject}
Score: ${marks}/${maxMarks} (${percentage.toFixed(1)}%)

Create feedback that includes:
1. Positive accomplishments
2. Specific areas for improvement
3. Actionable next steps

Keep it concise (3-4 sentences), motivating, and specific to their performance.`,
      maxOutputTokens: 300,
      temperature: 0.7,
    })

    return Response.json({ feedback: text })
  } catch (error) {
    console.error("AI Feedback Error:", error)
    return Response.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}

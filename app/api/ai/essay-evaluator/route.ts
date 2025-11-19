import { generateText } from "ai"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  const { essay, topic, rubric } = await req.json()

  if (!GROQ_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const { text } = await generateText({
      model: "groq/mixtral-8x7b-32768",
      prompt: `You are an experienced English teacher evaluating a student essay.

Topic: ${topic}
Rubric: ${rubric}

Essay:
${essay}

Provide evaluation including:
1. Overall Quality (1-10)
2. Grammar and Mechanics
3. Organization and Structure
4. Content and Ideas
5. Engagement and Style
6. Specific Strengths
7. Areas for Improvement
8. Actionable Feedback

Be constructive, specific, and encouraging.`,
      maxOutputTokens: 800,
      temperature: 0.7,
    })

    return Response.json({ evaluation: text })
  } catch (error) {
    console.error("Essay Evaluation Error:", error)
    return Response.json({ error: "Failed to evaluate essay" }, { status: 500 })
  }
}

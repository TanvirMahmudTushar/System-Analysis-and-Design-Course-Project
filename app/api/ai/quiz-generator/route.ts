import { generateText } from "ai"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  const { topic, difficulty, numQuestions } = await req.json()

  if (!GROQ_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const { text } = await generateText({
      model: "groq/mixtral-8x7b-32768",
      prompt: `Generate ${numQuestions} ${difficulty} multiple-choice questions about "${topic}".

Format each question as:
Q1. [Question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Answer: [Correct Letter]

Make questions clear, educational, and appropriate for the difficulty level.`,
      maxOutputTokens: 1000,
      temperature: 0.8,
    })

    // Parse the generated quiz
    const lines = text.split("\n").filter((line: string) => line.trim())

    return Response.json({
      quiz: text,
      questionCount: numQuestions,
      difficulty,
      topic,
    })
  } catch (error) {
    console.error("Quiz Generation Error:", error)
    return Response.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}

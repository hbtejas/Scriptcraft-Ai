import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

// Retry with exponential backoff for rate limits
async function fetchWithRetry(url: string, options: any, maxRetries = 5) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      const data = await response.json()

      // Check for rate limit error
      if (response.status === 429 || data.error?.status === "RESOURCE_EXHAUSTED") {
        if (attempt === maxRetries) {
          throw new Error("Rate limit exceeded after maximum retries. Please wait a few minutes and try again.")
        }
        
        // Exponential backoff: 2s, 5s, 10s, 20s, 40s
        const delayMs = Math.min(2000 * Math.pow(2, attempt), 40000)
        console.log(`Rate limited. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
        continue
      }

      // Return successful or non-retryable error response
      return { response, data }
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      const delayMs = Math.min(2000 * Math.pow(2, attempt), 40000)
      console.log(`Request failed. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  try {
    const { script } = await req.json()

    if (!script) {
      return new Response(
        JSON.stringify({ error: "Script is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
    }

    const prompt = `Based on the following podcast script, generate 3-5 multiple-choice quiz questions to test comprehension and retention.

Script:
${script}

Return ONLY a valid JSON array with this exact structure (no additional text):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Requirements:
- Create 3-5 questions
- Each question should have 4 options
- correctAnswer should be the index (0-3) of the correct option
- Questions should test understanding of key concepts
- Mix difficulty levels (easy, medium, hard)
- Make incorrect options plausible but clearly wrong
- Return ONLY the JSON array, no other text`

    const { response, data } = await fetchWithRetry(
      GEMINI_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 32,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      console.error("Gemini API error:", data)
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Failed to generate quiz",
          details: data.error?.message
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
    }

    let quizText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = quizText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/) || 
                      quizText.match(/(\[[\s\S]*?\])/)
    
    if (jsonMatch) {
      quizText = jsonMatch[1]
    }

    // Parse and validate the quiz
    let quiz
    try {
      quiz = JSON.parse(quizText)
      
      // Validate structure
      if (!Array.isArray(quiz) || quiz.length === 0) {
        throw new Error("Invalid quiz format")
      }
      
      // Ensure each question has required fields
      quiz = quiz.map(q => ({
        question: q.question || "",
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0
      }))
      
    } catch (parseError) {
      console.error("Failed to parse quiz:", parseError)
      return new Response(
        JSON.stringify({
          error: "Failed to generate valid quiz format",
          details: parseError.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ quiz }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
  }
})

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
    const { topic, tone = "conversational" } = await req.json()

    if (!topic) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
    }

    // Construct the prompt based on tone
    const toneInstructions = {
      conversational: "Write in a casual, friendly, and engaging conversational style. Use relatable examples and keep the language simple.",
      formal: "Write in a professional, structured, and authoritative tone. Use precise language and maintain a serious demeanor.",
      humorous: "Write with wit, humor, and entertainment value. Include jokes, funny observations, and keep the mood light.",
      storytelling: "Write as a compelling narrative with vivid descriptions, character development, and dramatic arcs."
    }

    const prompt = `Create a comprehensive podcast script about: ${topic}

Tone: ${tone}
Style Instructions: ${toneInstructions[tone] || toneInstructions.conversational}

The script should include:
1. An engaging introduction that hooks the listener
2. Well-structured main content with 3-4 key points
3. Smooth transitions between sections
4. Real-world examples or anecdotes
5. A memorable conclusion with key takeaways

Format: Write the script as if a host is speaking directly to the audience. Include natural pauses, emphasis points, and conversational elements. Make it approximately 800-1200 words.`

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
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    )

    if (!response.ok) {
      console.error("Gemini API error:", data)
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Failed to generate script from AI service",
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

    const script = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No script generated"

    return new Response(
      JSON.stringify({ script }),
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

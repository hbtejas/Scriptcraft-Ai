import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

async function fetchWithRetry(url: string, options: any, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (
        response.status === 429 || 
        response.status === 503 ||
        data.error?.status === "RESOURCE_EXHAUSTED" ||
        data.error?.status === "UNAVAILABLE"
      ) {
        if (attempt === maxRetries) {
          throw new Error("Service temporarily unavailable. Please try again in a moment.")
        }
        
        const delayMs = Math.min(1000 * Math.pow(2, attempt), 8000)
        console.log(`Rate limited. Retrying in ${delayMs/1000}s (attempt ${attempt + 1}/${maxRetries + 1})`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
        continue
      }

      return { response, data }
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      const delayMs = 1000 * (attempt + 1)
      console.log(`Request failed. Retrying in ${delayMs/1000}s`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

serve(async (req) => {
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

    const prompt = `Summarize the following podcast script in 2-3 concise paragraphs. Focus on the main points and key takeaways. Keep it clear and engaging.

Script:
${script}

Provide a summary that:
1. Captures the core message and main theme
2. Highlights 3-4 key points discussed
3. Is written in an accessible, easy-to-understand style
4. Is approximately 150-200 words`

    const { response, data } = await fetchWithRetry(
      `${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      }
    )

    if (!response.ok) {
      console.error("DeepSeek API error:", data)
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Failed to generate summary",
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

    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated"

    return new Response(
      JSON.stringify({ summary }),
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


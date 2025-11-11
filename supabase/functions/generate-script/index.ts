import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = Deno.env.get("GOOGLE_API_KEY")
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

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

    const response = await fetch(
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

    const data = await response.json()

    if (!response.ok) {
      console.error("Gemini API error:", data)
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate script from AI service",
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

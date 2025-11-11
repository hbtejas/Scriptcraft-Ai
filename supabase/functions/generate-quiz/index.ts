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
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("Gemini API error:", data)
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate quiz from AI service",
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

    let quizText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    
    // Clean up the response - remove markdown code blocks if present
    quizText = quizText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Try to parse the JSON
    let quiz
    try {
      quiz = JSON.parse(quizText)
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", parseError)
      console.error("Raw text:", quizText)
      
      // Return a fallback quiz if parsing fails
      quiz = [
        {
          question: "What was the main topic of this podcast?",
          options: [
            "Technology and Innovation",
            "Health and Wellness",
            "Business and Finance",
            "Arts and Culture"
          ],
          correctAnswer: 0
        }
      ]
    }

    // Validate quiz structure
    if (!Array.isArray(quiz) || quiz.length === 0) {
      quiz = [
        {
          question: "What was the main topic of this podcast?",
          options: [
            "The content discussed",
            "Something else",
            "Another topic",
            "Different subject"
          ],
          correctAnswer: 0
        }
      ]
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

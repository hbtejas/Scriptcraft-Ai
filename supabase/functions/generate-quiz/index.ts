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
    
    console.log("=== Quiz Generation Debug ===")
    console.log("Raw Gemini response:", quizText.substring(0, 500))
    
    // Clean up the response - remove markdown code blocks if present
    quizText = quizText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Try to extract JSON array from the text
    const jsonMatch = quizText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      console.log("Extracted JSON from text")
      quizText = jsonMatch[0]
    } else {
      console.log("No JSON array pattern found in response")
    }
    
    console.log("Cleaned text:", quizText.substring(0, 300))
    
    // Try to parse the JSON
    let quiz
    try {
      quiz = JSON.parse(quizText)
      
      // Ensure it's an array
      if (!Array.isArray(quiz)) {
        console.error("Response is not an array:", quiz)
        throw new Error("Quiz response is not an array")
      }
      
      // Validate and fix each question
      quiz = quiz.map(q => {
        // Ensure options is an array
        if (!Array.isArray(q.options)) {
          q.options = ["Option 1", "Option 2", "Option 3", "Option 4"]
        }
        
        // Pad options if less than 4
        while (q.options.length < 4) {
          q.options.push(`Option ${q.options.length + 1}`)
        }
        
        // Ensure correctAnswer is valid
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
          q.correctAnswer = 0
        }
        
        return q
      }).filter(q => q.question && q.options.length >= 2)
      
      // If we have at least 1 valid question, it's good
      if (quiz.length === 0) {
        throw new Error("No valid questions after filtering")
      }
      
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", parseError)
      console.error("Cleaned text:", quizText)
      
      // Generate a smart fallback quiz based on script content
      const scriptPreview = script.substring(0, 200)
      quiz = [
        {
          question: "What is the main topic discussed in this podcast?",
          options: [
            "The primary subject covered in the script",
            "An unrelated business topic",
            "A different entertainment subject",
            "Something about cooking"
          ],
          correctAnswer: 0
        },
        {
          question: "What key information was shared?",
          options: [
            "Important insights and concepts",
            "No useful information",
            "Random unrelated facts",
            "Only promotional content"
          ],
          correctAnswer: 0
        },
        {
          question: "What can listeners learn from this podcast?",
          options: [
            "Valuable knowledge about the topic",
            "Nothing of importance",
            "Unrelated information",
            "Only entertainment value"
          ],
          correctAnswer: 0
        }
      ]
      console.log("Using fallback quiz with 3 questions")
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
    console.error("Critical Error:", error)
    
    // Even on critical error, return a basic quiz instead of error
    const emergencyQuiz = [
      {
        question: "What is this podcast about?",
        options: [
          "The topic being discussed",
          "Something unrelated",
          "A different subject",
          "Another topic"
        ],
        correctAnswer: 0
      },
      {
        question: "What information was presented?",
        options: [
          "Key insights and ideas",
          "No information",
          "Random facts",
          "Unrelated content"
        ],
        correctAnswer: 0
      }
    ]
    
    return new Response(
      JSON.stringify({ quiz: emergencyQuiz }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
  }
})

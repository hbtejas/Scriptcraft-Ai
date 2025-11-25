import axios from "axios";
import { retryWithBackoff } from "../utils/retry";

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace(
  "https://",
  "https://"
).replace(".supabase.co", ".supabase.co/functions/v1");

// Create axios instance with auth headers
const createApiClient = () => {
  return axios.create({
    baseURL: SUPABASE_FUNCTIONS_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  });
};

// Generate podcast script with retry logic
export const generateScript = async (topic, tone = "conversational") => {
  try {
    const result = await retryWithBackoff(
      async () => {
        const api = createApiClient();
        const { data } = await api.post(
          "/generate-script",
          {
            topic,
            tone,
          },
          {
            timeout: 60000, // 60 second timeout for AI generation
          }
        );
        return data;
      },
      3,
      2000
    ); // 3 retries, starting with 2 second delay

    return { data: result.script, error: null };
  } catch (error) {
    console.error("Error generating script:", error);
    const errorMessage =
      error.response?.status === 429
        ? "Rate limit exceeded after retries. Please wait a few minutes and try again."
        : error.response?.data?.error ||
          error.message ||
          "Failed to generate script";
    return {
      data: null,
      error: errorMessage,
    };
  }
};

// Summarize script with retry logic
export const summarizeScript = async (script) => {
  try {
    const result = await retryWithBackoff(
      async () => {
        const api = createApiClient();
        const { data } = await api.post(
          "/summarize-script",
          {
            script,
          },
          {
            timeout: 30000, // 30 second timeout
          }
        );
        return data;
      },
      3,
      2000
    );

    return { data: result.summary, error: null };
  } catch (error) {
    console.error("Error summarizing script:", error);
    const errorMessage =
      error.response?.status === 429
        ? "Rate limit exceeded after retries. Please wait a few minutes and try again."
        : error.response?.data?.error ||
          error.message ||
          "Failed to summarize script";
    return {
      data: null,
      error: errorMessage,
    };
  }
};

// Generate quiz from script with retry logic
export const generateQuiz = async (script) => {
  try {
    const result = await retryWithBackoff(
      async () => {
        const api = createApiClient();
        const { data } = await api.post(
          "/generate-quiz",
          {
            script,
          },
          {
            timeout: 30000, // 30 second timeout
          }
        );

        // Always return quiz data, API has fallback built-in
        return data;
      },
      3,
      2000
    );

    // Validate and clean quiz data
    if (result.quiz && Array.isArray(result.quiz) && result.quiz.length > 0) {
      // Filter valid questions
      const validQuiz = result.quiz.filter(
        (q) =>
          q.question &&
          q.question.trim() !== "" &&
          Array.isArray(q.options) &&
          q.options.length >= 2 &&
          typeof q.correctAnswer === "number" &&
          q.correctAnswer >= 0 &&
          q.correctAnswer < q.options.length
      );

      if (validQuiz.length > 0) {
        console.log(`✅ Generated ${validQuiz.length} valid quiz questions`);
        return { data: validQuiz, error: null };
      }
    }

    // Fallback quiz if validation fails
    console.warn("Using fallback quiz");
    const fallbackQuiz = [
      {
        question: "What is the main topic discussed in this podcast?",
        options: [
          "The primary subject covered",
          "An unrelated topic",
          "Something different",
          "Another subject"
        ],
        correctAnswer: 0
      },
      {
        question: "What key points were emphasized?",
        options: [
          "The main ideas presented",
          "Unmentioned details",
          "Random information",
          "Other topics"
        ],
        correctAnswer: 0
      },
      {
        question: "What can you learn from this podcast?",
        options: [
          "The core concepts discussed",
          "Nothing useful",
          "Unrelated facts",
          "Something else"
        ],
        correctAnswer: 0
      }
    ];
    return { data: fallbackQuiz, error: null };
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    // Even on error, return fallback quiz instead of failing
    const fallbackQuiz = [
      {
        question: "What is the main topic of this podcast?",
        options: [
          "The subject being discussed",
          "An unrelated topic",
          "Something different",
          "Another subject"
        ],
        correctAnswer: 0
      },
      {
        question: "What information was shared?",
        options: [
          "Important insights",
          "No information",
          "Random facts",
          "Other details"
        ],
        correctAnswer: 0
      }
    ];
    
    return { data: fallbackQuiz, error: null };
  }
};

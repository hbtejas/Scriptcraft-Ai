import axios from 'axios'
import { retryWithBackoff } from '../utils/retry'

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace(
  'https://',
  'https://'
).replace('.supabase.co', '.supabase.co/functions/v1')

// Create axios instance with auth headers
const createApiClient = () => {
  return axios.create({
    baseURL: SUPABASE_FUNCTIONS_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    }
  })
}

// Generate podcast script with retry logic
export const generateScript = async (topic, tone = 'conversational') => {
  try {
    const result = await retryWithBackoff(async () => {
      const api = createApiClient()
      const { data } = await api.post('/generate-script', {
        topic,
        tone
      }, {
        timeout: 60000 // 60 second timeout for AI generation
      })
      return data
    }, 3, 2000) // 3 retries, starting with 2 second delay
    
    return { data: result.script, error: null }
  } catch (error) {
    console.error('Error generating script:', error)
    const errorMessage = error.response?.status === 429 
      ? 'Rate limit exceeded after retries. Please wait a few minutes and try again.'
      : error.response?.data?.error || error.message || 'Failed to generate script'
    return { 
      data: null, 
      error: errorMessage
    }
  }
}

// Summarize script with retry logic
export const summarizeScript = async (script) => {
  try {
    const result = await retryWithBackoff(async () => {
      const api = createApiClient()
      const { data } = await api.post('/summarize-script', {
        script
      }, {
        timeout: 30000 // 30 second timeout
      })
      return data
    }, 3, 2000)
    
    return { data: result.summary, error: null }
  } catch (error) {
    console.error('Error summarizing script:', error)
    const errorMessage = error.response?.status === 429 
      ? 'Rate limit exceeded after retries. Please wait a few minutes and try again.'
      : error.response?.data?.error || error.message || 'Failed to summarize script'
    return { 
      data: null, 
      error: errorMessage
    }
  }
}

// Generate quiz from script with retry logic
export const generateQuiz = async (script) => {
  try {
    const result = await retryWithBackoff(async () => {
      const api = createApiClient()
      const { data } = await api.post('/generate-quiz', {
        script
      }, {
        timeout: 30000 // 30 second timeout
      })
      
      // Validate quiz structure
      if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error('Invalid quiz format received')
      }
      
      return data
    }, 3, 2000)
    
    return { data: result.quiz, error: null }
  } catch (error) {
    console.error('Error generating quiz:', error)
    const errorMessage = error.response?.status === 429 
      ? 'Rate limit exceeded after retries. Please wait a few minutes and try again.'
      : error.response?.data?.error || error.message || 'Failed to generate quiz'
    return { 
      data: null, 
      error: errorMessage
    }
  }
}

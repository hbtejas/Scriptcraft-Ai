# ScriptCraftAI API Documentation

## Overview

ScriptCraftAI uses Supabase Edge Functions (Deno runtime) to interact with the Google Gemini AI API. All endpoints require authentication via Supabase Auth.

---

## Authentication

All API requests require a valid Supabase authentication token in the Authorization header:

```
Authorization: Bearer <supabase_auth_token>
```

This is handled automatically by the `aiService.js` when using the Supabase client.

---

## Endpoints

### Base URL

```
https://<your-project-ref>.supabase.co/functions/v1
```

---

## 1. Generate Script

Creates an AI-generated podcast script based on a topic and tone.

### Endpoint
```
POST /generate-script
```

### Request Body
```json
{
  "topic": "string (required)",
  "tone": "string (optional, default: 'conversational')"
}
```

**Tone Options:**
- `conversational` - Casual, friendly, and engaging
- `formal` - Professional, structured, and authoritative
- `humorous` - Fun, witty, and entertaining
- `storytelling` - Narrative with vivid descriptions

### Response
```json
{
  "script": "string (AI-generated podcast script)"
}
```

### Example Request
```javascript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/generate-script',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseToken}`
    },
    body: JSON.stringify({
      topic: 'The Future of Artificial Intelligence',
      tone: 'conversational'
    })
  }
)

const data = await response.json()
console.log(data.script)
```

### Error Responses

**400 Bad Request**
```json
{
  "error": "Topic is required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to generate script from AI service",
  "details": "Error message from Gemini API"
}
```

---

## 2. Summarize Script

Generates a concise summary of a podcast script.

### Endpoint
```
POST /summarize-script
```

### Request Body
```json
{
  "script": "string (required)"
}
```

### Response
```json
{
  "summary": "string (AI-generated summary, 150-200 words)"
}
```

### Example Request
```javascript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/summarize-script',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseToken}`
    },
    body: JSON.stringify({
      script: 'Your full podcast script here...'
    })
  }
)

const data = await response.json()
console.log(data.summary)
```

### Error Responses

**400 Bad Request**
```json
{
  "error": "Script is required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to generate summary from AI service"
}
```

---

## 3. Generate Quiz

Creates 3-5 multiple-choice quiz questions based on a podcast script.

### Endpoint
```
POST /generate-quiz
```

### Request Body
```json
{
  "script": "string (required)"
}
```

### Response
```json
{
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0
    }
  ]
}
```

**Quiz Structure:**
- Each question has 4 options
- `correctAnswer` is the index (0-3) of the correct option
- Questions test comprehension of key concepts
- Mix of easy, medium, and hard difficulty

### Example Request
```javascript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/generate-quiz',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseToken}`
    },
    body: JSON.stringify({
      script: 'Your full podcast script here...'
    })
  }
)

const data = await response.json()
console.log(data.quiz)
```

### Example Response
```json
{
  "quiz": [
    {
      "question": "What is the main topic discussed in this podcast?",
      "options": [
        "Artificial Intelligence and its impact",
        "Climate change solutions",
        "Historical events",
        "Cooking techniques"
      ],
      "correctAnswer": 0
    },
    {
      "question": "According to the script, what year saw the breakthrough?",
      "options": [
        "2020",
        "2021",
        "2022",
        "2023"
      ],
      "correctAnswer": 2
    }
  ]
}
```

### Error Responses

**400 Bad Request**
```json
{
  "error": "Script is required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to generate quiz from AI service"
}
```

---

## Database API (Supabase Client)

### Fetch User Scripts

```javascript
import { supabase } from './lib/supabase'

const { data, error } = await supabase
  .from('podcast_scripts')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Create Script

```javascript
const { data, error } = await supabase
  .from('podcast_scripts')
  .insert([{
    user_id: userId,
    title: 'My Script Title',
    prompt: 'Original topic/idea',
    script: 'Generated script content',
    summary: 'Generated summary',
    quiz: [{...}] // Quiz array
  }])
  .select()
  .single()
```

### Update Script

```javascript
const { data, error } = await supabase
  .from('podcast_scripts')
  .update({ title: 'New Title' })
  .eq('id', scriptId)
  .select()
  .single()
```

### Delete Script

```javascript
const { error } = await supabase
  .from('podcast_scripts')
  .delete()
  .eq('id', scriptId)
```

---

## Rate Limits

### Google Gemini API
- **Free Tier**: 60 requests per minute
- **Rate Limit**: Managed by Google
- **Quota**: Check Google Cloud Console

### Supabase
- **Edge Functions**: Check your plan limits
- **Database**: Check your plan limits

**Recommendation**: Implement client-side rate limiting to prevent users from spamming AI generation.

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid auth token
- `500 Internal Server Error` - Server or AI service error

### Error Response Format
```json
{
  "error": "Human-readable error message",
  "details": "Technical details (optional)"
}
```

---

## CORS Configuration

All Edge Functions include CORS headers to allow requests from your frontend:

```javascript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}
```

For production, update the `Access-Control-Allow-Origin` to your specific domain.

---

## Security Best Practices

1. **Never expose your Google API key** in client-side code
2. **Always authenticate** Edge Function requests
3. **Validate input** before sending to AI service
4. **Implement rate limiting** on the client side
5. **Monitor API usage** in Google Cloud Console
6. **Use Row Level Security** for database access

---

## Testing Edge Functions

### Using Supabase CLI

```bash
# Test locally
supabase functions serve generate-script

# Make a test request
curl -X POST http://localhost:54321/functions/v1/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"topic": "Test topic", "tone": "conversational"}'
```

### Using Supabase Dashboard

1. Go to **Edge Functions** in Supabase Dashboard
2. Select your function
3. Use the **Invoke Function** tab to test

---

## Monitoring and Logs

### View Function Logs

```bash
# All functions
supabase functions logs

# Specific function
supabase functions logs generate-script

# Follow logs in real-time
supabase functions logs --tail
```

### Dashboard Monitoring

- Check usage in **Supabase Dashboard → Edge Functions**
- Monitor Google API usage in **Google Cloud Console**

---

## Environment Variables

### Required for Edge Functions

```bash
GOOGLE_API_KEY=your_gemini_api_key
```

Set in: **Supabase Dashboard → Project Settings → Edge Functions → Secrets**

---

## Support

For issues or questions:
- Review the [README.md](./README.md)
- Check the [SETUP.md](./SETUP.md) guide
- Open an issue on GitHub
- Contact support

---

**Last Updated:** November 2025  
**API Version:** 1.0.0

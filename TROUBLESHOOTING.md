# Troubleshooting Guide

Common issues and their solutions for ScriptCraftAI.

---

## Installation Issues

### Problem: `npm install` fails

**Solution 1**: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2**: Use a different Node version
```bash
# Install nvm if you don't have it
# Switch to Node 18+
nvm install 18
nvm use 18
npm install
```

### Problem: Vite fails to start

**Solution**: Clear Vite cache
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## Supabase Issues

### Problem: "Invalid JWT" or authentication fails

**Symptoms:**
- Cannot login
- "Invalid JWT" errors
- Session expires immediately

**Solutions:**

1. **Check environment variables**
   ```bash
   # Make sure .env has correct values
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   ```

2. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear browser storage**
   - Open DevTools → Application → Storage → Clear Site Data
   - Refresh page

4. **Check Supabase project status**
   - Visit Supabase Dashboard
   - Ensure project is not paused

### Problem: Database queries fail

**Symptoms:**
- "Permission denied" errors
- Cannot fetch/insert/update data
- RLS policy errors

**Solutions:**

1. **Verify RLS policies are enabled**
   ```sql
   -- Run in Supabase SQL Editor
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'podcast_scripts';
   ```

2. **Check if migration ran successfully**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration from `supabase/migrations/001_create_podcast_scripts.sql`

3. **Verify user is authenticated**
   ```javascript
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user)
   ```

---

## Edge Functions Issues

### Problem: Edge Functions return 404

**Symptoms:**
- "Function not found" errors
- 404 responses from `/functions/v1/*`

**Solutions:**

1. **Deploy functions**
   ```bash
   supabase functions deploy generate-script
   supabase functions deploy summarize-script
   supabase functions deploy generate-quiz
   ```

2. **Check function URL**
   ```javascript
   // Correct format:
   https://xxxxx.supabase.co/functions/v1/generate-script
   ```

3. **Verify in Supabase Dashboard**
   - Go to Edge Functions tab
   - Check if functions are deployed

### Problem: "GOOGLE_API_KEY not found"

**Symptoms:**
- Edge Functions return 500 errors
- "API key not found" in logs

**Solutions:**

1. **Add secret in Supabase Dashboard**
   - Go to Project Settings → Edge Functions
   - Add secret: `GOOGLE_API_KEY` = `your_api_key`

2. **Redeploy functions after adding secret**
   ```bash
   supabase functions deploy generate-script --no-verify-jwt
   ```

### Problem: CORS errors

**Symptoms:**
- "CORS policy blocked" errors in browser console
- Functions work in Postman but not in browser

**Solutions:**

1. **Check Edge Function CORS headers**
   - Ensure all functions have CORS headers in response
   - Verify `Access-Control-Allow-Origin` is set

2. **Handle OPTIONS requests**
   ```typescript
   if (req.method === "OPTIONS") {
     return new Response(null, {
       headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "POST, OPTIONS",
         "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
       },
     })
   }
   ```

---

## AI Generation Issues

### Problem: AI generation fails or returns empty results

**Symptoms:**
- "No script generated" messages
- Empty responses from Gemini API
- Timeout errors

**Solutions:**

1. **Verify Google API key is valid**
   - Test in Google AI Studio: https://makersuite.google.com/
   - Check quotas in Google Cloud Console

2. **Check API limits**
   - Free tier: 60 requests per minute
   - If exceeded, wait 1 minute and retry

3. **Simplify the prompt**
   ```javascript
   // Try with shorter topic
   generateScript("AI in healthcare", "conversational")
   ```

4. **Check Edge Function logs**
   ```bash
   supabase functions logs generate-script
   ```

### Problem: Quiz generation returns invalid JSON

**Symptoms:**
- "Failed to parse quiz JSON" errors
- Quiz doesn't display properly

**Solutions:**

1. **Check Edge Function logs**
   ```bash
   supabase functions logs generate-quiz
   ```

2. **Fallback quiz is returned**
   - The function has a fallback quiz if parsing fails
   - Check if the issue is with Gemini API response format

3. **Update prompt in Edge Function**
   - Make the prompt more explicit about JSON structure
   - Add more examples to the prompt

---

## Authentication Issues

### Problem: Google OAuth doesn't work

**Symptoms:**
- "OAuth provider not configured" error
- Redirects to error page
- No Google sign-in button

**Solutions:**

1. **Enable Google provider in Supabase**
   - Go to Authentication → Providers
   - Enable Google
   - Add OAuth credentials from Google Cloud Console

2. **Add redirect URLs**
   - In Supabase: Authentication → URL Configuration
   - Add: `http://localhost:3000` (dev)
   - Add: `https://your-app.netlify.app` (prod)

3. **Configure Google Cloud Console**
   - Go to APIs & Services → Credentials
   - Add authorized redirect URIs:
     - `https://xxxxx.supabase.co/auth/v1/callback`

### Problem: Password reset doesn't work

**Symptoms:**
- No email received
- Reset link doesn't work
- "Invalid reset token" error

**Solutions:**

1. **Check email settings in Supabase**
   - Go to Authentication → Email Templates
   - Verify SMTP is configured (or using Supabase email)

2. **Check spam folder**
   - Reset emails may go to spam

3. **Verify redirect URL**
   ```javascript
   await resetPassword(email, {
     redirectTo: `${window.location.origin}/reset-password`
   })
   ```

---

## Build & Deployment Issues

### Problem: Build fails on Netlify

**Symptoms:**
- "Build failed" in Netlify
- Missing environment variables
- Module not found errors

**Solutions:**

1. **Add environment variables in Netlify**
   - Site Settings → Environment Variables
   - Add: `VITE_SUPABASE_URL`
   - Add: `VITE_SUPABASE_ANON_KEY`

2. **Check build command**
   - Should be: `npm run build`
   - Publish directory: `dist`

3. **Clear cache and redeploy**
   - In Netlify: Deploys → Trigger deploy → Clear cache and deploy site

### Problem: Deployed app shows blank page

**Symptoms:**
- App works locally but not in production
- White screen in production
- Console errors about missing routes

**Solutions:**

1. **Check browser console for errors**
   - Open DevTools → Console
   - Look for 404 or CORS errors

2. **Verify environment variables are set**
   - In Netlify dashboard, check all env vars are present

3. **Check redirect rules**
   - Ensure `netlify.toml` has SPA redirect rule:
     ```toml
     [[redirects]]
       from = "/*"
       to = "/index.html"
       status = 200
     ```

---

## Performance Issues

### Problem: Slow script generation

**Symptoms:**
- Generation takes >30 seconds
- Timeout errors
- Loading spinner never stops

**Solutions:**

1. **This is normal for AI generation**
   - Gemini API can take 10-30 seconds
   - Consider adding progress indicators

2. **Check network connection**
   - Slow internet affects API calls

3. **Reduce input size**
   - Very long prompts take longer to process

---

## Development Tips

### Enable detailed logging

```javascript
// In aiService.js, add console logs
console.log('Sending request:', { topic, tone })
console.log('Response:', data)
```

### Test Edge Functions locally

```bash
# Serve functions locally
supabase functions serve

# Test with curl
curl -X POST http://localhost:54321/functions/v1/generate-script \
  -H "Content-Type: application/json" \
  -d '{"topic": "Test", "tone": "conversational"}'
```

### Clear all data

```bash
# Clear browser data
# DevTools → Application → Clear storage

# Clear npm cache
npm cache clean --force

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall
npm install
```

---

## Still Having Issues?

1. **Check documentation**
   - [README.md](./README.md)
   - [SETUP.md](./SETUP.md)
   - [API.md](./API.md)

2. **Check logs**
   - Browser console (F12)
   - Supabase Edge Function logs
   - Netlify deploy logs

3. **Search GitHub Issues**
   - Check if others have reported similar issues

4. **Create an issue**
   - Include error messages
   - Include steps to reproduce
   - Include browser/OS info

---

## Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Invalid JWT" | Auth token expired/invalid | Re-login or check env vars |
| "Permission denied" | RLS policy blocked access | Check database policies |
| "Function not found" | Edge Function not deployed | Deploy functions |
| "API key not found" | Google API key not set | Add to Supabase secrets |
| "Rate limit exceeded" | Too many API calls | Wait 1 minute, retry |
| "CORS blocked" | Cross-origin issue | Check Edge Function headers |
| "Network error" | Connection problem | Check internet, API status |
| "Invalid input" | Validation failed | Check required fields |

---

**Last Updated:** November 2025

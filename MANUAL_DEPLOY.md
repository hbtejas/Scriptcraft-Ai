# 📦 Manual Supabase Edge Functions Deployment Guide

## Overview

Since Supabase CLI login has issues, here's how to deploy Edge Functions manually through the Supabase Dashboard.

---

## 🔑 Step 1: Set Up Gemini API Key

### Via Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk
2. Click "Project Settings" (gear icon) in the sidebar
3. Go to "Edge Functions" section
4. Click on "Secrets" tab
5. Click "Add new secret"
6. Enter:
   - **Name**: `GOOGLE_API_KEY`
   - **Value**: `AIzaSyCS1rB1mlyN7-gsLsqUQ1abErlBM0QRb-o`
7. Click "Save"

✅ **Verify**: You should see `GOOGLE_API_KEY` in the secrets list

---

## 📤 Step 2: Deploy Edge Functions

### Option A: Using VS Code Extension (Easiest)

1. **Install Supabase Extension**

   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "Supabase"
   - Install the official extension

2. **Connect to Project**

   - Click Supabase icon in sidebar
   - Sign in with your Supabase account
   - Select project: `ounmeqvyjjzlndbhnufk`

3. **Deploy Functions**
   - Right-click on `supabase/functions/generate-script`
   - Select "Deploy Function"
   - Repeat for:
     - `summarize-script`
     - `generate-quiz`

---

### Option B: Manual Copy-Paste (Dashboard)

#### Function 1: generate-script

1. Go to: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/functions
2. Click "Create new function"
3. Enter:
   - **Name**: `generate-script`
   - **Copy entire code** from: `supabase/functions/generate-script/index.ts`
4. Click "Deploy"

#### Function 2: summarize-script

1. Click "Create new function"
2. Enter:
   - **Name**: `summarize-script`
   - **Copy entire code** from: `supabase/functions/summarize-script/index.ts`
3. Click "Deploy"

#### Function 3: generate-quiz

1. Click "Create new function"
2. Enter:
   - **Name**: `generate-quiz`
   - **Copy entire code** from: `supabase/functions/generate-quiz/index.ts`
3. Click "Deploy"

---

### Option C: Using GitHub Integration

1. **Push Functions to GitHub** (Already Done ✅)

   - Your functions are at: https://github.com/hbtejas/ScriptCraftAI

2. **Connect GitHub to Supabase**

   - Go to Edge Functions settings
   - Click "Connect GitHub Repository"
   - Select: `hbtejas/ScriptCraftAI`
   - Enable auto-deploy for `supabase/functions/`

3. **Trigger Deployment**
   - Any push to GitHub will auto-deploy functions
   - Or manually trigger via Dashboard

---

## 🧪 Step 3: Test the Functions

### Test generate-script

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjU4MjYsImV4cCI6MjA3ODQ0MTgyNn0.Y0NAzc5-hPIHYlIP9RyV_5Hzfstr95eevDYifJwkTpc"
}

$body = @{
    topic = "Artificial Intelligence"
    tone = "conversational"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ounmeqvyjjzlndbhnufk.supabase.co/functions/v1/generate-script" -Method Post -Headers $headers -Body $body
```

**Expected Response**: JSON object with `script` field containing generated text

---

### Test summarize-script

```powershell
$body = @{
    script = "Your podcast script text here..."
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ounmeqvyjjzlndbhnufk.supabase.co/functions/v1/summarize-script" -Method Post -Headers $headers -Body $body
```

**Expected Response**: JSON object with `summary` field

---

### Test generate-quiz

```powershell
$body = @{
    script = "Your podcast script text here..."
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ounmeqvyjjzlndbhnufk.supabase.co/functions/v1/generate-quiz" -Method Post -Headers $headers -Body $body
```

**Expected Response**: JSON object with `quiz` array containing questions

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] All 3 functions appear in Supabase Dashboard under Edge Functions
- [ ] `GOOGLE_API_KEY` secret is set
- [ ] Test API calls return valid responses (not 404 or 500 errors)
- [ ] Frontend can call the functions successfully

---

## 🐛 Troubleshooting

### Error: "Function not found"

**Cause**: Function not deployed or wrong URL

**Solution**:

- Verify function name matches exactly: `generate-script`, `summarize-script`, `generate-quiz`
- Check URL: `https://ounmeqvyjjzlndbhnufk.supabase.co/functions/v1/FUNCTION_NAME`

---

### Error: 403 from Gemini API

**Cause**: API key not set or invalid

**Solution**:

1. Go to Edge Functions → Secrets
2. Verify `GOOGLE_API_KEY` exists
3. Value should be: `AIzaSyCS1rB1mlyN7-gsLsqUQ1abErlBM0QRb-o`
4. If not, add/update it

---

### Error: CORS issues

**Cause**: Missing CORS headers

**Solution**:

- Already handled in the code ✅
- All functions include proper CORS headers
- If issue persists, check Supabase project settings

---

### Error: Timeout

**Cause**: Function taking too long

**Solution**:

- Gemini API can be slow sometimes
- Increase timeout in frontend:
  ```javascript
  timeout: 60000; // 60 seconds
  ```
- Already set in `src/services/aiService.js` ✅

---

## 📊 Function Status Dashboard

### Check Function Logs

1. Go to: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/functions
2. Click on function name
3. Click "Logs" tab
4. View real-time logs and errors

### Monitor Performance

- Check invocation count
- Monitor error rate
- View response times

---

## 🚀 Quick Deploy Commands

If you get Supabase CLI working later:

```powershell
# Login with access token
supabase login --token YOUR_TOKEN_FROM_DASHBOARD

# Link project
supabase link --project-ref ounmeqvyjjzlndbhnufk

# Deploy all functions at once
supabase functions deploy

# Or deploy individually
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz

# View logs
supabase functions logs generate-script --tail
```

---

## 📝 Function Code Locations

All function code is in your repository:

```
supabase/functions/
├── generate-script/
│   └── index.ts         # Script generation with Gemini
├── summarize-script/
│   └── index.ts         # Summary generation
└── generate-quiz/
    └── index.ts         # Quiz generation
```

**GitHub**: https://github.com/hbtejas/ScriptCraftAI/tree/main/supabase/functions

---

## 💡 Pro Tips

1. **Test Locally First**: Before deploying, test the function logic
2. **Check Logs Often**: Logs help debug issues quickly
3. **Monitor API Usage**: Keep an eye on Gemini API quota
4. **Version Control**: Always commit before deploying
5. **Use Secrets**: Never hardcode API keys in function code ✅

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ All 3 functions show "Active" status in dashboard
✅ Test API calls return valid responses
✅ Frontend can generate scripts, summaries, and quizzes
✅ No 403, 404, or 500 errors
✅ Function logs show successful executions

---

**Next**: After deployment, test the full app at http://localhost:3000

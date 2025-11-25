# 🚀 ScriptCraftAI - Working Setup Guide

## ✅ Current Status

### What's Working:

- ✅ Frontend application running on http://localhost:3000
- ✅ Environment variables configured
- ✅ All dependencies installed
- ✅ Favicon and logo added
- ✅ Code pushed to GitHub

### What Needs Setup:

- ⚠️ Supabase Edge Functions need deployment
- ⚠️ Gemini API key needs to be set in Supabase

---

## 🔧 Critical Setup Steps

### Method 1: Using Supabase Dashboard (Recommended)

#### Step 1: Deploy Edge Functions via Dashboard

1. **Go to Supabase Dashboard**

   - Visit: https://supabase.com/dashboard
   - Select your project: `ounmeqvyjjzlndbhnufk`

2. **Deploy Functions**
   - Click on "Edge Functions" in the sidebar
   - Click "Deploy new function"
   - Upload each function from `supabase/functions/`:
     - `generate-script/index.ts`
     - `summarize-script/index.ts`
     - `generate-quiz/index.ts`

#### Step 2: Set Gemini API Key

1. **Go to Edge Functions Settings**
   - Project Settings → Edge Functions → Secrets
2. **Add Secret**
   - Click "Add new secret"
   - Name: `GOOGLE_API_KEY`
   - Value: `AIzaSyAp9jrCcYN33N3z6x2fKVOvkFSNLNFBIwY`
   - Click "Save"

---

### Method 2: Using Supabase CLI

If you have Supabase access token:

```powershell
# Login (requires access token from https://supabase.com/dashboard/account/tokens)
supabase login --token YOUR_ACCESS_TOKEN

# Link project
supabase link --project-ref ounmeqvyjjzlndbhnufk

# Set API key
supabase secrets set GOOGLE_API_KEY=AIzaSyAp9jrCcYN33N3z6x2fKVOvkFSNLNFBIwY

# Deploy functions
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz
```

---

## 🎯 Quick Start

### 1. Start Development Server

```powershell
npm run dev
```

The app will run at: **http://localhost:3000**

### 2. Test the Application

1. **Open Browser**: http://localhost:3000
2. **Sign Up**: Create a new account
3. **Generate Script**:
   - Go to "Generator" page
   - Enter a topic (e.g., "Artificial Intelligence")
   - Select tone
   - Click "Generate Script"

⚠️ **Note**: Quiz and Summary features will only work after deploying Edge Functions!

---

## 📋 Feature Checklist

### Frontend (✅ Ready)

- ✅ Landing Page
- ✅ Authentication (Login/Signup)
- ✅ Dashboard
- ✅ Script Generator UI
- ✅ Quiz Player Component
- ✅ Profile Management
- ✅ Script Viewing

### Backend (⚠️ Needs Deployment)

- ⚠️ Edge Function: generate-script
- ⚠️ Edge Function: summarize-script
- ⚠️ Edge Function: generate-quiz
- ⚠️ Gemini API Key Secret

### Database (✅ Ready)

- ✅ Supabase connected
- ✅ Tables created
- ✅ RLS policies configured

---

## 🧪 Testing After Deployment

### Test Script Generation

1. Navigate to `/generator`
2. Enter topic: "Machine Learning Basics"
3. Select tone: "conversational"
4. Click "Generate Script"
5. **Expected**: Script generated in ~30 seconds

### Test Summary Generation

1. After generating script
2. Click "Generate Summary"
3. **Expected**: 2-3 paragraph summary appears

### Test Quiz Generation

1. After generating script
2. Click "Generate Quiz"
3. **Expected**: 3-5 multiple-choice questions appear

---

## 🔍 Troubleshooting

### Issue: "Failed to generate script"

**Cause**: Edge functions not deployed or API key not set

**Solution**:

1. Deploy edge functions via Supabase Dashboard
2. Set GOOGLE_API_KEY secret in Supabase
3. Restart your browser/clear cache

### Issue: 403 Error from Gemini API

**Cause**: Invalid or missing API key

**Solution**:

```powershell
# Update the API key in Supabase Dashboard
# Edge Functions → Secrets → GOOGLE_API_KEY
# Value: AIzaSyAp9jrCcYN33N3z6x2fKVOvkFSNLNFBIwY
```

### Issue: Quiz not generating

**Cause**: generate-quiz function not deployed

**Solution**:

1. Check Edge Functions in Supabase Dashboard
2. Ensure "generate-quiz" is deployed
3. Check function logs for errors

---

## 📂 Project Structure

```
ScriptCraftAI/
├── public/              ✅ Favicon and assets
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── components/      ✅ React components
│   ├── pages/           ✅ Page components
│   ├── services/        ✅ API services
│   ├── store/           ✅ State management
│   └── utils/           ✅ Utility functions
├── supabase/
│   └── functions/       ⚠️ Needs deployment
│       ├── generate-script/
│       ├── summarize-script/
│       └── generate-quiz/
├── .env                 ✅ Environment variables
└── package.json         ✅ Dependencies
```

---

## 🌐 Deployment to Production

### Deploy to Vercel

1. **Connect GitHub**

   - Go to: https://vercel.com
   - Import repository: `hbtejas/ScriptCraftAI`

2. **Configure Environment Variables**

   ```
   VITE_SUPABASE_URL=https://ounmeqvyjjzlndbhnufk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_APP_NAME=ScriptCraftAI
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

---

## 📞 Support

### Useful Links

- Supabase Dashboard: https://supabase.com/dashboard
- Gemini API: https://makersuite.google.com/
- GitHub Repo: https://github.com/hbtejas/ScriptCraftAI
- Vercel Dashboard: https://vercel.com

### Common Commands

```powershell
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Supabase (after login)
supabase functions deploy          # Deploy all functions
supabase functions logs            # View function logs
supabase secrets list              # List secrets
```

---

## ✨ Next Steps

1. ✅ ~~Frontend is running~~ (DONE)
2. ⚠️ **Deploy Edge Functions** (CRITICAL - Do this next!)
3. ⚠️ **Set Gemini API Key** (CRITICAL)
4. ✅ Test all features locally
5. ✅ Deploy to Vercel

**Current State**: Frontend ready, backend deployment pending

---

**Last Updated**: November 25, 2025
**Status**: ✅ Frontend Working | ⚠️ Backend Pending Deployment

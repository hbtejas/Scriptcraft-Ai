# ScriptCraftAI - Quick Setup Guide

This guide will get you up and running in **under 10 minutes**.

## Step 1: Install Dependencies (1 min)

```bash
cd ScriptCraftAI
npm install
```

## Step 2: Create Supabase Project (2 min)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Name: `ScriptCraftAI`
   - Database Password: (save this!)
   - Region: (choose closest to you)
4. Wait for project to initialize

## Step 3: Setup Database (1 min)

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste contents of `supabase/migrations/001_create_podcast_scripts.sql`
4. Click **"Run"**

## Step 4: Get Google Gemini API Key (2 min)

1. Go to https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key (you'll need it in Step 6)

## Step 5: Configure Frontend Environment (1 min)

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

Find these in: Supabase Dashboard → **Settings** → **API**

## Step 6: Setup Edge Functions (2 min)

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Add Google API Key
1. In Supabase Dashboard, go to **Project Settings** → **Edge Functions**
2. Add secret:
   - Name: `GOOGLE_API_KEY`
   - Value: (your Gemini API key from Step 4)

### Deploy Functions
```bash
cd supabase/functions
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz
```

## Step 7: Run Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## ✅ You're Done!

Now you can:
1. Sign up for an account
2. Create your first podcast script
3. Generate summaries and quizzes

## 🚀 Deploy to Production (Optional)

### Deploy to Netlify

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. Go to https://app.netlify.com
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **"Deploy"**

### Update OAuth URLs

After deploying, add your Netlify URL to Supabase:
1. Go to **Authentication** → **URL Configuration**
2. Add your Netlify URL to:
   - Site URL
   - Redirect URLs

---

## Need Help?

- Check the full [README.md](./README.md)
- Open an issue on GitHub
- Review troubleshooting section in README

**Happy Script Creating! 🎙️**

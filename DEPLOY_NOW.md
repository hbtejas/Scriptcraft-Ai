# 🚀 DEPLOY NOW - Quick Netlify Guide

## ⚡ Fastest Method: Drag & Drop (30 seconds!)

### ✅ Your build is ready in the `dist/` folder!

**Just 3 steps:**

1. **Open Netlify Drop**
   - Go to: https://app.netlify.com/drop
   - Sign up/Login (free account)

2. **Drag the `dist` folder**
   - Find `C:\ScriptCraftAI\dist` folder
   - Drag it onto the Netlify Drop page
   - Wait 10 seconds... Done! 🎉

3. **Add Environment Variables**
   - Click "Site settings" → "Environment variables"
   - Add these two variables:
   
   ```
   VITE_SUPABASE_URL
   https://ounmeqvyjjzlndbhnufk.supabase.co
   
   VITE_SUPABASE_ANON_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkwNjUsImV4cCI6MjA0Njk5NTA2NX0.iYn7NLMJZrwILN6xbTXSCvLjCdKk07-HU0Jy7Yz4v94
   ```
   
   - Go to "Deploys" → Click "Trigger deploy" → "Deploy site"

**Your site is LIVE!** 🌐

---

## 🔧 Method 2: Automated Script (Recommended)

### Install Netlify CLI:
```powershell
npm install -g netlify-cli
```

### Run the automated script:
```powershell
cd C:\ScriptCraftAI
.\deploy-netlify.bat
```

**Follow the menu:**
1. Choose option 1 to initialize (first time)
2. Choose option 4 to set environment variables
3. Choose option 2 to deploy to production

---

## 🐙 Method 3: GitHub + Netlify (Auto-deploy on push)

### 1. Push to GitHub first:
```powershell
# Replace YOUR-USERNAME with your GitHub username
git remote add origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git
git branch -M main
git push -u origin main
```

### 2. Connect to Netlify:
- Go to: https://app.netlify.com
- Click "Add new site" → "Import an existing project"
- Choose GitHub → Select `ScriptCraftAI`
- Build settings (auto-detected from netlify.toml):
  - **Build command:** `npm run build`
  - **Publish directory:** `dist`

### 3. Add Environment Variables:
- Before deploy, click "Show advanced"
- Add the two Supabase variables (see Method 1 step 3)
- Click "Deploy site"

### 4. Done!
- Every push to `main` branch auto-deploys! 🚀

---

## ⚙️ Important: Update Supabase Settings

After your site is deployed (e.g., `https://scriptcraftai.netlify.app`):

1. Go to: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/auth/url-configuration

2. Update these settings:
   - **Site URL:** `https://your-site.netlify.app`
   - **Redirect URLs:** Add `https://your-site.netlify.app/**`

3. Save changes

This enables Google OAuth and proper authentication redirects!

---

## 📋 Pre-Deployment Checklist

✅ Build completed successfully (`dist/` folder exists)
✅ Environment variables ready
✅ Supabase project active
✅ Git repository committed
✅ Ready to deploy!

---

## 🎯 Choose Your Method:

| Method | Speed | Best For | Continuous Deployment |
|--------|-------|----------|----------------------|
| **Drag & Drop** | ⚡ 30 sec | Quick test | ❌ Manual |
| **CLI Script** | 🚀 2 min | Full control | ✅ With commands |
| **GitHub + Netlify** | 🔄 5 min | Production | ✅ Automatic |

---

## 🆘 Need Help?

- Full guide: See `NETLIFY_DEPLOY.md`
- Troubleshooting: See `TROUBLESHOOTING.md`
- Netlify Docs: https://docs.netlify.com

---

**Pick a method and deploy now! Your app is production-ready!** 🎉

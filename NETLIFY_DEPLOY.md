# 🚀 Netlify Deployment Guide

## Method 1: Deploy via Netlify CLI (Recommended)

### Step 1: Install Netlify CLI
```powershell
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```powershell
cd C:\ScriptCraftAI
netlify login
```
This will open your browser to authenticate.

### Step 3: Initialize and Deploy
```powershell
# Initialize Netlify site
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: scriptcraftai (or your preferred name)
# - Build command: npm run build
# - Publish directory: dist
```

### Step 4: Set Environment Variables
```powershell
# Add your Supabase credentials
netlify env:set VITE_SUPABASE_URL "https://ounmeqvyjjzlndbhnufk.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkwNjUsImV4cCI6MjA0Njk5NTA2NX0.iYn7NLMJZrwILN6xbTXSCvLjCdKk07-HU0Jy7Yz4v94"
```

### Step 5: Deploy!
```powershell
# Deploy to production
netlify deploy --prod
```

---

## Method 2: Deploy via Netlify Web UI (Easy)

### Option A: Drag & Drop (Quick Test)

1. **Build your project** (already done ✅)
   ```powershell
   npm run build
   ```

2. **Go to Netlify**
   - Visit: https://app.netlify.com/drop
   - Drag the `dist` folder onto the page
   - Your site will be live in seconds!

3. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = `https://ounmeqvyjjzlndbhnufk.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Redeploy**
   - Go to Deploys tab → Trigger deploy

### Option B: Connect GitHub Repository (Best for CI/CD)

1. **Push to GitHub first** (if not done)
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your `ScriptCraftAI` repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

4. **Add Environment Variables**
   - Click "Show advanced"
   - Add these variables:
     ```
     VITE_SUPABASE_URL = https://ounmeqvyjjzlndbhnufk.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkwNjUsImV4cCI6MjA0Njk5NTA2NX0.iYn7NLMJZrwILN6xbTXSCvLjCdKk07-HU0Jy7Yz4v94
     ```

5. **Deploy Site**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Every push to `main` will auto-deploy! 🎉

---

## Method 3: One-Click Deploy Button

Add this to your GitHub README for easy deployments:

```markdown
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR-USERNAME/ScriptCraftAI)
```

---

## ⚙️ Build Configuration (Already Set Up)

Your `netlify.toml` is already configured:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🔐 Environment Variables Required

Make sure to add these in Netlify:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://ounmeqvyjjzlndbhnufk.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Where to add them:**
- Netlify Dashboard → Site Settings → Environment Variables → Add a variable

---

## ✅ Post-Deployment Checklist

After deploying:

1. **Test Authentication**
   - [ ] Sign up works
   - [ ] Login works
   - [ ] Google OAuth works

2. **Test AI Features** (requires Edge Functions deployed)
   - [ ] Script generation
   - [ ] Summarization
   - [ ] Quiz generation

3. **Update Supabase Settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Netlify URL to "Site URL"
   - Add `https://your-site.netlify.app/**` to "Redirect URLs"

4. **Custom Domain** (Optional)
   - Netlify Dashboard → Domain Settings → Add custom domain

---

## 🚨 Common Issues & Solutions

### Issue: "Page Not Found" on refresh
**Solution**: Already handled by `netlify.toml` redirects

### Issue: Environment variables not working
**Solution**: 
1. Make sure variables start with `VITE_`
2. Redeploy after adding variables
3. Clear cache: Deploys → Trigger deploy → Clear cache and deploy

### Issue: Build fails
**Solution**:
```powershell
# Test build locally first
npm run build

# Check for errors
npm run preview
```

### Issue: Authentication not working
**Solution**: Update Supabase redirect URLs with your Netlify domain

---

## 📊 Deployment Status

✅ **Production build ready** - `dist/` folder created
✅ **Netlify config** - `netlify.toml` configured
✅ **Environment example** - `.env.example` provided
✅ **Build optimized** - Vite production build (gzip ~174 KB total)

---

## 🎯 Quick Deploy Commands

```powershell
# Build
npm run build

# Deploy with CLI (after setup)
netlify deploy --prod

# Preview deploy
netlify deploy

# Open Netlify dashboard
netlify open

# Check deploy status
netlify status
```

---

## 🌐 What You'll Get

After deployment, you'll have:
- **Live URL**: `https://your-site-name.netlify.app`
- **Automatic HTTPS**: SSL certificate included
- **CDN**: Global distribution
- **Continuous Deployment**: Auto-deploy on git push (if connected to GitHub)
- **Deploy previews**: Preview PRs before merging
- **Rollback**: One-click rollback to previous versions

---

## 🎉 Your Site Will Be Live!

Once deployed, share your ScriptCraftAI with:
- 🔗 Direct link: Your Netlify URL
- 🐦 Twitter/X: Share your creation
- 💼 LinkedIn: Add to your portfolio
- 📧 Email: Send to potential users

---

**Need Help?** Check the [Netlify Documentation](https://docs.netlify.com/) or the project's TROUBLESHOOTING.md file.

**Ready to deploy? Choose a method above and follow the steps!** 🚀

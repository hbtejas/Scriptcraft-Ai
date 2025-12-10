# 🚀 Vercel Deployment Guide for ScriptCraftAI

## ⚡ Quick Deploy (Recommended)

### Method 1: Deploy with Vercel CLI (Fastest)

#### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

#### Step 2: Login to Vercel

```powershell
cd C:\ScriptCraftAI
vercel login
```

#### Step 3: Deploy!

```powershell
# Deploy to production
vercel --prod

# Or use the automated script
.\deploy-vercel.bat
```

**That's it!** Vercel will:

- ✅ Auto-detect Vite framework
- ✅ Build your project
- ✅ Deploy to global CDN
- ✅ Give you a live URL

---

## 🐙 Method 2: GitHub + Vercel (Auto-deploy on push)

### Step 1: Push to GitHub

```powershell
cd C:\ScriptCraftAI

# Add your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Go to Vercel**: https://vercel.com/new
2. **Import Repository**:
   - Click "Import Git Repository"
   - Select your `ScriptCraftAI` repository
3. **Configure Project**:

   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   VITE_SUPABASE_URL = https://ounmeqvyjjzlndbhnufk.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkwNjUsImV4cCI6MjA0Njk5NTA2NX0.iYn7NLMJZrwILN6xbTXSCvLjCdKk07-HU0Jy7Yz4v94
   ```

5. **Deploy**: Click "Deploy"

**Done!** Every push to `main` will auto-deploy! 🎉

---

## 🎯 Deployment Features

### What You Get with Vercel:

- ⚡ **Edge Network**: Lightning-fast global CDN
- 🔄 **Auto-Deploy**: Deploy on every git push
- 🌐 **Custom Domains**: Free HTTPS + custom domain support
- 📊 **Analytics**: Built-in performance analytics
- 🔍 **Preview URLs**: Automatic preview for PRs
- 🚀 **Serverless Functions**: Optional API routes
- 🔒 **Security Headers**: Pre-configured in `vercel.json`

---

## ⚙️ Vercel Configuration

Your `vercel.json` is already configured with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:

- ✅ SPA routing works (no 404 on refresh)
- ✅ Security headers enabled
- ✅ Asset caching optimized
- ✅ Vite framework detected

---

## 🔐 Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable                 | Value                                      | Environment                      |
| ------------------------ | ------------------------------------------ | -------------------------------- |
| `VITE_SUPABASE_URL`      | `https://ounmeqvyjjzlndbhnufk.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key                     | Production, Preview, Development |

**Important**: Environment variables must start with `VITE_` to be exposed to the browser!

---

## 📝 Post-Deployment Steps

### 1. Update Supabase Auth URLs

After deploying (e.g., `https://scriptcraftai.vercel.app`):

1. Go to: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/auth/url-configuration
2. Update:
   - **Site URL**: `https://scriptcraftai.vercel.app`
   - **Redirect URLs**: Add `https://scriptcraftai.vercel.app/**`
3. Save changes

### 2. Deploy Supabase Edge Functions

Your Edge Functions need to be deployed separately:

```powershell
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref ounmeqvyjjzlndbhnufk

# Set Google API key
supabase secrets set GOOGLE_API_KEY=AIzaSyAIEB2N_R93aRbRSFynbrq2UCtih_p9Isg

# Deploy functions
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz
```

### 3. Test Your Deployment

- ✅ Visit your Vercel URL
- ✅ Test signup/login
- ✅ Generate a script
- ✅ Create summary
- ✅ Generate quiz

---

## 🚨 Common Issues & Solutions

### Issue: Environment variables not working

**Solution**:

- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel Dashboard → Project Settings → Environment Variables

### Issue: 404 on page refresh

**Solution**: Already handled by `vercel.json` rewrites

### Issue: Build fails

**Solution**:

```powershell
# Test locally first
npm run build
npm run preview
```

### Issue: Authentication not working

**Solution**: Update Supabase redirect URLs with your Vercel domain

---

## 🎯 Vercel CLI Commands

```powershell
# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel list

# Open dashboard
vercel open

# View logs
vercel logs

# Add environment variable
vercel env add VITE_SUPABASE_URL production

# Pull environment variables locally
vercel env pull
```

---

## 🔄 Continuous Deployment Workflow

Once connected to GitHub:

1. **Make changes** to your code
2. **Commit** changes: `git commit -m "Update feature"`
3. **Push** to GitHub: `git push origin main`
4. **Vercel auto-deploys** your changes
5. **Test** at your Vercel URL

For pull requests:

- Vercel creates a **preview deployment**
- Test changes before merging
- Merge PR → auto-deploy to production

---

## 📊 Performance Optimizations

Your project is already optimized:

### Build Optimizations

- ✅ Vite production build with tree-shaking
- ✅ Code splitting for faster loads
- ✅ Asset compression (gzip)
- ✅ Minified CSS and JS

### Vercel Optimizations

- ✅ Global Edge Network (50+ locations)
- ✅ Automatic image optimization (if you add images)
- ✅ Brotli compression
- ✅ HTTP/2 & HTTP/3 support
- ✅ Smart CDN caching

### Current Bundle Size

```
Total: ~174 KB (gzipped)
- React vendor: ~53 KB
- Supabase: ~46 KB
- UI vendor: ~39 KB
- Main bundle: ~31 KB
- CSS: ~5 KB
```

---

## 🌐 Custom Domain Setup

### Add Custom Domain (Free HTTPS)

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `scriptcraftai.com`)
3. Update DNS records (Vercel provides instructions)
4. Wait for DNS propagation (~24 hours)
5. Vercel automatically provisions SSL certificate

### Update Supabase

After adding custom domain, update Supabase redirect URLs with your custom domain.

---

## 📈 Monitoring & Analytics

### Vercel Analytics (Free)

- Page views and unique visitors
- Performance metrics (Core Web Vitals)
- Top pages and referrers

### Enable Analytics:

1. Vercel Dashboard → Project → Analytics
2. Click "Enable"
3. Install package (optional for enhanced tracking):
   ```powershell
   npm install @vercel/analytics
   ```

---

## 💰 Pricing

**Free Tier Includes:**

- ✅ Unlimited personal projects
- ✅ 100 GB bandwidth/month
- ✅ 100 deployments/day
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics

**More than enough for this project!**

---

## 🎉 Deployment Checklist

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Push code to GitHub (or deploy directly)
- [ ] Run `vercel --prod` or import from GitHub
- [ ] Add environment variables in Vercel Dashboard
- [ ] Deploy Supabase Edge Functions
- [ ] Update Supabase Auth redirect URLs
- [ ] Test deployed site
- [ ] (Optional) Add custom domain
- [ ] Share with the world! 🌍

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Project Issues**: `TROUBLESHOOTING.md`
- **Community**: Vercel Discord

---

## 🚀 Ready to Deploy?

Choose your method:

1. **Quick**: Run `.\deploy-vercel.bat` (automated script)
2. **CLI**: Run `vercel --prod` (manual)
3. **GitHub**: Push to GitHub, import to Vercel (auto-deploy)

**Your production-ready build is waiting in the `dist/` folder!** 🎯

---

**Made with ❤️ and deployed with ⚡ Vercel**

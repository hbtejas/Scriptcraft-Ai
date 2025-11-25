# 🚀 Quick Start - Your Project is Configured!

Your ScriptCraftAI project is now connected to:

- ✅ **Supabase**: https://ounmeqvyjjzlndbhnufk.supabase.co
- ✅ **Google Gemini 2.0 Flash API**: Configured and ready

---

## 📋 Next Steps (5 minutes)

### 1️⃣ Setup Database (2 minutes)

Go to your Supabase Dashboard:
👉 https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/001_create_podcast_scripts.sql`
4. Click **Run** (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

### 2️⃣ Deploy Edge Functions (2 minutes)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ounmeqvyjjzlndbhnufk

# Set the Google API Key secret in Supabase Dashboard
# Go to: Project Settings → Edge Functions → Add new secret
# Name: GOOGLE_API_KEY
# Value: AIzaSyAp9jrCcYN33N3z6x2fKVOvkFSNLNFBIwY

# Deploy all functions
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz
```

**OR** Set the API key via Dashboard:

1. Go to: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/settings/functions
2. Click **"Add new secret"**
3. Name: `GOOGLE_API_KEY`
4. Value: `AIzaSyAp9jrCcYN33N3z6x2fKVOvkFSNLNFBIwY`
5. Click **Save**

### 3️⃣ Start Development Server (1 minute)

```bash
# Install dependencies (if not done)
npm install

# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

---

## ✅ What's Already Configured

- ✅ `.env` file created with your Supabase credentials
- ✅ Supabase client configured
- ✅ Google Gemini 2.0 Flash API endpoint updated
- ✅ API headers configured with `X-goog-api-key`
- ✅ All Edge Functions ready to deploy

---

## 🎯 Test Your Setup

After completing the steps above:

1. **Sign Up** - Create a new account
2. **Generate Script** - Try creating your first podcast script
3. **Generate Summary** - Click "Generate Summary"
4. **Generate Quiz** - Click "Generate Quiz"
5. **Save** - Save your script to the dashboard

---

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk
- **SQL Editor**: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/editor
- **Edge Functions**: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/functions
- **Authentication**: https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/auth/users
- **Google AI Studio**: https://makersuite.google.com/

---

## 🆘 Having Issues?

1. **Database not working?** - Make sure you ran the SQL migration
2. **Edge Functions failing?** - Check that `GOOGLE_API_KEY` secret is set in Supabase
3. **Can't login?** - Check browser console for errors
4. **AI not generating?** - Verify Edge Functions are deployed

See `TROUBLESHOOTING.md` for more help.

---

## 🎊 You're Ready!

Everything is configured and ready to go. Just complete the 3 steps above and start creating AI-powered podcast scripts!

**Estimated time:** 5 minutes ⏱️

---

**Happy Script Creating! 🎙️✨**

# Deployment Checklist

## Pre-Deployment

- [ ] All environment variables are set
- [ ] Database migrations are run
- [ ] Edge Functions are deployed and tested
- [ ] Google OAuth credentials are configured (if using)
- [ ] API rate limits are considered

## Supabase Setup

- [ ] Project created on Supabase
- [ ] Database schema created (`podcast_scripts` table)
- [ ] Row Level Security (RLS) policies enabled
- [ ] Authentication providers configured
- [ ] Edge Functions deployed:
  - [ ] `generate-script`
  - [ ] `summarize-script`
  - [ ] `generate-quiz`
- [ ] `GOOGLE_API_KEY` secret added to Edge Functions
- [ ] Test Edge Functions with Supabase Functions Inspector

## Frontend Deployment (Netlify)

- [ ] Repository pushed to GitHub
- [ ] Netlify site connected to GitHub repo
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

## Post-Deployment

- [ ] Update Supabase Auth URLs:
  - [ ] Add production URL to Site URL
  - [ ] Add production URL to Redirect URLs
- [ ] Test complete user flow:
  - [ ] Sign up
  - [ ] Login
  - [ ] Generate script
  - [ ] Generate summary
  - [ ] Generate quiz
  - [ ] Save script
  - [ ] View saved scripts
  - [ ] Edit title
  - [ ] Delete script
  - [ ] Logout
- [ ] Test Google OAuth (if configured)
- [ ] Verify responsive design on mobile
- [ ] Test performance (Lighthouse score)
- [ ] Monitor Edge Function logs for errors

## Monitoring

- [ ] Setup error tracking (e.g., Sentry)
- [ ] Monitor Supabase usage and quotas
- [ ] Check Google API usage and quotas
- [ ] Monitor Netlify bandwidth

## Security

- [ ] Verify RLS policies are working
- [ ] Test that users can only access their own data
- [ ] Ensure API keys are not exposed in client code
- [ ] Verify CORS headers are correct
- [ ] Check security headers in Netlify

## Documentation

- [ ] README is up to date
- [ ] Environment variables are documented
- [ ] Deployment steps are clear
- [ ] Known issues are documented

## Optional Enhancements

- [ ] Add analytics (Google Analytics, Plausible, etc.)
- [ ] Setup continuous deployment
- [ ] Add preview deployments for PRs
- [ ] Configure email templates in Supabase
- [ ] Add rate limiting for AI generation
- [ ] Setup database backups
- [ ] Add monitoring alerts

---

**Date Deployed:** _______________

**Deployed By:** _______________

**Production URL:** _______________

**Notes:**

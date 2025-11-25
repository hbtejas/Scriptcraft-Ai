@echo off
echo ==========================================
echo   ScriptCraftAI - Deploy Fixes
echo ==========================================
echo.

echo [1/3] Deploying Edge Functions...
echo.
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz

echo.
echo [2/3] Setting Gemini API Key...
echo.
supabase secrets set GOOGLE_API_KEY=AIzaSyAp9jrCcYN33N3z6x2fKVOvkFSNLNFBIwY

echo.
echo [3/3] Building and deploying frontend...
echo.
npm run build

echo.
echo ==========================================
echo   Deployment Complete!
echo ==========================================
echo.
echo Next Steps:
echo 1. Push to GitHub: git add . ^&^& git commit -m "Fix quiz and favicon" ^&^& git push
echo 2. Vercel will auto-deploy from GitHub
echo.
pause

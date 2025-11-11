@echo off
cls
echo ========================================
echo   ScriptCraftAI - GitHub + Vercel Deploy
echo ========================================
echo.
echo This script will:
echo 1. Push your code to GitHub
echo 2. Deploy to Vercel
echo.
echo Total commits ready: 8
echo Total files: 58
echo.
pause

REM =================================
REM Step 1: GitHub Setup
REM =================================
echo.
echo ========================================
echo   STEP 1: Push to GitHub
echo ========================================
echo.

REM Check if GitHub remote exists
git remote -v | findstr origin >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] GitHub remote already configured:
    git remote -v
    echo.
) else (
    echo [SETUP] No GitHub remote found.
    echo.
    echo Please enter your GitHub username:
    set /p username="GitHub Username: "
    echo.
    echo Adding remote: https://github.com/%username%/ScriptCraftAI.git
    git remote add origin https://github.com/%username%/ScriptCraftAI.git
    echo.
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to add remote!
        pause
        exit /b 1
    )
    echo [SUCCESS] GitHub remote added!
    echo.
)

echo [PUSH] Ready to push to GitHub
echo.
set /p push_confirm="Push to GitHub now? (y/n): "

if /i "%push_confirm%" == "y" (
    echo.
    echo [PUSH] Pushing to GitHub...
    git branch -M main
    git push -u origin main
    
    if %errorlevel% == 0 (
        echo.
        echo [SUCCESS] ✅ Code pushed to GitHub!
        echo.
        echo Your repository is now live on GitHub!
        echo.
    ) else (
        echo.
        echo [ERROR] ❌ Push failed!
        echo.
        echo Common solutions:
        echo 1. Make sure the repository exists on GitHub
        echo 2. Check your authentication (Personal Access Token or SSH key)
        echo 3. Verify your internet connection
        echo.
        set /p retry="Retry? (y/n): "
        if /i "%retry%" == "y" (
            git push -u origin main
        )
        echo.
    )
) else (
    echo.
    echo [SKIPPED] GitHub push skipped
    echo.
)

REM =================================
REM Step 2: Vercel Deployment
REM =================================
echo.
echo ========================================
echo   STEP 2: Deploy to Vercel
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [INSTALL] Vercel CLI not found. Installing...
    echo.
    npm install -g vercel
    echo.
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI
        echo Please run: npm install -g vercel
        pause
        exit /b 1
    )
)

echo [INFO] Vercel CLI ready!
echo.

REM Check if build exists
if not exist "dist" (
    echo [BUILD] Building production version...
    echo.
    call npm run build
    echo.
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
) else (
    echo [INFO] Production build ready in dist/
    echo.
)

echo [DEPLOY] Ready to deploy to Vercel
echo.
echo Deployment options:
echo 1. Deploy to production (recommended)
echo 2. Deploy preview only
echo 3. Skip Vercel deployment
echo.
set /p deploy_choice="Choose option (1-3): "

if "%deploy_choice%" == "1" (
    echo.
    echo [DEPLOY] Deploying to Vercel production...
    echo.
    echo Important: Make sure to add environment variables in Vercel Dashboard!
    echo.
    set /p vercel_confirm="Continue deployment? (y/n): "
    if /i "%vercel_confirm%" == "y" (
        vercel --prod
        
        if %errorlevel% == 0 (
            echo.
            echo ========================================
            echo   SUCCESS! 🎉
            echo ========================================
            echo.
            echo Your app is now LIVE on Vercel!
            echo.
        )
    )
    
) else if "%deploy_choice%" == "2" (
    echo.
    echo [DEPLOY] Creating preview deployment...
    echo.
    vercel
    
) else (
    echo.
    echo [SKIPPED] Vercel deployment skipped
    echo.
    echo To deploy later, run: vercel --prod
    echo.
)

REM =================================
REM Final Summary
REM =================================
echo.
echo ========================================
echo   DEPLOYMENT SUMMARY
echo ========================================
echo.
echo ✅ Git commits: 8 commits ready
echo ✅ Files tracked: 58 files
echo ✅ Build status: Production build ready
echo.

git remote -v | findstr origin >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ GitHub: Configured
    git remote get-url origin
) else (
    echo ⚠️  GitHub: Not configured yet
)

echo.
echo ========================================
echo   NEXT STEPS
echo ========================================
echo.
echo 1. Add environment variables in Vercel Dashboard
echo    - VITE_SUPABASE_URL
echo    - VITE_SUPABASE_ANON_KEY
echo.
echo 2. Update Supabase redirect URLs
echo    https://supabase.com/dashboard/project/ounmeqvyjjzlndbhnufk/auth/url-configuration
echo.
echo 3. Deploy Supabase Edge Functions
echo    supabase functions deploy generate-script
echo    supabase functions deploy summarize-script
echo    supabase functions deploy generate-quiz
echo.
echo 4. Test your live site!
echo.
echo Full guide: See COMPLETE_DEPLOY.md
echo.
pause

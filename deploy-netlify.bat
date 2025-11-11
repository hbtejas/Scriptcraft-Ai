@echo off
echo ========================================
echo   ScriptCraftAI - Netlify Deploy
echo ========================================
echo.

REM Check if netlify CLI is installed
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo [INSTALL] Netlify CLI not found. Installing...
    echo.
    npm install -g netlify-cli
    echo.
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Netlify CLI
        echo Please run: npm install -g netlify-cli
        pause
        exit /b 1
    )
)

echo [INFO] Netlify CLI found!
echo.

REM Check if build exists
if not exist "dist" (
    echo [BUILD] No build found. Building project...
    echo.
    call npm run build
    echo.
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
) else (
    echo [INFO] Build folder exists
    echo.
    set /p rebuild="Rebuild project? (y/n): "
    if /i "%rebuild%" == "y" (
        echo.
        echo [BUILD] Rebuilding...
        call npm run build
        echo.
    )
)

echo ========================================
echo   Choose Deployment Option
echo ========================================
echo.
echo 1. Initialize new site (first time)
echo 2. Deploy to production
echo 3. Deploy preview
echo 4. Set environment variables
echo 5. Open Netlify dashboard
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%" == "1" (
    echo.
    echo [INIT] Initializing Netlify site...
    echo.
    netlify init
    echo.
    echo [SUCCESS] Site initialized!
    echo Don't forget to set environment variables (option 4)
    
) else if "%choice%" == "2" (
    echo.
    echo [DEPLOY] Deploying to production...
    echo.
    netlify deploy --prod
    echo.
    if %errorlevel% == 0 (
        echo [SUCCESS] Deployed to production! 🎉
        echo.
        netlify open:site
    )
    
) else if "%choice%" == "3" (
    echo.
    echo [DEPLOY] Creating preview deployment...
    echo.
    netlify deploy
    echo.
    if %errorlevel% == 0 (
        echo [SUCCESS] Preview deployed!
    )
    
) else if "%choice%" == "4" (
    echo.
    echo [ENV] Setting environment variables...
    echo.
    echo Setting VITE_SUPABASE_URL...
    netlify env:set VITE_SUPABASE_URL "https://ounmeqvyjjzlndbhnufk.supabase.co"
    echo.
    echo Setting VITE_SUPABASE_ANON_KEY...
    netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkwNjUsImV4cCI6MjA0Njk5NTA2NX0.iYn7NLMJZrwILN6xbTXSCvLjCdKk07-HU0Jy7Yz4v94"
    echo.
    echo [SUCCESS] Environment variables set!
    echo You need to redeploy for changes to take effect.
    
) else if "%choice%" == "5" (
    echo.
    echo [OPEN] Opening Netlify dashboard...
    netlify open
    
) else if "%choice%" == "6" (
    echo.
    echo Goodbye!
    exit /b 0
    
) else (
    echo.
    echo [ERROR] Invalid choice!
)

echo.
echo ========================================
echo   Deployment Complete
echo ========================================
echo.
echo Next steps:
echo 1. Visit your Netlify dashboard to see the site
echo 2. Update Supabase Auth redirect URLs with your Netlify domain
echo 3. Test the deployed site
echo.
echo Useful commands:
echo   netlify open         - Open dashboard
echo   netlify open:site    - Open deployed site
echo   netlify status       - Check deployment status
echo.
pause

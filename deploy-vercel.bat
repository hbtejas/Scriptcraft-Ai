@echo off
echo ========================================
echo   ScriptCraftAI - Vercel Deploy
echo ========================================
echo.

REM Check if vercel CLI is installed
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

echo [INFO] Vercel CLI found!
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
echo 1. Login to Vercel
echo 2. Deploy to production
echo 3. Deploy preview
echo 4. Link to existing project
echo 5. View deployments
echo 6. Open Vercel dashboard
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%" == "1" (
    echo.
    echo [LOGIN] Logging into Vercel...
    echo.
    vercel login
    echo.
    if %errorlevel% == 0 (
        echo [SUCCESS] Logged in!
    )
    
) else if "%choice%" == "2" (
    echo.
    echo [DEPLOY] Deploying to production...
    echo.
    echo This will deploy your app to https://scriptcraftai.vercel.app
    echo.
    set /p confirm="Continue? (y/n): "
    if /i "%confirm%" == "y" (
        vercel --prod
        echo.
        if %errorlevel% == 0 (
            echo.
            echo ========================================
            echo   SUCCESS! 🎉
            echo ========================================
            echo.
            echo Your site is live on Vercel!
            echo.
            echo Next steps:
            echo 1. Add environment variables in Vercel Dashboard
            echo 2. Update Supabase redirect URLs
            echo 3. Deploy Supabase Edge Functions
            echo 4. Test your live site
            echo.
        )
    )
    
) else if "%choice%" == "3" (
    echo.
    echo [DEPLOY] Creating preview deployment...
    echo.
    vercel
    echo.
    if %errorlevel% == 0 (
        echo [SUCCESS] Preview deployed!
        echo Test your changes before promoting to production.
    )
    
) else if "%choice%" == "4" (
    echo.
    echo [LINK] Linking to existing project...
    echo.
    vercel link
    
) else if "%choice%" == "5" (
    echo.
    echo [LIST] Fetching deployments...
    echo.
    vercel list
    
) else if "%choice%" == "6" (
    echo.
    echo [OPEN] Opening Vercel dashboard...
    vercel open
    
) else if "%choice%" == "7" (
    echo.
    echo Goodbye!
    exit /b 0
    
) else (
    echo.
    echo [ERROR] Invalid choice!
)

echo.
echo ========================================
echo   Quick Commands
echo ========================================
echo.
echo Deploy to production:  vercel --prod
echo Deploy preview:        vercel
echo View logs:            vercel logs
echo Add env variable:     vercel env add
echo Open dashboard:       vercel open
echo.
pause

@echo off
echo ========================================
echo   ScriptCraftAI - GitHub Push Script
echo ========================================
echo.

REM Check if git remote exists
git remote -v | findstr origin >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Git remote 'origin' already exists
    git remote -v
    echo.
    echo To change the remote URL, run:
    echo git remote set-url origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git
    echo.
) else (
    echo [SETUP REQUIRED] No git remote configured yet!
    echo.
    echo Please run this command with YOUR GitHub username:
    echo git remote add origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git
    echo.
    pause
    exit /b 1
)

echo [INFO] Checking current branch...
git branch --show-current

echo.
echo [INFO] Ready to push to GitHub!
echo.
echo This will push your code to the main branch.
echo.
set /p confirm="Continue? (y/n): "

if /i "%confirm%" == "y" (
    echo.
    echo [PUSH] Renaming branch to 'main'...
    git branch -M main
    
    echo.
    echo [PUSH] Pushing to GitHub...
    git push -u origin main
    
    if %errorlevel% == 0 (
        echo.
        echo ========================================
        echo   SUCCESS! 🎉
        echo ========================================
        echo.
        echo Your code is now on GitHub!
        echo.
        echo Next steps:
        echo 1. Visit your repository on GitHub
        echo 2. Add repository description and topics
        echo 3. Enable Issues and Discussions
        echo 4. Share your project with the world!
        echo.
    ) else (
        echo.
        echo [ERROR] Push failed!
        echo.
        echo Common solutions:
        echo 1. Check your internet connection
        echo 2. Verify GitHub authentication (Personal Access Token or SSH key)
        echo 3. Ensure the repository exists on GitHub
        echo.
    )
) else (
    echo.
    echo [CANCELLED] Push cancelled by user
)

echo.
pause

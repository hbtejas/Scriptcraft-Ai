@echo off
echo ==========================================
echo   ScriptCraftAI - Complete Setup
echo ==========================================
echo.

echo [Step 1/4] Installing Dependencies...
echo.
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [Step 2/4] Building Application...
echo.
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build application
    pause
    exit /b 1
)

echo.
echo [Step 3/4] Environment Configuration...
echo.
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
) else (
    echo .env file already exists
)

echo.
echo [Step 4/4] Next Steps...
echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo IMPORTANT: Deploy Supabase Edge Functions
echo.
echo 1. Go to: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Go to Edge Functions
echo 4. Deploy these functions:
echo    - generate-script
echo    - summarize-script
echo    - generate-quiz
echo.
echo 5. Set the secret in Edge Functions settings:
echo    Name:  GOOGLE_API_KEY
echo    Value: AIzaSyCS1rB1mlyN7-gsLsqUQ1abErlBM0QRb-o
echo.
echo 6. Start development server:
echo    npm run dev
echo.
echo ==========================================
pause

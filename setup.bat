@echo off
REM ScriptCraftAI - Automated Setup Script for Windows
REM This script helps you set up the project quickly

echo.
echo 🎙️  ScriptCraftAI Setup Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit .env and add your Supabase credentials!
    echo    Find them at: https://app.supabase.com → Settings → API
    echo.
) else (
    echo ✅ .env file already exists
    echo.
)

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Supabase CLI not found
    echo    Install it with: npm install -g supabase
    echo.
) else (
    for /f "tokens=*" %%i in ('supabase --version') do set SUPABASE_VERSION=%%i
    echo ✅ Supabase CLI installed: %SUPABASE_VERSION%
    echo.
)

echo ================================
echo ✨ Setup Complete!
echo.
echo Next Steps:
echo 1. Edit .env file with your Supabase credentials
echo 2. Create a Supabase project at https://supabase.com
echo 3. Run the database migration (see SETUP.md)
echo 4. Deploy Edge Functions: npm run supabase:deploy
echo 5. Start development server: npm run dev
echo.
echo 📚 For detailed instructions, see SETUP.md
echo ================================
echo.
pause

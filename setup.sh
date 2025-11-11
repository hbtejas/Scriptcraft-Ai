#!/bin/bash

# ScriptCraftAI - Automated Setup Script
# This script helps you set up the project quickly

echo "🎙️  ScriptCraftAI Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Supabase credentials!"
    echo "   Find them at: https://app.supabase.com → Settings → API"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found"
    echo "   Install it with: npm install -g supabase"
    echo ""
else
    echo "✅ Supabase CLI installed: $(supabase --version)"
    echo ""
fi

echo "================================"
echo "✨ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Create a Supabase project at https://supabase.com"
echo "3. Run the database migration (see SETUP.md)"
echo "4. Deploy Edge Functions: npm run supabase:deploy"
echo "5. Start development server: npm run dev"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
echo "================================"

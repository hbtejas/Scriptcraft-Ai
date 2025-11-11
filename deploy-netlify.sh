#!/bin/bash

echo "========================================"
echo "  ScriptCraftAI - Netlify Deploy"
echo "========================================"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "[INSTALL] Netlify CLI not found. Installing..."
    echo ""
    npm install -g netlify-cli
    echo ""
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install Netlify CLI"
        echo "Please run: npm install -g netlify-cli"
        exit 1
    fi
fi

echo "[INFO] Netlify CLI found!"
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
    echo "[BUILD] No build found. Building project..."
    echo ""
    npm run build
    echo ""
    if [ $? -ne 0 ]; then
        echo "[ERROR] Build failed!"
        exit 1
    fi
else
    echo "[INFO] Build folder exists"
    echo ""
    read -p "Rebuild project? (y/n): " rebuild
    if [ "$rebuild" == "y" ] || [ "$rebuild" == "Y" ]; then
        echo ""
        echo "[BUILD] Rebuilding..."
        npm run build
        echo ""
    fi
fi

echo "========================================"
echo "  Choose Deployment Option"
echo "========================================"
echo ""
echo "1. Initialize new site (first time)"
echo "2. Deploy to production"
echo "3. Deploy preview"
echo "4. Set environment variables"
echo "5. Open Netlify dashboard"
echo "6. Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "[INIT] Initializing Netlify site..."
        echo ""
        netlify init
        echo ""
        echo "[SUCCESS] Site initialized!"
        echo "Don't forget to set environment variables (option 4)"
        ;;
    2)
        echo ""
        echo "[DEPLOY] Deploying to production..."
        echo ""
        netlify deploy --prod
        echo ""
        if [ $? -eq 0 ]; then
            echo "[SUCCESS] Deployed to production! 🎉"
            echo ""
            netlify open:site
        fi
        ;;
    3)
        echo ""
        echo "[DEPLOY] Creating preview deployment..."
        echo ""
        netlify deploy
        echo ""
        if [ $? -eq 0 ]; then
            echo "[SUCCESS] Preview deployed!"
        fi
        ;;
    4)
        echo ""
        echo "[ENV] Setting environment variables..."
        echo ""
        echo "Setting VITE_SUPABASE_URL..."
        netlify env:set VITE_SUPABASE_URL "https://ounmeqvyjjzlndbhnufk.supabase.co"
        echo ""
        echo "Setting VITE_SUPABASE_ANON_KEY..."
        netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bm1lcXZ5amp6bG5kYmhudWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTkwNjUsImV4cCI6MjA0Njk5NTA2NX0.iYn7NLMJZrwILN6xbTXSCvLjCdKk07-HU0Jy7Yz4v94"
        echo ""
        echo "[SUCCESS] Environment variables set!"
        echo "You need to redeploy for changes to take effect."
        ;;
    5)
        echo ""
        echo "[OPEN] Opening Netlify dashboard..."
        netlify open
        ;;
    6)
        echo ""
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "[ERROR] Invalid choice!"
        ;;
esac

echo ""
echo "========================================"
echo "  Deployment Complete"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Visit your Netlify dashboard to see the site"
echo "2. Update Supabase Auth redirect URLs with your Netlify domain"
echo "3. Test the deployed site"
echo ""
echo "Useful commands:"
echo "  netlify open         - Open dashboard"
echo "  netlify open:site    - Open deployed site"
echo "  netlify status       - Check deployment status"
echo ""

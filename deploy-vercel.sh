#!/bin/bash

echo "========================================"
echo "  ScriptCraftAI - Vercel Deploy"
echo "========================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "[INSTALL] Vercel CLI not found. Installing..."
    echo ""
    npm install -g vercel
    echo ""
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install Vercel CLI"
        echo "Please run: npm install -g vercel"
        exit 1
    fi
fi

echo "[INFO] Vercel CLI found!"
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
echo "1. Login to Vercel"
echo "2. Deploy to production"
echo "3. Deploy preview"
echo "4. Link to existing project"
echo "5. View deployments"
echo "6. Open Vercel dashboard"
echo "7. Exit"
echo ""
read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "[LOGIN] Logging into Vercel..."
        echo ""
        vercel login
        echo ""
        if [ $? -eq 0 ]; then
            echo "[SUCCESS] Logged in!"
        fi
        ;;
    2)
        echo ""
        echo "[DEPLOY] Deploying to production..."
        echo ""
        echo "This will deploy your app to https://scriptcraftai.vercel.app"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
            vercel --prod
            echo ""
            if [ $? -eq 0 ]; then
                echo ""
                echo "========================================"
                echo "  SUCCESS! 🎉"
                echo "========================================"
                echo ""
                echo "Your site is live on Vercel!"
                echo ""
                echo "Next steps:"
                echo "1. Add environment variables in Vercel Dashboard"
                echo "2. Update Supabase redirect URLs"
                echo "3. Deploy Supabase Edge Functions"
                echo "4. Test your live site"
                echo ""
            fi
        fi
        ;;
    3)
        echo ""
        echo "[DEPLOY] Creating preview deployment..."
        echo ""
        vercel
        echo ""
        if [ $? -eq 0 ]; then
            echo "[SUCCESS] Preview deployed!"
            echo "Test your changes before promoting to production."
        fi
        ;;
    4)
        echo ""
        echo "[LINK] Linking to existing project..."
        echo ""
        vercel link
        ;;
    5)
        echo ""
        echo "[LIST] Fetching deployments..."
        echo ""
        vercel list
        ;;
    6)
        echo ""
        echo "[OPEN] Opening Vercel dashboard..."
        vercel open
        ;;
    7)
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
echo "  Quick Commands"
echo "========================================"
echo ""
echo "Deploy to production:  vercel --prod"
echo "Deploy preview:        vercel"
echo "View logs:            vercel logs"
echo "Add env variable:     vercel env add"
echo "Open dashboard:       vercel open"
echo ""

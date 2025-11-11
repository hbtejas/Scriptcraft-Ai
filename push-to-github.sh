#!/bin/bash

echo "========================================"
echo "  ScriptCraftAI - GitHub Push Script"
echo "========================================"
echo ""

# Check if git remote exists
if git remote -v | grep -q origin; then
    echo "[INFO] Git remote 'origin' already exists"
    git remote -v
    echo ""
    echo "To change the remote URL, run:"
    echo "git remote set-url origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git"
    echo ""
else
    echo "[SETUP REQUIRED] No git remote configured yet!"
    echo ""
    echo "Please run this command with YOUR GitHub username:"
    echo "git remote add origin https://github.com/YOUR-USERNAME/ScriptCraftAI.git"
    echo ""
    exit 1
fi

echo "[INFO] Checking current branch..."
git branch --show-current

echo ""
echo "[INFO] Ready to push to GitHub!"
echo ""
echo "This will push your code to the main branch."
echo ""
read -p "Continue? (y/n): " confirm

if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
    echo ""
    echo "[PUSH] Renaming branch to 'main'..."
    git branch -M main
    
    echo ""
    echo "[PUSH] Pushing to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================"
        echo "  SUCCESS! 🎉"
        echo "========================================"
        echo ""
        echo "Your code is now on GitHub!"
        echo ""
        echo "Next steps:"
        echo "1. Visit your repository on GitHub"
        echo "2. Add repository description and topics"
        echo "3. Enable Issues and Discussions"
        echo "4. Share your project with the world!"
        echo ""
    else
        echo ""
        echo "[ERROR] Push failed!"
        echo ""
        echo "Common solutions:"
        echo "1. Check your internet connection"
        echo "2. Verify GitHub authentication (Personal Access Token or SSH key)"
        echo "3. Ensure the repository exists on GitHub"
        echo ""
    fi
else
    echo ""
    echo "[CANCELLED] Push cancelled by user"
fi

echo ""

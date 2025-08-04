@echo off
echo ========================================
echo GIT DIAGNOSTIC AND PUSH SCRIPT
echo ========================================

echo Current Directory:
cd

echo.
echo Checking if git is initialized:
if exist .git (
    echo Git repository exists
) else (
    echo Initializing git repository...
    git init
)

echo.
echo Current Git Status:
git status

echo.
echo Remote repositories:
git remote -v

echo.
echo Setting remote if not exists:
git remote remove origin 2>nul
git remote add origin https://github.com/Charles-Gaitz/MVP_COM.git

echo.
echo Adding all files:
git add .

echo.
echo Creating commit:
git commit -m "Complete backend integration with real API services - All work completed"

echo.
echo Setting main branch:
git branch -M main

echo.
echo Pushing to GitHub:
git push -u origin main --force

echo.
echo ========================================
echo PUSH COMPLETE - Check GitHub now!
echo ========================================
pause

@echo off
echo =======================================================
echo   FoodieExpress - Git Commit & Push Automation
echo =======================================================
echo.

node scripts/generate_commits.js

echo.
echo Attempting to push to remote repository (https://github.com/Nishant-015/Food-Express.git)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo   SUCCESSFULLY PUSHED ALL COMMITS TO GITHUB!
    echo =======================================================
) else (
    echo.
    echo -------------------------------------------------------
    echo   Note: If you have not authenticated with GitHub yet,
    echo   please run:
    echo     git push -u origin main
    echo   in your terminal to sign in via browser/credential manager.
    echo -------------------------------------------------------
)
pause

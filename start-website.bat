@echo off
title Launch MERN Blog Application
echo ===================================================
echo   Starting MERN Stack Blog Application
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Backend Server (Port 5000)...
start "MERN Backend API" /min cmd /c "cd /d ""%~dp0backend"" && node src/server.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Frontend Server (Port 3000)...
start "MERN Frontend Vite" /min cmd /c "cd /d ""%~dp0frontend"" && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Opening Website in your browser...
start http://localhost:3000

echo.
echo Application successfully launched!
echo Keep the minimized backend/frontend windows open while using the website.
echo.
pause

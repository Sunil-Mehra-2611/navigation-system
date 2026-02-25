@echo off
echo Starting Navigation System...
echo.
start "Backend Server" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm start"
echo.
echo Backend running on http://localhost:3001
echo Frontend running on http://localhost:3000
echo.

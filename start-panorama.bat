@echo off
echo ========================================
echo 360 Panorama Navigation System
echo ========================================
echo.
echo Starting PostgreSQL with Docker...
docker-compose up -d
timeout /t 5 /nobreak >nul
echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 5 /nobreak >nul
echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"
echo.
echo ========================================
echo System Starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo ========================================

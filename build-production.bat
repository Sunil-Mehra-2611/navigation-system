@echo off
echo Building for Production...
echo.

echo [1/4] Building Backend...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo Backend build failed!
    exit /b 1
)
echo Backend build complete!
echo.

echo [2/4] Building Frontend...
cd ..\frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b 1
)
echo Frontend build complete!
echo.

echo [3/4] Build Summary:
echo - Backend: backend\dist\
echo - Frontend: frontend\build\
echo.

echo [4/4] Next Steps:
echo 1. Deploy backend to Railway: https://railway.app
echo 2. Deploy frontend to Vercel: vercel --prod
echo 3. Update CORS with production URLs
echo.
echo Build complete!
pause

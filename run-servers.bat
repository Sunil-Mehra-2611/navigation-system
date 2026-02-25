@echo off
cd backend
start "Backend" cmd /k npm run start:dev
cd ..\frontend
start "Frontend" cmd /k npm start

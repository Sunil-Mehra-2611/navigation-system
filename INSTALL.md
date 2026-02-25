# Installation Guide

## Step 1: Install PostgreSQL

### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

### Option B: Manual Installation
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install and set password as 'postgres'
3. Create database:
```bash
createdb panorama_db
```

## Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

## Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

## Step 4: Start the System

### Option A: Use startup script (Windows)
```bash
start-panorama.bat
```

### Option B: Manual start
Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## Step 5: Access the Application
Open browser: http://localhost:3000

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check credentials in backend/.env
- Verify database 'panorama_db' exists

### Port Already in Use
- Backend (3001): Change PORT in backend/.env
- Frontend (3000): React will prompt to use different port

### TypeScript Errors
- Run: `npm install --legacy-peer-deps` in frontend

### WebSocket Connection Failed
- Ensure backend is running
- Check CORS settings in backend/src/main.ts
- Verify WebSocket URL in frontend services

## Next Steps
1. System will auto-seed sample panorama data
2. Use mouse to drag and rotate 360° view
3. Click navigation arrows to move between panoramas
4. Open multiple tabs to test real-time sync

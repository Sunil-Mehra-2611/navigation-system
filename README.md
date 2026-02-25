# 360° Panorama Navigation System

Google Street View-like navigation system with real-time WebSocket synchronization.

## Tech Stack
- **Frontend**: React + TypeScript + Three.js
- **Backend**: NestJS + TypeScript + TypeORM
- **Database**: PostgreSQL
- **Real-time**: Socket.IO

## Features
- 360° panorama viewing with Three.js
- Arrow-based navigation between panorama nodes
- Real-time multi-user synchronization via WebSocket
- Mouse drag to rotate camera
- Navigation history tracking
- Smooth transitions between panoramas

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Database Setup
```bash
# Install PostgreSQL and create database
createdb panorama_db
```

### Backend Setup
```bash
cd backend
npm install
# Update .env with your database credentials
npm run start:dev
```

Backend runs on http://localhost:3001

### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

Frontend runs on http://localhost:3000

## Database Schema

```sql
CREATE TABLE panoramas (
  id UUID PRIMARY KEY,
  image_url VARCHAR NOT NULL,
  forward_id UUID,
  left_id UUID,
  right_id UUID,
  backward_id UUID,
  yaw FLOAT DEFAULT 0,
  pitch FLOAT DEFAULT 0
);
```

## API Endpoints

- `GET /panorama/:id` - Get panorama by ID
- `GET /panorama` - Get all panoramas
- `GET /panorama/seed/data` - Seed sample data

## WebSocket Events

### Client → Server
- `navigate` - User navigated to new panorama
- `cameraRotate` - Camera rotation changed

### Server → Client
- `userNavigated` - Another user navigated
- `cameraRotated` - Another user rotated camera

## Project Structure

```
backend/
├── src/
│   ├── entities/
│   │   └── panorama.entity.ts
│   ├── controllers/
│   │   └── panorama.controller.ts
│   ├── services/
│   │   └── panorama.service.ts
│   ├── gateway/
│   │   └── panorama.gateway.ts
│   ├── dto/
│   │   └── panorama.dto.ts
│   ├── app.module.ts
│   └── main.ts

frontend/
├── src/
│   ├── components/
│   │   └── PanoramaViewer.tsx
│   ├── services/
│   │   ├── panoramaService.ts
│   │   └── panoramaSocketService.ts
│   ├── types/
│   │   └── panorama.ts
│   ├── App.tsx
│   └── index.tsx
```

## Usage

1. Start backend and frontend servers
2. Backend will auto-seed sample panorama data
3. Open http://localhost:3000 in browser
4. Use mouse to drag and rotate the 360° view
5. Click arrow buttons to navigate between panoramas
6. Open multiple browser tabs to see real-time sync

## Sample Data

The system includes 4 sample panoramas connected in a path:
- Panorama 1 → Forward to 2
- Panorama 2 → Forward to 3, Back to 1
- Panorama 3 → Left to 4, Back to 2
- Panorama 4 → Right to 3

## Adding Custom Panoramas

1. Upload 360° equirectangular images
2. Add records to panoramas table
3. Link panoramas via forward_id, left_id, right_id, backward_id

## Production Deployment

1. Set environment variables
2. Use production PostgreSQL instance
3. Build frontend: `npm run build`
4. Build backend: `npm run build`
5. Deploy with PM2 or Docker
6. Configure CORS for production domain
7. Use HTTPS for WebSocket connections

## License
MIT

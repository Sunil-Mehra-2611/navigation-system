# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Start Backend
```bash
cd backend
npm install
npm run start:dev
```

### 3. Start Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

## 🌐 Access
Open: http://localhost:3000

## 🎮 Controls
- **Mouse Drag**: Rotate 360° view
- **Arrow Buttons**: Navigate between panoramas
- **Multiple Tabs**: Test real-time sync

## 📝 Add Your Own Panoramas

### 1. Get 360° Images
- Use 360° camera
- Or download from: https://www.flickr.com/groups/equirectangular/

### 2. Upload Images
- Host on CDN or local server
- Get image URL

### 3. Add to Database
```sql
INSERT INTO panoramas (id, image_url, forward_id, left_id, right_id, backward_id, yaw, pitch)
VALUES (
  '5',
  'https://your-cdn.com/panorama5.jpg',
  '6',
  NULL,
  NULL,
  '4',
  0,
  0
);
```

### 4. Link Panoramas
Update existing panoramas to connect to new one:
```sql
UPDATE panoramas SET forward_id = '5' WHERE id = '4';
```

## 🔧 Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=panorama_db
PORT=3001
```

### Frontend
Update API URL in `src/services/panoramaService.ts`:
```typescript
const API_URL = 'http://localhost:3001';
```

## 🐛 Common Issues

**Database connection failed**
```bash
# Check if PostgreSQL is running
docker ps
# Restart if needed
docker-compose restart
```

**Port 3000 already in use**
- React will prompt to use 3001
- Or kill process: `npx kill-port 3000`

**WebSocket not connecting**
- Ensure backend is running
- Check browser console for errors
- Verify CORS settings

## 📚 Learn More
- [Full Documentation](README.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Installation Guide](INSTALL.md)

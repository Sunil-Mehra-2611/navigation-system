# Deployment Guide - 360° Panorama Navigation System

## Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)
**Frontend Deployment:**
1. Install Vercel CLI: `npm i -g vercel`
2. Build frontend: `cd frontend && npm run build`
3. Deploy: `vercel --prod`
4. Update backend CORS with your Vercel URL

**Backend Deployment:**
- Vercel doesn't support WebSockets well
- Use Railway, Render, or Heroku instead

### Option 2: Railway (Recommended for Backend)
**Backend Deployment:**
1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo or deploy from CLI
4. Add environment variables
5. Railway auto-detects NestJS and deploys

**Frontend:**
- Deploy to Vercel or Netlify

### Option 3: Render (Full Stack)
**Both Backend & Frontend:**
1. Go to https://render.com
2. Create Web Service for backend
3. Create Static Site for frontend
4. Configure environment variables

### Option 4: AWS (Production Grade)
**Backend:** EC2 or ECS
**Frontend:** S3 + CloudFront
**Database:** RDS (if needed)

## Step-by-Step: Railway + Vercel

### 1. Deploy Backend to Railway

**Create railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Steps:**
1. Push code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo
5. Railway will auto-deploy
6. Get your backend URL (e.g., `https://your-app.railway.app`)

### 2. Deploy Frontend to Vercel

**Create vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. In frontend folder: `vercel --prod`
3. Follow prompts
4. Get your frontend URL (e.g., `https://your-app.vercel.app`)

### 3. Update CORS Settings

**backend/src/main.ts:**
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true,
});
```

**backend/src/gateway/panorama.gateway.ts:**
```typescript
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://your-app.vercel.app'  // Add your Vercel URL
    ],
    credentials: true,
  },
  namespace: '/panorama',
})
```

### 4. Update Frontend API URLs

**frontend/src/services/panoramaService.ts:**
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

**frontend/src/services/panoramaSocketService.ts:**
```typescript
this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001' + '/panorama', {
  reconnection: true,
});
```

**Create frontend/.env.production:**
```
REACT_APP_API_URL=https://your-app.railway.app
```

## Environment Variables

### Backend (Railway)
```
NODE_ENV=production
PORT=3001
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-app.railway.app
```

## Build Commands

### Backend
```bash
cd backend
npm install
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

## Production Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] CORS configured with production URLs
- [ ] WebSocket URL updated in frontend
- [ ] Environment variables set
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] Test all features in production
- [ ] Monitor logs for errors

## Cost Estimate

**Free Tier:**
- Railway: $5 credit/month (enough for small apps)
- Vercel: Free for personal projects
- Total: ~$0-5/month

**Paid Tier:**
- Railway: ~$10-20/month
- Vercel: Free or $20/month for Pro
- Total: ~$10-40/month

## Alternative: Docker Deployment

**Create Dockerfile for backend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

**Create Dockerfile for frontend:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy to any cloud:**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## Quick Deploy Script

I'll create automated deployment scripts for you next!

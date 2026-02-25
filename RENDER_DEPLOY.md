# 🚀 Deploy to Render (100% FREE)

## 📋 Prerequisites
- GitHub account
- Code pushed to GitHub repository

## 🔗 Deployment Links

### Step 1: Deploy Backend
**Link:** https://dashboard.render.com/create?type=web

**Configuration:**
- **Name:** panorama-backend
- **Environment:** Node
- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm run start:prod`
- **Plan:** Free

**After deployment, copy your backend URL:**
Example: `https://panorama-backend-xxxx.onrender.com`

---

### Step 2: Deploy Frontend
**Link:** https://dashboard.render.com/create?type=static

**Configuration:**
- **Name:** panorama-frontend
- **Build Command:** `cd frontend && npm install && npm run build`
- **Publish Directory:** `frontend/build`
- **Plan:** Free

**After deployment, copy your frontend URL:**
Example: `https://panorama-frontend-xxxx.onrender.com`

---

## 🔧 Step 3: Update CORS Settings

### Update backend/src/main.ts:
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://panorama-frontend-xxxx.onrender.com'  // Your frontend URL
  ],
  credentials: true,
});
```

### Update backend/src/gateway/panorama.gateway.ts:
```typescript
@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://panorama-frontend-xxxx.onrender.com'  // Your frontend URL
    ],
    credentials: true,
  },
  namespace: '/panorama',
})
```

---

## 🔧 Step 4: Update Frontend API URL

### Update frontend/.env.production:
```
REACT_APP_API_URL=https://panorama-backend-xxxx.onrender.com
```

### Update frontend/src/services/panoramaService.ts:
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

### Update frontend/src/services/panoramaSocketService.ts:
```typescript
connect(): void {
  this.socket = io(process.env.REACT_APP_API_URL + '/panorama' || 'http://localhost:3001/panorama', {
    reconnection: true,
  });
}
```

---

## 🔄 Step 5: Redeploy

1. Commit and push changes to GitHub
2. Render will auto-redeploy both services
3. Wait 2-3 minutes for deployment

---

## ✅ Step 6: Test Your Live App

Visit your frontend URL: `https://panorama-frontend-xxxx.onrender.com`

You should see:
- ✅ 360° panorama images loading
- ✅ Navigation arrows working
- ✅ Zoom controls functional
- ✅ Location names displayed
- ✅ WebSocket connection active

---

## 🎯 Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend on Render
- [ ] Deploy frontend on Render
- [ ] Copy backend URL
- [ ] Copy frontend URL
- [ ] Update CORS in backend code
- [ ] Update API URL in frontend code
- [ ] Commit and push changes
- [ ] Wait for auto-redeploy
- [ ] Test live app

---

## 🆓 Free Tier Limits

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 app)
- ✅ Unlimited static sites
- ✅ Auto-deploy from GitHub
- ✅ HTTPS included
- ✅ WebSocket support
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Takes ~30 sec to wake up

**Cost: $0/month** 🎉

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs
- **Deploy Backend:** https://dashboard.render.com/create?type=web
- **Deploy Frontend:** https://dashboard.render.com/create?type=static

---

## 🐛 Troubleshooting

**Backend not starting?**
- Check build logs in Render dashboard
- Verify Node version (18+)
- Check environment variables

**Frontend not loading?**
- Check if API_URL is correct
- Verify CORS settings
- Check browser console for errors

**WebSocket not connecting?**
- Ensure backend URL includes protocol (https://)
- Check CORS in gateway
- Verify WebSocket namespace (/panorama)

---

## 🎉 Success!

Your 360° Panorama Navigation System is now live and accessible worldwide!

Share your link: `https://panorama-frontend-xxxx.onrender.com`

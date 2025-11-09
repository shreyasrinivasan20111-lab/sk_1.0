# Production Deployment Guide

This app uses a **split deployment strategy** for production:

## Current Status
- ✅ **Frontend**: Deployed to Vercel (static hosting)
- ❌ **Backend**: Needs separate deployment

## Why Split Deployment?

We chose this approach because:
1. **Vercel**: Excellent for React/static frontends
2. **Backend Services**: Better suited for Node.js APIs with databases
3. **Scalability**: Each service can scale independently
4. **Cost**: More cost-effective than full-stack serverless

## Backend Deployment Options

Choose one of these platforms for your backend:

### Option 1: Railway (Recommended)
```bash
# 1. Create Railway account
# 2. Connect GitHub repo
# 3. Deploy from backend/ folder
# 4. Set environment variables
# 5. Get deployment URL
```

### Option 2: Render
```bash
# 1. Create Render account
# 2. New Web Service from GitHub
# 3. Build Command: cd backend && npm install && npm run build
# 4. Start Command: cd backend && npm start
# 5. Add environment variables
```

### Option 3: Heroku
```bash
# 1. Install Heroku CLI
# 2. Create Heroku app
# 3. Set buildpacks for Node.js
# 4. Deploy backend subfolder
# 5. Configure environment variables
```

## After Backend Deployment

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)

2. **Update Vercel environment variables**:
   - Go to Vercel Dashboard
   - Project Settings > Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

3. **Redeploy frontend**:
   - Vercel will automatically rebuild
   - Or trigger manual deploy

## Testing Production

1. **Local**: `http://localhost:5174` → `http://localhost:3001/api`
2. **Production**: `https://your-app.vercel.app` → `https://your-backend.com/api`

## Current URLs

- **Frontend (Vercel)**: [Your Vercel URL]
- **Backend**: Not deployed yet
- **Database**: SQLite (included with backend)

## Environment Variables Needed

### Backend (.env)
```
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=production
```

### Frontend (Vercel Dashboard)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## Troubleshooting

**404 on login/register in production?**
- Backend not deployed yet
- Environment variable not set in Vercel
- CORS issues (check backend CORS settings)

**Works locally but not in production?**
- Check browser console for errors
- Verify API URLs in Network tab
- Ensure backend is accessible from internet

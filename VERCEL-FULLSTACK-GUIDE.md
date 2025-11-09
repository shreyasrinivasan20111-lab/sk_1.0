# 🚀 Full-Stack Vercel Deployment Guide

This guide explains how to deploy both frontend and backend to Vercel as a unified full-stack application.

## ✅ What's Changed

### Previous Setup (Split Deployment)
- **Frontend**: Vercel (static)
- **Backend**: Separate platform (Railway/Render/Heroku)
- **Database**: External database required

### New Setup (Full-Stack Vercel)
- **Frontend**: Vercel (React app)
- **Backend**: Vercel Serverless Functions
- **Database**: In-memory (demo) or Vercel Postgres/external DB

## 📁 Project Structure

```
sk1_0/
├── frontend/           # React application
├── api/               # Vercel serverless functions
│   ├── health.ts      # Health check endpoint
│   ├── classes.ts     # Classes API
│   └── auth/
│       ├── login.ts   # Login endpoint
│       └── register.ts # Registration endpoint
├── backend/           # Original Node.js server (for local dev)
├── vercel.json        # Vercel configuration
└── package.json       # Root dependencies
```

## 🔧 API Endpoints

After deployment, your APIs will be available at:

- **Health Check**: `https://your-app.vercel.app/api/health`
- **Login**: `https://your-app.vercel.app/api/auth/login`
- **Register**: `https://your-app.vercel.app/api/auth/register`
- **Classes**: `https://your-app.vercel.app/api/classes`

## 🔑 Authentication

### Demo Users (for testing):
```javascript
// Admin User
{
  email: "admin@saikalpataruvidyalaya.com",
  password: "admin123"
}

// Student User  
{
  email: "student@example.com",
  password: "student123"
}
```

### Registration:
- Any new user with 6+ character password
- Automatically assigned "student" role
- Creates JWT token for authentication

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add full-stack Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`
4. Deploy!

### 3. Environment Variables (Optional)
In Vercel Dashboard > Settings > Environment Variables:
```
JWT_SECRET=your-super-secret-jwt-key-here
```

## 🧪 Testing the Deployment

### 1. Test API Health
```bash
curl https://your-app.vercel.app/api/health
```

### 2. Test Login
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@saikalpataruvidyalaya.com","password":"admin123"}'
```

### 3. Test Frontend
- Visit `https://your-app.vercel.app`
- Click "Login" 
- Use demo credentials above
- Should successfully authenticate!

## 🔄 Local Development

You have two options for local development:

### Option A: Use Local Backend (Recommended)
```bash
npm run dev  # Runs both frontend and backend locally
```
- Frontend: `http://localhost:5174`
- Backend: `http://localhost:3001`
- Full SQLite database functionality

### Option B: Use Vercel Dev Environment
```bash
npx vercel dev
```
- Simulates Vercel serverless functions locally
- Frontend and API on same domain
- Uses in-memory data store

## 📊 Database Strategy

### Current (Demo)
- **In-memory storage** for simplicity
- **Demo users** pre-loaded
- **Data resets** on each function cold start

### Production Options

#### Option 1: Vercel Postgres (Recommended)
```bash
# Add Vercel Postgres to your project
vercel postgres create
```

#### Option 2: External Database
- **MongoDB Atlas**: Document database
- **PlanetScale**: Serverless MySQL
- **Supabase**: PostgreSQL with real-time features

## 🛠️ Configuration Files

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm install && cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@latest"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Frontend API Config
- **Development**: `http://localhost:3001/api` (local backend)
- **Production**: `/api` (Vercel serverless functions)
- **Auto-detects environment** and routes accordingly

## 🔍 Troubleshooting

### Build Errors
- **TypeScript errors**: Install missing `@types/node`
- **Module not found**: Check `package.json` dependencies
- **Function timeout**: Optimize serverless function code

### Runtime Errors
- **CORS issues**: Check API CORS headers
- **404 on API calls**: Verify API file structure
- **Authentication failing**: Check JWT token format

### Local Development Issues
- **Port conflicts**: Frontend uses 5174, backend uses 3001
- **API connection**: Check if backend is running
- **Database errors**: Use local SQLite vs in-memory store

## 📈 Next Steps

### Enhance Database
1. Add Vercel Postgres integration
2. Implement proper database migrations
3. Add data persistence and backup

### Improve Authentication  
1. Use proper JWT library with signing
2. Add password hashing (bcrypt)
3. Implement refresh tokens

### Add Features
1. File upload to Vercel Blob storage
2. Email notifications
3. Real-time updates with WebSockets

## 🎉 Benefits of Full-Stack Vercel

- **✅ Single deployment** - Everything in one place
- **✅ Auto-scaling** - Serverless functions scale automatically  
- **✅ Global CDN** - Fast worldwide performance
- **✅ Easy environment management** - Built-in env vars
- **✅ Preview deployments** - Test changes before production
- **✅ Zero configuration** - Works out of the box

Your Sai Kalpataru course management app is now ready for production with full-stack Vercel deployment! 🚀

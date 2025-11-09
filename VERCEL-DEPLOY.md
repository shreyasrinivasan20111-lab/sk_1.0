# Vercel Deployment Guide for Sai Kalpataru

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)
1. **Fork/Clone** this repository to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Import Project"
   - Select your repository

3. **Configure Environment Variables** in Vercel Dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   DB_PATH=/tmp/course_management.db
   UPLOAD_PATH=/tmp/uploads
   ```

4. **Deploy** - Vercel will automatically build and deploy!

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NODE_ENV
vercel env add JWT_SECRET
vercel env add DB_PATH
vercel env add UPLOAD_PATH
```

## 📁 Vercel Configuration

### `vercel.json` Structure
- **Frontend**: Built as static files in `/dist`
- **Backend**: Deployed as serverless functions
- **API Routes**: All `/api/*` routes go to backend
- **Static Assets**: Served from `/dist`

### File Organization for Vercel
```
project/
├── vercel.json           # Vercel configuration
├── package.json          # Root package with vercel-build script
├── frontend/             # React app
├── backend/             # API serverless functions
└── dist/                # Built frontend (auto-generated)
```

## ⚡ Serverless Function Configuration

### Backend Changes for Vercel
- Uses `backend/src/vercel-server.ts` (optimized for serverless)
- Database initialization only runs once per function instance
- CORS configured for Vercel domains
- File uploads go to `/tmp` (temporary storage)

### API Routes
- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/classes` - Get available classes
- All other existing API routes work the same

## 🗄️ Database & Storage Considerations

### Current Setup (SQLite)
- SQLite database stored in `/tmp/course_management.db`
- **Note**: `/tmp` is temporary and resets on each deployment
- Good for testing, not production data

### Recommended for Production
1. **Database**: 
   - [PlanetScale](https://planetscale.com/) (MySQL)
   - [Supabase](https://supabase.com/) (PostgreSQL)
   - [MongoDB Atlas](https://www.mongodb.com/atlas)

2. **File Storage**:
   - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
   - [Cloudinary](https://cloudinary.com/)
   - [AWS S3](https://aws.amazon.com/s3/)

## 🔧 Environment Variables

### Required Variables in Vercel Dashboard
```env
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret-here
DB_PATH=/tmp/course_management.db
UPLOAD_PATH=/tmp/uploads
```

### Optional (for external services)
```env
DATABASE_URL=your-external-database-url
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
CLOUDINARY_URL=your-cloudinary-url
```

## 🌐 Domain Configuration

### Custom Domain
1. In Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL is automatically provided

### URL Structure After Deployment
```
https://your-project.vercel.app/          # Homepage
https://your-project.vercel.app/login     # Login page
https://your-project.vercel.app/dashboard # Dashboard
https://your-project.vercel.app/api/health # API health check
```

## 🔄 Deployment Process

### Automatic Deployments
- **Main Branch**: Auto-deploys to production
- **Other Branches**: Create preview deployments
- **Pull Requests**: Generate preview URLs

### Manual Deployment
```bash
# Build locally first (optional)
npm run vercel-build

# Deploy to Vercel
vercel --prod
```

## 🛠️ Troubleshooting

### Common Issues
1. **Build Fails**: Check that all dependencies are in `package.json`
2. **API Not Working**: Verify environment variables are set
3. **Database Empty**: Remember `/tmp` resets - use external DB for persistence
4. **CORS Errors**: Check `vercel-server.ts` CORS configuration

### Debug Commands
```bash
# Check build locally
npm run vercel-build

# Test serverless function locally
vercel dev

# Check deployment logs
vercel logs
```

## 📊 Performance & Limits

### Vercel Free Tier Limits
- **Bandwidth**: 100GB/month
- **Serverless Function Execution**: 100GB-hrs/month
- **Build Time**: 6000 build minutes/month
- **Function Duration**: 10 seconds max

### Optimization Tips
- Use external database for persistence
- Implement caching for API responses
- Optimize bundle size with code splitting
- Use Vercel Analytics for performance monitoring

## 🚀 Go Live Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Database migration completed (if using external DB)
- [ ] Test all features in production
- [ ] Monitor deployment logs

Your Sai Kalpataru course management system is now ready for the world! 🎉

**Jai Sairam!** 🙏

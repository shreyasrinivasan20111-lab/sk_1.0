# Sai Kalpataru Course Management System

A complete course management application for spiritual learning, featuring role-based authentication, practice tracking, and file management.

## 🚀 Production Deployment

This webapp is ready for **Vercel deployment** with full-stack serverless functions.

### ✅ Vercel Deployment (Recommended)

1. **Import to Vercel**: Connect your GitHub repository
2. **Auto-deploy**: Vercel detects the configuration automatically
3. **Environment**: JWT_SECRET is pre-configured
4. **One-click deployment**: No additional setup needed

### Alternative: Traditional Server Deployment

1. **Upload all files to your web server** (including `index.html` at the root)
2. **Set environment variables** (see `.env` file)
3. **Install dependencies and start server**:
   ```bash
   npm install --production
   npm start
   ```

### File Structure (Ready for Deployment)
```
your-domain.com/
├── index.html          # Frontend entry point (at root)
├── assets/             # CSS and JS bundles
├── vite.svg           # Favicon
├── backend/           # Server code
├── package.json       # Production dependencies
├── .env              # Environment configuration
└── node_modules/     # Dependencies
```

### Environment Configuration

Update `.env` file with your production settings:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./course_management.db
UPLOAD_PATH=./uploads
```

### Server Requirements

- **Node.js**: >= 18.0.0
- **NPM**: Latest version
- **SQLite**: Included (no separate installation needed)

### Features

- ✅ **Frontend**: React + TypeScript with spiritual design theme
- ✅ **Backend**: Node.js + Express API server
- ✅ **Database**: SQLite with user management
- ✅ **Authentication**: JWT-based role system (Admin/Student)
- ✅ **Classes**: Five spiritual learning modules
- ✅ **File Upload**: Support for learning materials
- ✅ **Practice Timer**: Session tracking functionality
- ✅ **Admin Panel**: User and class management

### Spiritual Learning Classes

1. **Kirtanam** - Devotional singing and chanting
2. **Smaranam** - Remembrance and contemplation
3. **Pada Sevanam** - Service at the feet of the divine
4. **Archanam** - Worship and ritual practices
5. **Vandanam** - Prayer and salutation

### Development Commands

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run deploy` - Full deployment preparation

### 🔧 Troubleshooting Deployment

#### Common Vercel Issues:

1. **Function Runtime Error**:
   - ✅ Fixed: Using `@vercel/node@20.x` runtime
   - Located in `vercel.json`

2. **JWT_SECRET Missing**:
   - ✅ Fixed: Environment variable configured
   - Can be customized in Vercel dashboard

3. **Build Failures**:
   - Ensure all dependencies are in `package.json`
   - Check TypeScript compilation in `frontend/`

#### Verification Steps:
1. Test `/api/health` endpoint
2. Login with demo credentials
3. Navigate through all pages

### Support

For technical support or questions about Sai Kalpataru Vidyalaya programs, please refer to the registration links provided in the application.

---

**Jai Sairam!** 🙏

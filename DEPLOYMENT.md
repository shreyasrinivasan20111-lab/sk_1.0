# Sai Kalpataru Course Management System

A complete course management application for spiritual learning, featuring role-based authentication, practice tracking, and file management.

## 🚀 Production Deployment

This webapp is now ready for deployment to any domain with `index.html` at the root level.

### Quick Deploy Steps

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

### Support

For technical support or questions about Sai Kalpataru Vidyalaya programs, please refer to the registration links provided in the application.

---

**Jai Sairam!** 🙏

# 🚀 Deploy to Vercel - One Click Setup

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shreyasrinivasan20111-lab/sk_1.0)

## ⚡ Quick Start (2 minutes)

1. **Click the "Deploy with Vercel" button above**
2. **Connect your GitHub account** to Vercel
3. **Set Environment Variables** in Vercel dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=change-this-to-a-secure-random-string
   DB_PATH=/tmp/course_management.db
   UPLOAD_PATH=/tmp/uploads
   ```
4. **Deploy!** - Your app will be live at `https://your-project-name.vercel.app`

## 🔧 Environment Variables Setup

After deployment, go to your Vercel dashboard:
1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `JWT_SECRET` | `your-secure-secret-key` | JWT signing secret (make this random!) |
| `DB_PATH` | `/tmp/course_management.db` | Database location |
| `UPLOAD_PATH` | `/tmp/uploads` | File upload directory |

**Important**: Change `JWT_SECRET` to a random, secure string!

## 📱 Features Ready After Deploy

✅ **Complete Course Management System**
- User authentication (Admin/Student roles)
- Five spiritual learning classes
- Practice timer with session tracking
- File upload for learning materials
- Admin panel for user management

✅ **Spiritual Learning Classes**
1. **Kirtanam** - Devotional singing
2. **Smaranam** - Remembrance practices  
3. **Pada Sevanam** - Service practices
4. **Archanam** - Worship rituals
5. **Vandanam** - Prayer techniques

✅ **Beautiful UI**
- Responsive design with spiritual theme
- Pink/brown color scheme
- Mobile-friendly interface

## 🗄️ Database & Storage

### Current Setup (Good for Testing)
- **SQLite database** in `/tmp` directory
- **File uploads** in `/tmp/uploads`
- ⚠️ **Note**: Files in `/tmp` are temporary and reset on redeploy

### For Production (Recommended Upgrades)

#### Database Options:
- **[PlanetScale](https://planetscale.com/)** - Serverless MySQL (Free tier available)
- **[Supabase](https://supabase.com/)** - PostgreSQL with real-time features
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - NoSQL database

#### File Storage Options:
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - Integrated file storage
- **[Cloudinary](https://cloudinary.com/)** - Image/video optimization
- **[AWS S3](https://aws.amazon.com/s3/)** - Scalable file storage

## 🌐 Custom Domain (Optional)

1. In Vercel dashboard → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

## 🛠️ Local Development

Clone and run locally:
```bash
# Clone the repo
git clone https://github.com/shreyasrinivasan20111-lab/sk_1.0.git
cd sk_1.0

# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

## 📊 Vercel Limits (Free Tier)

- **Bandwidth**: 100GB/month
- **Function Execution**: 100GB-hrs/month  
- **Build Minutes**: 6000/month
- **Function Duration**: 10 seconds max
- **File Size**: 50MB per file

Perfect for small to medium-sized applications!

## 🆘 Troubleshooting

### Common Issues:

**Build Fails**
- Check that all environment variables are set
- Ensure `JWT_SECRET` is configured

**Database Empty After Deploy**
- This is normal - `/tmp` storage resets on each deploy
- Consider upgrading to persistent database for production

**API Errors**  
- Verify all environment variables in Vercel dashboard
- Check function logs in Vercel dashboard

### Get Help
- Check **Vercel Function Logs** in dashboard
- Run `npm run vercel-build` locally to test
- Use `vercel dev` for local serverless testing

## 🔐 Security Notes

1. **Change JWT_SECRET** to a random, secure string
2. **Enable HTTPS** (automatic with Vercel)
3. **Review user permissions** in admin panel
4. **Consider rate limiting** for production use

## 🎉 You're All Set!

Your Sai Kalpataru course management system is now running on Vercel!

**Default Admin Access:**
- Email: `admin@example.com`  
- Password: `admin123`
- *Change these credentials immediately after deployment*

**Jai Sairam!** 🙏

---

Need help? Check the [full deployment guide](./VERCEL-DEPLOY.md) for advanced configurations.

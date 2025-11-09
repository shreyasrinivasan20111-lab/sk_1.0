# Deployment Fix - JWT_SECRET Environment Variable

## Issue
Deployment failed with: `Environment Variable "JWT_SECRET" references Secret "jwt_secret", which does not exist.`

## Solution

### Option 1: Use Vercel Dashboard (Recommended for Production)

1. **Go to [vercel.com](https://vercel.com) and open your project**
2. **Navigate to Settings → Environment Variables**
3. **Add new environment variable:**
   - **Name**: `JWT_SECRET`
   - **Value**: `your-super-secret-jwt-key-change-this-in-production-2024`
   - **Environments**: Select all (Production, Preview, Development)
4. **Save and redeploy**

### Option 2: Current Fix Applied

I've updated `vercel.json` to use a direct environment variable instead of a Vercel secret:

```json
"env": {
  "JWT_SECRET": "your-super-secret-jwt-key-change-this-in-production-2024"
}
```

**⚠️ Security Note**: For production, you should:
1. Generate a secure random JWT secret
2. Use Vercel's Environment Variables instead of hardcoding in vercel.json

### Option 3: Generate Secure JWT Secret

Use this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Next Steps

1. **Commit and push** the updated vercel.json
2. **Redeploy** on Vercel (automatic if connected to GitHub)
3. **Replace the JWT_SECRET** with a secure random string in production

## Verification

After deployment, test the authentication:
- Login: `admin@saikalpataruvidyalaya.com` / `admin123`
- Registration should work with new accounts

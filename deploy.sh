#!/bin/bash

# Deployment script for Sai Kalpataru webapp

echo "🚀 Starting deployment process..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build the application
echo "🔨 Building application..."
npm run build

# Copy static files to root for domain deployment
echo "📋 Preparing files for domain deployment..."
cp -r dist/* ./

echo "✅ Deployment preparation complete!"
echo ""
echo "📁 Your webapp is ready for deployment:"
echo "   - index.html is now at the root level"
echo "   - All static assets are properly configured"
echo "   - Backend server will serve the frontend and API"
echo ""
echo "🌐 To deploy to your domain:"
echo "   1. Upload all files (including index.html at root) to your web server"
echo "   2. Set environment variables (check .env file)"
echo "   3. Run 'npm start' to start the server"
echo "   4. Your app will be available at your domain root"
echo ""
echo "🔧 Server commands:"
echo "   - Start production: npm start"
echo "   - Start development: npm run dev"

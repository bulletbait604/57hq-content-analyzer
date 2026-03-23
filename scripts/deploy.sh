#!/bin/bash

echo "🚀 Starting Safe Deployment Process..."

# Step 1: Run validation
echo "🔍 Step 1: Running pre-build validation..."
npm run validate
if [ $? -ne 0 ]; then
  echo "❌ Validation failed! Fix errors before deploying."
  exit 1
fi

# Step 2: Run build
echo "🔨 Step 2: Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed! Check the error messages above."
  exit 1
fi

# Step 3: Deploy to Vercel
echo "🚀 Step 3: Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"

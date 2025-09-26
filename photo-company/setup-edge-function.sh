#!/bin/bash

echo "🚀 Setting up Supabase Edge Function for Photo Watermarking"
echo "=========================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/functions/watermark-photo/index.ts" ]; then
    echo "❌ Edge Function files not found. Make sure you're in the project root directory."
    exit 1
fi

echo "✅ Supabase CLI found"
echo "✅ Edge Function files found"

# Deploy the function
echo ""
echo "📦 Deploying Edge Function..."
supabase functions deploy watermark-photo

if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully!"
else
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

# Set environment variables
echo ""
echo "🔧 Setting environment variables..."
echo "Please enter your Supabase Service Role Key:"
read -s SERVICE_KEY

supabase secrets set SUPABASE_URL=https://emlvhtbgaqwuvyblxuen.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY

echo "✅ Environment variables set"

echo ""
echo "🎉 Setup complete! You can now test photo uploads with watermarking."
echo ""
echo "Next steps:"
echo "1. Test uploading a photo in your admin panel"
echo "2. Check that watermarked versions appear in the photos-watermarked bucket"
echo "3. Test the customer search functionality"

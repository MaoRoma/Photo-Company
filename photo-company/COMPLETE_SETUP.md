# Complete Project Setup Guide

## 🚨 **Critical Issues Found & Fixed**

### **Issues Fixed:**
1. ✅ **Edge Function** - Removed Sharp import that caused deployment failure
2. ✅ **Database Schema** - Updated to use JSONB format
3. ✅ **Upload Component** - Made watermarking optional
4. ✅ **Search Component** - Handles JSONB data properly

### **Still Need to Fix:**
1. ❌ **Deploy Edge Function** - Not deployed yet
2. ❌ **Set Environment Variables** - Secrets not configured
3. ❌ **Create Storage Buckets** - May not exist
4. ❌ **Create Purchase Table** - Database schema missing

## 🚀 **Step-by-Step Setup**

### **Step 1: Deploy Edge Function**

1. **Go to Supabase Dashboard** → **Edge Functions**
2. **Click "Deploy a new function"**
3. **Choose "Via Editor"**
4. **Function name:** `watermark-photo`
5. **Copy the code** from `supabase/functions/watermark-photo/index.ts`
6. **Click "Deploy function"**

### **Step 2: Set Environment Variables**

1. **Go to Supabase Dashboard** → **Edge Functions** → **Secrets**
2. **Add these secrets:**
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://emlvhtbgaqwuvyblxuen.supabase.co`
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (Get from Settings → API → service_role key)

### **Step 3: Create Storage Buckets**

1. **Go to Supabase Dashboard** → **Storage**
2. **Create bucket:** `photos` (for original photos)
3. **Create bucket:** `photos-watermarked` (for watermarked photos)
4. **Set both to Public**

### **Step 4: Fix Database Schema**

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this SQL:**

```sql
-- Fix photo_sessions table
DROP TABLE IF EXISTS public.photo_sessions CASCADE;

CREATE TABLE public.photo_sessions (
  id text PRIMARY KEY,
  photos_count int NOT NULL DEFAULT 0,
  photo_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  admin_email text NOT NULL
);

-- Enable RLS
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read" ON public.photo_sessions
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert" ON public.photo_sessions
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON public.photo_sessions
FOR UPDATE TO anon USING (true);

-- Create photo_purchases table
CREATE TABLE IF NOT EXISTS photo_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_path TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_url TEXT,
  download_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for purchases
ALTER TABLE photo_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" ON photo_purchases
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can insert purchases" ON photo_purchases
  FOR INSERT WITH CHECK (true);
```

### **Step 5: Test the System**

1. **Go to admin panel** (`localhost:5173/admin/upload`)
2. **Upload a photo** with session ID
3. **Check console** - should work without errors
4. **Go to customer search** (`localhost:5173`)
5. **Search with session ID** - should show photos
6. **Test purchase flow** - should work

## ✅ **Expected Results**

After setup:
- ✅ Upload works without CORS errors
- ✅ Photos appear in `photos` bucket
- ✅ Copies appear in `photos-watermarked` bucket
- ✅ Customer search shows photos
- ✅ Purchase flow works
- ✅ Database stores sessions and purchases

## 🆘 **If Still Having Issues**

1. **Check Edge Function logs** in Supabase Dashboard
2. **Verify secrets are set** correctly
3. **Check storage buckets** exist and are public
4. **Verify database tables** were created
5. **Check browser console** for errors

## 🎯 **Current Status**

- ✅ **Code Fixed** - All components updated
- ❌ **Not Deployed** - Edge Function needs deployment
- ❌ **Not Configured** - Secrets and buckets needed
- ❌ **Not Tested** - System needs testing

**Next Step:** Deploy the Edge Function and set up the environment!

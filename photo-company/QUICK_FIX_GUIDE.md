# Quick Fix for Upload Error

## 🚨 **The Problem**
You're getting "invalid input syntax for type json" error because the database schema doesn't match the data format we're sending.

## ✅ **The Solution**

### **Step 1: Fix Database Schema**

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this SQL** (copy and paste the contents of `fix-database-schema.sql`):

```sql
-- Fix photo_sessions table schema to handle JSON properly
DROP TABLE IF EXISTS public.photo_sessions CASCADE;

CREATE TABLE public.photo_sessions (
  id text PRIMARY KEY,
  photos_count int NOT NULL DEFAULT 0,
  photo_paths jsonb NOT NULL DEFAULT '[]'::jsonb, -- JSONB for better performance
  status text NOT NULL DEFAULT 'active',
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  admin_email text NOT NULL
);

-- Enable RLS
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous read" ON public.photo_sessions
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert" ON public.photo_sessions
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON public.photo_sessions
FOR UPDATE TO anon USING (true);
```

### **Step 2: Test Upload Again**

1. **Refresh your browser** to clear any cached errors
2. **Try uploading a photo** with a session ID
3. **Check the console** - the error should be gone!

## 🔧 **What I Fixed**

1. **Database Schema**: Changed `photo_paths` from `text[]` to `jsonb` (better for JSON data)
2. **Upload Component**: Sends data as array (works with JSONB)
3. **Search Component**: Handles array data properly

## 🎯 **Expected Result**

- ✅ Upload should work without errors
- ✅ Photos should appear in `photos` bucket
- ✅ Watermarked versions should be created in `photos-watermarked` bucket
- ✅ Customer search should show watermarked photos

## 🚀 **Next Steps**

After fixing the database:
1. Test the upload flow
2. Deploy the Edge Function for watermarking
3. Test the complete customer flow

The upload error should now be resolved! 🎉

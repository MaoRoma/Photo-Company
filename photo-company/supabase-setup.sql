-- PhotoPrint Pro - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- =============================================
-- 1. CREATE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.photo_sessions (
  id text PRIMARY KEY,
  photos_count int NOT NULL DEFAULT 0,
  photo_paths text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  admin_email text NOT NULL
);

-- =============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. DROP EXISTING POLICIES (if any)
-- =============================================
DROP POLICY IF EXISTS "public read sessions" ON public.photo_sessions;
DROP POLICY IF EXISTS "public insert sessions" ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow anonymous read" ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.photo_sessions;

-- =============================================
-- 4. CREATE POLICIES FOR ANONYMOUS ACCESS
-- =============================================
-- Allow anonymous users to read all sessions
CREATE POLICY "Allow anonymous read" ON public.photo_sessions
FOR SELECT TO anon USING (true);

-- Allow anonymous users to insert new sessions
CREATE POLICY "Allow anonymous insert" ON public.photo_sessions
FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous users to update sessions
CREATE POLICY "Allow anonymous update" ON public.photo_sessions
FOR UPDATE TO anon USING (true);

-- =============================================
-- 5. VERIFY SETUP
-- =============================================
-- Check if table exists and RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'photo_sessions';

-- List all policies for photo_sessions
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'photo_sessions';

-- =============================================
-- 6. STORAGE BUCKET SETUP (Manual Step)
-- =============================================
-- Go to Supabase Dashboard → Storage → Create bucket named 'photos'
-- Set bucket to public or private (your choice)
-- If private, you'll need to generate signed URLs for customer access

-- =============================================
-- 7. TEST DATA (Optional)
-- =============================================
-- Insert a test session to verify everything works
-- INSERT INTO public.photo_sessions (id, photos_count, photo_paths, admin_email)
-- VALUES ('TEST001', 0, '{}', 'admin@example.com');

-- =============================================
-- NOTES
-- =============================================
-- 1. Make sure your .env file has correct Supabase credentials
-- 2. Restart your dev server after updating .env
-- 3. Create 'photos' bucket in Storage section
-- 4. Test upload functionality after running this SQL

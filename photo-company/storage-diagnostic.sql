-- Storage Diagnostic and Fix Script
-- Run this in Supabase SQL Editor to diagnose and fix Storage issues

-- 1. Check if photos bucket exists and its status
SELECT 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE name = 'photos';

-- 2. Check RLS status on storage.objects
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 3. Check existing storage policies
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 4. Create photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('photos', 'photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/heic', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/heic', 'image/webp'];

-- 5. Disable RLS on storage.objects (if you have permissions)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 6. Create storage policies for anonymous access
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "Allow anonymous uploads" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow anonymous downloads" ON storage.objects
FOR SELECT TO anon USING (bucket_id = 'photos');

CREATE POLICY "Allow anonymous updates" ON storage.objects
FOR UPDATE TO anon USING (bucket_id = 'photos');

-- 7. Verify the setup
SELECT 'Bucket Status:' as info;
SELECT name, public FROM storage.buckets WHERE name = 'photos';

SELECT 'RLS Status:' as info;
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT 'Policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

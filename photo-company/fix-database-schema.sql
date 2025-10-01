-- Fix photo_sessions table schema to handle JSON properly
-- Run this in your Supabase SQL Editor

-- Drop and recreate the table with proper JSON column
DROP TABLE IF EXISTS public.photo_sessions CASCADE;

CREATE TABLE public.photo_sessions (
  id text PRIMARY KEY,
  photos_count int NOT NULL DEFAULT 0,
  photo_paths jsonb NOT NULL DEFAULT '[]'::jsonb, -- Changed to JSONB for better performance
  status text NOT NULL DEFAULT 'active',
  payment_status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NULL,
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

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'photo_sessions' 
ORDER BY ordinal_position;

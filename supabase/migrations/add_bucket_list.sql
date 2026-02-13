-- Migration: Add bucket_list table and visibility columns
-- Run this in Supabase SQL Editor if you have an existing database

-- Add visibility columns to valentine_pages
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS show_bucket_list BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_open_when BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_coupons BOOLEAN DEFAULT true;

-- Create bucket_list table
CREATE TABLE IF NOT EXISTS public.bucket_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bucket_list ENABLE ROW LEVEL SECURITY;

-- Bucket list policies (drop if exists first to avoid conflicts)
DROP POLICY IF EXISTS "Bucket list viewable if page is published or owned" ON public.bucket_list;
DROP POLICY IF EXISTS "Users can manage their own bucket list" ON public.bucket_list;

CREATE POLICY "Bucket list viewable if page is published or owned"
  ON public.bucket_list FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = bucket_list.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own bucket list"
  ON public.bucket_list FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = bucket_list.page_id
      AND user_id = auth.uid()
    )
  );

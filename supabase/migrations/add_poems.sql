-- Migration: Add poems table for LoveBook
-- Run this in Supabase SQL Editor

-- Create poems table
CREATE TABLE IF NOT EXISTS public.poems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- Poems policies
DROP POLICY IF EXISTS "Poems viewable if page is published or owned" ON public.poems;
DROP POLICY IF EXISTS "Users can manage their own poems" ON public.poems;

CREATE POLICY "Poems viewable if page is published or owned"
  ON public.poems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = poems.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own poems"
  ON public.poems FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = poems.page_id
      AND user_id = auth.uid()
    )
  );

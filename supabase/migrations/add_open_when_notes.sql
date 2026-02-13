-- Migration: Add open_when_notes table
-- Run this in Supabase SQL Editor

-- Create open_when_notes table
CREATE TABLE IF NOT EXISTS public.open_when_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT DEFAULT 'solar:heart-linear',
  icon_color TEXT DEFAULT 'text-rose-400',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.open_when_notes ENABLE ROW LEVEL SECURITY;

-- Open when notes policies (drop if exists first to avoid conflicts)
DROP POLICY IF EXISTS "Open when notes viewable if page is published or owned" ON public.open_when_notes;
DROP POLICY IF EXISTS "Users can manage their own open when notes" ON public.open_when_notes;

CREATE POLICY "Open when notes viewable if page is published or owned"
  ON public.open_when_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = open_when_notes.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own open when notes"
  ON public.open_when_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = open_when_notes.page_id
      AND user_id = auth.uid()
    )
  );

-- =============================================
-- VALS.LOVE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- VALENTINE PAGES TABLE
-- =============================================
CREATE TABLE public.valentine_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_name TEXT DEFAULT 'My Love',
  sender_name TEXT DEFAULT 'Your Secret Admirer',
  start_date DATE DEFAULT CURRENT_DATE,
  hero_title TEXT DEFAULT 'To My Everything',
  hero_subtitle TEXT DEFAULT 'A little corner of the internet, just for you',
  primary_color TEXT DEFAULT 'rose',
  is_published BOOLEAN DEFAULT false,
  show_bucket_list BOOLEAN DEFAULT true,
  show_open_when BOOLEAN DEFAULT true,
  show_coupons BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One page per user for now
);

-- Enable RLS
ALTER TABLE public.valentine_pages ENABLE ROW LEVEL SECURITY;

-- Valentine pages policies
CREATE POLICY "Published pages are viewable by everyone"
  ON public.valentine_pages FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own page"
  ON public.valentine_pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own page"
  ON public.valentine_pages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own page"
  ON public.valentine_pages FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- GALLERY ITEMS TABLE
-- =============================================
CREATE TABLE public.gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  src TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
  caption TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Gallery items policies
CREATE POLICY "Gallery items viewable if page is published or owned"
  ON public.gallery_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = gallery_items.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own gallery items"
  ON public.gallery_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = gallery_items.page_id
      AND user_id = auth.uid()
    )
  );

-- =============================================
-- TIMELINE ITEMS TABLE
-- =============================================
CREATE TABLE public.timeline_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_src TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

-- Timeline items policies
CREATE POLICY "Timeline items viewable if page is published or owned"
  ON public.timeline_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = timeline_items.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own timeline items"
  ON public.timeline_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = timeline_items.page_id
      AND user_id = auth.uid()
    )
  );

-- =============================================
-- REASONS TABLE (Why I Love You)
-- =============================================
CREATE TABLE public.reasons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reasons ENABLE ROW LEVEL SECURITY;

-- Reasons policies
CREATE POLICY "Reasons viewable if page is published or owned"
  ON public.reasons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = reasons.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own reasons"
  ON public.reasons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = reasons.page_id
      AND user_id = auth.uid()
    )
  );

-- =============================================
-- BUCKET LIST TABLE
-- =============================================
CREATE TABLE public.bucket_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bucket_list ENABLE ROW LEVEL SECURITY;

-- Bucket list policies
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

-- =============================================
-- LOVE POEMS TABLE
-- =============================================
CREATE TABLE public.love_poems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.valentine_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  lines TEXT[] NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.love_poems ENABLE ROW LEVEL SECURITY;

-- Poems policies
CREATE POLICY "Poems viewable if page is published or owned"
  ON public.love_poems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = love_poems.page_id
      AND (is_published = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own poems"
  ON public.love_poems FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.valentine_pages
      WHERE id = love_poems.page_id
      AND user_id = auth.uid()
    )
  );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  
  -- Also create a default valentine page for them
  INSERT INTO public.valentine_pages (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_valentine_pages_updated_at
  BEFORE UPDATE ON public.valentine_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-uploads');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

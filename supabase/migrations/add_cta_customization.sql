-- Migration: Add CTA customization columns and visibility controls
-- Run this in Supabase SQL Editor

-- Add visibility controls (poems already added, add timeline and gallery)
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS show_poems BOOLEAN DEFAULT true;

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS show_timeline BOOLEAN DEFAULT true;

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS show_gallery BOOLEAN DEFAULT true;

-- Add reason card customization
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS reason_card_title TEXT DEFAULT 'Why I Love You';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS reason_card_subtitle TEXT DEFAULT 'Tap to reveal a reason';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS reason_card_button TEXT DEFAULT 'Tell Me Why';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS reason_card_another_button TEXT DEFAULT 'Another One';

-- Add valentine card customization
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS valentine_card_label TEXT DEFAULT 'Important';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS valentine_card_question TEXT DEFAULT 'Will you be my Valentine?';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS valentine_card_yes_text TEXT DEFAULT 'Yes, Always';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS valentine_card_no_text TEXT DEFAULT 'No';

-- Celebration Modal (Yes popup) customization
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS celebration_title TEXT DEFAULT 'Yay! ❤️';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS celebration_message TEXT DEFAULT 'You just made me the happiest person alive. I love you so much!';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS celebration_button TEXT DEFAULT 'Can''t wait!';

-- Rejection Modal (first No popup) customization
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS rejection_title TEXT DEFAULT 'Are you sure?';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS rejection_message TEXT DEFAULT 'My heart might break into a million pieces...';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS rejection_accept_button TEXT DEFAULT 'Yes, I''ll be yours';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS rejection_reject_button TEXT DEFAULT 'Still No';

-- Second Rejection Modal (final No popup) customization
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS second_rejection_title TEXT DEFAULT 'Last Chance!';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS second_rejection_message TEXT DEFAULT 'I''ll make you the happiest person, I promise!';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS second_rejection_accept_button TEXT DEFAULT 'Okay, Yes! ❤️';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS second_rejection_reject_button TEXT DEFAULT 'No 😤';

-- Love Virus Effect (appears after final No) customization
ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS virus_images TEXT[] DEFAULT '{}';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS virus_messages TEXT[] DEFAULT ARRAY['I LOVE YOU! 💕', 'YOU''RE MINE! 💝', 'FOREVER! 💗', 'MY BABY! 🥰', 'LOCKED IN! 🔐', 'NO ESCAPE! 😘'];

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS virus_final_title TEXT DEFAULT 'You can''t escape my love!';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS virus_final_message TEXT DEFAULT 'At this point you don''t even have an option, we locked in 😂😂';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS virus_final_submessage TEXT DEFAULT 'Every moment with you is a treasure. Please be my Valentine? 🥺';

ALTER TABLE public.valentine_pages 
ADD COLUMN IF NOT EXISTS virus_final_button TEXT DEFAULT 'Fine, YES! I love you too! ❤️';

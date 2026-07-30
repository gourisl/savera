-- Savera Database Migration: Additional Tables & Columns
-- Run this in the Supabase SQL Editor after the initial schema

-- 1. Add FAQs table (for admin-editable FAQ section)
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add sort_order and is_visible to categories (if not present)
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- 3. Add subscribed_at to newsletter_subscribers (if not present)
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Add awb_number column to orders for shipping tracking (if not present)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS awb_number TEXT;

-- 5. Make settings.value TEXT instead of JSONB for simpler key/value pairs
-- (Only run this if you started fresh — skip if you already have settings data in JSONB format)
-- ALTER TABLE public.settings ALTER COLUMN value TYPE TEXT USING value::text;

-- 6. Add hero settings keys (run once to seed defaults)
INSERT INTO public.settings (key, value) VALUES
  ('hero_title', '"Elegance in Every Detail"'),
  ('hero_subtitle', '"Discover our premium collection of handcrafted, anti-tarnish jewellery designed for the modern muse."'),
  ('hero_badge', '"New Collection 2026"'),
  ('hero_cta_label', '"Shop the Collection"'),
  ('hero_cta2_label', '"Explore Lookbook"'),
  ('hero_banner_url', '""'),
  ('store_name', '"Savera"'),
  ('store_tagline', '"Timeless Luxury Jewellery"'),
  ('shipping_fee', '50'),
  ('free_shipping_threshold', '999')
ON CONFLICT (key) DO NOTHING;

-- 7. Add default FAQs (run once)
INSERT INTO public.faqs (question, answer, sort_order) VALUES
  ('Is your jewellery really anti-tarnish?', 'Yes! All our anti-tarnish collections are coated with a special rhodium or PVD layer that protects against oxidation, sweat, and moisture. With proper care, the shine lasts for years.', 0),
  ('How long does delivery take?', 'We typically deliver within 5–7 business days across India. Metro cities often receive orders within 3–4 days. You will receive a tracking link once your order is shipped.', 1),
  ('What is your return policy?', 'We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can initiate a return from your account dashboard. The item must be unused and in its original packaging.', 2),
  ('Do you offer gift wrapping?', 'Absolutely! Every Savera order comes in our signature luxury packaging at no extra cost. For special occasions, you can add a personalized gift message during checkout.', 3),
  ('How do I care for my jewellery?', 'Store your pieces in the provided pouch when not wearing them. Avoid direct contact with perfumes, lotions, and water. Gently wipe with a soft cloth after each use.', 4),
  ('Can I track my order?', 'Yes! Once your order is shipped, you will receive a tracking link via email. You can also track your order anytime from the Track Order page.', 5)
ON CONFLICT DO NOTHING;

-- 8. Enable RLS on new tables
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for new tables
CREATE POLICY "FAQs viewable by everyone" ON public.faqs FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL USING (true);
CREATE POLICY "Newsletter subscribers viewable by admin" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Newsletter subscribers deletable by admin" ON public.newsletter_subscribers FOR DELETE USING (true);

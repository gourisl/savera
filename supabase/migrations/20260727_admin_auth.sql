-- Migration: Admin Auth & Profile RLS Policies
-- File: supabase/migrations/20260727_admin_auth.sql

-- 1. Ensure profiles table structure with active status and updated_at
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns if table already existed without active/updated_at
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Automatic Profile Creation Trigger for new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role, active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone_number',
    CASE WHEN NEW.email = 'saverabygourii@gmail.com' THEN 'admin' ELSE 'customer' END,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    active = true,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Seed / Update existing user saverabygourii@gmail.com to Admin
INSERT INTO public.profiles (id, full_name, role, active, created_at, updated_at)
SELECT 
  id, 
  'Gouri', 
  'admin', 
  true, 
  NOW(), 
  NOW()
FROM auth.users
WHERE email = 'saverabygourii@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Gouri',
  role = 'admin',
  active = true,
  updated_at = NOW();

-- 5. RLS Policies for Admin Access across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Policy Grants
CREATE POLICY "Admins full management on profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on order_items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on coupons" ON public.coupons FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on reviews" ON public.reviews FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full management on settings" ON public.settings FOR ALL USING (public.is_admin());

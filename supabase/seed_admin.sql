-- SQL Seed to grant admin role to saverabygourii@gmail.com
-- Run this in your Supabase SQL Editor

-- 1. Create user in auth.users if not exists (or update profile role)
INSERT INTO public.profiles (id, full_name, phone_number, role, created_at)
SELECT id, 'Admin Savera', '+919876543210', 'admin', NOW()
FROM auth.users
WHERE email = 'saverabygourii@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- 2. Security Policy to allow admins full control
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

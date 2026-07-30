-- ============================================================
-- SAVERA Admin RLS Fix: Full Admin Access to All Tables
-- Run this in Supabase SQL Editor → https://supabase.com/dashboard
-- ============================================================

-- Drop existing restrictive policies before recreating
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Products viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Approved reviews viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Coupons viewable by everyone" ON public.coupons;
DROP POLICY IF EXISTS "Settings viewable by everyone" ON public.settings;
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Newsletter subscribers viewable by admin" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Newsletter subscribers deletable by admin" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "FAQs viewable by everyone" ON public.faqs;
DROP POLICY IF EXISTS "Admins manage faqs" ON public.faqs;
DROP POLICY IF EXISTS "Profiles viewable by self or admin" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Product images viewable by everyone" ON public.product_images;

-- ============================================================
-- HELPER FUNCTION: check if current user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) OR (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) = 'saverabygourii@gmail.com'
$$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE POLICY "categories_select_all" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL USING (public.is_admin());

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE POLICY "products_select_all" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (public.is_admin());

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE POLICY "product_images_select_all" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "product_images_admin_all" ON public.product_images
  FOR ALL USING (public.is_admin());

-- ============================================================
-- ORDERS
-- ============================================================
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_all" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "orders_delete_admin" ON public.orders
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE POLICY "order_items_select_own" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert_all" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_admin_all" ON public.order_items
  FOR ALL USING (public.is_admin());

-- ============================================================
-- COUPONS
-- ============================================================
CREATE POLICY "coupons_select_active" ON public.coupons
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL USING (public.is_admin());

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE POLICY "reviews_select_approved" ON public.reviews
  FOR SELECT USING (is_approved = true OR public.is_admin());

CREATE POLICY "reviews_insert_authenticated" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "reviews_admin_all" ON public.reviews
  FOR ALL USING (public.is_admin());

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE POLICY "wishlist_user_own" ON public.wishlist
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "wishlist_admin_all" ON public.wishlist
  FOR ALL USING (public.is_admin());

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE POLICY "settings_select_all" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_all" ON public.settings
  FOR ALL USING (public.is_admin());

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE POLICY "newsletter_insert_all" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_admin_all" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin());

-- ============================================================
-- FAQS
-- ============================================================
CREATE POLICY "faqs_select_visible" ON public.faqs
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "faqs_admin_all" ON public.faqs
  FOR ALL USING (public.is_admin());

-- ============================================================
-- ADDRESSES
-- ============================================================
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;

CREATE POLICY "addresses_user_own" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "addresses_admin_all" ON public.addresses
  FOR ALL USING (public.is_admin());

-- ============================================================
-- SEED: Ensure admin profile exists for saverabygourii@gmail.com
-- ============================================================
INSERT INTO public.profiles (id, full_name, role, active)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'Gouri'),
  'admin',
  true
FROM auth.users
WHERE email = 'saverabygourii@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', active = true;

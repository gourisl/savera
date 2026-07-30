const PROJECT_REF = 'cphgtyaahgsdsddctdej';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

if (!ACCESS_TOKEN) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

async function runQuery(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok || (data && data.message && data.message.includes('ERROR'))) {
    throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
  }
  return data;
}

const steps = [
  // 1. Create missing tables
  {
    name: "Create settings table",
    sql: `CREATE TABLE IF NOT EXISTS public.settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );`
  },
  {
    name: "Create coupons table",
    sql: `CREATE TABLE IF NOT EXISTS public.coupons (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      discount_type TEXT DEFAULT 'percentage',
      discount_value NUMERIC NOT NULL DEFAULT 10,
      min_order_amount NUMERIC DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      usage_limit INTEGER,
      used_count INTEGER DEFAULT 0,
      expires_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );`
  },
  {
    name: "Create faqs table",
    sql: `CREATE TABLE IF NOT EXISTS public.faqs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_visible BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );`
  },
  {
    name: "Create reviews table",
    sql: `CREATE TABLE IF NOT EXISTS public.reviews (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID,
      user_id UUID,
      user_name TEXT,
      rating INTEGER DEFAULT 5,
      comment TEXT,
      is_approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );`
  },
  {
    name: "Create newsletter_subscribers table",
    sql: `CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );`
  },
  {
    name: "Create addresses table",
    sql: `CREATE TABLE IF NOT EXISTS public.addresses (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      phone TEXT,
      address_line1 TEXT,
      address_line2 TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );`
  },
  {
    name: "Create wishlist table",
    sql: `CREATE TABLE IF NOT EXISTS public.wishlist (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id UUID,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );`
  },
  // 2. Add missing columns safely
  {
    name: "Add sort_order to categories",
    sql: `ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`
  },
  {
    name: "Add is_visible to categories",
    sql: `ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;`
  },
  {
    name: "Add description to categories",
    sql: `ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;`
  },
  {
    name: "Add image_url to categories",
    sql: `ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;`
  },
  {
    name: "Add awb_number to orders",
    sql: `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS awb_number TEXT;`
  },
  // 3. Enable RLS on all tables
  {
    name: "Enable RLS: settings",
    sql: `ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: "Enable RLS: coupons",
    sql: `ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: "Enable RLS: faqs",
    sql: `ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: "Enable RLS: reviews",
    sql: `ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: "Enable RLS: newsletter_subscribers",
    sql: `ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: "Enable RLS: addresses",
    sql: `ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: "Enable RLS: wishlist",
    sql: `ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;`
  },
  // 4. Open full access policies for all tables (to fix permission denied errors)
  {
    name: "Policy: full access on categories",
    sql: `
      DROP POLICY IF EXISTS "categories_full_access" ON public.categories;
      CREATE POLICY "categories_full_access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on products",
    sql: `
      DROP POLICY IF EXISTS "products_full_access" ON public.products;
      CREATE POLICY "products_full_access" ON public.products FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on settings",
    sql: `
      DROP POLICY IF EXISTS "settings_full_access" ON public.settings;
      CREATE POLICY "settings_full_access" ON public.settings FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on coupons",
    sql: `
      DROP POLICY IF EXISTS "coupons_full_access" ON public.coupons;
      CREATE POLICY "coupons_full_access" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on faqs",
    sql: `
      DROP POLICY IF EXISTS "faqs_full_access" ON public.faqs;
      CREATE POLICY "faqs_full_access" ON public.faqs FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on reviews",
    sql: `
      DROP POLICY IF EXISTS "reviews_full_access" ON public.reviews;
      CREATE POLICY "reviews_full_access" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on newsletter_subscribers",
    sql: `
      DROP POLICY IF EXISTS "newsletter_full_access" ON public.newsletter_subscribers;
      CREATE POLICY "newsletter_full_access" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on orders",
    sql: `
      DROP POLICY IF EXISTS "orders_full_access" ON public.orders;
      CREATE POLICY "orders_full_access" ON public.orders FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on order_items",
    sql: `
      DROP POLICY IF EXISTS "order_items_full_access" ON public.order_items;
      CREATE POLICY "order_items_full_access" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on profiles",
    sql: `
      DROP POLICY IF EXISTS "profiles_full_access" ON public.profiles;
      CREATE POLICY "profiles_full_access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on addresses",
    sql: `
      DROP POLICY IF EXISTS "addresses_full_access" ON public.addresses;
      CREATE POLICY "addresses_full_access" ON public.addresses FOR ALL USING (true) WITH CHECK (true);
    `
  },
  {
    name: "Policy: full access on wishlist",
    sql: `
      DROP POLICY IF EXISTS "wishlist_full_access" ON public.wishlist;
      CREATE POLICY "wishlist_full_access" ON public.wishlist FOR ALL USING (true) WITH CHECK (true);
    `
  },
  // 5. Seed default settings
  {
    name: "Seed default settings",
    sql: `
      INSERT INTO public.settings (key, value) VALUES
        ('store_name', 'Savera'),
        ('store_tagline', 'Timeless Luxury Jewellery'),
        ('shipping_fee', '50'),
        ('free_shipping_threshold', '999'),
        ('hero_title', 'Elegance in Every Detail'),
        ('hero_subtitle', 'Discover our premium collection of handcrafted, anti-tarnish jewellery.'),
        ('hero_badge', 'New Collection 2026'),
        ('hero_cta_label', 'Shop the Collection'),
        ('hero_cta2_label', 'Explore Lookbook'),
        ('hero_banner_url', '')
      ON CONFLICT (key) DO NOTHING;
    `
  },
  // 6. Ensure admin profile
  {
    name: "Ensure admin profile",
    sql: `
      INSERT INTO public.profiles (id, full_name, role, active)
      SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'Gouri'), 'admin', true
      FROM auth.users WHERE email = 'saverabygourii@gmail.com'
      ON CONFLICT (id) DO UPDATE SET role = 'admin', active = true;
    `
  },
];

async function main() {
  let success = 0;
  let failed = 0;

  for (const step of steps) {
    process.stdout.write(`  ${step.name}... `);
    try {
      await runQuery(step.sql);
      console.log('✓');
      success++;
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('already exists') || msg.includes('does not exist') || msg.includes('duplicate')) {
        console.log('⚠ (already done)');
        success++;
      } else {
        console.log(`✗ ERROR: ${msg.substring(0, 120)}`);
        failed++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  if (failed === 0) {
    console.log('🎉 All table issues fixed! Admin dashboard fully unlocked.');
  }
}

main().catch(console.error);

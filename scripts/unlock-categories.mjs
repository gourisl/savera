const PROJECT_REF = 'cphgtyaahgsdsddctdej';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

if (!ACCESS_TOKEN) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const queries = [
  'DROP POLICY IF EXISTS "categories_all_permit" ON public.categories; CREATE POLICY "categories_all_permit" ON public.categories FOR ALL USING (true) WITH CHECK (true);',
  'DROP POLICY IF EXISTS "products_all_permit" ON public.products; CREATE POLICY "products_all_permit" ON public.products FOR ALL USING (true) WITH CHECK (true);',
  'DROP POLICY IF EXISTS "coupons_all_permit" ON public.coupons; CREATE POLICY "coupons_all_permit" ON public.coupons FOR ALL USING (true) WITH CHECK (true);',
  'DROP POLICY IF EXISTS "reviews_all_permit" ON public.reviews; CREATE POLICY "reviews_all_permit" ON public.reviews FOR ALL USING (true) WITH CHECK (true);',
  'DROP POLICY IF EXISTS "settings_all_permit" ON public.settings; CREATE POLICY "settings_all_permit" ON public.settings FOR ALL USING (true) WITH CHECK (true);',
  'DROP POLICY IF EXISTS "orders_all_permit" ON public.orders; CREATE POLICY "orders_all_permit" ON public.orders FOR ALL USING (true) WITH CHECK (true);',
];

async function main() {
  for (const query of queries) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    console.log("Query executed:", query.substring(0, 40), "->", data);
  }
}

main().catch(console.error);

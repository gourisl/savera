import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cphgtyaahgsdsddctdej.supabase.co";
const supabaseAnonKey = "sb_publishable_6n1KpbX0ABraLm0lXx2ETw_uSGwfQfO";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = [
  { name: "Necklaces", slug: "necklaces" },
  { name: "Earrings", slug: "earrings" },
  { name: "Rings", slug: "rings" },
  { name: "Bracelets", slug: "bracelets" },
];

const products = [
  {
    name: "Lumina Pearl Choker",
    slug: "lumina-pearl-choker",
    description: "Handcrafted in 18k gold plating featuring luminous freshwater pearls.",
    price: 4999,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop"],
  },
  {
    name: "Aura Diamond Drop Earrings",
    slug: "aura-diamond-drop-earrings",
    description: "Elegant cubic zirconia crystals cascading down delicate rose gold chains.",
    price: 3299,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"],
  },
  {
    name: "Celeste Solitaire Ring",
    slug: "celeste-solitaire-ring",
    description: "Timeless 1.5ct solitaire setting on a classic polished band.",
    price: 6499,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop"],
  },
  {
    name: "Seraphina Rose Gold Bangle",
    slug: "seraphina-rose-gold-bangle",
    description: "Minimalist open-cuff bangle crafted with subtle pavé stone detail.",
    price: 3899,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"],
  },
];

async function seed() {
  console.log("Seeding database categories...");
  for (const cat of categories) {
    const { data, error } = await supabase.from("categories").upsert(cat, { onConflict: "slug" }).select();
    if (error) console.error("Category error:", error.message);
    else console.log("Category added:", cat.name);
  }

  console.log("Seeding products...");
  const { data: catData } = await supabase.from("categories").select("*");
  const necklaceCat = catData?.find((c) => c.slug === "necklaces");

  for (const prod of products) {
    const { error } = await supabase.from("products").upsert(
      { ...prod, category_id: necklaceCat?.id || null },
      { onConflict: "slug" }
    );
    if (error) console.error("Product error:", error.message);
    else console.log("Product added:", prod.name);
  }

  console.log("Seeding complete!");
}

seed();

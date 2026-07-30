"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Filter, ChevronDown, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { use } from "react";

export default function CategoryCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  async function fetchCategoryAndProducts() {
    setLoading(true);

    try {
      // Find category by slug
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (catData) {
        setCategoryName(catData.name);
        const { data: prodData } = await supabase
          .from("products")
          .select("*, categories(name)")
          .eq("category_id", catData.id);
        setProducts(prodData || []);
      } else {
        // Fallback: search products matching tag or name if category slug is loose
        const formattedTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        setCategoryName(formattedTitle);

        const { data: prodData } = await supabase
          .from("products")
          .select("*, categories(name)")
          .ilike("name", `%${slug.split("-")[0]}%`);
        setProducts(prodData || []);
      }
    } catch (err) {
      console.error("Error fetching collection:", err);
    } finally {
      setLoading(false);
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary-gold)] font-bold mb-2 block">
            Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4 uppercase tracking-wide">
            {categoryName || "Jewellery Collection"}
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto text-sm">
            Handcrafted pieces curated specifically for timeless luxury and everyday brilliance.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 border-y border-[var(--color-primary-blush)] mb-10 gap-4">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">
            Showing {sortedProducts.length} Items
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-gray-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary-gold)] uppercase tracking-wider"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
            <h3 className="text-xl font-serif text-[var(--color-text-main)] mb-2">No items in this collection yet</h3>
            <p className="text-sm text-gray-500 mb-6">Explore our complete catalog to find your favorite piece.</p>
            <Link href="/shop" className="px-6 py-3 bg-[var(--color-text-main)] text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-[var(--color-primary-gold)] transition-colors inline-block">
              Browse All Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {sortedProducts.map((product) => (
              <div key={product.id} className="group relative cursor-pointer">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-[var(--color-surface-light)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.discount_percent > 0 && (
                      <span className="absolute top-3 left-3 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm z-10">
                        {product.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest text-[var(--color-text-light)] uppercase mb-1 block font-bold">
                      {product.categories?.name || categoryName}
                    </span>
                    <h3 className="text-base font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <p className="text-[var(--color-text-main)] font-bold text-sm">₹{product.price}</p>
                      {product.original_price && (
                        <p className="text-[var(--color-text-light)] line-through text-xs">₹{product.original_price}</p>
                      )}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop",
                      quantity: 1,
                    })
                  }
                  className="w-full mt-3 bg-[var(--color-text-main)] text-white py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2 rounded-lg"
                >
                  <ShoppingBag size={14} /> Quick Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

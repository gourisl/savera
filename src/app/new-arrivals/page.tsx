"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { SlidersHorizontal, ChevronDown, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

const PLACEHOLDER = "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchNewArrivals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  async function fetchNewArrivals() {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*, categories(name)")
      .limit(24);

    if (sortBy === "price_asc") query = query.order("price", { ascending: true });
    else if (sortBy === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
  }

  const getImage = (product: any) =>
    product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      {/* Hero */}
      <section className="relative py-14 bg-gradient-to-b from-[var(--color-primary-ivory)] to-white overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={12} />
            Just Dropped
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-text-main)] mb-4">New Arrivals</h1>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto text-sm">
            Fresh additions to our collection — be the first to own these stunning new designs crafted with care.
          </p>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {/* Sort Bar */}
        <div className="flex flex-wrap justify-between items-center py-4 border-b border-[var(--color-primary-blush)] mb-8 gap-4">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            {loading ? "Loading..." : `${products.length} pieces`}
          </span>

          <div className="relative flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[var(--color-text-light)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none text-xs uppercase tracking-widest pr-7 pl-2 py-1.5 border border-gray-200 rounded-md focus:outline-none bg-white text-[var(--color-text-main)] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles size={40} className="text-[var(--color-primary-gold)] mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">New Arrivals Coming Soon</h3>
            <p className="text-[var(--color-text-muted)] mb-6 text-sm">Exciting new pieces are on their way. Check back soon!</p>
            <Link href="/shop" className="inline-block px-6 py-3 border border-[var(--color-text-main)] text-sm font-medium hover:bg-[var(--color-text-main)] hover:text-white transition-colors">
              Browse All Jewellery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-[var(--color-surface-light)]">
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm shadow-sm">
                    New
                  </span>
                  {product.discount_percent > 0 && (
                    <span className="absolute top-3 right-3 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm">
                      {product.discount_percent}% OFF
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        image: getImage(product),
                        quantity: 1,
                      });
                    }}
                    className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[var(--color-text-main)] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary-gold)] transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
                <span className="text-[10px] tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                  {product.categories?.name || "Jewellery"}
                </span>
                <h3 className="text-base font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--color-text-main)]">₹{Number(product.price).toLocaleString()}</p>
                  {product.original_price && (
                    <p className="text-xs text-[var(--color-text-light)] line-through">₹{Number(product.original_price).toLocaleString()}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

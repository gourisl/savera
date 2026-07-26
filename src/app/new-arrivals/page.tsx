"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })
        .limit(12);
      setProducts(data || []);
      setLoading(false);
    }
    fetchNewArrivals();
  }, []);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">Just Dropped</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">New Arrivals</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Fresh additions to our collection — be the first to own these stunning new designs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-4 border-y border-[var(--color-primary-blush)] mb-10 gap-4">
          <button className="flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors uppercase tracking-widest text-sm font-medium">
            <Filter size={18} />
            Filter
          </button>
          <div className="text-sm text-[var(--color-text-muted)]">
            Showing {products.length} items
          </div>
          <button className="flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors uppercase tracking-widest text-sm font-medium">
            Sort by: Newest
            <ChevronDown size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-sm" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">Coming Soon</h3>
            <p className="text-[var(--color-text-muted)]">Exciting new pieces are on their way. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, index) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-[var(--color-surface-light)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={placeholderImages[index % placeholderImages.length]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[var(--color-text-main)] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                    New
                  </span>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <span className="text-xs tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                  {product.categories?.name || "Jewellery"}
                </span>
                <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[var(--color-text-main)] font-medium">₹{product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

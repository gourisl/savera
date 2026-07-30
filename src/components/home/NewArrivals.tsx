"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const PLACEHOLDER = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })
        .limit(3);
      setProducts(data || []);
      setLoading(false);
    }
    fetchNewArrivals();
  }, []);

  const getImage = (product: any) =>
    product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER;

  if (loading || products.length === 0) {
    return (
      <section className="py-24 bg-[var(--color-primary-ivory)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">Just Dropped</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className={`bg-gray-200 rounded-lg mb-4 ${i === 1 ? "aspect-[3/5]" : "aspect-[4/3]"}`} />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[var(--color-primary-ivory)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Just Dropped
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            New Arrivals
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
            Be the first to discover our latest additions — crafted with the season&apos;s most coveted designs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className={`group cursor-pointer ${index === 0 ? "md:row-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden rounded-lg bg-[var(--color-surface-light)] ${index === 0 ? "aspect-[3/5]" : "aspect-[4/3]"} mb-4`}>
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[var(--color-text-main)] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider z-10">
                  New
                </span>
                {product.discount_percent > 0 && (
                  <span className="absolute top-4 right-4 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase z-10">
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
              </div>
              <span className="text-[10px] tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                {product.categories?.name || "Jewellery"}
              </span>
              <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-[var(--color-text-muted)] font-semibold text-sm">₹{Number(product.price).toLocaleString()}</p>
                {product.original_price && (
                  <p className="text-[var(--color-text-light)] line-through text-xs">₹{Number(product.original_price).toLocaleString()}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 font-medium tracking-wide group"
          >
            View All New Arrivals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

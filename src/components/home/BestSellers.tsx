"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

const PLACEHOLDER = "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop";

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchBestSellers() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("is_bestseller", true)
        .order("created_at", { ascending: false })
        .limit(4);

      // Fallback: just fetch 4 recent products if no bestsellers flagged
      if (!data || data.length === 0) {
        const { data: fallback } = await supabase
          .from("products")
          .select("*, categories(name)")
          .order("created_at", { ascending: false })
          .limit(4);
        setProducts(fallback || []);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchBestSellers();
  }, []);

  const getImage = (product: any) =>
    product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER;

  if (loading) {
    return (
      <section className="py-24 bg-[var(--color-surface-white)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between mb-12">
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-surface-white)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
              Most Loved
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)]">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors group mt-4 md:mt-0"
          >
            <span className="font-medium tracking-wide uppercase text-sm border-b border-transparent group-hover:border-[var(--color-primary-gold)] pb-1 transition-all">
              Shop All
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-[var(--color-surface-light)]">
                {product.discount_percent > 0 && (
                  <span className="absolute top-3 left-3 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm shadow-sm">
                    {product.discount_percent}% OFF
                  </span>
                )}
                {product.is_bestseller && (
                  <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm">
                    Best Seller
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
                  className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[var(--color-text-main)] text-white py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--color-primary-gold)] transition-colors"
                >
                  <ShoppingBag size={13} /> Add to Cart
                </button>
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                  {product.categories?.name || "Jewellery"}
                </span>
                <h3 className="text-base md:text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-[var(--color-text-main)] font-semibold text-sm">₹{Number(product.price).toLocaleString()}</p>
                  {product.original_price && (
                    <p className="text-[var(--color-text-light)] line-through text-xs">₹{Number(product.original_price).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

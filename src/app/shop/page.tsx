"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Filter, ChevronDown } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    // In a real app, you'd fetch from product_images too or join them
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  // Placeholder images for now since we don't have Cloudinary setup yet
  const placeholderImages = [
    "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">All Jewellery</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Explore our complete collection of handcrafted, anti-tarnish pieces designed to bring out your inner radiance.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 border-y border-[var(--color-primary-blush)] mb-10 gap-4">
          <button className="flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors uppercase tracking-widest text-sm font-medium w-full md:w-auto justify-center md:justify-start">
            <Filter size={18} />
            Filter
          </button>
          <div className="text-sm text-[var(--color-text-muted)]">
            Showing {products.length} products
          </div>
          <button className="flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors uppercase tracking-widest text-sm font-medium w-full md:w-auto justify-center md:justify-end">
            Sort by: Featured
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-sm"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">No products found</h3>
            <p className="text-[var(--color-text-muted)]">Check back soon for new arrivals.</p>
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
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white text-[var(--color-text-main)] px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 w-[80%] hover:bg-[var(--color-primary-gold)] hover:text-white shadow-lg">
                    Quick Add
                  </button>
                </div>
                <div>
                  <span className="text-xs tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                    {product.categories?.name || 'Jewellery'}
                  </span>
                  <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <p className="text-[var(--color-text-main)] font-medium">₹{product.price}</p>
                    {product.original_price && (
                      <p className="text-[var(--color-text-light)] line-through text-sm">₹{product.original_price}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination placeholder */}
        {!loading && products.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button className="px-8 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 font-medium tracking-wide uppercase text-sm">
              Load More
            </button>
          </div>
        )}

      </div>
      
      <Footer />
    </main>
  );
}

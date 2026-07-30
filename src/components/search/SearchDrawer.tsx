"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SearchDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-search-drawer", handleOpen);
    return () => window.removeEventListener("open-search-drawer", handleOpen);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function performSearch(searchTerm: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, price, original_price, images, category_id, categories(name)")
        .ilike("name", `%${searchTerm}%`)
        .limit(6);

      if (!error && data) {
        setResults(data);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border-b border-gray-100 py-6 px-4 md:px-8 shadow-lg">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <Search size={24} className="text-[var(--color-primary-gold)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for rings, earrings, anti-tarnish necklaces..."
            className="w-full text-lg md:text-xl font-serif text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:font-sans"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="ml-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto container mx-auto max-w-4xl p-6 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-white/80 gap-3">
            <Loader2 size={24} className="animate-spin" />
            <span>Searching Savera catalog...</span>
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-16 text-white/90">
            <p className="text-lg font-serif mb-2">No items matching &quot;{query}&quot;</p>
            <p className="text-sm text-gray-300">Try searching for &quot;Necklace&quot;, &quot;Earrings&quot;, or &quot;Ring&quot;.</p>
          </div>
        ) : query && results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-white/80 text-sm font-medium border-b border-white/10 pb-2">
              <span>{results.length} Products Found</span>
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-primary-gold)] hover:underline flex items-center gap-1"
              >
                View all results <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="bg-white rounded-xl p-3 flex gap-3 hover:shadow-lg transition-all group"
                >
                  <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        product.images && product.images[0]
                          ? product.images[0]
                          : "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=200&auto=format&fit=crop"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-primary-gold)] tracking-widest block truncate">
                      {product.categories?.name || "Jewellery"}
                    </span>
                    <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-[var(--color-primary-gold)] transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-gray-900">₹{product.price}</span>
                      {product.original_price && (
                        <span className="text-[10px] text-gray-400 line-through">₹{product.original_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-white/80">
            <h4 className="text-xs uppercase tracking-widest text-gray-300 font-bold mb-4">Popular Searches</h4>
            <div className="flex flex-wrap gap-2">
              {["Anti Tarnish Necklaces", "Korean Earrings", "Gold Plated Rings", "Pearl Bracelets", "Gift Sets"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

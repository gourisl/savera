"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Filter, ChevronDown, X, SlidersHorizontal } from "lucide-react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop";

const SORT_OPTIONS = [
  { label: "Newest First", value: "created_at_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(0);
    setProducts([]);
    fetchProducts(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, maxPrice]);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  }

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 0 : page;

    let query = supabase
      .from("products")
      .select("*, categories(name)", { count: "exact" })
      .lte("price", maxPrice)
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    if (selectedCategory) {
      query = query.eq("category_id", selectedCategory);
    }

    if (sortBy === "price_asc") query = query.order("price", { ascending: true });
    else if (sortBy === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (!error && data) {
      if (reset) {
        setProducts(data);
      } else {
        setProducts((prev) => [...prev, ...data]);
      }
      setHasMore((currentPage + 1) * PAGE_SIZE < (count || 0));
      if (!reset) setPage((p) => p + 1);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, maxPrice, page]);

  const handleLoadMore = () => {
    setPage((p) => {
      const next = p + 1;
      fetchProducts(false);
      return next;
    });
  };

  const getProductImage = (product: any) =>
    product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary-gold)] font-bold mb-2 block">
            Savera Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-3">All Jewellery</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm">
            Explore our complete collection of handcrafted, anti-tarnish pieces designed to bring out your inner radiance.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-between items-center py-4 border-y border-[var(--color-primary-blush)] mb-8 gap-4">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors uppercase tracking-widest text-xs font-bold"
          >
            <SlidersHorizontal size={16} />
            Filter {filterOpen ? "▲" : "▼"}
          </button>

          <div className="text-xs text-[var(--color-text-muted)]">
            {loading ? "Loading..." : `Showing ${products.length} pieces`}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none text-xs uppercase tracking-widest pr-8 pl-2 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] bg-white text-[var(--color-text-main)] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Expandable Filters Panel */}
        {filterOpen && (
          <div className="mb-8 p-6 bg-[var(--color-primary-blush)] rounded-xl">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Category Filter */}
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      !selectedCategory
                        ? "bg-[var(--color-text-main)] text-white border-transparent"
                        : "border-[var(--color-text-light)] text-[var(--color-text-muted)] hover:border-[var(--color-text-main)]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedCategory === cat.id
                          ? "bg-[var(--color-text-main)] text-white border-transparent"
                          : "border-[var(--color-text-light)] text-[var(--color-text-muted)] hover:border-[var(--color-text-main)]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-3">
                  Max Price: ₹{maxPrice.toLocaleString()}
                </h3>
                <input
                  type="range"
                  min={500}
                  max={20000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-[var(--color-primary-gold)] h-1.5 rounded-full"
                />
                <div className="flex justify-between text-xs text-[var(--color-text-light)] mt-1">
                  <span>₹500</span>
                  <span>₹20,000</span>
                </div>
              </div>

              {/* Clear */}
              {(selectedCategory || maxPrice < 10000) && (
                <div className="flex items-end">
                  <button
                    onClick={() => { setSelectedCategory(null); setMaxPrice(10000); }}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    <X size={14} /> Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading && products.length === 0 ? (
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
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">No products found</h3>
            <p className="text-[var(--color-text-muted)] mb-6">Try adjusting your filters.</p>
            <button
              onClick={() => { setSelectedCategory(null); setMaxPrice(10000); }}
              className="px-6 py-3 border border-[var(--color-text-main)] text-sm font-medium hover:bg-[var(--color-text-main)] hover:text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-[var(--color-surface-light)]">
                  {product.discount_percent > 0 && (
                    <span className="absolute top-3 left-3 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm shadow-sm">
                      {product.discount_percent}% OFF
                    </span>
                  )}
                  {product.is_new && (
                    <span className="absolute top-3 right-3 bg-white/90 text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm">
                      New
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm py-3 px-4 text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">
                      Quick View
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                    {product.categories?.name || "Jewellery"}
                  </span>
                  <h3 className="text-base font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <p className="text-[var(--color-text-main)] font-semibold text-sm">₹{Number(product.price).toLocaleString()}</p>
                    {product.original_price && (
                      <p className="text-[var(--color-text-light)] line-through text-xs">₹{Number(product.original_price).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && hasMore && products.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-10 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 font-medium tracking-wide uppercase text-sm"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

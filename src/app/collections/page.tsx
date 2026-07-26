"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function CollectionsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      const { data } = await supabase.from("categories").select("*").order("name");
      setCategories(data || []);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const defaultCollections = [
    { name: "Anti-Tarnish Jewellery", slug: "anti-tarnish", image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop" },
    { name: "Korean Jewellery", slug: "korean", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop" },
    { name: "Hair Accessories", slug: "hair-accessories", image: "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop" },
    { name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop" },
    { name: "Necklaces", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop" },
    { name: "Bracelets", slug: "bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop" },
    { name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop" },
    { name: "Gift Sets", slug: "gift-sets", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop" },
  ];

  const displayCollections = categories.length > 0
    ? categories.map((c, i) => ({
        name: c.name,
        slug: c.slug,
        image: c.image_url || defaultCollections[i % defaultCollections.length].image,
      }))
    : defaultCollections;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Explore
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Our Collections
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
            Browse our curated collections, each designed to match a mood, a moment, or a style.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayCollections.map((collection) => (
              <Link
                href={`/collections/${collection.slug}`}
                key={collection.slug}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-serif mb-1">{collection.name}</h3>
                  <span className="text-xs tracking-widest uppercase font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
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

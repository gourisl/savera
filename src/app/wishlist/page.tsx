"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  // Placeholder wishlist items — in a real app these come from Supabase / local state
  const wishlistItems = [
    {
      id: "1",
      name: "Lumina Pearl Necklace",
      price: "₹3,499",
      image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Aura Gold Hoops",
      price: "₹1,899",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const isEmpty = wishlistItems.length === 0;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">Your Wishlist</h1>
          <p className="text-[var(--color-text-muted)]">
            {isEmpty ? "Your wishlist is empty. Start saving pieces you love!" : `${wishlistItems.length} items saved`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-[var(--color-primary-gold)]" />
            </div>
            <h3 className="text-xl font-serif text-[var(--color-text-main)] mb-3">Nothing saved yet</h3>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
              Browse our collections and tap the heart icon on any piece you love.
            </p>
            <Link href="/shop" className="px-8 py-4 bg-[var(--color-text-main)] text-white font-medium hover:bg-[var(--color-primary-gold)] transition-colors inline-block">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/product/${item.id}`}>
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-[var(--color-surface-light)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">{item.name}</h3>
                  <p className="text-[var(--color-text-muted)] font-medium">{item.price}</p>
                </Link>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-[var(--color-text-main)] text-white py-3 text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                  <button className="w-12 flex items-center justify-center border border-gray-300 text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

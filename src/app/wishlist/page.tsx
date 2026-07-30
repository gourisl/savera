"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, [user]);

  async function loadWishlist() {
    setLoading(true);
    if (user) {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", user.id);

      if (!error && data) {
        const formatted = data.map((w: any) => w.products).filter(Boolean);
        setWishlist(formatted);
      } else {
        loadFromLocal();
      }
    } else {
      loadFromLocal();
    }
    setLoading(false);
  }

  function loadFromLocal() {
    const saved = localStorage.getItem("savera_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        setWishlist([]);
      }
    } else {
      // Default sample items if clean slate
      setWishlist([
        {
          id: "w1",
          name: "Lumina Pearl Necklace",
          price: 3499,
          original_price: 4999,
          images: ["https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=400&auto=format&fit=crop"],
        },
        {
          id: "w2",
          name: "Aura Gold Hoops",
          price: 1899,
          original_price: 2499,
          images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop"],
        },
      ]);
    }
  }

  const handleRemove = async (productId: string) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    setWishlist(updated);
    localStorage.setItem("savera_wishlist", JSON.stringify(updated));

    if (user) {
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId);
    }
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: typeof item.price === "number" ? item.price : parseFloat(item.price),
      image: item.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=400&auto=format&fit=crop",
      quantity: 1,
    });
    handleRemove(item.id);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">Your Wishlist</h1>
          <p className="text-[var(--color-text-muted)]">
            {wishlist.length === 0 ? "Your wishlist is empty. Start saving pieces you love!" : `${wishlist.length} luxury items saved`}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto shadow-sm">
            <div className="w-20 h-20 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart size={36} className="text-[var(--color-primary-gold)]" />
            </div>
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">Nothing saved yet</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-8">
              Explore our handcrafted collections and tap the heart icon on any piece you love.
            </p>
            <Link href="/shop" className="px-8 py-4 bg-[var(--color-text-main)] text-white font-medium hover:bg-[var(--color-primary-gold)] transition-colors inline-block rounded-lg shadow-md">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <Link href={`/product/${item.id}`}>
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-[var(--color-surface-light)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=400&auto=format&fit=crop"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[var(--color-text-main)] font-semibold">₹{item.price}</span>
                      {item.original_price && (
                        <span className="text-xs text-gray-400 line-through">₹{item.original_price}</span>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 bg-[var(--color-text-main)] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    title="Remove from wishlist"
                  >
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

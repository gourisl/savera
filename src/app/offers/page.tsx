"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, Tag, ArrowRight, Copy, Check, Loader2, Percent, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
];

export default function OffersPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoupons() {
      setLoading(true);
      const { data } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setCoupons(data || []);
      setLoading(false);
    }
    fetchCoupons();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-16 bg-gradient-to-br from-[var(--color-primary-blush)] via-white to-[var(--color-primary-peach)] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-8 text-8xl font-serif text-[var(--color-primary-gold)]">%</div>
          <div className="absolute bottom-4 right-8 text-8xl font-serif text-[var(--color-primary-gold)]">%</div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-primary-gold)] font-bold mb-4 block">
            Exclusive Deals
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-text-main)] mb-4">
            Special Offers
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto text-sm">
            Copy a coupon code and paste it at checkout to save on your next Savera order.
          </p>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-12">

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 size={22} className="animate-spin text-[var(--color-primary-gold)]" />
            <span>Loading exclusive offers...</span>
          </div>
        ) : coupons.length === 0 ? (
          /* Static showcase when no DB coupons */
          <div>
            <div className="text-center mb-12 text-[var(--color-text-muted)] text-sm">
              No active coupons right now — check back soon! Meanwhile, explore our collections.
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {[
                { title: "Shop All Jewellery", href: "/shop", cta: "Browse Shop" },
                { title: "New Arrivals", href: "/new-arrivals", cta: "See What's New" },
                { title: "Best Sellers", href: "/collections/best-sellers", cta: "Most Loved" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 bg-[var(--color-primary-blush)] rounded-2xl p-8 text-center group hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-serif text-[var(--color-text-main)] mb-3">{item.title}</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-[var(--color-primary-gold)] font-medium group-hover:gap-2 transition-all">
                    {item.cta} <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-widest text-center text-[var(--color-text-light)] mb-8">
              {coupons.length} active offer{coupons.length > 1 ? "s" : ""} available
            </p>

            {coupons.map((coupon, index) => {
              const expired = isExpired(coupon.expires_at);
              return (
                <div
                  key={coupon.id}
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100`}
                >
                  {/* Image */}
                  <div className="flex-[2] aspect-[16/7] md:aspect-auto min-h-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={HERO_IMAGES[index % HERO_IMAGES.length]}
                      alt={coupon.code}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-[3] p-8 md:p-12 flex flex-col justify-center">
                    {/* Discount badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blush)] flex items-center justify-center">
                        {coupon.discount_type === "percentage"
                          ? <Percent size={18} className="text-[var(--color-primary-gold)]" />
                          : <IndianRupee size={18} className="text-[var(--color-primary-gold)]" />
                        }
                      </div>
                      <span className="text-2xl md:text-3xl font-serif text-[var(--color-primary-gold)]">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% Off`
                          : `₹${coupon.discount_value} Off`}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif text-[var(--color-text-main)] mb-2">
                      {coupon.description || `Use code ${coupon.code} for ${coupon.discount_type === "percentage" ? coupon.discount_value + "% off" : "₹" + coupon.discount_value + " off"}`}
                    </h3>

                    {coupon.min_order_amount > 0 && (
                      <p className="text-xs text-[var(--color-text-muted)] mb-4">
                        Minimum order: ₹{coupon.min_order_amount.toLocaleString()}
                      </p>
                    )}

                    {/* Coupon code copy button */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        disabled={expired}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed font-bold text-sm tracking-widest transition-all ${
                          expired
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-[var(--color-primary-gold)] text-[var(--color-text-main)] hover:bg-[var(--color-primary-blush)]"
                        }`}
                      >
                        <Tag size={14} />
                        {coupon.code}
                        {copiedCode === coupon.code
                          ? <Check size={14} className="text-emerald-600" />
                          : <Copy size={14} className="text-gray-400" />
                        }
                      </button>

                      {coupon.expires_at && (
                        <div className={`flex items-center gap-1.5 text-xs ${expired ? "text-red-400" : "text-[var(--color-text-light)]"}`}>
                          <Clock size={12} />
                          <span>{expired ? "Expired" : "Valid till"} {new Date(coupon.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      )}
                      {!coupon.expires_at && (
                        <span className="text-xs text-[var(--color-text-light)] flex items-center gap-1">
                          <Clock size={12} /> No expiry
                        </span>
                      )}
                    </div>

                    {copiedCode === coupon.code && (
                      <p className="text-xs text-emerald-600 font-medium mb-4">✓ Code copied! Paste it at checkout.</p>
                    )}

                    {!expired && (
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-text-main)] text-white text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors w-fit group rounded-lg"
                      >
                        Shop Now
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Newsletter strip */}
        <div className="mt-16 bg-gradient-to-r from-[var(--color-primary-blush)] to-[var(--color-primary-peach)] rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-text-main)] mb-3">
            Never Miss an Offer
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6 text-sm">
            Subscribe to our newsletter and get exclusive discount codes straight to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] text-sm"
            />
            <button className="px-6 py-3 bg-[var(--color-text-main)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

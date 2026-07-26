"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, Tag, ArrowRight } from "lucide-react";

export default function OffersPage() {
  const offers = [
    {
      title: "Monsoon Sale",
      code: "MONSOON40",
      discount: "Up to 40% Off",
      description: "Celebrate the rains with sparkling deals on our curated monsoon collection.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      expires: "Aug 15, 2026",
    },
    {
      title: "First Order Discount",
      code: "SAVERA10",
      discount: "10% Off",
      description: "New to Savera? Get 10% off your very first order with us.",
      image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=800&auto=format&fit=crop",
      expires: "No Expiry",
    },
    {
      title: "Buy 2 Get 1 Free",
      code: "B2G1",
      discount: "Free Jewellery",
      description: "Mix and match from select collections. The lowest-priced item is on us!",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      expires: "Limited Stock",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Exclusive Deals
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Special Offers
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
            Don&apos;t miss out — grab these limited-time offers before they&apos;re gone.
          </p>
        </div>

        <div className="space-y-10">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 bg-[var(--color-primary-blush)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex-1 aspect-[16/9] md:aspect-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-[var(--color-primary-gold)] text-3xl md:text-4xl font-serif mb-3 block">
                  {offer.discount}
                </span>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">
                  {offer.title}
                </h3>
                <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed">
                  {offer.description}
                </p>
                <div className="flex flex-wrap gap-4 items-center mb-6">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
                    <Tag size={16} className="text-[var(--color-primary-gold)]" />
                    <span className="font-bold text-sm tracking-widest">{offer.code}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                    <Clock size={14} />
                    <span>{offer.expires}</span>
                  </div>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-text-main)] text-white font-medium hover:bg-[var(--color-primary-gold)] transition-colors w-fit group"
                >
                  Shop Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

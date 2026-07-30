"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={15} height={15}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    setSubError("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.toLowerCase().trim() });

      if (error) {
        if (error.code === "23505") {
          setSubError("You're already subscribed!");
        } else {
          setSubError("Something went wrong. Please try again.");
        }
      } else {
        setSubscribed(true);
        setEmail("");
      }
    } catch {
      setSubError("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[var(--color-surface-light)] pt-20 pb-10 border-t border-[var(--color-primary-blush)]">
      <div className="container mx-auto px-4 md:px-6">

        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 pb-16 border-b border-[var(--color-primary-blush)] gap-8">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">Join the Savera Club</h3>
            <p className="text-[var(--color-text-muted)] text-sm">
              Subscribe to receive exclusive offers, new arrival alerts, and styling tips.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-3 text-emerald-600 font-medium">
              <CheckCircle size={20} />
              <span className="text-sm">You&apos;re subscribed! Welcome to the club ✨</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full md:w-auto max-w-md space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSubError(""); }}
                    placeholder="Your email address"
                    className="w-full pl-9 pr-3 py-3 bg-transparent border border-[var(--color-text-light)] focus:border-[var(--color-text-main)] outline-none text-[var(--color-text-main)] transition-colors text-sm rounded-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-5 py-3 bg-[var(--color-text-main)] text-white font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-60 text-sm rounded-sm"
                >
                  {subscribing ? <Send size={14} className="animate-pulse" /> : "Subscribe"}
                </button>
              </div>
              {subError && <p className="text-xs text-red-500">{subError}</p>}
            </form>
          )}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">

          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-serif tracking-widest text-[var(--color-text-main)] block mb-5">
              SAVERA
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
              Crafting timeless luxury. Our anti-tarnish, premium jewellery is designed for the modern woman who appreciates subtle elegance.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[var(--color-primary-blush)] flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-primary-gold)] hover:text-white transition-all">
                <IconInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[var(--color-primary-blush)] flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-primary-gold)] hover:text-white transition-all">
                <IconFacebook />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-main)] mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li><Link href="/shop" className="hover:text-[var(--color-primary-gold)] transition-colors">All Jewellery</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-[var(--color-primary-gold)] transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/anti-tarnish-jewellery" className="hover:text-[var(--color-primary-gold)] transition-colors">Anti-Tarnish Collection</Link></li>
              <li><Link href="/collections/korean-jewellery" className="hover:text-[var(--color-primary-gold)] transition-colors">Korean Jewellery</Link></li>
              <li><Link href="/collections/gift-sets" className="hover:text-[var(--color-primary-gold)] transition-colors">Luxury Gift Sets</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-main)] mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li><Link href="/contact" className="hover:text-[var(--color-primary-gold)] transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-[var(--color-primary-gold)] transition-colors">Track Order</Link></li>
              <li><Link href="/offers" className="hover:text-[var(--color-primary-gold)] transition-colors">Offers & Discounts</Link></li>
              <li><Link href="/account/orders" className="hover:text-[var(--color-primary-gold)] transition-colors">My Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-[var(--color-primary-gold)] transition-colors">My Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-main)] mb-6">Get in Touch</h4>
            <ul className="space-y-5 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <MapPin size={16} className="shrink-0 mt-0.5 text-[var(--color-primary-gold)]" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={16} className="shrink-0 text-[var(--color-primary-gold)]" />
                <a href="tel:+919876543210" className="hover:text-[var(--color-primary-gold)] transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail size={16} className="shrink-0 text-[var(--color-primary-gold)]" />
                <a href="mailto:hello@savera.com" className="hover:text-[var(--color-primary-gold)] transition-colors">hello@savera.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-primary-blush)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-light)]">
          <p>&copy; {new Date().getFullYear()} Savera Jewellery. All Rights Reserved. Crafted with love in India 🇮🇳</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-[var(--color-text-main)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--color-text-main)] transition-colors">Terms of Service</Link>
            <Link href="/shipping-policy" className="hover:text-[var(--color-text-main)] transition-colors">Shipping Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

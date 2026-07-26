"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { User, ShoppingBag, Heart, MapPin, Clock, Download, Eye } from "lucide-react";

export default function AccountPage() {
  // This is a placeholder UI. Auth will be wired with Supabase Auth later.
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 md:px-6 py-16 max-w-md">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={32} className="text-[var(--color-primary-gold)]" />
            </div>
            <h1 className="text-3xl font-serif text-[var(--color-text-main)] mb-3">Welcome Back</h1>
            <p className="text-[var(--color-text-muted)] text-sm">Sign in to access your orders, wishlist, and account settings.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-[var(--color-text-main)] text-white py-4 rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/account/register" className="text-[var(--color-primary-gold)] font-medium hover:underline">
              Create one
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Logged-in dashboard (placeholder)
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 pt-24">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-serif text-[var(--color-text-main)] mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <ShoppingBag size={24} />, title: "My Orders", desc: "View and track your orders", href: "/account/orders" },
            { icon: <Heart size={24} />, title: "Wishlist", desc: "Your saved items", href: "/wishlist" },
            { icon: <MapPin size={24} />, title: "Addresses", desc: "Manage shipping addresses", href: "/account/addresses" },
            { icon: <Clock size={24} />, title: "Recently Viewed", desc: "Items you browsed recently", href: "/account/recently-viewed" },
            { icon: <Download size={24} />, title: "Invoices", desc: "Download order invoices", href: "/account/invoices" },
            { icon: <User size={24} />, title: "Profile Settings", desc: "Update your information", href: "/account/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[var(--color-primary-gold)] transition-all group">
              <div className="w-12 h-12 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center text-[var(--color-primary-gold)] mb-4 group-hover:bg-[var(--color-primary-gold)] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-base font-medium text-[var(--color-text-main)] mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

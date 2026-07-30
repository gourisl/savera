"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { User, ShoppingBag, Heart, MapPin, Clock, Download, LogOut, KeyRound, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const { user, profile, loading, signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
      } else {
        const { data: sessData } = await supabase.auth.getSession();
        if (sessData.session?.user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", sessData.session.user.id)
            .single();

          if (prof?.role === "admin" || sessData.session.user.email === "saverabygourii@gmail.com") {
            router.push("/admin");
            return;
          }
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24 justify-center items-center">
        <Navbar />
        <div className="flex items-center gap-3 text-gray-500 py-20">
          <Loader2 className="animate-spin text-[var(--color-primary-gold)]" size={24} />
          <span>Loading session...</span>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary-gold)] shadow-sm">
              <User size={30} />
            </div>
            <h1 className="text-3xl font-serif text-[var(--color-text-main)] mb-2">Welcome Back</h1>
            <p className="text-[var(--color-text-muted)] text-sm">Sign in to manage your orders, saved addresses, and wishlist.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                placeholder="priya@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/account/forgot-password" className="text-xs text-[var(--color-primary-gold)] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--color-text-main)] text-white py-4 rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white px-4 text-xs text-gray-400 uppercase tracking-widest">Or Continue With</span>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google Login
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

  // Logged-in customer dashboard
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 pt-24">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-full flex items-center justify-center font-bold text-2xl shadow-sm">
              {profile?.full_name ? profile.full_name[0] : user.email ? user.email[0] : "C"}
            </div>
            <div>
              <h1 className="text-2xl font-serif text-gray-900 font-medium flex items-center gap-2">
                Hello, {profile?.full_name || "Valued Customer"}
                {profile?.role === "admin" && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-sans font-bold">Admin</span>
                )}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {profile?.role === "admin" && (
              <Link href="/admin" className="px-4 py-2 bg-[var(--color-primary-gold)] text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
                Go to Admin Panel
              </Link>
            )}
            <button
              onClick={signOut}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <ShoppingBag size={24} />, title: "My Orders", desc: "View purchase history & live tracking", href: "/account/orders" },
            { icon: <Heart size={24} />, title: "Wishlist", desc: "Your saved jewellery pieces", href: "/wishlist" },
            { icon: <MapPin size={24} />, title: "Address Book", desc: "Manage delivery addresses", href: "/account/addresses" },
            { icon: <User size={24} />, title: "Profile Details", desc: "Update name, phone & info", href: "/account/settings" },
            { icon: <KeyRound size={24} />, title: "Security", desc: "Change your account password", href: "/account/settings#security" },
            { icon: <Sparkles size={24} />, title: "Savera Club", desc: "Exclusive membership rewards", href: "/offers" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[var(--color-primary-gold)] transition-all group">
              <div className="w-12 h-12 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center text-[var(--color-primary-gold)] mb-4 group-hover:bg-[var(--color-primary-gold)] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-base font-serif font-medium text-[var(--color-text-main)] mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

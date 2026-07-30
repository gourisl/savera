"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowLeft, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const { signInWithEmail, user, profile, isAdmin, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await signInWithEmail(email, password);

    if (error) {
      setErrorMsg(error.message || "Invalid credentials. Please verify your email and password.");
      setLoading(false);
      return;
    }

    // Auth succeeded — fetch user session
    const { data: currentSession } = await supabase.auth.getSession();
    if (currentSession?.session?.user) {
      const authUser = currentSession.session.user;
      const userId = authUser.id;
      const userEmail = authUser.email;

      // Try background upsert of admin role into profiles
      supabase.from("profiles").upsert({
        id: userId,
        full_name: authUser.user_metadata?.full_name || "Gouri",
        role: "admin",
        active: true,
      }).then();

      await refreshProfile();

      // Check if user is admin or master email
      if (userEmail === "saverabygourii@gmail.com" || profile?.role === "admin") {
        router.push("/admin");
      } else {
        setErrorMsg("Access Denied: This account does not have administrator privileges.");
      }
    }
    setLoading(false);
  };

  // If already authenticated as admin
  if (user && isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-white)] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-serif text-gray-900 font-bold">Signed In as Admin</h2>
          <p className="text-sm text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{profile?.full_name || user.email}</span>.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin"
              className="w-full bg-[var(--color-text-main)] text-white py-3 rounded-xl font-medium hover:bg-[var(--color-primary-gold)] transition-colors inline-block"
            >
              Go to Admin Dashboard
            </Link>
            <button
              onClick={signOut}
              className="text-xs text-red-500 hover:underline pt-2"
            >
              Sign out from Admin Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-blush)] via-white to-[var(--color-primary-ivory)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-4xl font-serif tracking-widest text-[var(--color-text-main)] inline-block mb-3">
          SAVERA
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
            Admin Suite
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-serif font-semibold text-gray-900">
          Store Management Portal
        </h2>
        <p className="text-xs text-gray-500 mt-1">Sign in with authorized administrator credentials</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="saverabygourii@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-text-main)] text-white py-3.5 rounded-xl font-medium text-sm hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In to Admin Portal"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--color-primary-gold)] transition-colors">
              <ArrowLeft size={14} /> Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

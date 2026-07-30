"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Tag, Percent, Star, ArrowLeft, ShieldAlert, Mail, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
    { name: "Categories", href: "/admin/categories", icon: <Tag size={20} /> },
    { name: "Coupons & Offers", href: "/admin/offers", icon: <Percent size={20} /> },
    { name: "Reviews", href: "/admin/reviews", icon: <Star size={20} /> },
    { name: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
    { name: "Newsletter", href: "/admin/newsletter", icon: <Mail size={20} /> },
    { name: "FAQs", href: "/admin/faqs", icon: <HelpCircle size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  // If on admin login page, bypass layout check & render directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading admin control suite...
      </div>
    );
  }

  // Admin access guard: If logged in but not admin, show clear message
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-serif text-gray-900 font-semibold">Admin Verification Required</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You must be signed in with an administrator account to access the Savera store control dashboard.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin/login"
              className="w-full bg-[var(--color-text-main)] text-white py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors inline-block"
            >
              Sign In to Admin Portal
            </Link>
            <Link href="/" className="text-xs text-gray-500 hover:underline">
              Return to Store Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/admin" className="text-2xl font-serif tracking-widest text-[var(--color-text-main)]">
            SAVERA
          </Link>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
            Admin
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary-blush)] text-[var(--color-text-main)] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? "text-[var(--color-primary-gold)]" : ""}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} /> Store Front
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-serif font-semibold text-gray-800">Savera Store Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900">{profile?.full_name || "Administrator"}</p>
              <p className="text-[10px] text-gray-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary-gold)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {profile?.full_name ? profile.full_name[0] : "A"}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}

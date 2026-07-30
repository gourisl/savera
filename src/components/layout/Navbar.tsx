"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();
  const { user, profile, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search-drawer"));
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Offers", href: "/offers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[var(--color-text-main)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-serif tracking-widest text-[var(--color-text-main)]">
          SAVERA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium tracking-wide hover:text-[var(--color-primary-gold)] transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs uppercase font-bold tracking-widest bg-[var(--color-primary-peach)] text-[var(--color-text-main)] px-3 py-1.5 rounded-full hover:bg-[var(--color-primary-gold)] hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 md:space-x-5">
          <button
            onClick={handleOpenSearch}
            className="text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors"
            title="Search"
            aria-label="Open search"
          >
            <Search size={20} />
          </button>

          <Link
            href="/account"
            className="hidden md:block text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors"
            title="Account"
            aria-label="Account"
          >
            {user ? (
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary-gold)] text-white flex items-center justify-center text-xs font-bold uppercase">
                {profile?.full_name ? profile.full_name[0] : user.email ? user.email[0] : "U"}
              </div>
            ) : (
              <User size={20} />
            )}
          </Link>

          <Link
            href="/wishlist"
            className="hidden md:block text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>

          <button
            className="text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors relative"
            onClick={() => setIsCartOpen(true)}
            title="Cart"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-primary-gold)] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-[var(--color-primary-blush)] pb-6 pt-2 z-50">
          <nav className="flex flex-col space-y-0 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium py-3.5 border-b border-[var(--color-primary-blush)] text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-base font-medium py-3.5 border-b border-[var(--color-primary-blush)] text-[var(--color-primary-gold)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <div className="flex space-x-6 pt-5 text-[var(--color-text-main)]">
              <Link href="/account" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> Account
              </Link>
              <Link href="/wishlist" className="flex items-center gap-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={18} /> Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Offers", href: "/offers" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-[var(--color-text-main)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors">
            <Search size={20} />
          </button>
          <Link href="/account" className="hidden md:block text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors">
            <User size={20} />
          </Link>
          <Link href="/wishlist" className="hidden md:block text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors">
            <Heart size={20} />
          </Link>
          <button 
            className="text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-[var(--color-primary-blush)] animate-fade-in pb-6 pt-2">
          <nav className="flex flex-col space-y-4 px-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-base font-medium py-2 border-b border-[var(--color-primary-blush)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-6 pt-4 text-[var(--color-text-main)]">
              <Link href="/account" className="flex items-center gap-2">
                <User size={20} /> Account
              </Link>
              <Link href="/wishlist" className="flex items-center gap-2">
                <Heart size={20} /> Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

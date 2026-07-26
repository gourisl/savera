"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in-right">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-primary-blush)] flex items-center justify-between bg-[var(--color-surface-light)]">
          <h2 className="text-xl font-serif text-[var(--color-text-main)] flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center text-[var(--color-primary-gold)]">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-lg font-serif text-[var(--color-text-main)]">Your bag is empty</h3>
              <p className="text-[var(--color-text-muted)] text-sm max-w-[250px]">
                Discover our timeless collections and find your perfect piece.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-3 bg-[var(--color-text-main)] text-white text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-[var(--color-surface-light)] rounded-sm overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium text-[var(--color-text-main)] line-clamp-2">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[var(--color-text-light)] hover:text-red-500 transition-colors ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-[var(--color-primary-gold)] text-sm font-medium">₹{item.price}</p>
                    </div>
                    
                    <div className="flex items-center border border-[var(--color-primary-blush)] rounded-sm w-fit mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[var(--color-text-muted)] hover:bg-[var(--color-primary-blush)] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1 text-xs font-medium text-[var(--color-text-main)]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[var(--color-text-muted)] hover:bg-[var(--color-primary-blush)] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-primary-blush)] p-6 bg-[var(--color-surface-light)]">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-[var(--color-text-muted)]">Subtotal</span>
              <span className="font-medium text-[var(--color-text-main)]">₹{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mb-6 text-center">
              Shipping & taxes calculated at checkout
            </p>
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-4 bg-[var(--color-text-main)] text-white text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Lock, CreditCard, Banknote, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const shippingFee = 50;
  const total = cartTotal + (items.length > 0 ? shippingFee : 0);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    houseName: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    orderNotes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setSubmitting(true);

    try {
      // Create shipping address JSON
      const shippingAddress = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.houseName}, ${formData.street}, ${formData.area}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pinCode}`
      };

      // 1. Insert order into Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_amount: total,
          status: "pending",
          shipping_address: shippingAddress,
          payment_method: "Razorpay / Online"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      if (order) {
        const orderItemsPayload = items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }));

        await supabase.from("order_items").insert(orderItemsPayload);

        // 3. Clear cart and redirect
        clearCart();
        alert(`Order #${order.id.slice(0, 8)} placed successfully!`);
        router.push(`/track-order?id=${order.id}`);
      }
    } catch (err: any) {
      console.error("Order error:", err);
      alert("Failed to submit order: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-[var(--color-primary-blush)] py-6 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif tracking-widest text-[var(--color-text-main)]">
            SAVERA
          </Link>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <Lock size={16} className="text-emerald-600" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Forms */}
          <div className="flex-[3]">
            <form onSubmit={handleCheckout} className="space-y-10">
              
              {/* Contact Info */}
              <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6 flex items-center justify-between">
                  Contact Information
                  <span className="text-sm font-sans text-gray-500">Already have an account? <Link href="/account" className="text-[var(--color-primary-gold)] hover:underline">Log in</Link></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" placeholder="priya@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">House/Flat Name or Number *</label>
                    <input type="text" name="houseName" required value={formData.houseName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                    <input type="text" name="street" required value={formData.street} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality *</label>
                    <input type="text" name="area" required value={formData.area} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input type="text" name="pinCode" required value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-[var(--color-primary-gold)] bg-orange-50/30 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="razorpay" defaultChecked className="w-4 h-4 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)]" />
                      <div>
                        <span className="font-medium text-gray-900 block">Pay Online (Razorpay)</span>
                        <span className="text-xs text-gray-500">UPI, Cards, NetBanking, Wallets</span>
                      </div>
                    </div>
                    <CreditCard size={24} className="text-[var(--color-primary-gold)]" />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="cod" disabled className="w-4 h-4 text-gray-300" />
                      <div>
                        <span className="font-medium text-gray-400 block">Cash on Delivery</span>
                        <span className="text-xs text-gray-400">Currently unavailable for your PIN</span>
                      </div>
                    </div>
                    <Banknote size={24} className="text-gray-300" />
                  </label>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[var(--color-text-main)] text-white py-5 rounded-lg font-medium text-lg tracking-wide hover:bg-[var(--color-primary-gold)] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing Order...
                  </>
                ) : (
                  `Place Order (₹${total.toLocaleString()})`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex-[2]">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Your cart is empty.</p>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</span>
                        <span className="text-sm text-gray-500">₹{item.price}</span>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                        <span className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {items.length > 0 ? `₹${shippingFee.toLocaleString()}` : '₹0'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-gray-100 mb-8">
                <span className="text-base font-medium text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block mb-1">Including ₹{(total * 0.18).toFixed(2)} in taxes</span>
                  <span className="text-3xl font-serif font-medium text-[var(--color-primary-gold)]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--color-primary-blush)] p-4 rounded-lg flex items-start gap-3">
                <HelpCircle size={20} className="text-[var(--color-text-main)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  By placing your order, you agree to Savera's Terms of Service and Privacy Policy. Your payment information is processed securely.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}

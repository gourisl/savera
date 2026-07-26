"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Package, Search, Truck, CheckCircle, Clock } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-2xl">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Order Tracking
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Track Your Order
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Enter your Order ID to see the current status and delivery updates.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setSearched(false); }}
              placeholder="Enter Order ID (e.g. ORD-ABC123)"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]"
              required
            />
          </div>
          <button type="submit" className="px-6 py-4 bg-[var(--color-text-main)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors shrink-0">
            Track
          </button>
        </form>

        {searched && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-serif text-[var(--color-text-main)]">Order #{orderId || "ORD-001"}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Placed on July 20, 2026</p>
              </div>
              <span className="px-4 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Shipped
              </span>
            </div>

            {/* Timeline */}
            <div className="space-y-8">
              {[
                { icon: <CheckCircle size={20} />, label: "Order Confirmed", date: "Jul 20, 10:30 AM", done: true },
                { icon: <Package size={20} />, label: "Packed & Ready", date: "Jul 21, 2:15 PM", done: true },
                { icon: <Truck size={20} />, label: "Shipped via Delhivery", date: "Jul 22, 9:00 AM", done: true },
                { icon: <Clock size={20} />, label: "Out for Delivery", date: "Expected Jul 26", done: false },
              ].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.done ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      {step.icon}
                    </div>
                    {index < 3 && (
                      <div className={`w-0.5 h-8 mt-2 ${step.done ? "bg-emerald-200" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="pt-2">
                    <p className={`font-medium text-sm ${step.done ? "text-[var(--color-text-main)]" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-light)]">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

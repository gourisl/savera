"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AddressesPage() {
  const [addresses] = useState([
    {
      id: "1",
      name: "Priya Sharma",
      line1: "Flat 402, Royal Palms Apartments",
      line2: "MG Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      phone: "+91 98765 43210",
      isDefault: true,
    },
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[var(--color-text-main)]">Saved Addresses</h1>
            <p className="text-[var(--color-text-muted)] text-sm">Manage your shipping and billing locations</p>
          </div>
          <button className="bg-[var(--color-text-main)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2">
            <Plus size={16} /> Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative flex flex-col justify-between">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-[var(--color-primary-blush)] text-[var(--color-text-main)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Default
                </span>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-[var(--color-primary-gold)]" />
                  {addr.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {addr.line1}<br />
                  {addr.line2}<br />
                  {addr.city}, {addr.state} - {addr.pincode}<br />
                  Phone: {addr.phone}
                </p>
              </div>
              <div className="flex gap-4 border-t border-gray-100 pt-4 text-xs font-medium">
                <button className="text-gray-600 hover:text-black">Edit</button>
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

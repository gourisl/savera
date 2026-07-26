"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Lock, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
  });

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-2xl">
        <h1 className="text-3xl font-serif text-[var(--color-text-main)] mb-2">Account Settings</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">Update your personal details and security preferences</p>

        <form onSubmit={(e) => { e.preventDefault(); alert("Profile updated successfully!"); }} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[var(--color-text-main)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}

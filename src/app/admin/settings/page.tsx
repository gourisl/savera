"use client";

import { Save, Store, Truck, Image as ImageIcon, Share2, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [storeSettings, setStoreSettings] = useState({
    storeName: "SAVERA Luxury Jewellery",
    tagline: "Fine & Anti-Tarnish Luxury Jewellery",
    logoUrl: "",
    contactEmail: "support@savera.com",
    contactPhone: "+91 98765 43210",
    address: "Savera Boutique, Indiranagar, Bengaluru, Karnataka 560038",
    shippingFee: "50",
    freeShippingThreshold: "2999",
    heroTitle: "Timeless Elegance, Modern Radiance",
    heroSubtitle: "Handcrafted anti-tarnish everyday luxury & fine Korean jewellery.",
    heroBannerUrl: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=1600&auto=format&fit=crop",
    instagramUrl: "https://instagram.com/savera_jewellery",
    facebookUrl: "https://facebook.com/saverajewellery",
    whatsappNumber: "+919876543210",
    returnPolicyText: "7-Day Hassel-Free Return Policy on all unworn items in original packaging.",
    termsText: "All prices are inclusive of taxes. Shipping charges applicable based on order threshold.",
  });

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const { data } = await supabase.from("settings").select("*");
        if (data && data.length > 0) {
          const loaded: any = { ...storeSettings };
          data.forEach((item) => {
            loaded[item.key] = item.value;
          });
          setStoreSettings(loaded);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      // Upsert key/value pairs in Supabase settings table
      for (const [key, value] of Object.entries(storeSettings)) {
        await supabase.from("settings").upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      }
      setSuccessMsg("Store configuration saved successfully!");
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin text-[var(--color-primary-gold)]" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Store Settings & Branding</h1>
        <p className="text-sm text-gray-500">Customize store details, hero banner, shipping fee, and social links</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* General Store Info */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Store size={20} className="text-[var(--color-primary-gold)]" /> General Store Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Website Name</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Tagline</label>
              <input
                type="text"
                value={storeSettings.tagline}
                onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Support Email</label>
              <input
                type="email"
                value={storeSettings.contactEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Support Phone</label>
              <input
                type="tel"
                value={storeSettings.contactPhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Boutique Physical Address</label>
              <input
                type="text"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>
          </div>
        </div>

        {/* Homepage & Hero Customization */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <ImageIcon size={20} className="text-[var(--color-primary-gold)]" /> Homepage Hero Banner
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Hero Heading</label>
              <input
                type="text"
                value={storeSettings.heroTitle}
                onChange={(e) => setStoreSettings({ ...storeSettings, heroTitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={storeSettings.heroSubtitle}
                onChange={(e) => setStoreSettings({ ...storeSettings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={storeSettings.heroBannerUrl}
                onChange={(e) => setStoreSettings({ ...storeSettings, heroBannerUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Shipping Defaults */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck size={20} className="text-[var(--color-primary-gold)]" /> Shipping Charges & Thresholds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Default Shipping Fee (₹)</label>
              <input
                type="number"
                value={storeSettings.shippingFee}
                onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                value={storeSettings.freeShippingThreshold}
                onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>
          </div>
        </div>

        {/* Social & Policies */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-serif font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Share2 size={20} className="text-[var(--color-primary-gold)]" /> Social Links & Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Instagram URL</label>
              <input
                type="text"
                value={storeSettings.instagramUrl}
                onChange={(e) => setStoreSettings({ ...storeSettings, instagramUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Facebook URL</label>
              <input
                type="text"
                value={storeSettings.facebookUrl}
                onChange={(e) => setStoreSettings({ ...storeSettings, facebookUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={storeSettings.whatsappNumber}
                onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Return Policy Summary</label>
            <textarea
              rows={2}
              value={storeSettings.returnPolicyText}
              onChange={(e) => setStoreSettings({ ...storeSettings, returnPolicyText: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--color-text-main)] text-white px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}

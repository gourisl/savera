"use client";

import { Save, Store, Shield, CreditCard, Bell } from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Savera Luxury Jewellery",
    currency: "INR (₹)",
    contactEmail: "support@savera.com",
    contactPhone: "+91 98765 43210",
    freeShippingThreshold: "2999",
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500">Configure store defaults, currencies, and notifications</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); alert("Store settings saved!"); }} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Store size={20} className="text-[var(--color-primary-gold)]" /> General Store Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Currency</label>
              <input
                type="text"
                value={storeSettings.currency}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={storeSettings.contactEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
              <input
                type="tel"
                value={storeSettings.contactPhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard size={20} className="text-[var(--color-primary-gold)]" /> Shipping & Payment Defaults
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Order Amount Threshold (₹)</label>
            <input
              type="number"
              value={storeSettings.freeShippingThreshold}
              onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[var(--color-text-main)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2"
          >
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

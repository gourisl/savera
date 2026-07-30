"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Plus, Trash2, Edit, Loader2, ArrowLeft, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    phoneNumber: "",
    houseName: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchAddresses() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAddresses(data);
      }
    } catch (err) {
      console.error("Address fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setFormData({
      id: "",
      fullName: "",
      phoneNumber: "",
      houseName: "",
      street: "",
      area: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: any) => {
    setFormData({
      id: addr.id,
      fullName: addr.full_name,
      phoneNumber: addr.phone_number,
      houseName: addr.house_name,
      street: addr.street,
      area: addr.area,
      landmark: addr.landmark || "",
      city: addr.city,
      district: addr.district || addr.city,
      state: addr.state,
      pinCode: addr.pin_code,
      isDefault: addr.is_default || false,
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const payload = {
        user_id: user.id,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        house_name: formData.houseName,
        street: formData.street,
        area: formData.area,
        landmark: formData.landmark,
        city: formData.city,
        district: formData.district || formData.city,
        state: formData.state,
        pin_code: formData.pinCode,
        is_default: formData.isDefault,
      };

      if (formData.id) {
        const { error } = await supabase
          .from("addresses")
          .update(payload)
          .eq("id", formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("addresses").insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAddresses();
    } catch (err: any) {
      alert("Error saving address: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
      fetchAddresses();
    } catch (err: any) {
      alert("Error deleting address: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary-gold)] transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[var(--color-text-main)]">Saved Addresses</h1>
            <p className="text-[var(--color-text-muted)] text-sm">Manage your shipping and billing locations</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[var(--color-text-main)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-gray-500">
            <Loader2 className="animate-spin text-[var(--color-primary-gold)]" size={24} />
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-serif text-gray-900 mb-2">No Saved Addresses</h3>
            <p className="text-sm text-gray-500 mb-6">Save an address now for a fast and effortless checkout experience.</p>
            <button
              onClick={handleOpenAddModal}
              className="bg-[var(--color-text-main)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all">
                {addr.is_default && (
                  <span className="absolute top-4 right-4 bg-[var(--color-primary-blush)] text-[var(--color-text-main)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Default Address
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="font-serif font-medium text-lg text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--color-primary-gold)]" />
                    {addr.full_name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {addr.house_name}, {addr.street}<br />
                    {addr.area}{addr.landmark ? `, ${addr.landmark}` : ''}<br />
                    {addr.city}, {addr.state} - {addr.pin_code}<br />
                    <span className="text-xs text-gray-400 mt-2 block">Phone: {addr.phone_number}</span>
                  </p>
                </div>
                <div className="flex gap-4 border-t border-gray-100 pt-4 text-xs font-medium">
                  <button
                    onClick={() => handleOpenEditModal(addr)}
                    className="text-gray-700 hover:text-[var(--color-primary-gold)] flex items-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-serif text-[var(--color-text-main)] mb-6">
              {formData.id ? "Edit Address" : "Add New Address"}
            </h2>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">House / Flat Name / No. *</label>
                  <input
                    type="text"
                    required
                    value={formData.houseName}
                    onChange={(e) => setFormData({ ...formData, houseName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Street *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)] rounded"
                />
                <label htmlFor="defaultAddress" className="text-xs text-gray-700">Set as default shipping address</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm text-gray-600 font-medium hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--color-text-main)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />} Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

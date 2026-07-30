"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Percent, Loader2, Calendar, CheckCircle2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminOffers() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "10",
    min_order_amount: "999",
    max_discount: "500",
    is_active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: parseFloat(formData.min_order_amount || "0"),
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        is_active: formData.is_active,
      };

      const { error } = await supabase.from("coupons").insert(payload);
      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: "10",
        min_order_amount: "999",
        max_discount: "500",
        is_active: true,
      });
      fetchCoupons();
    } catch (err: any) {
      alert("Error creating coupon: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) {
      alert("Error deleting coupon: " + error.message);
    } else {
      fetchCoupons();
    }
  };

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("coupons").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Offers & Coupons</h1>
          <p className="text-sm text-gray-500">Create promotional discount codes and flash sale offers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-text-main)] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-gold)] transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
          Active Store Coupons ({coupons.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min. Order Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading coupons...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No active coupons found. Click &quot;Create Coupon&quot; to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-lg flex items-center justify-center font-bold">
                          <Percent size={18} />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-gray-900 uppercase tracking-wide">{coupon.code}</div>
                          <div className="text-xs text-gray-400">Created {new Date(coupon.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {coupon.discount_type === "percentage" ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ₹{coupon.min_order_amount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                          coupon.is_active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {coupon.is_active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-serif text-[var(--color-text-main)] mb-6">Create Discount Coupon</h2>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] font-mono uppercase font-bold"
                  placeholder="SAVERA10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Discount Type *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] font-bold"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="999"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium">Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--color-text-main)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />} Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

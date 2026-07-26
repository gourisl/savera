"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
    setLoading(false);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug });

    if (error) {
      alert("Error adding category: " + error.message);
    } else {
      setName("");
      fetchCategories();
    }
    setAdding(false);
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert("Error deleting category: " + error.message);
    } else {
      fetchCategories();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500">Manage jewellery categories across your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                placeholder="e.g. Earrings"
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="w-full bg-[var(--color-text-main)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 size= {16} className="animate-spin" /> : <Plus size={16} />}
              Save Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
            All Categories ({categories.length})
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading categories...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-lg flex items-center justify-center">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cat.name}</h3>
                      <p className="text-xs text-gray-500">/{cat.slug}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

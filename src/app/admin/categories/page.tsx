"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Loader2, Edit2, X, Check, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    setCategories(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditTarget(null);
    setName("");
    setImageUrl("");
    setDescription("");
    setShowForm(true);
  }

  function openEdit(cat: any) {
    setEditTarget(cat);
    setName(cat.name);
    setImageUrl(cat.image_url || "");
    setDescription(cat.description || "");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    if (editTarget) {
      const { error } = await supabase
        .from("categories")
        .update({ name, slug, image_url: imageUrl || null, description: description || null })
        .eq("id", editTarget.id);
      if (error) alert("Error: " + error.message);
    } else {
      const { error } = await supabase.from("categories").insert({
        name,
        slug,
        image_url: imageUrl || null,
        description: description || null,
        sort_order: categories.length,
        is_visible: true,
      });
      if (error) alert("Error: " + error.message);
    }

    setShowForm(false);
    setEditTarget(null);
    setName("");
    setImageUrl("");
    setSaving(false);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products using it will become uncategorised.")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  }

  async function handleToggleVisible(cat: any) {
    await supabase.from("categories").update({ is_visible: !cat.is_visible }).eq("id", cat.id);
    fetchCategories();
  }

  async function handleMove(cat: any, direction: "up" | "down") {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    const swap = categories[swapIdx];
    await supabase.from("categories").update({ sort_order: swap.sort_order ?? swapIdx }).eq("id", cat.id);
    await supabase.from("categories").update({ sort_order: cat.sort_order ?? idx }).eq("id", swap.id);
    fetchCategories();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage jewellery categories across your store</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-text-main)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border-2 border-[var(--color-primary-gold)] shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editTarget ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] text-sm"
                  placeholder="e.g. Earrings"
                />
                {name && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug: /{name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Category Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] text-sm"
                placeholder="Short description shown on category page"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[var(--color-text-main)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editTarget ? "Save Changes" : "Add Category"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-900 text-sm">All Categories ({categories.length})</span>
          <span className="text-xs text-gray-400">Drag arrows to reorder display sequence</span>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <Loader2 size={22} className="animate-spin text-[var(--color-primary-gold)] mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <Tag size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No categories yet. Add your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((cat, idx) => (
              <div key={cat.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${!cat.is_visible ? "opacity-50" : ""}`}>
                {/* Category Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[var(--color-primary-blush)] shrink-0">
                  {cat.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-gold)]">
                      <Tag size={22} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                    {!cat.is_visible && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{cat.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(cat, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(cat, "down")}
                    disabled={idx === categories.length - 1}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => handleToggleVisible(cat)}
                    className={`p-1.5 rounded transition-colors ${cat.is_visible ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                    title={cat.is_visible ? "Hide category" : "Show category"}
                  >
                    {cat.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded text-blue-500 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

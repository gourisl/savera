"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Loader2, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add/Edit modal state
  const [editing, setEditing] = useState<any | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    setLoading(true);
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    setFaqs(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setQuestion("");
    setAnswer("");
    setShowForm(true);
  }

  function openEdit(faq: any) {
    setEditing(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);

    if (editing) {
      await supabase
        .from("faqs")
        .update({ question, answer })
        .eq("id", editing.id);
    } else {
      await supabase.from("faqs").insert({
        question,
        answer,
        sort_order: faqs.length,
      });
    }

    setShowForm(false);
    setEditing(null);
    setQuestion("");
    setAnswer("");
    setSaving(false);
    fetchFAQs();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    fetchFAQs();
  }

  async function handleMove(faq: any, direction: "up" | "down") {
    const currentIdx = faqs.findIndex((f) => f.id === faq.id);
    const swapIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
    if (swapIdx < 0 || swapIdx >= faqs.length) return;

    const swapFaq = faqs[swapIdx];
    await supabase.from("faqs").update({ sort_order: swapFaq.sort_order }).eq("id", faq.id);
    await supabase.from("faqs").update({ sort_order: faq.sort_order }).eq("id", swapFaq.id);
    fetchFAQs();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions shown on your homepage</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-text-main)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border-2 border-[var(--color-primary-gold)] shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editing ? "Edit FAQ" : "Add New FAQ"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Question *</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] text-sm"
                placeholder="e.g. Do your products tarnish?"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Answer *</label>
              <textarea
                required
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] text-sm resize-none"
                placeholder="Provide a clear, helpful answer..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[var(--color-text-main)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : (editing ? "Save Changes" : "Add FAQ")}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQs List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 text-sm">
          All FAQs ({faqs.length})
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <Loader2 size={22} className="animate-spin text-[var(--color-primary-gold)] mx-auto" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-10 text-center">
            <HelpCircle size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No FAQs yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 mb-1">{faq.question}</p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(faq, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30 transition-colors"
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMove(faq, "down")}
                      disabled={idx === faqs.length - 1}
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30 transition-colors"
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() => openEdit(faq)}
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

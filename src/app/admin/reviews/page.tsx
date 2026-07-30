"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2, Loader2, ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, products(name)")
      .order("created_at", { ascending: false });

    if (data) {
      setReviews(data);
    } else {
      // Mock initial sample reviews if database empty
      setReviews([
        {
          id: "r1",
          user_name: "Ananya Sharma",
          rating: 5,
          comment: "Absolutely stunning necklace! The gold finish is breathtaking and anti-tarnish quality is genuine.",
          is_approved: true,
          created_at: new Date().toISOString(),
          products: { name: "Lumina Pearl Necklace" }
        },
        {
          id: "r2",
          user_name: "Rhea Verma",
          rating: 4,
          comment: "Beautiful Korean earrings. Light on ears and premium packaging.",
          is_approved: true,
          created_at: new Date().toISOString(),
          products: { name: "Aura Gold Hoops" }
        }
      ]);
    }
    setLoading(false);
  }

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("reviews").update({ is_approved: !currentStatus }).eq("id", id);
    if (!error) fetchReviews();
    else {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: !currentStatus } : r))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Reviews</h1>
        <p className="text-sm text-gray-500">Moderate ratings, customer comments and product review photos</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
          All Reviews ({reviews.length})
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No customer reviews yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{rev.user_name}</span>
                    <span className="text-xs text-gray-400">on <strong className="text-gray-700">{rev.products?.name || "Product"}</strong></span>
                    <span className="text-xs text-gray-400">• {new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= rev.rating ? "currentColor" : "none"} className={s <= rev.rating ? "text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mt-1">&quot;{rev.comment}&quot;</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleApproval(rev.id, rev.is_approved)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      rev.is_approved ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {rev.is_approved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {rev.is_approved ? "Approved" : "Pending Approval"}
                  </button>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
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

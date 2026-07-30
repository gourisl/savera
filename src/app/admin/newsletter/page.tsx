"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Download, Search, Loader2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(subscribers.filter((s) => s.email.toLowerCase().includes(q)));
  }, [search, subscribers]);

  async function fetchSubscribers() {
    setLoading(true);
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    setSubscribers(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    setDeleting(id);
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  }

  const handleExportCSV = () => {
    const rows = [["Email", "Subscribed At"], ...filtered.map((s) => [s.email, new Date(s.subscribed_at || s.created_at).toLocaleDateString("en-IN")])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savera_newsletter_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {subscribers.length} subscribers collected
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Subscribers</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Mail size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {subscribers.filter((s) => {
                const date = new Date(s.subscribed_at || s.created_at);
                const now = new Date();
                const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                return diff <= 30;
              }).length}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last 30 Days</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Mail size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {subscribers.filter((s) => {
                const date = new Date(s.subscribed_at || s.created_at);
                const now = new Date();
                const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                return diff <= 7;
              }).length}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">This Week</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subscribers..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
        />
      </div>

      {/* Subscriber Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-900 text-sm">
            {search ? `Showing ${filtered.length} of ${subscribers.length}` : `All Subscribers (${subscribers.length})`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center">
                    <Loader2 size={20} className="animate-spin text-[var(--color-primary-gold)] mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400 text-sm">
                    {search ? "No subscribers match your search." : "No subscribers yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] flex items-center justify-center text-xs font-bold uppercase">
                          {sub.email[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.subscribed_at || sub.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleting === sub.id}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Remove subscriber"
                      >
                        {deleting === sub.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, Search, Download, Eye, Package, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          (c.full_name || "").toLowerCase().includes(q) ||
          (c.phone_number || "").includes(q)
      )
    );
  }, [search, customers]);

  async function fetchCustomers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "customer")
      .order("created_at", { ascending: false });
    setCustomers(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  async function viewCustomerOrders(customer: any) {
    setSelected(customer);
    setOrdersLoading(true);
    setCustomerOrders([]);
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(quantity, unit_price, products(name))")
      .eq("user_id", customer.id)
      .order("created_at", { ascending: false });
    setCustomerOrders(data || []);
    setOrdersLoading(false);
  }

  const handleExportCSV = () => {
    const rows = [
      ["Name", "Phone", "Joined"],
      ...filtered.map((c) => [
        c.full_name || "Guest",
        c.phone_number || "",
        new Date(c.created_at).toLocaleDateString("en-IN"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savera_customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = customerOrders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {customers.length} registered customers
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={customers.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Customers</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {customers.filter((c) => {
                const d = new Date(c.created_at);
                const now = new Date();
                return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 30;
              }).length}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">New This Month</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {customers.filter((c) => {
                const d = new Date(c.created_at);
                const now = new Date();
                return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
              }).length}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Joined This Week</p>
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
          placeholder="Search by name or phone..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">
            {search ? `Showing ${filtered.length} of ${customers.length}` : `All Customers (${customers.length})`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <Loader2 size={20} className="animate-spin text-[var(--color-primary-gold)] mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] flex items-center justify-center font-bold text-sm uppercase">
                          {c.full_name ? c.full_name[0] : "C"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{c.full_name || "Guest Customer"}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{c.id.slice(0, 12)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.phone_number ? (
                        <a href={`tel:${c.phone_number}`} className="hover:text-[var(--color-primary-gold)] transition-colors flex items-center gap-1.5">
                          <Phone size={12} />
                          {c.phone_number}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => viewCustomerOrders(c)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-primary-blush)] text-[var(--color-text-main)] hover:bg-[var(--color-primary-gold)] hover:text-white transition-colors ml-auto"
                      >
                        <Eye size={13} /> View Orders
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-serif font-bold text-gray-900">{selected.full_name || "Guest"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Customer order history</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {/* Customer Info */}
              <div className="bg-[var(--color-primary-blush)] rounded-xl p-4 space-y-2 text-sm">
                {selected.phone_number && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} className="text-[var(--color-primary-gold)]" />
                    {selected.phone_number}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={14} className="text-[var(--color-primary-gold)]" />
                  Joined {new Date(selected.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              {/* Order Summary */}
              {!ordersLoading && customerOrders.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{customerOrders.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-primary-gold)]">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Spent</p>
                  </div>
                </div>
              )}

              {/* Orders List */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Orders</h3>

              {ordersLoading ? (
                <div className="py-8 text-center">
                  <Loader2 size={20} className="animate-spin text-[var(--color-primary-gold)] mx-auto" />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="py-8 text-center">
                  <Package size={32} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No orders placed yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-gray-700">#{order.id.slice(0, 8).toUpperCase()}</span>
                          <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                            order.status === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-sm font-bold text-gray-900 mt-1">₹{Number(order.total_amount).toLocaleString()}</p>
                        </div>
                      </div>
                      {order.order_items?.map((item: any, i: number) => (
                        <p key={i} className="text-xs text-gray-500">
                          • {item.products?.name || "Product"} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

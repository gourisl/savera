"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingBag, IndianRupee, AlertTriangle, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardMetrics() {
      setLoading(true);

      try {
        // Fetch Orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*, profiles(full_name)")
          .order("created_at", { ascending: false });

        const ordersList = ordersData || [];
        const totalRev = ordersList.reduce((sum: number, o: any) => sum + (parseFloat(o.total_amount) || 0), 0);

        // Fetch Customers
        const { count: customerCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch Low Stock products
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .lte("stock", 5);

        setStats({
          totalRevenue: totalRev,
          totalOrders: ordersList.length,
          totalCustomers: customerCount || 0,
          lowStockCount: (productsData || []).length,
        });

        setRecentOrders(ordersList.slice(0, 5));
        setLowStockProducts(productsData || []);
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardMetrics();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtitle: "Gross store volume",
      icon: <IndianRupee size={24} className="text-emerald-600" />,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      subtitle: "Lifetime orders placed",
      icon: <ShoppingBag size={24} className="text-blue-600" />,
    },
    {
      label: "Registered Customers",
      value: stats.totalCustomers.toString(),
      subtitle: "Active customer accounts",
      icon: <Users size={24} className="text-purple-600" />,
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      subtitle: "Products with ≤ 5 units",
      icon: <AlertTriangle size={24} className="text-amber-600" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Live store metrics and quick fulfillment statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? "..." : stat.value}</h3>
              <p className="text-xs font-medium text-gray-500 mt-1">{stat.subtitle}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-serif font-semibold text-gray-900">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-[var(--color-primary-gold)] hover:underline flex items-center gap-1">
              View All Orders <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading orders...</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No orders placed yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900 text-xs">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {order.shipping_address?.fullName || order.profiles?.full_name || "Guest Customer"}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{order.total_amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-serif font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> Low Inventory Alert
          </h2>

          {loading ? (
            <p className="text-xs text-gray-400">Checking stock levels...</p>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              All product stock levels are healthy!
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((prod) => (
                <div key={prod.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-semibold text-gray-900 truncate max-w-[160px]">{prod.name}</h4>
                    <span className="text-gray-500">₹{prod.price}</span>
                  </div>
                  <span className="font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                    {prod.stock} left
                  </span>
                </div>
              ))}
              <Link href="/admin/products" className="block text-center text-xs text-[var(--color-primary-gold)] font-medium hover:underline pt-2">
                Manage Stock in Products →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

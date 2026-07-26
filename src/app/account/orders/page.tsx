"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[var(--color-text-main)]">My Orders</h1>
            <p className="text-[var(--color-text-muted)] text-sm">View order history and track recent shipments</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-[var(--color-primary-gold)] hover:underline">
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
            <div className="w-20 h-20 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary-gold)]">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-serif text-[var(--color-text-main)] mb-2">No orders placed yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6 text-sm">When you place an order, it will appear here.</p>
            <Link href="/shop" className="px-6 py-3 bg-[var(--color-text-main)] text-white text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors inline-block">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Order ID</span>
                    <span className="font-mono font-medium text-gray-900">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Date</span>
                    <span className="text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Total</span>
                    <span className="text-sm font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Payment Method: <span className="font-medium text-gray-700">{order.payment_method || "Online"}</span>
                  </div>
                  <Link
                    href={`/track-order?id=${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary-gold)] hover:underline"
                  >
                    Track Status <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

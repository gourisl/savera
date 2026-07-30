"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect, Suspense } from "react";
import { Package, Search, Truck, CheckCircle, Clock, XCircle, Loader2, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const STATUS_STEPS = [
  { key: "pending",    icon: Clock,        label: "Order Placed",       color: "amber" },
  { key: "processing", icon: Package,       label: "Processing & Packed", color: "blue" },
  { key: "shipped",   icon: Truck,         label: "Shipped",            color: "purple" },
  { key: "delivered", icon: CheckCircle,   label: "Delivered",          color: "emerald" },
];

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered"];

function getStepIndex(status: string) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const prefillId = searchParams.get("id") || "";

  const [orderId, setOrderId] = useState(prefillId);
  const [inputId, setInputId] = useState(prefillId);
  const [order, setOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (prefillId) {
      setOrderId(prefillId);
      setInputId(prefillId);
      fetchOrder(prefillId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillId]);

  async function fetchOrder(id: string) {
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    setOrderItems([]);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setOrder(data);

      // Fetch order items with product details
      const { data: items } = await supabase
        .from("order_items")
        .select("*, products(name, images, price)")
        .eq("order_id", id);

      setOrderItems(items || []);
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    setOrderId(inputId.trim());
    fetchOrder(inputId.trim());
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-3xl">
      <div className="text-center mb-12">
        <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
          Order Tracking
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
          Track Your Order
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Enter your Order ID to see real-time delivery updates.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={inputId}
            onChange={(e) => { setInputId(e.target.value); }}
            placeholder="Paste your Order ID here..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-gold)] focus:border-transparent text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-4 bg-[var(--color-text-main)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-gold)] transition-colors shrink-0 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Track"}
        </button>
      </form>

      {/* Not Found */}
      {notFound && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <XCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-serif text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-sm text-gray-600 mb-4">
            We couldn&apos;t find an order with ID: <span className="font-mono font-bold">{orderId}</span>
          </p>
          <Link href="/account/orders" className="text-[var(--color-primary-gold)] text-sm font-medium hover:underline">
            View all your orders →
          </Link>
        </div>
      )}

      {/* Order Details */}
      {order && !loading && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                <h3 className="font-mono font-bold text-lg text-gray-900">{order.id.slice(0, 8).toUpperCase()}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isCancelled ? "bg-red-100 text-red-700" :
                  order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                  order.status === "shipped" ? "bg-purple-100 text-purple-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {order.status}
                </span>
                <p className="text-base font-serif font-bold text-[var(--color-primary-gold)] mt-2">
                  ₹{Number(order.total_amount).toLocaleString()}
                </p>
              </div>
            </div>

            {order.awb_number && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-center gap-2 text-sm">
                <Truck size={16} className="text-[var(--color-primary-gold)]" />
                <span className="text-gray-600">AWB / Tracking:</span>
                <span className="font-mono font-bold text-gray-900">{order.awb_number}</span>
              </div>
            )}
          </div>

          {/* Progress Timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-serif text-[var(--color-text-main)] mb-6">Delivery Progress</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-[var(--color-primary-gold)] transition-all duration-700"
                  style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                <div className="space-y-8 relative">
                  {STATUS_STEPS.map((step, index) => {
                    const isDone = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                          isDone
                            ? "bg-[var(--color-primary-gold)] border-[var(--color-primary-gold)] text-white"
                            : "bg-white border-gray-200 text-gray-300"
                        } ${isCurrent ? "ring-4 ring-amber-100 shadow-md" : ""}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-semibold text-sm ${isDone ? "text-[var(--color-text-main)]" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-[var(--color-primary-gold)] font-medium mt-0.5">Current Status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
              <XCircle size={32} className="text-red-400 shrink-0" />
              <div>
                <h3 className="font-serif font-semibold text-gray-900">Order Cancelled</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This order was cancelled. If you need help, please <Link href="/contact" className="text-[var(--color-primary-gold)] hover:underline">contact us</Link>.
                </p>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-serif text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-[var(--color-primary-gold)]" />
                Shipping Address
              </h3>
              <p className="text-sm text-gray-700 font-medium">{order.shipping_address.fullName}</p>
              <p className="text-xs text-gray-500 mt-1">{order.shipping_address.address}</p>
              <p className="text-xs text-gray-500">{order.shipping_address.phone}</p>
            </div>
          )}

          {/* Order Items */}
          {orderItems.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-serif text-[var(--color-text-main)] mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {item.products?.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.products.images[0]} alt={item.products?.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.products?.name || "Product"}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[var(--color-primary-gold)]" />
        </div>
      }>
        <TrackContent />
      </Suspense>
      <Footer />
    </main>
  );
}

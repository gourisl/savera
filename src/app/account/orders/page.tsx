"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Download, Printer, X, Truck, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      if (user) {
        const { data } = await supabase
          .from("orders")
          .select("*, order_items(*, products(name, images))")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setOrders(data || []);
      } else {
        const { data } = await supabase
          .from("orders")
          .select("*, order_items(*, products(name, images))")
          .order("created_at", { ascending: false })
          .limit(10);
        setOrders(data || []);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[var(--color-text-main)]">My Orders</h1>
            <p className="text-[var(--color-text-muted)] text-sm">View order history, track shipments, and download invoices</p>
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
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="w-20 h-20 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary-gold)]">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-serif text-[var(--color-text-main)] mb-2">No orders placed yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6 text-sm">When you place an order, it will appear here.</p>
            <Link href="/shop" className="px-6 py-3 bg-[var(--color-text-main)] text-white text-sm font-medium hover:bg-[var(--color-primary-gold)] transition-colors inline-block rounded-lg">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Order ID</span>
                    <span className="font-mono font-medium text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Placed On</span>
                    <span className="text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Total Amount</span>
                    <span className="text-sm font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-3 mb-6">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.products?.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=200&auto=format&fit=crop"}
                          alt={item.products?.name || "Jewellery Item"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.products?.name || "Luxury Jewellery Item"}</h4>
                        <span className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unit_price || item.price_at_time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100 gap-3">
                  <button
                    onClick={() => setSelectedInvoice(order)}
                    className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-[var(--color-primary-gold)] transition-colors"
                  >
                    <Download size={14} /> Download Invoice
                  </button>

                  <Link
                    href={`/track-order?id=${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary-gold)] hover:underline"
                  >
                    <Truck size={14} /> Live Order Tracking <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans print:shadow-none print:max-w-none print:w-full">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6 print:hidden">
              <span className="text-lg font-serif font-semibold text-gray-900">Tax Invoice</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[var(--color-primary-gold)] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 hover:bg-amber-600 transition-colors"
                >
                  <Printer size={14} /> Print / PDF
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-serif tracking-widest text-[var(--color-text-main)] mb-1">SAVERA</h1>
                <p className="text-xs text-gray-500">Fine & Anti-Tarnish Luxury Jewellery</p>
                <p className="text-xs text-gray-500">GSTIN: 32AAAAA0000A1Z5</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-serif text-gray-900 font-medium">INVOICE</h2>
                <p className="text-xs font-mono text-gray-600">#INV-{selectedInvoice.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-500 mt-1">Date: {new Date(selectedInvoice.created_at).toLocaleDateString("en-IN")}</p>
              </div>
            </div>

            {/* Billed To */}
            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 mb-6 grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-gray-900 uppercase block mb-1">Billed & Shipped To:</span>
                <p className="font-medium text-gray-900">{selectedInvoice.shipping_address?.fullName || "Valued Customer"}</p>
                <p>{selectedInvoice.shipping_address?.address || "Address provided during checkout"}</p>
                <p>Phone: {selectedInvoice.shipping_address?.phone || "—"}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 uppercase block mb-1">Payment Method:</span>
                <p className="font-medium">{selectedInvoice.payment_method || "Razorpay Online"}</p>
                <p className="mt-1">Status: <span className="text-emerald-700 font-bold uppercase">{selectedInvoice.payment_status || "Paid"}</span></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-left mb-6">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedInvoice.order_items?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="p-3 font-medium text-gray-900">{item.products?.name || "Jewellery Product"}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">₹{item.unit_price || item.price_at_time}</td>
                    <td className="p-3 text-right font-medium">₹{(item.quantity * (item.unit_price || item.price_at_time)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end text-xs space-y-2 border-t border-gray-200 pt-4">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charge:</span>
                  <span>₹{selectedInvoice.shipping_fee || 50}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Grand Total:</span>
                  <span className="text-[var(--color-primary-gold)]">₹{selectedInvoice.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
              Thank you for shopping with SAVERA. This is a computer-generated tax invoice.
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

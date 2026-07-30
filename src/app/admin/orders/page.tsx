"use client";

import { useState, useEffect } from "react";
import { Search, Eye, X, Printer, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const [trackingNo, setTrackingNo] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(full_name, phone_number), order_items(*, products(name, images))")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }
    setLoading(false);
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      fetchOrders();
    } catch (err: any) {
      alert("Error updating order status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ tracking_number: trackingNo, status: "Shipped" })
        .eq("id", selectedOrder.id);

      if (error) throw error;
      setSelectedOrder({ ...selectedOrder, tracking_number: trackingNo, status: "Shipped" });
      fetchOrders();
      alert("Tracking details saved & status set to Shipped!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Packed': return 'bg-indigo-100 text-indigo-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.profiles?.full_name && o.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.shipping_address?.fullName && o.shipping_address.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Order Fulfillment & Management</h1>
          <p className="text-sm text-gray-500">Track incoming customer orders, manage statuses, and generate shipping slips</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID or Customer Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-text-main)] text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {order.shipping_address?.fullName || order.profiles?.full_name || "Guest Customer"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.shipping_address?.phone || order.profiles?.phone_number || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{order.total_amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        order.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.payment_status || 'Paid'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border-none focus:ring-1 focus:ring-amber-500 cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingNo(order.tracking_number || "");
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Shipping Label Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-serif text-[var(--color-text-main)]">Order Details</h2>
                <p className="text-xs font-mono text-gray-400">ID: #{selectedOrder.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 hover:bg-gray-800"
                >
                  <Printer size={14} /> Print Slip
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase text-xs mb-2">Shipping Address</h3>
                <p className="font-semibold text-gray-900">{selectedOrder.shipping_address?.fullName || "Customer Name"}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{selectedOrder.shipping_address?.address || "Address"}</p>
                <p className="text-xs text-gray-500 mt-2">Phone: {selectedOrder.shipping_address?.phone || "—"}</p>
                <p className="text-xs text-gray-500">Email: {selectedOrder.shipping_address?.email || "—"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 uppercase text-xs mb-2">Fulfillment & Tracking</h3>
                  <p className="text-xs text-gray-600 mb-1">Carrier Support: Shiprocket / Delhivery / BlueDart</p>
                  <p className="text-xs font-medium text-gray-900">Current Status: <strong className="uppercase">{selectedOrder.status}</strong></p>
                </div>

                <form onSubmit={handleSaveTracking} className="mt-4 pt-3 border-t border-gray-200">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">AWB / Tracking Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      placeholder="e.g. AWB123456789"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono"
                    />
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-[var(--color-primary-gold)] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Items */}
            <h3 className="font-serif font-bold text-gray-900 mb-3">Ordered Items</h3>
            <div className="space-y-3 mb-6">
              {selectedOrder.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.products?.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=200&auto=format&fit=crop"}
                        alt={item.products?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.products?.name || "Jewellery Piece"}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unit_price || item.price_at_time}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">₹{(item.quantity * (item.unit_price || item.price_at_time)).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 font-bold text-gray-900">
              <span>Total Payment:</span>
              <span className="text-xl text-[var(--color-primary-gold)]">₹{selectedOrder.total_amount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

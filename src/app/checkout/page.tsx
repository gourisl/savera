"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { Lock, CreditCard, Banknote, HelpCircle, Loader2, Tag, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Shipping from settings
  const [shippingFee, setShippingFee] = useState(50);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1999);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData] = useState<any | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);

  const effectiveShipping = cartTotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = cartTotal - discount + (items.length > 0 ? effectiveShipping : 0);

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone_number || "",
    houseName: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    orderNotes: "",
  });

  // Pre-fill from profile
  useEffect(() => {
    if (profile || user) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile?.full_name || prev.fullName,
        email: user?.email || prev.email,
        phone: profile?.phone_number || prev.phone,
      }));
    }
  }, [profile, user]);

  // Fetch settings
  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from("settings").select("key, value");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: any) => { map[row.key] = row.value; });
        if (map.shipping_fee) setShippingFee(Number(map.shipping_fee));
        if (map.free_shipping_threshold) setFreeShippingThreshold(Number(map.free_shipping_threshold));
      }
    }
    loadSettings();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponData(null);
    setDiscount(0);

    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setCouponError("Invalid or expired coupon code.");
        setCouponLoading(false);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCouponError("This coupon has expired.");
        setCouponLoading(false);
        return;
      }

      if (data.min_order_amount && cartTotal < data.min_order_amount) {
        setCouponError(`Minimum order of ₹${data.min_order_amount} required for this coupon.`);
        setCouponLoading(false);
        return;
      }

      let discountAmount = 0;
      if (data.discount_type === "percentage") {
        discountAmount = Math.round((cartTotal * data.discount_value) / 100);
      } else {
        discountAmount = data.discount_value;
      }

      setCouponData(data);
      setDiscount(Math.min(discountAmount, cartTotal));
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponData(null);
    setDiscount(0);
    setCouponError("");
  };

  const createOrderInDB = async () => {
    const shippingAddress = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.houseName}, ${formData.street}, ${formData.area}${formData.landmark ? ", " + formData.landmark : ""}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        total_amount: total,
        status: "pending",
        shipping_address: shippingAddress,
        payment_method: paymentMethod === "razorpay" ? "Online (Razorpay)" : "Cash on Delivery",
        coupon_code: couponData?.code || null,
        discount_amount: discount,
        notes: formData.orderNotes || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    if (order) {
      const orderItemsPayload = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));
      await supabase.from("order_items").insert(orderItemsPayload);
    }

    return order;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setSubmitting(true);

    try {
      if (paymentMethod === "cod") {
        const order = await createOrderInDB();
        clearCart();
        router.push(`/track-order?id=${order.id}`);
        return;
      }

      // Razorpay flow
      if (!window.Razorpay) {
        alert("Payment gateway is not loaded. Please refresh the page.");
        return;
      }

      // 1. Create Order in Supabase DB first
      const order = await createOrderInDB();

      // 2. Call backend /api/create-order to create Razorpay Order (returns order_id)
      const amountInPaise = Math.round(total * 100);
      const createOrderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          receipt: `rcpt_${order.id.slice(0, 8)}`,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to initialize payment gateway order.");
      }

      // 3. Configure Razorpay Standard Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TIa4aIjB9s6uXT",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Savera Jewellery",
        description: `Order #${order.id.slice(0, 8)}`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            // 4. Send signatures to backend /api/verify-payment for HMAC verification
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Payment verified successfully! Update order status in Supabase
              await supabase
                .from("orders")
                .update({
                  status: "processing",
                  payment_status: "Paid",
                  payment_id: response.razorpay_payment_id,
                })
                .eq("id", order.id);

              clearCart();
              router.push(`/track-order?id=${order.id}`);
            } else {
              alert("Payment verification failed: " + (verifyData.error || "Invalid signature."));
              await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
              setSubmitting(false);
            }
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            alert("Payment verification error: " + verifyErr.message);
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#C5A059",
        },
        modal: {
          ondismiss: async () => {
            // User cancelled payment modal
            await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async (response: any) => {
        console.error("Payment failed:", response.error);
        alert(`Payment Failed: ${response.error.description || response.error.reason}`);
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
        setSubmitting(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Order error:", err);
      alert("Failed to submit order: " + (err.message || "Unknown error"));
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Checkout Header */}
      <div className="bg-white border-b border-[var(--color-primary-blush)] py-5 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif tracking-widest text-[var(--color-text-main)]">
            SAVERA
          </Link>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <Lock size={16} className="text-emerald-600" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT — Forms */}
          <div className="flex-[3]">
            <form onSubmit={handleCheckout} className="space-y-8">

              {/* Contact Info */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6 flex items-center justify-between">
                  Contact Information
                  {!user && (
                    <span className="text-sm font-sans text-gray-500">
                      <Link href="/account" className="text-[var(--color-primary-gold)] hover:underline">Log in</Link> to auto-fill
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Full Name *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" placeholder="priya@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Phone *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Flat / House Name *</label>
                    <input type="text" name="houseName" required value={formData.houseName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Street *</label>
                    <input type="text" name="street" required value={formData.street} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Area / Locality *</label>
                    <input type="text" name="area" required value={formData.area} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">State *</label>
                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">PIN Code *</label>
                    <input type="text" name="pinCode" required value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Order Notes (optional)</label>
                    <textarea name="orderNotes" rows={2} value={formData.orderNotes} onChange={handleChange} placeholder="Special instructions for your order..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] resize-none text-sm" />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-[var(--color-text-main)] mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "razorpay" ? "border-[var(--color-primary-gold)] bg-amber-50/40 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "razorpay" ? "border-[var(--color-primary-gold)]" : "border-gray-300"}`}>
                        {paymentMethod === "razorpay" && <div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]" />}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block text-sm">Pay Online (Razorpay)</span>
                        <span className="text-xs text-gray-500">UPI, Cards, NetBanking, Wallets</span>
                      </div>
                    </div>
                    <CreditCard size={22} className="text-[var(--color-primary-gold)]" />
                  </label>

                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[var(--color-primary-gold)] bg-amber-50/40 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-[var(--color-primary-gold)]" : "border-gray-300"}`}>
                        {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]" />}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block text-sm">Cash on Delivery</span>
                        <span className="text-xs text-gray-500">Pay when your order arrives</span>
                      </div>
                    </div>
                    <Banknote size={22} className="text-gray-500" />
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full bg-[var(--color-text-main)] text-white py-5 rounded-xl font-semibold text-base tracking-wide hover:bg-[var(--color-primary-gold)] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 className="animate-spin" size={20} /> Processing...</>
                ) : (
                  `Place Order · ₹${total.toLocaleString()}`
                )}
              </button>
            </form>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="flex-[2]">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28 space-y-6">
              <h2 className="text-xl font-serif text-[var(--color-text-main)]">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-6">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-primary-gold)] text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border border-white px-1">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 block truncate">{item.name}</span>
                        <span className="text-xs text-gray-500">₹{item.price.toLocaleString()} each</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon Code */}
              <div>
                {couponData ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">{couponData.code}</span>
                      <span className="text-xs text-emerald-600">
                        — {couponData.discount_type === "percentage" ? `${couponData.discount_value}% off` : `₹${couponData.discount_value} off`}
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          placeholder="COUPON CODE"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-xs font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2.5 bg-[var(--color-text-main)] text-white rounded-lg text-xs font-bold tracking-wide hover:bg-[var(--color-primary-gold)] transition-colors disabled:opacity-50 shrink-0"
                      >
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">− ₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={effectiveShipping === 0 ? "text-emerald-600 font-medium" : "font-medium text-gray-900"}>
                    {items.length > 0 ? (effectiveShipping === 0 ? "Free" : `₹${effectiveShipping}`) : "₹0"}
                  </span>
                </div>
                {effectiveShipping === 0 && cartTotal > 0 && (
                  <p className="text-[10px] text-emerald-600 font-medium">🎉 You qualify for free shipping!</p>
                )}
                {effectiveShipping > 0 && (
                  <p className="text-[10px] text-gray-400">
                    Add ₹{(freeShippingThreshold - cartTotal).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-3xl font-serif font-semibold text-[var(--color-primary-gold)]">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="bg-[var(--color-primary-blush)] p-4 rounded-xl flex items-start gap-3">
                <HelpCircle size={18} className="text-[var(--color-text-main)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  By placing your order you agree to Savera&apos;s Terms of Service and Privacy Policy. Your payment is processed securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

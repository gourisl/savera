import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary-gold)] font-bold mb-2 block">
            Customer Care
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Shipping & Returns Policy
          </h1>
          <p className="text-xs text-[var(--color-text-light)]">Fast pan-India delivery with care</p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck size={22} />
            </div>
            <h3 className="font-serif font-semibold text-gray-900 mb-1">Standard Shipping</h3>
            <p className="text-xs text-gray-500">₹50 flat charge across India</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock size={22} />
            </div>
            <h3 className="font-serif font-semibold text-gray-900 mb-1">Delivery Time</h3>
            <p className="text-xs text-gray-500">3–7 business days</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-full flex items-center justify-center mx-auto mb-3">
              <RotateCcw size={22} />
            </div>
            <h3 className="font-serif font-semibold text-gray-900 mb-1">7-Day Returns</h3>
            <p className="text-xs text-gray-500">Hassle-free return window</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-serif font-semibold text-gray-900 mb-1">Insured Packaging</h3>
            <p className="text-xs text-gray-500">Safe luxury box delivery</p>
          </div>
        </div>

        <div className="prose prose-amber max-w-none text-[var(--color-text-muted)] text-sm leading-relaxed space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">1. Shipping Options & Delivery Timelines</h2>
            <p>
              We ship across all pin codes in India through top courier partners including Shiprocket, Delhivery, Blue Dart, and India Post.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Metro Cities:</strong> 3 – 5 business days</li>
              <li><strong>Rest of India:</strong> 5 – 7 business days</li>
              <li><strong>Order Processing Time:</strong> Orders placed before 2:00 PM IST are dispatched the same or next business day.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">2. Shipping Charges</h2>
            <p>
              We charge a flat fee of ₹50 for shipping on orders below the threshold. Free shipping automatically applies for orders meeting the minimum promotional amount.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">3. Order Tracking</h2>
            <p>
              As soon as your package is dispatched, you will receive an AWB tracking number via email and SMS. You can also track your live status anytime on our <a href="/track-order" className="text-[var(--color-primary-gold)] underline">Track Order</a> page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">4. 7-Day Returns & Exchanges Policy</h2>
            <p>
              If you receive a damaged product or are unsatisfied with your order, you can initiate a return or exchange within 7 days of delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The item must be unused, unwashed, and in its original Savera packaging.</li>
              <li>To request a return, go to <strong>Account &gt; My Orders</strong> or email support at <a href="mailto:hello@savera.com" className="text-[var(--color-primary-gold)] underline">hello@savera.com</a>.</li>
              <li>Refunds are processed back to your original payment method or UPI within 5 business days after quality inspection.</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

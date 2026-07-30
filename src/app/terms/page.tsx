import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary-gold)] font-bold mb-2 block">
            Legal Terms
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Terms of Service
          </h1>
          <p className="text-xs text-[var(--color-text-light)]">Last Updated: July 2026</p>
        </div>

        <div className="prose prose-amber max-w-none text-[var(--color-text-muted)] text-sm leading-relaxed space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Savera website, mobile experience, or purchasing our products, you agree to be bound by these Terms of Service and all applicable laws and regulations in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">2. Product Descriptions & Pricing</h2>
            <p>
              We make every effort to display the colors, dimensions, and craftsmanship of our products as accurately as possible. Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to correct pricing errors or update product availability without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">3. Orders & Payment</h2>
            <p>
              When you place an order, you agree to provide valid shipping and payment details. Payment is processed securely via Razorpay or Cash on Delivery (COD) where available. Savera reserves the right to decline or cancel any order suspected of fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">4. Intellectual Property</h2>
            <p>
              All content on this website—including photography, logo, typography, design assets, brand identity, and product titles—is the exclusive property of Savera and protected by trademark and copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">5. Contact Information</h2>
            <p>
              If you have any questions regarding these Terms, please reach out to us at <a href="mailto:hello@savera.com" className="text-[var(--color-primary-gold)] underline">hello@savera.com</a> or call +91 98765 43210.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

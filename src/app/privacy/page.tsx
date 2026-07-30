import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary-gold)] font-bold mb-2 block">
            Legal Information
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--color-text-light)]">Last Updated: July 2026</p>
        </div>

        <div className="prose prose-amber max-w-none text-[var(--color-text-muted)] text-sm leading-relaxed space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">1. Introduction</h2>
            <p>
              Savera (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from Savera.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Create an account or place an order</li>
              <li>Subscribe to our newsletter or promotional communications</li>
              <li>Contact our customer support team</li>
              <li>Participate in surveys, contests, or product reviews</li>
            </ul>
            <p className="mt-2">This may include your name, email address, shipping & billing address, phone number, and payment information.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Process and fulfill your orders, including order confirmation, payment, and delivery</li>
              <li>Provide customer support and respond to customer requests</li>
              <li>Send transaction updates, order tracking information, and invoices</li>
              <li>Send promotional emails and special offers (if opted in)</li>
              <li>Improve and optimize our website experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">4. Data Security & Storage</h2>
            <p>
              We implement industry-standard security measures including SSL encryption, secure Supabase authentication, and trusted payment processing through Razorpay. We never store your full payment card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">5. Third-Party Services</h2>
            <p>
              We share relevant shipping details with courier and logistics partners (e.g. Shiprocket, Delhivery, Blue Dart) solely to complete order fulfillment. We do not sell or rent customer data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-text-main)] mb-3">6. Your Rights & Contact</h2>
            <p>
              You have the right to access, update, or request deletion of your personal data at any time through your account settings or by emailing <a href="mailto:hello@savera.com" className="text-[var(--color-primary-gold)] underline">hello@savera.com</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

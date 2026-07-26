import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-light)] pt-20 pb-10 border-t border-[var(--color-primary-blush)]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 pb-16 border-b border-[var(--color-primary-blush)]">
          <div className="max-w-md mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">Join the Savera Club</h3>
            <p className="text-[var(--color-text-muted)] text-sm">
              Subscribe to receive exclusive offers, new arrival alerts, and styling tips.
            </p>
          </div>
          <form className="flex w-full md:w-auto max-w-md gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 bg-transparent border border-[var(--color-text-light)] focus:border-[var(--color-text-main)] outline-none text-[var(--color-text-main)] transition-colors"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-[var(--color-text-main)] text-white font-medium hover:bg-[var(--color-primary-gold)] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          
          <div>
            <Link href="/" className="text-3xl font-serif tracking-widest text-[var(--color-text-main)] block mb-6">
              SAVERA
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
              Crafting timeless luxury. Our anti-tarnish, premium jewellery is designed for the modern woman who appreciates subtle elegance and uncompromising quality.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 text-[var(--color-text-main)] text-sm">
              <a href="#" className="hover:text-[var(--color-primary-gold)] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[var(--color-primary-gold)] transition-colors">Facebook</a>
              <a href="#" className="hover:text-[var(--color-primary-gold)] transition-colors">Twitter</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-main)] mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li><Link href="/shop" className="hover:text-[var(--color-primary-gold)] transition-colors">All Jewellery</Link></li>
              <li><Link href="/collections/anti-tarnish" className="hover:text-[var(--color-primary-gold)] transition-colors">Anti-Tarnish Collection</Link></li>
              <li><Link href="/collections/korean" className="hover:text-[var(--color-primary-gold)] transition-colors">Korean Jewellery</Link></li>
              <li><Link href="/collections/hair-accessories" className="hover:text-[var(--color-primary-gold)] transition-colors">Hair Accessories</Link></li>
              <li><Link href="/collections/gift-sets" className="hover:text-[var(--color-primary-gold)] transition-colors">Luxury Gift Sets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-main)] mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li><Link href="/contact" className="hover:text-[var(--color-primary-gold)] transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-[var(--color-primary-gold)] transition-colors">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[var(--color-primary-gold)] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--color-primary-gold)] transition-colors">FAQ</Link></li>
              <li><Link href="/care-instructions" className="hover:text-[var(--color-primary-gold)] transition-colors">Jewellery Care</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-main)] mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>123 Luxury Avenue, Boutique District,<br/>Mumbai, India 400001</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} className="shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail size={18} className="shrink-0" />
                <span>hello@savera.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-primary-blush)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-light)]">
          <p>&copy; {new Date().getFullYear()} Savera Jewellery. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-[var(--color-text-main)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--color-text-main)] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

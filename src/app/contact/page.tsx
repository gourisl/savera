"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            Contact Us
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
            We would love to hear from you. Reach out for orders, collaborations, or just to say hello.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="flex-[3] bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">Message Sent!</h3>
                <p className="text-[var(--color-text-muted)]">Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={5} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)] resize-none" />
                </div>
                <button type="submit" className="w-full bg-[var(--color-text-main)] text-white py-4 rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex-[2] space-y-8">
            <div className="bg-[var(--color-primary-blush)] p-8 rounded-2xl">
              <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-6">Contact Information</h3>
              <ul className="space-y-6 text-sm text-[var(--color-text-muted)]">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-[var(--color-primary-gold)] shrink-0 mt-0.5" />
                  <span>123 Luxury Avenue, Boutique District,<br />Mumbai, Maharashtra 400001</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone size={20} className="text-[var(--color-primary-gold)] shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail size={20} className="text-[var(--color-primary-gold)] shrink-0" />
                  <span>hello@savera.com</span>
                </li>
                <li className="flex items-center gap-4">
                  <Clock size={20} className="text-[var(--color-primary-gold)] shrink-0" />
                  <span>Mon – Sat: 10 AM – 7 PM</span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--color-primary-peach)] p-8 rounded-2xl">
              <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-3">WhatsApp Support</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                For quick queries, reach us directly on WhatsApp for instant support.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

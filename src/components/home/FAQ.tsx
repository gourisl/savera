"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEFAULT_FAQS = [
  {
    question: "Is your jewellery really anti-tarnish?",
    answer: "Yes! All our anti-tarnish collections are coated with a special rhodium or PVD layer that protects against oxidation, sweat, and moisture. With proper care, the shine lasts for years.",
  },
  {
    question: "How long does delivery take?",
    answer: "We typically deliver within 5–7 business days across India. Metro cities often receive orders within 3–4 days. You will receive a tracking link via email and WhatsApp once your order is shipped.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can initiate a return from your account dashboard. The item must be unused and in its original packaging.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Absolutely! Every Savera order comes in our signature luxury packaging at no extra cost. For special occasions, you can add a personalized gift message during checkout.",
  },
  {
    question: "How do I care for my jewellery?",
    answer: "Store your pieces in the provided pouch when not wearing them. Avoid direct contact with perfumes, lotions, and water. Gently wipe with a soft cloth after each use to maintain the shine.",
  },
  {
    question: "Can I track my order?",
    answer: "Yes! Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can also track your order anytime from the 'Track Order' page on our website.",
  },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadFaqs() {
      const { data } = await supabase
        .from("faqs")
        .select("question, answer")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      
      if (data && data.length > 0) {
        setFaqs(data);
      }
    }
    loadFaqs();
  }, []);

  return (
    <section className="py-24 bg-[var(--color-surface-white)]">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)]">
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[var(--color-primary-blush)] rounded-xl overflow-hidden transition-all duration-300 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-primary-blush)]/30 transition-colors"
              >
                <span className="text-base font-medium text-[var(--color-text-main)] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-[var(--color-text-light)] transition-transform duration-300 shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="px-6 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

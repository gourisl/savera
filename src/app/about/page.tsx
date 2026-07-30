"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Heart, Leaf } from "lucide-react";

const values = [
  {
    icon: Sparkles,
    title: "Timeless Craftsmanship",
    description: "Every piece is carefully designed with meticulous attention to detail, blending modern aesthetics with timeless elegance.",
  },
  {
    icon: Shield,
    title: "Anti-Tarnish Promise",
    description: "Our signature anti-tarnish coating ensures your jewellery stays radiant for years, surviving everyday wear beautifully.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "From concept to creation, each Savera piece is crafted with genuine passion for celebrating the women who wear it.",
  },
  {
    icon: Leaf,
    title: "Mindful Luxury",
    description: "We believe luxury should be accessible. Premium quality and stunning design, crafted responsibly and priced fairly.",
  },
];

const team = [
  {
    name: "The Savera Vision",
    role: "Founder's Note",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    quote: "Savera was born from a simple belief — every woman deserves jewellery that feels like it was made just for her. We create pieces that don't just accessorise, they tell stories.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[var(--color-primary-blush)] to-white overflow-hidden">
        <div className="absolute top-10 left-8 w-48 h-48 bg-[var(--color-primary-peach)] rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-8 w-64 h-64 bg-[var(--color-primary-beige)] rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-primary-gold)] font-bold mb-4 block">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[var(--color-text-main)] mb-6 leading-tight max-w-4xl mx-auto">
            Redefining Modern{" "}
            <span className="italic text-[var(--color-text-light)]">Luxury Jewellery</span>
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Savera is a celebration of feminine elegance — a jewellery brand that believes every woman deserves to feel radiant, effortlessly every day.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-5xl mx-auto">
            <div className="flex-1">
              <div className="aspect-[4/5] rounded-t-full overflow-hidden border-4 border-[var(--color-primary-blush)] shadow-xl bg-[var(--color-surface-light)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=800&auto=format&fit=crop"
                  alt="Savera jewellery craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-4 block">
                The Savera Story
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)] mb-6 leading-tight">
                Where Elegance Meets Everyday
              </h2>
              <div className="space-y-4 text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed">
                <p>
                  Born from a deep appreciation of feminine beauty and the art of self-expression, Savera was founded with a singular purpose: to make luxury jewellery that doesn&apos;t compromise on quality, beauty, or wearability.
                </p>
                <p>
                  Our collections draw inspiration from the rich tapestry of Indian artistry and the clean, minimalist lines of contemporary Korean design — resulting in pieces that are unmistakably modern, yet timelessly beautiful.
                </p>
                <p>
                  Every Savera creation undergoes a rigorous quality process to ensure it meets our anti-tarnish promise — jewellery that stays as radiant as the day you first wore it.
                </p>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 font-medium tracking-wide group"
              >
                Discover Our Collections
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[var(--color-primary-blush)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)]">
              The Savera Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-[var(--color-primary-blush)] rounded-full flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-[var(--color-primary-gold)]" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-3">{value.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      {team.map((member) => (
        <section key={member.name} className="py-20 bg-[var(--color-primary-beige)]">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <blockquote className="text-xl md:text-2xl font-serif text-[var(--color-text-main)] mb-6 leading-relaxed italic">
                  &ldquo;{member.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-[var(--color-text-main)]">{member.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{member.role}, Savera</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Collections CTA */}
      <section className="py-20 bg-[var(--color-text-main)] text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Begin Your Savera Story</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto text-sm">
            Explore our complete collection of handcrafted luxury jewellery, designed for real women living real lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-[var(--color-primary-gold)] text-white hover:bg-amber-600 transition-colors font-medium"
            >
              Shop the Collection
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/40 text-white hover:bg-white/10 transition-colors font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

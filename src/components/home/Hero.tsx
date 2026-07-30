"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_SETTINGS = {
  hero_title: "Elegance in Every Detail",
  hero_subtitle: "Discover our premium collection of handcrafted, anti-tarnish jewellery designed for the modern muse.",
  hero_badge: "New Collection 2026",
  hero_cta_label: "Shop the Collection",
  hero_banner_url: "",
  hero_cta2_label: "Explore Lookbook",
};

export default function Hero() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    async function loadHeroSettings() {
      const { data } = await supabase.from("settings").select("key, value");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: any) => { map[row.key] = row.value; });
        setSettings({
          hero_title: map.hero_title || DEFAULT_SETTINGS.hero_title,
          hero_subtitle: map.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
          hero_badge: map.hero_badge || DEFAULT_SETTINGS.hero_badge,
          hero_cta_label: map.hero_cta_label || DEFAULT_SETTINGS.hero_cta_label,
          hero_banner_url: map.hero_banner_url || "",
          hero_cta2_label: map.hero_cta2_label || DEFAULT_SETTINGS.hero_cta2_label,
        });
      }
    }
    loadHeroSettings();
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--color-primary-blush)]">
      {/* Background Image (if set from admin) */}
      {settings.hero_banner_url && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.hero_banner_url}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </>
      )}

      {/* Decorative Blobs (only when no bg image) */}
      {!settings.hero_banner_url && (
        <>
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--color-primary-peach)] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          <div className="absolute top-1/3 right-10 w-72 h-72 bg-[var(--color-primary-beige)] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-[var(--color-primary-ivory)] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        </>
      )}

      <div className={`container mx-auto px-6 relative z-10 text-center ${settings.hero_banner_url ? "text-white" : ""}`}>
        <span className={`tracking-[0.2em] text-sm md:text-base uppercase mb-6 block font-medium ${settings.hero_banner_url ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
          {settings.hero_badge}
        </span>

        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight max-w-4xl mx-auto ${settings.hero_banner_url ? "text-white" : "text-[var(--color-text-main)]"}`}>
          {settings.hero_title.includes(" in ") ? (
            <>
              {settings.hero_title.split(" in ")[0]} in{" "}
              <span className={`italic ${settings.hero_banner_url ? "text-amber-200" : "text-[var(--color-text-light)]"}`}>
                {settings.hero_title.split(" in ")[1]}
              </span>
            </>
          ) : settings.hero_title}
        </h1>

        <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed ${settings.hero_banner_url ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
          {settings.hero_subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <Link
            href="/shop"
            className={`group relative px-8 py-4 overflow-hidden w-full sm:w-auto flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 ${
              settings.hero_banner_url
                ? "bg-white text-[var(--color-text-main)] hover:bg-[var(--color-primary-gold)] hover:text-white"
                : "bg-[var(--color-text-main)] text-white"
            }`}
          >
            <span className="relative z-10">{settings.hero_cta_label}</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            {!settings.hero_banner_url && (
              <div className="absolute inset-0 bg-[var(--color-primary-gold)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            )}
          </Link>

          <Link
            href="/collections"
            className={`px-8 py-4 transition-colors duration-300 w-full sm:w-auto font-medium tracking-wide ${
              settings.hero_banner_url
                ? "border border-white/60 text-white hover:bg-white/20"
                : "border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white"
            }`}
          >
            {settings.hero_cta2_label}
          </Link>
        </div>
      </div>
    </div>
  );
}

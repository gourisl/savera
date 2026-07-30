import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Droplets, ShieldAlert, Sun, Package } from "lucide-react";

export default function CareInstructionsPage() {
  const tips = [
    {
      icon: Droplets,
      title: "Keep Away From Water & Perfumes",
      text: "While our anti-tarnish pieces feature high-grade protection, avoiding direct exposure to harsh perfumes, hairsprays, body lotions, and saltwater will keep your jewellery sparkling longer.",
    },
    {
      icon: Sun,
      title: "Store in Air-tight Pouches",
      text: "Always store each piece individually in the velvet zip pouch or box provided with your Savera purchase to prevent scratching and oxidation.",
    },
    {
      icon: Sparkles,
      title: "Clean Softly After Wear",
      text: "Gently wipe your jewellery with a clean, soft micro-fibre cloth after wearing to remove skin oils, sweat, and environmental residue.",
    },
    {
      icon: ShieldAlert,
      title: "Remove Before Swimming & Sleep",
      text: "Take off your delicate rings, chains, and hair accessories before going to bed, exercising, or entering pools and saunas.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary-gold)] font-bold mb-2 block">
            Jewellery Care Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            How to Preserve Your Brilliance
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] max-w-lg mx-auto">
            Simple care practices to ensure your Savera anti-tarnish and fine jewellery stays as luminous as the day you unboxed it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-blush)] text-[var(--color-primary-gold)] flex items-center justify-center shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-gray-900 text-lg mb-2">{tip.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-[var(--color-primary-blush)] to-[var(--color-primary-peach)] rounded-2xl p-8 md:p-10 text-center">
          <Package size={32} className="text-[var(--color-primary-gold)] mx-auto mb-3" />
          <h2 className="text-2xl font-serif text-[var(--color-text-main)] mb-2">Signature Savera Packaging</h2>
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto mb-4">
            Every Savera order arrives in an anti-tarnish protective pouch designed specifically for safe long-term storage.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

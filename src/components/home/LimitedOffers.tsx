import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function LimitedOffers() {
  return (
    <section className="py-24 bg-[var(--color-text-main)] text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-96 h-96 border border-white/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white/5 rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Clock size={16} className="text-[var(--color-primary-gold)]" />
              <span className="text-xs font-bold tracking-widest uppercase">Limited Time Only</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
              Monsoon Sale <br />
              <span className="text-[var(--color-primary-gold)]">Up to 40% Off</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Embrace the season with stunning pieces from our curated monsoon collection. Use code <span className="text-[var(--color-primary-gold)] font-bold">MONSOON40</span> at checkout.
            </p>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary-gold)] text-[var(--color-text-main)] font-bold tracking-wide hover:bg-white transition-colors duration-300 group"
            >
              Shop the Sale
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="aspect-[3/4] rounded-t-full overflow-hidden border-4 border-white/10 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
                alt="Monsoon sale jewellery"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

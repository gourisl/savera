import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--color-primary-blush)]">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--color-primary-peach)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-[var(--color-primary-beige)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-[var(--color-primary-ivory)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <span className="text-[var(--color-text-muted)] tracking-[0.2em] text-sm md:text-base uppercase mb-6 block font-medium">
          New Collection 2026
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[var(--color-text-main)] mb-6 leading-tight max-w-4xl mx-auto">
          Elegance in Every <span className="italic text-[var(--color-text-light)]">Detail</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Discover our premium collection of handcrafted, anti-tarnish jewellery designed for the modern muse.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <Link 
            href="/shop" 
            className="group relative px-8 py-4 bg-[var(--color-text-main)] text-white overflow-hidden w-full sm:w-auto flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300"
          >
            <span className="relative z-10">Shop the Collection</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-[var(--color-primary-gold)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          </Link>
          
          <Link 
            href="/collections" 
            className="px-8 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 w-full sm:w-auto font-medium tracking-wide"
          >
            Explore Lookbook
          </Link>
        </div>
      </div>
    </div>
  );
}

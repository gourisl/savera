import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Lumina Pearl Necklace",
    price: "₹3,499",
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Aura Gold Hoops",
    price: "₹1,899",
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Celestial Diamond Ring",
    price: "₹5,999",
    category: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Eternity Tennis Bracelet",
    price: "₹4,299",
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop", 
    // placeholder image reuse, we'll configure cloudinary later
  }
];

export default function FeaturedCollection() {
  return (
    <section className="py-24 bg-[var(--color-surface-white)]">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
              Curated Elegance
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              Explore our handpicked selection of timeless pieces designed to elevate your everyday style.
            </p>
          </div>
          <Link 
            href="/collections/featured" 
            className="hidden md:flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors group"
          >
            <span className="font-medium tracking-wide uppercase text-sm border-b border-transparent group-hover:border-[var(--color-primary-gold)] pb-1 transition-all">
              View All
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-[var(--color-surface-light)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white text-[var(--color-text-main)] px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 w-[80%] hover:bg-[var(--color-primary-gold)] hover:text-white shadow-lg">
                  Quick Add
                </button>
              </div>
              <div>
                <span className="text-xs tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
                  {product.category}
                </span>
                <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[var(--color-text-muted)] font-medium">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/collections/featured" 
            className="inline-flex items-center gap-2 text-[var(--color-text-main)] font-medium tracking-wide uppercase text-sm border-b border-[var(--color-text-main)] pb-1"
          >
            View All Collection <ArrowRight size={16} />
          </Link>
        </div>
        
      </div>
    </section>
  );
}

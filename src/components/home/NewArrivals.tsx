import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newArrivals = [
  {
    id: 5,
    name: "Aria Layered Necklace",
    price: "₹3,899",
    image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Bloom Floral Studs",
    price: "₹999",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Eden Charm Bracelet",
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop",
  },
];

export default function NewArrivals() {
  return (
    <section className="py-24 bg-[var(--color-primary-ivory)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Just Dropped
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            New Arrivals
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
            Be the first to discover our latest additions — crafted with the season&apos;s most coveted designs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArrivals.map((product, index) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className={`group cursor-pointer ${index === 0 ? "md:row-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden rounded-sm bg-[var(--color-surface-light)] ${index === 0 ? "aspect-[3/5]" : "aspect-[4/3]"} mb-4`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[var(--color-text-main)] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                  New
                </span>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">
                {product.name}
              </h3>
              <p className="text-[var(--color-text-muted)] font-medium">{product.price}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 font-medium tracking-wide group"
          >
            View All New Arrivals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

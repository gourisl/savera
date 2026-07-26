import Link from "next/link";
import { ArrowRight } from "lucide-react";

const bestSellers = [
  {
    id: 1,
    name: "Aurelia Chain Necklace",
    price: "₹2,799",
    originalPrice: "₹3,999",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Seraphina Drop Earrings",
    price: "₹1,499",
    badge: null,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Luna Crescent Ring",
    price: "₹2,199",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Celeste Pearl Bracelet",
    price: "₹3,299",
    originalPrice: "₹4,499",
    badge: "30% Off",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
  },
];

export default function BestSellers() {
  return (
    <section className="py-24 bg-[var(--color-surface-white)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
              Most Loved
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)]">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/collections/best-sellers"
            className="hidden md:flex items-center gap-2 text-[var(--color-text-main)] hover:text-[var(--color-primary-gold)] transition-colors group mt-4 md:mt-0"
          >
            <span className="font-medium tracking-wide uppercase text-sm border-b border-transparent group-hover:border-[var(--color-primary-gold)] pb-1 transition-all">
              Shop All Best Sellers
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-[var(--color-surface-light)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white text-[var(--color-text-main)] px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 w-[80%] hover:bg-[var(--color-primary-gold)] hover:text-white shadow-lg">
                  Quick Add
                </button>
              </div>
              <div>
                <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-[var(--color-text-main)] font-medium">{product.price}</p>
                  {product.originalPrice && (
                    <p className="text-[var(--color-text-light)] line-through text-sm">{product.originalPrice}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

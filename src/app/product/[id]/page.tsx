import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/product/AddToCart";

export default function ProductPage({ params }: { params: { id: string } }) {
  // Mock Data
  const product = {
    id: params.id,
    name: "Lumina Pearl Necklace",
    price: "₹3,499",
    originalPrice: "₹4,999",
    discount: "30% OFF",
    description: "The Lumina Pearl Necklace is a testament to timeless elegance. Featuring a lustrous freshwater pearl suspended from a delicate 18k gold-plated chain. Perfect for layering or wearing on its own as a subtle statement.",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
    ],
    specifications: [
      { label: "Material", value: "18k Gold Plated Brass" },
      { label: "Gemstone", value: "Freshwater Pearl" },
      { label: "Chain Length", value: "16 inches + 2 inch extender" },
      { label: "Closure", value: "Lobster Clasp" },
    ],
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-[var(--color-text-light)] mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--color-text-main)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--color-text-main)] transition-colors">Shop</Link>
          <span>/</span>
          <Link href="/collections/necklaces" className="hover:text-[var(--color-text-main)] transition-colors">Necklaces</Link>
          <span>/</span>
          <span className="text-[var(--color-text-main)]">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Product Gallery */}
          <div className="flex-1 flex gap-4 md:gap-6 flex-col-reverse md:flex-row">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0">
              {product.images.map((img, i) => (
                <button key={i} className={`aspect-[3/4] rounded-sm overflow-hidden border-2 ${i === 0 ? 'border-[var(--color-primary-gold)]' : 'border-transparent'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] bg-[var(--color-surface-light)] rounded-sm overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm z-10">
                {product.discount}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 md:py-6">
            <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)] mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[var(--color-primary-blush)]">
              <span className="text-2xl font-medium text-[var(--color-text-main)]">{product.price}</span>
              <span className="text-lg text-[var(--color-text-light)] line-through">{product.originalPrice}</span>
            </div>
            
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              {product.description}
            </p>

            <AddToCart 
              product={{
                id: product.id,
                name: product.name,
                price: parseInt(product.price.replace(/[^0-9]/g, '')), // Basic mock parsing, to be replaced by real DB price
                image: product.images[0],
                stock: product.stock
              }} 
            />

            <div className="flex gap-4 mb-10 -mt-6">
              <button className="w-14 shrink-0 flex items-center justify-center border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)] transition-colors py-4">
                <Heart size={20} />
              </button>
              <button className="w-14 shrink-0 flex items-center justify-center border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)] transition-colors py-4">
                <Share2 size={20} />
              </button>
            </div>

            {/* Features & Policies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-text-muted)] py-6 border-y border-[var(--color-primary-blush)]">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[var(--color-primary-gold)]" />
                <span>Anti-Tarnish Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-[var(--color-primary-gold)]" />
                <span>Free Shipping over ₹1999</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-[var(--color-primary-gold)]" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>
            
            {/* Specs */}
            <div className="mt-8">
              <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-4">Specifications</h3>
              <ul className="space-y-3 text-sm">
                {product.specifications.map((spec, i) => (
                  <li key={i} className="flex border-b border-dashed border-[var(--color-primary-blush)] pb-2">
                    <span className="w-1/3 text-[var(--color-text-muted)] font-medium">{spec.label}</span>
                    <span className="w-2/3 text-[var(--color-text-main)]">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

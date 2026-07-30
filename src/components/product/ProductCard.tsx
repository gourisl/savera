"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const PLACEHOLDER = "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number | string;
    original_price?: number | string | null;
    discount_percent?: number | null;
    images?: string[] | null;
    categories?: { name: string } | null;
    is_new?: boolean | null;
    is_bestseller?: boolean | null;
    stock?: number;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const image =
    product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER;

  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const originalPrice = product.original_price
    ? typeof product.original_price === "string"
      ? parseFloat(product.original_price)
      : product.original_price
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price,
      image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted(!wishlisted);
    const saved = localStorage.getItem("savera_wishlist");
    const list = saved ? JSON.parse(saved) : [];
    if (!wishlisted) {
      localStorage.setItem("savera_wishlist", JSON.stringify([...list, product]));
    } else {
      localStorage.setItem(
        "savera_wishlist",
        JSON.stringify(list.filter((item: any) => item.id !== product.id))
      );
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-[var(--color-surface-light)]">
        {/* Badges */}
        {product.discount_percent && product.discount_percent > 0 ? (
          <span className="absolute top-3 left-3 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm shadow-sm">
            {product.discount_percent}% OFF
          </span>
        ) : product.is_new ? (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--color-text-main)] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm">
            New
          </span>
        ) : product.is_bestseller ? (
          <span className="absolute top-3 left-3 bg-amber-100 text-amber-800 text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider z-10 rounded-sm">
            Best Seller
          </span>
        ) : null}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all shadow-sm ${
            wishlisted
              ? "bg-red-50 text-red-500"
              : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100"
          }`}
          title="Save to wishlist"
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick Add */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-[var(--color-text-main)] text-white hover:bg-[var(--color-primary-gold)]"
          } transition-colors`}
        >
          {added ? (
            "✓ Added to Cart"
          ) : (
            <>
              <ShoppingBag size={13} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <div>
        <span className="text-[10px] tracking-widest text-[var(--color-text-light)] uppercase mb-1 block">
          {product.categories?.name || "Jewellery"}
        </span>
        <h3 className="text-base font-serif text-[var(--color-text-main)] mb-1.5 group-hover:text-[var(--color-primary-gold)] transition-colors leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[var(--color-text-main)]">
            ₹{price.toLocaleString()}
          </p>
          {originalPrice && originalPrice > price && (
            <p className="text-xs text-[var(--color-text-light)] line-through">
              ₹{originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

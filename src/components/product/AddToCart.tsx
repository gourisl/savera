"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type AddToCartProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
};

export default function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-[var(--color-text-main)]">Quantity</span>
          <span className="text-[var(--color-text-light)]">Only {product.stock} left in stock</span>
        </div>
        <div className="flex items-center border border-[var(--color-text-light)] w-32 rounded-sm">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex-1 py-3 hover:bg-[var(--color-surface-light)] transition-colors"
          >
            -
          </button>
          <span className="flex-1 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex-1 py-3 hover:bg-[var(--color-surface-light)] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-[var(--color-text-main)] text-white py-4 font-medium tracking-wide hover:bg-[var(--color-primary-gold)] transition-colors shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

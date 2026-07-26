"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    review: "Absolutely stunning! The Lumina necklace exceeded my expectations. The anti-tarnish quality is real — I wear it daily and it still shines beautifully.",
    product: "Lumina Pearl Necklace",
    date: "2 weeks ago",
  },
  {
    name: "Ananya Patel",
    location: "Bangalore",
    rating: 5,
    review: "Savera has become my go-to for jewellery. The packaging felt so premium, and the earrings are exactly as pictured. Will definitely be ordering again!",
    product: "Aura Gold Hoops",
    date: "1 month ago",
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad",
    rating: 4,
    review: "Gorgeous bracelet! It's delicate yet durable, perfect for everyday wear. The customer service team was incredibly responsive and helpful.",
    product: "Eternity Tennis Bracelet",
    date: "3 weeks ago",
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-24 bg-[var(--color-primary-beige)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            Love Letters
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)] mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-[var(--color-primary-gold)] text-[var(--color-primary-gold)]" />
            ))}
            <span className="ml-2 text-sm text-[var(--color-text-muted)] font-medium">
              4.9 / 5 based on 2,400+ reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-primary-blush)] hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[var(--color-primary-gold)] text-[var(--color-primary-gold)]" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-gray-200" />
                ))}
              </div>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6 italic">
                &ldquo;{review.review}&rdquo;
              </p>
              <div className="border-t border-[var(--color-primary-blush)] pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-main)]">{review.name}</p>
                  <p className="text-xs text-[var(--color-text-light)]">{review.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-primary-gold)] font-medium">{review.product}</p>
                  <p className="text-xs text-[var(--color-text-light)]">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

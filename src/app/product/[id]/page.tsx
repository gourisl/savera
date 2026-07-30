"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Share2, Shield, Truck, RotateCcw, Star, Check, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/product/AddToCart";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { user } = useAuth();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [id]);

  async function fetchProductDetails() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data);
      } else {
        // Fallback default mock object if non-UUID params passed
        setProduct({
          id: id,
          name: "Lumina Pearl Necklace",
          price: 3499,
          original_price: 4999,
          discount_percent: 30,
          description: "The Lumina Pearl Necklace is a testament to timeless elegance. Featuring a lustrous freshwater pearl suspended from a delicate 18k gold-plated chain. Perfect for layering or wearing on its own as a subtle statement.",
          stock: 12,
          material: "18k Gold Plated Brass",
          colour: "Champagne Gold",
          weight: "12 grams",
          care_instructions: "Keep away from moisture, perfumes, and direct heat.",
          images: [
            "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
          ],
          categories: { name: "Necklaces" }
        });
      }
    } catch (err) {
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });
      if (data) setReviews(data);
    } catch (e) {
      console.error("Reviews error:", e);
    }
  }

  const handleToggleWishlist = async () => {
    setIsWishlisted(!isWishlisted);
    const saved = localStorage.getItem("savera_wishlist");
    let currentList = saved ? JSON.parse(saved) : [];

    if (!isWishlisted) {
      currentList.push(product);
      if (user) {
        await supabase.from("wishlist").insert({ user_id: user.id, product_id: product.id });
      }
    } else {
      currentList = currentList.filter((item: any) => item.id !== product.id);
      if (user) {
        await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product.id);
      }
    }
    localStorage.setItem("savera_wishlist", JSON.stringify(currentList));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !reviewerName.trim()) return;
    setSubmittingReview(true);
    setReviewMsg("");

    try {
      const payload = {
        product_id: product.id,
        user_id: user?.id || null,
        user_name: reviewerName,
        rating: newRating,
        comment: newComment,
        is_verified_buyer: !!user,
        is_approved: true,
      };

      const { error } = await supabase.from("reviews").insert(payload);
      if (error) throw error;

      setReviewMsg("Thank you! Your review has been submitted.");
      setNewComment("");
      fetchReviews();
    } catch (err: any) {
      alert("Error submitting review: " + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24 justify-center items-center">
        <Navbar />
        <div className="flex items-center gap-3 text-gray-500 py-20">
          <Loader2 size={24} className="animate-spin text-[var(--color-primary-gold)]" />
          <span>Loading luxury piece details...</span>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-serif mb-4">Product Not Found</h2>
          <Link href="/shop" className="text-[var(--color-primary-gold)] font-medium hover:underline">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=800&auto=format&fit=crop"];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-surface-white)] pt-24">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--color-text-main)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--color-text-main)] transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/collections/${product.categories?.name?.toLowerCase() || 'jewellery'}`} className="hover:text-[var(--color-text-main)] transition-colors">
            {product.categories?.name || 'Jewellery'}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-main)] font-semibold">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-16">
          {/* Gallery */}
          <div className="flex-1 flex gap-4 md:gap-6 flex-col-reverse md:flex-row">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === i ? "border-[var(--color-primary-gold)] shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] bg-[var(--color-surface-light)] rounded-2xl overflow-hidden relative shadow-lg">
              {product.discount_percent > 0 && (
                <span className="absolute top-4 left-4 bg-[var(--color-primary-peach)] text-[var(--color-text-main)] text-xs font-bold px-3.5 py-1.5 uppercase tracking-wider rounded-md z-10 shadow-sm">
                  {product.discount_percent}% OFF
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 md:py-4">
            <span className="text-xs uppercase tracking-widest text-[var(--color-primary-gold)] font-bold mb-2 block">
              {product.categories?.name || 'Savera Exclusive'}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)] mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">({reviews.length} Customer Reviews)</span>
            </div>

            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[var(--color-primary-blush)]">
              <span className="text-3xl font-serif font-bold text-[var(--color-text-main)]">₹{product.price}</span>
              {product.original_price && (
                <span className="text-lg text-[var(--color-text-light)] line-through">₹{product.original_price}</span>
              )}
            </div>

            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                price: typeof product.price === "number" ? product.price : parseFloat(product.price),
                image: images[0],
                stock: product.stock || 10,
              }}
            />

            <div className="flex gap-4 mb-10 -mt-6">
              <button
                onClick={handleToggleWishlist}
                className={`w-14 shrink-0 flex items-center justify-center border rounded-lg transition-colors py-4 ${
                  isWishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)]"
                }`}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>

              <button
                onClick={handleShare}
                className="w-14 shrink-0 flex items-center justify-center border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-light)] transition-colors py-4 rounded-lg relative"
                title="Share"
              >
                {copied ? <Check size={20} className="text-emerald-600" /> : <Share2 size={20} />}
                {copied && (
                  <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded shadow">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--color-text-muted)] py-6 border-y border-[var(--color-primary-blush)]">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[var(--color-primary-gold)]" />
                <span>Anti-Tarnish Lifetime Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-[var(--color-primary-gold)]" />
                <span>Free Insured Delivery over ₹1999</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-[var(--color-primary-gold)]" />
                <span>7-Day Easy Returns Policy</span>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="mt-8">
              <h3 className="text-base font-serif text-[var(--color-text-main)] mb-4 font-semibold">Specifications</h3>
              <ul className="space-y-2.5 text-xs">
                {product.material && (
                  <li className="flex border-b border-dashed border-[var(--color-primary-blush)] pb-2">
                    <span className="w-1/3 text-[var(--color-text-muted)] font-semibold uppercase">Material</span>
                    <span className="w-2/3 text-[var(--color-text-main)]">{product.material}</span>
                  </li>
                )}
                {product.colour && (
                  <li className="flex border-b border-dashed border-[var(--color-primary-blush)] pb-2">
                    <span className="w-1/3 text-[var(--color-text-muted)] font-semibold uppercase">Colour</span>
                    <span className="w-2/3 text-[var(--color-text-main)]">{product.colour}</span>
                  </li>
                )}
                {product.weight && (
                  <li className="flex border-b border-dashed border-[var(--color-primary-blush)] pb-2">
                    <span className="w-1/3 text-[var(--color-text-muted)] font-semibold uppercase">Weight</span>
                    <span className="w-2/3 text-[var(--color-text-main)]">{product.weight}</span>
                  </li>
                )}
                <li className="flex border-b border-dashed border-[var(--color-primary-blush)] pb-2">
                  <span className="w-1/3 text-[var(--color-text-muted)] font-semibold uppercase">Care Instructions</span>
                  <span className="w-2/3 text-[var(--color-text-main)]">{product.care_instructions || "Avoid moisture & perfume."}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-16 pt-12 border-t border-[var(--color-primary-blush)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center text-[var(--color-text-main)] mb-2">Verified Customer Reviews</h2>
            <p className="text-center text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-10">
              Real experiences from jewellery lovers
            </p>

            {/* Reviews List */}
            <div className="space-y-6 mb-12">
              {reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 text-sm">
                  Be the first to review this handcrafted piece!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-gray-900">{rev.user_name}</span>
                        {rev.is_verified_buyer && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= rev.rating ? "currentColor" : "none"} className={s <= rev.rating ? "text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">&quot;{rev.comment}&quot;</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-serif text-[var(--color-text-main)] mb-4">Write a Review</h3>

              {reviewMsg && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
                  {reviewMsg}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                      placeholder="Ananya Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Rating *</label>
                    <div className="flex items-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star size={22} fill={s <= newRating ? "currentColor" : "none"} className={s <= newRating ? "text-amber-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Your Review *</label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                    placeholder="Share your experience with the craftsmanship, packaging, and design..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[var(--color-text-main)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingReview ? <Loader2 size={16} className="animate-spin" /> : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

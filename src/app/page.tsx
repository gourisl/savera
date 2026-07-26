import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import LimitedOffers from "@/components/home/LimitedOffers";
import InstagramFeed from "@/components/home/InstagramFeed";
import FAQ from "@/components/home/FAQ";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero */}
        <Hero />
        
        {/* Shop by Category */}
        <section className="py-20 bg-[var(--color-primary-blush)]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)] mb-4">Shop by Category</h2>
              <p className="text-[var(--color-text-muted)]">Discover pieces that speak to your personal style</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=300&auto=format&fit=crop' },
                { name: 'Earrings', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=300&auto=format&fit=crop' },
                { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=300&auto=format&fit=crop' },
                { name: 'Rings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop' },
              ].map((category) => (
                <Link href={`/collections/${category.name.toLowerCase()}`} key={category.name} className="group cursor-pointer text-center">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 bg-white mx-auto w-3/4 shadow-sm border border-[var(--color-primary-peach)] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md group-hover:border-[var(--color-primary-gold)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={category.img} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-medium tracking-wide uppercase text-[var(--color-text-main)] group-hover:text-[var(--color-primary-gold)] transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <FeaturedCollection />

        {/* Best Sellers */}
        <BestSellers />

        {/* New Arrivals */}
        <NewArrivals />

        {/* Limited Offers */}
        <LimitedOffers />
        
        {/* About Brand */}
        <section className="py-24 bg-[var(--color-primary-beige)] relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 w-full">
                <div className="aspect-[4/5] relative rounded-t-full overflow-hidden border-4 border-white shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" 
                    alt="Woman wearing luxury jewellery"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-4 block">
                  The Savera Story
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)] mb-6 leading-tight">
                  Redefining Modern <br/>Luxury Jewellery
                </h2>
                <p className="text-[var(--color-text-muted)] text-lg mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                  Inspired by the delicate balance of contemporary design and timeless elegance, Savera brings you a curated collection of anti-tarnish and premium Korean jewellery. Every piece is carefully selected to ensure it not only captures the eye but withstands the test of time.
                </p>
                <Link href="/about" className="px-8 py-4 border border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-white transition-colors duration-300 font-medium tracking-wide inline-block">
                  Read Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Instagram Feed */}
        <InstagramFeed />

        {/* FAQ */}
        <FAQ />
        
      </div>
      
      <Footer />
    </main>
  );
}

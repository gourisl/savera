import { Shield, Gem, Truck, RotateCcw, Sparkles, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: <Shield size={28} />,
    title: "Anti-Tarnish Guarantee",
    description: "Every piece is crafted with anti-tarnish coating, ensuring lasting brilliance that withstands daily wear.",
  },
  {
    icon: <Gem size={28} />,
    title: "Premium Quality",
    description: "Hand-selected materials and meticulous craftsmanship define our commitment to luxury you can feel.",
  },
  {
    icon: <Truck size={28} />,
    title: "Pan-India Shipping",
    description: "Fast, insured delivery across India. Track your order every step of the way.",
  },
  {
    icon: <RotateCcw size={28} />,
    title: "7-Day Easy Returns",
    description: "Not in love? Return with ease within 7 days — no questions asked.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Curated Collections",
    description: "Thoughtfully curated collections for every occasion, mood, and style statement.",
  },
  {
    icon: <HeartHandshake size={28} />,
    title: "Trusted by 10,000+",
    description: "Join thousands of happy customers who trust Savera for their everyday elegance.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[var(--color-surface-white)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            The Savera Promise
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-main)]">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group p-8 rounded-2xl hover:bg-[var(--color-primary-blush)] transition-colors duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-[var(--color-primary-gold)] bg-[var(--color-primary-blush)] rounded-full group-hover:bg-white group-hover:shadow-md transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-serif text-[var(--color-text-main)] mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
